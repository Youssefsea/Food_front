// ─── Class Name Merger ───
export function cn(...classes: (string | boolean | undefined | null | number)[]): string {
  return classes.filter((c): c is string => typeof c === 'string' && c.length > 0).join(' ');
}

// ─── Currency Formatting ───
export function formatCurrency(amount: number): string {
  return `${Number(amount || 0).toFixed(2)} EGP`;
}

export function formatCurrencyShort(amount: number): string {
  return `${Number(amount || 0).toFixed(2)} EGP`;
}

// ─── Date Formatting ───
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('ar-EG', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatRelativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'الآن';
  if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
  if (diffHours < 24) return `منذ ${diffHours} ساعة`;
  if (diffDays < 7) return `منذ ${diffDays} يوم`;
  return formatDate(dateString);
}

// ─── Format Distance To Now (date-fns compatible) ───
interface FormatDistanceOptions {
  addSuffix?: boolean;
}

export function formatDistanceToNow(date: Date, options?: FormatDistanceOptions): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  let result: string;
  if (diffMins < 1) result = 'الآن';
  else if (diffMins < 60) result = `${diffMins} دقيقة`;
  else if (diffHours < 24) result = `${diffHours} ساعة`;
  else if (diffDays < 30) result = `${diffDays} يوم`;
  else result = formatDate(date.toISOString());

  if (options?.addSuffix) {
    return `منذ ${result}`;
  }
  return result;
}

// ─── Distance Formatting ───
export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} متر`;
  return `${km.toFixed(1)} كم`;
}

// ─── Haversine Distance Calculation ───
export function calculateDistance(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// ─── Email Validation ───
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ─── Phone Validation (Egyptian format) ───
export function isValidPhone(phone: string): boolean {
  return /^01[0-9]{9}$/.test(phone);
}

// ─── Dish Image Parser (comma-separated Cloudinary URLs) ───
export function parseDishImages(imageField: string | undefined | null): string[] {
  if (!imageField) return [];
  return imageField
    .split(',')
    .map((url) => url.trim())
    .filter(Boolean);
}

// ─── Get First Dish Image ───
export function getFirstImage(imageField: string | undefined | null): string {
  const images = parseDishImages(imageField);
  return images[0] || '';
}

// ─── Truncate Text ───
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

// ─── Price Range Helper ───
export function getPriceRange(prices: number[]): string {
  if (prices.length === 0) return '';
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  if (min === max) return formatCurrency(min);
  return `${formatCurrency(min)} - ${formatCurrency(max)}`;
}
