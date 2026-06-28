import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);
    calculateTotal(savedCart);
  }, []);

  const calculateTotal = (items) => {
    const sum = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    setTotal(sum);
  };

  const removeFromCart = (productId) => {
    const updated = cart.filter(item => item.id !== productId);
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
    calculateTotal(updated);
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const updated = cart.map(item =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
    calculateTotal(updated);
  };

  const clearCart = () => {
    if (confirm('Are you sure you want to clear the cart?')) {
      setCart([]);
      setTotal(0);
      localStorage.removeItem('cart');
    }
  };

  return (
    <div className="container">
      <h1>Shopping Cart</h1>

      {cart.length > 0 ? (
        <>
          <div className="cart-items">
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cart.map(item => (
                  <tr key={item.id}>
                    <td>
                      <div className="cart-item">
                        <img src={item.image} alt={item.name} />
                        <span>{item.name}</span>
                      </div>
                    </td>
                    <td>₨{item.price}</td>
                    <td>
                      <div className="quantity-controls">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="qty-btn"
                        >
                          -
                        </button>
                        <input 
                          type="number" 
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                          min="1"
                          className="qty-input"
                        />
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="qty-btn"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>₨{item.price * item.quantity}</td>
                    <td>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="btn-danger"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="cart-summary">
            <div className="summary-box">
              <h2>Order Summary</h2>
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>₨{total}</span>
              </div>
              <div className="summary-row">
                <span>Shipping:</span>
                <span>₨0 (TBD)</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>₨{total}</span>
              </div>

              <Link href="/checkout">
                <button className="btn-primary btn-large">
                  Proceed to Checkout
                </button>
              </Link>

              <button 
                onClick={clearCart}
                className="btn-secondary btn-large"
              >
                Clear Cart
              </button>

              <Link href="/store">
                <button className="btn-secondary btn-large">
                  Continue Shopping
                </button>
              </Link>
            </div>
          </div>
        </>
      ) : (
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <p>Start shopping to add items to your cart</p>
          <Link href="/store">
            <button className="btn-primary">Browse Products</button>
          </Link>
        </div>
      )}
    </div>
  );
}
