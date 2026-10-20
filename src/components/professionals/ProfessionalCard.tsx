import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Shield, Clock, CheckCircle2, Heart, ExternalLink } from 'lucide-react';
import type { Professional } from '../../data/seed';
import { useAppStore } from '../../store/appStore';
import { StarRating } from '../ui/StarRating';
import { BookingModal } from './BookingModal';

interface ProfessionalCardProps {
  pro: Professional;
  view?: 'grid' | 'list';
}

export function ProfessionalCard({ pro, view = 'grid' }: ProfessionalCardProps) {
  const { toggleWishlist, isWishlisted } = useAppStore();
  const [showBooking, setShowBooking] = useState(false);
  const wishlisted = isWishlisted(pro.id);

  return (
    <>
      <div className={`card overflow-hidden ${view === 'list' ? 'flex gap-4 p-4' : 'p-0'}`}>
        {/* Portfolio Banner */}
        {view === 'grid' && pro.portfolio.length > 0 && (
          <div className="relative h-32 overflow-hidden">
            <img src={pro.portfolio[0]} alt={`${pro.name} portfolio`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />
            {pro.verified && (
              <span className="absolute top-2 left-2 badge badge-green">
                <Shield size={10} /> Verified
              </span>
            )}
            <button
              onClick={() => toggleWishlist(pro.id)}
              className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                wishlisted ? 'bg-red-500 text-white' : 'bg-white/80 text-slate-600 hover:bg-white'
              }`}
              aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart size={14} fill={wishlisted ? 'currentColor' : 'none'} />
            </button>
            {!pro.available && (
              <span className="absolute bottom-2 right-2 badge badge-gray">Unavailable</span>
            )}
          </div>
        )}

        <div className={view === 'grid' ? 'p-4' : 'flex-1'}>
          {/* Avatar + Name */}
          <div className="flex items-start gap-3 mb-3">
            <div className="relative flex-shrink-0">
              <img
                src={pro.avatar}
                alt={pro.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(pro.name)}&background=1a6bff&color=fff&size=96`; }}
              />
              {pro.available && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-slate-900 text-sm truncate">{pro.name}</h3>
                {pro.verified && <CheckCircle2 size={14} className="text-blue-600 flex-shrink-0" />}
              </div>
              <p className="text-xs text-slate-500 truncate">{pro.specialty}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <MapPin size={11} className="text-slate-400 flex-shrink-0" />
                <span className="text-xs text-slate-500 truncate">{pro.city}</span>
              </div>
            </div>
          </div>

          {/* Rating + Experience */}
          <div className="flex items-center justify-between mb-3">
            <StarRating rating={pro.rating} size={12} reviewCount={pro.reviewCount} />
            <span className="text-xs text-slate-500">{pro.experienceYears}yr exp</span>
          </div>

          {/* Skills */}
          <div className="flex flex-wrap gap-1 mb-3">
            {pro.skills.slice(0, 3).map((skill) => (
              <span key={skill} className="tag text-[11px] py-0.5">{skill}</span>
            ))}
            {pro.skills.length > 3 && (
              <span className="tag text-[11px] py-0.5 text-slate-400">+{pro.skills.length - 3}</span>
            )}
          </div>

          {/* Rate + Response */}
          <div className="flex items-center justify-between mb-3 py-2.5 border-t border-b border-slate-100">
            <div>
              <span className="font-bold text-slate-900 price">{pro.rateLabel}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <Clock size={11} />
              <span>Responds {pro.responseTime}</span>
            </div>
          </div>

          {/* Credentials */}
          {view === 'grid' && pro.credentials.length > 0 && (
            <div className="flex gap-1 flex-wrap mb-3">
              {pro.credentials.slice(0, 2).map((c) => (
                <span key={c} className="badge badge-blue text-[10px]">{c}</span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Link
              to={`/professionals/${pro.id}`}
              className="btn btn-secondary btn-sm flex-1"
            >
              <ExternalLink size={13} /> Profile
            </Link>
            <button
              onClick={() => setShowBooking(true)}
              disabled={!pro.available}
              className="btn btn-primary btn-sm flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Book Now
            </button>
          </div>

          {/* Guarantees */}
          {(pro.insurance || pro.escrowProtected) && (
            <div className="flex gap-2 mt-2">
              {pro.escrowProtected && (
                <span className="text-[10px] text-green-700 flex items-center gap-0.5">
                  <Shield size={10} /> Escrow
                </span>
              )}
              {pro.insurance && (
                <span className="text-[10px] text-blue-700 flex items-center gap-0.5">
                  <CheckCircle2 size={10} /> Insured
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <BookingModal pro={pro} open={showBooking} onClose={() => setShowBooking(false)} />
    </>
  );
}
