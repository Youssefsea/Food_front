'use client';

import { Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Dish {
  id: number;
  name: string;
}

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  dish: Dish | null;
  onClose: () => void;
  onConfirm: (dishId: number) => Promise<void>;
}

export function DeleteConfirmationModal({
  isOpen,
  dish,
  onClose,
  onConfirm,
}: DeleteConfirmationModalProps) {
  const [loading, setLoading] = useState(false);

  if (!isOpen || !dish) return null;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm(dish.id);
      onClose();
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl w-full max-w-[400px] p-8 text-center"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-16 h-16 bg-[#FEE2E2] rounded-full flex items-center justify-center mx-auto mb-4 animate-shake">
            <Trash2 className="w-8 h-8 text-[#EF4444]" />
          </div>

          <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">حذف الطبق؟</h3>

          <p className="text-sm text-[#6B7280] mb-1">
            هل أنت متأكد من حذف
            <span className="font-bold text-[#1A1A1A]"> «{dish.name}» </span>
            ؟
          </p>

          <p className="text-xs text-[#EF4444] mb-6">
            هذا الإجراء لا يمكن التراجع عنه
          </p>

          <div className="flex gap-3 justify-center">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-6 py-3 bg-[#F3F4F6] text-[#6B7280] rounded-xl hover:bg-[#E5E7EB] transition-colors disabled:opacity-50 min-w-[120px]"
            >
              إلغاء
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="px-6 py-3 bg-[#EF4444] text-white rounded-xl hover:bg-[#DC2626] transition-colors disabled:opacity-50 min-w-[120px] flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>جاري الحذف...</span>
                </>
              ) : (
                'نعم، احذف'
              )}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(-5deg);
          }
          75% {
            transform: rotate(5deg);
          }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
