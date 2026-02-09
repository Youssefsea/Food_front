'use client';

import { Phone, Edit2 } from "lucide-react";
import { useState } from "react";
import { EditProfileModal } from "./EditProfileModal";
import { UserProfile } from "../types";

interface ProfileCardProps {
  user: UserProfile | null;
  onProfileUpdate: (name: string, phone: string) => Promise<void>;
  isLoading?: boolean;
}

export function ProfileCard({ user, onProfileUpdate, isLoading }: ProfileCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-[16px] shadow-md p-6 mx-4 mt-4" style={{ borderColor: '#E5E7EB', borderWidth: '1px' }}>
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse mb-4" />
          <div className="h-6 w-32 bg-gray-200 animate-pulse rounded mb-3" />
          <div className="h-4 w-40 bg-gray-200 animate-pulse rounded mb-4" />
          <div className="h-10 w-32 bg-gray-200 animate-pulse rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-[16px] shadow-md p-6 mx-4 mt-4" style={{ borderColor: '#E5E7EB', borderWidth: '1px' }}>
        <div className="flex flex-col items-center">
          <div className="relative mb-4">
            <div 
              className="w-24 h-24 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#F9FAFB', border: '2px solid #E5E7EB' }}
            >
              <span style={{ fontSize: '2rem', color: '#9CA3AF' }}>
                {user ? getInitials(user.name) : '??'}
              </span>
            </div>
         
          </div>
          
          <div className="flex items-center gap-2 mb-3">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1A1A1A' }}>
              {user?.name || 'اسم المستخدم'}
            </h2>
          </div>
          
          <div className="flex items-center gap-2 mb-4" style={{ color: '#6B7280' }}>
            <Phone className="w-4 h-4" />
            <span>{user?.phone || '+20 XXX XXX XXXX'}</span>
          </div>
      <div className="h-1"/>

          
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-3 px-6 py-2.5 rounded-lg transition-all active:scale-[0.98] min-h-[44px]"
            style={{ 
              backgroundColor: '#E5A04D',
              color: 'white',
              fontWeight: 500
            
            }}
          >
            <Edit2 className="w-4 h-4" />
            <span>تعديل الملف الشخصي</span>
          </button>
      <div className="h-2"/>

        </div>
      </div>

      <EditProfileModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)}
        user={user}
        onSave={onProfileUpdate}
      />
      

     
    </>
  );
}
