import { useState, useRef, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, User, MessageCircle } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Toaster } from 'react-hot-toast';

export default function Layout() {
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState<{role: string, content: string}[]>([
    { role: 'assistant', content: 'Namaste! I\'m your Himalayan shopping assistant. How can I help you today?' }
  ]);
  const [aiInput, setAiInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages]);

  const handleAISend = () => {
    if (!aiInput.trim()) return;
    const newMessages = [...aiMessages, { role: 'user', content: aiInput }];
    setAiMessages(newMessages);
    setAiInput('');
    setIsTyping(true);

    setTimeout(() => {
      const responses = [
        "Our premium apples are sourced directly from Kinnaur and Shimla orchards. Would you like me to show our collection?",
        "Yes! We have certified organic products across fruits, vegetables, and herbs. What interests you?",
        "Each district has unique specialties! Kinnaur is famous for black walnuts, Kangra for tea, Kullu for cherries.",
        "The best time for apples is September-November. We have fresh produce year-round with seasonal items.",
        "We offer free delivery on orders above Rs.999. Orders delivered within 2-3 days!"
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setAiMessages([...newMessages, { role: 'assistant', content: randomResponse }]);
      setIsTyping(false);
    }, 1500);
  };

  const quickQuestions = [
    "Show me apples",
    "Best sellers?",
    "Organic products",
    "Shipping info"
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 pt-16 lg:pt-20">
        <Outlet />
      </main>
      <Footer />
      
      {/* AI Chat Button - Fixed bottom right */}
      <motion.button
        onClick={() => setIsAIOpen(true)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center"
        style={{ backgroundColor: '#2d5a3d', boxShadow: '0 4px 15px rgba(45, 90, 61, 0.4)' }}
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </motion.button>

      {/* AI Chat Panel */}
      <AnimatePresence>
        {isAIOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] md:h-[550px] bg-[#ffffff] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-[#e5e5e5]"
            style={{ backgroundColor: '#ffffff', opacity: 1 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 bg-[#2d5a3d] text-white" style={{ backgroundColor: '#2d5a3d' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#ffffff30] rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-white">Himalaya Assistant</h3>
                  <p className="text-xs text-white" style={{ opacity: 0.7 }}>AI Shopping Helper</p>
                </div>
              </div>
              <button onClick={() => setIsAIOpen(false)} className="p-2 hover:bg-[#ffffff20] rounded-xl transition-colors" style={{ backgroundColor: 'transparent' }}>
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ backgroundColor: '#f8f8f8' }}>
              {aiMessages.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'assistant' ? '' : ''}`} style={{ backgroundColor: msg.role === 'assistant' ? '#2d5a3d' : '#888888' }}>
                    {msg.role === 'assistant' ? <Bot className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-white" />}
                  </div>
                  <div 
                    className="max-w-[80%] px-4 py-3 rounded-2xl" 
                    style={{ 
                      backgroundColor: msg.role === 'user' ? '#2d5a3d' : '#ffffff', 
                      color: msg.role === 'user' ? '#ffffff' : '#333333',
                      border: msg.role === 'user' ? 'none' : '1px solid #e5e5e5',
                      boxShadow: msg.role === 'user' ? 'none' : '0 1px 2px rgba(0,0,0,0.05)'
                    }}
                  >
                    <p className="text-sm leading-relaxed" style={{ color: msg.role === 'user' ? '#ffffff' : '#333333' }}>{msg.content}</p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-[#2d5a3d] rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white border border-[#e5e5e5] px-4 py-3 rounded-2xl" style={{ backgroundColor: '#ffffff', borderColor: '#e5e5e5' }}>
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-[#2d5a3d] rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-[#2d5a3d] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 bg-[#2d5a3d] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions */}
            {aiMessages.length <= 1 && (
              <div className="px-4 pb-2">
                <p className="text-xs text-[#666666] mb-2">Quick questions:</p>
                <div className="flex flex-wrap gap-2">
                  {quickQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => setAiInput(q)}
                      className="text-xs px-3 py-1.5 rounded-full transition-colors"
                      style={{ backgroundColor: '#eeeeee', color: '#333333' }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t" style={{ backgroundColor: '#ffffff', borderColor: '#e5e5e5' }}>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAISend()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 rounded-xl text-sm"
                  style={{ backgroundColor: '#f5f5f5', border: 'none', color: '#333333', outline: 'none' }}
                />
                <button 
                  onClick={handleAISend} 
                  disabled={!aiInput.trim()} 
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors"
                  style={{ backgroundColor: '#2d5a3d', color: '#ffffff', opacity: aiInput.trim() ? 1 : 0.5 }}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#2d5a3d',
            color: '#fff',
            borderRadius: '12px',
          },
        }}
      />
    </div>
  );
}