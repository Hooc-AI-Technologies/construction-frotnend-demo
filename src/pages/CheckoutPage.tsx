import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, CreditCard, Landmark, Smartphone, Check, Shield, AlertTriangle } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { formatINR } from '../config/brand';

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI / PhonePe / GPay', icon: <Smartphone size={18} />, desc: 'Instant · No extra charges' },
  { id: 'netbanking', label: 'Net Banking', icon: <Landmark size={18} />, desc: 'NEFT / RTGS · 1-2 hours' },
  { id: 'card', label: 'Credit / Debit Card', icon: <CreditCard size={18} />, desc: 'Visa, Mastercard, RuPay' },
  { id: 'cod', label: 'Cash on Delivery', icon: <span className="text-lg">💵</span>, desc: 'Pay when delivered' },
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, materials, getCartTotal, placeOrder, profile, deliveryAddress } = useAppStore();

  const [step, setStep] = useState<'address' | 'payment' | 'success'>('address');
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('upi');

  const [address, setAddress] = useState({
    name: profile.name,
    phone: profile.phone,
    addressLine: deliveryAddress,
    city: profile.city,
    pincode: '122002',
    state: 'Haryana',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const cartItems = cart.map((ci) => {
    const mat = materials.find((m) => m.id === ci.materialId)!;
    const tier = mat ? [...mat.bulkTiers].reverse().find((t) => ci.quantity >= t.minQty) : undefined;
    const price = tier?.pricePerUnit ?? mat?.price ?? ci.pricePerUnit;
    return { ...ci, mat, price, total: price * ci.quantity };
  }).filter((ci) => ci.mat);

  const subtotal = getCartTotal();
  const delivery = subtotal > 50000 ? 0 : 999;
  const total = subtotal + delivery;

  if (cartItems.length === 0) {
    return (
      <div className="max-w-[1280px] mx-auto px-6 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-3">Nothing to checkout</h1>
        <Link to="/materials" className="btn btn-primary">Shop Materials</Link>
      </div>
    );
  }

  const validateAddress = () => {
    const e: Record<string, string> = {};
    if (!address.name.trim()) e.name = 'Name is required';
    if (!address.phone.trim()) e.phone = 'Phone is required';
    if (!address.addressLine.trim()) e.addressLine = 'Address is required';
    if (!address.city.trim()) e.city = 'City is required';
    if (!/^\d{6}$/.test(address.pincode)) e.pincode = 'Enter valid 6-digit pincode';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    const id = placeOrder(
      `${address.addressLine}, ${address.city}, ${address.state} - ${address.pincode}`,
      selectedPayment
    );
    setOrderId(id);
    setLoading(false);
    setStep('success');
  };

  if (step === 'success') {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <Check size={40} className="text-green-600" />
        </div>
        <h1 className="text-3xl font-bold font-heading text-slate-900 mb-2">Order Placed! 🎉</h1>
        <p className="text-slate-500 mb-6">Your order has been confirmed and will be dispatched shortly.</p>
        <div className="card p-6 mb-6 text-left space-y-3">
          <div className="text-center">
            <div className="text-xs text-slate-500">Order ID (Demo)</div>
            <div className="text-xl font-bold text-blue-700 font-mono">{orderId}</div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm border-t border-slate-100 pt-3">
            <div><span className="text-slate-500">Payment</span><br /><span className="font-medium capitalize">{PAYMENT_METHODS.find(p=>p.id===selectedPayment)?.label}</span></div>
            <div><span className="text-slate-500">Total Amount</span><br /><span className="font-bold text-blue-700 price">{formatINR(total)}</span></div>
            <div className="col-span-2"><span className="text-slate-500">Delivery To</span><br /><span className="font-medium">{address.addressLine}, {address.city}</span></div>
          </div>
          <div className="badge badge-yellow w-full justify-center p-3">
            <AlertTriangle size={14} /> Payment is simulated — no real transaction occurred
          </div>
        </div>
        <div className="flex gap-3 justify-center">
          <Link to="/orders" className="btn btn-primary">View My Orders</Link>
          <Link to="/materials" className="btn btn-secondary">Shop More</Link>
        </div>
        <div className="mobile-bottom-spacer" />
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => step === 'payment' ? setStep('address') : navigate(-1)} className="btn btn-ghost p-2" aria-label="Back">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold font-heading text-slate-900">Checkout</h1>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-6">
        {['address', 'payment'].map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              step === s || (step === 'payment' && s === 'address') ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'
            }`}>
              {step === 'payment' && s === 'address' ? <Check size={14} /> : i + 1}
            </div>
            <span className={`text-sm font-medium capitalize ${step === s ? 'text-blue-600' : 'text-slate-400'}`}>{s === 'address' ? 'Delivery Address' : 'Payment'}</span>
            {i === 0 && <div className="w-12 h-0.5 bg-slate-200 rounded" />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          {step === 'address' && (
            <div className="card p-6 space-y-4">
              <h2 className="font-bold text-slate-900 text-lg font-heading flex items-center gap-2">
                <MapPin size={18} className="text-blue-600" /> Delivery Address
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Full Name *</label>
                  <input className={`input ${errors.name ? 'error' : ''}`} value={address.name} onChange={e => setAddress({...address, name: e.target.value})} />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Phone *</label>
                  <input className={`input ${errors.phone ? 'error' : ''}`} value={address.phone} onChange={e => setAddress({...address, phone: e.target.value})} />
                  {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-slate-700 block mb-1">Address Line *</label>
                  <textarea className={`input resize-none h-20 ${errors.addressLine ? 'error' : ''}`} value={address.addressLine} onChange={e => setAddress({...address, addressLine: e.target.value})} />
                  {errors.addressLine && <p className="text-xs text-red-500 mt-1">{errors.addressLine}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">City *</label>
                  <input className={`input ${errors.city ? 'error' : ''}`} value={address.city} onChange={e => setAddress({...address, city: e.target.value})} />
                  {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Pincode *</label>
                  <input className={`input ${errors.pincode ? 'error' : ''}`} value={address.pincode} maxLength={6} onChange={e => setAddress({...address, pincode: e.target.value.replace(/\D/,'')})} />
                  {errors.pincode && <p className="text-xs text-red-500 mt-1">{errors.pincode}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">State</label>
                  <input className="input" value={address.state} onChange={e => setAddress({...address, state: e.target.value})} />
                </div>
              </div>
              <button onClick={() => { if (validateAddress()) setStep('payment'); }} className="btn btn-primary w-full btn-lg">
                Continue to Payment →
              </button>
            </div>
          )}

          {step === 'payment' && (
            <div className="card p-6 space-y-4">
              <h2 className="font-bold text-slate-900 text-lg font-heading flex items-center gap-2">
                <CreditCard size={18} className="text-blue-600" /> Payment Method
              </h2>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800 flex items-start gap-2">
                <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
                <span><strong>Demo Mode:</strong> No real payment is processed. Selecting any option will simulate a successful payment.</span>
              </div>
              <div className="space-y-3">
                {PAYMENT_METHODS.map((pm) => (
                  <label key={pm.id} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${selectedPayment === pm.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-200'}`}>
                    <input type="radio" name="payment" value={pm.id} checked={selectedPayment === pm.id} onChange={() => setSelectedPayment(pm.id)} className="accent-blue-600" />
                    <div className="text-blue-600">{pm.icon}</div>
                    <div className="flex-1">
                      <div className="font-medium text-slate-900">{pm.label}</div>
                      <div className="text-xs text-slate-500">{pm.desc}</div>
                    </div>
                    {selectedPayment === pm.id && <Check size={18} className="text-blue-600" />}
                  </label>
                ))}
              </div>
              <button onClick={handlePlaceOrder} disabled={loading} className="btn btn-primary w-full btn-lg">
                {loading ? (
                  <><span className="spinner" /> Processing...</>
                ) : (
                  <><Shield size={18} /> Place Order · {formatINR(total)}</>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="card p-6 self-start sticky top-24 space-y-3">
          <h3 className="font-bold text-slate-900 font-heading">Order Summary</h3>
          <div className="space-y-2 text-sm max-h-48 overflow-y-auto">
            {cartItems.map(({ mat, quantity, total }) => (
              <div key={mat.id} className="flex justify-between text-slate-600">
                <span className="truncate pr-2 flex-1">{mat.name} × {quantity.toLocaleString('en-IN')}</span>
                <span className="flex-shrink-0">{formatINR(total)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-100 pt-3 space-y-2 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span className="price">{formatINR(subtotal)}</span></div>
            <div className="flex justify-between"><span>Delivery</span><span className={delivery === 0 ? 'text-green-600' : ''}>{delivery === 0 ? 'FREE' : formatINR(delivery)}</span></div>
            <div className="flex justify-between font-bold text-base border-t border-slate-200 pt-2">
              <span>Total</span><span className="text-blue-700 price">{formatINR(total)}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="mobile-bottom-spacer" />
    </div>
  );
}
