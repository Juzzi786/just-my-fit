-- =============================================
-- Just My Fit E-commerce Database Schema
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. PRODUCTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    compare_price DECIMAL(10,2),
    category VARCHAR(100),
    sub_category VARCHAR(100),
    images TEXT[] DEFAULT '{}',
    sizes TEXT[] DEFAULT '{}',
    colors TEXT[] DEFAULT '{}',
    stock_quantity INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    meta_title VARCHAR(255),
    meta_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 2. CATEGORIES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    parent_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 3. ORDERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    shipping_address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    order_items JSONB NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    tax DECIMAL(10,2) DEFAULT 0,
    shipping_cost DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    order_status VARCHAR(50) DEFAULT 'pending',
    payment_status VARCHAR(50) DEFAULT 'pending',
    notes TEXT,
    whatsapp_sent BOOLEAN DEFAULT false,
    email_sent BOOLEAN DEFAULT false,
    tracking_number VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 4. ORDER STATUS HISTORY TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS order_status_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL,
    note TEXT,
    created_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 5. USERS TABLE (for admin)
-- =============================================
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(50) DEFAULT 'admin',
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 6. WISHLIST TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS wishlists (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
);

-- =============================================
-- 7. REVIEWS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    customer_name VARCHAR(255) NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT,
    is_verified BOOLEAN DEFAULT false,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 8. NEWSLETTER SUBSCRIBERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    unsubscribed_at TIMESTAMP
);

-- =============================================
-- 9. CONTACT INQUIRIES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS contact_inquiries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(255),
    message TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- CREATE INDEXES FOR BETTER PERFORMANCE
-- =============================================

-- Products indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);

-- Orders indexes
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_order_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);

-- Categories indexes
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON categories(is_active);

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Reviews indexes
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);

-- =============================================
-- CREATE FUNCTIONS AND TRIGGERS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at columns
CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at 
    BEFORE UPDATE ON orders 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_inquiries_updated_at 
    BEFORE UPDATE ON contact_inquiries 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Function to generate order number automatically
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.order_number := 'JMF-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || 
                        LPAD(CAST(FLOOR(RANDOM() * 10000) AS TEXT), 4, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically generate order number
CREATE TRIGGER generate_order_number_before_insert
    BEFORE INSERT ON orders
    FOR EACH ROW
    EXECUTE FUNCTION generate_order_number();

-- =============================================
-- INSERT SAMPLE DATA
-- =============================================

-- Insert admin user (password: Admin@123)
-- Note: The password hash needs to be generated with bcrypt
-- This is a placeholder - you'll need to generate the actual hash
INSERT INTO users (email, password_hash, first_name, last_name, role) 
VALUES (
    'admin@justmyfit.com',
    '$2a$10$r0yIqXJ6NkXZ9Vg8VYkLHuJZKsH8kQZqQxYxYxYxYxYxYxYxYxY', -- Replace with actual hash
    'Admin',
    'User',
    'super_admin'
) ON CONFLICT (email) DO NOTHING;

-- Insert sample categories
INSERT INTO categories (name, slug, description, sort_order, is_active) VALUES
('T-Shirts', 't-shirts', 'Premium quality t-shirts for men', 1, true),
('Shirts', 'shirts', 'Formal and casual shirts', 2, true),
('Jeans', 'jeans', 'Comfortable and stylish jeans', 3, true),
('Trousers', 'trousers', 'Elegant trousers for every occasion', 4, true),
('Suits', 'suits', 'Premium suits and blazers', 5, true),
('Accessories', 'accessories', 'Watches, belts, and more', 6, true),
('Footwear', 'footwear', 'Shoes and sneakers', 7, true),
('Activewear', 'activewear', 'Sportswear and gym clothes', 8, true)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample products
INSERT INTO products (name, slug, description, price, compare_price, category, images, sizes, is_featured, is_active) VALUES
(
    'Classic Oxford Shirt',
    'classic-oxford-shirt',
    'A timeless classic Oxford shirt made from premium cotton. Perfect for both formal and casual occasions.',
    2499.00,
    3999.00,
    'Shirts',
    ARRAY['https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=500'],
    ARRAY['S', 'M', 'L', 'XL', 'XXL'],
    true,
    true
),
(
    'Slim Fit Jeans',
    'slim-fit-jeans',
    'Modern slim fit jeans with stretchable fabric for maximum comfort.',
    2999.00,
    4499.00,
    'Jeans',
    ARRAY['https://images.unsplash.com/photo-1542272604-787c3835535d?w=500'],
    ARRAY['30', '32', '34', '36', '38'],
    true,
    true
),
(
    'Premium Cotton T-Shirt',
    'premium-cotton-tshirt',
    'Soft, breathable cotton t-shirt perfect for everyday wear.',
    999.00,
    1499.00,
    'T-Shirts',
    ARRAY['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'],
    ARRAY['S', 'M', 'L', 'XL'],
    true,
    true
),
(
    'Formal Trousers',
    'formal-trousers',
    'Elegant formal trousers with perfect fit and premium fabric.',
    3499.00,
    4999.00,
    'Trousers',
    ARRAY['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500'],
    ARRAY['30', '32', '34', '36', '38'],
    false,
    true
),
(
    'Leather Wallet',
    'leather-wallet',
    'Genuine leather wallet with multiple card slots and sleek design.',
    1299.00,
    1999.00,
    'Accessories',
    ARRAY['https://images.unsplash.com/photo-1627123424574-724758594e93?w=500'],
    ARRAY['One Size'],
    true,
    true
),
(
    'Sports Shoes',
    'sports-shoes',
    'Lightweight sports shoes with superior cushioning and grip.',
    3999.00,
    5999.00,
    'Footwear',
    ARRAY['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'],
    ARRAY['7', '8', '9', '10', '11'],
    false,
    true
)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample reviews
INSERT INTO reviews (product_id, customer_name, rating, title, comment, is_approved) 
SELECT 
    id,
    'John Doe',
    5,
    'Excellent quality!',
    'The shirt is amazing. Great fabric and perfect fit.',
    true
FROM products WHERE slug = 'classic-oxford-shirt'
ON CONFLICT DO NOTHING;

-- =============================================
-- CREATE RLS (ROW LEVEL SECURITY) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Products policies
CREATE POLICY "Allow public read access for active products" ON products
    FOR SELECT USING (is_active = true);

CREATE POLICY "Allow admin full access to products" ON products
    FOR ALL USING (auth.role() = 'authenticated');

-- Categories policies
CREATE POLICY "Allow public read access for active categories" ON categories
    FOR SELECT USING (is_active = true);

-- Orders policies
CREATE POLICY "Allow users to create orders" ON orders
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow admin to view all orders" ON orders
    FOR SELECT USING (auth.role() = 'authenticated');

-- Reviews policies
CREATE POLICY "Allow public to view approved reviews" ON reviews
    FOR SELECT USING (is_approved = true);

CREATE POLICY "Allow users to create reviews" ON reviews
    FOR INSERT WITH CHECK (true);

-- =============================================
-- CREATE STORAGE BUCKETS
-- =============================================

-- Note: These need to be created via Supabase Dashboard or API
-- The following is for reference only

-- Bucket: product-images
-- Public: Yes
-- Allowed MIME types: image/jpeg, image/png, image/webp, image/gif

-- Bucket: category-images
-- Public: Yes
-- Allowed MIME types: image/jpeg, image/png, image/webp

-- =============================================
-- END OF SCHEMA
-- =============================================