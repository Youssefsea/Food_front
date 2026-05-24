'use client';

import { useEffect, useState, useMemo, useCallback, memo, useRef } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import api, { isTimeoutError } from '@/lib/api';
import { useDebounce } from '@/hooks/useDebounce';
import { useGeolocation } from '@/hooks/useGeolocation';
import { RestaurantCardSkeleton } from '@/components/ui/Skeleton';
import { useInView } from 'react-intersection-observer';
import { EmptyState } from '@/components/ui';
import { cn, getFirstImage } from '@/lib/utils';
import { Search, MapPin, Navigation, X, Truck, BookOpen } from 'lucide-react';
import { ProtectedRoute } from '@/app/context/AuthContext';

const LocationCustomer = dynamic(() => import('./LocationCustomer'), { ssr: false });

// ─── Constants ────────────────────────────────────────────────────────────────
const RESTAURANTS_CACHE_TTL   = 60_000;
const DISH_FETCH_BATCH_SIZE   = 5;
const RESTAURANTS_PER_PAGE    = 9;

// ─── Types ────────────────────────────────────────────────────────────────────
interface Restaurant {
  id:                number;
  restaurant_name:   string;
  location:          string;
  latitude:          number;
  longitude:         number;
  can_deliver:       boolean;
  can_reserve:       boolean;
  delivery_fees:     number;
  image?:            string;
}

interface Dish {
  name:              string;
  price:             number;
  image:             string;
  category?:         string;
  description?:      string;
  preparation_time?: number;
}

type RestaurantsCache = {
  data:      Restaurant[];
  dishes:    Record<number, Dish[]>;
  updatedAt: number;
} | null;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function isAbortError(err: unknown): boolean {
  return err instanceof Error &&
    (err.name === 'AbortError' || err.name === 'CanceledError');
}

