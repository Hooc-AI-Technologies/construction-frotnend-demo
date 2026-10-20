import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, FileText, Check, AlertCircle } from 'lucide-react';
import { Modal } from '../ui/Modal';
import type { Professional } from '../../data/seed';
import { useAppStore } from '../../store/appStore';
import { formatINR, getRelativeDateISO } from '../../config/brand';

interface BookingModalProps {
  pro: Professional;
  open: boolean;
  onClose: () => void;
}

interface FormErrors {
  service?: string;
  date?: string;
  time?: string;
  address?: string;
}

const SERVICE_OPTIONS = [
  'New Construction Work',
  'Renovation & Repair',
  'Inspection & Assessment',
  'Consultation',
  'Waterproofing',
  'Interior Work',
  'Custom (describe in notes)',
];

export function BookingModal({ pro, open, onClose }: BookingModalProps) {
  const navigate = useNavigate();
  const { addBooking, profile, deliveryAddress } = useAppStore();
  const [step, setStep] = useState<'form' | 'confirm' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [confirmedId, setConfirmedId] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  const [form, setForm] = useState({
    service: '',
    date: getRelativeDateISO(3),
    time: '09:00',
    address: deliveryAddress,
    notes: '',
  });

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.service) e.service = 'Please select a service';
    if (!form.date) e.date = 'Please select a date';
    if (!form.time) e.time = 'Please select a time';
    if (!form.address.trim()) e.address = 'Please enter a site address';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) setStep('confirm');
  };

  const handleConfirm = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    const id = addBooking({
      professionalId: pro.id,
      professionalName: pro.name,
      professionalAvatar: pro.avatar,
      service: form.service,
      date: form.date,
      time: form.time,
      address: form.address,
      notes: form.notes,
      status: 'upcoming',
      amount: pro.rate,
      amountLabel: pro.rateLabel,
    });
    setConfirmedId(id);
    setLoading(false);
    setStep('success');
  };

  const handleClose = () => {
    setStep('form');
    setErrors({});
    onClose();
  };

  const handleGoToMyWork = () => {
    handleClose();
    navigate('/my-work');
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <Modal open={open} onClose={handleClose} title={step === 'success' ? '🎉 Booking Confirmed' : `Book ${pro.name}`} maxWidth="max-w-lg">
      {step === 'form' && (
        <form onSubmit={handleSubmitForm} className="p-6 space-y-4">
          {/* Pro summary */}
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
            <img src={pro.avatar} alt={pro.name} className="w-12 h-12 rounded-full object-cover" />
            <div>
              <div className="font-bold text-slate-900">{pro.name}</div>
              <div className="text-sm text-slate-500">{pro.specialty}</div>
              <div className="text-sm font-semibold text-blue-700 mt-0.5">{pro.rateLabel}</div>
            </div>
          </div>

          {/* Service */}
          <div>
            <label htmlFor="booking-service" className="text-sm font-medium text-slate-700 block mb-1">
              Service Required <span className="text-red-500">*</span>
            </label>
            <select
              id="booking-service"
              className={`input ${errors.service ? 'error' : ''}`}
              value={form.service}
              onChange={(e) => setForm({ ...form, service: e.target.value })}
            >
              <option value="">Select a service...</option>
              {SERVICE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            {errors.service && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.service}</p>}
          </div>

          {/* Date + Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="booking-date" className="text-sm font-medium text-slate-700 block mb-1">
                <Calendar size={13} className="inline mr-1" />Date <span className="text-red-500">*</span>
              </label>
              <input
                id="booking-date"
                type="date"
                className={`input ${errors.date ? 'error' : ''}`}
                value={form.date}
                min={today}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
              {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
            </div>
            <div>
              <label htmlFor="booking-time" className="text-sm font-medium text-slate-700 block mb-1">
                <Clock size={13} className="inline mr-1" />Time <span className="text-red-500">*</span>
              </label>
              <input
                id="booking-time"
                type="time"
                className={`input ${errors.time ? 'error' : ''}`}
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
              />
              {errors.time && <p className="text-xs text-red-500 mt-1">{errors.time}</p>}
            </div>
          </div>

          {/* Address */}
          <div>
            <label htmlFor="booking-address" className="text-sm font-medium text-slate-700 block mb-1">
              <MapPin size={13} className="inline mr-1" />Site Address <span className="text-red-500">*</span>
            </label>
            <textarea
              id="booking-address"
              className={`input resize-none h-20 ${errors.address ? 'error' : ''}`}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="Plot number, street, city, pincode"
            />
            {errors.address && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.address}</p>}
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="booking-notes" className="text-sm font-medium text-slate-700 block mb-1">
              <FileText size={13} className="inline mr-1" />Project Notes (optional)
            </label>
            <textarea
              id="booking-notes"
              className="input resize-none h-20"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Describe scope of work, special requirements..."
            />
          </div>

          <div className="text-xs text-slate-500 p-3 bg-amber-50 rounded-lg border border-amber-100">
            ⚠️ <strong>Demo Mode:</strong> No real payment is processed. Booking confirmation is simulated.
          </div>

          <button type="submit" className="btn btn-primary w-full btn-lg">
            Review Booking →
          </button>
        </form>
      )}

      {step === 'confirm' && (
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-600">Please review your booking details before confirming.</p>

          <div className="space-y-3 bg-slate-50 rounded-xl p-4">
            {[
              ['Professional', pro.name],
              ['Service', form.service],
              ['Date', new Date(form.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })],
              ['Time', form.time],
              ['Rate', pro.rateLabel],
              ['Site Address', form.address],
              ...(form.notes ? [['Notes', form.notes] as [string, string]] : []),
            ].map(([label, val]) => (
              <div key={label} className="flex gap-3">
                <span className="text-xs font-medium text-slate-500 w-24 flex-shrink-0">{label}</span>
                <span className="text-sm text-slate-900 font-medium">{val}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep('form')} className="btn btn-secondary flex-1">
              ← Edit
            </button>
            <button onClick={handleConfirm} disabled={loading} className="btn btn-primary flex-1">
              {loading ? (
                <><span className="spinner" /> Confirming...</>
              ) : (
                'Confirm Booking'
              )}
            </button>
          </div>
        </div>
      )}

      {step === 'success' && (
        <div className="p-6 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
            <Check size={32} className="text-green-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg mb-1">Booking Confirmed!</h3>
            <p className="text-slate-500 text-sm">Your booking with <strong>{pro.name}</strong> has been placed.</p>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <div className="text-xs text-slate-500 mb-1">Booking ID (Demo)</div>
            <div className="font-bold text-blue-700 text-lg font-mono">{confirmedId}</div>
          </div>
          <div className="text-sm text-slate-600 space-y-1">
            <p>📅 {new Date(form.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })} at {form.time}</p>
            <p>📍 {form.address}</p>
          </div>
          <div className="flex gap-3">
            <button onClick={handleClose} className="btn btn-secondary flex-1">Close</button>
            <button onClick={handleGoToMyWork} className="btn btn-primary flex-1">View in My Work</button>
          </div>
        </div>
      )}
    </Modal>
  );
}
