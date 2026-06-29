const User = require('../models/User');
const Product = require('../models/Product');

/**
 * @desc    Get the current user's cart
 * @route   GET /api/cart
 * @access  Private
 */
const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('cart.product');
    res.json({ success: true, cart: user.cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Add an item to the cart (or increment quantity if already exists)
 * @route   POST /api/cart
 * @access  Private
 */
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check stock availability
    if (product.stock < quantity) {
      return res.status(400).json({ success: false, message: 'Insufficient stock' });
    }

    const user = await User.findById(req.user._id);
    const existingItem = user.cart.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      // Update quantity
      existingItem.quantity += quantity;
    } else {
      // Add new item
      user.cart.push({ product: productId, quantity });
    }

    await user.save();
    await user.populate('cart.product');

    res.json({ success: true, cart: user.cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update the quantity of a cart item
 * @route   PUT /api/cart/:itemId
 * @access  Private
 */
const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const user = await User.findById(req.user._id);

    const item = user.cart.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Cart item not found' });
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      user.cart.pull(req.params.itemId);
    } else {
      item.quantity = quantity;
    }

    await user.save();
    await user.populate('cart.product');

    res.json({ success: true, cart: user.cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Remove an item from the cart
 * @route   DELETE /api/cart/:itemId
 * @access  Private
 */
const removeFromCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    user.cart.pull(req.params.itemId);
    await user.save();
    await user.populate('cart.product');

    res.json({ success: true, cart: user.cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Clear the entire cart
 * @route   DELETE /api/cart
 * @access  Private
 */
const clearCart = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { cart: [] });
    res.json({ success: true, cart: [], message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
