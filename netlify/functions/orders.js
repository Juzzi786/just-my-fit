const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const nodemailer = require('nodemailer');

const app = express();
const router = express.Router();

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Create order
router.post('/orders', async (req, res) => {
  try {
    const orderData = req.body;
    
    // Generate order number
    const orderNumber = `JMF-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    orderData.order_number = orderNumber;

    const { data, error } = await supabase
      .from('orders')
      .insert([orderData])
      .select()
      .single();

    if (error) throw error;

    // Send email notification
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'justmyfit786@gmail.com',
      subject: `New Order: ${orderNumber}`,
      html: `
        <h2>New Order Received</h2>
        <p>Order Number: ${orderNumber}</p>
        <p>Customer: ${orderData.customer_name}</p>
        <p>Total: ₹${orderData.total}</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      success: true,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

app.use('/.netlify/functions/orders', router);

exports.handler = serverless(app);