import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ArrowLeft, Truck, Shield, Tag } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { formatINR } from '../config/brand';

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, materials, updateCartQty, removeFromCart, getCartTotal } = useAppStore();

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
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-16 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h1 className="text-2xl font-bold font-heading text-slate-900 mb-2">Your cart is empty</h1>
        <p className="text-slate-500 mb-6">Add building materials to get started</p>
        <Link to="/materials" className="btn btn-primary btn-lg">Browse Materials</Link>
        <div className="mobile-bottom-spacer" />
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="btn btn-ghost p-2" aria-label="Go back">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold font-heading text-slate-900">
          Shopping Cart <span className="text-slate-400 font-normal text-lg">({cartItems.length} items)</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map(({ mat, quantity, price, total }) => (
            <div key={mat.id} className="card p-4">
              <div className="flex gap-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                  <img src={mat.image} alt={mat.name} className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = ''; }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs text-blue-600 font-medium">{mat.supplier}</p>
                      <h3 className="font-bold text-slate-900 text-sm">{mat.name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{mat.grade} · {mat.unit}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(mat.id)}
                      className="text-red-400 hover:text-red-600 p-1"
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    {/* Qty Stepper */}
                    <div className="flex items-center gap-2 border border-slate-200 rounded-lg">
                      <button
                        onClick={() => updateCartQty(mat.id, Math.max(mat.moq, quantity - mat.qtyStep))}
                        className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 transition-colors"
                        aria-label="Decrease"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="w-12 text-center text-sm font-medium">{quantity.toLocaleString('en-IN')}</span>
                      <button
                        onClick={() => updateCartQty(mat.id, Math.min(mat.stock, quantity + mat.qtyStep))}
                        disabled={quantity >= mat.stock}
                        className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 transition-colors disabled:opacity-40"
                        aria-label="Increase"
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-slate-500">{formatINR(price)}/{mat.unit}</div>
                      <div className="font-bold text-slate-900 price">{formatINR(total)}</div>
                    </div>
                  </div>

                  {/* Bulk tier badge */}
                  {mat.bulkTiers.length > 1 && (() => {
                    const tier = [...mat.bulkTiers].reverse().find((t) => quantity >= t.minQty);
                    const nextTier = mat.bulkTiers.find((t) => quantity < t.minQty);
                    return (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {tier && <span className="badge badge-green text-[10px]"><Tag size={9} /> {tier.label} applied</span>}
                        {nextTier && <span className="badge badge-gray text-[10px]">Add {(nextTier.minQty - quantity).toLocaleString('en-IN')} more for {nextTier.label}</span>}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:sticky lg:top-24 self-start">
          <div className="card p-6 space-y-4">
            <h2 className="font-bold text-slate-900 text-lg font-heading">Order Summary</h2>

            <div className="space-y-2 text-sm">
              {cartItems.map(({ mat, quantity, total }) => (
                <div key={mat.id} className="flex justify-between text-slate-600">
                  <span className="truncate pr-2">{mat.name} × {quantity.toLocaleString('en-IN')}</span>
                  <span className="flex-shrink-0 font-medium">{formatINR(total)}</span>
                </div>
              ))}
              <div className="border-t border-slate-100 pt-2 flex justify-between text-slate-700 font-medium">
                <span>Subtotal</span>
                <span className="price">{formatINR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span className="flex items-center gap-1"><Truck size={13} /> Delivery</span>
                <span className={delivery === 0 ? 'text-green-600 font-medium' : ''}>{delivery === 0 ? 'FREE' : formatINR(delivery)}</span>
              </div>
              {delivery > 0 && (
                <p className="text-xs text-slate-400">Free delivery on orders above {formatINR(50000)}</p>
              )}
              <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-lg text-slate-900">
                <span>Total</span>
                <span className="price text-blue-700">{formatINR(total)}</span>
              </div>
            </div>

            <Link to="/checkout" className="btn btn-primary w-full btn-lg">
              Proceed to Checkout →
            </Link>

            <div className="text-xs text-center text-slate-400 flex items-center justify-center gap-1">
              <Shield size={12} /> Escrow-protected checkout · Demo only
            </div>

            <Link to="/materials" className="btn btn-ghost btn-sm w-full text-slate-500">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      <div className="mobile-bottom-spacer" />
    </div>
  );
}
