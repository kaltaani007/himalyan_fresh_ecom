# Himalayan Fresh (Himachal Apples) - Master Architecture & Codebase Reference (`gemini.md`)

> **Single Source of Truth**: This document serves as the complete technical specification, architectural blueprint, API directory, database schema, and frontend state reference for the Himalayan Fresh / EcomHub project. AI assistants and developers should consult this document instead of parsing across multiple repository files.

---

## 1. Project Overview & Architecture

- **Project Name**: Himalayan Fresh / Himachal Apples (EcomHub Platform)
- **Domain**: Premium direct-to-consumer (D2C) farm-to-table e-commerce platform specializing in fresh produce from Himachal Pradesh (Kinnaur, Shimla, Kullu, Kangra, etc.) such as Royal Apples, organic fruits, dry fruits, mountain vegetables, and herbal products.
- **Architectural Pattern**:
  - **Backend**: Modular Monolith using Django 5.x + Django REST Framework (DRF), organized into distinct domain apps. Supports local SQLite development as well as production PostgreSQL, Redis caching, Celery background workers, and Elasticsearch.
  - **Frontend**: Single Page Application (SPA) built with React 18, Vite, TypeScript, Tailwind CSS, Lucide icons, Framer Motion animations, Three.js / React Three Fiber for 3D elements, TanStack React Query for server cache, and Zustand for persistent local state.

---

## 2. Repository & File System Structure

```
himalyan_fresh_ecom/
├── .gitignore
├── app_doc.txt                       # Initial architecture notes & functional spec
├── SPEC.md                           # Core domain & data models specification
├── upgrade.txt                       # Recent UI/UX and feature enhancement directives
├── gemini.md                         # (This File) Master codebase reference
├── UI_UX_STYLE_GUIDE_AND_USER_FLOWS.md # Design system, feature audit, auth & user flows
├── docker/                           # Containerization files (Dockerfiles, docker-compose)
│
├── backend/                          # Django REST Framework Backend
│   ├── .env                          # Local environment variables
│   ├── .env.example                  # Environment configuration template
│   ├── .gitignore
│   ├── manage.py                     # Django CLI entrypoint
│   ├── pyproject.toml                # Project metadata & uv/pip dependencies
│   ├── requirements.txt              # Standard pip requirements
│   ├── db.sqlite3                    # Local development SQLite database
│   │
│   ├── core/                         # Project-level configuration
│   │   ├── __init__.py               # Celery app loading hook
│   │   ├── celery.py                 # Celery app definition & broker setup
│   │   ├── urls.py                   # Root URL router
│   │   ├── wsgi.py / asgi.py         # Deployment gateway interfaces
│   │   └── settings/
│   │       ├── __init__.py
│   │       ├── base.py               # Shared settings (apps, middlewares, JWT, DRF)
│   │       ├── development.py        # Dev settings (SQLite, LocMemCache, DEBUG=True)
│   │       └── production.py         # Prod settings (PostgreSQL, Redis, WhiteNoise, Sentry)
│   │
│   └── apps/                         # Modular domain apps
│       ├── accounts/                 # User model, profiles, addresses, JWT & OAuth
│       ├── admin_panel/              # Administrative analytics & custom dashboard APIs
│       ├── api/                      # Versioning (/api/v1/), middlewares, throttles, renderers
│       ├── cart/                     # Shopping cart, item reservations, price locking
│       ├── content/                  # Blogs, categories, tags, comments, newsletter
│       ├── inventory/                # Multi-warehouse stock tracking, stock reservations & movements
│       ├── notifications/            # Async email & SMS dispatching via Celery
│       ├── orders/                   # Orders, order items, immutable snapshots, refunds, shipments
│       ├── payments/                 # Stripe, Razorpay, Cash-On-Delivery, and webhooks
│       ├── products/                 # Products, categories, variants, images, reviews, wishlist
│       ├── promotions/               # Coupon engine, flash sales, product bundles, free shipping rules
│       └── search/                   # Elasticsearch integration, facets, autocomplete suggestions
│
└── frontend/                         # React 18 + Vite + TypeScript Frontend
    ├── index.html                    # Root HTML document
    ├── package.json                  # Frontend dependencies & npm scripts
    ├── tsconfig.json / tsconfig.node.json
    ├── tailwind.config.js            # Tailwind theme, typography & palette configuration
    ├── postcss.config.js
    ├── vite.config.ts                # Vite config (path aliases '@/' -> 'src/')
    │
    └── src/
        ├── main.tsx                  # React DOM entry point
        ├── App.tsx                   # Main router configuration & React Query provider
        ├── index.css                 # Global CSS rules, custom scrollbars, root CSS variables
        ├── vite-env.d.ts             # Vite client types
        │
        ├── components/               # Shared reusable components
        │   └── layout/
        │       ├── Layout.tsx        # Shell layout (Navbar, main Outlet, AI Assistant Chat, Footer)
        │       ├── Navbar.tsx        # Top navigation with categories, search, cart & auth badges
        │       └── Footer.tsx        # Footer with district links, newsletter, company info
        │
        ├── data/                     # Fallback & static datasets
        │   ├── index.ts              # Mock products, categories, districts, blogs, reviews
        │   └── pages/
        │       └── homepage.ts       # Hero slides, district teasers, promotional sections
        │
        ├── lib/                      # Core utility libraries
        │   └── utils.ts              # cn (clsx + twMerge), formatPrice, slugify, formatDate
        │
        ├── pages/                    # Route page components
        │   ├── about/AboutPage.tsx
        │   ├── auth/
        │   │   ├── LoginPage.tsx
        │   │   └── RegisterPage.tsx
        │   ├── blogs/
        │   │   ├── BlogDetailPage.tsx
        │   │   └── BlogListPage.tsx
        │   ├── cart/CartPage.tsx
        │   ├── checkout/CheckoutPage.tsx
        │   ├── contact/ContactPage.tsx
        │   ├── districts/DistrictPage.tsx
        │   ├── home/HomePage.tsx
        │   ├── products/
        │   │   ├── ProductDetailPage.tsx
        │   │   └── ProductListPage.tsx
        │   └── profile/
        │       ├── OrdersPage.tsx
        │       ├── ProfilePage.tsx
        │       └── WishlistPage.tsx
        │
        ├── services/
        │   └── api.ts                # Central Axios instance with JWT interceptor & API endpoints
        │
        ├── store/
        │   └── index.ts              # Zustand stores (useCartStore, useWishlistStore, useAuthStore, useAIChatStore)
        │
        ├── theme/
        │   └── index.ts              # Theme constants (colors, typography, spacing, shadows)
        │
        ├── types/
        │   └── index.ts              # TypeScript domain types (Product, Order, User, Cart, Blog, etc.)
        │
        └── utils/
            └── helpers.ts            # Formatting & calculation helper functions
```

