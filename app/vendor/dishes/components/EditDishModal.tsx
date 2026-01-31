'use client';

import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';

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

interface EditDishModalProps {
  isOpen: boolean;
  dish: Dish | null;
  onClose: () => void;
  onUpdate: (dishId: number, dishData: {
    name: string;
    description: string;
    price: number;
    preparation_time: number;
    category: string;
  }) => Promise<void>;
}

const categories = [
  'مقبلات',
  'أطباق رئيسية',
  'بيتزا',
  'برجر',
  'سندويتشات',
  'مشويات',
  'سلطات',
  'شوربات',
  'مشروبات',
  'حلويات',
];

export function EditDishModal({ isOpen, dish, onClose, onUpdate }: EditDishModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    preparation_time: '',
    category: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (dish) {
      setFormData({
        name: dish.name,
        description: dish.description,
        price: dish.price.toString(),
        preparation_time: dish.preparation_time.toString(),
        category: dish.category,
      });
    }
  }, [dish]);

  if (!isOpen || !dish) return null;

  const images = dish.image ? dish.image.split(',') : [];

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'اسم الطبق مطلوب';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'السعر مطلوب ويجب أن يكون أكبر من صفر';
    if (!formData.category) newErrors.category = 'التصنيف مطلوب';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    setLoading(true);
    try {
      await onUpdate(dish.id, {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        preparation_time: parseInt(formData.preparation_time) || 0,
        category: formData.category,
      });
      onClose();
    } catch (error) {
      console.error('Error updating dish:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl w-full max-w-140 max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#E5E7EB]">
            <h2 className="text-xl font-bold text-[#1A1A1A]">تعديل الطبق</h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-[#6B7280]" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Current Images (Read-only) */}
              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-1">
                  صور الطبق الحالية
                </label>
                <p className="text-xs text-[#9CA3AF] mb-3">
                  لتغيير الصور، احذف الطبق وأضفه من جديد
                </p>
                
                {images.length > 0 ? (
                  <div className="flex gap-2 flex-wrap">
                    {images.map((img, index) => (
                      <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden border border-[#E5E7EB]">
                        <Image
                          src={img}
                          alt={`Image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="w-20 h-20 bg-[#F3F4F6] rounded-lg flex items-center justify-center">
                    <span className="text-2xl text-[#9CA3AF]">🍽️</span>
                  </div>
                )}
              </div>

              {/* Dish Name */}
              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                  اسم الطبق *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="مثال: بيتزا مارجريتا"
                  className={`w-full h-11 px-4 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.name
                      ? 'border-[#EF4444] focus:ring-[#EF4444]/20'
                      : 'border-[#E5E7EB] focus:ring-[#E5A04D]/20 focus:border-[#E5A04D]'
                  }`}
                />
                {errors.name && (
                  <p className="text-xs text-[#EF4444] mt-1">{errors.name}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                  وصف الطبق
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => {
                    if (e.target.value.length <= 500) {
                      setFormData({ ...formData, description: e.target.value });
                    }
                  }}
                  placeholder="وصف مختصر للطبق ومكوناته..."
                  rows={4}
                  className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E5A04D]/20 focus:border-[#E5A04D] resize-none"
                />
                <p className="text-xs text-[#9CA3AF] mt-1 text-left">
                  {formData.description.length}/500
                </p>
              </div>

              {/* Price & Prep Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                    السعر *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="0"
                      className={`w-full h-11 px-4 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${
                        errors.price
                          ? 'border-[#EF4444] focus:ring-[#EF4444]/20'
                          : 'border-[#E5E7EB] focus:ring-[#E5A04D]/20 focus:border-[#E5A04D]'
                      }`}
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#9CA3AF]">
                      ج.م
                    </span>
                  </div>
                  {errors.price && (
                    <p className="text-xs text-[#EF4444] mt-1">{errors.price}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                    وقت التحضير
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      value={formData.preparation_time}
                      onChange={(e) => setFormData({ ...formData, preparation_time: e.target.value })}
                      placeholder="20"
                      className="w-full h-11 px-4 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E5A04D]/20 focus:border-[#E5A04D]"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#9CA3AF]">
                      دقيقة
                    </span>
                  </div>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                  التصنيف *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className={`w-full h-11 px-4 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.category
                      ? 'border-[#EF4444] focus:ring-[#EF4444]/20'
                      : 'border-[#E5E7EB] focus:ring-[#E5A04D]/20 focus:border-[#E5A04D]'
                  }`}
                >
                  <option value="">اختر التصنيف</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-xs text-[#EF4444] mt-1">{errors.category}</p>
                )}
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-[#E5E7EB]">
            <button
              onClick={handleClose}
              disabled={loading}
              className="px-6 py-3 border border-[#E5E7EB] text-[#6B7280] rounded-xl hover:bg-[#F3F4F6] transition-colors disabled:opacity-50"
            >
              إلغاء
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-8 py-3 bg-[#E5A04D] text-white rounded-xl hover:bg-[#D4903D] transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>جاري التحديث...</span>
                </>
              ) : (
                'تحديث الطبق'
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
