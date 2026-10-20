import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, HardHat, Package, Shield, Truck, Star,
  ArrowRight, ChevronRight, Users, MapPin, Zap, Award
} from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { ProfessionalCard } from '../components/professionals/ProfessionalCard';
import { formatINR } from '../config/brand';

const CATEGORIES = [
  { icon: '🧱', label: 'Mason', color: 'bg-orange-50 border-orange-200' },
  { icon: '⚡', label: 'Electrician', color: 'bg-yellow-50 border-yellow-200' },
  { icon: '🔧', label: 'Plumber', color: 'bg-blue-50 border-blue-200' },
  { icon: '🏗️', label: 'Civil Contractor', color: 'bg-slate-50 border-slate-200' },
  { icon: '🎨', label: 'Painter', color: 'bg-pink-50 border-pink-200' },
  { icon: '🪚', label: 'Carpenter', color: 'bg-amber-50 border-amber-200' },
  { icon: '🏠', label: 'Interior Designer', color: 'bg-purple-50 border-purple-200' },
  { icon: '📐', label: 'Architect', color: 'bg-teal-50 border-teal-200' },
];

const MAT_CATEGORIES = [
  { icon: '🏭', label: 'Cement', color: 'bg-slate-100' },
  { icon: '🔩', label: 'Steel', color: 'bg-blue-100' },
  { icon: '🧱', label: 'Bricks', color: 'bg-orange-100' },
  { icon: '💧', label: 'Pipes', color: 'bg-cyan-100' },
  { icon: '🪨', label: 'Aggregates', color: 'bg-stone-100' },
  { icon: '🎨', label: 'Paints', color: 'bg-pink-100' },
  { icon: '🔲', label: 'Tiles', color: 'bg-emerald-100' },
  { icon: '💡', label: 'Electricals', color: 'bg-yellow-100' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { professionals, materials } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'professionals' | 'materials'>('professionals');

  const topPros = professionals.filter((p) => p.rating >= 4.8).slice(0, 3);
  const featuredMaterials = materials.slice(0, 4);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/${searchType}?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div>
      {/* ── Hero Section ──────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-[#0f172a] via-[#1e3a5f] to-[#0f172a] text-white overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-blue-500 blur-3xl translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-blue-600 blur-3xl -translate-x-1/3 translate-y-1/3" />
        </div>

        <div className="max-w-[1280px] mx-auto px-6 py-16 md:py-24 relative">
          <div className="max-w-3xl">
            <span className="badge badge-navy border border-blue-500/30 text-blue-300 mb-4 inline-flex">
              🇮🇳 India's #1 Construction Marketplace
            </span>
            <h1 className="text-4xl md:text-6xl font-bold font-heading leading-tight mb-4">
              Build Better.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                Find the Right People.
              </span>
              <br />Get the Right Materials.
            </h1>
            <p className="text-lg text-slate-300 mb-8 leading-relaxed">
              Connect with 4,200+ verified construction professionals. Source 10,000+ quality building materials. All escrow-protected, all in one place.
            </p>

            {/* Search Panel */}
            <div className="bg-white rounded-2xl p-3 shadow-2xl">
              <div className="flex gap-2 mb-3">
                {(['professionals', 'materials'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setSearchType(t)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors capitalize ${
                      searchType === t ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {t === 'professionals' ? '👷 Find Professionals' : '📦 Shop Materials'}
                  </button>
                ))}
              </div>
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    className="w-full pl-10 pr-4 py-3 border-none outline-none text-slate-900 text-sm rounded-xl bg-slate-50"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={searchType === 'professionals' ? 'Search mason, electrician, plumber...' : 'Search cement, steel, tiles...'}
                    aria-label="Search"
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-lg px-6">
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust Metrics ─────────────────────────────────────────────────── */}
      <section className="bg-blue-700 text-white py-6">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-3 md:grid-cols-3 gap-4 text-center">
            {[
              { icon: <Users size={24} />, num: '4,200+', label: 'Verified Trades' },
              { icon: <Truck size={24} />, num: '1,50,000+', label: 'Tonnes Delivered' },
              { icon: <Shield size={24} />, num: '100%', label: 'Escrow Protected' },
            ].map(({ icon, num, label }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <div className="text-blue-200">{icon}</div>
                <div className="text-2xl font-bold font-heading">{num}</div>
                <div className="text-blue-200 text-sm">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quick Actions ──────────────────────────────────────────────────── */}
      <section className="py-10 bg-white">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Hire Professional */}
            <Link
              to="/professionals"
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 text-white p-8 flex items-center gap-6 hover:shadow-xl transition-all"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <HardHat size={36} />
              </div>
              <div>
                <h2 className="text-2xl font-bold font-heading mb-1">Hire a Professional</h2>
                <p className="text-blue-200 text-sm mb-3">4,200+ verified masons, electricians, plumbers & more</p>
                <span className="flex items-center gap-1 text-sm font-medium">
                  Browse Professionals <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>

            {/* Shop Materials */}
            <Link
              to="/materials"
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-orange-700 text-white p-8 flex items-center gap-6 hover:shadow-xl transition-all"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <Package size={36} />
              </div>
              <div>
                <h2 className="text-2xl font-bold font-heading mb-1">Shop Building Materials</h2>
                <p className="text-orange-200 text-sm mb-3">10,000+ products · Bulk pricing · Express delivery</p>
                <span className="flex items-center gap-1 text-sm font-medium">
                  Browse Materials <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Popular Trades ─────────────────────────────────────────────────── */}
      <section className="py-10 bg-[var(--color-surface)]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="section-heading">Popular Construction Trades</h2>
              <p className="section-subheading">Find verified professionals by trade</p>
            </div>
            <Link to="/professionals" className="btn btn-secondary btn-sm hidden md:flex">
              View All <ChevronRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {CATEGORIES.map(({ icon, label, color }) => (
              <Link
                key={label}
                to={`/professionals?category=${encodeURIComponent(label)}`}
                className={`card flex flex-col items-center gap-2 p-3 border hover:border-blue-300 hover:bg-blue-50 transition-all text-center ${color}`}
              >
                <span className="text-3xl">{icon}</span>
                <span className="text-xs font-medium text-slate-700 leading-tight">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Top-Rated Professionals ──────────────────────────────────────── */}
      <section className="py-10 bg-white">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="section-heading">Top-Rated Professionals</h2>
              <p className="section-subheading">Highly reviewed and verified across India</p>
            </div>
            <Link to="/professionals?sortBy=rating" className="btn btn-secondary btn-sm hidden md:flex">
              View All <ChevronRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {topPros.map((p) => <ProfessionalCard key={p.id} pro={p} />)}
          </div>
        </div>
      </section>

      {/* ── Featured Materials ────────────────────────────────────────────── */}
      <section className="py-10 bg-[var(--color-surface)]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="section-heading">Featured Building Materials</h2>
              <p className="section-subheading">Top-selling products with bulk discounts</p>
            </div>
            <Link to="/materials" className="btn btn-secondary btn-sm hidden md:flex">
              Shop All <ChevronRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featuredMaterials.map((m) => (
              <Link key={m.id} to="/materials" className="card p-4 hover:border-blue-200 transition-all group">
                <div className="h-32 rounded-xl overflow-hidden mb-3 bg-slate-100">
                  <img src={m.image} alt={m.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="text-xs text-blue-600 font-medium">{m.supplier}</div>
                <div className="text-sm font-bold text-slate-900 mt-0.5 line-clamp-2">{m.name}</div>
                <div className="flex items-center gap-1 mt-1">
                  <Star size={11} className="star-filled fill-amber-400 stroke-amber-400" />
                  <span className="text-xs text-slate-600">{m.rating}</span>
                  <span className="text-xs text-slate-400">({m.reviewCount.toLocaleString('en-IN')})</span>
                </div>
                <div className="font-bold text-slate-900 mt-2 price">
                  {formatINR(m.price)} <span className="text-xs text-slate-500 font-normal">/{m.unit}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Material Categories ───────────────────────────────────────────── */}
      <section className="py-10 bg-white">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="section-heading">Browse by Category</h2>
              <p className="section-subheading">Source every material for your project</p>
            </div>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {MAT_CATEGORIES.map(({ icon, label, color }) => (
              <Link
                key={label}
                to={`/materials?category=${encodeURIComponent(label)}`}
                className={`card flex flex-col items-center gap-2 p-4 border hover:border-blue-300 transition-all text-center ${color}`}
              >
                <span className="text-3xl">{icon}</span>
                <span className="text-xs font-medium text-slate-700">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust Section ─────────────────────────────────────────────────── */}
      <section className="py-10 bg-gradient-to-br from-blue-900 to-[#0f172a] text-white">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold font-heading mb-2">The BuildNexus Guarantee</h2>
            <p className="text-slate-300">Every transaction, every professional — protected</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: <Shield size={32} />, title: 'Escrow Protection', desc: 'Funds held securely until work is completed and approved. No completion = full refund.' },
              { icon: <Award size={32} />, title: 'Verified Professionals', desc: 'All tradespeople undergo ID, licence, insurance, and credential verification before listing.' },
              { icon: <Star size={32} />, title: 'Quality Assured Materials', desc: 'Only BIS-marked, ISI-certified products from authorised distributors. Tested & traceable.' },
              { icon: <Zap size={32} />, title: 'Fast Dispute Resolution', desc: '24-hour response SLA for disputes. Dedicated resolution team with neutral mediation.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-white/10 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
                <div className="text-blue-400 mb-3">{icon}</div>
                <h3 className="font-bold text-lg font-heading mb-2">{title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed">{desc}</p>
                <p className="text-xs text-slate-500 mt-2">⚠️ Demo data — not a real guarantee</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quotation CTA ─────────────────────────────────────────────────── */}
      <section className="py-10 bg-[var(--color-surface)]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card p-8 bg-gradient-to-br from-blue-50 to-white border-blue-200">
              <h2 className="text-2xl font-bold font-heading text-slate-900 mb-2">Get a Project Quotation</h2>
              <p className="text-slate-600 mb-4 text-sm">Share your requirements and receive competitive quotes from verified contractors.</p>
              <Link to="/quotations?new=true" className="btn btn-primary">
                Request Quotation →
              </Link>
            </div>
            <div className="card p-8 bg-gradient-to-br from-orange-50 to-white border-orange-200">
              <h2 className="text-2xl font-bold font-heading text-slate-900 mb-2">Register as a Vendor</h2>
              <p className="text-slate-600 mb-4 text-sm">List your services or materials. Reach 50,000+ active buyers across India.</p>
              <a href="#" className="btn btn-primary bg-orange-500 hover:bg-orange-600">
                Register Now →
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
