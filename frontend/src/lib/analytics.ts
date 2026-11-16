// Himalayan Fresh Analytics & User Tracking System
// Tracks page views, product impressions, cart changes, and checkout milestones

export type TrackingEvent =
  | { type: 'page_view'; path: string; title: string; timestamp: number }
  | { type: 'product_view'; productId: number; slug: string; name: string; price: number }
  | { type: 'add_to_cart'; productId: number; name: string; quantity: number; price: number }
  | { type: 'remove_from_cart'; productId: number }
  | { type: 'wishlist_toggle'; productId: number; inWishlist: boolean }
  | { type: 'checkout_step'; step: number; stepName: string; cartTotal: number }
  | { type: 'order_placed'; orderNumber: string; total: number; paymentMethod: string }
  | { type: 'search_query'; query: string; resultsCount: number }
  | { type: 'ai_chat_interaction'; message: string; role: 'user' | 'assistant' };

const STORAGE_KEY = 'hf_user_analytics_events';
const MAX_STORED_EVENTS = 100;

export const trackEvent = (event: TrackingEvent) => {
  const enrichedEvent = {
    ...event,
    timestamp: Date.now(),
    url: window.location.href,
  };

  // 1. Console log in development
  if (import.meta.env.DEV) {
    console.log('[HF Analytics]', enrichedEvent.type, enrichedEvent);
  }

  // 2. Persist in session / localStorage for abandoned cart recovery
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const events: any[] = raw ? JSON.parse(raw) : [];
    events.push(enrichedEvent);
    if (events.length > MAX_STORED_EVENTS) {
      events.shift();
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch (err) {
    // Silent fail for storage quotas
  }

  // 3. Dispatch custom browser event if any listener wants to react (e.g. Pixel or GTM)
  window.dispatchEvent(new CustomEvent('hf:analytics', { detail: enrichedEvent }));
};

export const getStoredAnalytics = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export default trackEvent;
