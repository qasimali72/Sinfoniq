import '../styles/globals.css';
import Link from 'next/link';
import { useEffect, useState } from 'react';

function MyApp({ Component, pageProps }) {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Update cart count
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const count = cart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(count);
    };

    updateCartCount();

    // Listen for storage changes
    window.addEventListener('storage', updateCartCount);
    
    // Custom event for cart updates
    window.addEventListener('cart-updated', updateCartCount);

    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cart-updated', updateCartCount);
    };
  }, []);

  return (
    <>
      <nav>
        <div className="container">
          <Link href="/">
            <span style={{ fontWeight: 'bold', fontSize: '1.3rem', cursor: 'pointer' }}>
              🛍️ SINFONIQ
            </span>
          </Link>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Link href="/">Home</Link>
            <Link href="/store">Store</Link>
            <Link href="/admin/add-product">Admin</Link>
            <Link href="/cart">
              🛒 Cart ({cartCount})
            </Link>
          </div>
        </div>
      </nav>

      <Component {...pageProps} />

      <footer>
        <div className="container">
          <p>&copy; 2026 Sinfoniq - All Rights Reserved</p>
          <p>Email: support@sinfoniq.com | Phone: +92-XXX-XXXXXXX</p>
        </div>
      </footer>
    </>
  );
}

export default MyApp;
