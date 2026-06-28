// API route for getting and adding products
// This is a simple implementation using in-memory storage
// For production, use a real database like PostgreSQL

let products = [
  {
    id: 1,
    name: 'Premium Shirt',
    price: 500,
    image: 'https://via.placeholder.com/300x300?text=Premium+Shirt',
    stock: 50,
    description: 'High quality cotton shirt',
    category: 'clothing'
  },
  {
    id: 2,
    name: 'Jeans',
    price: 800,
    image: 'https://via.placeholder.com/300x300?text=Jeans',
    stock: 30,
    description: 'Comfortable denim jeans',
    category: 'clothing'
  },
  {
    id: 3,
    name: 'Running Shoes',
    price: 1200,
    image: 'https://via.placeholder.com/300x300?text=Running+Shoes',
    stock: 25,
    description: 'Professional running shoes',
    category: 'shoes'
  }
];

export default function handler(req, res) {
  if (req.method === 'GET') {
    // Get all products
    res.status(200).json(products);
  } 
  else if (req.method === 'POST') {
    // Add new product
    try {
      const newProduct = req.body;
      
      // Validate required fields
      if (!newProduct.name || !newProduct.price || !newProduct.image || newProduct.stock === '') {
        return res.status(400).json({ 
          error: 'Missing required fields: name, price, image, stock' 
        });
      }

      // Create product with ID
      const product = {
        id: Date.now(),
        name: newProduct.name,
        price: parseInt(newProduct.price),
        description: newProduct.description || '',
        image: newProduct.image,
        stock: parseInt(newProduct.stock),
        category: newProduct.category || 'other',
        createdAt: new Date().toISOString()
      };

      // Add to products array
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
    // Delete product
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
