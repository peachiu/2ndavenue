# Second Avenue - Project Status Report
**Date:** 2026-06-29  
**Project:** secondavenue (v0.1.0)  
**Type:** Next.js 16 E-Commerce Marketplace  
**Author:** Dinis Silva (peachiu)

---

## 1. DIRECTORY TREE

```
2ndavenue/
├── public/
│   └── images/
│       └── products/
├── scripts/
│   └── download-images.mjs
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── (auth)/
│   │   │   ├── layout.tsx
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── [...nextauth]/
│   │   │   │   │   └── route.ts
│   │   │   │   └── register/
│   │   │   │       └── route.ts
│   │   │   └── listings/
│   │   │       └── route.ts
│   │   ├── create-listing/
│   │   │   └── page.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── feed/
│   │   │   └── page.tsx
│   │   ├── product/
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   └── profile/
│   │       └── page.tsx
│   ├── components/
│   │   ├── Footer.tsx
│   │   ├── MobileDock.tsx
│   │   ├── Navbar.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductFeed.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── Providers.tsx
│   │   ├── TopNavbar.tsx
│   │   └── UserNav.tsx
│   ├── context/
│   │   ├── CurrencyContext.tsx
│   │   └── TranslationContext.tsx
│   ├── legacy_php/
│   │   ├── backend/
│   │   │   ├── auth.php
│   │   │   └── db.php
│   │   └── website/
│   │       ├── index.html
│   │       ├── index.php
│   │       ├── login.php
│   │       ├── register.php
│   │       ├── dashboard.php
│   │       ├── create_listing.php
│   │       ├── product.php
│   │       ├── chat.php
│   │       ├── css/
│   │       │   └── style.css
│   │       ├── js/
│   │       │   └── script.js
│   │       └── media/
│   │           └── logo
│   └── lib/
│       └── db.ts
├── next-env.d.ts
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── postcss.config.mjs
├── package.json
├── package-lock.json
├── README.md
├── README-PT.md
├── LICENSE
├── database.sql
├── schema.sql
├── seed.sql
├── setup_db.php
├── update_db_schema.php
└── update_chat_schema.php
```

---

## 2. DEPENDENCIES (package.json)

```json
{
  "name": "secondavenue",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "bcryptjs": "^3.0.3",
    "clsx": "^2.1.1",
    "dotenv": "^16.4.7",
    "framer-motion": "^12.29.2",
    "lucide-react": "^0.563.0",
    "mysql2": "^3.12.0",
    "next": "16.1.6",
    "next-auth": "^4.24.13",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "tailwind-merge": "^3.4.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/bcryptjs": "^2.4.6",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.1.6",
    "tailwindcss": "^4",
    "typescript": "^5"
  },
  "allowScripts": {
    "sharp@0.34.5": true,
    "unrs-resolver@1.11.1": true
  }
}
```

### Tech Stack Summary:
- **Framework:** Next.js 16.1.6 (React 19.2.3)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4 + PostCSS 4
- **Database:** MySQL 2 (mysql2)
- **Authentication:** NextAuth v4.24.13 (Credentials + Google OAuth)
- **Encryption:** bcryptjs 3.0.3
- **Motion/Animation:** Framer Motion 12.29.2
- **Icons:** Lucide React 0.563.0
- **Utilities:** clsx, tailwind-merge
- **Linting:** ESLint 9

---

## 3. CORE CONFIGURATIONS

### A. tailwind.config.ts

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "off-white": "#F2F0EF",
        periwinkle: "#888DDD",
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'clay-card': '8px 8px 16px 0 rgba(0, 0, 0, 0.1), -8px -8px 16px 0 rgba(255, 255, 255, 0.8), inset 6px 6px 10px 0 rgba(0, 0, 0, 0.02), inset -6px -6px 10px 0 rgba(255, 255, 255, 0.6)',
        'clay-btn': '6px 6px 12px 0 rgba(136, 141, 221, 0.4), -6px -6px 12px 0 rgba(255, 255, 255, 0.8), inset 4px 4px 8px 0 rgba(0, 0, 0, 0.05), inset -4px -4px 8px 0 rgba(255, 255, 255, 0.2)',
      }
    },
  },
  plugins: [],
};
export default config;
```

### B. globals.css

```css
@import "tailwindcss";

@theme {
    --color-off-white: #F2F0EF;
    --color-periwinkle: #888DDD;

    --shadow-clay-card: 8px 8px 16px 0 rgba(0, 0, 0, 0.1), -8px -8px 16px 0 rgba(255, 255, 255, 0.8), inset 6px 6px 10px 0 rgba(0, 0, 0, 0.02), inset -6px -6px 10px 0 rgba(255, 255, 255, 0.6);
    --shadow-clay-btn: 6px 6px 12px 0 rgba(136, 141, 221, 0.4), -6px -6px 12px 0 rgba(255, 255, 255, 0.8), inset 4px 4px 8px 0 rgba(0, 0, 0, 0.05), inset -4px -4px 8px 0 rgba(255, 255, 255, 0.2);
}

