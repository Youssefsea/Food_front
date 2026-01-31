'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { MapPin, ChevronLeft, ChevronRight, Star, Clock, Bike, Calendar } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface Meal {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface RestaurantCardProps {
  id: number;
  restaurant_name: string;
  location: string;
  latitude?: number;
  longitude?: number;
  can_deliver: boolean;
  can_reserve: boolean;
  distance?: number;
  isNearby?: boolean;
  dishes?: Meal[];
  description?: string;
  rating?: number;
}

export function RestaurantCard({
  id,
  restaurant_name,
  location,
  can_deliver,
  can_reserve,
  isNearby,
  dishes = [],
  description,
  rating = 4.5,
}: RestaurantCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const displayDishes = useMemo(() => dishes.slice(0, 3), [dishes]);

  useEffect(() => {
    if (displayDishes.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % displayDishes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [displayDishes.length]);

  const nextImage = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % displayDishes.length);
  }, [displayDishes.length]);

  const prevImage = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + displayDishes.length) % displayDishes.length);
  }, [displayDishes.length]);

  const status = can_deliver || can_reserve ? 'available' : 'not-available';

  return (
    <motion.div 
      className="mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Link href={`/restaurant/${id}`}>
        <div className="group bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 border border-gray-100">
          {/* Restaurant Image Carousel */}
          <div className="relative h-56 overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50">
            <AnimatePresence initial={false}>
              {displayDishes.length > 0 ? (
                <motion.img
                  key={displayDishes[currentImageIndex].id}
                  src={
                    displayDishes[currentImageIndex]?.image
                      ?.split(",")[0]
                      ?.trim() || "/placeholder-dish.jpg"
                  }
                  alt={displayDishes[currentImageIndex]?.name || name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                />
              ) : (
                <motion.div
                  className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-100 via-orange-100 to-red-100"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="text-center">
                    <MapPin className="w-16 h-16 text-orange-300 mx-auto mb-2" />
                    <p className="text-orange-400 font-medium">{name}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Navigation Arrows */}
            {displayDishes.length > 1 && (
              <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={prevImage}
                  className="w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl hover:bg-white transition-all hover:scale-110 active:scale-95"
                  aria-label="الصورة السابقة"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-800" />
                </button>
                <button
                  onClick={nextImage}
                  className="w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl hover:bg-white transition-all hover:scale-110 active:scale-95"
                  aria-label="الصورة التالية"
                >
                  <ChevronRight className="w-5 h-5 text-gray-800" />
                </button>
              </div>
            )}

            {/* Dots Indicator */}
            {displayDishes.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/30 backdrop-blur-md px-3 py-2 rounded-full">
                {displayDishes.map((_, index) => (
                  <div
                    key={index}
                    className={`rounded-full transition-all duration-300 ${
                      index === currentImageIndex
                        ? "bg-white w-6 h-2"
                        : "bg-white/60 w-2 h-2"
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Status Badge */}
            <div
              className={`absolute top-4 left-4 px-6 py-2 rounded-3xl text-white text-sm font-bold shadow-lg backdrop-blur-md ${
                status === 'available' 
                  ? 'bg-gradient-to-r from-emerald-500 to-green-500' 
                  : 'bg-gradient-to-r from-amber-500 to-orange-500'
              }`}
            >
              {status === 'available' ? '🟢 متاح الآن' : '🟠 غير متاح'}
            </div>

            {/* Nearby Badge */}
            {isNearby && (
              <div className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 backdrop-blur-md">
                <MapPin className="w-4 h-4" />
                قريب منك
              </div>
            )}

            {/* Rating Badge */}
            {/* <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-bold text-gray-800">{rating}</span>
            </div> */}
          </div>

          {/* Restaurant Info */}
          <div className="p-6">
            {/* Restaurant Name & Description */}
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors duration-300">
                {restaurant_name}
              </h3>
              {description && (
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-3">
                  {description}
                </p>
              )}
              <div className="flex items-start gap-2 text-gray-500">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-orange-500" />
                <span className="text-sm line-clamp-1">{location}</span>
              </div>
            </div>

            {/* Service Features */}
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  can_deliver
                    ? "bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border border-green-200"
                    : "bg-gray-100 text-gray-500 border border-gray-200"
                }`}
              >
                <Bike className="w-4 h-4" />
                <span>{can_deliver ? "توصيل متاح" : "لا يوجد توصيل"}</span>
              </div>

              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  can_reserve
                    ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200"
                    : "bg-gray-100 text-gray-500 border border-gray-200"
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>{can_reserve ? "حجز متاح" : "لا يوجد حجز"}</span>
              </div>

              <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-amber-50 text-amber-700 border border-amber-200">
                <Clock className="w-4 h-4" />
                <span>مفتوح الآن</span>
              </div>
            </div>

            {/* Meal Previews */}
            {displayDishes.length > 0 && (
              <div className="border-t border-gray-200 pt-4 mt-4">
                <p className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="w-1 h-4 bg-gradient-to-b from-orange-500 to-red-500 rounded-full"></span>
                  وجبات مميزة
                </p>
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                  {displayDishes.map((meal, index) => (
                    <motion.div 
                      key={meal.id} 
                      className="flex-shrink-0 w-28"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="relative h-24 rounded-xl overflow-hidden mb-2 shadow-md group/meal">
                        <img
                          src={meal.image?.split(",")[0]?.trim()}
                          alt={meal.name}
                          className="w-full h-full object-cover group-hover/meal:scale-110 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover/meal:opacity-100 transition-opacity duration-300" />
                      </div>
                      <p className="text-xs font-medium text-gray-800 truncate text-right mb-1">
                        {meal.name}
                      </p>
                      <p className="text-sm font-bold text-orange-600">{meal.price} جنيه</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
<div className="h-[10px]" />
            {/* View Restaurant Button */}
            <div className="mt-5   pt-4 border-t border-gray-200">
              <button className="w-full bg-gradient-to-r bg-orange-400 hover:bg-orange-300 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl">
                عرض المطعم والقائمة
              </button>
              <div className="h-[10px]" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}