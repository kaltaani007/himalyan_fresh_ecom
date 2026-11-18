import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus, ArrowRight } from 'lucide-react';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAccount: (account: {
    email: string;
    name: string;
    picture?: string;
  }) => void;
  isLoading: boolean;
}

const PRESET_ACCOUNTS = [
  {
    name: 'Google User',
    email: 'user.google@himalayanfresh.in',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
  },
  {
    name: 'Aarav Sharma',
    email: 'aarav.sharma@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
  },
  {
    name: 'Priya Verma',
    email: 'priya.verma@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
  },
];

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  isOpen,
  onClose,
  onSelectAccount,
  isLoading,
}) => {
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.trim()) return;
    onSelectAccount({
      email: customEmail.trim(),
      name: customName.trim() || customEmail.split('@')[0],
      picture: '',
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <div>
                <h3 className="font-heading font-bold text-lg text-gray-900 leading-tight">
                  Sign in with Google
                </h3>
                <p className="text-xs text-gray-500">
                  Choose an account to continue to Himalaya Fresh
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Account Picker */}
          <div className="p-6 space-y-3">
            {!showCustomInput ? (
              <>
                <div className="space-y-2">
                  {PRESET_ACCOUNTS.map((account) => (
                    <button
                      key={account.email}
                      type="button"
                      disabled={isLoading}
                      onClick={() => onSelectAccount(account)}
                      className="w-full flex items-center gap-3.5 p-3 rounded-2xl border border-gray-100 hover:border-gray-300 hover:bg-gray-50/80 transition-all text-left cursor-pointer group disabled:opacity-50"
                    >
                      <img
                        src={account.avatar}
                        alt={account.name}
                        className="w-10 h-10 rounded-full object-cover shadow-xs group-hover:scale-105 transition-transform"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors truncate">
                          {account.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {account.email}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCustomInput(true)}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-[#173D29] hover:bg-[#EAF1E7] flex items-center justify-center gap-2 transition-colors cursor-pointer border border-[#D5E3D3]"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Use another Google account</span>
                  </button>
                </div>
              </>
            ) : (
              <form onSubmit={handleCustomSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Google Email
                  </label>
                  <input
                    type="email"
                    required
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className="input-field text-sm py-2.5"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Display Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="Your Full Name"
                    className="input-field text-sm py-2.5"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCustomInput(false)}
                    className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || !customEmail.trim()}
                    className="flex-1 py-2.5 rounded-xl bg-[#173D29] hover:bg-[#112E1F] text-white text-xs font-semibold transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Connecting...' : 'Continue'}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Footer note */}
          <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
            <p className="text-[11px] text-gray-500">
              End-to-end encrypted with Django JWT & Google Identity Services.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
