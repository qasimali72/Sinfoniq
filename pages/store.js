import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Store() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState({});
  const [selectedColors, setSelectedColors] = useState({});

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data) ? data : [];
        setProducts(list);
        setFilteredProducts(list);
      })
      .catch(err => console.log('Error loading products:', err));
  }, []);

  useEffect(() => {
    const filtered = products.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [search, products]);

  const showNotification = (message, type = 'success') => {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `<span>${message}</span><button onclick="this.parentElement.remove()" style="background:none;border:none;color:white;font-size:1.2rem;cursor:pointer;">×</button>`;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.classList.add('notification-hide');
      setTimeout(() => notification.remove(), 300);
    }, 4000);
  };

  const addToCart = (product) => {
    const hasSizes = product.sizes && product.sizes.length > 0;
    const hasColors = product.colors && product.colors.length > 0;
    const selectedSize = selectedSizes[product.id];
    const selectedColor = selectedColors[product.id];

    if (hasSizes && !selectedSize) {
      showNotification('⚠️ Please select a size', 'warning');
      return;
    }
    if (hasColors && !selectedColor) {
      showNotification('⚠️ Please select a color', 'warning');
      return;
    }

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find(item =>
      item.id === product.id &&
      item.size === (selectedSize || null) &&
      item.color === (selectedColor || null)
    );

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        ...product,
        quantity: 1,
        size: selectedSize || null,
        color: selectedColor || null
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cart-updated'));

    const variant = [selectedSize, selectedColor].filter(Boolean).join(', ');
    showNotification(`✅ ${product.name}${variant ? ` (${variant})` : ''} added to cart!`, 'success');
  };

  const handleSizeChange = (productId, size) => {
    setSelectedSizes({ ...selectedSizes, [productId]: size });
  };

  const handleColorChange = (productId, color) => {
    setSelectedColors({ ...selectedColors, [productId]: color });
  };

  return (
    <div className="container">
      <h1>🛍️ Our Store</h1>

      <div className="search-box">
        <input
          type="text"
          placeholder="🔍 Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="products-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              <img
                src={product.image || 'https://via.placeholder.com/300x300?text=No+Image'}
                alt={product.name}
                className="product-image"
              />
              <h3>{product.name}</h3>
              <p className="description">{product.description}</p>
              <p className="price">₨{product.price}</p>
              <p className="stock">
                {product.stock > 0 ? `✅ ${product.stock} in stock` : '❌ Out of Stock'}
              </p>

              {product.sizes && product.sizes.length > 0 && (
                <div className="size-selector">
                  <label>Select Size:</label>
                  <div className="size-options">
                    {product.sizes.map(size => (
                      <button
                        key={size}
                        className={`size-btn ${selectedSizes[product.id] === size ? 'selected' : ''}`}
                        onClick={() => handleSizeChange(product.id, size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.colors && product.colors.length > 0 && (
                <div className="size-selector">
                  <label>Select Color:</label>
                  <div className="size-options">
                    {product.colors.map(color => (
                      <button
                        key={color}
                        className={`size-btn ${selectedColors[product.id] === color ? 'selected' : ''}`}
                        onClick={() => handleColorChange(product.id, color)}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                className="btn-primary"
                onClick={() => addToCart(product)}
                disabled={product.stock === 0}
              >
                {product.stock > 0 ? '🛒 Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          ))
        ) : (
          <p className="no-products">No products found</p>
        )}
      </div>

      <div className="cart-link">
        <Link href="/cart">
          <button className="btn-secondary">📦 View Cart</button>
        </Link>
      </div>
    </div>
  );
}