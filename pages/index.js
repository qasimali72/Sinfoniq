import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [topProducts, setTopProducts] = useState([
    {
      id: 1,
      name: 'Premium Shirt',
      price: 500,
      image: 'https://via.placeholder.com/300x300?text=Premium+Shirt',
      stock: 50,
      description: 'High quality cotton shirt',
      badge: '🌟 Best Seller'
    },
    {
      id: 2,
      name: 'Jeans',
      price: 800,
      image: 'https://via.placeholder.com/300x300?text=Jeans',
      stock: 30,
      description: 'Comfortable denim jeans',
      badge: '📈 Popular'
    },
    {
      id: 3,
      name: 'Running Shoes',
      price: 1200,
      image: 'https://via.placeholder.com/300x300?text=Running+Shoes',
      stock: 25,
      description: 'Professional running shoes',
      badge: '🔥 Trending'
    },
    {
      id: 4,
      name: 'Winter Jacket',
      price: 1500,
      image: 'https://via.placeholder.com/300x300?text=Winter+Jacket',
      stock: 15,
      description: 'Warm and stylish winter jacket',
      badge: '✨ New'
    }
  ]);

  // Fetch products from API when component loads
  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data) && data.length > 0) {
          const mappedProducts = data.slice(0, 4).map((product, index) => ({
            ...product,
            badge: ['🌟 Best Seller', '📈 Popular', '🔥 Trending', '✨ New'][index] || '⭐ Featured'
          }));
          setTopProducts(mappedProducts);
        }
      })
      .catch(err => {
        console.log('Using default products:', err.message);
      });
  }, []);

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find(item => item.id === product.id);
    
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`✅ ${product.name} added to cart!`);
  };

  return (
    <div className="container">
      {/* Hero Section */}
      <div className="hero">
        <h1>Welcome to Sinfoniq</h1>
        <p>Your premium e-commerce store</p>
        <Link href="/store">
          <button className="btn-primary">Shop Now</button>
        </Link>
      </div>

      {/* Features Section */}
      <div className="features">
        <div className="feature-card">
          <h2>🛍️ Browse Products</h2>
          <p>Explore our wide range of products</p>
        </div>
        <div className="feature-card">
          <h2>🛒 Easy Shopping</h2>
          <p>Simple and fast checkout process</p>
        </div>
        <div className="feature-card">
          <h2>💳 Secure Payment</h2>
          <p>Safe payments with Stripe or COD</p>
        </div>
      </div>

      {/* Promo/Special Offer Section */}
      <section className="promo">
        <h2>Special Offer!</h2>
        <p>Get 10% off on your first order</p>
        <Link href="/store">
          <button className="btn-secondary">Browse Collection</button>
        </Link>
      </section>

      {/* Top Products Section - AUTO DISPLAYS */}
      <section className="top-products">
        <h2>🔥 Top Sale Products</h2>
        <p className="top-products-subtitle">Check out our best selling items</p>
        
        <div className="products-grid">
          {topProducts && topProducts.length > 0 ? (
            topProducts.map(product => (
              <div key={product.id} className="product-card top-product-card">
                <div className="product-image-wrapper">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="product-image"
                  />
                  <span className="product-badge">
                    {product.badge || '⭐ Featured'}
                  </span>
                </div>
                
                <div className="product-info">
                  <h3>{product.name}</h3>
                  {product.description && (
                    <p className="description">{product.description}</p>
                  )}
                  <p className="price">₨{product.price}</p>
                  {product.stock && (
                    <p className="stock">
                      {product.stock > 0 ? `✅ ${product.stock} in stock` : '❌ Out of Stock'}
                    </p>
                  )}
                  
                  <button 
                    className="btn-primary btn-add-cart"
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                  >
                    {product.stock > 0 ? '🛒 Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p style={{ textAlign: 'center', gridColumn: '1 / -1' }}>No products available</p>
          )}
        </div>

        {/* View All Products Button */}
        <div className="view-all-wrapper">
          <Link href="/store">
            <button className="btn-secondary btn-view-all">
              📦 View All Products
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
