import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X } from 'lucide-react';

interface ActivityItem {
  id: number;
  user: string;
  city: string;
  action: string;
  item: string;
  timeAgo: string;
}

const activities: ActivityItem[] = [
  { id: 1, user: 'Priya S.', city: 'Mumbai', action: 'purchased', item: '2kg Kinnaur Royal Red Apples', timeAgo: '2 mins ago' },
  { id: 2, user: 'Amit K.', city: 'Delhi NCR', action: 'ordered', item: '1kg Golden Delicious Premium', timeAgo: '6 mins ago' },
  { id: 3, user: 'Sneha R.', city: 'Bangalore', action: 'purchased', item: '500g Kinnaur Black Walnuts', timeAgo: '11 mins ago' },
  { id: 4, user: 'Rohan M.', city: 'Chandigarh', action: 'pre-ordered', item: 'Alpine Wild Cherries', timeAgo: '15 mins ago' },
  { id: 5, user: 'Kavita D.', city: 'Pune', action: 'ordered', item: '3kg Wax-Free Shimla Apples', timeAgo: '24 mins ago' },
];

export const LiveActivityTicker: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (isDismissed) return;

    // Show initial notification after 4 seconds
    const initialTimer = setTimeout(() => {
      setIsVisible(true);
    }, 4000);

    // Rotate notification every 14 seconds
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % activities.length);
        setIsVisible(true);
      }, 1000);
    }, 14000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [isDismissed]);

  if (isDismissed) return null;

  const current = activities[currentIndex];

  return (
    <div className="fixed bottom-6 left-6 z-40 hidden sm:block pointer-events-none select-none">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="pointer-events-auto bg-white/95 backdrop-blur-md rounded-2xl p-3.5 pr-4 border border-border-light shadow-xl flex items-center gap-3.5 max-w-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <ShoppingBag className="w-5 h-5 text-primary" />
            </div>

            <div className="text-xs space-y-0.5 leading-snug">
              <p className="font-semibold text-text-primary">
                {current.user}{' '}
                <span className="font-normal text-text-secondary">
                  from {current.city}
                </span>
              </p>
              <p className="text-primary font-bold line-clamp-1">
                {current.action} {current.item}
              </p>
              <p className="text-[10px] text-text-tertiary flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {current.timeAgo} · Verified Orchard Order
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsDismissed(true)}
              className="text-text-light hover:text-text-primary p-1 transition-colors ml-1 cursor-pointer"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LiveActivityTicker;
