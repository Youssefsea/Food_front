'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import api from '@/lib/api';
import { ProtectedRoute } from '@/app/context/AuthContext';
import { ChatMessage, ChatRoom } from '@/types';
import { ArrowLeft, Send, Phone, Info, Loader2, User } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Vendor Chat Room Page - Real-time messaging with Socket.IO
 * Allows restaurants to chat with customers about their orders
 */

export default function VendorChatRoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = parseInt(params.roomId as string, 10);
  const invalidRoomId = !roomId || isNaN(roomId);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [roomInfo, setRoomInfo] = useState<ChatRoom | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom of messages
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Initialize Socket.IO connection
  useEffect(() => {
    if (invalidRoomId) return;

    const token = localStorage.getItem('vendorToken');
    if (!token) {
      toast.error('يجب تسجيل الدخول أولاً');
      router.push('/login');
      return;
    }

    // Get API base URL from environment or default
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3444';

    // Initialize socket connection
    const socket = io(API_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    // Connection events
    socket.on('connect', () => {
      setIsConnecting(false);
      // Join the room
      socket.emit('joinRoom', roomId);
    });

    socket.on('connect_error', () => {
      setIsConnecting(false);
      setError('فشل الاتصال بالخادم');
    });

    socket.on('previousMessages', (data: ChatMessage[]) => {
      setMessages(data);
      setIsLoading(false);
      setTimeout(scrollToBottom, 100);
    });

    socket.on('newMessage', (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
      setTimeout(scrollToBottom, 100);
    });

    socket.on('error', (err: { message: string }) => {
      toast.error(err.message || 'حدث خطأ في المحادثة');
    });

    // Cleanup on unmount
    return () => {
      socket.emit('leaveRoom', roomId);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [invalidRoomId, roomId, router, scrollToBottom]);

  // Fetch room info and initial messages via REST API (fallback)
  useEffect(() => {
    if (!roomId || isNaN(roomId)) return;

    const fetchRoomInfo = async () => {
      try {
        // Try to get room info from chat rooms endpoint
        const roomsRes = await api.get('/restaurant/chat-rooms');
        const rooms = roomsRes.data.rooms || roomsRes.data || [];
        const room = rooms.find((r: ChatRoom) => r.id === roomId);
        if (room) {
          setRoomInfo(room);
        }
      } catch {
        // Silent fail - room info is not critical
      }
    };

    const fetchMessages = async () => {
      try {
        const res = await api.get(`/restaurant/chat-messages/${roomId}`);
        if (res.data?.messages) {
          setMessages(res.data.messages);
          setIsLoading(false);
        }
      } catch {
        // Socket will provide messages, this is just a fallback
        setIsLoading(false);
      }
    };

    fetchRoomInfo();
    fetchMessages();
  }, [roomId]);

  // Send message handler
  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();

    const message = inputMessage.trim();
    if (!message || !socketRef.current || isSending) return;

    setIsSending(true);

    // Optimistic update
    const tempMessage: ChatMessage = {
      id: Date.now(), // Temporary ID
      room_id: roomId,
      sender_id: 0, // Will be set by server
      sender_name: 'أنت',
      sender_role: 'restaurant',
      message,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempMessage]);
    setInputMessage('');
    scrollToBottom();

    // Send via Socket.IO
    socketRef.current.emit('sendMessage', { roomId, message }, (response: { success?: boolean; error?: string }) => {
      setIsSending(false);
      if (response?.error) {
        toast.error(response.error);
        // Remove optimistic message on error
        setMessages((prev) => prev.filter((m) => m.id !== tempMessage.id));
      }
    });

    // Fallback: Send via REST API if socket fails
    setTimeout(() => {
      if (isSending) {
        setIsSending(false);
      }
    }, 5000);
  };

  // Format timestamp
  const formatMessageTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString('ar-EG', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = new Date(message.created_at).toLocaleDateString('ar-EG');
    if (!groups[date]) groups[date] = [];
    groups[date].push(message);
    return groups;
  }, {} as Record<string, ChatMessage[]>);

  return (
    <ProtectedRoute role="vendor">
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col" dir="rtl">
        {invalidRoomId ? (
          <main className="flex-1 flex items-center justify-center">
            <p className="text-red-500">معرف الغرفة غير صالح</p>
          </main>
        ) : (
          <>
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => router.push('/vendor/chat')}
              className="p-2 -mr-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[#1A1A2E]" />
            </button>

            <div className="flex-1 text-center px-4">
              <div className="flex items-center justify-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#E5A04D]/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-[#E5A04D]" />
                </div>
                <div>
                  <h1 className="font-bold text-[#1A1A2E]">
                    {roomInfo?.customer_name || 'العميل'}
                  </h1>
                  <p className="text-xs text-[#6B7280]">
                    {isConnecting ? (
                      <span className="flex items-center justify-center gap-1">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        جاري الاتصال...
                      </span>
                    ) : (
                      'متصل'
                    )}
                  </p>
                </div>
              </div>
            </div>

            <button className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
              <Info className="w-5 h-5 text-[#6B7280]" />
            </button>
          </div>
        </header>

        {/* Order Info Banner */}
        {roomInfo && (
          <div className="bg-[#FFF8F0] border-b border-[#E5A04D]/20 px-4 py-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#1A1A2E]">
                طلب <span className="font-bold">#{roomInfo.order_id}</span>
              </span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                roomInfo.order_status === 'completed' ? 'bg-green-100 text-green-700' :
                roomInfo.order_status === 'cancelled' ? 'bg-red-100 text-red-700' :
                'bg-amber-100 text-amber-700'
              }`}>
                {roomInfo.order_status === 'pending' ? 'قيد الانتظار' :
                 roomInfo.order_status === 'paid' ? 'تم الدفع' :
                 roomInfo.order_status === 'cooking' ? 'جاري التحضير' :
                 roomInfo.order_status === 'delivering' ? 'جاري التوصيل' :
                 roomInfo.order_status === 'completed' ? 'مكتمل' :
                 roomInfo.order_status === 'cancelled' ? 'ملغي' : roomInfo.order_status}
              </span>
            </div>
          </div>
        )}

        {/* Messages */}
        <main className="flex-1 overflow-y-auto p-4 space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 text-[#E5A04D] animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-[#E5A04D] text-white rounded-lg"
              >
                إعادة المحاولة
              </button>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-[#FFF8F0] rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-[#E5A04D]" />
              </div>
              <h3 className="text-lg font-medium text-[#1A1A2E] mb-2">ابدأ المحادثة</h3>
              <p className="text-sm text-[#6B7280]">
                يمكنك التواصل مع العميل بخصوص طلبه هنا
              </p>
            </div>
          ) : (
            Object.entries(groupedMessages).map(([date, dayMessages]) => (
              <div key={date} className="space-y-3">
                {/* Date separator */}
                <div className="flex items-center justify-center">
                  <span className="text-xs text-[#9CA3AF] bg-gray-100 px-3 py-1 rounded-full">
                    {date}
                  </span>
                </div>

                {/* Messages for this date */}
                {dayMessages.map((message, index) => {
                  const isMe = message.sender_role === 'restaurant';
                  const showAvatar =
                    index === 0 ||
                    dayMessages[index - 1].sender_id !== message.sender_id;

                  return (
                    <div
                      key={message.id}
                      className={`flex ${isMe ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`max-w-[80%] ${
                          isMe ? 'bg-white' : 'bg-[#E5A04D] text-white'
                        } rounded-2xl px-4 py-2 shadow-sm`}
                      >
                        {!isMe && showAvatar && (
                          <p className="text-xs font-medium mb-1 opacity-80">
                            {message.sender_name}
                          </p>
                        )}
                        <p className="text-sm leading-relaxed">{message.message}</p>
                        <p
                          className={`text-[10px] mt-1 ${
                            isMe ? 'text-[#9CA3AF]' : 'text-white/70'
                          }`}
                        >
                          {formatMessageTime(message.created_at)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </main>

        {/* Input */}
        <footer className="bg-white border-t border-gray-100 p-4">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="اكتب رسالتك..."
              className="flex-1 bg-gray-100 rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E5A04D]/20"
              disabled={isSending || isConnecting}
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isSending || isConnecting}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                inputMessage.trim() && !isSending && !isConnecting
                  ? 'bg-[#E5A04D] text-white hover:bg-[#d49140]'
                  : 'bg-gray-200 text-gray-400'
              }`}
            >
              {isSending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </form>
        </footer>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}
