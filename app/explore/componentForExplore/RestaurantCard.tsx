'use client';

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  memo,
} from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import api, { isTimeoutError } from '@/lib/api';
import { cn, getFirstImage, parseDishImages, formatCurrency } from '@/lib/utils';
import { Badge, Modal, EmptyState } from '@/components/ui';
import { DishCardSkeleton } from '@/components/ui/Skeleton';
import { useCart } from '@/app/context/CartContext';
import { FloatingCartBar } from '@/app/restaurant/[restaurant_name]/components/FloatingCartBar';
import {
  ChevronRight,
  Search,
  Plus,
  Minus,
  ShoppingCart,
  Clock,
  MapPin,
  Truck,
  X,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Restaurant {
  id: number;
  name?: string;
  restaurant_name?: string;
  description?: string;
  location?: string;
  is_open?: boolean | number;
  open_time?: string;
  close_time?: string;
  can_deliver?: boolean;
  can_reserve?: boolean;
  delivery_fees?: number;
}

interface Dish {
  id: number;
  name: string;
  description?: string;
  price: number;
  image?: string;
  category?: string;
  is_available?: boolean;
  preparation_time?: number;
  isPopular?: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isAbortError(err: unknown): boolean {
  if (err instanceof Error) {
    return err.name === 'AbortError' || err.name === 'CanceledError';
  }
  return false;
}

// ─── DishCard ─────────────────────────────────────────────────────────────────

const DishCard = memo(function DishCard({
  dish,
  cartQuantity,
  onAdd,
  onClick,
  isRestaurantOpen,
}: {
  dish: Dish;
  cartQuantity: number;
  onAdd: (dishId: number, qty: number) => void;
  onClick: () => void;
  isRestaurantOpen: boolean;
}) {
  const image = getFirstImage(dish.image);
  const isUnavailable = dish.is_available === false;
  const canOrder = isRestaurantOpen && !isUnavailable;

  const handleAdd = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation(); // ← مهم: يمنع فتح الـ modal عند الضغط على الأزرار
      if (canOrder) onAdd(dish.id, cartQuantity + 1);
    },
    [canOrder, onAdd, dish.id, cartQuantity],
  );

  const handleRemove = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (canOrder) onAdd(dish.id, Math.max(0, cartQuantity - 1));
    },
    [canOrder, onAdd, dish.id, cartQuantity],
  );

  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-gray-100 flex gap-3 p-3 sm:p-4 cursor-pointer hover:shadow-md transition-all duration-200',
        !canOrder && 'opacity-50',
      )}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      aria-label={`عرض تفاصيل ${dish.name}`}
    >
      {/* Image */}
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-[#FFF8F0] flex-shrink-0">
        {image ? (
          <Image
            src={image}
            alt={dish.name}
            fill
            className="object-cover"
            sizes="96px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl opacity-30">
            🍽️
          </div>
        )}
        {dish.isPopular && (
          <div className="absolute top-1 right-1 px-1.5 py-0.5 bg-[#FF6B35] text-white text-[8px] font-bold rounded-md">
            شائع 🔥
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-bold text-[#1A1A2E] mb-0.5 line-clamp-1">
            {dish.name}
          </h3>
          {dish.description && (
            <p className="text-[11px] text-[#9CA3AF] line-clamp-2 mb-1.5 leading-relaxed">
              {dish.description}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-sm font-bold text-[#FF6B35]">
              {formatCurrency(dish.price)}
            </span>
            {dish.preparation_time && (
              <span className="text-[10px] text-[#C4C4C4] flex items-center gap-0.5">
                <Clock className="w-3 h-3" />
                {dish.preparation_time} د
              </span>
            )}
          </div>

          {canOrder && (
            // stopPropagation on the wrapper too — belt & suspenders
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center"
            >
              {cartQuantity > 0 ? (
                <div className="flex items-center gap-1.5 bg-[#FFF8F0] rounded-lg px-1">
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-[#FF6B35] hover:bg-[#FFE0CC] transition-colors"
                    aria-label="إنقاص الكمية"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-sm font-bold text-[#1A1A2E] min-w-[16px] text-center">
                    {cartQuantity}
                  </span>
                  <button
                    type="button"
                    onClick={handleAdd}
                    className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#FF6B35] text-white hover:bg-[#E63946] transition-colors"
                    aria-label="زيادة الكمية"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleAdd}
                  className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#E63946] text-white flex items-center justify-center shadow-md shadow-orange-500/20 hover:shadow-lg hover:scale-105 transition-all"
                  aria-label={`أضف ${dish.name} للسلة`}
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

// ─── Dish Detail Modal ────────────────────────────────────────────────────────

function DishDetailModal({
  dish,
  isOpen,
  onClose,
  onAdd,
  initialQty,
  isRestaurantOpen,
}: {
  dish: Dish | null;
  isOpen: boolean;
  onClose: () => void;
  onAdd: (dishId: number, qty: number) => void;
  initialQty: number;
  isRestaurantOpen: boolean;
}) {
  const [quantity, setQuantity] = useState(Math.max(1, initialQty));
  const images = dish ? parseDishImages(dish.image) : [];
  const canOrder = !!dish && isRestaurantOpen && dish.is_available !== false;

  // Lock body scroll while modal open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!dish) return null;

  const handleConfirm = () => {
    if (!canOrder) return;
    onAdd(dish.id, quantity);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      {images.length > 0 && (
        <div className="relative h-48 sm:h-56 -mx-5 -mt-5 mb-4 rounded-t-[20px] overflow-hidden bg-[#FFF8F0]">
          <Image
            src={images[0]}
            alt={dish.name}
            fill
            className="object-cover"
            sizes="100vw"
          />
          {/* Close button inside image */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 left-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors"
            aria-label="إغلاق"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <h2 className="text-xl font-bold text-[#1A1A2E] mb-1">{dish.name}</h2>
      {dish.description && (
        <p className="text-sm text-[#6B7280] mb-4 leading-relaxed">
          {dish.description}
        </p>
      )}

      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <span className="text-xl font-bold text-[#FF6B35]">
          {formatCurrency(dish.price)}
        </span>
        {dish.preparation_time && (
          <span className="text-xs text-[#9CA3AF] flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {dish.preparation_time} دقيقة
          </span>
        )}
        {dish.category && (
          <Badge variant="neutral" size="md">
            {dish.category}
          </Badge>
        )}
      </div>

      {/* Quantity picker */}
      <div className="flex items-center justify-between bg-[#FAFAFA] rounded-xl p-4 mb-4">
        <span className="text-sm font-medium text-[#1A1A2E]">الكمية</span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="إنقاص الكمية"
          >
            <Minus className="w-4 h-4 text-[#6B7280]" />
          </button>
          <span className="text-lg font-bold text-[#1A1A2E] min-w-[24px] text-center">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="w-9 h-9 rounded-xl bg-[#FF6B35] text-white flex items-center justify-center hover:bg-[#E63946] transition-colors"
            aria-label="زيادة الكمية"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={handleConfirm}
        disabled={!canOrder}
        className={`w-full py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 transition-all ${
          canOrder
            ? 'bg-gradient-to-r from-[#FF6B35] to-[#E63946] hover:shadow-xl active:scale-[0.98]'
            : 'bg-[#C4C4C4] cursor-not-allowed'
        }`}
        aria-label="أضف إلى السلة"
      >
        <ShoppingCart className="w-4 h-4" />
        {!isRestaurantOpen
          ? 'المطعم مغلق حالياً'
          : `أضف للسلة — ${formatCurrency(dish.price * quantity)}`}
      </button>
    </Modal>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function RestaurantPage() {
  const params = useParams();
  const router = useRouter();
  const { incrementCount, decrementCount } = useCart();
  const restaurantName = decodeURIComponent(params.restaurant_name as string);

  // ── State ──
  const [restaurant, setRestaurant]               = useState<Restaurant | null>(null);
  const [dishes, setDishes]                       = useState<Dish[]>([]);
  const [coverImage, setCoverImage]               = useState('');
  const [isLoading, setIsLoading]                 = useState(true);
  const [error, setError]                         = useState<string | null>(null);
  const [activeCategory, setActiveCategory]       = useState('الكل');
  const [selectedDish, setSelectedDish]           = useState<Dish | null>(null);
  const [isModalOpen, setIsModalOpen]             = useState(false);
  const [cart, setCart]                           = useState<Record<number, number>>({});
  const [searchQuery, setSearchQuery]             = useState('');

  // ── Refs ──
  const categoryRefs            = useRef<Record<string, HTMLDivElement | null>>({});
  const restaurantControllerRef = useRef<AbortController | null>(null);
  const dishesControllerRef     = useRef<AbortController | null>(null);
  const cartControllerRef       = useRef<AbortController | null>(null);

  // ── Fetch helpers ──

  const fetchRestaurant = useCallback(async (signal: AbortSignal) => {
    try {
      const res = await api.get('/restaurant/search-by-name', {
        params: { name: restaurantName.trim() },
        signal,
      });
      const data: Restaurant | undefined = res.data.restaurant;
      if (data) {
        setRestaurant(data);
        return data;
      }
      setError('المطعم غير موجود');
      return null;
    } catch (err: unknown) {
      if (isAbortError(err)) return null;
      if (isTimeoutError(err)) {
        setError('انتهت المهلة أثناء تحميل بيانات المطعم. حاول مرة أخرى.');
        return null;
      }
      const axiosErr = err as { response?: { status?: number } };
      setError(
        axiosErr.response?.status === 404
          ? 'المطعم غير موجود'
          : 'حدث خطأ في تحميل بيانات المطعم',
      );
      return null;
    }
  }, [restaurantName]);

  const fetchDishes = useCallback(async (restaurantId: number, signal: AbortSignal) => {
    try {
      const res = await api.post(
        '/restaurant/all-dishes-for-restaurantE',
        { restaurantId },
        { signal },
      );
      const raw: Dish[] = res.data.dishes || [];
      const processed = raw.map((d, i) => ({ ...d, isPopular: i < 3 }));
      setDishes(processed);
      const img = getFirstImage(processed[0]?.image);
      if (img) setCoverImage(img);
    } catch (err: unknown) {
      if (isAbortError(err)) return;
      if (isTimeoutError(err))
        setError('انتهت المهلة أثناء تحميل الأطباق. حاول مرة أخرى.');
    }
  }, []);

  const fetchCart = useCallback(async (signal: AbortSignal) => {
    try {
      const res   = await api.get('/customer/view-cart', { signal });
      const items = res.data.cartItems || [];
      const map: Record<number, number> = {};
      items.forEach((item: { dishId: number; quantity: number }) => {
        map[item.dishId] = item.quantity;
      });
      setCart(map);
    } catch (err: unknown) {
      if (isAbortError(err)) return;
    }
  }, []);

  // ── Initial load ──
  useEffect(() => {
    let cancelled = false;

    const restaurantController = new AbortController();
    const dishesController     = new AbortController();
    const cartController       = new AbortController();

    restaurantControllerRef.current = restaurantController;
    dishesControllerRef.current     = dishesController;
    cartControllerRef.current       = cartController;

    const run = async () => {
      if (cancelled) return;
      setIsLoading(true);
      setError(null);

      const data = await fetchRestaurant(restaurantController.signal);
      if (cancelled) return;

      if (data) {
        await Promise.all([
          fetchDishes(data.id, dishesController.signal),
          fetchCart(cartController.signal),
        ]);
      }

      if (!cancelled) setIsLoading(false);
    };

    run();

    return () => {
      cancelled = true;
      restaurantController.abort();
      dishesController.abort();
      cartController.abort();
    };
  }, [restaurantName, fetchRestaurant, fetchDishes, fetchCart]);

  // ── Manual reload ──
  const reload = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const restaurantController = new AbortController();
    const dishesController     = new AbortController();
    const cartController       = new AbortController();

    restaurantControllerRef.current = restaurantController;
    dishesControllerRef.current     = dishesController;
    cartControllerRef.current       = cartController;

    const data = await fetchRestaurant(restaurantController.signal);
    if (data) {
      await Promise.all([
        fetchDishes(data.id, dishesController.signal),
        fetchCart(cartController.signal),
      ]);
    }

    setIsLoading(false);
  }, [fetchRestaurant, fetchDishes, fetchCart]);

  // ── Derived data ──

  const categories = useMemo(() => {
    const unique = [
      ...new Set(dishes.map((d) => d.category).filter((c): c is string => !!c)),
    ];
    return ['الكل', ...unique];
  }, [dishes]);

  const filteredDishes = useMemo(() => {
    return dishes.filter((d) => {
      const matchSearch =
        !searchQuery ||
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = activeCategory === 'الكل' || d.category === activeCategory;
      return matchSearch && matchCat;
    });
  }, [dishes, searchQuery, activeCategory]);

  const dishesByCategory = useMemo(() => {
    return categories.reduce((acc, cat) => {
      if (cat === 'الكل') return acc;
      acc[cat] = filteredDishes.filter((d) => d.category === cat);
      return acc;
    }, {} as Record<string, Dish[]>);
  }, [categories, filteredDishes]);

  const cartItemCount = useMemo(
    () => Object.values(cart).reduce((s, q) => s + q, 0),
    [cart],
  );

  const cartTotal = useMemo(
    () =>
      Object.entries(cart).reduce((s, [id, q]) => {
        const d = dishes.find((d) => d.id === Number(id));
        return s + (d?.price || 0) * q;
      }, 0),
    [cart, dishes],
  );

  // ── Cart handler ──
  // الدالة دي هي القلب — بتعمل optimistic update وبترجع لو فيه error
  const handleAddToCart = useCallback(
    async (dishId: number, quantity: number) => {
      if (restaurant?.is_open === 0 || restaurant?.is_open === false) return;

      const current = cart[dishId] || 0;
      const diff    = quantity - current;

      // Optimistic update
      setCart((prev) => {
        if (quantity <= 0) {
          const next = { ...prev };
          delete next[dishId];
          return next;
        }
        return { ...prev, [dishId]: quantity };
      });

      // Update global cart icon count
      if (diff > 0) incrementCount(diff);
      else if (diff < 0) decrementCount(Math.abs(diff));

      try {
        if (quantity <= 0) {
          await api.delete('/customer/remove-dish-from-cart', { data: { dishId } });
        } else if (current === 0) {
          await api.post('/customer/add-dish-to-cart', { dishId, quantity });
        } else {
          await api.put('/customer/update-dish-quantity-in-cart', { dishId, quantity });
        }
      } catch {
        // Rollback on error
        setCart((prev) => {
          if (current === 0) {
            const next = { ...prev };
            delete next[dishId];
            return next;
          }
          return { ...prev, [dishId]: current };
        });
        if (diff > 0) decrementCount(diff);
        else if (diff < 0) incrementCount(Math.abs(diff));
      }
    },
    [cart, incrementCount, decrementCount, restaurant],
  );

  // ── Open modal (safe: يحفظ الـ dish ثم يفتح) ──
  const openDishModal = useCallback((dish: Dish) => {
    setSelectedDish(dish);
    setIsModalOpen(true);
  }, []);

  const closeDishModal = useCallback(() => {
    setIsModalOpen(false);
    // delay clearing dish so modal close animation doesn't flash
    setTimeout(() => setSelectedDish(null), 300);
  }, []);

  // ── Loading ──
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA]" dir="rtl">
        <div className="h-48 bg-gradient-to-br from-orange-100 to-red-50 animate-pulse" />
        <div className="px-4 py-4 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <DishCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // ── Error ──
  if (error || !restaurant) {
    const isNotFound = error?.includes('غير موجود');
    return (
      <div className="min-h-screen bg-[#FAFAFA]" dir="rtl">
        <EmptyState
          icon="😕"
          title={error || 'المطعم غير موجود'}
          description="عذراً، لم نتمكن من العثور على هذا المطعم"
          actionLabel={isNotFound ? 'العودة للمطاعم' : 'إعادة المحاولة'}
          onAction={isNotFound ? () => router.push('/customer/home') : reload}
        />
      </div>
    );
  }

  // ── Render ──
  const displayName      = restaurant.restaurant_name || restaurant.name || restaurantName;
  const isRestaurantOpen = restaurant.is_open !== 0 && restaurant.is_open !== false;

  return (
    <div className="min-h-screen bg-[#FAFAFA]" dir="rtl">

      {/* Hero */}
      <div className="relative h-48 sm:h-56 overflow-hidden">
        {coverImage ? (
          <Image
            src={coverImage}
            alt={displayName}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#FF6B35] to-[#E63946] flex items-center justify-center">
            <span className="text-6xl opacity-30">🍕</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <button
          type="button"
          onClick={() => router.back()}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center z-10"
          aria-label="رجوع"
        >
          <ChevronRight className="w-5 h-5 text-[#1A1A2E]" />
        </button>

        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-2 truncate">
            {displayName}
          </h1>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={isRestaurantOpen ? 'success' : 'danger'} size="sm" dot>
              {isRestaurantOpen ? 'مفتوح الآن' : 'مغلق'}
            </Badge>
            {restaurant.can_deliver && (
              <span className="flex items-center gap-1 text-[11px] text-white/80">
                <Truck className="w-3 h-3" /> يوصل
              </span>
            )}
            {restaurant.location && (
              <span className="flex items-center gap-1 text-[11px] text-white/80">
                <MapPin className="w-3 h-3" /> {restaurant.location}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="flex overflow-x-auto hide-scrollbar px-4 gap-1">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setActiveCategory(cat);
                if (cat !== 'الكل') {
                  const el = categoryRefs.current[cat];
                  if (el)
                    window.scrollTo({ top: el.offsetTop - 120, behavior: 'smooth' });
                }
              }}
              className={cn(
                'py-3 px-4 text-xs font-semibold whitespace-nowrap border-b-2 transition-all',
                activeCategory === cat
                  ? 'text-[#FF6B35] border-[#FF6B35]'
                  : 'text-[#9CA3AF] border-transparent hover:text-[#6B7280]',
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="px-4 py-3">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="ابحث في القائمة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-2.5 pr-10 pl-4 rounded-xl bg-white border border-gray-100 text-sm placeholder:text-[#C4C4C4] outline-none focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35]/20"
            dir="rtl"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              aria-label="مسح البحث"
            >
              <X className="w-4 h-4 text-[#9CA3AF]" />
            </button>
          )}
        </div>
      </div>

      {/* Dishes */}
      <div className="px-4 py-2 space-y-6">
        {activeCategory === 'الكل' ? (
          Object.entries(dishesByCategory).map(([cat, catDishes]) => {
            if (catDishes.length === 0) return null;
            return (
              <div key={cat} ref={(el) => { categoryRefs.current[cat] = el; }}>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-base font-bold text-[#1A1A2E]">{cat}</h2>
                  <span className="text-[11px] text-[#9CA3AF]">({catDishes.length})</span>
                </div>
                <div className="space-y-2.5">
                  {catDishes.map((dish) => (
                    <DishCard
                      key={dish.id}
                      dish={dish}
                      cartQuantity={cart[dish.id] || 0}
                      onAdd={handleAddToCart}
                      onClick={() => openDishModal(dish)}
                      isRestaurantOpen={isRestaurantOpen}
                    />
                  ))}
                </div>
              </div>
            );
          })
        ) : filteredDishes.length > 0 ? (
          <div className="space-y-2.5">
            {filteredDishes.map((dish) => (
              <DishCard
                key={dish.id}
                dish={dish}
                cartQuantity={cart[dish.id] || 0}
                onAdd={handleAddToCart}
                onClick={() => openDishModal(dish)}
                isRestaurantOpen={isRestaurantOpen}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon="🔍"
            title="لم نجد نتائج"
            description="جرب كلمات بحث مختلفة"
          />
        )}

        {dishes.length === 0 && !isLoading && (
          <EmptyState
            icon="🍽️"
            title="لا توجد أطباق"
            description="هذا المطعم لم يضف أطباق بعد"
          />
        )}
      </div>

      {/* Bottom padding so FloatingCartBar doesn't cover last dish */}
      <div className="h-40 md:h-8" />

      {/* Dish Detail Modal */}
      <DishDetailModal
        key={selectedDish?.id ?? 'none'}
        dish={selectedDish}
        isOpen={isModalOpen}
        onClose={closeDishModal}
        onAdd={handleAddToCart}
        initialQty={selectedDish ? (cart[selectedDish.id] || 1) : 1}
        isRestaurantOpen={isRestaurantOpen}
      />

      {/* Floating Cart Bar */}
      <FloatingCartBar
        itemCount={cartItemCount}
        totalPrice={cartTotal}
        onViewCart={() => router.push('/customer/cart')}
      />
    </div>
  );
}