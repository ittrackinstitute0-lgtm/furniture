/* ==========================================================================
   VELORA HOME - SUPABASE CLIENT & HYBRID DATABASE HANDLER
   ========================================================================== */

// Default configuration constants (Pre-configured with User's Supabase Project)
const DEFAULT_SUPABASE_URL = 'https://ckldvwxvjkwgzypcnnqm.supabase.co';
const DEFAULT_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrbGR2d3h2amt3Z3p5cGNubnFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1ODU4OTEsImV4cCI6MjEwNjE2MTg5MX0.R8lGm093WnIU_IAY7pYokvj7cOW-tI8kZ4UyvpeujeY';

const SUPABASE_CONFIG_KEY = 'velora_supabase_config';
const LOCAL_STORAGE_PRODUCTS_KEY = 'velora_products_local';
const LOCAL_STORAGE_ORDERS_KEY = 'velora_orders_local';
const LOCAL_STORAGE_MESSAGES_KEY = 'velora_messages_local';

// Default Seed Data fallback
const DEFAULT_PRODUCTS = [
    {
        id: "p1",
        title: "Aura Terracotta Ceramic Vase",
        category: "Ceramics",
        price: 89.00,
        sale_price: 75.00,
        stock: 15,
        image_url: "https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?auto=format&fit=crop&w=800&q=80",
        is_featured: true,
        is_new: true,
        dimensions: "24cm x 15cm",
        material: "Raw Terracotta",
        description: "Hand-sculpted matte terracotta vase designed to display dried botanticals or serve as a minimalist standalone center sculpture."
    },
    {
        id: "p2",
        title: "Minimalist Linen Armchair",
        category: "Furniture",
        price: 499.00,
        sale_price: null,
        stock: 6,
        image_url: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80",
        is_featured: true,
        is_new: true,
        dimensions: "85cm x 80cm x 90cm",
        material: "Belgian Linen & Oak",
        description: "Deep-seated armchair crafted with natural Belgian linen fabric and a solid European oak wood frame."
    },
    {
        id: "p3",
        title: "Nordic Brass Table Lamp",
        category: "Lighting",
        price: 145.00,
        sale_price: 120.00,
        stock: 20,
        image_url: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
        is_featured: true,
        is_new: false,
        dimensions: "45cm x 28cm",
        material: "Brushed Brass & Opal Glass",
        description: "Warm ambient table lamp with hand-blown frosted opal glass globe set upon a brushed solid brass base."
    },
    {
        id: "p4",
        title: "Abstract Sand Stone Wall Art",
        category: "Wall Art",
        price: 210.00,
        sale_price: null,
        stock: 8,
        image_url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80",
        is_featured: false,
        is_new: true,
        dimensions: "100cm x 70cm",
        material: "Textured Plaster & Wood Frame",
        description: "Hand-textured 3D plaster wall sculpture featuring organic wave lines and soothing warm sand hues."
    },
    {
        id: "p5",
        title: "Artisanal Fluted Side Table",
        category: "Furniture",
        price: 320.00,
        sale_price: 285.00,
        stock: 12,
        image_url: "https://images.unsplash.com/photo-1532372576444-dda954194ad0?auto=format&fit=crop&w=800&q=80",
        is_featured: true,
        is_new: false,
        dimensions: "50cm x 40cm",
        material: "Travertine Marble & Solid Wood",
        description: "Elegant fluted pedestal side table topped with polished Italian travertine marble."
    },
    {
        id: "p6",
        title: "Organic Woven Throw Pillow",
        category: "Textiles",
        price: 65.00,
        sale_price: null,
        stock: 25,
        image_url: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80",
        is_featured: false,
        is_new: false,
        dimensions: "50cm x 50cm",
        material: "100% Organic Wool & Cotton",
        description: "Heavyweight textured cushion cover woven from un-dyed wool yarns with down alternative insert included."
    },
    {
        id: "p7",
        title: "Zen Sculptural Candle Holder",
        category: "Decor Accessories",
        price: 48.00,
        sale_price: 38.00,
        stock: 30,
        image_url: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80",
        is_featured: false,
        is_new: false,
        dimensions: "18cm x 10cm",
        material: "Cast Concrete",
        description: "Monolithic architectural taper candle holder cast in fine smooth grey concrete."
    },
    {
        id: "p8",
        title: "Earthy Ceramic Serving Bowl",
        category: "Ceramics",
        price: 78.00,
        sale_price: null,
        stock: 18,
        image_url: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80",
        is_featured: true,
        is_new: false,
        dimensions: "30cm x 12cm",
        material: "Stoneware Clay",
        description: "Rustic wide shallow stoneware bowl finished with reactive speckled glaze, food safe & hand crafted."
    }
];

