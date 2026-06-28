import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Checkout() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipcode: ''
  });
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);
    const sum = savedCart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    setTotal(sum);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate form
      if (!customerInfo.name || !customerInfo.email || !customerInfo.phone || !customerInfo.address) {
        alert('Please fill in all required fields');
        setLoading(false);
        return;
      }

      // Create order object
      const order = {
        id: Date.now(),
        customer: customerInfo,
        items: cart,
        total: total,
        paymentMethod: paymentMethod,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      // Save order (in real app, send to API)
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      orders.push(order);
      localStorage.setItem('orders', JSON.stringify(orders));

      // Clear cart
      localStorage.removeItem('cart');

      // Show success
      setOrderPlaced(true);
      setLoading(false);

      // Redirect after 3 seconds
      setTimeout(() => {
        window.location.href = '/';
      }, 3000);

    } catch (error) {
      alert('Error placing order: ' + error.message);
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="container">
        <div className="success-message">
          <h1>✓ Order Placed Successfully!</h1>
          <p>Order ID: #{Date.now()}</p>
          <p>Confirmation has been sent to {customerInfo.email}</p>
          <p>Redirecting to home page...</p>
          <Link href="/">
            <button className="btn-primary">Back to Home</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Checkout</h1>

      <div className="checkout-wrapper">
        <div className="checkout-form">
          <form onSubmit={handleSubmitOrder}>
            <h2>Delivery Information</h2>
            
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="name"
                value={customerInfo.name}
                onChange={handleInputChange}
                placeholder="Your full name"
                required
              />
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={customerInfo.email}
                onChange={handleInputChange}
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={customerInfo.phone}
                onChange={handleInputChange}
                placeholder="03XXXXXXXXX"
                required
              />
            </div>

            <div className="form-group">
              <label>Delivery Address *</label>
              <textarea
                name="address"
                value={customerInfo.address}
                onChange={handleInputChange}
                placeholder="Your delivery address"
                rows="3"
                required
              />
            </div>

            <div className="form-group">
              <label>City *</label>
              <input
                type="text"
                name="city"
                value={customerInfo.city}
                onChange={handleInputChange}
                placeholder="City name"
                required
              />
            </div>

            <div className="form-group">
              <label>Zip Code</label>
              <input
                type="text"
                name="zipcode"
                value={customerInfo.zipcode}
                onChange={handleInputChange}
                placeholder="Zip/Postal code"
              />
            </div>

            <h2>Payment Method</h2>
            
            <div className="payment-options">
              <div className="radio-group">
                <input
                  type="radio"
                  id="cod"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <label htmlFor="cod">
                  <strong>Cash on Delivery (COD)</strong>
                  <p>Pay when you receive your order</p>
                </label>
              </div>

              <div className="radio-group">
                <input
                  type="radio"
                  id="stripe"
                  name="payment"
                  value="stripe"
                  checked={paymentMethod === 'stripe'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <label htmlFor="stripe">
                  <strong>Card Payment (Stripe)</strong>
                  <p>Pay with credit/debit card (coming soon)</p>
                </label>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-primary btn-large"
              disabled={loading || cart.length === 0}
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>

            <Link href="/cart">
              <button type="button" className="btn-secondary btn-large">
                Back to Cart
              </button>
            </Link>
          </form>
        </div>

        <div className="order-summary">
          <h2>Order Summary</h2>
          
          <div className="summary-items">
            {cart.map(item => (
              <div key={item.id} className="summary-item">
                <span>{item.name} x {item.quantity}</span>
                <span>₨{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="summary-totals">
            <div className="total-row">
              <span>Subtotal:</span>
              <span>₨{total}</span>
            </div>
            <div className="total-row">
              <span>Shipping:</span>
              <span>₨0</span>
            </div>
            <div className="total-row grand-total">
              <span>Total:</span>
              <span>₨{total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