---

## 3. Backend Architecture & Domain Apps

### 3.1 Core Architecture Principles
1. **Separation of Concerns**: Each business function lives in its own app under `apps/`.
2. **Snapshot Isolation for Orders**: When an order is placed, product details (title, unit price, images, SKU) are frozen into `OrderItem` so future price or catalog edits never mutate past orders.
3. **Inventory & Reservation System**:
   - Reserving items when added to cart or checkout to prevent overselling.
   - `select_for_update()` used in database transactions for concurrency safety.
   - Automatic expiry of reservations via Celery tasks (`CART_RESERVATION_TIMEOUT = 900` seconds / 15 minutes).
4. **Dual Database & Cache Support**:
   - `development.py`: SQLite + LocMemCache for zero-setup local coding.
   - `production.py`: PostgreSQL with connection pooling + Redis cache and Celery broker.
5. **DRF Configuration & Throttling**:
   - JWT Auth as primary; SessionAuth as secondary.
   - Global pagination: `PageNumberPagination` (20 items/page).
   - Dedicated throttle rates:
     * `anon`: 100/min | `user`: 1000/min | `login`: 5/min | `orders`: 10/min | `payments`: 20/min | `cart`: 30/min | `search`: 60/min.

---

### 3.2 Backend Apps Breakdown

#### `apps.accounts`
- **Models**:
  - `User`: Inherits `AbstractUser`. Custom fields: `phone`, `is_customer`, `is_verified`. Email is unique identifier.
  - `UserProfile`: `OneToOneField(User)`, `avatar`, `date_of_birth`, `gender`.
  - `Address`: `ForeignKey(User)`, `address_type` (`shipping`/`billing`), `address_line1`, `address_line2`, `city`, `state`, `postal_code`, `country`, `phone`, `is_default`.
  - `Notification`: In-app notification with `title`, `message`, `is_read`, `notification_type`.
