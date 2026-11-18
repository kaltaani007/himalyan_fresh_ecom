import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackEvent } from '@/lib/analytics';

export function useActivityTracker() {
  const location = useLocation();
  const pageStartTime = useRef<number>(Date.now());
  const maxScrollLogged = useRef<Set<number>>(new Set());

  // 1. Page View & Dwell Time Tracking
  useEffect(() => {
    const prevPage = location.pathname;
    const dwell = Math.round((Date.now() - pageStartTime.current) / 1000);

    if (dwell > 1) {
      trackEvent({
        type: 'page_dwell',
        path: prevPage,
        seconds: dwell,
      } as any);
    }

    pageStartTime.current = Date.now();
    maxScrollLogged.current.clear();

    trackEvent({
      type: 'page_view',
      path: location.pathname,
      title: document.title || 'Himalayan Fresh',
      timestamp: Date.now(),
    });

    // Cleanup on unmount/route change
    return () => {
      const exitDwell = Math.round((Date.now() - pageStartTime.current) / 1000);
      if (exitDwell > 1) {
        trackEvent({
          type: 'page_dwell',
          path: location.pathname,
          seconds: exitDwell,
        } as any);
      }
    };
  }, [location.pathname]);

  // 2. Scroll Depth Tracking (25%, 50%, 75%, 100%)
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) return;

      const currentScrollPercent = Math.round((window.scrollY / totalHeight) * 100);

      [25, 50, 75, 95].forEach((threshold) => {
        if (currentScrollPercent >= threshold && !maxScrollLogged.current.has(threshold)) {
          maxScrollLogged.current.add(threshold);
          trackEvent({
            type: 'scroll_depth',
            path: location.pathname,
            percent: threshold,
          } as any);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  // 3. Global Click Interaction Tracking
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Find closest actionable element (button, link, input, data-track)
      const actionable = target.closest('button, a, [data-track]');
      if (!actionable) return;

      const trackLabel =
        actionable.getAttribute('data-track') ||
        actionable.getAttribute('aria-label') ||
        actionable.getAttribute('title') ||
        (actionable.textContent ? actionable.textContent.trim().slice(0, 40) : '') ||
        actionable.tagName.toLowerCase();

      trackEvent({
        type: 'user_click',
        element: actionable.tagName.toLowerCase(),
        label: trackLabel,
        path: location.pathname,
        timestamp: Date.now(),
      } as any);
    };

    document.addEventListener('click', handleClick, { passive: true });
    return () => document.removeEventListener('click', handleClick);
  }, [location.pathname]);
}
