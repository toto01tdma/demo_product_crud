const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  show: {
    type: Boolean,
    required: true
  },
  image: {
    type: String
  }
});

module.exports = mongoose.model('Product', productSchema);
