"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import api from "../../axios";
import { Header } from "./componentForExplore/Header";
import { SearchBar } from "./componentForExplore/SearchBar";
import { FilterChips } from "./componentForExplore/FilterChips";
import { RestaurantCard as RestaurantCardComponent } from "./componentForExplore/RestaurantCard";
import { BottomNavigation } from "./componentForExplore/BottomNavigation";
import { LoadingSkeleton } from "./componentForExplore/LoadingSkeleton";
import { EmptyState } from "./componentForExplore/EmptyState";
import axios from "axios";

const LocationCustomer = dynamic(() => import("./LocationCustomer"), { ssr: false });

interface Restaurant {
  id: number;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  can_deliver: boolean;
  can_reserve: boolean;
  distance?: number;
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
  const [nearbyOnly, setNearbyOnly] = useState(false);
  const [deliveryOnly, setDeliveryOnly] = useState(false);
  const [bookingOnly, setBookingOnly] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [city, setCity] = useState<string | null>(null);

  const fetchAllRestaurants = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/restaurant/all");
      const restaurants = res.data.restaurants || [];
      setAllRestaurants(restaurants);
      
      restaurants.forEach((restaurant: Restaurant) => {
        fetchRestaurantDishes(restaurant.id);
      });
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchRestaurantDishes = async (restaurantId: number) => {
    try {
      const res = await api.post(`/restaurant/all-dishes-for-restaurantE`,  {restaurantId:restaurantId} );
      setRestaurantDishes(prev => ({
        ...prev,
        [restaurantId]: res.data.dishes || []
      }));
    } catch (error) {
      console.error(`Error fetching dishes for restaurant ${restaurantId}:`, error);
    }
  };

  const fetchNearbyRestaurants = useCallback(async (latitude: number, longitude: number) => {
    try {
      const res = await api.post("/customer/nearest-restaurants", { 
        lng: longitude,
        lat: latitude
      });
      
      if (res.data.nearby_restaurants && res.data.nearby_restaurants.length > 0) {
        const nearbyIds = new Set(
          res.data.nearby_restaurants.map((r: NearbyRestaurant) => r.restaurant_id || r.id)
        );
        setNearbyRestaurantIds(nearbyIds);
        setNearbyOnly(true);
      } else {
        setNearbyRestaurantIds(new Set());
        setNearbyOnly(false);
      }
    } catch (error) {
      console.error("Error fetching nearby restaurants:", error);
      setNearbyRestaurantIds(new Set());
      setNearbyOnly(false);
    }
  }, []);

  const getNameLocationOfCus = async (latitude: number, longitude: number) => {
    try {
      const res = await axios.get("https://nominatim.openstreetmap.org/reverse", {
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
      console.error("Error fetching location name:", err);
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

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(restaurant =>
        restaurant.name.toLowerCase().includes(query)
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
  }, [searchQuery, nearbyOnly, deliveryOnly, bookingOnly, allRestaurants, nearbyRestaurantIds]);

  const clearAllFilters = useCallback(() => {
    setSearchQuery("");
    setNearbyOnly(false);
    setDeliveryOnly(false);
    setBookingOnly(false);
    setNearbyRestaurantIds(new Set());
  }, []);

  useEffect(() => {
    fetchAllRestaurants();
  }, [fetchAllRestaurants]);

  const activeFiltersCount = useMemo(() => 
    [nearbyOnly, deliveryOnly, bookingOnly].filter(Boolean).length,
    [nearbyOnly, deliveryOnly, bookingOnly]
  );

  return (
    <div className="min-h-screen mb-12 bg-[#F9FAFB]" dir="rtl">
      <Header city={city} />
      <div className="h-[30px]" />

      <main className="pt-20 pb-24">
        <SearchBar 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onFiltersToggle={() => setShowPicker(true)}
          showFiltersIndicator={activeFiltersCount > 0}
        />
        <div className="h-[10px]" />

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
        <div className="h-[30px]" />

        <div className="px-4 pt-4">
          {isLoading ? (
            <LoadingSkeleton />
          ) : filteredRestaurants.length > 0 ? (
            <div className="space-y-8">
              {filteredRestaurants.map((restaurant) => (
                <RestaurantCardComponent
                  key={restaurant.id}
                  {...restaurant}
                  dishes={restaurantDishes[restaurant.id] || []}
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
        </div>
      </main>
      
      <div className="h-[30px]" />
      <BottomNavigation />

      {showPicker && (
        <LocationCustomer
          lat={lat || 30.0444}
          lng={lng || 31.2357}
          onLocationChange={handleLocationChange}
          onClose={() => setShowPicker(false)}
        />
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}