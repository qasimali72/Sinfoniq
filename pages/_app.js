import '../styles/globals.css';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

function MyApp({ Component, pageProps }) {
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const count = cart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(count);
    };

    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    window.addEventListener('cart-updated', updateCartCount);

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cart-updated', updateCartCount);
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <>
      <nav>
        <div className="container">
          <Link href="/">
            <span style={{ fontWeight: 'bold', fontSize: '1.3rem', cursor: 'pointer' }}>
              🛍️ SINFONIQ
            </span>
          </Link>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
            <Link href="/">Home</Link>
            <Link href="/store">Store</Link>
            <Link href="/admin/add-product">Admin</Link>
            <Link href="/cart">🛒 Cart ({cartCount})</Link>
            {user ? (
              <>
                <Link href="/orders">My Orders</Link>
                <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)' }}>
                  {user.email}
                </span>
                <button onClick={handleLogout} className="btn-danger" style={{ padding: '6px 12px' }}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login">Login</Link>
                <Link href="/signup">Sign Up</Link>
              </>
            )}
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