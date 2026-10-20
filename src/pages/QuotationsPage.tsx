import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Plus, FileText, Check, X, Clock, AlertCircle, ChevronRight } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { Modal } from '../components/ui/Modal';
import { formatINR, getRelativeDateISO } from '../config/brand';

function RequestQuotationModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addQuotation } = useAppStore();
  const [form, setForm] = useState({
    contractor: '',
    service: '',
    area: '',
    areaUnit: 'sq.ft',
    amount: '',
    notes: '',
    validDays: '7',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.service.trim()) e.service = 'Service description required';
    if (!form.notes.trim()) e.notes = 'Project notes required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    addQuotation({
      contractor: form.contractor || 'BuildNexus Partner Contractor',
      service: form.service,
      area: form.area || undefined,
      areaUnit: form.area ? form.areaUnit : undefined,
      amount: Number(form.amount) || 0,
      status: 'pending',
      validUntil: getRelativeDateISO(Number(form.validDays)),
      notes: form.notes,
    });
    setSuccess(true);
  };

  if (success) {
    return (
      <Modal open={open} onClose={onClose} title="Quotation Requested">
        <div className="p-6 text-center space-y-4">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <Check size={28} className="text-green-600" />
          </div>
          <h3 className="font-bold text-slate-900 text-lg">Quotation Request Submitted!</h3>
          <p className="text-slate-500 text-sm">Contractors will review and respond within 24–48 hours.</p>
          <button onClick={onClose} className="btn btn-primary w-full">Done</button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal open={open} onClose={onClose} title="Request a Quotation">
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-700 block mb-1">Service Required *</label>
          <input className={`input ${errors.service ? 'error' : ''}`} value={form.service} onChange={e => setForm({...form, service: e.target.value})} placeholder="e.g. Terrace Waterproofing, RCC Slab" />
          {errors.service && <p className="text-xs text-red-500 mt-1">{errors.service}</p>}
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700 block mb-1">Preferred Contractor (optional)</label>
          <input className="input" value={form.contractor} onChange={e => setForm({...form, contractor: e.target.value})} placeholder="Leave blank to get multiple quotes" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">Area (optional)</label>
            <input type="number" className="input" value={form.area} onChange={e => setForm({...form, area: e.target.value})} placeholder="1800" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">Unit</label>
            <select className="input" value={form.areaUnit} onChange={e => setForm({...form, areaUnit: e.target.value})}>
              {['sq.ft', 'sq.m', 'running ft', 'cubic m', 'units'].map(u => <option key={u}>{u}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700 block mb-1">Expected Budget (₹) (optional)</label>
          <input type="number" className="input" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} placeholder="72000" />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700 block mb-1">Project Notes *</label>
          <textarea className={`input resize-none h-24 ${errors.notes ? 'error' : ''}`} value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} placeholder="Describe scope of work, special requirements, timeline..." />
          {errors.notes && <p className="text-xs text-red-500 mt-1">{errors.notes}</p>}
        </div>
        <button type="submit" className="btn btn-primary w-full btn-lg">Submit Request</button>
      </form>
    </Modal>
  );
}

export default function QuotationsPage() {
  const [searchParams] = useSearchParams();
  const [showNew, setShowNew] = useState(searchParams.get('new') === 'true');
  const { quotations, updateQuotationStatus } = useAppStore();

  const STATUS_MAP = {
    pending: { label: 'Pending', color: 'badge-orange', icon: <Clock size={11} /> },
    accepted: { label: 'Accepted', color: 'badge-green', icon: <Check size={11} /> },
    declined: { label: 'Declined', color: 'badge-red', icon: <X size={11} /> },
    expired: { label: 'Expired', color: 'badge-gray', icon: <AlertCircle size={11} /> },
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold font-heading text-slate-900">Quotations</h1>
          <p className="text-slate-500 mt-1">{quotations.length} quotation{quotations.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setShowNew(true)} className="btn btn-primary btn-sm">
          <Plus size={14} /> Request Quote
        </button>
      </div>

      {quotations.length === 0 ? (
        <div className="card text-center py-16">
          <FileText size={48} className="text-slate-300 mx-auto mb-4" />
          <h2 className="font-bold text-slate-900 text-xl mb-2">No quotations yet</h2>
          <p className="text-slate-500 mb-4">Request quotes from verified contractors</p>
          <button onClick={() => setShowNew(true)} className="btn btn-primary">Request Your First Quote</button>
        </div>
      ) : (
        <div className="space-y-4">
          {quotations.map((q) => {
            const { label, color, icon } = STATUS_MAP[q.status];
            return (
              <div key={q.id} className="card p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`badge ${color} gap-1`}>{icon} {label}</span>
                      <span className="text-xs text-slate-400">{q.id}</span>
                    </div>
                    <h3 className="font-bold text-slate-900">{q.contractor}</h3>
                    <p className="text-sm text-slate-600">{q.service}{q.area && ` · ${q.area} ${q.areaUnit}`}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-900 price">{formatINR(q.amount)}</div>
                    <div className="text-xs text-slate-500">Valid till {new Date(q.validUntil).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
                  </div>
                </div>

                <p className="text-sm text-slate-600 bg-slate-50 rounded-lg p-3 mb-3 leading-relaxed">{q.notes}</p>

                {q.status === 'pending' && (
                  <div className="flex gap-2">
                    <button onClick={() => updateQuotationStatus(q.id, 'accepted')} className="btn btn-success btn-sm flex-1">
                      <Check size={14} /> Accept
                    </button>
                    <button onClick={() => updateQuotationStatus(q.id, 'declined')} className="btn btn-danger btn-sm flex-1">
                      <X size={14} /> Decline
                    </button>
                  </div>
                )}
                {q.status === 'accepted' && (
                  <div className="flex gap-2">
                    <button className="btn btn-primary btn-sm">Proceed to Booking</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="mobile-bottom-spacer" />
      <RequestQuotationModal open={showNew} onClose={() => setShowNew(false)} />
    </div>
  );
}