/* Custom Utilities */
.clay-card {
    @apply bg-white/80 backdrop-blur-md rounded-3xl border border-white/40 shadow-clay-card;
}

.clay-btn {
    @apply bg-periwinkle text-white font-bold rounded-full shadow-clay-btn transition-transform hover:scale-105 active:scale-95;
}

body {
    @apply bg-off-white text-slate-800;
}
```

### Color Palette Analysis:
- **Primary Brand Color:** Periwinkle (#888DDD) - Used for CTA buttons, accents, logo
- **Background:** Off-white (#F2F0EF) - Warm, neutral page background
- **Accents:** Slate grays (various shades from slate-300 to slate-900)
- **Design Style:** Neumorphic/Clay morphism with soft shadows and rounded corners
- **Typography:** Outfit font (Google Fonts, weights: 400, 500, 700, 900) - lowercase aesthetic

---

## 4. KEY FILES - FULL SOURCE CODE

### A. src/app/layout.tsx (Root Layout)

```typescript
import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

import Footer from "@/components/Footer";
import TopNavbar from "@/components/TopNavbar";
import MobileDock from "@/components/MobileDock";
import { Providers } from "@/components/Providers";

const outfit = Outfit({
    subsets: ["latin"],
    variable: "--font-outfit",
    weight: ["400", "500", "700", "900"],
});

