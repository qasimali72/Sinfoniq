import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) {
        setLoading(false);
        return;
      }
      setUser(session.user);
      loadOrders(session.user.id);
    });
  }, []);

  const loadOrders = async (userId) => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading orders:', error);
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  };

  const statusColor = (status) => {
    switch (status) {
      case 'pending': return '#ffc107';
      case 'confirmed': return '#007bff';
      case 'shipped': return '#17a2b8';
      case 'delivered': return '#28a745';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  if (loading) {
    return <div className="container"><p>Loading your orders...</p></div>;
  }

  if (!user) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <h1>Order History</h1>
          <p>Please log in to view your orders</p>
          <Link href="/login">
            <button className="btn-primary" style={{ marginTop: '20px' }}>Log In</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Your Orders</h1>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: '#f8f9fa', borderRadius: '8px' }}>
          <h2 style={{ color: '#6c757d' }}>No orders yet</h2>
          <p>Start shopping to see your orders here</p>
          <Link href="/store">
            <button className="btn-primary" style={{ marginTop: '20px' }}>Browse Store</button>
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {orders.map(order => (
            <div key={order.id} style={{
              background: 'white',
              border: '1px solid #dee2e6',
              borderRadius: '8px',
              padding: '20px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 'bold', fontSize: '1.1rem' }}>
                    Order #{order.id.toString().slice(-6).toUpperCase()}
                  </p>
                  <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
                    {new Date(order.created_at).toLocaleDateString('en-PK', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    background: statusColor(order.status),
                    color: order.status === 'pending' ? '#333' : 'white',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    textTransform: 'capitalize'
                  }}>
                    {order.status}
                  </span>
                  <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#007bff' }}>
                    ₨{order.total}
                  </span>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #dee2e6', paddingTop: '15px' }}>
                <p style={{ margin: '0 0 10px', fontWeight: '500' }}>Items:</p>
                {Array.isArray(order.items) && order.items.map((item, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 0',
                    borderBottom: i < order.items.length - 1 ? '1px solid #f0f0f0' : 'none',
                    fontSize: '0.95rem'
                  }}>
                    <span>
                      {item.name} x{item.quantity || 1}
                      {item.size && <span style={{ color: '#666' }}> ({item.size})</span>}
                      {item.color && <span style={{ color: '#666' }}> - {item.color}</span>}
                    </span>
                    <span>₨{item.price * (item.quantity || 1)}</span>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid #dee2e6', paddingTop: '15px', marginTop: '5px' }}>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
                  📦 Delivery to: {order.customer_address}, {order.customer_city}
                </p>
                <p style={{ margin: '5px 0 0', fontSize: '0.9rem', color: '#666' }}>
                  💳 Payment: {order.payment_method === 'cod' ? 'Cash on Delivery' : order.payment_method}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}