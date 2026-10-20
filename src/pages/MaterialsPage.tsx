import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { MaterialCard } from '../components/materials/MaterialCard';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { formatINR } from '../config/brand';

const MAT_CATEGORIES = ['All', 'Cement', 'Steel', 'Bricks', 'Pipes', 'Aggregates', 'Tiles', 'Paints', 'Wood & Boards', 'Electricals', 'Waterproofing'];
const PAGE_SIZE = 6;

export default function MaterialsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { getFilteredMaterials, getCartTotal, getCartCount, deliveryAddress, deliveryCity } = useAppStore();

  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [localQuery, setLocalQuery] = useState(searchParams.get('q') || '');

  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || 'All';
  const sortBy = searchParams.get('sortBy') || 'rating';
  const inStock = searchParams.get('inStock') === 'true';

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, [query, category, sortBy, inStock]);

  useEffect(() => { setPage(1); }, [query, category, sortBy]);

  const updateFilter = (key: string, value: string) => {
    const p = new URLSearchParams(searchParams);
    if (!value || value === 'All' || value === 'false') p.delete(key);
    else p.set(key, value);
    setSearchParams(p);
    setPage(1);
  };

  const clearFilters = () => { setSearchParams({}); setLocalQuery(''); setPage(1); };

  const materials = getFilteredMaterials({ query, category: category === 'All' ? undefined : category, sortBy, inStock });
  const totalPages = Math.ceil(materials.length / PAGE_SIZE);
  const paginated = materials.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const cartTotal = getCartTotal();
  const cartCount = getCartCount();
  const hasFilters = query || category !== 'All' || inStock;

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-slate-500 mb-4 hidden md:flex items-center gap-2">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <span>/</span>
        <span className="text-slate-900 font-medium">Building Materials</span>
      </nav>

      {/* Heading */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-slate-900">Building Materials</h1>
          <p className="text-slate-500 mt-1">
            {loading ? 'Loading...' : `${materials.length} products`}
            {hasFilters && <button onClick={clearFilters} className="ml-2 text-blue-600 hover:underline text-sm">Clear filters</button>}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowFilters(!showFilters)} className="btn btn-secondary btn-sm md:hidden">
            <SlidersHorizontal size={14} /> Filters
          </button>
          {cartCount > 0 && (
            <Link to="/cart" className="btn btn-primary btn-sm hidden md:flex">
              <ShoppingCart size={14} /> {cartCount} items · {formatINR(cartTotal)}
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Delivery Row */}
      <div className="md:hidden mb-4 flex items-center gap-2 p-3 bg-blue-50 rounded-xl border border-blue-100">
        <span className="text-sm text-slate-600 flex-1 truncate">📍 {deliveryCity} — {deliveryAddress}</span>
        <Link to="/profile" className="text-xs text-blue-600 font-medium">Change</Link>
      </div>

      {/* Mobile Cart Sticky */}
      {cartCount > 0 && (
        <div className="md:hidden fixed bottom-[70px] left-0 right-0 z-30 px-4 pb-2">
          <Link to="/cart" className="btn btn-primary w-full shadow-lg">
            <ShoppingCart size={16} /> View Cart ({cartCount} items) · {formatINR(cartTotal)}
          </Link>
        </div>
      )}

      <div className="flex gap-6">
        {/* Filter Sidebar */}
        <aside className={`w-64 flex-shrink-0 space-y-5 ${showFilters ? 'block' : 'hidden md:block'}`}>
          <div className="card p-4 space-y-5">
            {/* Search */}
            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 block">Search</label>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  className="input pl-8 text-sm"
                  value={localQuery}
                  onChange={(e) => setLocalQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') updateFilter('q', localQuery); }}
                  placeholder="Product, supplier..."
                />
              </div>
              <button onClick={() => updateFilter('q', localQuery)} className="btn btn-primary btn-sm w-full mt-2">Apply</button>
            </div>

            {/* Category */}
            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 block">Category</label>
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {MAT_CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => updateFilter('category', c)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      category === c ? 'bg-blue-600 text-white font-medium' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* In Stock */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) => updateFilter('inStock', e.target.checked ? 'true' : 'false')}
                className="w-4 h-4 rounded accent-blue-600"
              />
              <span className="text-sm text-slate-700">In Stock Only</span>
            </label>

            {hasFilters && (
              <button onClick={clearFilters} className="btn btn-ghost btn-sm w-full text-red-500 hover:bg-red-50">
                <X size={14} /> Clear Filters
              </button>
            )}
          </div>

          {/* Bulk Quotation CTA */}
          <div className="card p-4 bg-blue-50 border-blue-200">
            <h3 className="font-bold text-blue-900 text-sm mb-2">Need Bulk Materials?</h3>
            <p className="text-xs text-blue-800 mb-3">Get competitive quotes from multiple suppliers for large orders.</p>
            <Link to="/quotations?new=true" className="btn btn-primary btn-sm w-full">Request Bulk Quote</Link>
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1 min-w-0">
          {/* Sort + Active chips */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="flex flex-wrap gap-2 flex-1">
              {query && (
                <span className="badge badge-blue gap-1">"{query}" <button onClick={() => { updateFilter('q', ''); setLocalQuery(''); }}><X size={10} /></button></span>
              )}
              {category !== 'All' && (
                <span className="badge badge-blue gap-1">{category} <button onClick={() => updateFilter('category', 'All')}><X size={10} /></button></span>
              )}
              {inStock && (
                <span className="badge badge-green gap-1">In Stock <button onClick={() => updateFilter('inStock', 'false')}><X size={10} /></button></span>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <label htmlFor="mat-sort" className="text-sm text-slate-500">Sort:</label>
              <select
                id="mat-sort"
                className="input text-sm w-44 py-1.5"
                value={sortBy}
                onChange={(e) => updateFilter('sortBy', e.target.value)}
              >
                <option value="rating">Top Rated</option>
                <option value="price_asc">Price: Low → High</option>
                <option value="price_desc">Price: High → Low</option>
                <option value="delivery">Fastest Delivery</option>
              </select>
            </div>
          </div>

          {loading ? (
            <LoadingSkeleton count={PAGE_SIZE} type="card" />
          ) : paginated.length === 0 ? (
            <div className="text-center py-20 card">
              <div className="text-5xl mb-4">📦</div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">No products found</h3>
              <p className="text-slate-500 mb-4">Try different filters or search terms</p>
              <button onClick={clearFilters} className="btn btn-primary">Clear Filters</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {paginated.map((m) => <MaterialCard key={m.id} material={m} />)}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn btn-ghost btn-sm disabled:opacity-40" aria-label="Prev"><ChevronLeft size={16} /></button>
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button key={i} onClick={() => setPage(i + 1)} className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${page === i + 1 ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>{i + 1}</button>
                  ))}
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="btn btn-ghost btn-sm disabled:opacity-40" aria-label="Next"><ChevronRight size={16} /></button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile bottom spacer for sticky cart bar */}
      {cartCount > 0 && <div className="md:hidden h-20" />}
      <div className="mobile-bottom-spacer" />
    </div>
  );
}
