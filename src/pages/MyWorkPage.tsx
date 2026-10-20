import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase, Calendar, FileText, Home, Plus, CheckCircle2,
  Clock, AlertCircle, Camera, CreditCard,
  Check, X
} from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { Modal } from '../components/ui/Modal';
import { formatINR, getRelativeDateISO } from '../config/brand';

type Tab = 'overview' | 'projects' | 'bookings' | 'quotations';

// Demo site photos
const SITE_PHOTOS = [
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80',
  'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&q=80',
  'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=400&q=80',
  'https://images.unsplash.com/photo-1513467535987-fd81bc7d62f8?w=400&q=80',
];

function NewProjectModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addProject } = useAppStore();
  const [form, setForm] = useState({ name: '', type: 'Residential', address: '', budget: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Project name required';
    if (!form.address.trim()) e.address = 'Site address required';
    if (!form.budget || isNaN(Number(form.budget))) e.budget = 'Valid budget required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    addProject({
      name: form.name,
      type: form.type,
      status: 'planning',
      startDate: getRelativeDateISO(0),
      estimatedEnd: getRelativeDateISO(90),
      budget: Number(form.budget),
      spent: 0,
      progress: 0,
      address: form.address,
      lastUpdate: new Date().toISOString(),
      lastUpdateNote: 'Project created. Planning phase initiated.',
    });
    setSuccess(true);
  };

  if (success) {
    return (
      <Modal open={open} onClose={onClose} title="Project Created">
        <div className="p-6 text-center space-y-4">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <Check size={28} className="text-green-600" />
          </div>
          <h3 className="font-bold text-slate-900 text-lg">"{form.name}" Created!</h3>
          <p className="text-slate-500 text-sm">Your new project is in the planning phase.</p>
          <button onClick={onClose} className="btn btn-primary w-full">Done</button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal open={open} onClose={onClose} title="Create New Project">
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-700 block mb-1">Project Name *</label>
          <input className={`input ${errors.name ? 'error' : ''}`} value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Home Extension Phase 2" />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700 block mb-1">Project Type</label>
          <select className="input" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
            {['Residential', 'Commercial', 'Renovation', 'Electrical', 'Plumbing', 'Waterproofing', 'Other'].map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700 block mb-1">Site Address *</label>
          <textarea className={`input resize-none h-16 ${errors.address ? 'error' : ''}`} value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
          {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700 block mb-1">Estimated Budget (₹) *</label>
          <input type="number" className={`input ${errors.budget ? 'error' : ''}`} value={form.budget} onChange={e => setForm({...form, budget: e.target.value})} placeholder="500000" />
          {errors.budget && <p className="text-xs text-red-500 mt-1">{errors.budget}</p>}
        </div>
        <button type="submit" className="btn btn-primary w-full btn-lg">Create Project</button>
      </form>
    </Modal>
  );
}

function SitePhotosModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [active, setActive] = useState(0);
  return (
    <Modal open={open} onClose={onClose} title="Site Photos" maxWidth="max-w-3xl">
      <div className="p-6">
        <div className="rounded-xl overflow-hidden h-80 mb-4">
          <img src={SITE_PHOTOS[active]} alt={`Site photo ${active + 1}`} className="w-full h-full object-cover" />
        </div>
        <div className="flex gap-3 justify-center">
          {SITE_PHOTOS.map((photo, i) => (
            <button key={i} onClick={() => setActive(i)} className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${active === i ? 'border-blue-500' : 'border-transparent'}`}>
              <img src={photo} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
        <p className="text-xs text-center text-slate-400 mt-4">⚠️ Demo photos — not actual site images</p>
      </div>
    </Modal>
  );
}

export default function MyWorkPage() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [showNewProject, setShowNewProject] = useState(false);
  const [showPhotos, setShowPhotos] = useState(false);
  const { bookings, quotations, projects, updateQuotationStatus, approveInspection } = useAppStore();

  const urgentCount = projects.filter(p => p.requiresApproval).length
    + quotations.filter(q => q.status === 'pending').length;

  const upcomingBookings = bookings.filter(b => b.status === 'upcoming');
  const pendingQuotations = quotations.filter(q => q.status === 'pending');

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <Home size={15} /> },
    { id: 'projects', label: 'Projects', icon: <Briefcase size={15} /> },
    { id: 'bookings', label: 'Bookings', icon: <Calendar size={15} /> },
    { id: 'quotations', label: 'Quotations', icon: <FileText size={15} /> },
  ];

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold font-heading text-slate-900">My Work</h1>
          <p className="text-slate-500 mt-1">Manage your projects, bookings, and quotations</p>
        </div>
        <button onClick={() => setShowNewProject(true)} className="btn btn-primary btn-sm">
          <Plus size={14} /> New Project
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-6 overflow-x-auto scroll-x">
        {TABS.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
              activeTab === id ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {icon} {label}
            {id === 'overview' && urgentCount > 0 && (
              <span className="badge badge-red ml-1">{urgentCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── Overview Tab ────────────────────────────────────────────── */}
      {activeTab === 'overview' && (
        <div className="space-y-5 animate-fade-in">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <Briefcase size={20} className="text-blue-600" />, num: projects.length, label: 'Projects', color: 'bg-blue-50' },
              { icon: <Calendar size={20} className="text-green-600" />, num: upcomingBookings.length, label: 'Upcoming Bookings', color: 'bg-green-50' },
              { icon: <FileText size={20} className="text-orange-600" />, num: pendingQuotations.length, label: 'Pending Quotes', color: 'bg-orange-50' },
              { icon: <AlertCircle size={20} className="text-red-600" />, num: urgentCount, label: 'Urgent Actions', color: 'bg-red-50' },
            ].map(({ icon, num, label, color }) => (
              <div key={label} className={`card p-4 ${color} border-0`}>
                <div className="flex items-center gap-3">
                  {icon}
                  <div>
                    <div className="text-2xl font-bold font-heading text-slate-900">{num}</div>
                    <div className="text-xs text-slate-600">{label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Inspection Approval Card */}
          {projects.filter(p => p.requiresApproval).map(proj => (
            <div key={proj.id} className="card p-5 border-l-4 border-red-500 bg-red-50">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-red-900 text-sm">Action Required: {proj.approvalType}</div>
                    <div className="text-sm text-red-800 mt-0.5">{proj.name}</div>
                    <div className="text-xs text-red-600 mt-1">Please review and approve the structural inspection report to resume work.</div>
                  </div>
                </div>
                <button
                  onClick={() => approveInspection(proj.id)}
                  className="btn btn-success btn-sm flex-shrink-0"
                >
                  <Check size={14} /> Approve
                </button>
              </div>
            </div>
          ))}

          {/* Upcoming Booking — Rajesh Sharma */}
          {upcomingBookings.map(booking => (
            <div key={booking.id} className="card p-5">
              <div className="flex items-start gap-4">
                <img src={booking.professionalAvatar} alt={booking.professionalName} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-bold text-slate-900">{booking.professionalName}</div>
                      <div className="text-sm text-slate-600">{booking.service}</div>
                    </div>
                    <span className="badge badge-blue flex-shrink-0">Upcoming</span>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Calendar size={11} /> {new Date(booking.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })} at {booking.time}</span>
                    <span className="font-medium text-blue-700">{booking.amountLabel}</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <a href="tel:+91-DEMO" className="btn btn-secondary btn-sm">📞 Call (Demo)</a>
                    <button className="btn btn-ghost btn-sm text-red-500" onClick={() => {}}>Cancel</button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Pending Quotation */}
          {pendingQuotations.map(q => (
            <div key={q.id} className="card p-5 border-l-4 border-orange-400">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="badge badge-orange">Pending Quotation</span>
                    <span className="text-xs text-slate-400">Valid until {new Date(q.validUntil).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                  </div>
                  <div className="font-bold text-slate-900">{q.contractor}</div>
                  <div className="text-sm text-slate-600">{q.service}{q.area && ` · ${q.area} ${q.areaUnit}`}</div>
                  <div className="text-lg font-bold text-slate-900 price mt-1">{formatINR(q.amount)}</div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">{q.notes}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={() => updateQuotationStatus(q.id, 'accepted')} className="btn btn-success btn-sm">
                  <Check size={14} /> Accept
                </button>
                <button onClick={() => updateQuotationStatus(q.id, 'declined')} className="btn btn-danger btn-sm">
                  <X size={14} /> Decline
                </button>
                <button onClick={() => setActiveTab('quotations')} className="btn btn-ghost btn-sm">View Details</button>
              </div>
            </div>
          ))}

          {/* Completed Work Update */}
          {projects.filter(p => p.status === 'completed').map(proj => (
            <div key={proj.id} className="card p-5 border-l-4 border-green-500">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="badge badge-green mb-2">Completed</div>
                  <div className="font-bold text-slate-900">{proj.name}</div>
                  <div className="text-sm text-slate-600 mt-0.5">{proj.lastUpdateNote}</div>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <button className="btn btn-primary btn-sm"><CreditCard size={13} /> Review Payment</button>
                <button onClick={() => setShowPhotos(true)} className="btn btn-secondary btn-sm"><Camera size={13} /> Site Photos</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Projects Tab ─────────────────────────────────────────────── */}
      {activeTab === 'projects' && (
        <div className="space-y-4 animate-fade-in">
          {projects.length === 0 ? (
            <div className="text-center py-16 card">
              <Briefcase size={40} className="text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 mb-4">No projects yet</p>
              <button onClick={() => setShowNewProject(true)} className="btn btn-primary">Create Your First Project</button>
            </div>
          ) : projects.map(proj => (
            <div key={proj.id} className="card p-5">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-lg">{proj.name}</h3>
                    <span className={`badge ${
                      proj.status === 'completed' ? 'badge-green' :
                      proj.status === 'active' ? 'badge-blue' :
                      proj.status === 'inspection' ? 'badge-orange' : 'badge-gray'
                    }`}>{proj.status}</span>
                    {proj.requiresApproval && <span className="badge badge-red"><AlertCircle size={10} /> Action Needed</span>}
                  </div>
                  <p className="text-sm text-slate-500 mt-0.5">{proj.type} · {proj.address}</p>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Progress</span>
                  <span>{proj.progress}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${proj.progress}%` }} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-sm mb-3">
                <div>
                  <div className="text-xs text-slate-500">Budget</div>
                  <div className="font-medium price">{formatINR(proj.budget)}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Spent</div>
                  <div className="font-medium price">{formatINR(proj.spent)}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Est. Completion</div>
                  <div className="font-medium">{new Date(proj.estimatedEnd).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                </div>
              </div>

              <div className="text-xs text-slate-500 bg-slate-50 rounded-lg p-2.5">
                <Clock size={11} className="inline mr-1" />Last update: {proj.lastUpdateNote}
              </div>

              {proj.requiresApproval && (
                <button onClick={() => approveInspection(proj.id)} className="btn btn-success btn-sm mt-3 w-full">
                  <CheckCircle2 size={14} /> Approve {proj.approvalType}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Bookings Tab ─────────────────────────────────────────────── */}
      {activeTab === 'bookings' && (
        <div className="space-y-4 animate-fade-in">
          {bookings.length === 0 ? (
            <div className="text-center py-16 card">
              <Calendar size={40} className="text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 mb-4">No bookings yet</p>
              <Link to="/professionals" className="btn btn-primary">Find a Professional</Link>
            </div>
          ) : bookings.map(b => (
            <div key={b.id} className="card p-5">
              <div className="flex items-start gap-4">
                <img src={b.professionalAvatar} alt={b.professionalName} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-bold text-slate-900">{b.professionalName}</div>
                      <div className="text-sm text-slate-600">{b.service}</div>
                    </div>
                    <span className={`badge flex-shrink-0 ${
                      b.status === 'upcoming' ? 'badge-blue' :
                      b.status === 'active' ? 'badge-green' :
                      b.status === 'completed' ? 'badge-gray' : 'badge-red'
                    }`}>{b.status}</span>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-500">
                    <span><Calendar size={10} className="inline mr-1" />{new Date(b.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })} · {b.time}</span>
                    <span className="font-medium text-blue-700">{b.amountLabel}</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1"><span className="font-medium">Booking ID:</span> {b.id}</div>
                  {b.notes && <div className="text-xs text-slate-500 mt-1 italic">"{b.notes}"</div>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Quotations Tab ───────────────────────────────────────────── */}
      {activeTab === 'quotations' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex justify-end">
            <Link to="/quotations?new=true" className="btn btn-primary btn-sm">
              <Plus size={14} /> Request Quotation
            </Link>
          </div>
          {quotations.length === 0 ? (
            <div className="text-center py-16 card">
              <FileText size={40} className="text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 mb-4">No quotations yet</p>
              <Link to="/quotations?new=true" className="btn btn-primary">Request a Quote</Link>
            </div>
          ) : quotations.map(q => (
            <div key={q.id} className="card p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`badge ${
                      q.status === 'pending' ? 'badge-orange' :
                      q.status === 'accepted' ? 'badge-green' :
                      q.status === 'declined' ? 'badge-red' : 'badge-gray'
                    }`}>{q.status}</span>
                    <span className="text-xs text-slate-400">ID: {q.id}</span>
                  </div>
                  <div className="font-bold text-slate-900">{q.contractor}</div>
                  <div className="text-sm text-slate-600">{q.service}{q.area && ` · ${q.area} ${q.areaUnit}`}</div>
                  <div className="text-xl font-bold text-slate-900 price mt-1">{formatINR(q.amount)}</div>
                </div>
                <div className="text-right text-xs text-slate-500">
                  <div>Valid until</div>
                  <div className="font-medium">{new Date(q.validUntil).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
                </div>
              </div>
              <p className="text-sm text-slate-600 bg-slate-50 rounded-lg p-3 leading-relaxed">{q.notes}</p>
              {q.status === 'pending' && (
                <div className="flex gap-2 mt-3">
                  <button onClick={() => updateQuotationStatus(q.id, 'accepted')} className="btn btn-success btn-sm flex-1">
                    <Check size={14} /> Accept Quote
                  </button>
                  <button onClick={() => updateQuotationStatus(q.id, 'declined')} className="btn btn-danger btn-sm flex-1">
                    <X size={14} /> Decline
                  </button>
                </div>
              )}
              {q.status === 'accepted' && (
                <div className="flex gap-2 mt-3">
                  <button className="btn btn-primary btn-sm"><CreditCard size={13} /> Make Payment (Demo)</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mobile-bottom-spacer" />
      <NewProjectModal open={showNewProject} onClose={() => setShowNewProject(false)} />
      <SitePhotosModal open={showPhotos} onClose={() => setShowPhotos(false)} />
    </div>
  );
}
