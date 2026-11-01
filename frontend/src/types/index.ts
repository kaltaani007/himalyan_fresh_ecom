// Product Types
export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  full_description?: string;
  price: number;
  original_price?: number;
  images: ProductImage[];
  category: Category;
  category_slug: string;
  district?: District;
  rating: number;
  review_count: number;
  in_stock: boolean;
  is_featured: boolean;
  is_bestseller: boolean;
  is_seasonal: boolean;
  is_new?: boolean;
  badges: string[];
  origin: string;
  weight: string;
  tags: string[];
  nutrition_info?: NutritionInfo;
  farm_info?: FarmInfo;
  created_at: string;
}

export interface ProductImage {
  id: number;
  image: string;
  alt_text: string;
  is_primary: boolean;
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fiber: number;
  vitamin_c: number;
}

export interface FarmInfo {
  farmer_name: string;
  farm_name: string;
  location: string;
  altitude: string;
  farming_method: string;
}

// Category Types
export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  product_count: number;
}

// District Types
export interface District {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  specialties: string[];
  altitude: string;
  population: string;
  famous_for: string[];
  climate: string;
  products_count: number;
  blogs_count: number;
}

// Blog Types
export interface Blog {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  image: string;
  category: BlogCategory;
  author: Author;
  published_at: string;
  read_time: number;
  is_featured: boolean;
  is_trending: boolean;
  views: number;
  likes: number;
  district?: District;
}

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
}

export interface Author {
  id: number;
  name: string;
  avatar: string;
  bio?: string;
  role?: string;
}

// Review Types
export interface Review {
  id: number;
  user: Author;
  product: number;
  rating: number;
  comment: string;
  helpful_count: number;
  created_at: string;
}

// Cart Types
export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  price: number;
}

export interface Cart {
  id: number;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
}

// Wishlist Types
export interface WishlistItem {
  id: number;
  product: Product;
  added_at: string;
}

// Order Types
export interface Order {
  id: number;
  order_number: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping_cost: number;
  total: number;
  shipping_address: Address;
  payment_method: string;
  payment_status: PaymentStatus;
  created_at: string;
  updated_at: string;
  estimated_delivery?: string;
}

export interface OrderItem {
  id: number;
  product: Product;
  quantity: number;
  price: number;
  total: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface Address {
  id: number;
  name: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  is_default: boolean;
}

// User Types
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar?: string;
  phone?: string;
  addresses: Address[];
  date_joined: string;
}

// Chat Types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

export interface ChatContext {
  currentPage?: string;
  selectedProduct?: Product;
  selectedDistrict?: District;
}

// Search Types
export interface SearchResult {
  type: 'product' | 'blog' | 'district' | 'category';
  id: number;
  title: string;
  subtitle?: string;
  image?: string;
  url: string;
}

// API Response Types
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, string[]>;
}