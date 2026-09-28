/* ==========================================================================
   VELORA HOME - ADMIN PANEL JAVASCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    VeloraAdmin.init();
});

const VeloraAdmin = {
    products: [],
    orders: [],
    messages: [],
    editingProductId: null,

    async init() {
        this.bindEvents();
        await this.refreshAllData();
        this.switchSection('dashboard');
    },

    async refreshAllData() {
        await Promise.all([
            this.loadProducts(),
            this.loadOrders(),
            this.loadMessages()
        ]);
        this.renderMetrics();
    },

    async loadProducts() {
        try {
            this.products = await window.veloraDB.getProducts();
            this.renderProductsTable();
        } catch (e) {
            console.error("Admin load products error:", e);
        }
    },

    async loadOrders() {
        try {
            this.orders = await window.veloraDB.getOrders();
            this.renderOrdersTable();
        } catch (e) {
            console.error("Admin load orders error:", e);
        }
    },

    async loadMessages() {
        try {
            this.messages = await window.veloraDB.getMessages();
            this.renderMessagesTable();
        } catch (e) {
            console.error("Admin load messages error:", e);
        }
    },

    renderMetrics() {
        const totalRevenue = this.orders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
        const totalOrdersCount = this.orders.length;
        const totalProductsCount = this.products.length;
        const pendingOrdersCount = this.orders.filter(o => (o.status || '').toLowerCase() === 'pending' || (o.status || '').toLowerCase() === 'processing').length;

        document.getElementById('metricRevenue').textContent = `$${totalRevenue.toFixed(2)}`;
        document.getElementById('metricOrders').textContent = totalOrdersCount;
        document.getElementById('metricProducts').textContent = totalProductsCount;
        document.getElementById('metricPending').textContent = pendingOrdersCount;
    },

    switchSection(sectionId) {
        document.querySelectorAll('.admin-section').forEach(sec => sec.style.display = 'none');
        document.querySelectorAll('.menu-item').forEach(item => item.classList.remove('active'));

        const targetSec = document.getElementById(`sec-${sectionId}`);
        const targetNav = document.querySelector(`.menu-item[data-section="${sectionId}"]`);

        if (targetSec) targetSec.style.display = 'block';
        if (targetNav) targetNav.classList.add('active');

        // Refresh recent dashboard view if switching to dashboard
        if (sectionId === 'dashboard') {
            this.renderRecentOrdersDashboard();
        }
    },

    renderRecentOrdersDashboard() {
        const tbody = document.getElementById('recentOrdersTableBody');
        if (!tbody) return;

        const recent = this.orders.slice(0, 5);
        if (recent.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:2rem; color:var(--admin-text-muted);">No orders recorded yet.</td></tr>`;
            return;
        }

        tbody.innerHTML = recent.map(o => `
            <tr>
                <td><strong>#${o.id.substring(0, 8)}</strong></td>
                <td>${o.customer_name}</td>
                <td>$${Number(o.total_amount).toFixed(2)}</td>
                <td><span class="status-pill ${(o.status || 'Pending').toLowerCase()}">${o.status || 'Pending'}</span></td>
                <td>${new Date(o.created_at).toLocaleDateString()}</td>
            </tr>
        `).join('');
    },

    /* PRODUCTS TABLE & CRUD */
    renderProductsTable() {
        const tbody = document.getElementById('productsTableBody');
        if (!tbody) return;

        if (this.products.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:2rem;">No products found. Add your first item!</td></tr>`;
            return;
        }

        tbody.innerHTML = this.products.map(p => `
            <tr>
                <td>
                    <div style="display:flex; align-items:center; gap:0.75rem;">
                        <img src="${p.image_url}" class="table-img" alt="${p.title}" onError="this.src='https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?auto=format&fit=crop&w=800&q=80'">
                        <div>
                            <strong style="display:block; font-size:0.95rem;">${p.title}</strong>
                            <span style="font-size:0.75rem; color:var(--admin-text-muted);">${p.material || 'Standard Decor'}</span>
                        </div>
                    </div>
                </td>
                <td><span style="background:#F1F5F9; padding:0.25rem 0.6rem; border-radius:4px; font-size:0.8rem; font-weight:600;">${p.category}</span></td>
                <td>
                    <strong>$${Number(p.sale_price || p.price).toFixed(2)}</strong>
                    ${p.sale_price ? `<br><small style="text-decoration:line-through; color:var(--admin-text-muted);">$${Number(p.price).toFixed(2)}</small>` : ''}
                </td>
                <td>
                    <span style="color: ${p.stock < 5 ? 'var(--color-danger)' : 'inherit'}; font-weight:600;">
                        ${p.stock} in stock
                    </span>
                </td>
                <td>
                    ${p.is_featured ? `<span style="color:#D97706; font-size:0.75rem; font-weight:700;"><i class="fas fa-star"></i> Featured</span>` : '<span style="color:#94A3B8; font-size:0.75rem;">Standard</span>'}
                </td>
                <td>
                    <button class="btn btn-sm btn-outline" onclick="VeloraAdmin.openEditProductModal('${p.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline" style="color:var(--color-danger); border-color:var(--color-danger);" onclick="VeloraAdmin.deleteProduct('${p.id}')" title="Delete">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    },

    openAddProductModal() {
        this.editingProductId = null;
        document.getElementById('productModalTitle').textContent = "Add New Product";
        document.getElementById('productForm').reset();
        document.getElementById('prodImgPreview').src = "https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?auto=format&fit=crop&w=800&q=80";
        this.openModal('productModal');
    },

    openEditProductModal(id) {
        const product = this.products.find(p => p.id === id);
        if (!product) return;

        this.editingProductId = id;
        document.getElementById('productModalTitle').textContent = "Edit Decor Product";
        
        document.getElementById('prodTitle').value = product.title || '';
        document.getElementById('prodCategory').value = product.category || 'Ceramics';
        document.getElementById('prodPrice').value = product.price || '';
        document.getElementById('prodSalePrice').value = product.sale_price || '';
        document.getElementById('prodStock').value = product.stock || 10;
        document.getElementById('prodImageUrl').value = product.image_url || '';
        document.getElementById('prodDimensions').value = product.dimensions || '';
        document.getElementById('prodMaterial').value = product.material || '';
        document.getElementById('prodFeatured').checked = !!product.is_featured;
        document.getElementById('prodDescription').value = product.description || '';

        document.getElementById('prodImgPreview').src = product.image_url || "https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?auto=format&fit=crop&w=800&q=80";

        this.openModal('productModal');
    },

    async saveProduct(e) {
        e.preventDefault();

        const payload = {
            title: document.getElementById('prodTitle').value.trim(),
            category: document.getElementById('prodCategory').value,
            price: parseFloat(document.getElementById('prodPrice').value),
            sale_price: document.getElementById('prodSalePrice').value ? parseFloat(document.getElementById('prodSalePrice').value) : null,
            stock: parseInt(document.getElementById('prodStock').value, 10),
            image_url: document.getElementById('prodImageUrl').value.trim(),
            dimensions: document.getElementById('prodDimensions').value.trim(),
            material: document.getElementById('prodMaterial').value.trim(),
            is_featured: document.getElementById('prodFeatured').checked,
            description: document.getElementById('prodDescription').value.trim()
        };

        if (this.editingProductId) {
            await window.veloraDB.updateProduct(this.editingProductId, payload);
            this.showToast('Product updated successfully!');
        } else {
            await window.veloraDB.addProduct(payload);
            this.showToast('New product created!');
        }

        this.closeModal('productModal');
        await this.refreshAllData();
    },

    async deleteProduct(id) {
        if (confirm("Are you sure you want to delete this product?")) {
            await window.veloraDB.deleteProduct(id);
            this.showToast('Product removed');
            await this.refreshAllData();
        }
    },

    /* ORDERS TABLE & STATUS CHANGE */
    renderOrdersTable() {
        const tbody = document.getElementById('ordersTableBody');
        if (!tbody) return;

        if (this.orders.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:2rem;">No customer orders placed yet.</td></tr>`;
            return;
        }

        tbody.innerHTML = this.orders.map(o => `
            <tr>
                <td><strong>#${o.id.substring(0, 8)}</strong></td>
                <td>
                    <strong>${o.customer_name}</strong><br>
                    <small style="color:var(--admin-text-muted);">${o.customer_email}</small>
                </td>
                <td><small style="max-width:180px; display:inline-block;">${o.shipping_address}</small></td>
                <td><strong>$${Number(o.total_amount).toFixed(2)}</strong></td>
                <td>
                    <select class="form-control" style="padding:0.25rem 0.5rem; font-size:0.8rem; font-weight:600;" onchange="VeloraAdmin.changeOrderStatus('${o.id}', this.value)">
                        <option value="Pending" ${o.status === 'Pending' ? 'selected' : ''}>Pending</option>
                        <option value="Processing" ${o.status === 'Processing' ? 'selected' : ''}>Processing</option>
                        <option value="Shipped" ${o.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
                        <option value="Delivered" ${o.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                        <option value="Cancelled" ${o.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                </td>
                <td>${new Date(o.created_at).toLocaleDateString()}</td>
                <td>
                    <button class="btn btn-sm btn-outline" onclick="VeloraAdmin.viewOrderDetails('${o.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    },

    async changeOrderStatus(id, newStatus) {
        await window.veloraDB.updateOrderStatus(id, newStatus);
        this.showToast(`Order #${id.substring(0,6)} updated to "${newStatus}"`);
        await this.refreshAllData();
    },

    viewOrderDetails(id) {
        const order = this.orders.find(o => o.id === id);
        if (!order) return;

        const itemsHtml = order.items && order.items.length > 0
            ? order.items.map(i => `<li>${i.product_title} x${i.quantity} ($${Number(i.price).toFixed(2)})</li>`).join('')
            : '<li>Item list recorded</li>';

        alert(`ORDER DETAILS #${order.id}\nCustomer: ${order.customer_name} (${order.customer_email})\nShipping Address: ${order.shipping_address}\nTotal Amount: $${order.total_amount}\nStatus: ${order.status}`);
    },

    /* MESSAGES TABLE */
    renderMessagesTable() {
        const tbody = document.getElementById('messagesTableBody');
        if (!tbody) return;

        if (this.messages.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:2rem;">No customer messages received yet.</td></tr>`;
            return;
        }

        tbody.innerHTML = this.messages.map(m => `
            <tr>
                <td><strong>${m.name}</strong></td>
                <td>${m.email}</td>
                <td><strong>${m.subject || 'Inquiry'}</strong></td>
                <td><small style="color:var(--admin-text-muted);">${m.message}</small></td>
                <td>${new Date(m.created_at).toLocaleDateString()}</td>
            </tr>
        `).join('');
    },

    bindEvents() {
        // Sidebar navigation switching
        document.querySelectorAll('.menu-item[data-section]').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const sec = item.getAttribute('data-section');
                this.switchSection(sec);
            });
        });

        // Image URL Preview binder
        const urlInput = document.getElementById('prodImageUrl');
        if (urlInput) {
            urlInput.addEventListener('input', (e) => {
                const img = document.getElementById('prodImgPreview');
                if (img) img.src = e.target.value.trim() || 'https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?auto=format&fit=crop&w=800&q=80';
            });
        }

        // Product Form Submit
        const prodForm = document.getElementById('productForm');
        if (prodForm) {
            prodForm.addEventListener('submit', (e) => this.saveProduct(e));
        }

        // Supabase Config Form Submit
        const supabaseForm = document.getElementById('supabaseConfigFormAdmin');
        if (supabaseForm) {
            supabaseForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const url = document.getElementById('adminSupabaseUrl').value;
                const key = document.getElementById('adminSupabaseKey').value;
                const success = await window.veloraDB.saveConfig(url, key);
                this.closeModal('supabaseModalAdmin');
                if (success) {
                    this.showToast('Supabase connected!');
                    await this.refreshAllData();
                } else {
                    this.showToast('Saved (Running in fallback mode)');
                }
            });
        }
    },

    openSupabaseModalAdmin() {
        const config = window.veloraDB.config;
        document.getElementById('adminSupabaseUrl').value = config.url || '';
        document.getElementById('adminSupabaseKey').value = config.key || '';
        this.openModal('supabaseModalAdmin');
    },

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.add('active');
    },

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.remove('active');
    },

    showToast(msg) {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i class="fas fa-check-circle" style="color:var(--color-primary)"></i> <span>${msg}</span>`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
};

window.VeloraAdmin = VeloraAdmin;