export const metadata: Metadata = {
    title: "secondavenue | curated chaos",
    description: "a marketplace for the aesthetically inclined.",
    icons: {
        icon: "/icon.png",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${outfit.variable} font-sans bg-off-white text-slate-800 antialiased selection:bg-periwinkle selection:text-white`}
            >
                <Providers>
                    <div className="flex flex-col min-h-screen">
                        <TopNavbar />
                        <main className="flex-grow pt-20">
                            {children}
                        </main>
                        <MobileDock />
                        <Footer />
                    </div>
                </Providers>
            </body>
        </html>
    );
}
```

### B. src/app/page.tsx (Homepage)

```typescript
"use client";

import ProductFeed from "@/components/ProductFeed";
import { useTranslation } from "@/context/TranslationContext";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen pb-20">
            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-4 md:px-8 mb-16 pt-16 text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="text-6xl md:text-8xl font-black tracking-tighter mb-6 lowercase"
                >
                    {t("hero.title").split(" ")[0]} <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 to-zinc-500 pr-2 pb-2">
                        {t("hero.title").split(" ")[1]}
                    </span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="text-lg md:text-2xl font-medium text-slate-500 max-w-2xl mx-auto leading-relaxed"
                >
                    {t("hero.subtitle")}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
                    className="mt-10 flex flex-col sm:flex-row justify-center gap-4 max-w-sm mx-auto sm:max-w-none items-stretch sm:items-center"
                >
                    <Link href="/create-listing" className="flex">
                        <motion.button
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className="clay-btn w-full sm:w-auto px-8 py-4 text-lg"
                        >
                            {t("hero.cta.sell")}
                        </motion.button>
                    </Link>
                    <Link href="#discover" className="flex">
                        <motion.button
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-full sm:w-auto px-8 py-4 rounded-full font-bold text-slate-600 bg-white shadow-sm hover:shadow-md transition-all border border-slate-100"
                        >
                            {t("hero.cta.explore")}
                        </motion.button>
                    </Link>
                </motion.div>
            </section>

            <ProductFeed />
        </div>
    );
}
```

---

## 5. COMPONENT MAP

### A. Core Layout Components

#### **TopNavbar.tsx**
- **Purpose:** Fixed header navigation bar with logo, category links, search, and user account controls
- **Exports:** Default component `TopNavbar()`
- **Props:** None
- **Key Features:** Desktop/mobile responsive, category filters (tech, apparel, home), search icon, user dropdown menu via `UserNav` component

#### **Navbar.tsx**
- **Purpose:** Alternative rounded pill-style floating navbar (appears to be deprecated/legacy, replaced by TopNavbar)
- **Exports:** Default component `Navbar()`
- **Props:** None
- **Key Features:** Floating positioned navbar with periwinkle rounded design, shopping bag indicator

#### **MobileDock.tsx**
- **Purpose:** Bottom navigation dock for mobile devices with 5 main action buttons
- **Exports:** Default component `MobileDock()`
- **Props:** None
- **Key Features:** Hidden on desktop (md:hidden), primary "sell" button elevated (-mt-8), uses Lucide icons (Home, Grid, Plus, MessageCircle, User), hides on product detail pages

#### **Footer.tsx**
- **Purpose:** Multi-section footer with brand info, marketplace/studio links, language/currency/unit selectors
- **Exports:** Default component `Footer()`
- **Props:** None
- **Key Features:** Multi-language support (7 languages), 4 currency types (EUR, USD, GBP, JPY), metric/imperial unit toggle, responsive grid layout

#### **UserNav.tsx**
- **Purpose:** User account dropdown menu with session status handling
- **Exports:** Default component `UserNav()`
- **Props:** None
- **Key Features:** NextAuth session integration, login button if not authenticated, dropdown with Dashboard/Profile/Logout options if authenticated, user avatar with fallback

#### **Providers.tsx**
- **Purpose:** Root context providers wrapper component
- **Exports:** Named export `Providers` component
- **Props:** `{ children: React.ReactNode }`
- **Key Features:** Wraps SessionProvider (NextAuth), TranslationProvider, and CurrencyProvider

---

### B. Product Display Components

#### **ProductCard.tsx**
- **Purpose:** Individual product card component with image, price, condition badge, hover effects
- **Exports:** Default component `ProductCard()`
- **Props:** `ProductCardProps` { title, price, currency, image_url, condition, className? }
- **Key Features:** Framer Motion hover/tap animations (scale: 1.02, rotate: 1), condition badges with translation support, lazy-loaded Next.js Image, price formatting via CurrencyContext, responsive image sizing

#### **ProductGrid.tsx**
- **Purpose:** Grid layout for products with algorithmic bento/masonry layout
- **Exports:** Default component `ProductGrid()`
- **Props:** `ProductGridProps` { products: Product[] }
- **Key Features:** Responsive 1-4 column grid (1 mobile, 2 tablet, 3 desktop, 4 large), algorithmic layout logic (every 7th item is 2x2, every 3rd is 1x2 tall), grid-auto-flow: dense

#### **ProductFeed.tsx**
- **Purpose:** Full product discovery section with category filtering and product fetch logic
- **Exports:** Default component `ProductFeed()`
- **Props:** None
- **Key Features:** Category filter buttons (8 categories: all, apparel, accessories, home, tech, vintage, vehicles, media), fetches from `/api/listings`, includes filter/sort buttons, animated section header

---

### C. Page-Specific Components

#### **N/A** - Pages primarily composed of existing components and use Framer Motion for animations

---

### D. Context Providers

#### **TranslationContext.tsx**
- **Purpose:** Multilingual support system with 7 languages
- **Exports:** `TranslationProvider` component, `useTranslation` hook
- **Hook Returns:** `{ language, setLanguage, t: (key) => string }`
- **Supported Languages:** English, Chinese, German, French, Italian, Spanish, Portuguese
- **Storage:** localStorage key: `user-language`

#### **CurrencyContext.tsx**
- **Purpose:** Multi-currency price formatting and conversion system
- **Exports:** `CurrencyProvider` component, `useCurrency` hook
- **Hook Returns:** `{ currency, setCurrency, formatPrice }`
- **Supported Currencies:** EUR (base), USD (1.08x), GBP (0.85x), JPY (162.50x)
- **Storage:** localStorage key: `user-currency`

---

### E. Database & API

#### **db.ts** (Database Connection)
- **Purpose:** MySQL2 connection pool initialization
- **Exports:** Default export `pool` (mysql2/promise pool)
- **Config Source:** Environment variables (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME)
- **Defaults:** localhost, root, empty password, 'secondavenue' database
- **Pool Settings:** 10 connection limit, queue disabled

#### **[...nextauth]/route.ts** (Authentication API)
- **Purpose:** NextAuth configuration with Credentials and Google OAuth strategies
- **Exports:** `authOptions` object (for use with NextAuth)
- **Providers:**
  - **Google OAuth:** Via environment variables (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET)
  - **Credentials:** Email/password with bcrypt verification
- **Database Queries:** SELECT user from MySQL, bcrypt password comparison
- **Callbacks:** JWT token enrichment, session enrichment with user ID and role, Google sign-in handler with auto-registration
- **User Fields Stored:** id, name, email, image, role

#### **register/route.ts** (Registration API)
- **Purpose:** User registration endpoint
- **Method:** POST
- **Input:** { name, email, password }
- **Logic:** Duplicate email check, bcrypt hash password (10 rounds), INSERT into users table
- **Responses:** 201 Created on success, 400 Bad Request (missing fields), 409 Conflict (email exists), 500 Internal Server Error

#### **listings/route.ts** (Products API)
- **Purpose:** Fetch all product listings
- **Method:** GET
- **Query:** `SELECT * FROM listings ORDER BY created_at DESC`
- **Response:** JSON array of listing objects
- **Error Handling:** 500 Internal Server Error with console logging

---

### F. Page Components

#### **src/app/page.tsx (Homepage)**
- **Route:** `/`
- **Render Type:** Client component
- **Features:** Hero section with animated title/subtitle, two CTA buttons (Sell, Explore), ProductFeed component below
- **Animations:** Framer Motion entrance animations (opacity, y-axis slide), staggered delays

#### **src/app/feed/page.tsx (Browse Feed)**
- **Route:** `/feed`
- **Render Type:** Client component
- **Features:** Full-screen product discovery with ProductFeed component, redundant header removed
- **Includes:** "Load More Items" button at bottom

#### **src/app/dashboard/page.tsx (Seller Dashboard)**
- **Route:** `/dashboard`
- **Render Type:** Server component (uses getServerSession)
- **Auth:** Protected route (redirects to /login if not authenticated)
- **Features:** User profile card, 3 stat cards (Revenue, Active Listings, Followers), active listings section (5 mock items), recent activity timeline
- **Data Source:** session.user for authenticated user info

#### **src/app/create-listing/page.tsx (Create Product Listing)**
- **Route:** `/create-listing`
- **Render Type:** Client component
- **Sections:** 
  1. "Vibe Check (Photos)" - 8 photo upload slots
  2. "The Specifics" - Title, price, category inputs
  3. Additional form fields (description, condition, etc.) [partially shown]
- **UI Elements:** Form inputs with periwinkle focus states, placeholder text, file upload area

#### **src/app/product/[id]/page.tsx (Product Detail)**
- **Route:** `/product/[id]`
- **Render Type:** Client component
- **Features:** Large image gallery with thumbnails, wishlist/share buttons, description section, seller info card, condition badge
- **Data:** Placeholder data (Vintage Denim Jacket, €85, mint condition)
- **Layout:** 2-column on desktop (images + description, 3-column grid: details/reviews/seller)

#### **src/app/profile/page.tsx (User Profile)**
- **Route:** `/profile`
- **Render Type:** Server component (queries database)
- **Auth:** Protected route (redirect if not authenticated)
- **Features:** Cover banner, large avatar, user info (name, role, joined date), edit button, personal details section (email, location, etc.)
- **Database Query:** Fetches from `users` table via email from session

#### **src/app/(auth)/layout.tsx (Auth Pages Layout)**
- **Route:** Wrapper for `/login` and `/register`
- **Render Type:** Client component
- **Layout:** 2-column grid on desktop (periwinkle left side with branding, form area on right)
- **Mobile:** Single column (auth form centered)
- **Desktop Left Panel:** Large "join aesthetic chaos" heading, brand tagline with decorative blobs

#### **src/app/(auth)/login/page.tsx (Login)**
- **Route:** `/login`
- **Form Fields:** Email, password, "keep me logged in" checkbox
- **Actions:** Credentials provider sign-in via NextAuth, Google OAuth button
- **Error Handling:** Error message display, loading state on button
- **Links:** Forgot password link (placeholder), register link

#### **src/app/(auth)/register/page.tsx (Registration)**
- **Route:** `/register`
- **Form Fields:** First name, last name, email, password
- **Actions:** POST to `/api/auth/register`, redirects to `/login` on success
- **Error Handling:** Error message display, loading state
- **Links:** Login link for existing users, Google OAuth button

---

## SUMMARY

**Project Status:** In Active Development (PAP - Professional Aptitude Proof project for 2025/2026)

**Stage:** Frontend MVP with backend integration
- ✅ Modern Next.js setup with TypeScript
- ✅ Authentication system (NextAuth with Credentials + Google)
- ✅ Product marketplace UI (grid, feed, detail pages)
- ✅ Multi-language support (7 languages)
- ✅ Multi-currency support (4 currencies)
- ✅ Responsive design (mobile dock, desktop nav)
- ✅ Neumorphic/Clay design system
- ✅ MySQL database connection established

**Key Technologies:**
- Next.js 16 + React 19 + TypeScript 5
- Tailwind CSS 4 (clay-morphism design)
- NextAuth v4 (Authentication)
- Framer Motion (Animations)
- MySQL 2 (Database)

**Aesthetic:** Lowercase typography, periwinkle + off-white color scheme, rounded clay-style UI, smooth animations

**Next Steps (Inferred from Code):** Database seeding, product image integration, shopping cart implementation, chat feature completion, wishlist functionality

---

*Report Generated: 2026-06-29*
