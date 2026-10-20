import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { User, Settings, Shield, LogOut, Edit2, Check, Camera, Trash2, RefreshCw } from 'lucide-react';
import { useAppStore } from '../store/appStore';

type ProfileTab = 'profile' | 'settings';

export default function ProfilePage() {
  const [searchParams] = useSearchParams();
  const { profile, updateProfile, resetDemoData } = useAppStore();
  const [tab, setTab] = useState<ProfileTab>(searchParams.get('tab') === 'settings' ? 'settings' : 'profile');
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [form, setForm] = useState({ ...profile });

  const handleSave = () => {
    updateProfile(form);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    resetDemoData();
    setShowReset(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-6 py-6">
      <h1 className="text-3xl font-bold font-heading text-slate-900 mb-6">My Profile</h1>

      {/* Tab Switcher */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-6">
        {[
          { id: 'profile' as ProfileTab, label: 'Profile', icon: <User size={14} /> },
          { id: 'settings' as ProfileTab, label: 'Settings', icon: <Settings size={14} /> },
        ].map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === id ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {icon} {label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {tab === 'profile' && (
        <div className="card p-6 space-y-5 animate-fade-in">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <img src={profile.avatar} alt={profile.name} className="w-20 h-20 rounded-2xl object-cover" />
              <div className="absolute bottom-0 right-0 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer">
                <Camera size={12} className="text-white" />
              </div>
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-xl">{profile.name}</h2>
              <p className="text-slate-500 text-sm">{profile.email}</p>
              <span className="badge badge-green mt-1"><Shield size={10} /> Demo Account</span>
            </div>
            <button
              onClick={() => { setEditing(!editing); setForm({ ...profile }); }}
              className="btn btn-secondary btn-sm ml-auto"
            >
              {editing ? 'Cancel' : <><Edit2 size={13} /> Edit</>}
            </button>
          </div>

          {/* Fields */}
          <div className="grid grid-cols-1 gap-4">
            {[
              { field: 'name', label: 'Full Name' },
              { field: 'email', label: 'Email Address' },
              { field: 'phone', label: 'Phone Number' },
              { field: 'city', label: 'City' },
            ].map(({ field, label }) => (
              <div key={field}>
                <label className="text-xs font-medium text-slate-500 block mb-1">{label}</label>
                {editing ? (
                  <input
                    className="input"
                    value={form[field as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  />
                ) : (
                  <p className="text-sm font-medium text-slate-900 py-2 border-b border-slate-100">
                    {profile[field as keyof typeof profile]}
                  </p>
                )}
              </div>
            ))}

            <div>
              <label className="text-xs font-medium text-slate-500 block mb-1">Default Address</label>
              {editing ? (
                <textarea
                  className="input resize-none h-20"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
              ) : (
                <p className="text-sm font-medium text-slate-900 py-2 border-b border-slate-100">{profile.address}</p>
              )}
            </div>
          </div>

          {editing && (
            <button onClick={handleSave} className="btn btn-primary w-full btn-lg">
              {saved ? <><Check size={16} /> Saved!</> : 'Save Changes'}
            </button>
          )}

          {saved && !editing && (
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-xl text-green-700 text-sm">
              <Check size={16} /> Profile updated successfully
            </div>
          )}
        </div>
      )}

      {/* Settings Tab */}
      {tab === 'settings' && (
        <div className="space-y-4 animate-fade-in">
          <div className="card p-5">
            <h3 className="font-bold text-slate-900 mb-3">Demo Data</h3>
            <p className="text-sm text-slate-600 mb-4">
              This is a demo application. Reset all data to restore the original seed state — this will clear your cart, bookings, orders, and quotations.
            </p>
            <button
              onClick={() => setShowReset(true)}
              className="btn btn-danger btn-sm"
            >
              <RefreshCw size={14} /> Reset Demo Data
            </button>
          </div>

          <div className="card p-5">
            <h3 className="font-bold text-slate-900 mb-3">Notifications</h3>
            <div className="space-y-3">
              {[
                { label: 'Booking updates', desc: 'Confirmation, reminders, cancellations' },
                { label: 'Order updates', desc: 'Dispatch, delivery, returns' },
                { label: 'Quotation replies', desc: 'New quotes and status changes' },
                { label: 'Promotions', desc: 'Deals and featured listings' },
              ].map(({ label, desc }) => (
                <div key={label} className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-slate-900">{label}</div>
                    <div className="text-xs text-slate-500">{desc}</div>
                  </div>
                  <label className="relative inline-flex cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-10 h-5 bg-slate-200 peer-checked:bg-blue-600 rounded-full transition-colors" />
                    <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-5 shadow-sm" />
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-bold text-slate-900 mb-1">About This Demo</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              BuildNexus is a frontend demo built with React + TypeScript + Vite + Tailwind CSS + Zustand. 
              All data is stored in localStorage. No real API calls, payments, or bookings are made. 
              Credentials, certifications, and guarantees are fictional.
            </p>
          </div>

          <button className="btn btn-ghost w-full text-red-500 hover:bg-red-50 border border-red-100">
            <LogOut size={16} /> Sign Out (Demo — no real effect)
          </button>
        </div>
      )}

      {/* Reset Confirmation */}
      {showReset && (
        <div className="overlay" onClick={() => setShowReset(false)}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <div className="text-center mb-4">
              <Trash2 size={32} className="text-red-500 mx-auto mb-2" />
              <h3 className="font-bold text-slate-900 text-lg">Reset Demo Data?</h3>
              <p className="text-sm text-slate-500 mt-1">This will clear all your bookings, cart, orders, quotations, and restore original seed data.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowReset(false)} className="btn btn-secondary flex-1">Cancel</button>
              <button onClick={handleReset} className="btn btn-danger flex-1">Yes, Reset</button>
            </div>
          </div>
        </div>
      )}

      <div className="mobile-bottom-spacer" />
    </div>
  );
}
