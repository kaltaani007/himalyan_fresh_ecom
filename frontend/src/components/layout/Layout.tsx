import { useState, useRef, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, User, MessageCircle, Sparkles } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Toaster } from 'react-hot-toast';
import { trackEvent } from '@/lib/analytics';
import { LiveActivityTicker } from '@/components/ui/LiveActivityTicker';

export default function Layout() {
  const location = useLocation();
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState<{ role: string; content: string }[]>([
    {
      role: 'assistant',
      content:
        'Namaste! I am your Himalayan Orchard Concierge. How can I assist your selection of fresh mountain produce today?',
    },
  ]);
  const [aiInput, setAiInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Track page views on location changes
  useEffect(() => {
    trackEvent({
      type: 'page_view',
      path: location.pathname,
      title: document.title,
      timestamp: Date.now(),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages]);

  const handleAISend = () => {
    if (!aiInput.trim()) return;
    const userMsg = aiInput;
    const newMessages = [...aiMessages, { role: 'user', content: userMsg }];
    setAiMessages(newMessages);
    setAiInput('');
    setIsTyping(true);

    trackEvent({ type: 'ai_chat_interaction', message: userMsg, role: 'user' });

    setTimeout(() => {
      const q = userMsg.toLowerCase();
      let reply = '';

      if (q.includes('apple') || q.includes('variety')) {
        reply =
          'Our signature Royal Red Delicious and Golden Delicious apples are harvested above 2,600m in Kinnaur and Shimla. They are 100% wax-free with high natural sweetness!';
      } else if (q.includes('ship') || q.includes('deliver') || q.includes('time')) {
        reply =
          'We ship in temperature-controlled eco-packaging within 48 to 72 hours across India. Orders above ₹999 qualify for Free Express Shipping!';
      } else if (q.includes('walnut') || q.includes('nut') || q.includes('dry')) {
        reply =
          'Our Kinnaur Black Walnuts and wild mountain almonds are cold-cracked and rich in natural omega-3 oils. You can find them in our Dry Fruits category.';
      } else if (q.includes('district') || q.includes('origin') || q.includes('where')) {
        reply =
          'We source directly from 12 districts across Himachal Pradesh, including Kinnaur (Apples & Walnuts), Kullu (Cherries & Pears), and Kangra (Herbal Teas).';
      } else {
        reply =
          'We harvest daily from Himachal mountain farms. Would you like to explore our Royal Apples collection or check seasonal harvest availability?';
      }

      setAiMessages([...newMessages, { role: 'assistant', content: reply }]);
      setIsTyping(false);
      trackEvent({ type: 'ai_chat_interaction', message: reply, role: 'assistant' });
    }, 1200);
  };

  const quickQuestions = [
    'Show me Royal Apples',
    'Are apples wax-free?',
    'Shipping delivery timeline',
    'Best-selling dry fruits',
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background-primary">
      <Navbar />
      <main className="flex-1 pt-16 lg:pt-20">
        <Outlet />
      </main>
      <Footer />

      {/* Real-time Verified Buyer Activity Ticker */}
      <LiveActivityTicker />

      {/* Floating AI Assistant Launcher Button */}
      <motion.button
        onClick={() => setIsAIOpen(true)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-white shadow-premium flex items-center justify-center cursor-pointer border-2 border-white/80"
        aria-label="Open Himalayan Assistant"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-accent rounded-full border-2 border-white" />
      </motion.button>

      {/* AI Assistant Chat Modal */}
      <AnimatePresence>
        {isAIOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.94 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[540px] max-h-[80vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-border-light select-none"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 bg-primary text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base leading-tight text-white flex items-center gap-1.5">
                    Himalayan Concierge <Sparkles className="w-3.5 h-3.5 text-accent" />
                  </h3>
                  <p className="text-[11px] text-cream-200/80">
                    Live Harvest &amp; Terroir Assistant
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAIOpen(false)}
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conversation Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-background-secondary text-xs">
              {aiMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                      msg.role === 'assistant'
                        ? 'bg-primary text-white'
                        : 'bg-background-tertiary text-text-primary'
                    }`}
                  >
                    {msg.role === 'assistant' ? (
                      <Bot className="w-3.5 h-3.5" />
                    ) : (
                      <User className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <div
                    className={`max-w-[80%] px-4 py-2.5 rounded-2xl leading-relaxed shadow-sm ${
                      msg.role === 'user'
                        ? 'bg-primary text-white rounded-br-none'
                        : 'bg-white text-text-primary border border-border-light rounded-bl-none'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-2.5 items-center">
                  <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center shrink-0">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="bg-white border border-border-light px-3.5 py-2 rounded-2xl rounded-bl-none flex gap-1">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                    <span
                      className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: '150ms' }}
                    />
                    <span
                      className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: '300ms' }}
                    />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            {aiMessages.length <= 2 && (
              <div className="p-3 bg-white border-t border-border-light">
                <p className="text-[11px] font-semibold text-text-tertiary mb-1.5">
                  Suggested Questions:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {quickQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAiInput(q)}
                      className="text-[11px] px-2.5 py-1 rounded-full bg-background-tertiary text-text-secondary hover:bg-primary hover:text-white transition-colors cursor-pointer"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Bar */}
            <div className="p-3.5 bg-white border-t border-border-light flex gap-2">
              <input
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAISend()}
                placeholder="Ask about apples, delivery, terroir..."
                className="input-field text-xs py-2.5 px-3 flex-1"
              />
              <button
                type="button"
                onClick={handleAISend}
                disabled={!aiInput.trim()}
                className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center disabled:opacity-40 hover:bg-primary-dark transition-all cursor-pointer shrink-0 shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1e4631',
            color: '#ffffff',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '500',
          },
        }}
      />
    </div>
  );
}
