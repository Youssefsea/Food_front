'use client';

import { useEffect, useState, useCallback } from "react";
import { Toaster } from "sonner";
import api from "../../axios";
import { ProfileHeader } from "./components/ProfileHeader";
import { ProfileCard } from "./components/ProfileCard";
import { WalletCard } from "./components/WalletCard";
import { OrdersSection } from "./components/OrdersSection";
import { ChatModal } from "./components/ChatModal";
import { BottomNavigation } from "../explore/componentForExplore/BottomNavigation";
import { UserProfile, Order, OrderRowFromAPI } from "./types";

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOrdersLoading, setIsOrdersLoading] = useState(true);
  
  // Chat state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [selectedRestaurantName, setSelectedRestaurantName] = useState("");

  // Fetch user profile
  const fetchProfile = useCallback(async () => {
    try {
      const response = await api.get('/customer/profile');
      if (response.data?.user) {
        setUser(response.data.user);
      }
    } catch (error) {
    }
  }, []);

  // Fetch wallet balance
  const fetchWalletBalance = useCallback(async () => {
    try {
      const response = await api.get('/Customer/getBalanceAtWallet');
      if (response.data?.balance !== undefined) {
        setWalletBalance(response.data.balance);
      }
    } catch (error) {
    }
  }, []);

  // Fetch orders from backend
  const fetchOrders = useCallback(async () => {
    setIsOrdersLoading(true);
    try {
      const ordersRes = await api.get('/customer/orders');
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
    } catch (error) {
      setOrders([]);
    } finally {
      setIsOrdersLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchProfile(),
        fetchWalletBalance(),
        fetchOrders()
      ]);
      setIsLoading(false);
    };

    loadData();
  }, [fetchProfile, fetchWalletBalance, fetchOrders]);

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

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        /* Support for safe areas */
        @supports (padding: env(safe-area-inset-top)) {
          body {
            padding-top: env(safe-area-inset-top);
          }
        }
        
        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
        }
        
        /* Active/touch feedback */
        button:active {
          transform: scale(0.98);
        }
        
        /* CSS variable for bottom nav */
        :root {
          --bottom-nav-height: 72px;
        }
      `}</style>

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
  );
}
