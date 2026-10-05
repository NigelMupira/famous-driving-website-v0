import React from 'react';
import { Star } from 'lucide-react';

export default function StarRating({ rating, setRating, interactive = false, size = 'sm' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const starSize = sizes[size] || sizes.sm;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={interactive ? 'button' : undefined}
          disabled={!interactive}
          onClick={() => interactive && setRating && setRating(star)}
          className={`${interactive ? 'hover:scale-125 transition-transform cursor-pointer focus:outline-none' : 'cursor-default'}`}
        >
          <Star
            className={`${starSize} ${
              star <= rating
                ? 'fill-amber-400 text-amber-400'
                : 'fill-slate-700 text-slate-600'
            }`}
          />
        </button>
      ))}
    </div>
  );
}
