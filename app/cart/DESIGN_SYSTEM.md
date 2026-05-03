# Akly Design System

## Typography
Clear type scale used across the application to ensure hierarchy and readability:
- **Extra Small (xs):** 12px (Captions, labels)
- **Small (sm):** 14px (Minimum for body text on mobile)
- **Base:** 16px (Default body text)
- **Large (lg):** 18px (Section titles)
- **Extra Large (xl):** 20px (Modal titles)
- **2XL:** 24px (Page headers)
- **3XL:** 28px
- **4XL:** 32px (Hero headings)
- **5XL:** 40px

**Arabic Line Height:** 1.7 (Optimal for Arabic script legibility)

## Spacing
Consistent spacing scale (Multiples of 4px):
- 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px.

## Colors & Contrast
- **Primary (Orange):** `#FF6B35` (Ensured 4.5:1 contrast ratio for white text)
- **Secondary (Red):** `#E63946`
- **Dark:** `#1A1A2E`
- **Muted (Gray):** `#6B7280` (Darkened from original to meet WCAG AA contrast on white)
- **Background:** `#FAFAFA`

## Components Consistency
### Buttons & Inputs
- **Standard Height:** 48px
- **Border Radius:** 12px (xl)
- **Touch Target:** Minimum 44x44px
- **Focus State:** Primary color ring at 20% opacity.

### Cards
- **Padding:** 16px (Spacing-4)
- **Shadow:** Soft shadow for resting, elevated shadow + subtle scale for hover.
- **Border Radius:** 16px (2xl)

## Mobile Excellence
- **Modals:** Automatically behave as slide-up bottom sheets on screens < 640px.
- **Navigation:** Fixed bottom navigation (Z-index 50) with safe area consideration.
- **Form Validation:** Instant feedback on blur with helpful Arabic messaging.

## Feedback & Communication
- **API States:** Unified Sonner toasts for Loading, Success, and Error.
- **Network Error:** Specific Arabic message: 'تحقق من اتصالك بالانترنت'.
- **Empty States:** Branded icons with clear Call-to-Action (CTA) buttons.