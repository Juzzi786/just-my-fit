const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Order confirmation email template
const getOrderEmailTemplate = (order, type = 'new_order', additionalData = {}) => {
    const itemsList = order.order_items.map(item => `
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.name}</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.size || 'N/A'}</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.quantity}</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">₹${item.price}</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">₹${item.price * item.quantity}</td>
        </tr>
    `).join('');

    const baseTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; background: #f9f9f9; }
                .order-details { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; }
                table { width: 100%; border-collapse: collapse; }
                th { background: #f0f0f0; padding: 10px; text-align: left; }
                .total { font-size: 18px; font-weight: bold; color: #667eea; }
                .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Just My Fit</h1>
                    <p>Premium Men's Wear & Accessories</p>
                </div>
                <div class="content">
                    ${type === 'new_order' ? `
                        <h2>New Order Received! 🎉</h2>
                        <p>A new order has been placed on Just My Fit.</p>
                    ` : `
                        <h2>Order Status Update</h2>
                        <p>Order #${order.order_number} status has been updated to: <strong>${additionalData.status}</strong></p>
                        ${additionalData.note ? `<p>Note: ${additionalData.note}</p>` : ''}
                    `}
                    
                    <div class="order-details">
                        <h3>Order #${order.order_number}</h3>
                        <p><strong>Date:</strong> ${new Date(order.created_at).toLocaleString()}</p>
                        
                        <h4>Customer Details:</h4>
                        <p><strong>Name:</strong> ${order.customer_name}</p>
                        <p><strong>Email:</strong> ${order.customer_email}</p>
                        <p><strong>Phone:</strong> ${order.customer_phone}</p>
                        <p><strong>Shipping Address:</strong><br>
                        ${order.shipping_address}<br>
                        ${order.city}, ${order.state} - ${order.pincode}</p>
                        
                        <h4>Order Items:</h4>
                        <table>
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Size</th>
                                    <th>Qty</th>
                                    <th>Price</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${itemsList}
                            </tbody>
                        </table>
                        
                        <p style="text-align: right; margin-top: 20px;">
                            <strong>Subtotal:</strong> ₹${order.subtotal}<br>
                            <strong>Shipping:</strong> ₹${order.shipping_cost || 0}<br>
                            <span class="total">Total: ₹${order.total}</span>
                        </p>
                    </div>
                    
                    <p>You can view and manage this order in the admin dashboard.</p>
                </div>
                <div class="footer">
                    <p>© ${new Date().getFullYear()} Just My Fit. All rights reserved.</p>
                    <p>This is an automated message, please do not reply.</p>
                </div>
            </div>
        </body>
        </html>
    `;

    return baseTemplate;
};

// Send order email
const sendOrderEmail = async (order, type = 'new_order', additionalData = {}) => {
    try {
        const mailOptions = {
            from: `"Just My Fit" <${process.env.EMAIL_USER}>`,
            to: type === 'new_order' ? 'justmyfit786@gmail.com' : order.customer_email,
            subject: type === 'new_order' 
                ? `New Order #${order.order_number} - Just My Fit`
                : `Order #${order.order_number} Status Update - Just My Fit`,
            html: getOrderEmailTemplate(order, type, additionalData)
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

// Contact form email
const sendContactEmail = async (contactData) => {
    try {
        const { name, email, phone, subject, message } = contactData;

        const mailOptions = {
            from: `"Just My Fit Contact" <${process.env.EMAIL_USER}>`,
            to: 'justmyfit786@gmail.com',
            subject: `Contact Form: ${subject}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: #333; color: white; padding: 20px; text-align: center; }
                        .content { padding: 20px; background: #f9f9f9; }
                        .field { margin-bottom: 15px; }
                        .label { font-weight: bold; color: #666; }
                        .value { margin-top: 5px; padding: 10px; background: white; border-radius: 5px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h2>New Contact Form Submission</h2>
                        </div>
                        <div class="content">
                            <div class="field">
                                <div class="label">Name:</div>
                                <div class="value">${name}</div>
                            </div>
                            <div class="field">
                                <div class="label">Email:</div>
                                <div class="value">${email}</div>
                            </div>
                            <div class="field">
                                <div class="label">Phone:</div>
                                <div class="value">${phone || 'Not provided'}</div>
                            </div>
                            <div class="field">
                                <div class="label">Subject:</div>
                                <div class="value">${subject}</div>
                            </div>
                            <div class="field">
                                <div class="label">Message:</div>
                                <div class="value">${message}</div>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Contact email sent:', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending contact email:', error);
        throw error;
    }
};

module.exports = {
    sendOrderEmail,
    sendContactEmail
};