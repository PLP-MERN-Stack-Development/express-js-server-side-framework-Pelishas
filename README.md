# Express.js RESTful API with MongoDB

A complete RESTful API built with Express.js and MongoDB, featuring CRUD operations, authentication, validation, and advanced features.

## Features

- ✅ RESTful API endpoints for product management
- ✅ MongoDB integration with Mongoose
- ✅ Custom middleware (logging, authentication, validation)
- ✅ Comprehensive error handling
- ✅ Filtering, pagination, and search functionality
- ✅ Product statistics endpoint

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file from `.env.example` and add your MongoDB URI and API key

3. Start the server:
   ```bash
   npm start
   ```

## API Endpoints

### Products

- `GET /api/products` - Get all products (supports pagination, filtering, search)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product (requires API key)
- `PUT /api/products/:id` - Update product (requires API key)
- `DELETE /api/products/:id` - Delete product (requires API key)
- `GET /api/products/search/:name` - Search products by name
- `GET /api/stats` - Get product statistics by category

### Query Parameters

- `category` - Filter by category
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `search` - Search by product name

## Authentication

Protected endpoints require an API key in the `x-api-key` header.

## Example Requests

### Get all products with pagination
```bash
GET /api/products?page=1&limit=5&category=electronics
```

### Create a product
```bash
POST /api/products
Headers: x-api-key: your_api_key_here
Body: {
  "name": "New Product",
  "description": "Product description",
  "price": 99.99,
  "category": "electronics",
  "inStock": true
}
```

### Search products
```bash
GET /api/products/search/laptop
```

## Project Structure

```
├── config/
│   └── db.js              # MongoDB connection
├── middleware/
│   ├── auth.js            # Authentication middleware
│   ├── errorHandler.js    # Error handling
│   ├── logger.js          # Request logging
│   └── validation.js      # Input validation
├── models/
│   └── Product.js         # Product schema
├── server.js              # Main server file
├── .env                   # Environment variables
└── .env.example           # Environment template
``` 