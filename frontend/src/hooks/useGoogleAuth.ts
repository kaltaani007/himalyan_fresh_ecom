import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/services/api';
import { useAuthStore } from '@/store';
import toast from 'react-hot-toast';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          prompt: (notification?: (notification: any) => void) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              type?: 'standard' | 'icon';
              theme?: 'outline' | 'filled_blue' | 'filled_black';
              size?: 'large' | 'medium' | 'small';
              text?: 'signin_with' | 'signup_with' | 'continue_with';
              shape?: 'rectangular' | 'pill' | 'circle' | 'square';
              logo_alignment?: 'left' | 'center';
              width?: number;
            }
          ) => void;
        };
      };
    };
  }
}

interface UseGoogleAuthOptions {
  onSuccess?: (user: any) => void;
  onError?: (error: any) => void;
  redirectPath?: string;
}

export function useGoogleAuth(options: UseGoogleAuthOptions = {}) {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
  const isRealClientConfigured =
    Boolean(googleClientId) &&
    !googleClientId.includes('your-google') &&
    !googleClientId.includes('placeholder');

  // Load Google Identity Services script
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (document.getElementById('google-gsi-script')) return;

    const script = document.createElement('script');
    script.id = 'google-gsi-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }, []);

  // Process Google Authentication Result
  const handleAuthPayload = useCallback(
    async (payload: {
      credential?: string;
      email?: string;
      name?: string;
      picture?: string;
    }) => {
      setIsGoogleLoading(true);
      try {
        const response = await authApi.googleLogin(payload);
        const data = response.data;

        if (data?.access) {
          localStorage.setItem('access_token', data.access);
        }
        if (data?.refresh) {
          localStorage.setItem('refresh_token', data.refresh);
        }

        const authenticatedUser = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name || data.user.email.split('@')[0],
          first_name: data.user.first_name,
          last_name: data.user.last_name,
          avatar: data.user.avatar || '',
          phone: data.user.phone || '',
        };

        login(authenticatedUser);

        const welcomeMsg = data.is_new_user
          ? `Welcome to Himalayan Fresh, ${authenticatedUser.name}! 🍎`
          : `Welcome back, ${authenticatedUser.name}! 🌿`;
        toast.success(welcomeMsg);

        if (options.onSuccess) {
          options.onSuccess(authenticatedUser);
        } else {
          navigate(options.redirectPath || '/profile');
        }
      } catch (err: any) {
        console.error('Google OAuth API error:', err);
        const errMsg =
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          'Google authentication failed. Please try again.';
        toast.error(errMsg);
        if (options.onError) options.onError(err);
      } finally {
        setIsGoogleLoading(false);
        setShowDemoModal(false);
      }
    },
    [login, navigate, options]
  );

  // Trigger Google Sign-In
  const signInWithGoogle = useCallback(() => {
    if (isRealClientConfigured && window.google?.accounts?.id) {
      try {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: (response) => {
            if (response?.credential) {
              handleAuthPayload({ credential: response.credential });
            }
          },
          cancel_on_tap_outside: true,
        });

        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            // Popup was blocked or skipped, open fallback dialog
            setShowDemoModal(true);
          }
        });
      } catch (e) {
        console.warn('Google GSI initialization notice:', e);
        setShowDemoModal(true);
      }
    } else {
      // Prompt modal for instant end-to-end authentication in local development
      setShowDemoModal(true);
    }
  }, [googleClientId, isRealClientConfigured, handleAuthPayload]);

  return {
    signInWithGoogle,
    isGoogleLoading,
    showDemoModal,
    setShowDemoModal,
    handleAuthPayload,
    isRealClientConfigured,
  };
}
