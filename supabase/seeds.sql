-- Additional sample data for testing

-- Insert more sample products
INSERT INTO products (name, slug, description, price, compare_price, category, images, sizes, is_featured, is_active) VALUES
(
    'Wool Blend Blazer',
    'wool-blend-blazer',
    'Sophisticated wool blend blazer for formal occasions.',
    8999.00,
    12999.00,
    'Suits',
    ARRAY['https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500'],
    ARRAY['S', 'M', 'L', 'XL'],
    true,
    true
),
(
    'Classic Watch',
    'classic-watch',
    'Elegant stainless steel watch with leather strap.',
    4999.00,
    7999.00,
    'Accessories',
    ARRAY['https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500'],
    ARRAY['One Size'],
    true,
    true
)
ON CONFLICT (slug) DO NOTHING;

-- Insert more reviews
INSERT INTO reviews (product_id, customer_name, rating, title, comment, is_approved) 
SELECT 
    id,
    'Jane Smith',
    5,
    'Perfect fit!',
    'The jeans fit perfectly and the material is high quality.',
    true
FROM products WHERE slug = 'slim-fit-jeans'
ON CONFLICT DO NOTHING;