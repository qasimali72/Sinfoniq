import { useState, useEffect } from 'react';
import Link from 'next/link';

// ⚠️ FILL THESE IN FROM YOUR CLOUDINARY DASHBOARD (Settings → Upload)
const CLOUDINARY_CLOUD_NAME = 'YOUR_CLOUD_NAME';
const CLOUDINARY_UPLOAD_PRESET = 'YOUR_UPLOAD_PRESET';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const DEFAULT_CATEGORIES = ['clothing', 'shoes', 'accessories', 'electronics'];

export default function AddProduct() {
  // ⚠️ CHANGE THIS PASSWORD BEFORE DEPLOYING
  const ADMIN_PASSWORD = 'Sinfoniq@Admin2024#Secure';

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('adminLogin');
    if (saved === 'true') {
      setIsLoggedIn(true);
      loadProducts();
    }
  }, []);

  const loadProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts([]);
    }
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPassword === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      localStorage.setItem('adminLogin', 'true');
      setAdminPassword('');
      loadProducts();
      showNotification('✅ Login successful!', 'success');
    } else {
      showNotification('❌ Wrong password!', 'error');
      setAdminPassword('');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('adminLogin');
    setProducts([]);
    showNotification('👋 Logged out successfully', 'info');
  };

  const deleteProduct = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const response = await fetch(`/api/products?id=${productId}`, { method: 'DELETE' });
      if (response.ok) {
        setProducts(products.filter(p => p.id !== productId));
        showNotification('🗑️ Product deleted successfully!', 'success');
      }
    } catch (error) {
      showNotification('❌ Error deleting product', 'error');
    }
  };

  const showNotification = (message, type = 'info') => {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `<span>${message}</span><button onclick="this.parentElement.remove()" style="background:none;border:none;color:white;font-size:1.2rem;cursor:pointer;">×</button>`;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.classList.add('notification-hide');
      setTimeout(() => notification.remove(), 300);
    }, 4000);
  };

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    stock: '',
    category: '',
    customCategory: '',
    sizes: [],
    colors: ''
  });
  const [images, setImages] = useState([]); // array of Cloudinary URLs
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleSize = (size) => {
    setFormData(prev => {
      const has = prev.sizes.includes(size);
      return {
        ...prev,
        sizes: has ? prev.sizes.filter(s => s !== size) : [...prev.sizes, size]
      };
    });
  };

  // Upload a single file to Cloudinary, return its hosted URL
  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: 'POST', body: data }
    );

    if (!res.ok) throw new Error('Cloudinary upload failed');
    const result = await res.json();
    return result.secure_url;
  };

  const handleImageSelect = async (e) => {
    const files = Array.from(e.target.files);

    if (images.length + files.length > 6) {
      showNotification('⚠️ Maximum 6 images allowed', 'warning');
      return;
    }
    if (files.length === 0) return;

    if (CLOUDINARY_CLOUD_NAME === 'YOUR_CLOUD_NAME') {
      showNotification('⚠️ Cloudinary not configured yet — see setup notes in the code', 'error');
      return;
    }

    setUploading(true);
    try {
      const uploaded = [];
      for (const file of files) {
        const url = await uploadToCloudinary(file);
        uploaded.push(url);
      }
      setImages(prev => [...prev, ...uploaded]);
      showNotification(`✅ ${uploaded.length} image(s) uploaded`, 'success');
    } catch (err) {
      showNotification('❌ Image upload failed. Check Cloudinary setup.', 'error');
    } finally {
      setUploading(false);
      e.target.value = ''; // allow re-selecting the same file
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      if (!formData.name || !formData.price || !formData.stock) {
        throw new Error('Please fill in all required fields');
      }
      if (images.length < 3) {
        throw new Error('Please upload at least 3 images');
      }

      const finalCategory = formData.category === '__custom__'
        ? formData.customCategory.trim()
        : formData.category;

      if (!finalCategory) {
        throw new Error('Please select or enter a category');
      }

      const product = {
        id: Date.now(),
        name: formData.name,
        price: parseInt(formData.price),
        description: formData.description,
        images: images,           // array of 3-6 URLs
        image: images[0],         // first image used as the primary/thumbnail
        stock: parseInt(formData.stock),
        category: finalCategory,
        sizes: formData.sizes,    // e.g. ['S', 'M', 'L']
        colors: formData.colors.split(',').map(c => c.trim()).filter(Boolean),
        createdAt: new Date().toISOString()
      };

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });

      if (!response.ok) throw new Error('Failed to add product');

      setFormData({
        name: '', price: '', description: '', stock: '',
        category: '', customCategory: '', sizes: [], colors: ''
      });
      setImages([]);
      setSuccess(true);
      showNotification('✅ Product added successfully!', 'success');
      loadProducts();
      setTimeout(() => setSuccess(false), 3000);

    } catch (err) {
      setError(err.message);
      showNotification(`❌ ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

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
                placeholder="••••••••"
                autoFocus
                style={{ fontSize: '1.1rem', padding: '12px' }}
              />
            </div>
            <button type="submit" className="btn-primary btn-large">🔓 Login to Admin</button>
            <Link href="/">
              <button type="button" className="btn-secondary btn-large">← Back to Store</button>
            </Link>
          </form>
          <p style={{ marginTop: '30px', color: '#666' }}>⚠️ Only admin can access this page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>➕ Add New Product</h1>
        <button onClick={handleLogout} className="btn-danger">🚪 Logout</button>
      </div>

      <div className="admin-panel">
        <form onSubmit={handleSubmit} className="product-form">

          {success && <div className="alert alert-success">✅ Product added successfully!</div>}
          {error && <div className="alert alert-error">❌ {error}</div>}

          <div className="form-group">
            <label>Product Name * (Required)</label>
            <input type="text" name="name" value={formData.name} onChange={handleInputChange}
              placeholder="e.g., Premium Cotton Shirt" required />
          </div>

          <div className="form-group">
            <label>Price (₨) * (Required)</label>
            <input type="number" name="price" value={formData.price} onChange={handleInputChange}
              placeholder="e.g., 500" min="1" required />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange}
              placeholder="Product description and details" rows="4" />
          </div>

          {/* MULTI-IMAGE UPLOAD */}
          <div className="form-group">
            <label>Product Images * (3–6 required)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
              disabled={uploading || images.length >= 6}
            />
            {uploading && <p style={{ color: '#007bff', marginTop: '8px' }}>⏳ Uploading...</p>}

            {images.length > 0 && (
              <div className="image-gallery-preview">
                {images.map((url, i) => (
                  <div key={i} className="image-gallery-item">
                    <img src={url} alt={`Product ${i + 1}`} />
                    <button type="button" onClick={() => removeImage(i)} className="image-remove-btn">×</button>
                  </div>
                ))}
              </div>
            )}
            <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '6px' }}>
              {images.length} / 6 images uploaded {images.length < 3 && '(minimum 3 required)'}
            </p>
          </div>

          <div className="form-group">
            <label>Stock Quantity * (Required)</label>
            <input type="number" name="stock" value={formData.stock} onChange={handleInputChange}
              placeholder="e.g., 50" min="0" required />
          </div>

          {/* SIZES */}
          <div className="form-group">
            <label>Available Sizes</label>
            <div className="size-options">
              {SIZES.map(size => (
                <button
                  key={size}
                  type="button"
                  className={`size-btn ${formData.sizes.includes(size) ? 'selected' : ''}`}
                  onClick={() => toggleSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* COLORS */}
          <div className="form-group">
            <label>Available Colors (comma-separated)</label>
            <input
              type="text"
              name="colors"
              value={formData.colors}
              onChange={handleInputChange}
              placeholder="e.g., Red, Blue, Black"
            />
          </div>

          {/* CATEGORY + CUSTOM CATEGORY */}
          <div className="form-group">
            <label>Category</label>
            <select name="category" value={formData.category} onChange={handleInputChange}>
              <option value="">Select Category</option>
              {DEFAULT_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
              ))}
              <option value="__custom__">+ Add New Category</option>
            </select>
          </div>

          {formData.category === '__custom__' && (
            <div className="form-group">
              <label>New Category Name</label>
              <input
                type="text"
                name="customCategory"
                value={formData.customCategory}
                onChange={handleInputChange}
                placeholder="e.g., Winter Wear"
              />
            </div>
          )}

          <div className="form-actions">
            <button type="submit" className="btn-primary btn-large" disabled={loading || uploading}>
              {loading ? '⏳ Adding Product...' : '➕ Add Product'}
            </button>
          </div>
        </form>

        <div className="help-box">
          <h3>📝 Instructions:</h3>
          <ul>
            <li>✅ Upload 3–6 product images (select multiple files at once)</li>
            <li>✅ Pick all sizes this product comes in</li>
            <li>✅ List colors separated by commas</li>
            <li>✅ Choose a category, or add your own</li>
          </ul>
        </div>
      </div>

      <section style={{ marginTop: '60px' }}>
        <h2>📦 Manage Products ({products.length})</h2>
        {products.length > 0 ? (
          <div className="products-table">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8f9fa' }}>
                  <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Product Name</th>
                  <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Price</th>
                  <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Stock</th>
                  <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Category</th>
                  <th style={{ padding: '10px', textAlign: 'center', borderBottom: '2px solid #dee2e6' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                    <td style={{ padding: '10px' }}>{product.name}</td>
                    <td style={{ padding: '10px' }}>₨{product.price}</td>
                    <td style={{ padding: '10px' }}>{product.stock}</td>
                    <td style={{ padding: '10px' }}>{product.category || '—'}</td>
                    <td style={{ padding: '10px', textAlign: 'center' }}>
                      <button onClick={() => deleteProduct(product.id)} className="btn-danger">🗑️ Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>
            No products yet. Add your first product above!
          </p>
        )}
      </section>
    </div>
  );
}