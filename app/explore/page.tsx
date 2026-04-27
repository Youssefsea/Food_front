"use client";

import { Suspense, useEffect, useState, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import api from "../../axios";
import { Header } from "./componentForExplore/Header";
import { SearchBar } from "./componentForExplore/SearchBar";
import { FilterChips } from "./componentForExplore/FilterChips";
import { RestaurantCard as RestaurantCardComponent } from "./componentForExplore/RestaurantCard";

import { LoadingSkeleton } from "./componentForExplore/LoadingSkeleton";
import { EmptyState } from "./componentForExplore/EmptyState";
import axios from "axios";
import { ErrorBoundary } from "../components/ErrorBoundary";

const LocationCustomer = dynamic(() => import("./LocationCustomer"), { ssr: false });

interface Restaurant {
  id: number;
  restaurant_name: string;
  location: string;
  latitude: number;
  longitude: number;
  can_deliver: boolean;
  can_reserve: boolean;
  delivery_fees: number;
  isNearby?: boolean;
  dishes?: Dish[];
}

interface Dish {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface NearbyRestaurant {
  restaurant_id?: number;
  id: number;
}

export default function ExplorePage() {
  const [showPicker, setShowPicker] = useState(false);
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>([]);
  const [nearbyRestaurantIds, setNearbyRestaurantIds] = useState<Set<number>>(new Set());
  const [restaurantDishes, setRestaurantDishes] = useState<{ [key: number]: Dish[] }>({});
  
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [nearbyOnly, setNearbyOnly] = useState(false);
  const [deliveryOnly, setDeliveryOnly] = useState(false);
  const [bookingOnly, setBookingOnly] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [city, setCity] = useState<string | null>(null);

  const fetchAllRestaurants = useCallback(async (signal?: AbortSignal) => {
    try {
      setIsLoading(true);
      const res = await api.get("/restaurant/all", { signal });
      const restaurants = res.data.restaurants || [];
      setAllRestaurants(restaurants);
      
    
      restaurants.forEach((restaurant: Restaurant) => {
        fetchRestaurantDishes(restaurant.id, signal);
      });
    } catch (error: unknown) {
      if (axios.isCancel(error)) return;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchRestaurantDishes = async (restaurantId: number, signal?: AbortSignal) => {
    try {
      const res = await api.post(`/restaurant/all-dishes-for-restaurantE`, { restaurantId }, { signal });
      setRestaurantDishes(prev => ({
        ...prev,
        [restaurantId]: res.data.dishes || []
      }));
    } catch (error: unknown) {
      if (axios.isCancel(error)) return;
    }
  };

  const fetchNearbyRestaurants = useCallback(async (latitude: number, longitude: number, signal?: AbortSignal) => {
    try {
      const res = await api.post("/customer/nearest-restaurants", { 
        lng: longitude,
        lat: latitude
      }, { signal });
      
      if (res.data.nearby_restaurants && res.data.nearby_restaurants.length > 0) {
        const nearbyIds = new Set<number>(
          res.data.nearby_restaurants.map((r: NearbyRestaurant) => r.restaurant_id || r.id)
        );
        setNearbyRestaurantIds(nearbyIds);
        setNearbyOnly(true);
      } else {
        setNearbyRestaurantIds(new Set<number>());
        setNearbyOnly(false);
      }
    } catch (error: unknown) {
      if (axios.isCancel(error)) return;
      setNearbyRestaurantIds(new Set<number>());
      setNearbyOnly(false);
    }
  }, []);

  const getNameLocationOfCus = async (latitude: number, longitude: number) => {
    try {
      const controller = new AbortController();
      const res = await axios.get("https://nominatim.openstreetmap.org/reverse", {
        signal: controller.signal,
        params: {
          lat: latitude,
          lon: longitude,
          format: "json",
          accept_language: "ar"
        }
      });

      const city = res.data?.address?.city || res.data?.address?.town || null;
      return city;
    } catch (err) {
      return null;
    }
  };

  const handleGetCurrentLocation = useCallback(() => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLat(latitude);
          setLng(longitude);
          
          const [locationName] = await Promise.all([
            getNameLocationOfCus(latitude, longitude),
            fetchNearbyRestaurants(latitude, longitude)
          ]);
          
          setCity(locationName);
          setIsLocating(false);
        },
        () => {
          setIsLocating(false);
        }
      );
    } else {
      setIsLocating(false);
    }
  }, [fetchNearbyRestaurants]);

  const handleLocationChange = useCallback(async (newLat: number, newLng: number) => {
    setLat(newLat);
    setLng(newLng);
    
    const [locationName] = await Promise.all([
      getNameLocationOfCus(newLat, newLng),
      fetchNearbyRestaurants(newLat, newLng)
    ]);
    
    setCity(locationName);
    setShowPicker(false);
  }, [fetchNearbyRestaurants]);
  const filteredRestaurants = useMemo(() => {
    let filtered = [...allRestaurants];

    if (debouncedSearchQuery) {
      const query = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter(restaurant =>
        restaurant.restaurant_name?.toLowerCase().includes(query)
      );
    }

    if (nearbyOnly) {
      filtered = filtered.filter(restaurant => nearbyRestaurantIds.has(restaurant.id));
    }

    if (deliveryOnly) {
      filtered = filtered.filter(restaurant => restaurant.can_deliver);
    }

    if (bookingOnly) {
      filtered = filtered.filter(restaurant => restaurant.can_reserve);
    }

    return filtered;
  }, [debouncedSearchQuery, nearbyOnly, deliveryOnly, bookingOnly, allRestaurants, nearbyRestaurantIds]);

  const clearAllFilters = useCallback(() => {
    setSearchQuery("");
    setNearbyOnly(false);
    setDeliveryOnly(false);
    setBookingOnly(false);
    setNearbyRestaurantIds(new Set<number>());
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchAllRestaurants(controller.signal);
    return () => controller.abort();
  }, [fetchAllRestaurants]);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearchQuery(searchQuery), 300);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const activeFiltersCount = useMemo(() => 
    [nearbyOnly, deliveryOnly, bookingOnly].filter(Boolean).length,
    [nearbyOnly, deliveryOnly, bookingOnly]
  );
  return (
    <div className="min-h-screen bg-[#FAFAFA]" dir="rtl">
      <div className="h-1"/>
      <Header city={city} />

<div className="h-7.5"/>
      <section className="relative bg-gradient-to-br from-[#E5A04D] via-[#F97316] to-[#EF4444] pt-14 sm:pt-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-8 text-4xl sm:text-5xl rotate-12">🍕</div>
          <div className="absolute bottom-8 left-12 text-3xl sm:text-4xl -rotate-12">🍔</div>
          <div className="absolute top-12 left-1/3 text-2xl sm:text-3xl rotate-6">🌮</div>
        </div>

        <div className="relative px-4 sm:px-5 md:px-6 py-6 sm:py-8">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 mb-3">
            <span className="text-lg sm:text-xl animate-bounce">👋</span>
            <p className="text-xs sm:text-sm text-white font-medium tracking-wide">
              أهلاً وسهلاً!
            </p>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-2 leading-tight">
            <span className="block">نفسك في إيه</span>
            <span className="block bg-gradient-to-r from-white via-yellow-100 to-white bg-clip-text text-transparent drop-shadow-lg">
              النهـاردة؟ 🍽️
            </span>
          </h1>

          <p className="text-sm sm:text-base text-white/80 font-light">
            اكتشف ألذ الأكلات حواليك
          </p>
        </div>

        <svg className="absolute bottom-0 left-0 right-0 h-4 sm:h-6" viewBox="0 0 1440 24" fill="none" preserveAspectRatio="none">
          <path d="M0 24h1440V12c-120 8-240 12-360 12s-240-4-360-12c-120-8-240-12-360-12S120 4 0 12v12z" fill="#FAFAFA"/>
        </svg>
      </section>
<div className="h-4"/>

      <div className="px-4 sm:px-5 md:px-6 -mt-3 mb-2">
        <div className="flex gap-4">
          <button
            onClick={handleGetCurrentLocation}
            disabled={isLocating}
            className="flex items-center gap-1.5 bg-white shadow-md rounded-full px-3 py-2 text-xs font-medium text-[#1A1A1A] hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-60"
          >
            <div className="w-5 h-5 rounded-full bg-[#E5A04D]/10 flex items-center justify-center">
              <svg className="w-3 h-3 text-[#E5A04D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="3" strokeWidth={2} />
                <path strokeWidth={2} d="M12 2v3m0 14v3M2 12h3m14 0h3" />
              </svg>
            </div>
            <span>موقعي</span>
          </button>

          <button
            onClick={() => setShowPicker(true)}
            className="flex items-center gap-1.5 bg-white shadow-md rounded-full px-3 py-2 text-xs font-medium text-[#1A1A1A] hover:shadow-lg transition-all active:scale-[0.98]"
          >
            <div className="w-5 h-5 rounded-full bg-[#10B981]/10 flex items-center justify-center">
              <svg className="w-3 h-3 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <span>الخريطة</span>
          </button>

          {city && (
            <div className="flex items-center gap-1.5 bg-[#D1FAE5] rounded-full px-3 py-2 text-xs font-medium text-[#10B981]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
              <span className="truncate max-w-[100px]">{city}</span>
            </div>
          )}
        </div>
      </div>

      <div className="h-4 sm:h-5" />

      <SearchBar 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onFiltersToggle={() => setShowPicker(true)}
        showFiltersIndicator={activeFiltersCount > 0}
      />
<div className="h-2"/>


      <div className="sticky top-[52px] sm:top-[56px] md:top-[60px] z-40">
        <FilterChips 
          nearbyOnly={nearbyOnly}
          deliveryOnly={deliveryOnly}
          bookingOnly={bookingOnly}
          onNearbyToggle={() => setNearbyOnly(!nearbyOnly)}
          onDeliveryToggle={() => setDeliveryOnly(!deliveryOnly)}
          onBookingToggle={() => setBookingOnly(!bookingOnly)}
          onLocationClick={handleGetCurrentLocation}
          isLocating={isLocating}
        />
      </div>
<div className="h-2"/>


      <main className="py-4 sm:py-5 md:py-6 pb-24 sm:pb-10 page-shell">
        <div>
          <div className="mb-4 sm:mb-5">
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-[#1A1A1A] flex items-center gap-1.5 sm:gap-2 mb-1">
              <span className="text-lg sm:text-xl">📍</span>
              {nearbyOnly ? 'مطاعم قريبة منك' : 'جميع المطاعم'}
            </h2>
            <p className="text-[10px] sm:text-xs md:text-[13px] text-[#6B7280]">
              {nearbyOnly ? 'بناءً على موقعك الحالي' : 'تصفح جميع المطاعم المتاحة'}
            </p>
          </div>
<div className="h-2"/>


          <ErrorBoundary>
            {isLoading ? (
              <LoadingSkeleton />
            ) : filteredRestaurants.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 sm:gap-4">
                {filteredRestaurants.map((restaurant) => (
                  <RestaurantCardComponent
                    key={restaurant.id}
                    {...restaurant}
                    dishes={restaurantDishes[restaurant.id] || []}
                    isNearby={nearbyRestaurantIds.has(restaurant.id)}
                    delivery_fees={restaurant.delivery_fees}
                  />
                ))}
              </div>
            ) : (
              <EmptyState 
                message="لا توجد مطاعم"
                onClearFilters={clearAllFilters}
                hasActiveFilters={activeFiltersCount > 0}
              />
            )}
          </ErrorBoundary>
        </div>
      </main>
<div className="h-10"/>




      {showPicker && (
        <Suspense fallback={<LoadingSkeleton />}>
          <LocationCustomer
            lat={lat || 30.0444}
            lng={lng || 31.2357}
            onLocationChange={handleLocationChange}
            onClose={() => setShowPicker(false)}
          />
        </Suspense>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&display=swap');
        
        * {
          -webkit-tap-highlight-color: transparent;
        }
        
        body {
          font-family: 'Cairo', sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
        }

        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }

        * {
          -webkit-overflow-scrolling: touch;
        }

        button:active,
        a:active {
          opacity: 0.7;
        }

        button,
        .no-select {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }

        @supports (-webkit-touch-callout: none) {
          .min-h-screen {
            min-height: -webkit-fill-available;
          }
        }

        @media (max-width: 375px) {
          html {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
}
