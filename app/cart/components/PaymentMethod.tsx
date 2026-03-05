'use client';

import { motion, AnimatePresence } from "framer-motion";
import { Copy, Info } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PaymentMethod as PaymentMethodType } from "../types";
import { PaymentProofUpload } from "./PaymentProofUpload";

interface PaymentMethodProps {
  paymentMethod: PaymentMethodType;
  setPaymentMethod: (method: 'vodafone_cash' | 'instapay') => void;
  grandTotal: number;
  paymentImage: File | null;
  onImageSelect: (file: File | null) => void;
  isDisabled?: boolean;
}

export function PaymentMethod({ 
  paymentMethod, 
  setPaymentMethod, 
  grandTotal,
  paymentImage,
  onImageSelect,
  isDisabled = false
}: PaymentMethodProps) {
  const [copiedNumber, setCopiedNumber] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNumber(true);
    toast.success("تم نسخ رقم المحفظة!");
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const walletNumber = "01012345678";

  return (
    <div className="bg-white rounded-2xl mx-5 mb-5 p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[18px] font-semibold text-[#1A1A1A]">💳 طريقة الدفع</h2>
        <span className="text-[#EF4444] text-[18px]">*</span>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => setPaymentMethod("vodafone_cash")}
          className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3.5 ${
            paymentMethod === "vodafone_cash"
              ? "border-[#E5A04D] bg-[#FEF3E2]"
              : "border-[#E5E7EB] bg-white"
          }`}
        >
          <div className={`w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
            paymentMethod === "vodafone_cash" ? "border-[#E5A04D]" : "border-[#E5E7EB]"
          }`}>
            {paymentMethod === "vodafone_cash" && (
              <div className="w-3 h-3 rounded-full bg-[#E5A04D]" />
            )}
          </div>

          <div className="w-10 h-10 rounded-lg bg-[#E60000] flex items-center justify-center flex-shrink-0">
            <span className="text-[20px]">📱</span>
          </div>

          <div className="text-right flex-1">
            <div className="text-[15px] font-semibold text-[#1A1A1A]">فودافون كاش</div>
            <div className="text-[12px] text-[#6B7280]">ادفع عبر محفظة فودافون كاش</div>
          </div>
        </button>

        <button
          onClick={() => setPaymentMethod("instapay")}
          className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3.5 ${
            paymentMethod === "instapay"
              ? "border-[#E5A04D] bg-[#FEF3E2]"
              : "border-[#E5E7EB] bg-white"
          }`}
        >
          <div className={`w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
            paymentMethod === "instapay" ? "border-[#E5A04D]" : "border-[#E5E7EB]"
          }`}>
            {paymentMethod === "instapay" && (
              <div className="w-3 h-3 rounded-full bg-[#E5A04D]" />
            )}
          </div>

          <div className="w-10 h-10 rounded-lg bg-[#3B82F6] flex items-center justify-center flex-shrink-0">
            <span className="text-[20px]">🏦</span>
          </div>

          <div className="text-right flex-1">
            <div className="text-[15px] font-semibold text-[#1A1A1A]">إنستاباي</div>
            <div className="text-[12px] text-[#6B7280]">تحويل فوري من أي بنك</div>
          </div>
        </button>
      </div>

      <AnimatePresence>
        {paymentMethod && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 bg-[#FEF3C7] border border-[#FCD34D] rounded-[10px] p-4 overflow-hidden"
          >
            <div className="flex items-start gap-2 mb-3">
              <Info className="w-4 h-4 text-[#92400E] flex-shrink-0 mt-0.5" />
              <span className="text-[14px] font-semibold text-[#92400E]">تعليمات الدفع</span>
            </div>

            <div className="space-y-2 text-[13px] text-[#92400E]">
              {paymentMethod === "vodafone_cash" && (
                <>
                  <div>١. افتح تطبيق فودافون كاش</div>
                  <div>٢. اختر &quot;تحويل أموال&quot;</div>
                  <div>٣. أدخل الرقم: {walletNumber}</div>
                  <div>٤. أدخل المبلغ: {grandTotal.toFixed(2)} ج.م</div>
                  <div>٥. أكمل التحويل واحفظ صورة الإيصال</div>
                </>
              )}
              {paymentMethod === "instapay" && (
                <>
                  <div>١. افتح تطبيق البنك الخاص بك</div>
                  <div>٢. اختر &quot;تحويل InstaPay&quot;</div>
                  <div>٣. أدخل رقم المحفظة: {walletNumber}</div>
                  <div>٤. أدخل المبلغ: {grandTotal.toFixed(2)} ج.م</div>
                  <div>٥. أكمل التحويل واحفظ صورة الإيصال</div>
                </>
              )}
            </div>

            {/* Recipient Info */}
            <div className="mt-3 bg-white rounded-lg p-3">
              <div className="text-[12px] text-[#6B7280] mb-1">رقم المحفظة</div>
              <div className="flex items-center justify-between">
                <span className="text-[18px] font-bold text-[#1A1A1A] font-mono">
                  {walletNumber}
                </span>
                <button
                  onClick={() => copyToClipboard(walletNumber)}
                  className="flex items-center gap-1.5 text-[#E5A04D] text-[13px] hover:bg-[#FEF3E2] px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  <span>{copiedNumber ? "تم النسخ!" : "نسخ"}</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <PaymentProofUpload
        selectedImage={paymentImage}
        onImageSelect={onImageSelect}
        isDisabled={isDisabled}
      />
    </div>
  );
}

