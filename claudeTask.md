# claudeTask.md — Food_front Audit & Improvement Log

## Status Legend
- [ ] TODO | [~] IN PROGRESS | [x] DONE | [!] BLOCKED

## Phase 0: File Audit Table

| File | Issues Found | Affects | Priority |
|------|-------------|---------|----------|
| `app/layout.tsx` | `<html>` missing `lang="ar"` and `dir="rtl"` | Accessibility, SEO, RTL layout | CRITICAL |
| `app/globals.css` | `--bg-primary: #FAFAFA` ≠ brand spec `#FFF8F0`; `accent #2DC653` missing from CSS vars | Brand consistency | HIGH |
| `app/login/page.tsx` | Uses `var(--text-primary)`, `var(--text-secondary)`, `gradient-primary` — none defined in globals.css | Broken styles | HIGH |
| `app/AnimatedLayout.tsx` | `BottomNav` always rendered with `role="customer"` even on vendor routes; `/signup` and `/cart` missing from `hideNavRoutes` | Wrong nav shown to vendors | HIGH |
| `app/context/CartContext.tsx` | `incrementCount`, `decrementCount`, `setCount` are empty no-ops; cart count always 0 | Cart badge, cart logic | HIGH |
| `app/explore/page.tsx` | Module-level `restaurantsCache` (memory leak risk); `axios` imported directly alongside `api`; `RestaurantCard` duplicated inline | Performance, maintainability | HIGH |
| `app/explore/componentForExplore/Header.tsx` | Inline `<style>` block; API call without AbortController; `useEffect` without cleanup; hardcoded `#E5A04D` | Maintainability, memory leak | MEDIUM |
| `app/explore/componentForExplore/RestaurantCard.tsx` | Inline `<style>` duplicating `.hide-scrollbar` from globals.css; hardcoded colors | Maintainability | MEDIUM |
| `app/explore/componentForExplore/SearchBar.tsx` | Props `onFiltersToggle` and `showFiltersIndicator` declared but never used | Dead code | LOW |
| `app/explore/componentForExplore/BottomNavigation.tsx` | `cartCount` from CartContext always 0 (no-op) | Cart badge display | HIGH |
| `app/cart/page.tsx` | Imports from `../../axios` (root) instead of `@/lib/api`; `calculateDistance()` duplicated (exists in `lib/utils.ts`); `confirm()` for clear cart | Maintainability, UX | MEDIUM |
| `app/cart/components/PaymentProofUpload.tsx` | `alert()` for validation; `URL.createObjectURL` without cleanup (memory leak) | UX, memory leak | MEDIUM |
| `app/profile/page.tsx` | Inline `<style>` redefining `--bottom-nav-height`; empty catch blocks | Maintainability, silent errors | MEDIUM |
| `app/profile/components/ProfileHeader.tsx` | `ArrowLeft` icon — wrong direction for RTL (should be `ArrowRight`) | RTL UX | MEDIUM |
| `app/profile/components/EmptyState.tsx` | Duplicates `components/ui/EmptyState.tsx`; uses inline styles | Code duplication | LOW |
| `app/profile/components/ChatModal.tsx` | `onKeyPress` deprecated; no AbortController cleanup on fetch calls | Deprecation, memory leak | MEDIUM |
| `app/restaurant/[restaurant_name]/page.tsx` | `Fragment` and `Star` imported but unused; optimistic update fallback restores same value (incorrect) | Dead imports, logic bug | MEDIUM |
| `app/vendor/dashboard/page.tsx` | `<style jsx global>` (styled-jsx — not standard in App Router) | Non-standard pattern | MEDIUM |
| `app/vendor/dashboard/components/DashboardHeader.tsx` | `res` variable unused in `handleToggleStatus`; empty catch block | Dead code, silent errors | LOW |
| `app/vendor/dashboard/components/RecentOrdersTable.tsx` | `getTimeAgo()` duplicated (also in OrderCard); `console.error` in catch; N+1 API calls (payment status fetched per order in loop) | Performance, duplication | HIGH |
| `app/vendor/dashboard/components/Sidebar.tsx` | Links to `/restaurant/dashboard` and `/restaurant/menu` — routes are `/vendor/dashboard` and `/vendor/dishes` | Broken navigation | CRITICAL |
| `app/vendor/dashboard/components/QuickActionsPanel.tsx` | Link to `/restaurant/menu` — route is `/vendor/dishes` | Broken navigation | CRITICAL |
| `app/vendor/dishes/page.tsx` | Inline `<style>` that globally overrides Tailwind's `animate-pulse` (dangerous); `viewMode` state declared but never used in render | Global style conflict, dead code | HIGH |
| `app/vendor/dishes/components/AddDishModal.tsx` | No issues found — well structured | — | — |
| `app/vendor/orders/page.tsx` | `@import` Google Font Cairo inside component (must be in globals.css); inline `<style>`; `confirm()` for cancellation | Performance (FOUC), UX | HIGH |
| `app/vendor/orders/components/VendorChatModal.tsx` | Pusher API key hardcoded in source (`39ade55f3979c3c6e71b`); `console.error` calls | Security, maintainability | CRITICAL |
| `app/vendor/orders/components/OrderCard.tsx` | `getTimeAgo()` duplicated; status dropdown logic triplicated (mobile/tablet/desktop) | Code duplication | MEDIUM |
| `app/vendor/orders/components/OrderDetailsModal.tsx` | No critical issues noted | — | — |
| `app/vendor/EditAtVendorInfo/page.tsx` | Inline `<style>` with `fade-in`/`slide-up` animations (defined in multiple files) | Duplication | LOW |
| `app/vendor/EditAtVendorInfo/components/AccountSecurityTab.tsx` | Inline `<style>` with `animate-fade-in` | Duplication | LOW |
| `app/signup/customer/page.tsx` | `sendOtp()` returns `undefined` (not `false`) on error path — breaks flow guard | Logic bug | MEDIUM |
| `app/signup/vendor/page.tsx` | Empty catch in `signUpForVendor()` (silent failure); `alert()` for geolocation errors; `ChevronsRight` imported but unused; `any` type used | UX, dead code, type safety | MEDIUM |
| `lib/api.ts` | `console.log` in `isAuthenticated()` (line 144) | Debug noise in production | LOW |
| `axios.js` (root) | `.js` file re-exporting from `lib/api` — should be `.ts` or removed | Maintainability | LOW |
| `tailwind.config.ts` | Defines brand colors but Tailwind v4 uses `@theme` CSS — potential duplication/conflict | Config conflict | MEDIUM |
| `next.config.ts` | Missing `blob:` in image domains for PaymentProofUpload previews | Feature bug | MEDIUM |
| `lib/constants.ts` | Nav hrefs inconsistent with actual routes (e.g. vendor nav) | Broken navigation | HIGH |

