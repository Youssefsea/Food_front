'use client';

import { useEffect, useState, useCallback } from "react";
import { Toaster } from "sonner";
import api from "@/lib/api";
import { ProfileHeader } from "./components/ProfileHeader";
import { ProfileCard } from "./components/ProfileCard";
import { WalletCard } from "./components/WalletCard";
import { OrdersSection } from "./components/OrdersSection";
import { ChatModal } from "./components/ChatModal";
import { UserProfile, Order, OrderRowFromAPI } from "./types";
import { ProtectedRoute } from "../context/AuthContext";

export default function ProfilePage() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOrdersLoading, setIsOrdersLoading] = useState(true);

  // Chat state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [selectedRestaurantName, setSelectedRestaurantName] = useState("");

  // Mount guard - fix for first-visit data loading bug
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch user profile
  const fetchProfile = useCallback(async (signal?: AbortSignal) => {
    if (!mounted) return;
    try {
      const response = await api.get('/customer/profile', { signal });
      if (response.data?.user) {
        setUser(response.data.user);
      }
    } catch (error) {
    }
  }, [mounted]);

  // Fetch wallet balance
  const fetchWalletBalance = useCallback(async (signal?: AbortSignal) => {
    if (!mounted) return;
    try {
      const response = await api.get('/Customer/getBalanceAtWallet', { signal });
      if (response.data?.balance !== undefined) {
        setWalletBalance(response.data.balance);
      }
    } catch (_error) {
    }
  }, [mounted]);

  // Fetch orders from backend
  const fetchOrders = useCallback(async (signal?: AbortSignal) => {
    if (!mounted) return;
    setIsOrdersLoading(true);
    try {
      const ordersRes = await api.get('/customer/orders', { signal });
      const ordersRows: OrderRowFromAPI[] = ordersRes.data.orders || [];
      
      // Group rows by order ID since each dish is a separate row
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
        
        // Add dish item to order
        const order = ordersMap.get(row.id)!;
        const existingItem = order.items?.find(item => item.dish_id === row.dish_id);
        
        if (existingItem) {
          existingItem.quantity += 1;
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
    } catch (_error) {
      setOrders([]);
    } finally {
      setIsOrdersLoading(false);
    }
  }, [mounted]);

  // Initial data fetch
  useEffect(() => {
    if (!mounted) return;
    const controller = new AbortController();
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchProfile(controller.signal),
        fetchWalletBalance(controller.signal),
        fetchOrders(controller.signal)
      ]);
      setIsLoading(false);
    };

    loadData();
    return () => controller.abort();
  }, [fetchProfile, fetchWalletBalance, fetchOrders, mounted]);

  // Handle profile update
  const handleProfileUpdate = async (name: string, phone: string) => {
    await api.put('/customer/change-info', { name, phone });
    await fetchProfile(); // Refresh profile data
  };

  // Handle chat click
  const handleChatClick = (orderId: number, restaurantName: string) => {
    setSelectedOrderId(orderId);
    setSelectedRestaurantName(restaurantName);
    setIsChatOpen(true);
  };

  // Close chat
  const handleCloseChat = () => {
    setIsChatOpen(false);
    setSelectedOrderId(null);
    setSelectedRestaurantName("");
  };

  return (
    <ProtectedRoute role="customer">
      <div 
      className="min-h-screen"
      style={{ 
        backgroundColor: '#FFFFFF',
        paddingBottom: 'calc(72px + env(safe-area-inset-bottom))'
      }}
    >
      <ProfileHeader />
      <div className="h-1"/>
      
      <main className="overflow-y-auto">
        <ProfileCard 
          user={user}
          onProfileUpdate={handleProfileUpdate}
          isLoading={isLoading}
        />
      <div className="h-2"/>
        
        <WalletCard 
          balance={walletBalance}
          isLoading={isLoading}
        />
      <div className="h-2"/>

        
        <OrdersSection 
          orders={orders}
          isLoading={isOrdersLoading}
          onChatClick={handleChatClick}
        />
      </main>

      {selectedOrderId && (
        <ChatModal
          isOpen={isChatOpen}
          onClose={handleCloseChat}
          orderId={selectedOrderId}
          restaurantName={selectedRestaurantName}
        />
      )}
      
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