// ─── RestaurantCard ───────────────────────────────────────────────────────────
const RestaurantCard = memo(function RestaurantCard({
  restaurant,
  dishes,
  isNearby,
}: {
  restaurant: Restaurant;
  dishes:     Dish[];
  isNearby:   boolean;
}) {
  const coverImage =
    restaurant.image ||
    (dishes.length > 0 ? getFirstImage(dishes[0]?.image) : '');

  return (
    <Link
      href={`/restaurant/${encodeURIComponent(restaurant.restaurant_name)}`}
      className="group block bg-white rounded-[16px] overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      {/* Cover Image */}
      <div className="relative h-36 sm:h-40 bg-gradient-to-br from-orange-100 to-red-50 overflow-hidden">
        {coverImage && !coverImage.includes('undefined') ? (
          <Image
            src={coverImage}
            alt={restaurant.restaurant_name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl opacity-30">🍽️</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 right-3 flex gap-1.5">
          {isNearby && (
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/90 text-white text-[10px] font-bold backdrop-blur-sm">
              📍 قريب
            </span>
          )}
          {restaurant.can_deliver && (
            <span className="px-2 py-0.5 rounded-full bg-white/90 text-[#1A1A2E] text-[10px] font-bold backdrop-blur-sm">
              🚗 توصيل
            </span>
          )}
        </div>

        {/* Dish Previews */}
        {dishes.length > 1 && (
          <div className="absolute bottom-3 left-3 flex -space-x-2">
            {dishes.slice(0, 3).map((dish, i) => {
              const img = getFirstImage(dish.image);
              return img ? (
                <div
                  key={dish.name}
                  className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-white"
                  style={{ zIndex: 3 - i }}
                >
                  <Image src={img} alt="" width={32} height={32} className="w-full h-full object-cover" />
                </div>
              ) : null;
            })}
            {dishes.length > 3 && (
              <div className="w-8 h-8 rounded-full border-2 border-white bg-[#FF6B35] flex items-center justify-center text-white text-[9px] font-bold">
                +{dishes.length - 3}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-base font-bold text-[#1A1A2E] mb-2 line-clamp-1">
          {restaurant.restaurant_name}
        </h3>

        {restaurant.location && (
          <div className="flex items-center gap-1 text-sm text-[#6B7280] mb-3">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="line-clamp-1">{restaurant.location}</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {dishes.length > 0 && (
              <span className="text-xs text-[#6B7280] bg-gray-100 px-2 py-1 rounded-full">
                {dishes.length} صنف
              </span>
            )}
            {restaurant.can_reserve && (
              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                حجز
              </span>
            )}
          </div>
          {restaurant.delivery_fees > 0 && (
            <span className="text-xs font-semibold text-[#FF6B35]">
              توصيل {restaurant.delivery_fees} ج/كم
            </span>
          )}
        </div>
      </div>
    </Link>
  );
});

// ─── ExplorePage ──────────────────────────────────────────────────────────────
export default function ExplorePage() {
  const [mounted, setMounted]                         = useState(false);
  const [allRestaurants, setAllRestaurants]           = useState<Restaurant[]>([]);
  const [nearbyRestaurantIds, setNearbyRestaurantIds] = useState<Set<number>>(new Set());
  const [restaurantDishes, setRestaurantDishes]       = useState<Record<number, Dish[]>>({});
  const [searchQuery, setSearchQuery]                 = useState('');
  const [activeCategory, setActiveCategory]           = useState<string | null>(null);
  const [nearbyOnly, setNearbyOnly]                   = useState(false);
  const [deliveryOnly, setDeliveryOnly]               = useState(false);
  const [bookingOnly, setBookingOnly]                 = useState(false);
  const [isLoading, setIsLoading]                     = useState(true);
  const [isFetchingMore, setIsFetchingMore]           = useState(false);
  const [loadError, setLoadError]                     = useState<string | null>(null);
  const [city, setCity]                               = useState<string | null>(null);
  const [page, setPage]                               = useState(1);
  const [hasMore, setHasMore]                         = useState(true);

  const initialControllerRef = useRef<AbortController | null>(null);
  const moreControllerRef    = useRef<AbortController | null>(null);
  const restaurantsCacheRef  = useRef<RestaurantsCache>(null);

  const debouncedSearch = useDebounce(searchQuery, 300);
  const { lat, lng, isLocating, getCurrentPosition } = useGeolocation();
  const { ref: infiniteScrollRef, inView }           = useInView({ threshold: 0.1 });

  // ─── Data Fetching ───────────────────────────────────────────────────────────

  const fetchRestaurantDishes = useCallback(async (
    restaurantId: number,
    signal: AbortSignal,
  ): Promise<Dish[]> => {
    if (signal.aborted) return [];
    try {
      const res = await api.post(
        '/restaurant/all-dishes-for-restaurantE',
        { restaurantId },
        { signal },
      );
      return res.data.dishes || [];
    } catch {
      return [];
    }
  }, []);

  const fetchDishesWithBatching = useCallback(async (
    restaurants: Restaurant[],
    signal: AbortSignal,
  ): Promise<Record<number, Dish[]>> => {
    const dishesMap: Record<number, Dish[]> = {};

    for (let i = 0; i < restaurants.length; i += DISH_FETCH_BATCH_SIZE) {
      if (signal.aborted) break;

      const batch   = restaurants.slice(i, i + DISH_FETCH_BATCH_SIZE);
      const settled = await Promise.allSettled(
        batch.map(async (r) => {
          const dishes = await fetchRestaurantDishes(r.id, signal);
          return [r.id, dishes] as const;
        }),
      );

      settled.forEach((result) => {
        if (result.status === 'fulfilled') {
          const [id, dishes] = result.value;
          dishesMap[id] = dishes;
        }
      });
    }

    return dishesMap;
  }, [fetchRestaurantDishes]);

  const fetchAllRestaurants = useCallback(async () => {
    const cache        = restaurantsCacheRef.current;
    const cacheIsFresh = cache && Date.now() - cache.updatedAt < RESTAURANTS_CACHE_TTL;

    if (cacheIsFresh) {
      setAllRestaurants(cache.data);
      setRestaurantDishes(cache.dishes);
      setIsLoading(false);
      return;
    }

    initialControllerRef.current?.abort();
    const controller = new AbortController();
    initialControllerRef.current = controller;

    setIsLoading(true);
    setLoadError(null);

    try {
      const res = await api.get('/restaurant/all', {
        signal: controller.signal,
        params: { page: 1, limit: RESTAURANTS_PER_PAGE },
      });

      const restaurants: Restaurant[] = res.data.restaurants || [];
      const dishesMap = await fetchDishesWithBatching(restaurants, controller.signal);

      setAllRestaurants(restaurants);
      setRestaurantDishes(dishesMap);
      setPage(1);
      setHasMore(restaurants.length === RESTAURANTS_PER_PAGE);

      restaurantsCacheRef.current = {
        data:      restaurants,
        dishes:    dishesMap,
        updatedAt: Date.now(),
      };
    } catch (err: unknown) {
      if (isAbortError(err)) return;
      setLoadError(
        isTimeoutError(err)
          ? 'انتهت المهلة أثناء تحميل المطاعم. حاول مرة أخرى.'
          : 'تعذر تحميل المطاعم حالياً',
      );
    } finally {
      setIsLoading(false);
    }
  }, [fetchDishesWithBatching]);

  const fetchMoreRestaurants = useCallback(async () => {
    if (isFetchingMore || !hasMore || isLoading) return;

    moreControllerRef.current?.abort();
    const controller = new AbortController();
    moreControllerRef.current = controller;

    setIsFetchingMore(true);
    const nextPage = page + 1;

    try {
      const res = await api.get('/restaurant/all', {
        signal: controller.signal,
        params: { page: nextPage, limit: RESTAURANTS_PER_PAGE },
      });

      const newRestaurants: Restaurant[] = res.data.restaurants || [];
      const newDishesMap = await fetchDishesWithBatching(newRestaurants, controller.signal);

      setAllRestaurants(prev => [...prev, ...newRestaurants]);
      setRestaurantDishes(prev => ({ ...prev, ...newDishesMap }));
      setPage(nextPage);
      setHasMore(newRestaurants.length === RESTAURANTS_PER_PAGE);
    } catch (err: unknown) {
      if (isAbortError(err)) return;
    } finally {
      setIsFetchingMore(false);
    }
  }, [fetchDishesWithBatching, hasMore, isFetchingMore, isLoading, page]);

  const fetchNearbyRestaurants = useCallback(async (
    latitude:  number,
    longitude: number,
  ) => {
    try {
      const res = await api.post('/customer/nearest-restaurants', {
        lng: longitude,
        lat: latitude,
      });

      if (res.data.nearby_restaurants?.length > 0) {
        const nearbyIds = new Set<number>(
          res.data.nearby_restaurants.map(
            (r: { restaurant_id?: number; id: number }) => r.restaurant_id ?? r.id,
          ),
        );
        setNearbyRestaurantIds(nearbyIds);
        setNearbyOnly(true);
      } else {
        setNearbyRestaurantIds(new Set());
        setNearbyOnly(false);
      }
    } catch {
      setNearbyRestaurantIds(new Set());
    }
  }, []);

  const getLocationName = useCallback(async (
    latitude:  number,
    longitude: number,
  ): Promise<string | null> => {
    try {
      // Note: Using fetch directly to avoid baseURL conflicts with the api instance
      const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=ar`;
      const res = await fetch(url);
      const data = await res.json();
      return data?.address?.city || data?.address?.town || null;
    } catch {
      return null;
    }
  }, []);

  const handleGetLocation = useCallback(async () => {
    try {
      const pos = await getCurrentPosition();
      const [locationName] = await Promise.all([
        getLocationName(pos.lat, pos.lng),
        fetchNearbyRestaurants(pos.lat, pos.lng),
      ]);
      setCity(locationName);
    } catch {
      // Error handled by useGeolocation hook
    }
  }, [getCurrentPosition, getLocationName, fetchNearbyRestaurants]);

  // ─── Derived State ───────────────────────────────────────────────────────────

  const filteredRestaurants = useMemo(() => {
    let filtered = [...allRestaurants];

    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      filtered = filtered.filter(r =>
        r.restaurant_name?.toLowerCase().includes(q),
      );
    }

    if (activeCategory) {
      filtered = filtered.filter(r =>
        (restaurantDishes[r.id] || []).some(d => d.category === activeCategory),
      );
    }

    if (nearbyOnly)   filtered = filtered.filter(r => nearbyRestaurantIds.has(r.id));
    if (deliveryOnly) filtered = filtered.filter(r => r.can_deliver);
    if (bookingOnly)  filtered = filtered.filter(r => r.can_reserve);

    return filtered;
  }, [
    allRestaurants, debouncedSearch, activeCategory,
    nearbyOnly, deliveryOnly, bookingOnly,
    nearbyRestaurantIds, restaurantDishes,
  ]);

  const activeFiltersCount = useMemo(
    () => [nearbyOnly, deliveryOnly, bookingOnly].filter(Boolean).length,
    [nearbyOnly, deliveryOnly, bookingOnly],
  );

  const clearAllFilters = useCallback(() => {
    setSearchQuery('');
    setNearbyOnly(false);
    setDeliveryOnly(false);
    setBookingOnly(false);
    setActiveCategory(null);
  }, []);

  // ─── Effects ─────────────────────────────────────────────────────────────────

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    fetchAllRestaurants(); // eslint-disable-line react-hooks/exhaustive-deps
    return () => {
      initialControllerRef.current?.abort();
      moreControllerRef.current?.abort();
    };
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    if (inView && hasMore && !isLoading && !isFetchingMore) {
      fetchMoreRestaurants();
    }
  }, [inView, hasMore, isLoading, isFetchingMore, fetchMoreRestaurants, mounted]);

  // ─── Filter Chips Config ─────────────────────────────────────────────────────

  const filterChips = [
    {
      label:   'قريب مني',
      icon:    Navigation,
      active:  nearbyOnly,
      loading: isLocating,
      onClick: () => nearbyOnly ? setNearbyOnly(false) : handleGetLocation(),
    },
    {
      label:   'يوصل',
      icon:    Truck,
      active:  deliveryOnly,
      loading: false,
      onClick: () => setDeliveryOnly(prev => !prev),
    },
    {
      label:   'حجز',
      icon:    BookOpen,
      active:  bookingOnly,
      loading: false,
      onClick: () => setBookingOnly(prev => !prev),
    },
  ];

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <ProtectedRoute role="customer">
      <div className="min-h-screen bg-[#FAFAFA]" dir="rtl">

        {/* Hero */}
        <section className="relative bg-gradient-to-br from-[#FF6B35] to-[#E63946] pt-14 pb-16 sm:pt-16 sm:pb-20 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
            <div className="absolute top-4 right-8 text-xl sm:text-2xl opacity-15">🍕</div>
            <div className="absolute bottom-8 left-12 text-xl sm:text-2xl opacity-10">🍔</div>
            <div className="absolute top-12 left-1/3 text-2xl opacity-10">🌮</div>
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-white/5" />
          </div>

          <div className="relative px-4 sm:px-6">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-3 py-1.5 mb-3">
              <span className="text-lg">👋</span>
              <p className="text-xs text-white font-medium">أهلاً وسهلاً!</p>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 leading-tight">
              نفسك في إيه
              <span className="block text-white/90">النهـاردة؟ 🍽️</span>
            </h1>
            <p className="text-sm text-white/70 mb-6">اكتشف ألذ الأكلات حواليك</p>

            {/* Search Bar */}
            <div className="relative max-w-xl">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
              <input
                type="text"
                placeholder="ابحث عن مطعم أو أكلة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoComplete="off"
                className="w-full h-12 pr-12 pl-4 rounded-xl bg-white/95 backdrop-blur-sm text-base text-[#1A1A2E] placeholder:text-[#9CA3AF] border-0 outline-none shadow-lg focus:ring-2 focus:ring-white/30"
                dir="rtl"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-gray-100/50"
                  aria-label="مسح البحث"
                >
                  <X className="w-4 h-4 text-[#6B7280]" />
                </button>
              )}
            </div>
          </div>

          {/* Wave separator */}
          <svg className="absolute bottom-0 left-0 right-0 h-6" viewBox="0 0 1440 24" fill="none" preserveAspectRatio="none">
            <path d="M0 24h1440V12c-120 8-240 12-360 12s-240-4-360-12c-120-8-240-12-360-12S120 4 0 12v12z" fill="#FAFAFA" />
          </svg>
        </section>

        {/* Location & Filter Chips */}
        <div className="px-4 sm:px-5 pt-4 pb-2">
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-2">
            {/* Location button */}
            <button
              onClick={handleGetLocation}
              disabled={isLocating}
              className="flex items-center gap-1.5 bg-white shadow-sm rounded-full px-3 py-2 text-xs font-medium text-[#1A1A2E] hover:shadow-md transition-all flex-shrink-0 border border-gray-100 disabled:opacity-60"
            >
              <div className="w-5 h-5 rounded-full bg-[#FF6B35]/10 flex items-center justify-center">
                <Navigation className="w-3 h-3 text-[#FF6B35]" />
              </div>
              <span className="max-w-[70px] truncate">
                {isLocating ? 'جاري التحديد...' : 'موقعي'}
              </span>
            </button>

            {/* City badge */}
            {city && (
              <div className="flex items-center gap-1.5 bg-emerald-50 rounded-full px-3 py-2 text-xs font-medium text-emerald-700 flex-shrink-0 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="truncate max-w-[100px]">{city}</span>
              </div>
            )}

            <div className="w-px h-6 bg-gray-200 flex-shrink-0" />

            {/* Filter chips */}
            {filterChips.map((chip) => {
              const Icon = chip.icon;
              return (
                <button
                  key={chip.label}
                  onClick={chip.onClick}
                  disabled={chip.loading}
                  className={cn(
                    'flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium transition-all flex-shrink-0 border disabled:opacity-60',
                    chip.active
                      ? 'bg-[#FF6B35] text-white border-[#FF6B35] shadow-md shadow-orange-500/20'
                      : 'bg-white text-[#6B7280] border-gray-100 hover:border-gray-200 hover:shadow-sm',
                  )}
                >
                  <Icon className="w-3 h-3" />
                  <span>{chip.label}</span>
                </button>
              );
            })}

            {/* Clear filters */}
            {activeFiltersCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-1 rounded-full px-2.5 py-2 text-xs text-red-500 hover:bg-red-50 transition-all flex-shrink-0"
              >
                <X className="w-3 h-3" />
                <span>مسح</span>
              </button>
            )}
          </div>
        </div>

        {/* Restaurant Grid */}
        <main className="px-4 sm:px-5 py-4 pb-28 sm:pb-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#1A1A2E] flex items-center gap-1.5">
                <span>📍</span>
                {nearbyOnly ? 'مطاعم قريبة منك' : 'جميع المطاعم'}
              </h2>
              <p className="text-[11px] text-[#9CA3AF] mt-0.5">
                {nearbyOnly
                  ? 'بناءً على موقعك الحالي'
                  : `${filteredRestaurants.length} مطعم`}
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <RestaurantCardSkeleton key={i} />
              ))}
            </div>
          ) : loadError ? (
            <EmptyState
              icon="⚠️"
              title="تعذر تحميل المطاعم"
              description={loadError}
              actionLabel="إعادة المحاولة"
              onAction={fetchAllRestaurants}
            />
          ) : filteredRestaurants.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5">
              {filteredRestaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  dishes={restaurantDishes[restaurant.id] || []}
                  isNearby={nearbyRestaurantIds.has(restaurant.id)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon="🔍"
              title="لا توجد مطاعم"
              description={
                nearbyOnly
                  ? 'لا توجد مطاعم قريبة حالياً. جرّب توسيع نطاق البحث.'
                  : searchQuery
                    ? 'جرب كلمات بحث مختلفة'
                    : 'لم نجد مطاعم بهذه الفلاتر'
              }
              actionLabel={
                nearbyOnly
                  ? 'عرض كل المطاعم'
                  : activeFiltersCount > 0
                    ? 'مسح الفلاتر'
                    : undefined
              }
              onAction={
                nearbyOnly
                  ? () => setNearbyOnly(false)
                  : activeFiltersCount > 0
                    ? clearAllFilters
                    : undefined
              }
            />
          )}

          {/* Loading more skeleton */}
          {isFetchingMore && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <RestaurantCardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Infinite scroll trigger */}
          <div ref={infiniteScrollRef} className="h-1" />
        </main>

      </div>
    </ProtectedRoute>
  );
}