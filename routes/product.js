const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'storages/product/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // ใช้ path.extname เพื่อดึงนามสกุลไฟล์
  }
});

const upload = multer({ storage: storage }).single('image');

// Create a new product with image upload
router.post('/', upload, async (req, res) => {
  const product = new Product({
    name: req.body.name,
    price: req.body.price,
    type: req.body.type,
    show: req.body.show === 'on',  // แปลงค่าเป็น Boolean
    description: req.body.description,
    image: req.file ? req.file.filename : null
  });

  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one product
router.get('/:id', getProduct, (req, res) => {
  res.json(res.product);
});

// Update a product with image upload
router.patch('/:id', getProduct, upload, async (req, res) => {
  if (req.body.name != null) {
    res.product.name = req.body.name;
  }
  if (req.body.price != null) {
    res.product.price = req.body.price;
  }
  if (req.body.description != null) {
    res.product.description = req.body.description;
  }
  if (req.body.type != null) {
    res.product.type = req.body.type;
  }
  if (req.body.show != null) {
    res.product.show = req.body.show === 'on';  // แปลงค่าเป็น Boolean
  }

  if (req.file) {
    // Delete old image if a new image is uploaded
    if (res.product.image) {
      fs.unlink(path.join('storages/product/', res.product.image), (err) => {
        if (err) {
          console.error(err);
        }
      });
    }
    res.product.image = req.file.filename;
  }

  try {
    const updatedProduct = await res.product.save();
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a product
router.delete('/:id', getProduct, async (req, res) => {
  try {
    // Delete image from storage
    if (res.product.image) {
      fs.unlink(path.join('storages/product/', res.product.image), (err) => {
        if (err) {
          console.error(err);
        }
      });
    }
    
    await res.product.deleteOne(); // ใช้ deleteOne()
    res.json({ message: 'Deleted Product' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware to get product by ID
async function getProduct(req, res, next) {
  let product;
  try {
    product = await Product.findById(req.params.id);
    if (product == null) {
      return res.status(404).json({ message: 'Cannot find product' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.product = product;
  next();
}

module.exports = router;
