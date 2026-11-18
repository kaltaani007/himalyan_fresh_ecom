import { create } from 'zustand';

interface AuthModalState {
  isOpen: boolean;
  mode: 'signin' | 'signup';
  title?: string;
  subtitle?: string;
  redirectUrl?: string;
  onSuccess?: () => void;
  openAuthModal: (options?: {
    mode?: 'signin' | 'signup';
    title?: string;
    subtitle?: string;
    redirectUrl?: string;
    onSuccess?: () => void;
  }) => void;
  closeAuthModal: () => void;
}

export const useAuthModalStore = create<AuthModalState>((set) => ({
  isOpen: false,
  mode: 'signin',
  title: undefined,
  subtitle: undefined,
  redirectUrl: undefined,
  onSuccess: undefined,

  openAuthModal: (options = {}) =>
    set({
      isOpen: true,
      mode: options.mode || 'signin',
      title: options.title,
      subtitle: options.subtitle,
      redirectUrl: options.redirectUrl,
      onSuccess: options.onSuccess,
    }),

  closeAuthModal: () =>
    set({
      isOpen: false,
      title: undefined,
      subtitle: undefined,
      redirectUrl: undefined,
      onSuccess: undefined,
    }),
}));
