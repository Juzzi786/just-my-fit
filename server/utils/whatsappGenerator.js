// Generate WhatsApp message for order
const generateWhatsAppMessage = (order) => {
    const itemsList = order.order_items.map(item => 
        `• ${item.name} - Size: ${item.size || 'N/A'} - Qty: ${item.quantity} - ₹${item.price}`
    ).join('%0A');

    const message = `
*NEW ORDER RECEIVED - Just My Fit*
        
*Order Number:* ${order.order_number}
*Date:* ${new Date(order.created_at).toLocaleString()}
        
*CUSTOMER DETAILS*
*Name:* ${order.customer_name}
*Phone:* ${order.customer_phone}
*Email:* ${order.customer_email}
        
*SHIPPING ADDRESS*
${order.shipping_address}
${order.city}, ${order.state} - ${order.pincode}
        
*ORDER ITEMS*
${itemsList}
        
*ORDER SUMMARY*
*Subtotal:* ₹${order.subtotal}
*Shipping:* ₹${order.shipping_cost || 0}
*Total:* ₹${order.total}
        
*Status:* Pending
*Payment:* Not Required (Dropshipping)
        
Please process this order in the admin dashboard.
    `.trim();

    return message;
};

// Generate order confirmation for customer
const generateCustomerWhatsAppMessage = (order) => {
    const itemsList = order.order_items.map(item => 
        `• ${item.name} - ${item.size || 'N/A'} - Qty: ${item.quantity}`
    ).join('%0A');

    const message = `
Thank you for ordering from *Just My Fit*! 🎉

*Order Number:* ${order.order_number}
        
*YOUR ORDER*
${itemsList}
        
*Total Amount:* ₹${order.total}
        
*SHIPPING ADDRESS*
${order.shipping_address}
${order.city}, ${order.state} - ${order.pincode}
        
We will process your order shortly and send you a confirmation email.
For any queries, reply to this message or contact us at justmyfit786@gmail.com
        
Thank you for choosing Just My Fit!
    `.trim();

    return message;
};

module.exports = {
    generateWhatsAppMessage,
    generateCustomerWhatsAppMessage
};