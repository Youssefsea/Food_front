'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Utensils, Plus, Search, ChevronDown, FileText, CheckCircle, XCircle, Tag } from 'lucide-react';
import api from '@/lib/api';
import { DishCard, AddDishModal, EditDishModal, DeleteConfirmationModal, Toast } from './components';
import { ProtectedRoute } from '@/app/context/AuthContext';

interface Dish {
  id: number;
  name: string;
  description: string;
  price: number;
  preparation_time: number;
  category: string;
  image: string;
  is_available: boolean;
}

type AvailabilityFilter = 'all' | 'available' | 'unavailable';
type SortOption = 'newest' | 'name-asc' | 'price-asc' | 'price-desc';

export default function DishesPage() {
  const [mounted, setMounted] = useState(false);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState<AvailabilityFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDishes = useCallback(async (signal?: AbortSignal) => {
    if (!mounted) return;
    setIsLoading(true);
    try {

      const response = await api.post('/restaurant/all-dishes-for-restaurantV', undefined, { signal });
      const dishesData = response.data.dishes || response.data || [];
      setDishes(dishesData);
    } catch (error) {
      showToast('error', 'حدث خطأ في تحميل الأطباق');
    } finally {
      setIsLoading(false);
    }
  }, [mounted]);

  // Mount guard - fix for first-visit data loading bug
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const controller = new AbortController();
    fetchDishes(controller.signal);
    return () => controller.abort();
  }, [fetchDishes, mounted]);

  const categories = useMemo(() => {
    return ['الكل', ...Array.from(new Set(dishes.map((d) => d.category)))];
  }, [dishes]);

  const filteredDishes = useMemo(() => {
    let result = [...dishes];

    if (searchQuery) {
      result = result.filter((dish) =>
        dish.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory && selectedCategory !== 'الكل') {
      result = result.filter((dish) => dish.category === selectedCategory);
    }

    if (availabilityFilter === 'available') {
      result = result.filter((dish) => dish.is_available);
    } else if (availabilityFilter === 'unavailable') {
      result = result.filter((dish) => !dish.is_available);
    }

    switch (sortBy) {
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name, 'ar'));
        break;
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
      default:
        result.sort((a, b) => b.id - a.id);
        break;
    }

    return result;
  }, [dishes, searchQuery, selectedCategory, availabilityFilter, sortBy]);

  const stats = useMemo(() => ({
    total: dishes.length,
    available: dishes.filter((d) => d.is_available).length,
    unavailable: dishes.filter((d) => !d.is_available).length,
    categories: new Set(dishes.map((d) => d.category)).size,
  }), [dishes]);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
  };

  const handleAddDish = async (dishData: {
    name: string;
    description: string;
    price: string;
    preparation_time: string;
    category: string;
    images: File[];
  }) => {
    try {
      const formData = new FormData();
      formData.append('name', dishData.name);
      formData.append('description', dishData.description);
      formData.append('price', dishData.price);
      formData.append('preparation_time', dishData.preparation_time);
      formData.append('category', dishData.category);
      
      dishData.images.forEach((image) => {
        formData.append('images', image);
      });

      await api.post('/restaurant/add-dish', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      showToast('success', 'تم إضافة الطبق بنجاح ✓');
      fetchDishes();
    } catch (error) {
      showToast('error', 'حدث خطأ في إضافة الطبق');
      throw error;
    }
  };

  const handleUpdateDish = async (dishId: number, dishData: {
    name: string;
    description: string;
    price: number;
    preparation_time: number;
    category: string;
  }) => {
    try {
      await api.put('/restaurant/change-dish', {
        dishId,
        ...dishData,
      });

      showToast('success', 'تم تحديث الطبق بنجاح ✓');
      fetchDishes();
    } catch (error) {
      showToast('error', 'حدث خطأ في تحديث الطبق');
      throw error;
    }
  };

  const handleDeleteDish = async (dishId: number) => {
    try {
      await api.delete('/restaurant/delete-dish', {
        data: { dishId },
      });

      showToast('success', 'تم حذف الطبق بنجاح ✓');
      fetchDishes();
    } catch (error) {
      showToast('error', 'حدث خطأ في حذف الطبق');
      throw error;
    }
  };

  const handleToggleAvailability = useCallback(async (dishId: number, isAvailable: boolean) => {
    try {
      await api.put('/restaurant/change-dish-availability', {
        dishId,
        is_available: isAvailable,
      });

      setDishes((prev) =>
        prev.map((dish) =>
          dish.id === dishId ? { ...dish, is_available: isAvailable } : dish
        )
      );

      showToast(
        'success',
        isAvailable ? 'الطبق متاح الآن ✓' : 'الطبق غير متاح حالياً'
      );
    } catch (error) {
      showToast('error', 'حدث خطأ في تحديث حالة التوفر');
    }
  }, []);

  return (
    <ProtectedRoute role="vendor">
      <div className="min-h-screen bg-[#F8FAFC] py-6 px-4 md:px-6 lg:px-8" dir="rtl">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#E5A04D] rounded-full flex items-center justify-center">
              <Utensils className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-[28px] font-bold text-[#1A1A1A]">إدارة قائمة الأطباق</h1>
              <p className="text-sm text-[#6B7280]">أضف، عدّل، واحذف أطباقك بسهولة</p>
            </div>
            <span className="px-4 py-2 bg-[#FEF3E2] text-[#E5A04D] text-sm font-semibold rounded-full">
              {stats.total} طبق
            </span>
          </div>

          <div className="flex items-center gap-3">
         

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-[#E5A04D] text-white rounded-xl hover:bg-[#D4903D] transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span className="font-semibold">إضافة طبق جديد</span>
            </button>
          </div>
        </div>
         <div className="h-[30px]" />

        <div className="bg-white rounded-xl p-4 mb-6 flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن طبق بالاسم..."
              className="w-full h-11 pr-10 pl-4 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E5A04D]/20 focus:border-[#E5A04D]"
            />
          </div>

          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-11 px-4 pr-10 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E5A04D]/20 focus:border-[#E5A04D] appearance-none bg-white min-w-[160px]"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat === 'الكل' ? '' : cat}>
                  {cat}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
          </div>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setAvailabilityFilter('all')}
              className={`px-4 py-2 rounded-2xl  text-sm font-medium transition-colors ${
                availabilityFilter === 'all'
                  ? 'bg-[#E5A04D] text-white'
                  : 'bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB]'
              }`}
            >
              الكل
            </button>
            <button
              onClick={() => setAvailabilityFilter('available')}
              className={`px-4 py-2 rounded-2xl text-sm font-medium transition-colors ${
                availabilityFilter === 'available'
                  ? 'bg-[#E5A04D] text-white'
                  : 'bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB]'
              }`}
            >
              متاح ✓
            </button>
            <button
              onClick={() => setAvailabilityFilter('unavailable')}
              className={`px-4 py-2 rounded-2xl text-sm font-medium transition-colors ${
                availabilityFilter === 'unavailable'
                  ? 'bg-[#E5A04D] text-white'
                  : 'bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB]'
              }`}
            >
              غير متاح
            </button>
          </div>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="h-11 px-4 pr-10 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E5A04D]/20 focus:border-[#E5A04D] appearance-none bg-white min-w-[140px]"
            >
              <option value="newest">الأحدث</option>
              <option value="name-asc">الاسم أ-ي</option>
              <option value="price-asc">السعر ↑</option>
              <option value="price-desc">السعر ↓</option>
            </select>
            <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
          </div>
        </div>
         <div className="h-[30px]" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-[#DBEAFE] rounded-full flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#3B82F6]" />
              </div>
            </div>
            <div className="text-[28px] font-bold text-[#1A1A1A] mb-1">{stats.total}</div>
            <div className="text-sm text-[#6B7280]">إجمالي الأطباق</div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-[#D1FAE5] rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-[#10B981]" />
              </div>
            </div>
            <div className="text-[28px] font-bold text-[#10B981] mb-1">{stats.available}</div>
            <div className="text-sm text-[#6B7280]">أطباق متاحة</div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-[#FEE2E2] rounded-full flex items-center justify-center">
                <XCircle className="w-5 h-5 text-[#EF4444]" />
              </div>
            </div>
            <div className="text-[28px] font-bold text-[#EF4444] mb-1">{stats.unavailable}</div>
            <div className="text-sm text-[#6B7280]">غير متاحة</div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-[#E9D5FF] rounded-full flex items-center justify-center">
                <Tag className="w-5 h-5 text-[#9333EA]" />
              </div>
            </div>
            <div className="text-[28px] font-bold text-[#1A1A1A] mb-1">{stats.categories}</div>
            <div className="text-sm text-[#6B7280]">تصنيفات</div>
          </div>
        </div>
 <div className="h-[30px]" />
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                <div className="h-50 bg-[#F3F4F6] animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-[#F3F4F6] rounded animate-pulse w-3/4" />
                  <div className="h-4 bg-[#F3F4F6] rounded animate-pulse" />
                  <div className="h-4 bg-[#F3F4F6] rounded animate-pulse w-5/6" />
                  <div className="h-6 bg-[#F3F4F6] rounded animate-pulse w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredDishes.length === 0 ? (
          <div className="bg-white rounded-2xl p-20 text-center">
            <div className="text-8xl mb-4">🍽️</div>
            <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">لا توجد أطباق بعد</h3>
            <p className="text-sm text-[#6B7280] mb-6">ابدأ بإضافة أول طبق لقائمتك</p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-6 py-3 bg-[#E5A04D] text-white rounded-xl hover:bg-[#D4903D] transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              <span>إضافة أول طبق</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
            {filteredDishes.map((dish) => (
               
              <DishCard
                key={dish.id}
                dish={dish}
                onEdit={(dish) => {
                  setSelectedDish(dish);
                  setIsEditModalOpen(true);
                }}
                onDelete={(dish) => {
                  setSelectedDish(dish);
                  setIsDeleteModalOpen(true);
                }}
                onToggleAvailability={handleToggleAvailability}
              />
             
              
            ))}
          </div>
        )}
      </div>

      <AddDishModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddDish}
      />

      <EditDishModal
        isOpen={isEditModalOpen}
        dish={selectedDish}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedDish(null);
        }}
        onUpdate={handleUpdateDish}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        dish={selectedDish}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedDish(null);
        }}
        onConfirm={handleDeleteDish}
      />

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      </div>
    </ProtectedRoute>
  );
}
