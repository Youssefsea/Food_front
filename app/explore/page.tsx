"use client";

import { useEffect, useState, useMemo, useCallback, memo, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import api from "@/lib/api";
import { useDebounce } from "@/hooks/useDebounce";
import { useGeolocation } from "@/hooks/useGeolocation";
import { RestaurantCardSkeleton, CategoryChipSkeleton } from "@/components/ui/Skeleton";
import { useInView } from "react-intersection-observer";
import { EmptyState } from "@/components/ui";
import { cn, getFirstImage } from "@/lib/utils";
import { Search, MapPin, Navigation, X, Truck, BookOpen } from "lucide-react";
import axios from "axios";
import { ProtectedRoute } from "@/app/context/AuthContext";

const LocationCustomer = dynamic(() => import("./LocationCustomer"), { ssr: false });
const RESTAURANTS_CACHE_TTL = 60_000;
const DISH_FETCH_BATCH_SIZE = 5;
let restaurantsCache: { data: Restaurant[]; dishes: { [key: number]: Dish[] }; updatedAt: number } | null = null;

interface Restaurant {
  id: number;
  restaurant_name: string;
  location: string;
  latitude: number;
  longitude: number;
  can_deliver: boolean;
  can_reserve: boolean;
  delivery_fees: number;
  image?: string;
  isNearby?: boolean;
  dishes?: Dish[];
}

interface Dish {
  id: number;
  name: string;
  price: number;
  image: string;
}

// ─── Restaurant Card Component ───
const RestaurantCard = memo(function RestaurantCard({
  restaurant,
  dishes,
  isNearby,
}: {
  restaurant: Restaurant;
  dishes: Dish[];
  isNearby: boolean;
}) {
  const coverImage = restaurant.image || (dishes.length > 0 ? getFirstImage(dishes[0]?.image) : '');
  const dishCount = dishes.length;

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
            className="object-cover group-hover:scale-105 transition-transform duration-500 image-placeholder"
            onLoad={(e) => {
              e.currentTarget.classList.remove('image-placeholder');
            }}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl opacity-30">🍽️</span>
          </div>
        )}

        {/* Overlay gradient */}
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

        {/* Dish previews */}
        {dishes.length > 1 && (
          <div className="absolute bottom-3 left-3 flex -space-x-2">
            {dishes.slice(0, 3).map((dish, i) => {
              const img = getFirstImage(dish.image);
              return img ? (
                <div key={dish.id} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-white" style={{ zIndex: 3 - i }}>
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

        <div className="flex items-center gap-3 text-sm text-[#6B7280] mb-4">
          {restaurant.location && (
            <span className="flex items-center gap-1 line-clamp-1">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              {restaurant.location}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {dishCount > 0 && (
              <span className="text-xs text-[#6B7280] bg-gray-100 px-2 py-1 rounded-full">
                {dishCount} صنف
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

const CATEGORIES = [
  { name: 'بيتزا', icon: '🍕' },
  { name: 'برجر', icon: '🍔' },
  { name: 'شاورما', icon: '🥙' },
  { name: 'مكرونة', icon: '🍝' },
  { name: 'صحي', icon: '🥗' },
];
const RESTAURANTS_PER_PAGE = 9; // For infinite scroll

// ─── Main Explore Page ───
export default function ExplorePage() {
  const [mounted, setMounted] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>([]);
  const [nearbyRestaurantIds, setNearbyRestaurantIds] = useState<Set<number>>(new Set());
  const [restaurantDishes, setRestaurantDishes] = useState<{ [key: number]: Dish[] }>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [nearbyOnly, setNearbyOnly] = useState(false);
  const [deliveryOnly, setDeliveryOnly] = useState(false);
  const [bookingOnly, setBookingOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Initial loading state
  const [isFetchingMore, setIsFetchingMore] = useState(false); // For infinite scroll
  const [loadError, setLoadError] = useState<string | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const requestControllerRef = useRef<AbortController | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const debouncedSearch = useDebounce(searchQuery, 300);
  const { lat, lng, isLocating, getCurrentPosition, setPosition } = useGeolocation();
  const { ref: infiniteScrollRef, inView } = useInView({
    threshold: 0.1,
  });

  const fetchRestaurantDishes = useCallback(async (restaurantId: number, signal: AbortSignal) => {
    if (signal.aborted) return [] as Dish[];
    try {
      const dishesRes = await api.post(
        "/restaurant/all-dishes-for-restaurantE",
        { restaurantId },
        { signal }
      );
      return dishesRes.data.dishes || [];
    } catch {
      return [];
    }
  }, []);

  const fetchDishesWithBatching = useCallback(async (restaurants: Restaurant[], signal: AbortSignal) => {
    const dishesMap: Record<number, Dish[]> = {};

    for (let i = 0; i < restaurants.length; i += DISH_FETCH_BATCH_SIZE) {
      if (signal.aborted) break;
      const batch = restaurants.slice(i, i + DISH_FETCH_BATCH_SIZE);
      const settled = await Promise.allSettled(
        batch.map(async (restaurant) => {
          const dishes = await fetchRestaurantDishes(restaurant.id, signal);
          return [restaurant.id, dishes] as const;
        })
      );

      settled.forEach((result) => {
        if (result.status === "fulfilled") {
          const [id, dishes] = result.value;
          dishesMap[id] = dishes;
        }
      });
    }

    return dishesMap;
  }, [fetchRestaurantDishes]);

  const fetchAllRestaurants = useCallback(async () => {
    setIsLoading(true);
    const cacheIsFresh =
      restaurantsCache &&
      Date.now() - restaurantsCache.updatedAt < RESTAURANTS_CACHE_TTL;

    if (cacheIsFresh && restaurantsCache) {
      setAllRestaurants(restaurantsCache.data);
      setRestaurantDishes(restaurantsCache.dishes);
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }

    requestControllerRef.current?.abort();
    const controller = new AbortController();
    requestControllerRef.current = controller;

    try {
      setLoadError(null);
      const res = await api.get("/restaurant/all", { signal: controller.signal, params: { page: 1, limit: RESTAURANTS_PER_PAGE } });
      const restaurants = res.data.restaurants || [];
      const dishesMap = await fetchDishesWithBatching(restaurants, controller.signal);

      setAllRestaurants(restaurants);
      setRestaurantDishes(dishesMap);
      setPage(1);
      setHasMore(restaurants.length === RESTAURANTS_PER_PAGE);
      restaurantsCache = { data: restaurants, dishes: dishesMap, updatedAt: Date.now() };
    } catch (error) {
      if (axios.isCancel(error)) return;
      setLoadError("تعذر تحميل المطاعم حالياً");
    } finally {
      setIsLoading(false);
    }
  }, [fetchDishesWithBatching]);

  const fetchMoreRestaurants = useCallback(async () => {
    if (isFetchingMore || !hasMore || isLoading) return;

    setIsFetchingMore(true);
    const nextPage = page + 1;
    const controller = new AbortController();
    requestControllerRef.current = controller;

    try {
      const res = await api.get("/restaurant/all", { signal: controller.signal, params: { page: nextPage, limit: RESTAURANTS_PER_PAGE } });
      const newRestaurants = res.data.restaurants || [];
      const newDishesMap = await fetchDishesWithBatching(newRestaurants, controller.signal);

      setAllRestaurants(prev => [...prev, ...newRestaurants]);
      setRestaurantDishes(prev => ({ ...prev, ...newDishesMap }));
      setPage(nextPage);
      setHasMore(newRestaurants.length === RESTAURANTS_PER_PAGE);
    } catch (error) {
      if (axios.isCancel(error)) return;
    } finally {
      setIsFetchingMore(false);
      requestControllerRef.current = null;
    }
  }, [fetchDishesWithBatching, hasMore, isFetchingMore, isLoading, page]);

  const fetchNearbyRestaurants = useCallback(async (latitude: number, longitude: number) => {
    try {
      const res = await api.post("/customer/nearest-restaurants", { lng: longitude, lat: latitude });
      if (res.data.nearby_restaurants?.length > 0) {
        const nearbyIds = new Set<number>(
          res.data.nearby_restaurants.map((r: { restaurant_id?: number; id: number }) => r.restaurant_id || r.id)
        );
        setNearbyRestaurantIds(nearbyIds);
        setNearbyOnly(true);
      } else {
        setNearbyRestaurantIds(new Set<number>());
        setNearbyOnly(false);
      }
    } catch {
      setNearbyRestaurantIds(new Set<number>());
    }
  }, []);

  const getLocationName = useCallback(async (latitude: number, longitude: number) => {
    try {
      const res = await axios.get("https://nominatim.openstreetmap.org/reverse", {
        params: { lat: latitude, lon: longitude, format: "json", accept_language: "ar" },
      });
      return res.data?.address?.city || res.data?.address?.town || null;
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
      // handled by hook
    }
  }, [getCurrentPosition, getLocationName, fetchNearbyRestaurants]);

  const handleLocationChange = useCallback(async (newLat: number, newLng: number) => {
    setPosition(newLat, newLng);
    const [locationName] = await Promise.all([
      getLocationName(newLat, newLng),
      fetchNearbyRestaurants(newLat, newLng),
    ]);
    setCity(locationName);
    setShowPicker(false);
  }, [setPosition, getLocationName, fetchNearbyRestaurants]);

  const filteredRestaurants = useMemo(() => {
    let filtered = [...allRestaurants];
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      filtered = filtered.filter(r => r.restaurant_name?.toLowerCase().includes(q));
    }
    if (activeCategory) {
      filtered = filtered.filter(r => 
        (restaurantDishes[r.id] || []).some(d => d.name.includes(activeCategory))
      );
    }
    if (nearbyOnly) filtered = filtered.filter(r => nearbyRestaurantIds.has(r.id));
    if (deliveryOnly) filtered = filtered.filter(r => r.can_deliver);
    if (bookingOnly) filtered = filtered.filter(r => r.can_reserve);
    return filtered;
  }, [activeCategory, allRestaurants, bookingOnly, debouncedSearch, deliveryOnly, nearbyOnly, nearbyRestaurantIds, restaurantDishes]);

  const activeFiltersCount = useMemo(() =>
    [nearbyOnly, deliveryOnly, bookingOnly].filter(Boolean).length,
    [nearbyOnly, deliveryOnly, bookingOnly]
  );

  const clearAllFilters = useCallback(() => {
    setSearchQuery("");
    setNearbyOnly(false);
    setDeliveryOnly(false);
    setBookingOnly(false);
    setActiveCategory(null);
  }, []);

  // Mount guard - fix for first-visit data loading bug
  useEffect(() => {
    setMounted(true);
  }, []);

  // Initial fetch - only after mounted
  useEffect(() => {
    if (!mounted) return;
    fetchAllRestaurants();
    return () => requestControllerRef.current?.abort();
  }, [fetchAllRestaurants, mounted]);

  // Infinite scroll trigger - only after mounted
  useEffect(() => {
    if (!mounted) return;
    if (inView && hasMore && !isLoading && !isFetchingMore) {
      fetchMoreRestaurants();
    }
  }, [inView, hasMore, isLoading, isFetchingMore, fetchMoreRestaurants, mounted]);

  const filterChips = [
    { label: "قريب مني", icon: Navigation, active: nearbyOnly, onClick: () => { if (!nearbyOnly) handleGetLocation(); else setNearbyOnly(false); }, loading: isLocating },
    { label: "يوصل", icon: Truck, active: deliveryOnly, onClick: () => setDeliveryOnly(!deliveryOnly) },
    { label: "حجز", icon: BookOpen, active: bookingOnly, onClick: () => setBookingOnly(!bookingOnly) },
  ];

  return (
    <ProtectedRoute role="customer">
      <div className="min-h-screen bg-[#FAFAFA]" dir="rtl">
      {/* ── Hero Section ── */}
      <section className="relative gradient-hero pt-14 pb-16 sm:pt-16 sm:pb-20 overflow-hidden">
        {/* Decorative */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute top-4 right-8 text-xl sm:text-2xl opacity-15 animate-float">🍕</div>
          <div className="absolute bottom-8 left-12 text-xl sm:text-2xl opacity-10 animate-float" style={{ animationDelay: '1s' }}>🍔</div>
          <div className="absolute top-12 left-1/3 text-2xl opacity-10 animate-float" style={{ animationDelay: '2s' }}>🌮</div>
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-white/5" />
        </div>

        <div className="relative px-5 sm:px-6">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-3 py-1.5 mb-3">
            <span className="text-lg animate-pulse-once">👋</span>
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
              autoComplete="search"
              className="w-full h-12 pr-12 pl-4 rounded-xl bg-white/95 backdrop-blur-sm text-base text-[#1A1A2E] placeholder:text-[#9CA3AF] border-0 outline-none shadow-lg shadow-black/10 focus:ring-2 focus:ring-white/30 text-right"
              dir="rtl"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-gray-100/50"
              >
                <X className="w-4 h-4 text-[#6B7280]" />
              </button>
            )}
          </div>
        </div>

        <svg className="absolute bottom-0 left-0 right-0 h-6" viewBox="0 0 1440 24" fill="none" preserveAspectRatio="none">
          <path d="M0 24h1440V12c-120 8-240 12-360 12s-240-4-360-12c-120-8-240-12-360-12S120 4 0 12v12z" fill="#FAFAFA" />
        </svg>
      </section>

      {/* ── Category Chips ── */}
      <div className="px-4 sm:px-5 pt-6">
        <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar pb-2">
          {isLoading ? Array.from({ length: 5 }).map((_, i) => <CategoryChipSkeleton key={i} />) : CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(activeCategory === cat.name ? null : cat.name)}
              className={cn(
                "flex flex-col items-center gap-2 min-w-[70px] p-3 rounded-2xl transition-all",
                activeCategory === cat.name 
                  ? "bg-[#FF6B35] text-white shadow-lg shadow-orange-500/30 scale-105" 
                  : "bg-white text-[#1A1A2E] border border-gray-100 hover:border-orange-200"
              )}
            >
              <span className="text-2xl">{cat.icon}</span>
              <span className="text-[10px] font-bold">{cat.name}</span>
            </button>
          ))} {/* End CATEGORIES map */}
        </div>
      </div>

      {/* ── Location & Filter Chips ── */}
      <div className="px-4 sm:px-5 pt-4 pb-2">
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-2">
          {/* Location button */}
          <button
            onClick={handleGetLocation}
            disabled={isLocating}
            className="flex items-center gap-1.5 bg-white shadow-sm rounded-full px-3 py-2 text-xs font-medium text-[#1A1A2E] hover:shadow-md transition-all flex-shrink-0 border border-gray-100"
          >
            <div className="w-5 h-5 rounded-full bg-[#FF6B35]/10 flex items-center justify-center">
              <Navigation className="w-3 h-3 text-[#FF6B35]" />
            </div>
            <span className="max-w-[70px] truncate">{isLocating ? "جاري التحديد..." : "موقعي"}</span>
          </button>

          {/* Map button */}
          <button
            onClick={() => setShowPicker(true)}
            className="flex items-center gap-1.5 bg-white shadow-sm rounded-full px-3 py-2 text-xs font-medium text-[#1A1A2E] hover:shadow-md transition-all flex-shrink-0 border border-gray-100"
          >
            <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <MapPin className="w-3 h-3 text-emerald-600" />
            </div>
            <span>الخريطة</span>
          </button>

          {/* City badge */}
          {city && (
            <div className="flex items-center gap-1.5 bg-emerald-50 rounded-full px-3 py-2 text-xs font-medium text-emerald-700 flex-shrink-0 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="truncate max-w-[100px]">{city}</span>
            </div>
          )}

          {/* Separator */}
          <div className="w-px h-6 bg-gray-200 flex-shrink-0" />

          {/* Filter chips */}
          {filterChips.map((chip) => {
            const Icon = chip.icon;
            return (
              <button
                key={chip.label}
                onClick={chip.onClick}
                disabled={'loading' in chip && chip.loading}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium transition-all flex-shrink-0 border",
                  chip.active
                    ? "bg-[#FF6B35] text-white border-[#FF6B35] shadow-md shadow-orange-500/20"
                    : "bg-white text-[#6B7280] border-gray-100 hover:border-gray-200 hover:shadow-sm"
                )}
              >
                <Icon className="w-3 h-3" />
                <span>{chip.label}</span>
              </button>
            );
          })}

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

      {/* ── Restaurant Grid ── */}
      <main className="px-4 sm:px-5 py-4 pb-28 sm:pb-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#1A1A2E] flex items-center gap-1.5">
              <span>📍</span>
              {nearbyOnly ? "مطاعم قريبة منك" : "جميع المطاعم"}
            </h2>
            <p className="text-[11px] text-[#9CA3AF] mt-0.5">
              {nearbyOnly ? "بناءً على موقعك الحالي" : `${filteredRestaurants.length} مطعم`}
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
            description={searchQuery ? "جرب كلمات بحث مختلفة" : "لم نجد مطاعم بهذه الفلاتر"}
            actionLabel={activeFiltersCount > 0 ? "مسح الفلاتر" : undefined}
            onAction={activeFiltersCount > 0 ? clearAllFilters : undefined}
          />
        )}

        {isFetchingMore && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {Array.from({ length: 3 }).map((_, i) => <RestaurantCardSkeleton key={i} />)}
          </div>
        )}
        <div ref={infiniteScrollRef} className="h-1" /> {/* Intersection observer target */}
      </main>

    
      {showPicker && (
        <LocationCustomer
          lat={lat || 30.0444} 
          lng={lng || 31.2357} 
          onLocationChange={handleLocationChange}
          onClose={() => setShowPicker(false)}
        />
      )}
      </div>
    </ProtectedRoute>
  );
}
