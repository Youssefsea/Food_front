"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import api from "@/lib/api";
import { getUserRole } from "@/lib/api";
import { confirmPayment } from "@/services/admin.service";
import { logout } from "@/services/auth.service";
import { Button, Badge, Modal, EmptyState } from "@/components/ui";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";
import { toast } from "sonner";
import { Shield, LogOut, Check, X, Eye, RefreshCw, Clock } from "lucide-react";
import { ProtectedRoute } from "../context/AuthContext";

interface PendingPayment {
  payment_id: number;
  order_id: number;
  amount: number;
  payment_method: string;
  payment_proof: string;
  created_at: string;
  customer_name?: string;
  customer_phone?: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [payments, setPayments] = useState<PendingPayment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<PendingPayment | null>(null);
  const [showProof, setShowProof] = useState(false);
  const [processingId, setProcessingId] = useState<number | null>(null);

  // Auth check
  useEffect(() => {
    const role = getUserRole();
    if (role !== 'admin') {
      router.replace('/admin/login');
    }
  }, [router]);

  const fetchPayments = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/admin/pendingPayments');
      setPayments(res.data.pendingPayments|| []);
    } catch {
      // If no dedicated endpoint, show empty
      setPayments([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const handleConfirm = async (paymentId: number, status: 'approved' | 'rejected') => {
    setProcessingId(paymentId);
    try {
      
      await confirmPayment(paymentId, status);
      toast.success(status === 'approved' ? 'تم قبول الدفعة ✅' : 'تم رفض الدفعة ❌');
      setPayments(prev => prev.filter(p => p.payment_id !== paymentId));
      setSelectedPayment(null);
    } catch {
      toast.error('حدث خطأ في معالجة الدفعة');
    } finally {
      setProcessingId(null);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    // <ProtectedRoute role="admin">
      <div className="min-h-screen bg-[#F8FAFC]" dir="rtl">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#1A1A2E] to-[#252540] text-white px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-[#FF6B35]" />
            </div>
            <div>
              <h1 className="text-lg font-bold">لوحة الإدارة</h1>
              <p className="text-xs text-white/50">أكلي — إدارة المدفوعات</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={fetchPayments} className="!text-white/70 hover:!text-white">
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="!text-white/70 hover:!text-white">
              <LogOut className="w-4 h-4" />
              <span>خروج</span>
            </Button>
          </div>
        </div>
      </header>
<div className="h-6"/>
      {/* Stats */}
      <div className="max-w-6xl mx-auto px-6 -mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1A1A2E]">{payments.length}</p>
                <p className="text-xs text-[#9CA3AF]">دفعات معلقة</p>
              </div>
            </div>
          </div>
        
        </div>
      </div>

      {/* Payments List */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <h2 className="text-base font-bold text-[#1A1A2E] mb-4 flex items-center gap-2">
          <span>💳</span> الدفعات المعلقة
        </h2>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-5 animate-pulse h-24" />
            ))}
          </div>
        ) : payments.length === 0 ? (
          <EmptyState
            icon="✅"
            title="لا توجد دفعات معلقة"
            description="جميع الدفعات تمت مراجعتها"
          />
        ) : (
          <div className="space-y-3">
            {payments.map((payment) => (
              <div
                key={payment.payment_id}
                className="bg-white rounded-xl p-5 border border-gray-100 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-bold text-[#1A1A2E]">طلب #{payment.order_id}</span>
                      <Badge variant="warning" size="sm">معلق</Badge>
                      <span className="text-[10px] text-[#C4C4C4]">
                        {payment.payment_method === 'vodafone_cash' ? '📱 فودافون كاش' : '🏦 إنستاباي'}
                      </span>
                     
                    </div>
                    <div className="flex items-center gap-4 text-xs text-[#6B7280]">
                      <span className="font-semibold text-[#FF6B35] text-base">{formatCurrency(payment.amount)}</span>
                      {payment.customer_name && <span>العميل: {payment.customer_name}</span>}
                      <span>{formatDate(payment.created_at)} — {formatTime(payment.created_at)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* View Proof */}
                    {payment.payment_proof && (
                      <button
                        onClick={() => { setSelectedPayment(payment); setShowProof(true); }}
                        className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                        title="عرض الإثبات"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}

                    {/* Approve */}
                    <button
                      onClick={() => handleConfirm(payment.payment_id, 'approved')}
                      disabled={processingId === payment.payment_id}
                      className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors disabled:opacity-50"
                      title="قبول"
                    >
                      <Check className="w-4 h-4" />
                    </button>

                    {/* Reject */}
                    <button
                      onClick={() => handleConfirm(payment.payment_id, 'rejected')}
                      disabled={processingId === payment.payment_id}
                      className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50"
                      title="رفض"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Payment Proof Modal */}
      <Modal
        isOpen={showProof}
        onClose={() => { setShowProof(false); setSelectedPayment(null); }}
        title={`إثبات دفع — طلب #${selectedPayment?.order_id}`}
        size="md"
      >
        {selectedPayment?.payment_proof && (
          <div className="space-y-4">
            <div className="relative w-full h-80 rounded-xl overflow-hidden bg-gray-50">
              <Image
                src={selectedPayment.payment_proof}
                alt="إثبات الدفع"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 500px"
              />
            </div>

            <div className="bg-[#FAFAFA] rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#6B7280]">المبلغ</span>
                <span className="font-bold text-[#1A1A2E]">{formatCurrency(selectedPayment.amount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#6B7280]">طريقة الدفع</span>
                <span className="font-medium">
                  {selectedPayment.payment_method === 'vodafone_cash' ? 'فودافون كاش' : 'إنستاباي'}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="primary"
                fullWidth
                onClick={() => handleConfirm(selectedPayment.payment_id, 'approved')}
                isLoading={processingId === selectedPayment.payment_id}
                icon={<Check className="w-4 h-4" />}
              >
                قبول الدفعة
              </Button>
              <Button
                variant="danger"
                fullWidth
                onClick={() => handleConfirm(selectedPayment.payment_id, 'rejected')}
                isLoading={processingId === selectedPayment.payment_id}
                icon={<X className="w-4 h-4" />}
              >
                رفض
              </Button>
            </div>
          </div>
        )}
      </Modal>
      </div>
    // </ProtectedRoute>
  );
}
