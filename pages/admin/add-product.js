import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AddProduct() {
  // Admin Password Protection
  const ADMIN_PASSWORD = 'admin123'; // CHANGE THIS!
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');

  // Check if already logged in
  useEffect(() => {
    const saved = localStorage.getItem('adminLogin');
    if (saved === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPassword === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      localStorage.setItem('adminLogin', 'true');
      setAdminPassword('');
    } else {
      alert('❌ Wrong password!');
      setAdminPassword('');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('adminLogin');
  };

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    stock: '',
    category: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Validate form
      if (!formData.name || !formData.price || !formData.image || !formData.stock) {
        throw new Error('Please fill in all required fields');
      }

      // Create product object
      const product = {
        id: Date.now(),
        name: formData.name,
        price: parseInt(formData.price),
        description: formData.description,
        image: formData.image,
        stock: parseInt(formData.stock),
        category: formData.category,
        createdAt: new Date().toISOString()
      };

      // Send to API
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
      });

      if (!response.ok) {
        throw new Error('Failed to add product');
      }

      // Reset form
      setFormData({
        name: '',
        price: '',
        description: '',
        image: '',
        stock: '',
        category: ''
      });

      setSuccess(true);
      setLoading(false);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);

    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Show login form if not logged in
  if (!isLoggedIn) {
    return (
      <div className="container">
        <div style={{ maxWidth: '400px', margin: '100px auto', textAlign: 'center' }}>
          <h1>🔐 Admin Login</h1>
          <form onSubmit={handleAdminLogin} style={{ marginTop: '30px' }}>
            <div className="form-group">
              <label>Enter Admin Password:</label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Password"
                autoFocus
                style={{ fontSize: '1.1rem', padding: '12px' }}
              />
            </div>
            <button type="submit" className="btn-primary btn-large">
              Login to Admin
            </button>
            <Link href="/">
              <button type="button" className="btn-secondary btn-large">
                Back to Store
              </button>
            </Link>
          </form>
          <p style={{ marginTop: '30px', color: '#666' }}>
            ⚠️ Only admin can access this page
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Add New Product</h1>
        <button onClick={handleLogout} className="btn-danger" style={{ height: '40px' }}>
          Logout
        </button>
      </div>
      
      <div className="admin-panel">
        <form onSubmit={handleSubmit} className="product-form">
          
          {success && (
            <div className="alert alert-success">
              ✓ Product added successfully!
            </div>
          )}

          {error && (
            <div className="alert alert-error">
              ✗ {error}
            </div>
          )}

          <div className="form-group">
            <label>Product Name * (Required)</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Premium Cotton Shirt"
              required
            />
          </div>

          <div className="form-group">
            <label>Price (₨) * (Required)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="e.g., 500"
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Product description and details"
              rows="4"
            />
          </div>

          <div className="form-group">
            <label>Image URL * (Required)</label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              placeholder="https://example.com/image.jpg"
              required
            />
            {formData.image && (
              <div className="image-preview">
                <p>Preview:</p>
                <img src={formData.image} alt="Product" onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x300?text=Image+Error';
                }} />
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Stock Quantity * (Required)</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              placeholder="e.g., 50"
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select 
              name="category"
              value={formData.category}
              onChange={handleInputChange}
            >
              <option value="">Select Category</option>
              <option value="clothing">Clothing</option>
              <option value="shoes">Shoes</option>
              <option value="accessories">Accessories</option>
              <option value="electronics">Electronics</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn-primary btn-large"
              disabled={loading}
            >
              {loading ? 'Adding Product...' : 'Add Product'}
            </button>

            <Link href="/store">
              <button type="button" className="btn-secondary btn-large">
                View Store
              </button>
            </Link>
          </div>
        </form>

        <div className="help-box">
          <h3>Image URL Tips:</h3>
          <ul>
            <li>Use Cloudinary for free image hosting</li>
            <li>Or use placeholder: https://via.placeholder.com/300x300?text=ProductName</li>
            <li>Make sure URL starts with https://</li>
            <li>Supported formats: JPG, PNG, WebP</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
