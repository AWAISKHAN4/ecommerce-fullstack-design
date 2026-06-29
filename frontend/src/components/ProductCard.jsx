import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

/**
 * ProductCard — displays a product in the grid/listing view
 * @param {Object} product - Product data from the API
 */
export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const handleAddToCart = async (e) => {
    e.preventDefault(); // Prevent Link navigation
    try {
      await addToCart(product, 1);
      toast.success(`"${product.name}" added to cart!`, { icon: '🛒' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  return (
    <Link
      to={`/products/${product._id}`}
      id={`product-card-${product._id}`}
      className="group bg-white rounded-2xl border border-gray-100 hover:border-orange-200 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-square bg-gray-50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.target.src = `https://placehold.co/400x400/f97316/ffffff?text=${encodeURIComponent(product.name[0])}`;
          }}
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {discount && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              -{discount}%
            </span>
          )}
          {product.featured && (
            <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              ★ Featured
            </span>
          )}
          {product.stock === 0 && (
            <span className="bg-gray-700 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              Out of Stock
            </span>
          )}
        </div>
        {/* Wishlist button */}
        <button
          onClick={(e) => { e.preventDefault(); toast('Wishlist coming soon!'); }}
          className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
        >
          <Heart className="w-4 h-4 text-gray-500 hover:text-red-500" />
        </button>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-orange-500 font-semibold mb-1 uppercase tracking-wide">
          {product.category}
        </p>
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-2 group-hover:text-orange-500 transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${
                i < Math.round(product.rating)
                  ? 'text-amber-400 fill-amber-400'
                  : 'text-gray-200 fill-gray-200'
              }`}
            />
          ))}
          <span className="text-xs text-gray-400 ml-1">({product.reviewCount})</span>
        </div>

        {/* Price + Cart */}
        <div className="flex items-center justify-between mt-auto gap-1">
          <div className="flex flex-wrap items-baseline gap-x-1.5">
            <span className="text-base sm:text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <button
            id={`add-to-cart-${product._id}`}
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="flex-shrink-0 flex items-center justify-center gap-1.5 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white text-xs font-semibold w-8 h-8 sm:w-auto sm:h-auto sm:px-3 sm:py-2 rounded-full transition-all hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:hover:scale-100"
            title={product.stock === 0 ? 'Sold Out' : 'Add to Cart'}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{product.stock === 0 ? 'Sold Out' : 'Add'}</span>
          </button>
        </div>
      </div>
    </Link>
  );
}
