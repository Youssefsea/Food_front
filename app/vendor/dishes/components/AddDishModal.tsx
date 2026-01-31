'use client';

import { X, Upload, XCircle } from 'lucide-react';
import { useState, useRef } from 'react';

interface AddDishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (dishData: {
    name: string;
    description: string;
    price: string;
    preparation_time: string;
    category: string;
    images: File[];
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

export function AddDishModal({ isOpen, onClose, onAdd }: AddDishModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    preparation_time: '',
    category: '',
  });
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 5) {
      setErrors({ ...errors, images: 'يمكنك رفع 5 صور كحد أقصى' });
      return;
    }

    setImages([...images, ...files]);
    
    // Create previews
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });

    setErrors({ ...errors, images: '' });
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (images.length + files.length > 5) {
      setErrors({ ...errors, images: 'يمكنك رفع 5 صور كحد أقصى' });
      return;
    }

    setImages([...images, ...files]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'اسم الطبق مطلوب';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'السعر مطلوب ويجب أن يكون أكبر من صفر';
    if (!formData.category) newErrors.category = 'التصنيف مطلوب';
    if (images.length === 0) newErrors.images = 'يجب رفع صورة واحدة على الأقل';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    setLoading(true);
    try {
      await onAdd({ ...formData, images });
      // Reset form
      setFormData({ name: '', description: '', price: '', preparation_time: '', category: '' });
      setImages([]);
      setPreviews([]);
      onClose();
    } catch (error) {
      console.error('Error adding dish:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ name: '', description: '', price: '', preparation_time: '', category: '' });
    setImages([]);
    setPreviews([]);
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
            <h2 className="text-xl font-bold text-[#1A1A1A]">إضافة طبق جديد</h2>
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
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-1">
                  صور الطبق *
                </label>
                <p className="text-xs text-[#9CA3AF] mb-2">يمكنك رفع حتى 5 صور</p>
                
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  className={`border-2 border-dashed rounded-xl h-40 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                    errors.images
                      ? 'border-[#EF4444] bg-[#FEE2E2]'
                      : 'border-[#E5E7EB] bg-[#F8FAFC] hover:border-[#E5A04D] hover:bg-[#FEF3E2]'
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-10 h-10 text-[#9CA3AF] mb-2" />
                  <p className="text-sm text-[#6B7280] mb-1">اسحب الصور هنا</p>
                  <p className="text-xs text-[#E5A04D] underline">أو انقر للاختيار</p>
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />

                {errors.images && (
                  <p className="text-xs text-[#EF4444] mt-1">{errors.images}</p>
                )}

                {/* Image Previews */}
                {previews.length > 0 && (
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {previews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 p-1 bg-[#EF4444] text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
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
                  <span>جاري الحفظ...</span>
                </>
              ) : (
                'حفظ الطبق'
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
