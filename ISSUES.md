# ISSUES

## Critical
- None identified.

## Medium
- Admin login endpoint (`/LogforAdmin`) is not defined in the Phase 5 API contract; confirm backend support.
- Delivery-radius and closed-restaurant validation in cart depends on backend providing `allowed_radius_km` and `is_open` in cart responses; if missing, the UI cannot enforce those checks.
- Restaurant listing uses `/restaurant/all` and `/restaurant/search-by-name`, which are outside the Phase 5 contract; verify backend availability.
- Build/lint validation could not be executed in this environment because PowerShell (pwsh) is unavailable.

## Minor
- If cookies are blocked, session restoration may fail even when a token exists in localStorage (by design after security hardening).
