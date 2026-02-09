'use client';

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Image as ImageIcon, Check } from "lucide-react";

interface PaymentProofUploadProps {
  selectedImage: File | null;
  onImageSelect: (file: File | null) => void;
  isDisabled?: boolean;
}

export function PaymentProofUpload({ 
  selectedImage, 
  onImageSelect,
  isDisabled = false 
}: PaymentProofUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File | null) => {
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('يرجى اختيار صورة فقط');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert('حجم الصورة يجب أن يكون أقل من 5 ميجابايت');
        return;
      }

      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onImageSelect(file);
    } else {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(null);
      onImageSelect(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleRemoveImage = () => {
    handleFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[14px] font-semibold text-[#1A1A1A]">📸 صورة إثبات الدفع</span>
        <span className="text-[#EF4444] text-[14px]">*</span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
        disabled={isDisabled}
      />

      <AnimatePresence mode="wait">
        {!selectedImage ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !isDisabled && fileInputRef.current?.click()}
            className={`
              border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all
              ${isDragging 
                ? 'border-[#E5A04D] bg-[#FEF3E2]' 
                : 'border-[#E5E7EB] bg-[#F9FAFB] hover:border-[#E5A04D] hover:bg-[#FEF3E2]/50'
              }
              ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-[#FEF3E2] flex items-center justify-center">
                <Upload className="w-6 h-6 text-[#E5A04D]" />
              </div>
              <div className="text-[14px] font-medium text-[#1A1A1A]">
                اضغط لرفع صورة الإيصال
              </div>
              <div className="text-[12px] text-[#6B7280]">
                أو اسحب الصورة وأفلتها هنا
              </div>
              <div className="text-[11px] text-[#9CA3AF] mt-1">
                PNG, JPG حتى 5 ميجابايت
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative rounded-xl overflow-hidden border-2 border-[#10B981] bg-[#D1FAE5]/20"
          >
            <div className="absolute top-3 right-3 bg-[#10B981] text-white px-3 py-1 rounded-full text-[12px] font-medium flex items-center gap-1 z-10">
              <Check className="w-3.5 h-3.5" />
              <span>تم التحميل</span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveImage();
              }}
              disabled={isDisabled}
              className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors z-10 shadow-md"
            >
              <X className="w-4 h-4 text-[#EF4444]" />
            </button>

            <div className="p-3">
              <div className="relative w-full h-[180px] rounded-lg overflow-hidden bg-[#F3F4F6]">
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Payment proof"
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
              
              <div className="mt-3 flex items-center gap-2 text-[13px] text-[#6B7280]">
                <ImageIcon className="w-4 h-4" />
                <span className="truncate">{selectedImage.name}</span>
                <span className="text-[#9CA3AF]">
                  ({(selectedImage.size / 1024).toFixed(1)} KB)
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-2 text-[12px] text-[#9CA3AF] flex items-start gap-1.5">
        <span>💡</span>
        <span>ارفع صورة واضحة لإيصال الدفع (سكرين شوت) لتأكيد طلبك</span>
      </div>
    </div>
  );
}