- **Auth**: SimpleJWT (`TokenObtainPairView`, `TokenRefreshView`) + Google OAuth (`social_django`).

#### `apps.products`
- **Models**:
  - `Category`: `name`, `slug`, `description`, `image`, `parent` (self FK for nested subcategories), `is_active`, `order`.
  - `Product`: `name`, `slug`, `sku`, `description`, `category` (FK), `brand`, `base_price`, `discount_price`, `cost_price`, `is_featured`, `is_active`.
  - `ProductImage`: `product` (FK), `image`, `alt_text`, `is_primary`, `order`.
  - `ProductVariant`: `product` (FK), `sku`, `variant_type` (size/weight/pack), `variant_value`, `price`, `stock_quantity`, `is_active`.
  - `CategoryAttribute` & `ProductAttributeValue`: EAV system for dynamic product specs.
  - `Review`: `product` (FK), `user` (FK), `rating` (1-5), `comment`, `is_verified_purchase`, `helpful_count`.
  - `Wishlist`: `user` (FK), `product` (FK).
  - `Banner`: Hero/marketing banners with `title`, `image`, `link_url`, `position`, `is_active`.

#### `apps.cart`
- **Models**:
  - `Cart`: `user` (FK nullable for guest carts), `session_key`, `created_at`, `updated_at`.
  - `CartItem`: `cart` (FK), `product` (FK), `variant` (FK nullable), `quantity`, `price_at_add` (locks the price at insertion time).
  - `CartAbandonment`: Tracks carts abandoned after inactivity to trigger reminder emails.
- **Tasks**: `release_expired_reservations`, `check_abandoned_carts`.

#### `apps.orders`
- **Models**:
  - `Order`: `order_number` (unique), `user` (FK), `status` (`pending`, `confirmed`, `processing`, `packed`, `shipped`, `delivered`, `cancelled`), `subtotal`, `tax_amount`, `shipping_cost`, `discount_amount`, `total_amount`, `shipping_address` (FK), `billing_address` (FK), `payment_method`, `payment_status` (`pending`, `paid`, `failed`, `refunded`), `notes`.
  - `OrderItem`: `order` (FK), `product` (FK), `variant` (FK nullable), `product_name`, `variant_info`, `quantity`, `unit_price`, `total_price`.
  - `Shipment`: `order` (FK), `carrier`, `tracking_number`, `status`, `shipped_at`, `delivered_at`, `current_location`.
  - `RefundRequest`: `order` (FK), `user` (FK), `reason`, `amount`, `status` (`pending`, `approved`, `rejected`), `admin_notes`.

#### `apps.payments`
- **Gateways**:
  - **Stripe**: Payment Intents API, Webhook receiver (`apps/payments/views.py`).
  - **Razorpay**: Order creation (`orders.create`), Signature verification, Webhook handler.
  - **Cash on Delivery (COD)**: Native checkout flow without external gateway redirect.
- **Models**:
  - `Payment`: `order` (FK), `payment_method`, `amount`, `currency`, `transaction_id`, `status`, `metadata`.
  - `PaymentWebhookEvent`: Audit trail of all raw webhook payloads received.
  - `PaymentMethod`: Configured gateway credentials and flags.

#### `apps.inventory`
- **Models**:
  - `Warehouse`: Multiple storage depots across Himachal and fulfilment centers.
  - `Stock`: `product_variant` (FK), `warehouse` (FK), `quantity`, `reserved_quantity`, `low_stock_threshold`.
  - `StockReservation`: Temporary stock locks linked to active carts with expiry timestamps.
  - `StockMovement`: Ledger tracking incoming stock, sales deductions, reservations, and returns.
  - `StockAlert`: Low stock triggers logged for admin review.

