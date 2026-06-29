import { Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

/**
 * CartItem — displays a single item in the cart
 */
export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();
  const product = item.product;

  if (!product) return null;

  const handleQuantityChange = async (newQty) => {
    try {
      if (newQty < 1) {
        await removeFromCart(item._id);
        toast.success('Item removed from cart');
      } else {
        await updateQuantity(item._id, newQty);
      }
    } catch {
      toast.error('Failed to update cart');
    }
  };

  const handleRemove = async () => {
    try {
      await removeFromCart(item._id);
      toast.success('Item removed from cart');
    } catch {
      toast.error('Failed to remove item');
    }
  };

  return (
    <div className="flex gap-4 p-4 bg-white rounded-2xl border border-gray-100 hover:border-orange-200 transition-colors">
      {/* Product image */}
      <div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-gray-50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = `https://placehold.co/80x80/f97316/ffffff?text=${product.name[0]}`;
          }}
        />
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs text-orange-500 font-semibold uppercase tracking-wide">
              {product.category}
            </p>
            <h4 className="text-sm font-semibold text-gray-800 truncate">{product.name}</h4>
          </div>
          <button
            onClick={handleRemove}
            className="flex-shrink-0 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-between mt-auto pt-2">
          {/* Quantity Controls */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-full px-1 py-1">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white transition-colors"
            >
              <Minus className="w-3 h-3 text-gray-600" />
            </button>
            <span className="text-sm font-semibold text-gray-800 w-6 text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={item.quantity >= product.stock}
              className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white transition-colors disabled:opacity-40"
            >
              <Plus className="w-3 h-3 text-gray-600" />
            </button>
          </div>

          {/* Item Total */}
          <div className="text-right">
            <p className="text-base font-bold text-gray-900">
              ${(product.price * item.quantity).toFixed(2)}
            </p>
            {item.quantity > 1 && (
              <p className="text-xs text-gray-400">${product.price.toFixed(2)} each</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
