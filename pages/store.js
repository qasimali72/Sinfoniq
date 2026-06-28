import { useState, useEffect } from 'react';
import Link from 'next/link';

// Sample products (replace with database fetch)
const SAMPLE_PRODUCTS = [
  {
    id: 1,
    name: 'Premium Shirt',
    price: 500,
    image: 'https://via.placeholder.com/300x300?text=Premium+Shirt',
    stock: 50,
    description: 'High quality cotton shirt'
  },
  {
    id: 2,
    name: 'Jeans',
    price: 800,
    image: 'https://via.placeholder.com/300x300?text=Jeans',
    stock: 30,
    description: 'Comfortable denim jeans'
  },
  {
    id: 3,
    name: 'Running Shoes',
    price: 1200,
    image: 'https://via.placeholder.com/300x300?text=Shoes',
    stock: 25,
    description: 'Professional running shoes'
  },
  {
    id: 4,
    name: 'Winter Jacket',
    price: 1500,
    image: 'https://via.placeholder.com/300x300?text=Jacket',
    stock: 15,
    description: 'Warm and stylish winter jacket'
  },
  {
    id: 5,
    name: 'Cotton Cap',
    price: 300,
    image: 'https://via.placeholder.com/300x300?text=Cap',
    stock: 100,
    description: 'Comfortable cotton cap'
  },
  {
    id: 6,
    name: 'Sports Watch',
    price: 2000,
    image: 'https://via.placeholder.com/300x300?text=Watch',
    stock: 20,
    description: 'Digital sports watch'
  }
];

export default function Store() {
  const [products, setProducts] = useState(SAMPLE_PRODUCTS);
  const [search, setSearch] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(SAMPLE_PRODUCTS);

  // Fetch products from API
  useEffect(() => {
    // TODO: Replace with actual API call
    // fetch('/api/products')
    //   .then(res => res.json())
    //   .then(data => {
    //     setProducts(data);
    //     setFilteredProducts(data);
    //   });
  }, []);

  // Filter products based on search
  useEffect(() => {
    const filtered = products.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [search, products]);

  const addToCart = (product) => {
    // Get existing cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if product already in cart
    const existing = cart.find(item => item.id === product.id);
    
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="container">
      <h1>Our Store</h1>
      
      <div className="search-box">
        <input
          type="text"
          placeholder="Search products..."
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
                src={product.image} 
                alt={product.name}
                className="product-image"
              />
              <h3>{product.name}</h3>
              <p className="description">{product.description}</p>
              <p className="price">₨{product.price}</p>
              <p className="stock">Stock: {product.stock}</p>
              <button 
                className="btn-primary"
                onClick={() => addToCart(product)}
                disabled={product.stock === 0}
              >
                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          ))
        ) : (
          <p className="no-products">No products found</p>
        )}
      </div>

      <div className="cart-link">
        <Link href="/cart">
          <button className="btn-secondary">View Cart</button>
        </Link>
      </div>
    </div>
  );
}