#### `apps.promotions`
- **Models**:
  - `Promotion`: General marketing promotions with start/end windows.
  - `Coupon`: `code`, `discount_type` (`percentage`/`fixed`), `discount_value`, `min_order_amount`, `usage_limit`, `used_count`, `valid_from`, `valid_until`, `is_active`.
  - `FlashSale`: Limited quantity and time sales.
  - `Bundle`: Special packaged deals.
  - `FreeShippingRule`: Conditional free shipping rules (e.g. orders > Rs. 999).

#### `apps.content`
- **Models**:
  - `BlogCategory`: Categories for farming, nutrition, Himachal culture, and recipes.
  - `BlogTag`: Tagging system.
  - `BlogPost`: `title`, `slug`, `summary`, `content`, `image`, `category`, `author`, `read_time`, `is_featured`, `is_trending`, `views`, `likes`.
  - `BlogComment` & `BlogLike`: User engagement.
  - `Newsletter` & `NewsletterCampaign`: Email subscription subscribers and campaigns.

#### `apps.search`
- **Integration**: `django-elasticsearch-dsl` index for `Product`.
- **Capabilities**:
  - Full-text search with typo tolerance across name, description, tags, origin.
  - Faceted search (filter counts by category, price bands, district origin).
  - Fast autocomplete suggestions endpoint (`/api/v1/search/suggestions/`).

#### `apps.admin_panel`
- **Endpoints**:
  - Aggregated metrics: Revenue, orders today, pending shipments, low stock count.
  - Admin CRUD for orders, products, coupons, and customer management.

#### `apps.api`
- Versioning route: `/api/v1/`
- Custom middlewares:
  - `RequestLoggingMiddleware`: Logs method, path, response status, duration.
  - `SecurityHeadersMiddleware`: Adds security headers (CSP, HSTS, X-Content-Type).
  - `CORSCustomHeadersMiddleware`: Handles cross-origin frontend requests.
- Custom exception handling: Normalizes DRF errors into standard format `{ "error": ..., "details": ... }`.

---

## 4. Complete Backend REST API Reference

Base URL: `http://localhost:8000/api/v1/` (also aliased under `/api/`)

### 4.1 Authentication & Accounts (`/api/v1/auth/`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/auth/register/` | Register new user (email, password, first_name, last_name) | No |
| `POST` | `/auth/login/` | Obtain JWT access + refresh tokens | No |
| `POST` | `/auth/token/refresh/` | Refresh expired access token | No (Refresh Token) |
| `POST` | `/auth/logout/` | Blacklist refresh token & logout | Yes |
| `POST` | `/auth/forgot-password/`| Trigger password reset email | No |
| `GET` | `/auth/me/` | Fetch current authenticated user profile & addresses | Yes |
| `PATCH`| `/auth/me/` | Update profile information | Yes |
| `GET` | `/auth/profile/addresses/` | List saved user shipping/billing addresses | Yes |
| `POST` | `/auth/profile/addresses/` | Create new address | Yes |
| `GET/PUT/DELETE` | `/auth/profile/addresses/<id>/` | View, update, or delete address | Yes |
| `GET` | `/auth/notifications/` | List user in-app notifications | Yes |
| `POST` | `/auth/notifications/<id>/read/` | Mark notification as read | Yes |
| `GET/POST` | `/auth/google/` | Social OAuth2 callback & verification | No |

### 4.2 Products & Catalog (`/api/v1/products/`)
| Method | Endpoint | Description | Query Parameters |
|---|---|---|---|
| `GET` | `/products/products/` | List all products (paginated) | `?category=`, `?search=`, `?sort=`, `?page=` |
| `GET` | `/products/products/<slug>/` | Get product details by slug | None |
| `GET` | `/products/products/featured/`| List featured products | None |
| `GET` | `/products/products/categories/`| List all product categories | None |
| `GET` | `/products/banners/` | List active marketing banners | None |
| `GET` | `/products/wishlist/` | Get user's saved wishlist | Auth Required |
| `POST` | `/products/wishlist/` | Add item to wishlist (`product_id`) | Auth Required |
| `DELETE` | `/products/wishlist/remove/<product_id>/` | Remove item from wishlist | Auth Required |
| `POST` | `/products/coupons/validate/`| Validate coupon code for checkout | None |
| `POST` | `/products/reviews/` | Create a verified product review | Auth Required |

