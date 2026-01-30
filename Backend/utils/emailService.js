const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Send order confirmation email
exports.sendOrderConfirmation = async (order, user) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: `Order Confirmation - ${order.orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ff3f6c;">Order Confirmed!</h2>
        <p>Hi ${user.name},</p>
        <p>Thank you for your order. Your order has been confirmed and will be shipped soon.</p>
        
        <div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px;">
          <h3>Order Details</h3>
          <p><strong>Order Number:</strong> ${order.orderNumber}</p>
          <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
          <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>
          <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
        </div>
        
        <div style="background: #fff; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h3>Items Ordered</h3>
          ${order.items.map(item => `
            <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #f0f0f0;">
              <p><strong>${item.product.name}</strong></p>
              <p>Quantity: ${item.quantity} × ₹${item.price} = ₹${item.quantity * item.price}</p>
            </div>
          `).join('')}
        </div>
        
        <div style="margin-top: 20px;">
          <h3>Shipping Address</h3>
          <p>${order.shippingAddress.fullName}<br>
          ${order.shippingAddress.address}<br>
          ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.pincode}<br>
          Phone: ${order.shippingAddress.phone}</p>
        </div>
        
        <p style="margin-top: 30px;">You can track your order status in your account.</p>
        <p>Thank you for shopping with PrimeBasket!</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// Send password reset email
exports.sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Password Reset Request - PrimeBasket',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ff3f6c;">Password Reset Request</h2>
        <p>Hi ${user.name},</p>
        <p>You requested to reset your password. Click the button below to reset it:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background: #ff3f6c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Reset Password
          </a>
        </div>
        
        <p>Or copy and paste this link in your browser:</p>
        <p style="color: #666; word-break: break-all;">${resetUrl}</p>
        
        <p style="color: #999; font-size: 14px; margin-top: 30px;">
          This link will expire in 1 hour. If you didn't request this, please ignore this email.
        </p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// Send welcome email
exports.sendWelcomeEmail = async (user) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Welcome to PrimeBasket!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ff3f6c;">Welcome to PrimeBasket!</h2>
        <p>Hi ${user.name},</p>
        <p>Thank you for joining PrimeBasket. We're excited to have you!</p>
        
        <div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px;">
          <h3>What's Next?</h3>
          <ul style="line-height: 2;">
            <li>Browse our latest collections</li>
            <li>Add items to your wishlist</li>
            <li>Get exclusive member discounts</li>
            <li>Enjoy free delivery on orders above ₹999</li>
          </ul>
        </div>
        
        <p>Happy Shopping!</p>
        <p>Team PrimeBasket</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// Send order status update email
exports.sendOrderStatusUpdate = async (order, user) => {
  const statusMessages = {
    'Processing': 'Your order is being processed',
    'Shipped': 'Your order has been shipped',
    'Delivered': 'Your order has been delivered',
    'Cancelled': 'Your order has been cancelled'
  };

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: `Order Update - ${order.orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ff3f6c;">Order Status Update</h2>
        <p>Hi ${user.name},</p>
        <p>${statusMessages[order.orderStatus]}</p>
        
        <div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px;">
          <p><strong>Order Number:</strong> ${order.orderNumber}</p>
          <p><strong>Status:</strong> ${order.orderStatus}</p>
          <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>
        </div>
        
        <p>You can track your order in your account.</p>
        <p>Thank you for shopping with PrimeBasket!</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Order status update email sent');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
