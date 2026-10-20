import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, ShoppingCart, Heart, Bell, User, ChevronDown,
  MapPin, X, Check, LogOut, Settings, Package, Briefcase
} from 'lucide-react';
import { BRAND } from '../../config/brand';
import { useAppStore } from '../../store/appStore';

export function DesktopHeader() {
  const navigate = useNavigate();
  const { getCartCount, getUnreadCount, notifications, markNotifRead, markAllNotifsRead,
    wishlist, profile, deliveryAddress, deliveryCity, updateDeliveryAddress } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchScope, setSearchScope] = useState<'professionals' | 'materials'>('professionals');
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState(deliveryAddress);
  const [newCity, setNewCity] = useState(deliveryCity);

  const cartCount = getCartCount();
  const unreadCount = getUnreadCount();

  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifs(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setShowUserMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/${searchScope}?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleAddressUpdate = () => {
    updateDeliveryAddress(newAddress, newCity);
    setShowAddressModal(false);
  };

  return (
    <>
      {/* Top utility bar */}
      <div className="bg-slate-50 border-b border-slate-200 text-xs text-slate-600 py-1.5 hidden md:block">
        <div className="max-w-[1280px] mx-auto px-6 flex items-center justify-between">
          <span>🇮🇳 India's #1 Construction Marketplace · COD Available · Escrow Protected</span>
          <div className="flex gap-4">
            <a href="tel:+918001234567" className="hover:text-blue-600 transition-colors">📞 1800-123-4567 (Free)</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Become a Vendor</a>
            <a href="#" className="hover:text-blue-600 transition-colors">List Your Services</a>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className="bg-[#0f172a] text-white sticky top-0 z-40 shadow-lg">
        <div className="max-w-[1280px] mx-auto px-6 py-3 flex items-center gap-4">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <span className="text-2xl">{BRAND.logo}</span>
            <div>
              <div className="text-lg font-bold font-heading leading-none">{BRAND.name}</div>
              <div className="text-[10px] text-blue-300 leading-none">{BRAND.tagline}</div>
            </div>
          </Link>

          {/* Category Selector */}
          <div className="relative hidden lg:block">
            <select
              value={searchScope}
              onChange={(e) => setSearchScope(e.target.value as 'professionals' | 'materials')}
              className="appearance-none bg-blue-600 text-white text-sm px-4 py-2.5 pr-8 rounded-lg cursor-pointer border-none outline-none font-medium"
              aria-label="Search category"
            >
              <option value="professionals">Professionals</option>
              <option value="materials">Materials</option>
            </select>
            <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchScope === 'professionals' ? 'Search mason, electrician, plumber...' : 'Search cement, steel, tiles...'}
                className="w-full bg-white text-slate-900 pl-10 pr-24 py-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-400"
                aria-label="Search"
              />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-1.5 rounded-md transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {/* Delivery Location */}
          <button
            onClick={() => setShowAddressModal(true)}
            className="hidden lg:flex items-center gap-1.5 text-sm hover:text-blue-300 transition-colors flex-shrink-0"
            aria-label="Change delivery location"
          >
            <MapPin size={16} className="text-blue-400" />
            <div className="text-left">
              <div className="text-[10px] text-slate-400">Deliver to</div>
              <div className="font-medium">{deliveryCity}</div>
            </div>
          </button>

          {/* Wishlist */}
          <Link to="/materials?wishlist=true" className="relative flex items-center gap-1 hover:text-blue-300 transition-colors" aria-label="Wishlist">
            <Heart size={22} />
            {wishlist.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link to="/cart" className="relative flex items-center gap-2 hover:text-blue-300 transition-colors" aria-label={`Cart, ${cartCount} items`}>
            <div className="relative">
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </div>
            <div className="hidden lg:block text-sm">
              <div className="text-[10px] text-slate-400">Cart</div>
              <div className="font-medium">{cartCount} items</div>
            </div>
          </Link>

          {/* Notifications */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => { setShowNotifs(!showNotifs); setShowUserMenu(false); }}
              className="relative hover:text-blue-300 transition-colors"
              aria-label={`Notifications, ${unreadCount} unread`}
            >
              <Bell size={22} />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            {showNotifs && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                  <span className="font-semibold text-slate-900">Notifications</span>
                  <button onClick={markAllNotifsRead} className="text-xs text-blue-600 hover:underline">Mark all read</button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-sm text-slate-500 p-4 text-center">No notifications</p>
                  ) : notifications.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => markNotifRead(n.id)}
                      className={`w-full text-left px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors ${!n.read ? 'bg-blue-50' : ''}`}
                    >
                      <div className="flex items-start gap-2">
                        {!n.read && <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />}
                        <div>
                          <div className="text-sm font-medium text-slate-900">{n.title}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{n.body}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div ref={userRef} className="relative">
            <button
              onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifs(false); }}
              className="flex items-center gap-2 hover:text-blue-300 transition-colors"
              aria-label="User menu"
            >
              <img src={profile.avatar} alt={profile.name} className="w-8 h-8 rounded-full object-cover border-2 border-blue-400" />
              <ChevronDown size={14} />
            </button>
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100">
                  <div className="font-semibold text-slate-900 text-sm">{profile.name}</div>
                  <div className="text-xs text-slate-500">{profile.email}</div>
                </div>
                <nav className="py-1">
                  <Link to="/profile" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                    <User size={16} /> My Profile
                  </Link>
                  <Link to="/my-work" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                    <Briefcase size={16} /> My Work
                  </Link>
                  <Link to="/orders" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                    <Package size={16} /> My Orders
                  </Link>
                  <Link to="/profile?tab=settings" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                    <Settings size={16} /> Settings
                  </Link>
                  <hr className="my-1 border-slate-100" />
                  <button className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full">
                    <LogOut size={16} /> Sign Out (Demo)
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Bar */}
        <nav className="border-t border-slate-700 hidden md:block" aria-label="Main navigation">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="flex gap-1">
              {[
                { to: '/', label: 'Home' },
                { to: '/professionals', label: 'Find Professionals' },
                { to: '/materials', label: 'Building Materials' },
                { to: '/my-work', label: 'My Work' },
                { to: '/orders', label: 'Orders' },
                { to: '/quotations', label: 'Quotations' },
              ].map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-700 transition-colors rounded-sm font-medium"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </header>

      {/* Address Modal */}
      {showAddressModal && (
        <div className="overlay" onClick={() => setShowAddressModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">Change Delivery Location</h2>
              <button onClick={() => setShowAddressModal(false)} className="btn btn-ghost p-1"><X size={20} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">City</label>
                <input className="input" value={newCity} onChange={(e) => setNewCity(e.target.value)} placeholder="e.g. Gurugram" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Full Address</label>
                <textarea
                  className="input resize-none h-20"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="Plot number, locality, pincode..."
                />
              </div>
              <button onClick={handleAddressUpdate} className="btn btn-primary w-full">
                <Check size={16} /> Update Location
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