---

## Phase 1: Additions Queue

- [x] 1.1 tailwind.config.ts — badge/modal radius, primary-glow shadow
- [x] 1.1 app/globals.css — all CSS vars, html dir=rtl, body font/bg, skeleton-shimmer, gradient-primary, --text-primary/secondary
- [x] 1.2 components/ui/Button.tsx — rounded, leftIcon, rightIcon props; correct size heights
- [x] 1.2 components/ui/Input.tsx — variant, showValidCheck, isValid, leftIcon/rightIcon, RTL-correct valid check
- [x] 1.2 components/ui/Card.tsx — created (default/elevated/floating/flat, padding, rounded)
- [x] 1.2 components/ui/Badge.tsx — all required variants + pulse prop
- [x] 1.2 components/ui/Skeleton.tsx — SkeletonRestaurantGrid(count), skeleton-shimmer class
- [x] 1.2 components/ui/EmptyState.tsx — subtitle, secondaryAction, emoji circle, icon alias
- [x] 1.2 components/ui/Toast.tsx — created (RTL Sonner wrapper)
- [x] 1.3 lib/axios.ts — created (re-exports lib/api with full types)
- [x] 1.3 axios.js (root) — deleted
- [x] 1.3 app/cart/page.tsx — import updated from ../../axios to @/lib/api
- [x] 1.4 app/layout.tsx — lang="ar" dir="rtl", preconnect, viewport, theme-color, Toast
- [x] 1.4 app/AnimatedLayout.tsx — vendor route detection, correct BottomNav role, missing hideNavRoutes
- [x] 1.5 components/layout/BottomNav.tsx — already correct; verified
- [x] 1.5 app/explore/componentForExplore/BottomNavigation.tsx — now re-exports from shared BottomNav
- [x] 1.5 components/layout/VendorSidebar.tsx — created (desktop collapsible, tablet icon-only, mobile drawer RTL)

