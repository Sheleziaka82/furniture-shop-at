# Furniture Shop AT - Project TODO

## Phase 1: Core Layout & Theme System
- [x] Update global styles with color palette and typography
- [x] Implement theme context with light/dark mode switching
- [x] Create language context for i18n support (de-AT, en)
- [x] Build header component with logo, navigation, language switcher, theme toggle
- [x] Create footer component with legal links and company info
- [x] Implement responsive mobile-first navigation

## Phase 2: Product Catalog
- [x] Create database schema for products, categories, attributes
- [x] Implement tRPC procedures for product browsing
- [x] Implement product listing page with grid/list view toggle
- [x] Add filtering by price, color, material, style
- [x] Add sorting by popularity, price, newest, rating
- [ ] Implement pagination or infinite scroll
- [ ] Add search functionality with autocomplete
- [x] Create product cards with hover effects and quick view

## Phase 3: Product Details & Shopping Cart
- [x] Build product detail page with image gallery and zoom
- [ ] Implement 360-degree view functionality
- [x] Add color variant selector with visual indicators
- [x] Display stock status and urgency indicators
- [x] Create "Add to Cart" functionality
- [x] Build cart context for state management
- [ ] Implement slide-in cart panel
- [x] Create full cart page with quantity editing and removal
- [x] Add promo code/coupon functionality
- [x] Implement delivery cost calculator

## Phase 4: Checkout & Payment
- [ ] Create multi-step checkout form with progress indicator
- [ ] Step 1: Contact information (name, email, phone)
- [ ] Step 2: Delivery address with postal code autocomplete
- [ ] Step 3: Shipping method selection (standard, express, pickup, assembly)
- [ ] Step 4: Payment method selection (card, PayPal, Klarna, bank transfer, Apple/Google Pay)
- [ ] Step 5: Order review and confirmation
- [ ] Implement order creation and confirmation page
- [ ] Add order confirmation email template

## Phase 5: User Account System
- [ ] Create user profile page
- [ ] Implement order history with tracking
- [ ] Add saved addresses management
- [ ] Create wishlist/favorites functionality
- [ ] Build loyalty program / bonus points system
- [ ] Add newsletter subscription management
- [ ] Implement account settings and preferences

## Phase 6: Admin Panel
- [ ] Create admin dashboard with key metrics
- [ ] Build product management (CRUD operations)
- [ ] Implement bulk product import/export (CSV, XML)
- [ ] Create order management with status tracking
- [ ] Add customer database and segmentation
- [ ] Build analytics dashboard with sales graphs
- [ ] Implement 2FA for admin security
- [ ] Add role-based access control (admin, manager, content manager)
- [ ] Create admin activity logging

## Phase 7: Marketing & Trust Features
- [ ] Implement customer reviews with photo uploads
- [ ] Add review rating system and display
- [ ] Create trust badges (certifications, guarantees)
- [ ] Add stock level indicators (urgency)
- [ ] Implement "people viewing this product" counter
- [ ] Create "frequently bought together" recommendations
- [ ] Add personalized product recommendations
- [ ] Build abandoned cart recovery email system
- [ ] Implement referral program

## Phase 8: SEO & Performance
- [ ] Add meta tags and Open Graph support
- [ ] Implement Schema.org markup for products
- [ ] Create sitemap.xml and robots.txt
- [ ] Optimize images with lazy loading
- [ ] Implement image compression and WebP format
- [ ] Add performance monitoring
- [ ] Ensure < 3 second load time

## Phase 9: Legal & Compliance
- [ ] Create GDPR-compliant cookie banner
- [ ] Add privacy policy (Datenschutzerklärung)
- [ ] Add terms of service (AGB)
- [ ] Add return policy (Widerrufsrecht)
- [ ] Add company information (Impressum)
- [ ] Implement SSL/HTTPS enforcement

## Phase 10: Testing & Deployment
- [ ] Write unit tests for core features
- [ ] Test checkout flow end-to-end
- [ ] Test payment integration
- [ ] Cross-browser testing
- [ ] Mobile responsiveness testing
- [ ] Performance testing and optimization
- [ ] Create deployment checkpoint
- [ ] Deploy to production
