// API route for getting, adding, and deleting products
// In-memory storage — resets when the server restarts or redeploys.
// Fine for testing; for a real store this should move to a database.

let products = [
  {
    id: 1,
    name: 'Premium Shirt',
    price: 500,
    media: [{ url: 'https://via.placeholder.com/300x300?text=Premium+Shirt', type: 'image' }],
    image: 'https://via.placeholder.com/300x300?text=Premium+Shirt',
    stock: 50,
    description: 'High quality cotton shirt',
    category: 'clothing',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Blue']
  },
  {
    id: 2,
    name: 'Jeans',
    price: 800,
    media: [{ url: 'https://via.placeholder.com/300x300?text=Jeans', type: 'image' }],
    image: 'https://via.placeholder.com/300x300?text=Jeans',
    stock: 30,
    description: 'Comfortable denim jeans',
    category: 'clothing',
    sizes: ['M', 'L', 'XL'],
    colors: ['Blue', 'Black']
  },
  {
    id: 3,
    name: 'Running Shoes',
    price: 1200,
    media: [{ url: 'https://via.placeholder.com/300x300?text=Running+Shoes', type: 'image' }],
    image: 'https://via.placeholder.com/300x300?text=Running+Shoes',
    stock: 25,
    description: 'Professional running shoes',
    category: 'shoes',
    sizes: ['M', 'L'],
    colors: ['Black', 'White']
  }
];

export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json(products);
  }

  else if (req.method === 'POST') {
    try {
      const newProduct = req.body;

      if (!newProduct.name || !newProduct.price || newProduct.stock === '' || newProduct.stock === undefined) {
        return res.status(400).json({
          error: 'Missing required fields: name, price, stock'
        });
      }

      // Accept the new { media: [{url, type}] } shape, but also fall back
      // to a plain image URL if something posts the old shape.
      const mediaArray = Array.isArray(newProduct.media) && newProduct.media.length > 0
        ? newProduct.media
        : (newProduct.image ? [{ url: newProduct.image, type: 'image' }] : []);

      if (mediaArray.length < 1) {
        return res.status(400).json({
          error: 'At least 1 photo or video is required'
        });
      }
      if (mediaArray.length > 6) {
        return res.status(400).json({
          error: 'Maximum 6 files allowed'
        });
      }

      // Thumbnail must be an image, never a video URL
      const firstImage = mediaArray.find(m => m.type === 'image');

      const product = {
        id: Date.now(),
        name: newProduct.name,
        price: parseInt(newProduct.price),
        description: newProduct.description || '',
        media: mediaArray,
        image: firstImage ? firstImage.url : null,
        stock: parseInt(newProduct.stock),
        category: newProduct.category || 'other',
        sizes: Array.isArray(newProduct.sizes) ? newProduct.sizes : [],
        colors: Array.isArray(newProduct.colors) ? newProduct.colors : [],
        createdAt: new Date().toISOString()
      };

      products.push(product);

      res.status(201).json({
        message: 'Product added successfully',
        product: product
      });

    } catch (error) {
      res.status(500).json({
        error: 'Failed to add product: ' + error.message
      });
    }
  }

  else if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      products = products.filter(p => p.id !== parseInt(id));
      res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete product' });
    }
  }

  else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}