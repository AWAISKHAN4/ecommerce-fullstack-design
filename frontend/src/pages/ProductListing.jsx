import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';

const CATEGORIES = ['Electronics', 'Clothing', 'Footwear', 'Home & Garden', 'Sports', 'Beauty', 'Books', 'Toys', 'Automotive', 'Food'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'name-asc', label: 'A – Z' },
];

export default function ProductListing() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, currentPage: 1 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Filter state — synced with URL params
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || 'newest',
    page: Number(searchParams.get('page')) || 1,
  });

  const [searchInput, setSearchInput] = useState(filters.search);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.category) params.category = filters.category;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.sort) params.sort = filters.sort;
      if (searchParams.get('featured')) params.featured = 'true';
      params.page = filters.page;
      params.limit = 12;

      const { data } = await productAPI.getAll(params);
      setProducts(data.products);
      setPagination({ total: data.total, totalPages: data.totalPages, currentPage: data.currentPage });
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, searchParams]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // Sync filters to URL
  useEffect(() => {
    const params = {};
    if (filters.search) params.search = filters.search;
    if (filters.category) params.category = filters.category;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    if (filters.sort !== 'newest') params.sort = filters.sort;
    if (filters.page > 1) params.page = filters.page;
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({ search: '', category: '', minPrice: '', maxPrice: '', sort: 'newest', page: 1 });
    setSearchInput('');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateFilter('search', searchInput);
  };

  const hasActiveFilters = filters.search || filters.category || filters.minPrice || filters.maxPrice;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {filters.category ? filters.category : 'All Products'}
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            {loading ? 'Loading...' : `${pagination.total} products found`}
            {filters.search && (
              <span> for "<strong>{filters.search}</strong>"</span>
            )}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          {/* Search */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-sm">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="product-search-input"
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </div>
          </form>

          <div className="flex items-center gap-3">
            {/* Filter toggle (mobile) */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-orange-400"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <span className="w-2 h-2 bg-orange-500 rounded-full" />
              )}
            </button>

            {/* Sort */}
            <div className="relative">
              <select
                id="sort-select"
                value={filters.sort}
                onChange={(e) => updateFilter('sort', e.target.value)}
                className="appearance-none pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:border-orange-400 cursor-pointer"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 px-4 py-2.5 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100"
              >
                <X className="w-4 h-4" /> Clear
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filters — Desktop */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <FilterPanel
              filters={filters}
              updateFilter={updateFilter}
              clearFilters={clearFilters}
            />
          </aside>

          {/* Mobile Sidebar Overlay */}
          {isSidebarOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/40" onClick={() => setIsSidebarOpen(false)} />
              <div className="absolute left-0 top-0 bottom-0 w-72 bg-white p-6 overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold">Filters</h3>
                  <button onClick={() => setIsSidebarOpen(false)}>
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <FilterPanel
                  filters={filters}
                  updateFilter={updateFilter}
                  clearFilters={clearFilters}
                />
              </div>
            </div>
          )}

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                    <div className="aspect-square bg-gray-200" />
                    <div className="p-4 space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-1/3" />
                      <div className="h-4 bg-gray-200 rounded" />
                      <div className="h-4 bg-gray-200 rounded w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">No products found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters or search terms.</p>
                <button onClick={clearFilters} className="btn-primary">
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-10">
                    <button
                      onClick={() => updateFilter('page', filters.page - 1)}
                      disabled={filters.page === 1}
                      className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium disabled:opacity-40 hover:border-orange-400 transition-colors"
                    >
                      Previous
                    </button>
                    {[...Array(pagination.totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => updateFilter('page', i + 1)}
                        className={`w-9 h-9 rounded-xl text-sm font-semibold transition-colors ${
                          filters.page === i + 1
                            ? 'bg-orange-500 text-white'
                            : 'border border-gray-200 hover:border-orange-400'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => updateFilter('page', filters.page + 1)}
                      disabled={filters.page === pagination.totalPages}
                      className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium disabled:opacity-40 hover:border-orange-400 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterPanel({ filters, updateFilter, clearFilters }) {
  return (
    <div className="space-y-6">
      {/* Category filter */}
      <div>
        <h4 className="text-sm font-bold text-gray-900 mb-3">Category</h4>
        <div className="space-y-2">
          <button
            onClick={() => updateFilter('category', '')}
            className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
              !filters.category ? 'bg-orange-50 text-orange-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            All Categories
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              id={`filter-${cat.replace(/\s+/g, '-').toLowerCase()}`}
              onClick={() => updateFilter('category', filters.category === cat ? '' : cat)}
              className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                filters.category === cat ? 'bg-orange-50 text-orange-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <h4 className="text-sm font-bold text-gray-900 mb-3">Price Range</h4>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => updateFilter('minPrice', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-orange-400"
            min="0"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => updateFilter('maxPrice', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-orange-400"
            min="0"
          />
        </div>
      </div>
    </div>
  );
}
