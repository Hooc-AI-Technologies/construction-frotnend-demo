import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Bell, MapPin, ArrowLeft } from 'lucide-react';
import { BRAND } from '../../config/brand';
import { useAppStore } from '../../store/appStore';

interface MobileHeaderProps {
  title?: string;
  showBack?: boolean;
  showSearch?: boolean;
  showCart?: boolean;
}

export function MobileHeader({ title, showBack, showSearch = true, showCart = true }: MobileHeaderProps) {
  const navigate = useNavigate();
  const { getCartCount, getUnreadCount, deliveryAddress, profile } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');

  const cartCount = getCartCount();
  const unreadCount = getUnreadCount();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/professionals?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  if (title || showBack) {
    return (
      <header className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-40">
        {showBack && (
          <button onClick={() => navigate(-1)} className="btn btn-ghost p-1.5 -ml-1" aria-label="Go back">
            <ArrowLeft size={20} />
          </button>
        )}
        <h1 className="text-lg font-bold text-slate-900 font-heading flex-1">{title}</h1>
        {showCart && (
          <Link to="/cart" className="relative" aria-label="Cart">
            <ShoppingCart size={22} className="text-slate-700" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{cartCount}</span>
            )}
          </Link>
        )}
      </header>
    );
  }

  return (
    <header className="md:hidden bg-[#0f172a] text-white sticky top-0 z-40">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Link to="/">
              <span className="text-lg font-bold font-heading">{BRAND.name}</span>
            </Link>
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center gap-1 text-xs text-blue-300"
              aria-label="Change delivery location"
            >
              <MapPin size={12} />
              <span className="max-w-[140px] truncate">{deliveryAddress}</span>
            </button>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/notifications" className="relative" aria-label="Notifications">
              <Bell size={22} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{unreadCount}</span>
              )}
            </Link>
            <Link to="/profile" aria-label="Profile">
              <img src={profile.avatar} alt={profile.name} className="w-8 h-8 rounded-full object-cover border-2 border-blue-400" />
            </Link>
          </div>
        </div>

        {showSearch && (
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search professionals, materials..."
                className="w-full bg-white text-slate-900 pl-9 pr-4 py-2.5 rounded-lg text-sm outline-none"
                aria-label="Search"
              />
            </div>
          </form>
        )}
      </div>
    </header>
  );
}
