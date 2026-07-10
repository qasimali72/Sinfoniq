import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { customer, items, total, paymentMethod, userId } = req.body;

    if (!customer || !items || !total) {
      return res.status(400).json({ error: 'Missing required order fields' });
    }

    const { data, error } = await supabase
      .from('orders')
      .insert([{
        customer_name: customer.name,
        customer_email: customer.email,
        customer_phone: customer.phone,
        customer_address: customer.address,
        customer_city: customer.city,
        items: items,
        total: parseInt(total),
        payment_method: paymentMethod || 'cod',
        status: 'pending',
        user_id: userId || null
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: 'Failed to save order: ' + error.message });
    }

    return res.status(201).json({
      message: 'Order placed successfully',
      order: data
    });

  } catch (err) {
    console.error('Checkout error:', err);
    return res.status(500).json({ error: 'Server error: ' + err.message });
  }
}