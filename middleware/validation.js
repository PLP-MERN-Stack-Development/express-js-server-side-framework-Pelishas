const validateProduct = (req, res, next) => {
  const { name, description, price, category } = req.body;
  
  if (!name || !description || price === undefined || !category) {
    return res.status(400).json({ 
      error: 'Missing required fields: name, description, price, category' 
    });
  }
  
  if (typeof price !== 'number' || price < 0) {
    return res.status(400).json({ 
      error: 'Price must be a positive number' 
    });
  }
  
  next();
};

module.exports = { validateProduct };