import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight, Shield } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { ProfessionalCard } from '../components/professionals/ProfessionalCard';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';

const CATEGORIES = ['All', 'Mason', 'Electrician', 'Plumber', 'Civil Contractor', 'Painter', 'Carpenter', 'Interior Designer', 'Architect', 'Engineer', 'Waterproofing'];
const CITIES = ['All', 'Delhi', 'Noida', 'Ghaziabad', 'Gurugram', 'Mumbai', 'Bengaluru', 'Pune', 'Hyderabad', 'Chennai', 'Kolkata', 'Jaipur'];
const PAGE_SIZE = 6;

export default function ProfessionalsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { getFilteredProfessionals } = useAppStore();

  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Sync filters to URL params
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || 'All';
  const city = searchParams.get('city') || 'All';
  const sortBy = searchParams.get('sortBy') || 'rating';
  const minRating = Number(searchParams.get('minRating')) || 0;
  const availableOnly = searchParams.get('available') === 'true';
  const verifiedOnly = searchParams.get('verified') === 'true';

  const [localQuery, setLocalQuery] = useState(query);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, [query, category, city, sortBy, minRating, availableOnly, verifiedOnly]);

  useEffect(() => { setPage(1); }, [query, category, city, sortBy]);

  const updateFilter = (key: string, value: string) => {
    const p = new URLSearchParams(searchParams);
    if (value === '' || value === 'All' || value === '0' || value === 'false') p.delete(key);
    else p.set(key, value);
    p.delete('page');
    setSearchParams(p);
    setPage(1);
  };

  const clearFilters = () => {
    setSearchParams({});
    setLocalQuery('');
    setPage(1);
  };

  const professionals = getFilteredProfessionals({
    query,
    category: category === 'All' ? undefined : category,
    city: city === 'All' ? undefined : city,
    sortBy,
    minRating,
    available: availableOnly,
    verified: verifiedOnly,
  });

  const totalPages = Math.ceil(professionals.length / PAGE_SIZE);
  const paginated = professionals.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const hasActiveFilters = query || category !== 'All' || city !== 'All' || minRating > 0 || availableOnly || verifiedOnly;

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-slate-500 mb-4 hidden md:flex items-center gap-2">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <span>/</span>
        <span className="text-slate-900 font-medium">Find Professionals</span>
      </nav>

      {/* Page Heading */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold font-heading text-slate-900">Find Professionals</h1>
          <p className="text-slate-500 mt-1">
            {loading ? 'Loading...' : `${professionals.length} professionals found`}
            {hasActiveFilters && (
              <button onClick={clearFilters} className="ml-2 text-blue-600 hover:underline text-sm">
                Clear filters
              </button>
            )}
          </p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="btn btn-secondary btn-sm md:hidden"
        >
          <SlidersHorizontal size={14} /> Filters
        </button>
      </div>

      <div className="flex gap-6">
        {/* ── Filter Sidebar ──────────────────────────────────────────── */}
        <aside className={`w-64 flex-shrink-0 space-y-5 ${showFilters ? 'block' : 'hidden md:block'}`}>
          <div className="card p-4 space-y-5">
            {/* Search */}
            <div>
              <label htmlFor="pro-search" className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 block">Search</label>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="pro-search"
                  className="input pl-8 text-sm"
                  value={localQuery}
                  onChange={(e) => setLocalQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') updateFilter('q', localQuery); }}
                  placeholder="Name, trade, skill..."
                />
              </div>
              <button onClick={() => updateFilter('q', localQuery)} className="btn btn-primary btn-sm w-full mt-2">Apply Search</button>
            </div>

            {/* Category */}
            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 block">Trade / Category</label>
              <div className="space-y-1 max-h-52 overflow-y-auto">
                {CATEGORIES.map((c) => (
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

            {/* City */}
            <div>
              <label htmlFor="pro-city" className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 block">City</label>
              <select
                id="pro-city"
                className="input text-sm"
                value={city}
                onChange={(e) => updateFilter('city', e.target.value)}
              >
                {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Min Rating */}
            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 block">
                Minimum Rating: {minRating > 0 ? `${minRating}+` : 'Any'}
              </label>
              <div className="flex gap-1">
                {[0, 4, 4.5, 4.8].map((r) => (
                  <button
                    key={r}
                    onClick={() => updateFilter('minRating', String(r))}
                    className={`flex-1 py-1.5 text-xs rounded-lg border transition-colors ${
                      minRating === r ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-200 text-slate-600 hover:border-blue-300'
                    }`}
                  >
                    {r === 0 ? 'Any' : `${r}★`}
                  </button>
                ))}
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-2">
              {[
                { key: 'available', label: 'Available Now', value: availableOnly },
                { key: 'verified', label: 'Verified Only', value: verifiedOnly },
              ].map(({ key, label, value }) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => updateFilter(key, e.target.checked ? 'true' : 'false')}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 accent-blue-600"
                  />
                  <span className="text-sm text-slate-700">{label}</span>
                </label>
              ))}
            </div>

            {hasActiveFilters && (
              <button onClick={clearFilters} className="btn btn-ghost btn-sm w-full text-red-500 hover:bg-red-50">
                <X size={14} /> Clear All Filters
              </button>
            )}
          </div>

          {/* Contractor Guarantee Panel */}
          <div className="card p-4 bg-green-50 border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <Shield size={18} className="text-green-600" />
              <span className="font-bold text-green-900 text-sm">Contractor Guarantee</span>
            </div>
            <p className="text-xs text-green-800 leading-relaxed">
              All professionals are background-checked, licence-verified, and covered by our escrow payment protection.
            </p>
            <p className="text-xs text-green-600 mt-1.5 font-medium">⚠️ Demo data only</p>
          </div>
        </aside>

        {/* ── Results ─────────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0">
          {/* Sort + Active Chips */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="flex flex-wrap gap-2 flex-1">
              {query && (
                <span className="badge badge-blue gap-1">
                  "{query}" <button onClick={() => { updateFilter('q', ''); setLocalQuery(''); }}><X size={10} /></button>
                </span>
              )}
              {category !== 'All' && (
                <span className="badge badge-blue gap-1">
                  {category} <button onClick={() => updateFilter('category', 'All')}><X size={10} /></button>
                </span>
              )}
              {city !== 'All' && (
                <span className="badge badge-blue gap-1">
                  {city} <button onClick={() => updateFilter('city', 'All')}><X size={10} /></button>
                </span>
              )}
              {minRating > 0 && (
                <span className="badge badge-yellow gap-1">
                  {minRating}★+ <button onClick={() => updateFilter('minRating', '0')}><X size={10} /></button>
                </span>
              )}
              {availableOnly && (
                <span className="badge badge-green gap-1">
                  Available <button onClick={() => updateFilter('available', 'false')}><X size={10} /></button>
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <label htmlFor="pro-sort" className="text-sm text-slate-500">Sort:</label>
              <select
                id="pro-sort"
                className="input text-sm w-40 py-1.5"
                value={sortBy}
                onChange={(e) => updateFilter('sortBy', e.target.value)}
              >
                <option value="rating">Top Rated</option>
                <option value="reviews">Most Reviewed</option>
                <option value="experience">Most Experienced</option>
                <option value="rate_asc">Rate: Low→High</option>
                <option value="rate_desc">Rate: High→Low</option>
              </select>
            </div>
          </div>

          {loading ? (
            <LoadingSkeleton count={PAGE_SIZE} type="card" />
          ) : paginated.length === 0 ? (
            <div className="text-center py-20 card">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">No professionals found</h3>
              <p className="text-slate-500 mb-4">Try adjusting your filters or search terms</p>
              <button onClick={clearFilters} className="btn btn-primary">Clear Filters</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginated.map((pro) => <ProfessionalCard key={pro.id} pro={pro} />)}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="btn btn-ghost btn-sm disabled:opacity-40"
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                        page === i + 1 ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="btn btn-ghost btn-sm disabled:opacity-40"
                    aria-label="Next page"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
