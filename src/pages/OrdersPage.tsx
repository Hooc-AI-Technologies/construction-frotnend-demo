import { Link } from 'react-router-dom';
import { Package, Truck, CheckCircle2, Clock } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { formatINR } from '../config/brand';

const STATUS_MAP = {
  confirmed: { label: 'Confirmed', color: 'badge-blue', icon: <CheckCircle2 size={12} /> },
  processing: { label: 'Processing', color: 'badge-orange', icon: <Clock size={12} /> },
  shipped: { label: 'Shipped', color: 'badge-yellow', icon: <Truck size={12} /> },
  delivered: { label: 'Delivered', color: 'badge-green', icon: <Package size={12} /> },
};

export default function OrdersPage() {
  const { orders } = useAppStore();

  if (orders.length === 0) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-16 text-center">
        <Package size={56} className="text-slate-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold font-heading text-slate-900 mb-2">No orders yet</h1>
        <p className="text-slate-500 mb-6">Your order history will appear here after checkout</p>
        <Link to="/materials" className="btn btn-primary">Shop Building Materials</Link>
        <div className="mobile-bottom-spacer" />
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-6">
      <h1 className="text-3xl font-bold font-heading text-slate-900 mb-6">My Orders</h1>

      <div className="space-y-5">
        {orders.map((order) => {
          const { label, color, icon } = STATUS_MAP[order.status] ?? STATUS_MAP.confirmed;
          return (
            <div key={order.id} className="card p-5">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="text-xs text-slate-500 mb-1">Order ID</div>
                  <div className="font-bold text-slate-900 font-mono">{order.id}</div>
                  <div className="text-xs text-slate-500 mt-1">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <span className={`badge ${color} gap-1`}>{icon} {label}</span>
              </div>

              {/* Items */}
              <div className="space-y-2 mb-4">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-slate-700">{item.name} <span className="text-slate-400">× {item.quantity.toLocaleString('en-IN')} {item.unit}</span></span>
                    <span className="font-medium price">{formatINR(item.total)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-100 pt-3 space-y-1.5 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span><span className="price">{formatINR(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery</span><span className={order.delivery === 0 ? 'text-green-600' : ''}>{order.delivery === 0 ? 'FREE' : formatINR(order.delivery)}</span>
                </div>
                <div className="flex justify-between font-bold text-base text-slate-900 border-t border-slate-100 pt-1.5">
                  <span>Total Paid</span>
                  <span className="price text-blue-700">{formatINR(order.total)}</span>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
                <span><Truck size={11} className="inline mr-1" />Delivery to: {order.address}</span>
                <span>Payment: {order.paymentMethod.toUpperCase()}</span>
              </div>

              <div className="mt-3 p-2.5 bg-amber-50 border border-amber-100 rounded-lg text-xs text-amber-700">
                ⚠️ This is a simulated order — no real payment was made
              </div>
            </div>
          );
        })}
      </div>
      <div className="mobile-bottom-spacer" />
    </div>
  );
}