### 4.3 Shopping Cart (`/api/v1/cart/`)
| Method | Endpoint | Description | Payload |
|---|---|---|---|
| `GET` | `/cart/` | Get active cart & computed totals | None (Auth or Session) |
| `POST` | `/cart/add/` | Add product to cart with price lock | `{ "product_id": int, "quantity": int, "variant_id": int? }` |
| `PATCH`| `/cart/update/<item_id>/` | Update item quantity | `{ "quantity": int }` |
| `DELETE`| `/cart/remove/<item_id>/` | Remove item from cart | None |
| `POST` | `/cart/apply-coupon/` | Apply discount coupon to cart | `{ "code": string }` |
| `POST` | `/cart/remove-coupon/` | Remove applied discount coupon | None |
| `POST` | `/cart/checkout/` | Initiate checkout & lock inventory | `{ "shipping_address_id": int }` |

### 4.4 Orders & Checkout (`/api/v1/orders/`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/orders/checkout/` | Create and place order from cart | Yes |
| `GET` | `/orders/` | List user order history | Yes |
| `GET` | `/orders/<order_number>/` | Detailed order summary with items | Yes |
| `POST` | `/orders/<order_number>/cancel/` | Cancel pending order & release stock | Yes |
| `POST` | `/orders/<order_number>/refund/` | Submit refund request with reason | Yes |
| `GET` | `/orders/<order_number>/shipments/`| Real-time shipment status & tracking | Yes |

### 4.5 Payments (`/api/v1/payments/`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/payments/stripe/create/` | Create Stripe PaymentIntent for order |
| `POST` | `/payments/razorpay/create/` | Create Razorpay Order instance |
| `POST` | `/payments/cod/create/` | Confirm Cash on Delivery order |
| `POST` | `/payments/confirm/<order_number>/`| Confirm gateway payment completion |
| `GET` | `/payments/history/` | List user payment transactions |
| `GET` | `/payments/methods/` | List enabled payment gateways |
| `POST` | `/payments/webhooks/stripe/` | Stripe webhook event processor |
| `POST` | `/payments/webhooks/razorpay/` | Razorpay webhook event processor |

### 4.6 Search & Autocomplete (`/api/v1/search/`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/search/products/` | Elasticsearch query (`?q=`, `?category=`, `?price_min=`, `?price_max=`) |
| `GET` | `/search/suggestions/` | Autocomplete prefix suggestions (`?q=`) |
| `GET` | `/search/facets/` | Aggregation bucket counts for filters |
| `POST` | `/search/reindex/` | Admin trigger to rebuild ES product index |

### 4.7 Admin Dashboard (`/api/v1/admin/`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/admin/dashboard/` | High-level metrics: revenue, order count, active users |
| `GET` | `/admin/orders/` | List all system orders with filters |
| `PATCH`| `/admin/orders/<order_number>/` | Update status (`processing`, `shipped`, `delivered`) |
| `GET` | `/admin/products/` | List all inventory items |
| `POST` | `/admin/products/create/` | Add new product to catalog |
| `GET` | `/admin/users/` | List customer accounts |
| `GET` | `/admin/coupons/` | List discount coupon promotions |
| `POST` | `/admin/coupons/create/` | Create new promotion coupon |

---

## 5. Frontend Architecture & State Management

### 5.1 Tech Stack & Tools
- **Framework**: React 18 with TypeScript
- **Bundler**: Vite 5
- **Styling**: Tailwind CSS + PostCSS + CSS Variables
- **Icons**: `lucide-react`
- **3D Graphics**: `three`, `@react-three/fiber`, `@react-three/drei` (used for 3D Himachal apple orchard and mountain scenery)
- **Animations**: `framer-motion`
- **Server Cache**: `@tanstack/react-query`
- **Client State**: `zustand` (with `persist` middleware in `localStorage`)
- **Notifications**: `react-hot-toast`
- **HTTP Client**: `axios` with automatic token refresh

---

### 5.2 Application Routing Map (`src/App.tsx`)

