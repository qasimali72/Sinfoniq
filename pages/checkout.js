import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';

export default function Checkout() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipcode: ''
  });

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);
    const sum = savedCart.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);
    setTotal(sum);

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        setCustomerInfo(prev => ({ ...prev, email: session.user.email }));
      }
    });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!customerInfo.name || !customerInfo.email || !customerInfo.phone || !customerInfo.address || !customerInfo.city) {
        alert('Please fill in all required fields');
        setLoading(false);
        return;
      }

      if (cart.length === 0) {
        alert('Your cart is empty');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: customerInfo,
          items: cart,
          total: total,
          paymentMethod: paymentMethod,
          userId: user?.id || null
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to place order');
      }

      localStorage.removeItem('cart');
      window.dispatchEvent(new Event('cart-updated'));
      setOrderPlaced(true);
      setLoading(false);

    } catch (err) {
      alert('Error placing order: ' + err.message);
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="container">
        <div style={{ maxWidth: '500px', margin: '80px auto', textAlign: 'center', padding: '40px', background: '#f8f9fa', borderRadius: '8px' }}>
          <h1 style={{ color: '#28a745' }}>✅ Order Placed!</h1>
          <p style={{ fontSize: '1.1rem', margin: '20px 0' }}>Thank you, {customerInfo.name}!</p>
          <p>We will contact you at <strong>{customerInfo.phone}</strong> to confirm delivery.</p>
          {user && (
            <p style={{ marginTop: '15px' }}>
              <Link href="/orders">View your order history →</Link>
            </p>
          )}
          <div style={{ marginTop: '30px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <Link href="/store"><button className="btn-primary">Continue Shopping</button></Link>
            <Link href="/"><button className="btn-secondary">Go Home</button></Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Checkout</h1>
      <div className="checkout-wrapper">
        <div className="checkout-form">
          <form onSubmit={handleSubmit}>
            <h2>Delivery Information</h2>

            {!user && (
              <div style={{ background: '#fff3cd', padding: '12px', borderRadius: '4px', marginBottom: '20px', fontSize: '0.9rem' }}>
                💡 <Link href="/login">Log in</Link> to save your order history
              </div>
            )}

            <div className="form-group">
              <label>Full Name *</label>
              <input type="text" name="name" value={customerInfo.name} onChange={handleInputChange} placeholder="Your full name" required />
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input type="email" name="email" value={customerInfo.email} onChange={handleInputChange} placeholder="your@email.com" required />
            </div>

            <div className="form-group">
              <label>Phone Number *</label>
              <input type="tel" name="phone" value={customerInfo.phone} onChange={handleInputChange} placeholder="03XXXXXXXXX" required />
            </div>

            <div className="form-group">
              <label>Delivery Address *</label>
              <textarea name="address" value={customerInfo.address} onChange={handleInputChange} placeholder="Your full delivery address" rows="3" required />
            </div>

            <div className="form-group">
              <label>City *</label>
              <input type="text" name="city" value={customerInfo.city} onChange={handleInputChange} placeholder="City name" required />
            </div>

            <div className="form-group">
              <label>Zip Code</label>
              <input type="text" name="zipcode" value={customerInfo.zipcode} onChange={handleInputChange} placeholder="Zip/Postal code" />
            </div>

            <h2>Payment Method</h2>
            <div className="payment-options">
              <div className="radio-group">
                <input type="radio" id="cod" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={(e) => setPaymentMethod(e.target.value)} />
                <label htmlFor="cod">
                  <strong>Cash on Delivery (COD)</strong>
                  <p>Pay when you receive your order</p>
                </label>
              </div>
            </div>

            <button type="submit" className="btn-primary btn-large" disabled={loading || cart.length === 0}>
              {loading ? '⏳ Placing Order...' : '✅ Place Order'}
            </button>

            <Link href="/cart">
              <button type="button" className="btn-secondary btn-large">← Back to Cart</button>
            </Link>
          </form>
        </div>

        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="summary-items">
            {cart.map((item, i) => (
              <div key={i} className="summary-item">
                <span>{item.name} x{item.quantity || 1}{item.size && ` (${item.size})`}</span>
                <span>₨{item.price * (item.quantity || 1)}</span>
              </div>
            ))}
          </div>
          <div className="summary-totals">
            <div className="total-row"><span>Subtotal:</span><span>₨{total}</span></div>
            <div className="total-row"><span>Shipping:</span><span>₨0</span></div>
            <div className="total-row grand-total"><span>Total:</span><span>₨{total}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}