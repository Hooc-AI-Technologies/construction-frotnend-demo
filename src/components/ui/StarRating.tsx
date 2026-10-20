import { Star, StarHalf } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: number;
  showValue?: boolean;
  reviewCount?: number;
}

export function StarRating({ rating, max = 5, size = 14, showValue = true, reviewCount }: StarRatingProps) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const empty = max - full - (half ? 1 : 0);

  return (
    <span className="flex items-center gap-1">
      {Array.from({ length: full }).map((_, i) => (
        <Star key={`f${i}`} size={size} className="star-filled fill-amber-400 stroke-amber-400" />
      ))}
      {half && <StarHalf size={size} className="star-filled fill-amber-400 stroke-amber-400" />}
      {Array.from({ length: empty }).map((_, i) => (
        <Star key={`e${i}`} size={size} className="text-slate-200" />
      ))}
      {showValue && (
        <span className="text-sm font-semibold text-slate-800 ml-0.5">{rating.toFixed(1)}</span>
      )}
      {reviewCount !== undefined && (
        <span className="text-xs text-slate-500">({reviewCount.toLocaleString('en-IN')})</span>
      )}
    </span>
  );
}
