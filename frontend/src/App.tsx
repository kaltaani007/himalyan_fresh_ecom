import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import HomePage from '@/pages/home/HomePage';
import ProductListPage from '@/pages/products/ProductListPage';
import ProductDetailPage from '@/pages/products/ProductDetailPage';
import BlogListPage from '@/pages/blogs/BlogListPage';
import BlogDetailPage from '@/pages/blogs/BlogDetailPage';
import DistrictPage from '@/pages/districts/DistrictPage';
import CartPage from '@/pages/cart/CartPage';
import WishlistPage from '@/pages/profile/WishlistPage';
import CheckoutPage from '@/pages/checkout/CheckoutPage';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ProfilePage from '@/pages/profile/ProfilePage';
import OrdersPage from '@/pages/profile/OrdersPage';
import AboutPage from '@/pages/about/AboutPage';
import ContactPage from '@/pages/contact/ContactPage';
import MediaManagerPage from '@/pages/admin/MediaManagerPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="products" element={<ProductListPage />} />
            <Route path="products/:slug" element={<ProductDetailPage />} />
            <Route path="blogs" element={<BlogListPage />} />
            <Route path="blogs/:slug" element={<BlogDetailPage />} />
            <Route path="districts" element={<DistrictPage />} />
            <Route path="districts/:slug" element={<DistrictPage />} />
            <Route
              path="cart"
              element={
                <ProtectedRoute title="Sign In for Your Basket" subtitle="Please sign in to view and manage items in your orchard cart.">
                  <CartPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="wishlist"
              element={
                <ProtectedRoute title="Sign In for Saved Items" subtitle="Sign in to view your favorite organic harvest and apple varieties.">
                  <WishlistPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="checkout"
              element={
                <ProtectedRoute title="Sign In for Checkout" subtitle="Sign in to proceed with secure cold-chain checkout and delivery.">
                  <CheckoutPage />
                </ProtectedRoute>
              }
            />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
            <Route
              path="profile"
              element={
                <ProtectedRoute title="Sign In for Account Profile" subtitle="Sign in to manage your orchard addresses and personal information.">
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="orders"
              element={
                <ProtectedRoute title="Sign In for Order Tracking" subtitle="Sign in to view your order history and live cold-chain shipments.">
                  <OrdersPage />
                </ProtectedRoute>
              }
            />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route
              path="media-manager"
              element={
                <ProtectedRoute title="Sign In for Media Studio" subtitle="Admin and staff authentication required to manage orchard media.">
                  <MediaManagerPage />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}