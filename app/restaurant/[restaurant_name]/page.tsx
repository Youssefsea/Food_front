'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '../../../axios';
import { 
  RestaurantHeader, 
  CategoryTabs, 
  MenuSearchBar, 
  DishCard, 
  DishDetailModal, 
  FloatingCartBar 
} from './components';
import { Restaurant, Dish } from './types';

export default function RestaurantPage() {
  const params = useParams();
  const router = useRouter();
  const restaurantName = decodeURIComponent(params.restaurant_name as string);

  // States
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [coverImage, setCoverImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeCategory, setActiveCategory] = useState('الكل');
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cart, setCart] = useState<Record<number, number>>({});
  const [searchQuery, setSearchQuery] = useState('');

  const categoryRefs = useRef<Record<string, HTMLElement | null>>({});

  // Fetch restaurant data
  const fetchRestaurant = useCallback(async () => {
    try {
      const res = await api.get('/restaurant/search-by-name', {
        params: {
          name: restaurantName
        }
      });
      
      const restaurantData = res.data.restaurant;
      
      if (restaurantData) {
        setRestaurant(restaurantData);
        return restaurantData;
      } else {
        setError('المطعم غير موجود');
        return null;
      }    } catch (err) {
      console.error('Error fetching restaurant:', err);
      const axiosError = err as { response?: { status?: number } };
      if (axiosError.response?.status === 404) {
        setError('المطعم غير موجود');
      } else {
        setError('حدث خطأ في تحميل بيانات المطعم');
      }
      return null;
    }
  }, [restaurantName]);

  // Fetch dishes for restaurant
  const fetchDishes = useCallback(async (restaurantId: number) => {
    try {
      const res = await api.post('/restaurant/all-dishes-for-restaurantE', { 
        restaurantId 
      });
      const dishesData: Dish[] = res.data.dishes || [];
      
      // Mark popular dishes (top 3 by some criteria - could be order count)
      const processedDishes = dishesData.map((dish, index) => ({
        ...dish,
        isPopular: index < 3, // First 3 dishes are marked as popular
      }));

      setDishes(processedDishes);

      // Get cover image from first dish with image
      if (processedDishes.length > 0) {
        const firstImage = processedDishes[0]?.image?.split(',')[0]?.trim();
        if (firstImage) {
          setCoverImage(firstImage);
        }
      }
    } catch (err) {
      console.error('Error fetching dishes:', err);
    }
  }, []);
  // Fetch cart data
  const fetchCart = useCallback(async () => {
    try {
      const res = await api.get('/customer/view-cart');
      const cartItems = res.data.cartItems || [];
      
      // Convert to our format
      const cartMap: Record<number, number> = {};
      cartItems.forEach((item: { dishId: number; quantity: number }) => {
        cartMap[item.dishId] = item.quantity;
      });
      setCart(cartMap);
    } catch (err) {
      // Cart might be empty or user not logged in
      console.log('Cart fetch info:', err);
    }
  }, []);

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const restaurantData = await fetchRestaurant();
      if (restaurantData) {
        await fetchDishes(restaurantData.id);
        await fetchCart();
      }
      setIsLoading(false);
    };

    loadData();
  }, [fetchRestaurant, fetchDishes, fetchCart]);

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(dishes.map(d => d.category).filter(Boolean))];
    return ['الكل', ...uniqueCategories];
  }, [dishes]);

  // Filter dishes by search and category
  const filteredDishes = useMemo(() => {
    return dishes.filter(dish => {
      const matchesSearch = searchQuery === '' ||
        dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dish.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'الكل' || dish.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [dishes, searchQuery, activeCategory]);

  // Group dishes by category
  const dishesByCategory = useMemo(() => {
    return categories.reduce((acc, category) => {
      if (category === 'الكل') return acc;
      acc[category] = filteredDishes.filter(d => d.category === category);
      return acc;
    }, {} as Record<string, Dish[]>);
  }, [categories, filteredDishes]);

  // Dish counts per category
  const dishCounts = useMemo(() => {
    return categories.reduce((acc, category) => {
      if (category === 'الكل') return acc;
      acc[category] = dishes.filter(d => d.category === category).length;
      return acc;
    }, {} as Record<string, number>);
  }, [categories, dishes]);

  // Calculate cart totals
  const cartItemCount = useMemo(() => 
    Object.values(cart).reduce((sum, qty) => sum + qty, 0),
    [cart]
  );

  const cartTotal = useMemo(() => 
    Object.entries(cart).reduce((sum, [dishId, qty]) => {
      const dish = dishes.find(d => d.id === Number(dishId));
      return sum + (dish?.price || 0) * qty;
    }, 0),
    [cart, dishes]
  );
  // Handle add/update/remove from cart
  const handleAddToCart = async (dishId: number, quantity: number, notes?: string) => {
    const currentQuantity = cart[dishId] || 0;
    
    try {
      if (quantity === 0) {
        // Remove from cart
        await api.delete('/customer/remove-dish-from-cart', {
          data: { dishId }
        });
        
        setCart(prev => {
          const newCart = { ...prev };
          delete newCart[dishId];
          return newCart;
        });
      } else if (currentQuantity === 0) {
        // Add new item to cart
        await api.post('/customer/add-dish-to-cart', {
          dishId,
          quantity,
          notes
        });
        
        setCart(prev => ({
          ...prev,
          [dishId]: quantity,
        }));
      } else {
        // Update existing item quantity
        await api.put('/customer/update-dish-quantity-in-cart', {
          dishId,
          quantity
        });
        
        setCart(prev => ({
          ...prev,
          [dishId]: quantity,
        }));
      }
    } catch (err) {
      console.error('Error updating cart:', err);
      // Still update local state for better UX
      if (quantity === 0) {
        setCart(prev => {
          const newCart = { ...prev };
          delete newCart[dishId];
          return newCart;
        });
      } else {
        setCart(prev => ({
          ...prev,
          [dishId]: quantity,
        }));
      }
    }
  };

  const handleDishClick = (dish: Dish) => {
    setSelectedDish(dish);
    setIsModalOpen(true);
  };

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    if (category !== 'الكل') {
      const element = categoryRefs.current[category];
      if (element) {
        const offset = 160; // Header + tabs height
        const top = element.offsetTop - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  };

  const handleViewCart = () => {
    router.push('/cart');
  };


  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#E5A04D] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#6B7280]">جاري تحميل المطعم...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !restaurant) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center" dir="rtl">
        <div className="text-center px-4">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-xl font-bold text-[#1A1A1A] mb-2">
            {error || 'المطعم غير موجود'}
          </h2>
          <p className="text-sm text-[#6B7280] mb-4">
            عذراً، لم نتمكن من العثور على هذا المطعم
          </p>
          <button
            onClick={() => router.push('/explore')}
            className="px-6 py-2.5 bg-[#E5A04D] text-white rounded-xl font-medium hover:bg-[#D4903D] transition-colors"
          >
            العودة للمطاعم
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]" dir="rtl">
      {/* Restaurant Header */}
      <div className="h-2"/>

      <RestaurantHeader 
        restaurant={restaurant} 
        coverImage={coverImage}
      />
    

      <div className="h-4"/>

      {/* Category Tabs - Sticky */}
      <CategoryTabs
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryClick}
        dishCounts={dishCounts}
      />
      <div className="h-3"/>

      {/* Search Bar */}
      <MenuSearchBar
        value={searchQuery}
        onChange={setSearchQuery}
      />

      <div className="h-4"/>

      {/* Menu / Dishes List */}
      <div className="px-3 sm:px-4 md:px-5 lg:px-6 py-4 sm:py-5 md:py-6 pb-28 sm:pb-32">
        {activeCategory === 'الكل' ? (
          // Show all categories
          Object.entries(dishesByCategory).map(([category, categoryDishes]) => {
            if (categoryDishes.length === 0) return null;
            return (
              <div
                key={category}
                ref={(el) => { categoryRefs.current[category] = el; }}
                className="mb-6 sm:mb-8"
              >
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h2 className="text-base sm:text-lg md:text-xl font-semibold text-[#1A1A1A] flex items-center gap-1.5 sm:gap-2">
                    <span>🍕</span>
                    <span>{category}</span>
                  </h2>
                  <span className="text-xs sm:text-sm md:text-base text-[#9CA3AF]">
                    ({categoryDishes.length} {categoryDishes.length === 1 ? 'صنف' : 'أصناف'})
                  </span>
                </div>

                {categoryDishes.map((dish) => (
                  <DishCard
                    key={dish.id}
                    dish={dish}
                    onAddToCart={handleAddToCart}
                    onClick={handleDishClick}
                    cartQuantity={cart[dish.id] || 0}
                  />
                ))}
              </div>
            );
          })
        ) : (
          // Show selected category only
          <div>
            {filteredDishes.length > 0 ? (
              filteredDishes.map((dish) => (
                <DishCard
                  key={dish.id}
                  dish={dish}
                  onAddToCart={handleAddToCart}
                  onClick={handleDishClick}
                  cartQuantity={cart[dish.id] || 0}
                />
              ))
            ) : (
              <div className="text-center py-12 sm:py-16">
                <div className="text-5xl sm:text-6xl mb-4">🔍</div>
                <h3 className="text-base sm:text-lg font-semibold text-[#1A1A1A] mb-2">
                  لم نجد نتائج
                </h3>
                <p className="text-xs sm:text-sm text-[#9CA3AF]">جرب كلمات بحث مختلفة</p>
              </div>
            )}
          </div>
        )}

        {/* Empty state when no dishes */}
        {dishes.length === 0 && !isLoading && (
          <div className="text-center py-12 sm:py-16">
            <div className="text-5xl sm:text-6xl mb-4">🍽️</div>
            <h3 className="text-base sm:text-lg font-semibold text-[#1A1A1A] mb-2">
              لا توجد أطباق
            </h3>
            <p className="text-xs sm:text-sm text-[#9CA3AF]">هذا المطعم لم يضف أطباق بعد</p>
          </div>
        )}
      </div>

      {/* Dish Detail Modal */}
      <DishDetailModal
        dish={selectedDish}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToCart={handleAddToCart}
        initialQuantity={selectedDish ? cart[selectedDish.id] || 1 : 1}
      />

      {/* Floating Cart Bar */}
      <FloatingCartBar
        itemCount={cartItemCount}
        totalPrice={cartTotal}
        onViewCart={handleViewCart}
      />

      {/* Global Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&display=swap');
        
        * {
          -webkit-tap-highlight-color: transparent;
          -webkit-touch-callout: none;
        }
        
        html {
          -webkit-text-size-adjust: 100%;
          -ms-text-size-adjust: 100%;
        }
        
        body {
          font-family: 'Cairo', sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          overscroll-behavior-y: none;
        }

        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Safe area for notched devices */
        @supports (padding: env(safe-area-inset-top)) {
          .pt-safe {
            padding-top: env(safe-area-inset-top);
          }
          .pb-safe {
            padding-bottom: env(safe-area-inset-bottom);
          }
        }

        /* Prevent zoom on input focus (iOS) */
        @media screen and (max-width: 767px) {
          input[type="text"],
          input[type="search"],
          textarea,
          select {
            font-size: 16px !important;
          }
        }

        /* Smooth transitions */
        button, a, input {
          transition: all 0.2s ease;
        }
        
        /* Button click effect */
        button:active {
          transform: scale(0.98);
        }
      `}</style>
    </div>
  );
}