| Path | Component | Description |
|---|---|---|
| `/` | `HomePage` | Hero showcase, 3D elements, category grid, seasonal picks, district guide, customer reviews |
| `/products` | `ProductListPage` | Product catalog with category, price, and sorting filters (Grid & List views) |
| `/products/:slug` | `ProductDetailPage` | Detailed specs, nutrition, origin farm info, image gallery, reviews, add-to-cart |
| `/districts` | `DistrictPage` | All Himachal producing districts (Kinnaur, Shimla, Kullu, Kangra, Lahaul & Spiti) |
| `/districts/:slug` | `DistrictPage` | Specific district profile, terroir, altitude, and native produce |
| `/blogs` | `BlogListPage` | Articles on organic farming, recipes, harvest cycles, orchard stories |
| `/blogs/:slug` | `BlogDetailPage` | Full blog post, author bio, related blogs |
| `/cart` | `CartPage` | Line items, quantities, coupon code input, pricing breakdown, checkout trigger |
| `/checkout` | `CheckoutPage` | Address selector, shipping method, payment selection (Stripe, Razorpay, COD) |
| `/login` | `LoginPage` | User authentication via email/password or Google OAuth |
| `/register` | `RegisterPage` | Customer registration |
| `/profile` | `ProfilePage` | User profile details, address book management |
| `/orders` | `OrdersPage` | Order tracking history, line items, status pills, invoice downloads |
| `/wishlist` | `WishlistPage` | Saved items list with one-click move to cart |
| `/about` | `AboutPage` | Story of Himachal farming, mission, sustainable practices |
| `/contact` | `ContactPage` | Contact form, phone, WhatsApp support, orchard address |

---

### 5.3 Zustand Client Stores (`src/store/index.ts`)

All stores are persisted to `localStorage` under dedicated keys:

1. **`useCartStore`** (`key: 'himalaya-cart'`):
   - State: `items: CartItem[]`
   - Actions:
     * `addItem(product, quantity?)`: Appends or increments quantity.
     * `removeItem(productId)`: Filters out product.
     * `updateQuantity(productId, quantity)`: Updates count or removes if `<= 0`.
     * `clearCart()`: Empties array.
     * `getTotal()`: Computes total monetary value.
     * `getItemCount()`: Computes total items in cart.

2. **`useWishlistStore`** (`key: 'himalaya-wishlist'`):
   - State: `items: Product[]`
   - Actions: `addItem(product)`, `removeItem(productId)`, `isInWishlist(productId)`, `clearWishlist()`.

3. **`useAuthStore`** (`key: 'himalaya-auth'`):
   - State: `user: { id, email, name, avatar } | null`, `isAuthenticated: boolean`
   - Actions: `login(user)`, `logout()`.

4. **`useAIChatStore`** (`key: 'himalaya-ai-chat'`):
   - State: `isOpen: boolean`, `messages: { role, content, timestamp }[]`
   - Actions: `openChat()`, `closeChat()`, `addMessage(role, content)`, `clearMessages()`.

---

### 5.4 API Client & Data Layer (`src/services/api.ts`)

- **Axios Configuration**:
  - `baseURL`: `import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'`
  - **Request Interceptor**: Reads `'access_token'` from `localStorage` and injects `Authorization: Bearer <token>`.
  - **Response Interceptor**: Catches `401 Unauthorized`. Performs automatic refresh token handshake with `/auth/refresh/`. If refresh succeeds, retries original request with new token. If refresh fails, purges tokens and redirects to `/login`.
- **API Modules**:
  - `productsApi`: `getAll`, `getFeatured`, `getBySlug`, `getById`, `getRelated`
  - `categoriesApi`: `getAll`, `getBySlug`, `getProducts`
  - `districtsApi`: `getAll`, `getBySlug`, `getProducts`, `getBlogs`
  - `blogsApi`: `getAll`, `getFeatured`, `getBySlug`, `getByCategory`, `getRelated`
  - `cartApi`: `get`, `add`, `update`, `remove`, `clear`
  - `wishlistApi`: `get`, `add`, `remove`, `check`
  - `authApi`: `login`, `register`, `logout`, `me`, `updateProfile`, `changePassword`
  - `ordersApi`: `getAll`, `getById`, `getByNumber`, `create`, `cancel`
  - `reviewsApi`: `getByProduct`, `create`, `update`, `delete`
  - `searchApi`: `search`, `suggestions`
  - `aiApi`: `chat`, `getRecommendations`, `getDistrictGuide`

---

### 5.5 Design System & Theme Configuration (`src/theme/index.ts`)

