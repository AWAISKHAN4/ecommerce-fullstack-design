import { Link } from 'react-router-dom';
import { ShoppingCart, ArrowRight, Trash2, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CartItem from '../components/CartItem';
import toast from 'react-hot-toast';

const SHIPPING_THRESHOLD = 50;
const SHIPPING_COST = 5.99;

export default function Cart() {
  const { items, cartTotal, clearCart, loading } = useCart();
  const { isAuthenticated } = useAuth();

  const shipping = cartTotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = cartTotal * 0.08; // 8% tax
  const total = cartTotal + shipping + tax;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast('Please log in to proceed to checkout', { icon: '🔐' });
      return;
    }
    toast.success('Checkout coming soon! 🎉');
  };

  const handleClear = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      await clearCart();
      toast.success('Cart cleared');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-500 mt-1 text-sm">
              {items.length === 0
                ? 'Your cart is empty'
                : `${items.reduce((s, i) => s + i.quantity, 0)} item(s) in your cart`}
            </p>
          </div>
          {items.length > 0 && (
            <button
              id="clear-cart-btn"
              onClick={handleClear}
              className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 font-medium"
            >
              <Trash2 className="w-4 h-4" />
              Clear Cart
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {items.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-6">
              <ShoppingCart className="w-12 h-12 text-orange-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-700 mb-3">Your cart is empty</h2>
            <p className="text-gray-500 mb-8 max-w-sm">
              Looks like you haven't added anything yet. Browse our products and discover something you'll love!
            </p>
            <Link
              to="/products"
              id="continue-shopping-btn"
              className="btn-primary flex items-center gap-2"
            >
              Start Shopping <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="flex-1 space-y-4">
              {items.map((item) => (
                <CartItem key={item._id} item={item} />
              ))}

              {/* Continue shopping link */}
              <Link
                to="/products"
                className="inline-flex items-center gap-2 text-sm text-orange-500 font-semibold hover:underline mt-4"
              >
                <ArrowRight className="w-4 h-4 rotate-180" /> Continue Shopping
              </Link>
            </div>

            {/* Order Summary */}
            <div className="lg:w-80 flex-shrink-0">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                {/* Shipping progress */}
                {cartTotal < SHIPPING_THRESHOLD && (
                  <div className="mb-6 p-4 bg-orange-50 rounded-xl">
                    <p className="text-sm text-orange-700 font-medium mb-2">
                      Add <strong>${(SHIPPING_THRESHOLD - cartTotal).toFixed(2)}</strong> more for free shipping!
                    </p>
                    <div className="w-full bg-orange-200 rounded-full h-2">
                      <div
                        className="bg-orange-500 h-2 rounded-full transition-all"
                        style={{ width: `${Math.min(100, (cartTotal / SHIPPING_THRESHOLD) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Coupon */}
                <div className="flex gap-2 mb-6">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Coupon code"
                      className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400"
                    />
                  </div>
                  <button className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-sm font-semibold rounded-xl transition-colors">
                    Apply
                  </button>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-semibold">${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Shipping</span>
                    <span className={`font-semibold ${shipping === 0 ? 'text-green-600' : ''}`}>
                      {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tax (8%)</span>
                    <span className="font-semibold">${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-100 pt-3 flex justify-between">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="text-xl font-extrabold text-gray-900">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  id="checkout-btn"
                  onClick={handleCheckout}
                  className="w-full btn-primary flex items-center justify-center gap-2 py-4 text-base"
                >
                  {isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
                  <ArrowRight className="w-5 h-5" />
                </button>

                {!isAuthenticated && (
                  <p className="text-center text-xs text-gray-400 mt-3">
                    <Link to="/login" className="text-orange-500 font-semibold hover:underline">Sign in</Link> to save your cart and checkout
                  </p>
                )}

                {/* Trust */}
                <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400">
                  <span>🔒 Secure Checkout</span>
                  <span>·</span>
                  <span>256-bit SSL</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
