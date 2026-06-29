import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star, ShoppingCart, ArrowLeft, Package, Truck, Shield, RotateCcw, Plus, Minus } from 'lucide-react';
import { productAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await productAPI.getById(id);
        setProduct(data.product);
        setSelectedImage(0);

        // Fetch related products in same category
        const relatedRes = await productAPI.getAll({
          category: data.product.category,
          limit: 4,
        });
        setRelated(relatedRes.data.products.filter((p) => p._id !== id));
      } catch {
        toast.error('Product not found');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = async () => {
    setAddingToCart(true);
    try {
      await addToCart(product, quantity);
      toast.success(`${quantity}× "${product.name}" added to cart! 🛒`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const discount = product?.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const allImages = product ? [product.image, ...(product.images || [])].filter(Boolean) : [];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10 animate-pulse">
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="lg:w-1/2 aspect-square bg-gray-200 rounded-3xl" />
          <div className="flex-1 space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-6 bg-gray-200 rounded w-1/3" />
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <button onClick={() => navigate(-1)} className="hover:text-orange-500 flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <span>/</span>
          <Link to="/products" className="hover:text-orange-500">Products</Link>
          <span>/</span>
          <Link to={`/products?category=${product.category}`} className="hover:text-orange-500">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-gray-700 font-medium truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Main Product Section */}
        <div className="flex flex-col lg:flex-row gap-10 bg-white rounded-3xl p-6 lg:p-10 shadow-sm border border-gray-100">
          {/* Image Gallery */}
          <div className="lg:w-1/2">
            <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 mb-4 relative">
              <img
                id="product-main-image"
                src={allImages[selectedImage] || product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = `https://placehold.co/600x600/f97316/ffffff?text=${product.name[0]}`;
                }}
              />
              {discount && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                  -{discount}% OFF
                </div>
              )}
            </div>
            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                      i === selectedImage ? 'border-orange-500 scale-105' : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex-1 flex flex-col">
            <div className="mb-2">
              <span className="inline-block bg-orange-50 text-orange-600 text-xs font-bold px-3 py-1 rounded-full">
                {product.category}
              </span>
              {product.brand && (
                <span className="ml-2 text-xs text-gray-500">by {product.brand}</span>
              )}
            </div>

            <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 mb-4 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.round(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-gray-700">{product.rating.toFixed(1)}</span>
              <span className="text-sm text-gray-400">({product.reviewCount} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-extrabold text-gray-900">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-lg text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
              )}
              {discount && (
                <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                  Save {discount}%
                </span>
              )}
            </div>

            {/* Stock */}
            <div className={`flex items-center gap-2 mb-6 text-sm font-semibold ${
              product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-amber-600' : 'text-red-600'
            }`}>
              <Package className="w-4 h-4" />
              {product.stock > 10
                ? `In Stock (${product.stock} available)`
                : product.stock > 0
                ? `Only ${product.stock} left!`
                : 'Out of Stock'}
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm leading-relaxed mb-8">{product.description}</p>

            {/* Quantity + Add to Cart */}
            {product.stock > 0 && (
              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center gap-3 bg-gray-100 rounded-full px-4 py-2">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white transition-colors"
                  >
                    <Minus className="w-4 h-4 text-gray-700" />
                  </button>
                  <span id="quantity-display" className="w-8 text-center font-bold text-gray-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white transition-colors"
                  >
                    <Plus className="w-4 h-4 text-gray-700" />
                  </button>
                </div>
                <button
                  id="add-to-cart-detail-btn"
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-full transition-all hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {addingToCart ? 'Adding...' : 'Add to Cart'}
                </button>
              </div>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 border-t border-gray-100 pt-6">
              {[
                { icon: Truck, text: 'Free Shipping\nover $50' },
                { icon: Shield, text: 'Secure\nCheckout' },
                { icon: RotateCcw, text: '30-Day\nReturns' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex flex-col items-center gap-1 text-center">
                  <Icon className="w-5 h-5 text-orange-500" />
                  <span className="text-xs text-gray-500 whitespace-pre-line">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {related.slice(0, 4).map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
