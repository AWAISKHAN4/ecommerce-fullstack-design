import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X, User, LogOut, ChevronDown, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const { cartCount } = useCart();
  const userMenuRef = useRef(null);

  // Detect scroll for navbar shadow
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Products', to: '/products' },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 bg-white border-b border-gray-100 transition-shadow duration-200 ${
        isScrolled ? 'shadow-md' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-amber-400 rounded-xl flex items-center justify-center shadow-sm">
              <Package className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              Shop<span className="text-orange-500">Hub</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? 'text-orange-500'
                    : 'text-gray-600 hover:text-orange-500'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="text-sm font-medium text-purple-600 hover:text-purple-700 flex items-center gap-1"
              >
                Admin Panel
              </Link>
            )}
          </div>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex items-center flex-1 max-w-xs mx-6"
          >
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                id="navbar-search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-gray-100 border border-transparent rounded-full focus:outline-none focus:border-orange-400 focus:bg-white transition-all"
              />
            </div>
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <Link
              to="/cart"
              id="cart-icon-btn"
              className="relative p-2 text-gray-600 hover:text-orange-500 transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse-once">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  id="user-menu-btn"
                  onClick={() => setIsUserMenuOpen((v) => !v)}
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors"
                >
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-600 font-bold text-sm">
                      {user?.name?.[0]?.toUpperCase()}
                    </span>
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-purple-600 hover:bg-purple-50"
                      >
                        <Package className="w-4 h-4" />
                        Admin Panel
                      </Link>
                    )}
                    <button
                      id="logout-btn"
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/login"
                  id="login-btn"
                  className="text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  id="register-btn"
                  className="text-sm font-medium bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              id="mobile-menu-btn"
              onClick={() => setIsMenuOpen((v) => !v)}
              className="md:hidden p-2 text-gray-600"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 space-y-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </form>

            {/* Mobile Nav Links */}
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="block py-2 text-gray-700 font-medium"
              >
                {link.label}
              </Link>
            ))}

            {!isAuthenticated ? (
              <div className="flex gap-3 pt-2">
                <Link to="/login" className="flex-1 text-center py-2 border border-orange-500 text-orange-500 rounded-full text-sm font-medium">
                  Login
                </Link>
                <Link to="/register" className="flex-1 text-center py-2 bg-orange-500 text-white rounded-full text-sm font-medium">
                  Sign Up
                </Link>
              </div>
            ) : (
              <button onClick={handleLogout} className="w-full text-left py-2 text-red-600 font-medium">
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
