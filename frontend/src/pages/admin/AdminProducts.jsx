import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Users, ShoppingCart, TrendingUp, Plus, Edit, Trash2, Search, X } from 'lucide-react';
import { productAPI } from '../../services/api';
import toast from 'react-hot-toast';

const CATEGORIES = ['Electronics', 'Clothing', 'Footwear', 'Home & Garden', 'Sports', 'Beauty', 'Books', 'Toys', 'Automotive', 'Food'];

const emptyForm = {
  name: '', price: '', originalPrice: '', image: '', description: '',
  category: 'Electronics', stock: '', brand: '', featured: false,
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formLoading, setFormLoading] = useState(false);
  const [stats, setStats] = useState({ total: 0, featured: 0, outOfStock: 0 });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await productAPI.getAll({ limit: 100 });
      setProducts(data.products);
      setStats({
        total: data.total,
        featured: data.products.filter((p) => p.featured).length,
        outOfStock: data.products.filter((p) => p.stock === 0).length,
      });
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const openAdd = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice || '',
      image: product.image,
      description: product.description,
      category: product.category,
      stock: product.stock,
      brand: product.brand || '',
      featured: product.featured,
    });
    setShowModal(true);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await productAPI.delete(id);
      toast.success('Product deleted');
      fetchProducts();
    } catch {
      toast.error('Failed to delete product');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
        stock: Number(form.stock),
      };

      if (editingProduct) {
        await productAPI.update(editingProduct._id, payload);
        toast.success('Product updated!');
      } else {
        await productAPI.create(payload);
        toast.success('Product created!');
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-sm text-gray-500">Manage your store's products</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-sm text-gray-500 hover:text-orange-500">← Back to Store</Link>
            <button
              id="add-product-btn"
              onClick={openAdd}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-full transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Product
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Products', value: stats.total, icon: Package, color: 'bg-blue-50 text-blue-600' },
            { label: 'Featured', value: stats.featured, icon: TrendingUp, color: 'bg-orange-50 text-orange-600' },
            { label: 'Out of Stock', value: stats.outOfStock, icon: ShoppingCart, color: 'bg-red-50 text-red-600' },
            { label: 'Categories', value: CATEGORIES.length, icon: Users, color: 'bg-green-50 text-green-600' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-gray-900">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-5 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            id="admin-search"
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400"
          />
        </div>

        {/* Product Table */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="py-16 text-center text-gray-400">Loading products...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-6 py-4 font-semibold text-gray-600">Product</th>
                    <th className="text-left px-4 py-4 font-semibold text-gray-600">Category</th>
                    <th className="text-left px-4 py-4 font-semibold text-gray-600">Price</th>
                    <th className="text-left px-4 py-4 font-semibold text-gray-600">Stock</th>
                    <th className="text-left px-4 py-4 font-semibold text-gray-600">Featured</th>
                    <th className="text-left px-4 py-4 font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-10 h-10 rounded-xl object-cover bg-gray-100"
                            onError={(e) => { e.target.src = `https://placehold.co/40x40/f97316/fff?text=${product.name[0]}`; }}
                          />
                          <div>
                            <p className="font-semibold text-gray-900 line-clamp-1">{product.name}</p>
                            <p className="text-xs text-gray-400">{product.brand}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="badge bg-orange-50 text-orange-600">{product.category}</span>
                      </td>
                      <td className="px-4 py-4 font-semibold text-gray-900">${product.price}</td>
                      <td className="px-4 py-4">
                        <span className={`badge ${
                          product.stock === 0
                            ? 'bg-red-50 text-red-600'
                            : product.stock < 10
                            ? 'bg-yellow-50 text-yellow-700'
                            : 'bg-green-50 text-green-600'
                        }`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`badge ${product.featured ? 'bg-amber-50 text-amber-700' : 'bg-gray-50 text-gray-500'}`}>
                          {product.featured ? '★ Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          <button
                            id={`edit-${product._id}`}
                            onClick={() => openEdit(product)}
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            id={`delete-${product._id}`}
                            onClick={() => handleDelete(product._id, product.name)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="py-12 text-center text-gray-400">
                  No products found matching "{search}"
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-xl">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form id="product-form" onSubmit={handleFormSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Product Name *</label>
                  <input name="name" required value={form.name} onChange={handleFormChange} className="input" placeholder="e.g., Wireless Headphones" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Price ($) *</label>
                  <input name="price" type="number" step="0.01" min="0" required value={form.price} onChange={handleFormChange} className="input" placeholder="29.99" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Original Price ($)</label>
                  <input name="originalPrice" type="number" step="0.01" min="0" value={form.originalPrice} onChange={handleFormChange} className="input" placeholder="Optional (for discount)" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Category *</label>
                  <select name="category" required value={form.category} onChange={handleFormChange} className="input">
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Stock *</label>
                  <input name="stock" type="number" min="0" required value={form.stock} onChange={handleFormChange} className="input" placeholder="100" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Brand</label>
                  <input name="brand" value={form.brand} onChange={handleFormChange} className="input" placeholder="e.g., Sony" />
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <input
                    id="featured-checkbox"
                    name="featured"
                    type="checkbox"
                    checked={form.featured}
                    onChange={handleFormChange}
                    className="w-4 h-4 accent-orange-500"
                  />
                  <label htmlFor="featured-checkbox" className="text-sm font-semibold text-gray-700">
                    Featured Product
                  </label>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Image URL *</label>
                  <input name="image" required value={form.image} onChange={handleFormChange} className="input" placeholder="https://..." />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Description *</label>
                  <textarea
                    name="description"
                    required
                    rows={4}
                    value={form.description}
                    onChange={handleFormChange}
                    className="input resize-none"
                    placeholder="Describe the product..."
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 btn-secondary">
                  Cancel
                </button>
                <button
                  id="save-product-btn"
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 btn-primary flex items-center justify-center gap-2"
                >
                  {formLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
