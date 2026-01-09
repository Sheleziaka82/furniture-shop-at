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
- [x] Create multi-step checkout form with progress indicator
- [x] Step 1: Contact information (name, email, phone)
- [x] Step 2: Delivery address with postal code autocomplete
- [x] Step 3: Shipping method selection (standard, express, pickup, assembly)
- [x] Step 4: Payment method selection (card, PayPal, Klarna, bank transfer, Apple/Google Pay)
- [x] Step 5: Order review and confirmation
- [ ] Implement order creation and confirmation page
- [ ] Add order confirmation email template

## Phase 5: User Account System
- [x] Create user profile page
- [x] Implement order history with tracking
- [x] Add saved addresses management
- [x] Create wishlist/favorites functionality
- [ ] Build loyalty program / bonus points system
- [ ] Add newsletter subscription management
- [x] Implement account settings and preferences

## Phase 6: Admin Panel
- [x] Create admin dashboard with key metrics
- [ ] Build product management (CRUD operations)
- [ ] Implement bulk product import/export (CSV, XML)
- [ ] Create order management with status tracking
- [ ] Add customer database and segmentation
- [ ] Build analytics dashboard with sales graphs
- [ ] Implement 2FA for admin security
- [x] Add role-based access control (admin, manager, content manager)
- [ ] Create admin activity logging

## Phase 7: Marketing & Trust Features
- [x] Implement customer reviews with photo uploads
- [x] Add review rating system and display
- [x] Create trust badges (certifications, guarantees)
- [ ] Add stock level indicators (urgency)
- [ ] Implement "people viewing this product" counter
- [x] Create "frequently bought together" recommendations
- [x] Add personalized product recommendations
- [x] Build abandoned cart recovery email system
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
- [x] Add privacy policy (Datenschutzerklärung)
- [x] Add terms of service (AGB)
- [x] Add return policy (Widerrufsrecht)
- [x] Add company information (Impressum)
- [x] Implement SSL/HTTPS enforcement
- [x] Add newsletter signup component
- [x] Create contact page with contact form
- [x] Add trust badges component

## Phase 10: Testing & Deployment
- [ ] Write unit tests for core features
- [ ] Test checkout flow end-to-end
- [ ] Test payment integration
- [ ] Cross-browser testing
- [ ] Mobile responsiveness testing
- [ ] Performance testing and optimization
- [ ] Create deployment checkpoint
- [ ] Deploy to production


## Phase 11: Product Comparison Feature
- [x] Create comparison context for managing selected products
- [x] Build product comparison page with side-by-side display
- [x] Add comparison buttons to product cards and detail pages
- [x] Implement comparison table with key attributes
- [x] Add ability to remove products from comparison
- [x] Create comparison URL sharing functionality


## Phase 12: User Management System
- [x] Create user management UI component
- [x] Add role-based access control (admin, manager, employee, moderator, user)
- [x] Implement user add/edit/delete functionality
- [x] Add department assignment for employees
- [x] Create user status management (active/inactive)
- [x] Build roles reference guide with permissions
- [ ] Connect to tRPC backend for persistence
- [ ] Add user activity logging
- [ ] Implement 2FA for admin users
- [ ] Create user invitation/registration system


## Phase 13: Stripe Payment Integration
- [x] Update database schema to store Stripe customer IDs and payment intent IDs
- [x] Create Stripe products configuration file
- [x] Implement tRPC procedure for creating Stripe checkout sessions
- [x] Create webhook endpoint at /api/stripe/webhook for payment confirmation
- [x] Integrate Stripe checkout into multi-step checkout flow
- [x] Add payment success page with order confirmation
- [ ] Add payment history page for user account
- [ ] Test payment flow with Stripe test cards
- [ ] Configure webhook in Stripe dashboard


## Phase 14: Email Notification System
- [x] Create email service helper using Manus Notification API
- [x] Design HTML email template for order confirmation (German)
- [x] Design HTML email template for order confirmation (English)
- [x] Integrate email sending into Stripe webhook on payment success
- [x] Add order details, items, and shipping info to email
- [x] Test email template generation with unit tests
- [ ] Test email delivery with real orders
- [ ] Add email notification for order status updates


## Phase 15: Shipping Notification System
- [x] Create HTML email template for shipping notification (German)
- [x] Create HTML email template for shipping notification (English)
- [x] Add tracking number and carrier information to email
- [x] Implement tRPC procedure for updating order status to 'shipped'
- [x] Integrate automatic email sending when order is marked as shipped
- [x] Add tracking URL generation for common carriers (DHL, DPD, Austrian Post, GLS)
- [x] Test shipping notification with unit tests
- [x] Add carrier and estimatedDelivery fields to orders table
- [ ] Add UI in admin dashboard for marking orders as shipped


## Phase 16: Admin Orders Management UI
- [x] Create admin orders list page with all orders
- [x] Add status filter (all, processing, shipped, delivered, cancelled)
- [x] Display order details (number, customer, total, date, status)
- [x] Create shipping form dialog with tracking number input
- [x] Add carrier dropdown (DHL, DPD, Austrian Post, GLS, Other)
- [x] Add estimated delivery date picker
- [x] Implement "Mark as Shipped" button with confirmation
- [x] Show success/error notifications after shipping
- [x] Add getAllOrders tRPC procedure for admin
- [x] Integrate AdminOrders component into AdminDashboard
- [ ] Add order details view with items list


## Bug Fixes
- [x] Fix product addition form - products not being added despite entering all data
- [x] Check ProductForm validation and submission logic
- [x] Verify backend tRPC procedure for adding products
- [x] Added createProduct function in db.ts
- [x] Added products.create tRPC procedure with admin check
- [x] Connected AdminDashboard to use tRPC mutation
- [ ] Test product addition flow end-to-end


## Critical Bug Fixes
- [x] Fix React hook error #310 in AdminDashboard - useMutation called outside component body
- [x] Move createProductMutation hook inside component function before conditional return
- [x] Test admin panel access after fix - all tests passed


## Phase 17: Catalog Structure with Demo Products
- [x] Analyze partner website planetmoebel.de structure
- [x] Identify main product categories and subcategories (3 main: Badezimmer, Garderobe & Flur, Wohnzimmer)
- [x] Search and download product images from web
- [x] Generate 13 demo products for each category
- [x] Add realistic product descriptions in German
- [x] Upload all product images to S3 storage
- [x] Set appropriate prices (€129-€599) and stock levels
- [x] Create catalog setup documentation
- [ ] Add products to database through admin panel
- [ ] Test catalog display on frontend