- **Color Palette**:
  - **Primary (Forest Green)**: `#2d5a3d` (main), `#3d7a52` (light), `#1a3d28` (dark)
  - **Secondary (Earth Brown)**: `#8b5a2b` (main), `#a67c52` (light), `#cd7d54` (terracotta)
  - **Accent (Golden Amber)**: `#d4a84b` (main), `#e8c97a` (light), `#e89c14` (saffron)
  - **Backgrounds**: `#ffffff` (primary), `#fdfcfa` (warm cream), `#f8f6f2` (soft parchment)
  - **Text**: `#1a1a1a` (charcoal black), `#4a4a4a` (dark slate), `#6b7280` (muted gray)
- **Typography**:
  - Headings: `Playfair Display`, Georgia, serif
  - Body: `Inter`, system-ui, sans-serif

---

## 6. Environment Variables Reference

### Backend (`backend/.env`)
```bash
# Django Core
DEBUG=True
SECRET_KEY=django-insecure-your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1

# Database (PostgreSQL - Used when production settings loaded)
POSTGRES_DB=ecomhub
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_SSL_MODE=disable

# JWT Settings
JWT_SECRET_KEY=your-jwt-secret-key-here
JWT_ACCESS_TOKEN_LIFETIME=60          # In minutes
JWT_REFRESH_TOKEN_LIFETIME=1440       # In minutes (24 hours)

# OAuth & Payment Gateways
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
RAZORPAY_WEBHOOK_SECRET=your-razorpay-webhook-secret

# Redis & Celery
REDIS_URL=redis://localhost:6379/0
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0
CART_RESERVATION_TIMEOUT=900          # 15 minutes stock reservation window
ORDER_NUMBER_PREFIX=ORD

# Search & Messaging
ELASTICSEARCH_URL=http://localhost:9200
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=noreply@himalayanfresh.com
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# Cloud Storage (Optional S3/MinIO)
USE_S3=False
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_STORAGE_BUCKET_NAME=
AWS_S3_REGION_NAME=us-east-1
```

### Frontend (`frontend/.env`)
```bash
VITE_API_URL=http://localhost:8000/api/v1
```

---

## 7. Developer Workflows & Commands

### 7.1 Backend Setup & Execution

```powershell
# Navigate to backend directory
cd backend

# Option A: With active virtual environment (.venv)
.venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
# Or using uv:
# uv sync

# Apply database migrations
python manage.py migrate

# Create superuser (Admin)
python manage.py createsuperuser

# Run local development server (defaults to port 8000)
python manage.py runserver

# Run Celery worker (in separate terminal)
celery -A core worker --loglevel=info

# Run Celery Beat scheduler (for reservations & reminders)
celery -A core beat --loglevel=info
```

### 7.2 Frontend Setup & Execution

```powershell
# Navigate to frontend directory
cd frontend

# Install npm packages
npm install

# Start Vite development server (defaults to port 5173)
npm run dev

# Run TypeScript check & build for production
npm run build

# Preview production build locally
npm run preview
```

---

## 8. Integration & Roadmap Guidelines for AI / Developers

When making modifications or adding new features:
1. **Catalog & API Connection**: The frontend currently contains rich mock datasets in `src/data/index.ts` to allow instant UI/UX prototyping. When integrating live backend features, connect components through `src/services/api.ts` using TanStack React Query (`useQuery`, `useMutation`), falling back gracefully to `src/data/index.ts` when the backend is offline.
2. **Stock & Order Handling**: Never bypass the reservation logic when adding items to cart or checkout. All order placements must invoke `/api/v1/orders/checkout/` to guarantee atomic stock reduction.
3. **Cart & Wishlist Synchronization**: When user logs in, sync local Zustand items (`useCartStore`, `useWishlistStore`) with the backend user account via `/api/v1/cart/add/` and `/api/v1/products/wishlist/`.
4. **Style Consistency**: Strictly use the colors and typography defined in `src/theme/index.ts` and `tailwind.config.js` (e.g. `bg-cream-50`, `text-charcoal-900`, `font-heading`, `text-primary-main`).
5. **AI Shopping Assistant**: The interactive modal in `Layout.tsx` and `useAIChatStore` is connected to `aiApi.chat()`. For advanced prompts, provide contextual district and product metadata in the request body.