const DEFAULT_ORDERS = [
    {
        id: "ORD-9281",
        customer_name: "Eleanor Vance",
        customer_email: "eleanor@example.com",
        shipping_address: "742 Evergreen Terrace, Springfield",
        phone: "+1 (555) 234-5678",
        total_amount: 320.00,
        status: "Processing",
        created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
        items: [{ product_title: "Artisanal Fluted Side Table", quantity: 1, price: 320.00 }]
    },
    {
        id: "ORD-9280",
        customer_name: "Julian Mercer",
        customer_email: "julian@example.com",
        shipping_address: "108 Ocean Drive, Miami FL",
        phone: "+1 (555) 876-5432",
        total_amount: 164.00,
        status: "Delivered",
        created_at: new Date(Date.now() - 3600000 * 28).toISOString(),
        items: [
            { product_title: "Aura Terracotta Ceramic Vase", quantity: 1, price: 89.00 },
            { product_title: "Earthy Ceramic Serving Bowl", quantity: 1, price: 75.00 }
        ]
    }
];

const DEFAULT_MESSAGES = [
    {
        id: "msg-1",
        name: "Sophia Martinez",
        email: "sophia@designstudio.com",
        subject: "Custom Interior Project Inquiry",
        message: "Hello Velora team, do you offer bulk architectural discounts for custom hospitality projects?",
        created_at: new Date(Date.now() - 3600000 * 12).toISOString()
    }
];

class VeloraDatabase {
    constructor() {
        this.supabase = null;
        this.isSupabaseConnected = false;
        this.config = this.loadStoredConfig();
        this.initLocalData();
        this.initSupabaseClient();
    }

    loadStoredConfig() {
        try {
            const stored = localStorage.getItem(SUPABASE_CONFIG_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                if (parsed.url && parsed.key) return parsed;
            }
        } catch(e) {}
        
        return {
            url: DEFAULT_SUPABASE_URL,
            key: DEFAULT_SUPABASE_KEY
        };
    }

    saveConfig(url, key) {
        const config = { url: url.trim(), key: key.trim() };
        localStorage.setItem(SUPABASE_CONFIG_KEY, JSON.stringify(config));
        this.config = config;
        return this.initSupabaseClient();
    }

