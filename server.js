require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const Product = require('./models/Product');
const logger = require('./middleware/logger');
const auth = require('./middleware/auth');
const { validateProduct } = require('./middleware/validation');
const { errorHandler, NotFoundError } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.json());
app.use(logger);

app.get('/', (req, res) => {
  res.send('Welcome to the Product API! Go to /api/products to see all products.');
});

app.get('/products', async (req, res, next) => {
  try {
    const { category, page = 1, limit = 10, search } = req.query;
    const query = {};
    
    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };
    
    const products = await Product.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Product.countDocuments(query);
    
    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    next(error);
  }
});

app.get('/api/products/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      throw new NotFoundError('Product not found');
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
});

app.post('/api/products', auth, validateProduct, async (req, res, next) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
});

app.put('/api/products/:id', auth, validateProduct, async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) {
      throw new NotFoundError('Product not found');
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
});

app.delete('/api/products/:id', auth, async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      throw new NotFoundError('Product not found');
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
});

app.get('/api/products/search/:name', async (req, res, next) => {
  try {
    const products = await Product.find({
      name: { $regex: req.params.name, $options: 'i' }
    });
    res.json(products);
  } catch (error) {
    next(error);
  }
});

app.get('/api/stats', async (req, res, next) => {
  try {
    const stats = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' }
        }
      }
    ]);
    res.json(stats);
  } catch (error) {
    next(error);
  }
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app; 