/* ==========================================================================
   VELORA HOME - STOREFRONT MAIN JAVASCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    VeloraApp.init();
});

const VeloraApp = {
    products: [],
    cart: [],
    wishlist: [],
    currentCategory: 'all',
    searchQuery: '',
    sortBy: 'default',
    activeQuickViewId: null,

    async init() {
        this.loadCart();
        this.loadWishlist();
        this.bindEvents();
        await this.loadProducts();
        this.updateCartUI();
        this.updateWishlistUI();
    },

    async loadProducts() {
        const grid = document.getElementById('productGrid');
        if (grid) {
            grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 4rem;"><i class="fas fa-spinner fa-spin fa-2x" style="color:var(--color-primary)"></i><p style="margin-top:1rem;">Loading exquisite decor pieces...</p></div>`;
        }

        try {
            this.products = await window.veloraDB.getProducts();
            this.renderProducts();
        } catch (err) {
            console.error("Error loading products:", err);
            if (grid) {
                grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--color-danger);">Failed to load products. Please check connection.</div>`;
            }
        }
    },

    renderProducts() {
        const grid = document.getElementById('productGrid');
        if (!grid) return;

        let filtered = [...this.products];

        // Filter by category
        if (this.currentCategory !== 'all') {
            filtered = filtered.filter(p => p.category.toLowerCase() === this.currentCategory.toLowerCase());
        }

        // Filter by search query
        if (this.searchQuery) {
            const q = this.searchQuery.toLowerCase();
            filtered = filtered.filter(p => p.title.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q)));
        }

        // Sort products
        if (this.sortBy === 'price-low') {
            filtered.sort((a, b) => (a.sale_price || a.price) - (b.sale_price || b.price));
        } else if (this.sortBy === 'price-high') {
            filtered.sort((a, b) => (b.sale_price || b.price) - (a.sale_price || a.price));
        } else if (this.sortBy === 'title-az') {
            filtered.sort((a, b) => a.title.localeCompare(b.title));
        }

        if (filtered.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 5rem 1rem;">
                    <i class="fas fa-search fa-3x" style="color: var(--color-border); margin-bottom: 1rem;"></i>
                    <h3 style="font-size:1.5rem; margin-bottom: 0.5rem;">No items found</h3>
                    <p style="color: var(--color-text-muted);">Try adjusting your category filter or search keywords.</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = filtered.map(p => {
            const isWishlisted = this.wishlist.includes(p.id);
            const currentPrice = p.sale_price ? p.sale_price : p.price;
            const originalPriceDisplay = p.sale_price ? `<span class="original-price">$${Number(p.price).toFixed(2)}</span>` : '';
            const badgeTag = p.sale_price ? `<span class="badge-tag sale">Sale</span>` : (p.is_new ? `<span class="badge-tag">New</span>` : '');

            return `
                <div class="product-card" data-id="${p.id}">
                    <div class="product-media">
                        ${badgeTag}
                        <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" onclick="VeloraApp.toggleWishlist('${p.id}')" title="Wishlist">
                            <i class="${isWishlisted ? 'fas' : 'far'} fa-heart"></i>
                        </button>
                        <img src="${p.image_url}" alt="${p.title}" loading="lazy" onError="this.src='https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?auto=format&fit=crop&w=800&q=80'">
                        <div class="quick-view-overlay">
                            <button class="btn btn-sm btn-primary" onclick="VeloraApp.openQuickView('${p.id}')">
                                <i class="fas fa-eye"></i> Quick View
                            </button>
                        </div>
                    </div>
                    <div class="product-info">
                        <span class="product-category">${p.category}</span>
                        <h3 class="product-title">${p.title}</h3>
                        <div class="product-price-row">
                            <div class="product-price">
                                ${originalPriceDisplay}$${Number(currentPrice).toFixed(2)}
                            </div>
                            <button class="add-cart-btn" onclick="VeloraApp.addToCart('${p.id}')">
                                <i class="fas fa-shopping-bag"></i> Add
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    },

    bindEvents() {
        // Category filtering
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentCategory = e.target.getAttribute('data-category');
                this.renderProducts();
            });
        });

        // Search input
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.trim();
                this.renderProducts();
            });
        }

        // Sort Select
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortBy = e.target.value;
                this.renderProducts();
            });
        }

        // Contact Form Submission
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const name = document.getElementById('contactName').value;
                const email = document.getElementById('contactEmail').value;
                const subject = document.getElementById('contactSubject').value;
                const message = document.getElementById('contactMessage').value;

                try {
                    await window.veloraDB.sendMessage({ name, email, subject, message });
                    this.showToast('Message sent successfully! We will get back to you soon.');
                    contactForm.reset();
                } catch(err) {
                    this.showToast('Failed to send message. Please try again.');
                }
            });
        }

        // Checkout Form Submission
        const checkoutForm = document.getElementById('checkoutForm');
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                if (this.cart.length === 0) {
                    this.showToast('Your cart is empty!');
                    return;
                }

                const name = document.getElementById('custName').value;
                const email = document.getElementById('custEmail').value;
                const address = document.getElementById('custAddress').value;
                const phone = document.getElementById('custPhone').value;

                const subtotal = this.cart.reduce((sum, i) => sum + ((i.sale_price || i.price) * i.quantity), 0);
                
                const orderData = {
                    customer_name: name,
                    customer_email: email,
                    shipping_address: address,
                    phone: phone,
                    total_amount: subtotal
                };

                const btn = checkoutForm.querySelector('button[type="submit"]');
                btn.disabled = true;
                btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Processing Order...`;

                try {
                    const order = await window.veloraDB.createOrder(orderData, this.cart);
                    this.cart = [];
                    this.saveCart();
                    this.updateCartUI();
                    this.closeModal('checkoutModal');
                    checkoutForm.reset();
                    this.showToast(`Order #${order.id} placed successfully! Thank you.`);
                } catch (err) {
                    console.error("Order error:", err);
                    this.showToast('Error placing order. Please try again.');
                } finally {
                    btn.disabled = false;
                    btn.innerHTML = `Confirm Order ($${subtotal.toFixed(2)})`;
                }
            });
        }
    },

    /* CART MANAGEMENT */
    loadCart() {
        try {
            const saved = localStorage.getItem('velora_cart');
            this.cart = saved ? JSON.parse(saved) : [];
        } catch(e) {
            this.cart = [];
        }
    },

    saveCart() {
        localStorage.setItem('velora_cart', JSON.stringify(this.cart));
    },

    addToCart(productId, qty = 1) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const existing = this.cart.find(item => item.id === productId);
        if (existing) {
            existing.quantity += qty;
        } else {
            this.cart.push({ ...product, quantity: qty });
        }

        this.saveCart();
        this.updateCartUI();
        this.showToast(`Added "${product.title}" to your cart`);
    },

    updateCartQuantity(productId, delta) {
        const item = this.cart.find(i => i.id === productId);
        if (item) {
            item.quantity += delta;
            if (item.quantity <= 0) {
                this.cart = this.cart.filter(i => i.id !== productId);
            }
            this.saveCart();
            this.updateCartUI();
        }
    },

    removeFromCart(productId) {
        this.cart = this.cart.filter(i => i.id !== productId);
        this.saveCart();
        this.updateCartUI();
        this.showToast('Item removed from cart');
    },

    updateCartUI() {
        const countElements = document.querySelectorAll('.cart-count');
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        countElements.forEach(el => el.textContent = totalItems);

        const cartBody = document.getElementById('cartDrawerBody');
        const cartTotalEl = document.getElementById('cartDrawerTotal');

        if (!cartBody) return;

        if (this.cart.length === 0) {
            cartBody.innerHTML = `
                <div style="text-align: center; padding: 4rem 1rem; color: var(--color-text-muted);">
                    <i class="fas fa-shopping-bag fa-3x" style="margin-bottom: 1rem; opacity: 0.3;"></i>
                    <p style="font-weight: 500;">Your cart is empty</p>
                    <button class="btn btn-sm btn-outline" style="margin-top: 1rem;" onclick="VeloraApp.toggleCartDrawer(false)">Explore Collection</button>
                </div>
            `;
            if (cartTotalEl) cartTotalEl.textContent = '$0.00';
            return;
        }

        let total = 0;
        cartBody.innerHTML = this.cart.map(item => {
            const price = item.sale_price || item.price;
            const itemTotal = price * item.quantity;
            total += itemTotal;

            return `
                <div class="cart-item">
                    <img src="${item.image_url}" alt="${item.title}">
                    <div class="cart-item-details">
                        <h4>${item.title}</h4>
                        <p>$${Number(price).toFixed(2)}</p>
                        <div class="qty-picker" style="margin-bottom:0; margin-top:0.4rem;">
                            <button class="qty-btn" onclick="VeloraApp.updateCartQuantity('${item.id}', -1)">-</button>
                            <span style="font-size:0.9rem; font-weight:600;">${item.quantity}</span>
                            <button class="qty-btn" onclick="VeloraApp.updateCartQuantity('${item.id}', 1)">+</button>
                        </div>
                    </div>
                    <button style="color: var(--color-text-muted);" onclick="VeloraApp.removeFromCart('${item.id}')">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            `;
        }).join('');

        if (cartTotalEl) cartTotalEl.textContent = `$${total.toFixed(2)}`;
    },

    toggleCartDrawer(open) {
        const drawer = document.getElementById('cartDrawer');
        const overlay = document.getElementById('cartOverlay');
        if (!drawer || !overlay) return;

        if (open === undefined) {
            drawer.classList.toggle('active');
            overlay.classList.toggle('active');
        } else if (open) {
            drawer.classList.add('active');
            overlay.classList.add('active');
        } else {
            drawer.classList.remove('active');
            overlay.classList.remove('active');
        }
    },

    /* WISHLIST MANAGEMENT */
    loadWishlist() {
        try {
            const saved = localStorage.getItem('velora_wishlist');
            this.wishlist = saved ? JSON.parse(saved) : [];
        } catch(e) {
            this.wishlist = [];
        }
    },

    toggleWishlist(productId) {
        if (this.wishlist.includes(productId)) {
            this.wishlist = this.wishlist.filter(id => id !== productId);
            this.showToast('Removed from wishlist');
        } else {
            this.wishlist.push(productId);
            this.showToast('Added to wishlist!');
        }
        localStorage.setItem('velora_wishlist', JSON.stringify(this.wishlist));
        this.updateWishlistUI();
        this.renderProducts();
    },

    updateWishlistUI() {
        const wishlistCount = document.querySelectorAll('.wishlist-count');
        wishlistCount.forEach(el => el.textContent = this.wishlist.length);
    },

    /* QUICK VIEW MODAL */
    openQuickView(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        this.activeQuickViewId = productId;
        const modal = document.getElementById('quickViewModal');
        const content = document.getElementById('quickViewContent');

        if (!modal || !content) return;

        const currentPrice = product.sale_price ? product.sale_price : product.price;
        const originalDisplay = product.sale_price ? `<span style="text-decoration:line-through; font-size:1.1rem; color:var(--color-text-muted); margin-left:0.5rem;">$${Number(product.price).toFixed(2)}</span>` : '';

        content.innerHTML = `
            <div class="quick-view-grid">
                <div>
                    <img class="quick-view-img" src="${product.image_url}" alt="${product.title}">
                </div>
                <div class="quick-view-details">
                    <span class="product-category">${product.category}</span>
                    <h2>${product.title}</h2>
                    <div class="price">$${Number(currentPrice).toFixed(2)} ${originalDisplay}</div>
                    <p class="desc">${product.description || 'Crafted with premium materials to elevate your living space.'}</p>
                    
                    <div class="spec-list">
                        <div><strong>Material:</strong> ${product.material || 'Organic / Sustainable'}</div>
                        <div><strong>Dimensions:</strong> ${product.dimensions || 'Standard'}</div>
                        <div><strong>In Stock:</strong> ${product.stock} units</div>
                    </div>

                    <div style="display:flex; gap:1rem; align-items:center;">
                        <button class="btn btn-accent" style="flex-grow:1;" onclick="VeloraApp.addToCart('${product.id}'); VeloraApp.closeModal('quickViewModal');">
                            <i class="fas fa-shopping-bag"></i> Add to Shopping Bag
                        </button>
                    </div>
                </div>
            </div>
        `;

        this.openModal('quickViewModal');
    },

    /* GENERAL MODAL HELPERS */
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.add('active');
    },

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.remove('active');
    },

    /* SUPABASE CONFIG MODAL */
    openSupabaseModal() {
        const modal = document.getElementById('supabaseConfigModal');
        if (!modal) return;

        const config = window.veloraDB.config;
        document.getElementById('supabaseUrlInput').value = config.url || '';
        document.getElementById('supabaseKeyInput').value = config.key || '';
        this.openModal('supabaseConfigModal');
    },

    async saveSupabaseConfig(e) {
        e.preventDefault();
        const url = document.getElementById('supabaseUrlInput').value;
        const key = document.getElementById('supabaseKeyInput').value;

        const success = await window.veloraDB.saveConfig(url, key);
        this.closeModal('supabaseConfigModal');

        if (success) {
            this.showToast('Connected to Supabase successfully!');
            this.loadProducts();
        } else {
            this.showToast('Supabase configured (or running local fallback mode)');
        }
    },

    /* TOAST SYSTEM */
    showToast(message) {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i class="fas fa-check-circle" style="color:var(--color-primary)"></i> <span>${message}</span>`;

        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3200);
    }
};

window.VeloraApp = VeloraApp;
