import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Minus, Plus, Truck, Heart, Info } from 'lucide-react';
import type { Material } from '../../data/seed';
import { useAppStore } from '../../store/appStore';
import { formatINR } from '../../config/brand';
import { StarRating } from '../ui/StarRating';

interface MaterialCardProps {
  material: Material;
}

export function MaterialCard({ material: mat }: MaterialCardProps) {
  const { addToCart, cart, updateCartQty, removeFromCart, toggleWishlist, isWishlisted } = useAppStore();
  const wishlisted = isWishlisted(mat.id);
  const cartItem = cart.find((c) => c.materialId === mat.id);
  const [qty, setQty] = useState(cartItem?.quantity ?? mat.moq);
  const [imgError, setImgError] = useState(false);

  // Find applicable bulk tier
  const getApplicableTier = (q: number) =>
    [...mat.bulkTiers].reverse().find((t) => q >= t.minQty) ?? mat.bulkTiers[0];

  const currentTier = getApplicableTier(qty);
  const pricePerUnit = currentTier.pricePerUnit;
  const lineTotal = pricePerUnit * qty;

  const decreaseQty = () => {
    const newQty = Math.max(mat.moq, qty - mat.qtyStep);
    setQty(newQty);
    if (cartItem) updateCartQty(mat.id, newQty);
  };

  const increaseQty = () => {
    const newQty = Math.min(mat.stock, qty + mat.qtyStep);
    setQty(newQty);
    if (cartItem) updateCartQty(mat.id, newQty);
  };

  const handleAddToCart = () => {
    addToCart(mat.id, qty, pricePerUnit);
  };

  const handleRemove = () => {
    removeFromCart(mat.id);
    setQty(mat.moq);
  };

  return (
    <div className="card overflow-hidden flex flex-col">
      {/* Image */}
      <div className="relative h-44 bg-slate-100 overflow-hidden">
        {!imgError ? (
          <img
            src={mat.image}
            alt={mat.name}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl bg-slate-100">📦</div>
        )}
        <button
          onClick={() => toggleWishlist(mat.id)}
          className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
            wishlisted ? 'bg-red-500 text-white' : 'bg-white/90 text-slate-600 hover:bg-white'
          }`}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart size={15} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>
        {!mat.inStock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="badge badge-red text-sm font-bold">Out of Stock</span>
          </div>
        )}
        <span className="absolute bottom-2 left-2 badge badge-blue">{mat.category}</span>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col gap-3">
        {/* Supplier + Rating */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs text-blue-600 font-medium">{mat.supplier}</p>
            <h3 className="font-bold text-slate-900 text-sm leading-tight mt-0.5">{mat.name}</h3>
          </div>
          <StarRating rating={mat.rating} size={11} reviewCount={mat.reviewCount} showValue={false} />
        </div>

        {/* Specs */}
        <div className="grid grid-cols-2 gap-1">
          {Object.entries(mat.specs).slice(0, 4).map(([k, v]) => (
            <div key={k} className="text-[11px]">
              <span className="text-slate-500">{k}: </span>
              <span className="text-slate-800 font-medium">{v}</span>
            </div>
          ))}
        </div>

        {/* Delivery */}
        <div className="flex items-center gap-1.5 text-xs text-green-700 bg-green-50 px-2 py-1.5 rounded-lg">
          <Truck size={13} />
          <span>Delivery in {mat.deliveryDays} day{mat.deliveryDays > 1 ? 's' : ''}</span>
          <span className="text-slate-400">·</span>
          <span className="text-slate-500">Min. {mat.moq.toLocaleString('en-IN')} {mat.unit}</span>
        </div>

        {/* Bulk Tiers */}
        <div className="space-y-1">
          <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1"><Info size={11} /> Bulk Pricing</p>
          <div className="flex flex-wrap gap-1">
            {mat.bulkTiers.map((t) => (
              <span
                key={t.minQty}
                className={`badge text-[10px] ${qty >= t.minQty && t === currentTier ? 'badge-green' : 'badge-gray'}`}
              >
                {t.label}
              </span>
            ))}
          </div>
        </div>

        {/* Price + Qty control */}
        <div className="flex-1" />
        <div className="border-t border-slate-100 pt-3">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-xs text-slate-500">per {mat.unit}</span>
              <div className="text-xl font-bold text-slate-900 price">{formatINR(pricePerUnit)}</div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500">Subtotal ({qty.toLocaleString('en-IN')} {mat.unit})</span>
              <div className="text-base font-bold text-blue-700 price">{formatINR(lineTotal)}</div>
            </div>
          </div>

          {/* Qty Stepper */}
          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={decreaseQty}
              disabled={qty <= mat.moq || !mat.inStock}
              className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors disabled:opacity-40"
              aria-label="Decrease quantity"
            >
              <Minus size={14} />
            </button>
            <input
              type="number"
              value={qty}
              onChange={(e) => {
                const v = Math.max(mat.moq, Math.min(mat.stock, Number(e.target.value)));
                const snapped = Math.ceil(v / mat.qtyStep) * mat.qtyStep;
                setQty(snapped);
                if (cartItem) updateCartQty(mat.id, snapped);
              }}
              className="flex-1 text-center border border-slate-200 rounded-lg py-1.5 text-sm font-medium outline-none focus:border-blue-400"
              aria-label={`Quantity in ${mat.unit}`}
              min={mat.moq}
              max={mat.stock}
              step={mat.qtyStep}
            />
            <button
              onClick={increaseQty}
              disabled={qty >= mat.stock || !mat.inStock}
              className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors disabled:opacity-40"
              aria-label="Increase quantity"
            >
              <Plus size={14} />
            </button>
          </div>

          {/* Cart Action */}
          {cartItem ? (
            <div className="flex gap-2">
              <button onClick={handleRemove} className="btn btn-secondary btn-sm flex-1">
                Remove
              </button>
              <Link to="/cart" className="btn btn-primary btn-sm flex-1">
                View Cart
              </Link>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={!mat.inStock}
              className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart size={16} /> Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

