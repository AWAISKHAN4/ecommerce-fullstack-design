import { Link } from 'react-router-dom';
import { Package, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Newsletter Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500">
        <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-white text-2xl font-bold">Subscribe to our Newsletter</h3>
            <p className="text-orange-100 text-sm mt-1">Get exclusive deals and updates straight to your inbox.</p>
          </div>
          <form id="newsletter-form" className="flex w-full md:w-auto gap-2" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email..."
              className="flex-1 md:w-72 px-4 py-3 rounded-full text-gray-900 text-sm focus:outline-none"
            />
            <button
              type="submit"
              className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-full text-sm font-semibold transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-amber-400 rounded-xl flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Shop<span className="text-orange-400">Hub</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Your one-stop destination for quality products at great prices. Discover thousands of items across all categories.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'Home', to: '/' },
                { label: 'All Products', to: '/products' },
                { label: 'Cart', to: '/cart' },
                { label: 'Login', to: '/login' },
                { label: 'Register', to: '/register' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="hover:text-orange-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm">
              {['Electronics', 'Clothing', 'Footwear', 'Home & Garden', 'Sports', 'Beauty'].map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/products?category=${cat}`}
                    className="hover:text-orange-400 transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                <span>123 Commerce St, Karachi, Pakistan</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-orange-400 flex-shrink-0" />
                <span>+92 300 1234567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-orange-400 flex-shrink-0" />
                <span>support@shophub.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>© 2026 ShopHub. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-orange-400">Privacy Policy</a>
            <a href="#" className="hover:text-orange-400">Terms of Service</a>
            <a href="#" className="hover:text-orange-400">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
