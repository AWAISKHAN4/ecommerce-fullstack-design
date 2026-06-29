const mongoose = require('mongoose');

/**
 * Product Schema
 * Core entity for the eCommerce store
 * Fields: id, name, price, image, description, category, stock (as required)
 */
const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [100, 'Product name cannot exceed 100 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    originalPrice: {
      type: Number,
      default: null, // For showing crossed-out original price
    },
    image: {
      type: String,
      required: [true, 'Product image URL is required'],
    },
    images: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Electronics',
        'Clothing',
        'Footwear',
        'Home & Garden',
        'Sports',
        'Beauty',
        'Books',
        'Toys',
        'Automotive',
        'Food',
      ],
    },
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    brand: {
      type: String,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

// Index for search functionality
ProductSchema.index({ name: 'text', description: 'text', category: 'text' });

module.exports = mongoose.model('Product', ProductSchema);
