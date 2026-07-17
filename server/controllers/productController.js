const { supabase, supabaseAdmin } = require('../config/supabase');
const { validationResult } = require('express-validator');
const slugify = require('slugify');

// Get all products with filtering and pagination
const getProducts = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 12,
            category,
            search,
            sortBy = 'created_at',
            sortOrder = 'desc',
            minPrice,
            maxPrice,
            featured
        } = req.query;

        let query = supabase
            .from('products')
            .select('*', { count: 'exact' });

        // Apply filters
        if (category) {
            query = query.eq('category', category);
        }

        if (search) {
            query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
        }

        if (minPrice) {
            query = query.gte('price', minPrice);
        }

        if (maxPrice) {
            query = query.lte('price', maxPrice);
        }

        if (featured === 'true') {
            query = query.eq('is_featured', true);
        }

        // Only show active products
        query = query.eq('is_active', true);

        // Pagination
        const start = (page - 1) * limit;
        const end = start + limit - 1;

        query = query
            .order(sortBy, { ascending: sortOrder === 'asc' })
            .range(start, end);

        const { data: products, error, count } = await query;

        if (error) throw error;

        res.status(200).json({
            success: true,
            data: products,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: count,
                pages: Math.ceil(count / limit)
            }
        });
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching products',
            error: error.message
        });
    }
};

// Get single product by slug or ID
const getProduct = async (req, res) => {
    try {
        const { identifier } = req.params;
        
        let query = supabase
            .from('products')
            .select('*');

        // Check if identifier is UUID or slug
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);
        
        if (isUUID) {
            query = query.eq('id', identifier);
        } else {
            query = query.eq('slug', identifier);
        }

        const { data: product, error } = await query.single();

        if (error) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Get related products (same category)
        const { data: relatedProducts } = await supabase
            .from('products')
            .select('*')
            .eq('category', product.category)
            .eq('is_active', true)
            .neq('id', product.id)
            .limit(4);

        res.status(200).json({
            success: true,
            data: {
                ...product,
                related_products: relatedProducts || []
            }
        });
    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching product',
            error: error.message
        });
    }
};

// Create new product (Admin only)
const createProduct = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const productData = req.body;

        // Generate slug from name
        productData.slug = slugify(productData.name, {
            lower: true,
            strict: true
        });

        // Check if slug exists
        const { data: existingProduct } = await supabase
            .from('products')
            .select('slug')
            .eq('slug', productData.slug)
            .single();

        if (existingProduct) {
            productData.slug = `${productData.slug}-${Date.now()}`;
        }

        const { data: product, error } = await supabaseAdmin
            .from('products')
            .insert([productData])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: product
        });
    } catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating product',
            error: error.message
        });
    }
};

// Update product (Admin only)
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        if (updates.name) {
            updates.slug = slugify(updates.name, {
                lower: true,
                strict: true
            });
        }

        const { data: product, error } = await supabaseAdmin
            .from('products')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            data: product
        });
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating product',
            error: error.message
        });
    }
};

// Delete product (Admin only)
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const { error } = await supabaseAdmin
            .from('products')
            .delete()
            .eq('id', id);

        if (error) throw error;

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting product',
            error: error.message
        });
    }
};

// Upload product images (Admin only)
const uploadImages = async (req, res) => {
    try {
        const { id } = req.params;
        const files = req.files;

        if (!files || files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No images uploaded'
            });
        }

        // Get current product images
        const { data: product } = await supabase
            .from('products')
            .select('images')
            .eq('id', id)
            .single();

        const imageUrls = [];

        for (const file of files) {
            // Upload to Supabase Storage
            const fileName = `products/${id}/${Date.now()}-${file.originalname}`;
            const { data, error } = await supabaseAdmin.storage
                .from('product-images')
                .upload(fileName, file.buffer, {
                    contentType: file.mimetype,
                    upsert: false
                });

            if (error) throw error;

            // Get public URL
            const { data: { publicUrl } } = supabaseAdmin.storage
                .from('product-images')
                .getPublicUrl(fileName);

            imageUrls.push(publicUrl);
        }

        // Update product with new images
        const updatedImages = [...(product?.images || []), ...imageUrls];
        
        const { data: updatedProduct, error: updateError } = await supabaseAdmin
            .from('products')
            .update({ images: updatedImages })
            .eq('id', id)
            .select()
            .single();

        if (updateError) throw updateError;

        res.status(200).json({
            success: true,
            message: 'Images uploaded successfully',
            data: {
                images: imageUrls,
                product: updatedProduct
            }
        });
    } catch (error) {
        console.error('Upload images error:', error);
        res.status(500).json({
            success: false,
            message: 'Error uploading images',
            error: error.message
        });
    }
};

module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadImages
};