---

## Phase 2: UI/UX Fixes Queue

- [x] 2.1 `/login` — RTL icon alignment, inline validation errors, disabled/loading submit, forgot-password link
- [x] 2.2 `/signup/customer` — 2-step indicator, step validation, OTP 6-box UI, RTL back action ("رجوع")
- [x] 2.3 `/signup/vendor` — 3-step progress labels, per-step validation, responsive map loader height, geolocation inline errors
- [x] 2.4 `/explore` — removed inline `<style>` in `RestaurantCard`, responsive hero emoji, RTL search input, non-overflow chips, 2xl grid
- [x] 2.5 `/cart` — loading skeleton cards, fixed checkout offset from bottom-nav var, mobile-friendly payment proof file picker
- [x] 2.6 `/vendor/dashboard` — integrated `VendorSidebar` layout, mobile hamburger visibility, stats responsive grid, mobile stacked recent orders view
- [x] 2.7 `/vendor/dishes` — mobile 2-column dish grid, full-screen mobile Add/Edit modals, removed inline style block
- [x] 2.8 `/vendor/orders` — filter chips horizontal scroll, mobile full-screen details modal, removed page-level inline style/import

## Phase 3: Performance Fixes Queue

- [x] 3.1 Dead code cleanup (targeted): removed debug console calls, removed unused imports/states, removed duplicated local utility (`calculateDistance`) in cart, deleted long commented block in explore card
- [x] 3.2 Bundle audit: `framer-motion` kept (still used in multiple interactive flows including route transitions), `pusher-js` confirmed imported and used, `socket.io-client` confirmed not global/layout-level
- [!] 3.2 socket scope hard-rule: `socket.io-client` still required in `profile/components/ChatModal.tsx` (customer realtime chat). Migrating to vendor-only without backend/protocol unification would break customer chat
- [x] 3.3 React perf: fixed `useMemo`/`useCallback` dependency issues in explore, wrapped `StatsCards` and `DishCard` with `memo`, wrapped cart handlers with `useCallback`
- [x] 3.4 API efficiency: explore dishes fetching changed to batched `Promise.allSettled` (batch size 5), added `signal.aborted` protection, added AbortController patterns to explore/cart/profile/vendor dashboard/orders/dishes
- [x] 3.5 Image optimization: replaced remaining app `<img>` usage with `next/image`; updated `next.config.ts` image remote patterns
- [x] 3.6 Next optimizations: kept existing loading screens, converted `explore/loading.tsx` to `SkeletonRestaurantGrid`, added `app/explore/error.tsx` and `app/cart/error.tsx`
- [!] 3.6 exhaustive `'use client'` audit across every file not completed line-by-line in this pass; only touched/critical files were audited and optimized

## Phase 4: Final Review Checklist

## Cross-File Dependencies Map

- `CartContext.tsx` → `BottomNavigation.tsx`, `cart/page.tsx` (no-ops affect both)
- `lib/utils.ts::calculateDistance` → duplicated in `cart/page.tsx`
- `lib/utils.ts` (missing `getTimeAgo`) → duplicated in `RecentOrdersTable.tsx` + `OrderCard.tsx`
- `components/ui/EmptyState.tsx` → duplicated in `profile/components/EmptyState.tsx`
- `explore/componentForExplore/RestaurantCard.tsx` → duplicated inline in `explore/page.tsx`
- `globals.css` → missing vars used in `login/page.tsx` ✓ FIXED
- `VendorChatModal.tsx` (Pusher) ↔ `ChatModal.tsx` (Socket.io) — two different real-time systems

## Notes & Decisions

- Total files scanned: 35 (+ axios.js root = 36)
- `lib/auth.ts` does not exist — referenced in original list but absent from project
- `app/ClientLayout.tsx` deleted (shown as `D` in git status) — replaced by `AnimatedLayout.tsx`
- `lib/axios.ts` is a thin re-export of `lib/api` — single source of truth preserved
- `BackButton` now has both named + default export to satisfy existing consumers

