const { supabase, supabaseAdmin } = require('../config/supabase');
const { validationResult } = require('express-validator');
const { sendOrderEmail } = require('../utils/emailService');
const { generateWhatsAppMessage } = require('../utils/whatsappGenerator');
const crypto = require('crypto');

// Generate unique order number
const generateOrderNumber = () => {
    const timestamp = Date.now().toString(36);
    const random = crypto.randomBytes(4).toString('hex').toUpperCase();
    return `JMF-${timestamp}-${random}`;
};

// Create new order
const createOrder = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const orderData = req.body;

        // Generate order number
        orderData.order_number = generateOrderNumber();

        // Calculate totals
        orderData.subtotal = orderData.order_items.reduce(
            (sum, item) => sum + (item.price * item.quantity), 
            0
        );
        orderData.total = orderData.subtotal + (orderData.shipping_cost || 0);

        // Insert order
        const { data: order, error } = await supabaseAdmin
            .from('orders')
            .insert([orderData])
            .select()
            .single();

        if (error) throw error;

        // Add to status history
        await supabaseAdmin
            .from('order_status_history')
            .insert([{
                order_id: order.id,
                status: 'pending',
                note: 'Order placed successfully'
            }]);

        // Send email notification
        try {
            await sendOrderEmail(order, 'new_order');
            await supabaseAdmin
                .from('orders')
                .update({ email_sent: true })
                .eq('id', order.id);
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
        }

        // Generate WhatsApp message
        const whatsappMessage = generateWhatsAppMessage(order);
        const whatsappLink = `https://wa.me/${process.env.WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: {
                order,
                whatsapp_link: whatsappLink
            }
        });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating order',
            error: error.message
        });
    }
};

// Get all orders (Admin only)
const getOrders = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            status,
            search,
            startDate,
            endDate,
            sortBy = 'created_at',
            sortOrder = 'desc'
        } = req.query;

        let query = supabaseAdmin
            .from('orders')
            .select('*', { count: 'exact' });

        // Apply filters
        if (status) {
            query = query.eq('order_status', status);
        }

        if (search) {
            query = query.or(
                `order_number.ilike.%${search}%,customer_name.ilike.%${search}%,customer_email.ilike.%${search}%,customer_phone.ilike.%${search}%`
            );
        }

        if (startDate) {
            query = query.gte('created_at', startDate);
        }

        if (endDate) {
            query = query.lte('created_at', endDate);
        }

        // Pagination
        const start = (page - 1) * limit;
        const end = start + limit - 1;

        query = query
            .order(sortBy, { ascending: sortOrder === 'asc' })
            .range(start, end);

        const { data: orders, error, count } = await query;

        if (error) throw error;

        // Get status history for each order
        const ordersWithHistory = await Promise.all(
            orders.map(async (order) => {
                const { data: history } = await supabaseAdmin
                    .from('order_status_history')
                    .select('*')
                    .eq('order_id', order.id)
                    .order('created_at', { ascending: false });

                return {
                    ...order,
                    status_history: history || []
                };
            })
        );

        res.status(200).json({
            success: true,
            data: ordersWithHistory,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: count,
                pages: Math.ceil(count / limit)
            }
        });
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching orders',
            error: error.message
        });
    }
};

// Get single order
const getOrder = async (req, res) => {
    try {
        const { id } = req.params;

        const { data: order, error } = await supabaseAdmin
            .from('orders')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Get status history
        const { data: history } = await supabaseAdmin
            .from('order_status_history')
            .select('*')
            .eq('order_id', order.id)
            .order('created_at', { ascending: false });

        res.status(200).json({
            success: true,
            data: {
                ...order,
                status_history: history || []
            }
        });
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching order',
            error: error.message
        });
    }
};

// Update order status (Admin only)
const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, note } = req.body;

        // Update order status
        const { data: order, error: updateError } = await supabaseAdmin
            .from('orders')
            .update({ 
                order_status: status,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (updateError) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Add to status history
        await supabaseAdmin
            .from('order_status_history')
            .insert([{
                order_id: id,
                status: status,
                note: note || `Status updated to ${status}`,
                created_by: req.user?.email
            }]);

        // Send status update email
        try {
            await sendOrderEmail(order, 'status_update', { status, note });
        } catch (emailError) {
            console.error('Status update email failed:', emailError);
        }

        res.status(200).json({
            success: true,
            message: 'Order status updated successfully',
            data: order
        });
    } catch (error) {
        console.error('Update order status error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating order status',
            error: error.message
        });
    }
};

// Delete order (Admin only)
const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;

        // Delete status history first (cascade should handle this)
        const { error } = await supabaseAdmin
            .from('orders')
            .delete()
            .eq('id', id);

        if (error) throw error;

        res.status(200).json({
            success: true,
            message: 'Order deleted successfully'
        });
    } catch (error) {
        console.error('Delete order error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting order',
            error: error.message
        });
    }
};

// Get order statistics (Admin only)
const getOrderStats = async (req, res) => {
    try {
        const { period = 'month' } = req.query;

        let dateFilter = '';
        const now = new Date();

        switch (period) {
            case 'today':
                dateFilter = now.toISOString().split('T')[0];
                break;
            case 'week':
                const weekAgo = new Date(now.setDate(now.getDate() - 7));
                dateFilter = `created_at.gte.${weekAgo.toISOString()}`;
                break;
            case 'month':
                const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
                dateFilter = `created_at.gte.${monthAgo.toISOString()}`;
                break;
            case 'year':
                const yearAgo = new Date(now.setFullYear(now.getFullYear() - 1));
                dateFilter = `created_at.gte.${yearAgo.toISOString()}`;
                break;
        }

        // Get total orders count
        const { count: totalOrders } = await supabaseAdmin
            .from('orders')
            .select('*', { count: 'exact', head: true });

        // Get pending orders
        const { count: pendingOrders } = await supabaseAdmin
            .from('orders')
            .select('*', { count: 'exact', head: true })
            .eq('order_status', 'pending');

        // Get orders in date range
        let query = supabaseAdmin
            .from('orders')
            .select('*');

        if (dateFilter) {
            // Apply date filter
        }

        const { data: orders } = await query;

        // Calculate revenue
        const totalRevenue = orders?.reduce((sum, order) => sum + order.total, 0) || 0;

        // Get orders by status
        const ordersByStatus = {};
        orders?.forEach(order => {
            ordersByStatus[order.order_status] = (ordersByStatus[order.order_status] || 0) + 1;
        });

        res.status(200).json({
            success: true,
            data: {
                total_orders: totalOrders || 0,
                pending_orders: pendingOrders || 0,
                total_revenue: totalRevenue,
                orders_by_status: ordersByStatus,
                period: period
            }
        });
    } catch (error) {
        console.error('Get order stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching order statistics',
            error: error.message
        });
    }
};

module.exports = {
    createOrder,
    getOrders,
    getOrder,
    updateOrderStatus,
    deleteOrder,
    getOrderStats
};