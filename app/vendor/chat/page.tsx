'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { ProtectedRoute } from '@/app/context/AuthContext';
import { ChatRoom } from '@/types';
import { MessageCircle, ArrowLeft, Clock, Users } from 'lucide-react';
import { formatDistanceToNow } from '@/lib/utils';
import { toast } from 'sonner';

/**
 * Vendor Chat Rooms List Page
 * Shows all chat rooms for the restaurant's orders
 */

export default function VendorChatPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch chat rooms from backend
  const fetchChatRooms = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get('/restaurant/chat-rooms');
      const chatRooms = response.data.rooms || response.data || [];
      setRooms(chatRooms);
    } catch (err) {
      const errorMsg = 'فشل في تحميل غرف المحادثة';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChatRooms();
  }, [fetchChatRooms]);

  // Navigate to specific chat room
  const handleRoomClick = (roomId: number) => {
    router.push(`/vendor/chat/${roomId}`);
  };

  // Format timestamp for last message
  const formatTime = (timestamp?: string) => {
    if (!timestamp) return '';
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return timestamp;
    }
  };

  // Get status badge for order
  const getStatusBadge = (status?: string) => {
    const statusConfig: Record<string, { label: string; color: string }> = {
      pending: { label: 'قيد الانتظار', color: 'bg-amber-100 text-amber-700' },
      paid: { label: 'تم الدفع', color: 'bg-blue-100 text-blue-700' },
      cooking: { label: 'جاري التحضير', color: 'bg-orange-100 text-orange-700' },
      delivering: { label: 'جاري التوصيل', color: 'bg-indigo-100 text-indigo-700' },
      completed: { label: 'مكتمل', color: 'bg-green-100 text-green-700' },
      cancelled: { label: 'ملغي', color: 'bg-red-100 text-red-700' },
    };
    
    const config = status ? statusConfig[status] : null;
    if (!config) return null;
    
    return (
      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  return (
    <ProtectedRoute role="vendor">
      <div className="min-h-screen bg-[#FAFAFA]" dir="rtl">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
          <div className="flex items-center justify-between px-4 py-3">
            <button 
              onClick={() => router.push('/vendor/dashboard')}
              className="p-2 -mr-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[#1A1A2E]" />
            </button>
            <h1 className="text-lg font-bold text-[#1A1A2E]">محادثات العملاء</h1>
            <div className="w-9" />
          </div>
        </header>

        {/* Content */}
        <main className="p-4">
          {isLoading ? (
            // Loading skeleton
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-200" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            // Error state
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-lg font-medium text-[#1A1A2E] mb-2">{error}</h3>
              <button
                onClick={fetchChatRooms}
                className="px-4 py-2 bg-[#E5A04D] text-white rounded-lg text-sm font-medium hover:bg-[#d49140] transition-colors"
              >
                إعادة المحاولة
              </button>
            </div>
          ) : rooms.length === 0 ? (
            // Empty state
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-[#FFF8F0] rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-[#E5A04D]" />
              </div>
              <h3 className="text-lg font-medium text-[#1A1A2E] mb-2">لا توجد محادثات</h3>
              <p className="text-sm text-[#6B7280]">
                ستظهر هنا محادثات العملاء بعد تأكيد دفع طلباتهم
              </p>
            </div>
          ) : (
            // Chat rooms list
            <div className="space-y-3">
              {rooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() => handleRoomClick(room.id)}
                  className="w-full bg-white rounded-xl p-4 text-right hover:shadow-md transition-shadow border border-gray-100"
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E5A04D] to-[#FF6B35] flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-lg">
                        {room.customer_name?.charAt(0) || 'ع'}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-[#1A1A2E] truncate">
                          {room.customer_name || 'عميل'}
                        </h3>
                        {room.last_message_time && (
                          <span className="text-[11px] text-[#9CA3AF] flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTime(room.last_message_time)}
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-[#6B7280] line-clamp-2 mb-2">
                        {room.last_message || 'لا توجد رسائل جديدة'}
                      </p>

                      <div className="flex items-center gap-2">
                        {getStatusBadge(room.order_status)}
                        <span className="text-[10px] text-[#9CA3AF]">
                          طلب #{room.order_id}
                        </span>
                      </div>
                    </div>

                    {/* Unread indicator */}
                    {room.unread_count && room.unread_count > 0 && (
                      <div className="w-5 h-5 rounded-full bg-[#E5A04D] text-white text-xs font-bold flex items-center justify-center">
                        {room.unread_count}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
