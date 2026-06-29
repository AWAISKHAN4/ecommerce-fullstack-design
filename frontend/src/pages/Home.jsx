import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, RotateCcw, Headphones, Star, Zap } from 'lucide-react';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';

const CATEGORIES = [
  { name: 'Electronics', icon: '💻', color: 'bg-blue-50 text-blue-600' },
  { name: 'Clothing', icon: '👗', color: 'bg-pink-50 text-pink-600' },
  { name: 'Footwear', icon: '👟', color: 'bg-green-50 text-green-600' },
  { name: 'Home & Garden', icon: '🏡', color: 'bg-yellow-50 text-yellow-600' },
  { name: 'Sports', icon: '⚽', color: 'bg-orange-50 text-orange-600' },
  { name: 'Beauty', icon: '💄', color: 'bg-rose-50 text-rose-600' },
  { name: 'Books', icon: '📚', color: 'bg-indigo-50 text-indigo-600' },
  { name: 'Toys', icon: '🎮', color: 'bg-purple-50 text-purple-600' },
];

const FEATURES = [
  { icon: Truck, title: 'Free Shipping', desc: 'On orders over $50', color: 'text-blue-500' },
  { icon: Shield, title: 'Secure Payment', desc: '100% secure transactions', color: 'text-green-500' },
  { icon: RotateCcw, title: 'Easy Returns', desc: '30-day return policy', color: 'text-orange-500' },
  { icon: Headphones, title: '24/7 Support', desc: 'Dedicated customer care', color: 'text-purple-500' },
];

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroSlide, setHeroSlide] = useState(0);

  const heroSlides = [
    {
      tag: 'Summer Sale',
      title: 'Discover Amazing',
      highlight: 'Products',
      subtitle: 'Shop thousands of quality items with fast delivery and unbeatable prices.',
      cta: 'Shop Now',
      bg: 'from-orange-500 via-amber-500 to-yellow-400',
      accent: 'bg-white/20',
      emoji: '🛍️',
    },
    {
      tag: 'New Arrivals',
      title: 'Latest Tech &',
      highlight: 'Gadgets',
      subtitle: 'Explore the newest electronics, gadgets, and smart devices for modern living.',
      cta: 'Explore Electronics',
      bg: 'from-blue-600 via-indigo-500 to-purple-500',
      accent: 'bg-white/20',
      emoji: '💻',
    },
    {
      tag: 'Best Sellers',
      title: 'Top-Rated',
      highlight: 'Fashion',
      subtitle: 'Upgrade your wardrobe with premium clothing, shoes, and accessories.',
      cta: 'Browse Fashion',
      bg: 'from-rose-500 via-pink-500 to-fuchsia-500',
      accent: 'bg-white/20',
      emoji: '👗',
    },
  ];

  // Auto-advance hero slider
  useEffect(() => {
    const timer = setInterval(() => setHeroSlide((s) => (s + 1) % heroSlides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [featuredRes, newRes] = await Promise.all([
          productAPI.getAll({ featured: 'true', limit: 8 }),
          productAPI.getAll({ sort: 'newest', limit: 4 }),
        ]);
        setFeaturedProducts(featuredRes.data.products);
        setNewArrivals(newRes.data.products);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const slide = heroSlides[heroSlide];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Hero Banner ── */}
      <section
        id="hero-banner"
        className={`bg-gradient-to-br ${slide.bg} transition-all duration-700`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="flex-1 text-white">
              <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-5">
                ✨ {slide.tag}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4">
                {slide.title}
                <br />
                <span className="text-white/80">{slide.highlight}</span>
              </h1>
              <p className="text-white/80 text-lg max-w-lg mb-8">{slide.subtitle}</p>
              <div className="flex gap-4 flex-wrap">
                <Link
                  to="/products"
                  id="hero-shop-now"
                  className="bg-white text-gray-900 font-bold px-8 py-3.5 rounded-full hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                >
                  {slide.cta}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/products"
                  className="border-2 border-white/50 text-white font-semibold px-8 py-3.5 rounded-full hover:bg-white/10 transition-all"
                >
                  View All
                </Link>
              </div>
            </div>

            {/* Hero visual */}
            <div className="flex-shrink-0 text-9xl md:text-[10rem] select-none animate-bounce-slow">
              {slide.emoji}
            </div>
          </div>

          {/* Slide dots */}
          <div className="flex justify-center gap-2 mt-10">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setHeroSlide(i)}
                className={`rounded-full transition-all ${
                  i === heroSlide ? 'w-8 h-2 bg-white' : 'w-2 h-2 bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Strip ── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {FEATURES.map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{title}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Categories ── */}
      <section id="categories-section" className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Shop by Category</h2>
          <Link to="/products" className="text-sm text-orange-500 font-semibold hover:underline flex items-center gap-1">
            All Categories <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {CATEGORIES.map(({ name, icon, color }) => (
            <Link
              key={name}
              to={`/products?category=${name}`}
              id={`category-${name.replace(/\s+/g, '-').toLowerCase()}`}
              className={`${color} flex flex-col items-center gap-2 p-4 rounded-2xl hover:scale-105 transition-all cursor-pointer`}
            >
              <span className="text-3xl">{icon}</span>
              <span className="text-xs font-semibold text-center leading-tight">{name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section id="featured-products" className="max-w-7xl mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
            <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
          </div>
          <Link to="/products?featured=true" className="text-sm text-orange-500 font-semibold hover:underline flex items-center gap-1">
            See All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg">No featured products yet.</p>
          </div>
        )}
      </section>

      {/* ── Deal of the Day ── */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 py-14">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-white text-center md:text-left">
            <span className="inline-flex items-center gap-2 bg-orange-500 text-white text-sm font-bold px-4 py-1.5 rounded-full mb-4">
              <Zap className="w-4 h-4" /> Deal of the Day
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-3">
              Up to <span className="text-orange-400">60% OFF</span>
            </h2>
            <p className="text-gray-400 text-lg mb-6 max-w-md">
              Limited-time offers on our best sellers. Don't miss out on these incredible deals!
            </p>
            <Link
              to="/products"
              id="deal-shop-btn"
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3.5 rounded-full transition-all hover:scale-105"
            >
              Grab the Deal <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex gap-6 text-center">
            {[
              { label: 'Hours', value: '12' },
              { label: 'Minutes', value: '34' },
              { label: 'Seconds', value: '56' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white/10 backdrop-blur rounded-2xl px-6 py-4">
                <div className="text-4xl font-extrabold text-white">{value}</div>
                <div className="text-xs text-gray-400 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Supplier Quote Section ── */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-r from-blue-500 to-cyan-400 rounded-xl overflow-hidden shadow-lg relative" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundBlendMode: 'overlay' }}>
          <div className="absolute inset-0 bg-blue-600/80"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-8 md:p-12 gap-8">
            {/* Left Content */}
            <div className="flex-1 text-white md:pr-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                An easy way to send<br/>requests to all suppliers
              </h2>
              <p className="text-blue-50 text-base max-w-md leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt.
              </p>
            </div>
            
            {/* Right Form Card */}
            <div className="w-full max-w-[400px] bg-white rounded-xl shadow-2xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-5">Send quote to suppliers</h3>
              
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <input 
                    type="text" 
                    placeholder="What item you need?" 
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                  />
                </div>
                
                <div>
                  <textarea 
                    placeholder="Type more details" 
                    rows="3"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none placeholder-gray-400"
                  ></textarea>
                </div>
                
                <div className="flex gap-3">
                  <input 
                    type="text" 
                    placeholder="Quantity" 
                    className="w-1/2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                  />
                  <div className="relative w-1/2">
                    <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700">
                      <option>Pcs</option>
                      <option>Kg</option>
                      <option>Boxes</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                    </div>
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg text-sm transition-colors mt-2"
                >
                  Send inquiry
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ── New Arrivals ── */}
      {newArrivals.length > 0 && (
        <section id="new-arrivals" className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">🆕 New Arrivals</h2>
            <Link to="/products" className="text-sm text-orange-500 font-semibold hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {newArrivals.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
