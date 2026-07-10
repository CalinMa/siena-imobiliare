"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";

export default function GoogleReviewsMarquee() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [rating, setRating] = useState<number>(5);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/reviews")
      .then(res => res.json())
      .then(data => {
        if (data.reviews) {
          setReviews(data.reviews);
          setRating(data.rating || 5);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load reviews", err);
        setLoading(false);
      });
  }, []);

  if (loading || reviews.length === 0) return null;

  // Duplicate the reviews array to create an infinite loop effect
  const duplicatedReviews = [...reviews, ...reviews, ...reviews, ...reviews];

  return (
    <div className="w-full overflow-hidden relative z-30 pb-4">
      <div className="absolute left-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-r from-gray-900/50 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-l from-gray-900/50 to-transparent z-10 pointer-events-none" />
      
      <div className="flex gap-4 md:gap-6 w-max animate-marquee hover:pause px-2 md:px-4">
        {duplicatedReviews.map((review, i) => (
          <div key={i} className="w-64 md:w-80 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 md:p-4 shrink-0 shadow-lg flex flex-col justify-between text-white hover:scale-105 hover:bg-white/20 hover:z-50 transition-all duration-300">
            <div>
              <div className="flex items-start gap-3 mb-2">
                <img src={review.profile_photo_url} alt={review.author_name} className="w-8 h-8 md:w-10 md:h-10 rounded-full shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-bold text-xs md:text-sm text-white truncate">{review.author_name}</div>
                    <div className="flex text-amber-400 shrink-0">
                      {[...Array(review.rating)].map((_, idx) => (
                        <Star key={idx} className="w-2.5 h-2.5 md:w-3 md:h-3 fill-current" />
                      ))}
                    </div>
                  </div>
                  <div className="text-[10px] text-gray-200">{review.relative_time_description}</div>
                </div>
              </div>
              <p className="text-white/90 text-[11px] md:text-xs line-clamp-2 leading-relaxed italic">
                "{review.text}"
              </p>
            </div>
            <div className="mt-3 flex items-center justify-between text-[10px] font-bold text-white/70">
              <span className="flex items-center gap-1">
                <svg viewBox="0 0 24 24" className="w-3 h-3 text-blue-400 fill-current"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                Google
              </span>
              <a href={review.author_url} target="_blank" className="hover:text-blue-400 transition-colors">Vezi recenzia</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
