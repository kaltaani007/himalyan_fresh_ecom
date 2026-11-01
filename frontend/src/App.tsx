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
import ProfilePage from '@/pages/profile/ProfilePage';
import OrdersPage from '@/pages/profile/OrdersPage';
import AboutPage from '@/pages/about/AboutPage';
import ContactPage from '@/pages/contact/ContactPage';

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
            <Route path="cart" element={<CartPage />} />
            <Route path="wishlist" element={<WishlistPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}