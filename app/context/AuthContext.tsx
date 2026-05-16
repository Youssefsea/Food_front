'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
// تأكد من مسار ملف الـ API بشكل صحيح هنا
import { setCustomerToken, setVendorToken, setAdminToken, clearAllTokens } from '@/lib/api'; 

interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'vendor' | 'restaurant' | 'admin';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
  refreshUser: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initUser = () => {
      const savedUser = Cookies.get('user');
      const token = Cookies.get('token');
      
      if (savedUser && token) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          // Invalid user data, skip
        }
      }
      setLoading(false);
    };
    
    initUser();
  }, []);

  const login = (userData: User, token: string) => {
    setUser(userData);
    
    Cookies.set('user', JSON.stringify(userData), { expires: 7 });

    const normalizedRole = userData.role === 'restaurant' ? 'vendor' : userData.role;
    if (normalizedRole === 'customer') {
      setCustomerToken(token);
    } else if (normalizedRole === 'vendor') {
      setVendorToken(token);
    } else if (normalizedRole === 'admin') {
      setAdminToken(token);
    }
  };

  const logout = () => {
    setUser(null);
    clearAllTokens(); // تمسح كل شيء من الـ Cookies والـ LocalStorage والـ Axios
  };

  const refreshUser = () => {
    const savedUser = Cookies.get('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    refreshUser,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export function ProtectedRoute({ 
  children, 
  role 
}: { 
  children: React.ReactNode; 
  role?: 'customer' | 'vendor' | 'restaurant' | 'admin' 
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/login');
      } else if (role) {
        // Normalize roles: backend returns 'restaurant', frontend uses 'vendor'
        const userRole = user.role === 'restaurant' ? 'vendor' : user.role;
        const requiredRole = role === 'restaurant' ? 'vendor' : role;
        if (userRole !== requiredRole) {
          router.replace('/'); // توجيه غير المصرح لهم للصفحة الرئيسية
        }
      }
    }
  }, [user, loading, router, role]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#E5A04D] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#6B7280]">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return <>{children}</>;
}
