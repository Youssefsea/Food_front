'use client';

import { useEffect, useState, useCallback } from "react";
import { Toaster } from "sonner";
import api from "@/lib/api";
import { ProfileHeader } from "./components/ProfileHeader";
import { WalletCard } from "./components/WalletCard";
import { OrdersSection } from "./components/OrdersSection";
import { EditProfileModal } from "./components/EditProfileModal"; // ← أضفناه
import { UserProfile, Order, OrderRowFromAPI } from "./types";
import { ProtectedRoute } from "../context/AuthContext";

export default function ProfilePage() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOrdersLoading, setIsOrdersLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);


  useEffect(() => { setMounted(true); }, []);

  const fetchProfile = useCallback(async (signal?: AbortSignal) => {
    if (!mounted) return;
    try {
      const res = await api.get('/customer/profile', { signal });
      if (res.data?.user) setUser(res.data.user);
    } catch {}
  }, [mounted]);

  const fetchWalletBalance = useCallback(async (signal?: AbortSignal) => {
    if (!mounted) return;
    try {
      const res = await api.get('/Customer/getBalanceAtWallet', { signal });
      if (res.data?.balance !== undefined) setWalletBalance(res.data.balance);
    } catch {}
  }, [mounted]);

  const fetchOrders = useCallback(async (signal?: AbortSignal) => {
    if (!mounted) return;
    setIsOrdersLoading(true);
    try {
      const ordersRes = await api.get('/customer/orders', { signal });
      const ordersRows: OrderRowFromAPI[] = ordersRes.data.orders || [];
      const ordersMap = new Map<number, Order>();

      ordersRows.forEach(row => {
        if (!ordersMap.has(row.id)) {
          ordersMap.set(row.id, {
            id: row.id,
            restaurant_id: row.restaurant_id,
            restaurant_name: row.restaurant_name,
            order_date: row.created_at,
            total_amount: row.total_amount,
            status: row.status,
            is_reservation: row.is_reservation,
            payment_status: row.payment_status,
            reservation_date: row.reservation_date || undefined,
            items: []
          });
        }
        const order = ordersMap.get(row.id)!;
        const existing = order.items?.find(i => i.dish_id === row.dish_id);
        if (existing) {
          existing.quantity += 1;
        } else {
          order.items?.push({
            id: row.dish_id,
            dish_id: row.dish_id,
            name: row.dish_name,
            price: row.dish_price,
            image: row.dish_image,
            quantity: 1
          });
        }
      });

      setOrders(Array.from(ordersMap.values()));
    } catch {
      setOrders([]);
    } finally {
      setIsOrdersLoading(false);
    }
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    const controller = new AbortController();
    const load = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchProfile(controller.signal),
        fetchWalletBalance(controller.signal),
        fetchOrders(controller.signal),
      ]);
      setIsLoading(false);
    };
    load();
    return () => controller.abort();
  }, [fetchProfile, fetchWalletBalance, fetchOrders, mounted]);

  const handleProfileUpdate = async (name: string, phone: string) => {
    await api.put('/customer/change-info', { name, phone });
    await fetchProfile();
  };

 

  return (
    <ProtectedRoute role="customer">
      <div
        className="min-h-screen bg-white"
        style={{ paddingBottom: 'calc(72px + env(safe-area-inset-bottom))' }}
      >
        {/* Hero Header — يحتوي على الـ avatar والـ edit button */}
        <ProfileHeader
          user={isLoading ? null : user}
          onEditClick={() => setIsEditModalOpen(true)}
        />

        {/* Wallet */}
        <WalletCard balance={walletBalance} isLoading={isLoading} />

        {/* Orders */}
        <OrdersSection
          orders={orders}
          isLoading={isOrdersLoading}
        />

        {/* Edit Modal */}
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          user={user}
          onSave={handleProfileUpdate}
        />

  

        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#1A1A1A',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 16px',
              fontSize: '14px',
              fontWeight: 500,
            },
          }}
        />
      </div>
    </ProtectedRoute>
  );
}