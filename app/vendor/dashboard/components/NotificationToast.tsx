'use client';

import { Bell, X } from 'lucide-react';
import { useState, useMemo } from 'react';

interface Notification {
  id: string;
  type: 'high' | 'medium' | 'low';
  title: string;
  message: string;
  time: string;
}

interface NotificationToastProps {
  pendingPaidOrders: number;
}

export function NotificationToast({ pendingPaidOrders }: NotificationToastProps) {
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  const notifications = useMemo(() => {
    const newNotifications: Notification[] = [];
    
    if (pendingPaidOrders > 0) {
      newNotifications.push({
        id: 'pending-paid',
        type: 'high',
        title: 'عملاء في الانتظار',
        message: `لديك ${pendingPaidOrders} طلبات مدفوعة تنتظر البدء في التحضير`,
        time: 'الآن',
      });
    }

    return newNotifications.filter(n => !dismissedIds.has(n.id));
  }, [pendingPaidOrders, dismissedIds]);

  const removeNotification = (id: string) => {
    setDismissedIds(prev => new Set([...prev, id]));
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-24 left-8 z-50 space-y-3 max-w-md">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`bg-white rounded-2xl shadow-2xl p-4 border-r-4 animate-slide-in ${
            notification.type === 'high'
              ? 'border-[#EF4444]'
              : notification.type === 'medium'
              ? 'border-[#8B5CF6]'
              : 'border-[#3B82F6]'
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`p-2 rounded-lg ${
                notification.type === 'high'
                  ? 'bg-[#FEE2E2]'
                  : notification.type === 'medium'
                  ? 'bg-[#EDE9FE]'
                  : 'bg-[#DBEAFE]'
              }`}
            >
              <Bell
                className={`w-5 h-5 ${
                  notification.type === 'high'
                    ? 'text-[#EF4444]'
                    : notification.type === 'medium'
                    ? 'text-[#8B5CF6]'
                    : 'text-[#3B82F6]'
                }`}
              />
            </div>

            <div className="flex-1">
              <h4 className="font-bold text-[#1A1A1A] mb-1">{notification.title}</h4>
              <p className="text-sm text-[#6B7280]">{notification.message}</p>
              <span className="text-xs text-[#9CA3AF] mt-1 block">{notification.time}</span>
            </div>

            <button
              onClick={() => removeNotification(notification.id)}
              className="p-1 hover:bg-[#F3F4F6] rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-[#6B7280]" />
            </button>
          </div>
        </div>
      ))}

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
