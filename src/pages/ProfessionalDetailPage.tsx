import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, MapPin, Shield, Clock, CheckCircle2,
  Phone, Calendar, Award, Heart,
  Briefcase, Globe, Users
} from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { StarRating } from '../components/ui/StarRating';
import { BookingModal } from '../components/professionals/BookingModal';

export default function ProfessionalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { professionals, toggleWishlist, isWishlisted } = useAppStore();
  const [showBooking, setShowBooking] = useState(false);
  const [activePhoto, setActivePhoto] = useState(0);

  const pro = professionals.find((p) => p.id === id);
  const wishlisted = pro ? isWishlisted(pro.id) : false;

  if (!pro) {
    return (
      <div className="max-w-[1280px] mx-auto px-6 py-20 text-center">
        <div className="text-6xl mb-4">👷</div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Professional Not Found</h1>
        <p className="text-slate-500 mb-6">This profile doesn't exist or has been removed.</p>
        <Link to="/professionals" className="btn btn-primary">← Back to Professionals</Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-slate-500 mb-4 hidden md:flex items-center gap-2">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <span>/</span>
        <Link to="/professionals" className="hover:text-blue-600">Professionals</Link>
        <span>/</span>
        <span className="text-slate-900">{pro.name}</span>
      </nav>

      {/* Mobile Back */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-slate-600 mb-4 md:hidden">
        <ArrowLeft size={18} /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Main Content ─────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Header */}
          <div className="card p-6">
            <div className="flex items-start gap-5">
              <div className="relative flex-shrink-0">
                <img
                  src={pro.avatar}
                  alt={pro.name}
                  className="w-24 h-24 rounded-2xl object-cover border-3 border-slate-100 shadow-sm"
                  onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(pro.name)}&background=1a6bff&color=fff&size=200`; }}
                />
                {pro.available && (
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl font-bold font-heading text-slate-900">{pro.name}</h1>
                      {pro.verified && <CheckCircle2 size={20} className="text-blue-600 flex-shrink-0" />}
                    </div>
                    <p className="text-slate-600 mt-0.5">{pro.specialty}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <MapPin size={14} className="text-slate-400" />
                      <span className="text-sm text-slate-500">{pro.location}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleWishlist(pro.id)}
                    className={`p-2 rounded-xl border transition-colors ${wishlisted ? 'bg-red-50 border-red-200 text-red-500' : 'border-slate-200 text-slate-400 hover:border-red-200 hover:text-red-400'}`}
                    aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                  >
                    <Heart size={18} fill={wishlisted ? 'currentColor' : 'none'} />
                  </button>
                </div>

                <div className="flex flex-wrap gap-3 mt-3">
                  <StarRating rating={pro.rating} size={15} reviewCount={pro.reviewCount} />
                  <span className="text-sm text-slate-500 flex items-center gap-1">
                    <Briefcase size={13} /> {pro.completedProjects} projects
                  </span>
                  <span className="text-sm text-slate-500 flex items-center gap-1">
                    <Clock size={13} /> {pro.responseTime}
                  </span>
                  <span className={`badge ${pro.available ? 'badge-green' : 'badge-red'}`}>
                    {pro.available ? '● Available' : '● Unavailable'}
                  </span>
                </div>
              </div>
            </div>

            <p className="mt-4 text-slate-700 leading-relaxed">{pro.bio}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              {pro.insurance && <span className="badge badge-blue"><Shield size={11} /> Insured</span>}
              {pro.escrowProtected && <span className="badge badge-green"><CheckCircle2 size={11} /> Escrow</span>}
              {pro.credentials.slice(0, 2).map(c => <span key={c} className="badge badge-gray">{c}</span>)}
            </div>
          </div>

          {/* Portfolio */}
          {pro.portfolio.length > 0 && (
            <div className="card p-6">
              <h2 className="text-lg font-bold font-heading text-slate-900 mb-4">Portfolio</h2>
              <div className="mb-3 rounded-xl overflow-hidden h-64">
                <img
                  src={pro.portfolio[activePhoto]}
                  alt={`Portfolio ${activePhoto + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto scroll-x pb-1">
                {pro.portfolio.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActivePhoto(i)}
                    className={`w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                      activePhoto === i ? 'border-blue-500' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          <div className="card p-6">
            <h2 className="text-lg font-bold font-heading text-slate-900 mb-3">Skills & Expertise</h2>
            <div className="flex flex-wrap gap-2">
              {pro.skills.map((skill) => (
                <span key={skill} className="tag">{skill}</span>
              ))}
            </div>
          </div>

          {/* Credentials */}
          <div className="card p-6">
            <h2 className="text-lg font-bold font-heading text-slate-900 mb-3">
              <Award size={18} className="inline mr-2 text-blue-600" />Credentials & Certifications
            </h2>
            <div className="space-y-2">
              {pro.credentials.map((c) => (
                <div key={c} className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                  <CheckCircle2 size={16} className="text-blue-600 flex-shrink-0" />
                  <span className="text-sm font-medium text-slate-800">{c}</span>
                  <span className="text-xs text-slate-400 ml-auto">⚠️ Demo</span>
                </div>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div className="card p-6">
            <h2 className="text-lg font-bold font-heading text-slate-900 mb-3">
              <Globe size={18} className="inline mr-2 text-blue-600" />Languages
            </h2>
            <div className="flex flex-wrap gap-2">
              {pro.languages.map((l) => <span key={l} className="badge badge-gray">{l}</span>)}
            </div>
          </div>
        </div>

        {/* ── Sidebar ──────────────────────────────────────────── */}
        <div className="space-y-4">
          {/* Booking Card */}
          <div className="card p-6 sticky top-24">
            <div className="text-center mb-4">
              <div className="text-3xl font-bold font-heading text-slate-900 price">{pro.rateLabel}</div>
              {pro.rateUnit !== 'project' && (
                <p className="text-sm text-slate-500 mt-0.5">
                  ~{pro.rateUnit === 'day' ? '₹' + (pro.rate * 25).toLocaleString('en-IN') + '/month' : 'Per job varies'}
                </p>
              )}
            </div>

            <div className="space-y-2 text-sm mb-5">
              {[
                [<Clock size={14} />, 'Response time', pro.responseTime],
                [<Users size={14} />, 'Projects completed', `${pro.completedProjects}+`],
                [<Shield size={14} />, 'Insurance', pro.insurance ? 'Covered' : 'Not covered'],
              ].map(([icon, label, val]) => (
                <div key={String(label)} className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0">
                  <span className="flex items-center gap-1.5 text-slate-500">{icon as React.ReactNode} {label as string}</span>
                  <span className="font-medium text-slate-900">{val as string}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowBooking(true)}
              disabled={!pro.available}
              className="btn btn-primary w-full btn-lg mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Calendar size={18} /> Book Now
            </button>
            <a
              href={`tel:+91-DEMO-NUMBER`}
              className="btn btn-secondary w-full mb-3"
              aria-label="Call professional (demo)"
            >
              <Phone size={16} /> Call (Demo)
            </a>

            <p className="text-xs text-center text-slate-400">
              ⚠️ All contact, credentials, and pricing is demo data
            </p>
          </div>

          {/* Guarantee */}
          <div className="card p-4 bg-green-50 border-green-200">
            <h3 className="font-bold text-green-900 text-sm mb-2 flex items-center gap-2">
              <Shield size={16} className="text-green-600" /> BuildNexus Guarantee
            </h3>
            <ul className="text-xs text-green-800 space-y-1">
              <li>✅ Verified identity & credentials</li>
              <li>✅ Escrow payment protection</li>
              <li>✅ Dispute resolution support</li>
              <li>✅ Quality assurance guarantee</li>
            </ul>
            <p className="text-xs text-green-600 mt-2">⚠️ Demo only — not real guarantees</p>
          </div>
        </div>
      </div>

      <BookingModal pro={pro} open={showBooking} onClose={() => setShowBooking(false)} />
    </div>
  );
}