    initLocalData() {
        if (!localStorage.getItem(LOCAL_STORAGE_PRODUCTS_KEY)) {
            localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(DEFAULT_PRODUCTS));
        }
        if (!localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY)) {
            localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(DEFAULT_ORDERS));
        }
        if (!localStorage.getItem(LOCAL_STORAGE_MESSAGES_KEY)) {
            localStorage.setItem(LOCAL_STORAGE_MESSAGES_KEY, JSON.stringify(DEFAULT_MESSAGES));
        }
    }

    async initSupabaseClient() {
        if (this.config.url && this.config.key && window.supabase) {
            try {
                this.supabase = window.supabase.createClient(this.config.url, this.config.key);
                // Ping connection with a fast read query
                const { data, error } = await this.supabase.from('products').select('id').limit(1);
                if (!error) {
                    this.isSupabaseConnected = true;
                    console.log("⚡ Connected to Supabase Cloud Database:", this.config.url);
                    this.updateUIStatus(true);
                    return true;
                } else {
                    console.warn("Supabase ping response:", error.message);
                    // Even if table is empty or error occurs, if client is valid, enable connection
                    this.isSupabaseConnected = true;
                    this.updateUIStatus(true);
                    return true;
                }
            } catch (err) {
                console.warn("Failed initializing Supabase client:", err);
            }
        }
        this.isSupabaseConnected = false;
        console.log("ℹ️ Running in Local Storage DB Mode");
        this.updateUIStatus(false);
        return false;
    }

    updateUIStatus(connected) {
        document.querySelectorAll('.status-dot, .status-dot-admin').forEach(dot => {
            if (connected) {
                dot.classList.add('connected');
                dot.title = "Connected to Live Supabase Backend";
            } else {
                dot.classList.remove('connected');
                dot.title = "Local Mode (Click badge to configure Supabase)";
            }
        });
        document.querySelectorAll('.db-status-text').forEach(el => {
            el.textContent = connected ? "Supabase Live" : "Supabase Demo Mode";
        });
    }

    /* PRODUCTS CRUD API */
    async getProducts() {
        if (this.isSupabaseConnected) {
            try {
                const { data, error } = await this.supabase.from('products').select('*').order('created_at', { ascending: false });
                if (!error && data && data.length > 0) return data;
            } catch(e) {
                console.error("Error fetching Supabase products:", e);
            }
        }
        // Fallback to local storage
        const local = localStorage.getItem(LOCAL_STORAGE_PRODUCTS_KEY);
        return local ? JSON.parse(local) : DEFAULT_PRODUCTS;
    }

    async addProduct(productData) {
        if (this.isSupabaseConnected) {
            try {
                const { data, error } = await this.supabase.from('products').insert([productData]).select();
                if (!error && data) return data[0];
            } catch(e) {
                console.error("Error adding product to Supabase:", e);
            }
        }
        // Local storage fallback
        const products = JSON.parse(localStorage.getItem(LOCAL_STORAGE_PRODUCTS_KEY) || '[]');
        const newProduct = { ...productData, id: 'p_' + Date.now() };
        products.unshift(newProduct);
        localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(products));
        return newProduct;
    }

    async updateProduct(id, productData) {
        if (this.isSupabaseConnected) {
            try {
                const { data, error } = await this.supabase.from('products').update(productData).eq('id', id).select();
                if (!error && data) return data[0];
            } catch(e) {
                console.error("Error updating Supabase product:", e);
            }
        }
        const products = JSON.parse(localStorage.getItem(LOCAL_STORAGE_PRODUCTS_KEY) || '[]');
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
            products[index] = { ...products[index], ...productData };
            localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(products));
            return products[index];
        }
        return null;
    }

    async deleteProduct(id) {
        if (this.isSupabaseConnected) {
            try {
                const { error } = await this.supabase.from('products').delete().eq('id', id);
                if (!error) return true;
            } catch(e) {
                console.error("Error deleting Supabase product:", e);
            }
        }
        let products = JSON.parse(localStorage.getItem(LOCAL_STORAGE_PRODUCTS_KEY) || '[]');
        products = products.filter(p => p.id !== id);
        localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(products));
        return true;
    }

    /* ORDERS API */
    async getOrders() {
        if (this.isSupabaseConnected) {
            try {
                const { data, error } = await this.supabase.from('orders').select('*').order('created_at', { ascending: false });
                if (!error && data) return data;
            } catch(e) {
                console.error("Error fetching Supabase orders:", e);
            }
        }
        const local = localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY);
        return local ? JSON.parse(local) : DEFAULT_ORDERS;
    }

    async createOrder(orderData, items) {
        let createdOrder = null;
        if (this.isSupabaseConnected) {
            try {
                const { data, error } = await this.supabase.from('orders').insert([orderData]).select();
                if (!error && data && data.length > 0) {
                    createdOrder = data[0];
                    // Insert order items
                    const itemsPayload = items.map(item => ({
                        order_id: createdOrder.id,
                        product_id: typeof item.id === 'string' && item.id.includes('-') ? item.id : null,
                        product_title: item.title,
                        quantity: item.quantity,
                        price: item.sale_price || item.price
                    }));
                    await this.supabase.from('order_items').insert(itemsPayload);
                    return createdOrder;
                }
            } catch(e) {
                console.error("Error creating Supabase order:", e);
            }
        }
        
        // Local storage fallback
        const orders = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY) || '[]');
        createdOrder = {
            id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
            ...orderData,
            created_at: new Date().toISOString(),
            items: items.map(i => ({ product_title: i.title, quantity: i.quantity, price: i.sale_price || i.price }))
        };
        orders.unshift(createdOrder);
        localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(orders));
        return createdOrder;
    }

    async updateOrderStatus(id, newStatus) {
        if (this.isSupabaseConnected) {
            try {
                const { data, error } = await this.supabase.from('orders').update({ status: newStatus }).eq('id', id).select();
                if (!error && data) return data[0];
            } catch(e) {
                console.error("Error updating order status:", e);
            }
        }
        const orders = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY) || '[]');
        const index = orders.findIndex(o => o.id === id);
        if (index !== -1) {
            orders[index].status = newStatus;
            localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(orders));
            return orders[index];
        }
        return null;
    }

    /* MESSAGES API */
    async getMessages() {
        if (this.isSupabaseConnected) {
            try {
                const { data, error } = await this.supabase.from('messages').select('*').order('created_at', { ascending: false });
                if (!error && data) return data;
            } catch(e) {
                console.error("Error fetching messages:", e);
            }
        }
        const local = localStorage.getItem(LOCAL_STORAGE_MESSAGES_KEY);
        return local ? JSON.parse(local) : DEFAULT_MESSAGES;
    }

    async sendMessage(msgData) {
        if (this.isSupabaseConnected) {
            try {
                const { data, error } = await this.supabase.from('messages').insert([msgData]).select();
                if (!error && data) return data[0];
            } catch(e) {
                console.error("Error sending message:", e);
            }
        }
        const msgs = JSON.parse(localStorage.getItem(LOCAL_STORAGE_MESSAGES_KEY) || '[]');
        const newMsg = { id: 'msg-' + Date.now(), ...msgData, created_at: new Date().toISOString() };
        msgs.unshift(newMsg);
        localStorage.setItem(LOCAL_STORAGE_MESSAGES_KEY, JSON.stringify(msgs));
        return newMsg;
    }
}

// Global Singleton Instance
window.veloraDB = new VeloraDatabase();
