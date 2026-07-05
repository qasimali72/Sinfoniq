// API route for handling checkout and payments
// This is a basic implementation.
// For production, you must use a persistent database (e.g., Vercel Postgres, Supabase)
// instead of an in-memory array.

import { v4 as uuidv4 } from 'uuid';

let orders = []; // ⚠️ WARNING: In-memory storage. Data will be lost on server restart.

export default function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const orderData = req.body;

      // Validate order
      if (!orderData.customer || !orderData.items || !orderData.total) {
        return res.status(400).json({ 
          error: 'Invalid order data' 
        });
      }

      // Create order object
      const order = {
        id: `ORD-${uuidv4()}`, // Use a more robust unique ID
        customer: orderData.customer,
        items: orderData.items,
        total: orderData.total,
        paymentMethod: orderData.paymentMethod || 'cod',
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      // Save order (to in-memory array for now)
      orders.push(order);

      // TODO: Process payment based on payment method
      if (orderData.paymentMethod === 'stripe') {
        // Call Stripe API
        // const stripeResponse = await stripe.charges.create({ ... });
      } else if (orderData.paymentMethod === 'cod') {
        // COD - just confirm order
        order.status = 'confirmed';
      }

      // TODO: Send confirmation email
      // const emailResponse = await sendEmail(order.customer.email, orderTemplate);

      // TODO: Create TCS shipment
      // const tcsResponse = await createTCSShipment(order);

      res.status(201).json({ 
        message: 'Order placed successfully',
        order: order
      });

    } catch (error) {
      res.status(500).json({ 
        error: 'Failed to process order: ' + error.message 
      });
    }
  }
  else if (req.method === 'GET') {
    // ⚠️ WARNING: This is insecure. Anyone can view all orders.
    // In a real application, this endpoint should be protected and only accessible by authenticated admins.
    // For example, check for an admin session or an API key.
    // const isAdmin = await checkAdminAuth(req);
    // if (!isAdmin) return res.status(403).json({ error: 'Forbidden' });

    res.status(200).json(orders);
  }
  else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
