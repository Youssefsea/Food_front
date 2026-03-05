'use client';

import { X, Send, ArrowLeft, WifiOff } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import api from "../../../axios";
import { ChatMessage } from "../types";
import Cookies from "js-cookie";

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: number;
  restaurantName: string;
}

// Helper to get current user ID from JWT token
const getCurrentUserId = (tokenKey: string): number | null => {
  try {
    const token = localStorage.getItem(tokenKey);
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.id ?? null;
  } catch {
    return null;
  }
};

export function ChatModal({ isOpen, onClose, orderId, restaurantName }: ChatModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [roomId, setRoomId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [noRoomExists, setNoRoomExists] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Get current user ID from token on mount
  useEffect(() => {
    const id = getCurrentUserId('customerToken');
    setCurrentUserId(id);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch chat room and messages
  const fetchChatRoom = useCallback(async () => {
    if (!orderId) return;
    
    setIsLoading(true);
    setError(null);
    setNoRoomExists(false);
    
    try {
      const roomRes = await api.get(`/customer/chat-room/order/${orderId}`);
      const room = roomRes.data.room;
      
      if (room) {
        setRoomId(room.id);
        
        const messagesRes = await api.get(`/customer/chat-messages/${room.id}`);
        setMessages(messagesRes.data.messages || []);
      } else {
        setNoRoomExists(true);
      }
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { status: number } };
        if (axiosError.response?.status === 404) {
          setNoRoomExists(true);
          setMessages([]);
        } else {
          setError('فشل في تحميل المحادثة');
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    if (!isOpen || !roomId) {
      return;
    }

    let token = localStorage.getItem('customerToken') || undefined;
    
    if (!token) {
      token = Cookies.get('customerToken') || undefined;
    }
    
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    socketRef.current = io('https://19d086e548570852.preview.oblien.com', {
      auth: token ? { token } : {},
      withCredentials: true,
      transports: ['websocket', 'polling'],
      forceNew: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    socketRef.current.on('connect', () => {
      setIsConnected(true);
      setError(null);
      socketRef.current?.emit('joinRoom', roomId);
    });

    socketRef.current.on('connect_error', (_err) => {
      setIsConnected(false);
      setError('فشل في الاتصال بالخادم');
    });

    socketRef.current.on('joinedRoom', (_data) => {
    });

    socketRef.current.on('previousMessages', (msgs: ChatMessage[]) => {
      setMessages(msgs);
    });

    socketRef.current.on('newMessage', (msg: ChatMessage) => {
      setMessages(prev => [...prev, msg]);
    });

    socketRef.current.on('error', (error: { message: string }) => {
      setError(error.message);
    });

    socketRef.current.on('disconnect', (_reason) => {
      setIsConnected(false);
    });

    return () => {
      if (roomId && socketRef.current) {
        socketRef.current.emit('leaveRoom', roomId);
      }
      socketRef.current?.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    };
  }, [isOpen, roomId]);

  useEffect(() => {
    if (!isOpen) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setRoomId(null);
      setMessages([]);
      setError(null);
      setIsConnected(false);
      setNoRoomExists(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      fetchChatRoom();
    }
  }, [isOpen, fetchChatRoom]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isSending) return;

    if (!roomId) {
      setError('غرفة المحادثة غير متوفرة');
      return;
    }

    if (!socketRef.current?.connected) {
      setError('غير متصل بالخادم، يرجى الانتظار...');
      return;
    }

    setIsSending(true);
    
    try {
      socketRef.current.emit('sendMessage', {
        roomId,
        message: newMessage.trim()
      });
      setNewMessage("");
    } catch {
      setError('فشل في إرسال الرسالة');
    } finally {
      setIsSending(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('ar-EG', { 
        hour: '2-digit', 
        minute: '2-digit'
      });
    } catch {
      return '';
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 top-0 flex flex-col bg-white"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <header 
        className="sticky top-0 z-10 bg-white shadow-sm flex items-center gap-3 px-4"
        style={{ height: '56px', borderBottom: '1px solid #E5E7EB' }}
      >
        <button 
          onClick={onClose}
          className="flex items-center justify-center min-w-[44px] min-h-[44px] -ml-2 rounded-full active:bg-gray-100 transition-colors"
          aria-label="Close chat"
        >
          <ArrowLeft className="w-6 h-6" style={{ color: '#1A1A1A' }} />
        </button>
        
        <div className="flex items-center gap-3 flex-1">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
            style={{ backgroundColor: '#FEF3E2' }}
          >
            <span style={{ fontSize: '1.25rem' }}>🍽️</span>
          </div>
          <div className="flex-1 min-w-0">
            <h2 
              className="truncate"
              style={{ fontSize: '1rem', fontWeight: 600, color: '#1A1A1A' }}
            >
              {restaurantName}
            </h2>
            <div className="flex items-center gap-2">
              <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                طلب #{orderId}
              </span>
              {roomId && (
                <div className="flex items-center gap-1">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: isConnected ? '#10B981' : '#EF4444' }}
                  />
                  <span style={{ fontSize: '0.625rem', color: isConnected ? '#10B981' : '#EF4444' }}>
                    {isConnected ? 'متصل' : 'غير متصل'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="flex items-center justify-center min-w-[44px] min-h-[44px] -mr-2 rounded-full active:bg-gray-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-6 h-6" style={{ color: '#6B7280' }} />
        </button>
      </header>
<div className="h-1"/>
      <div 
        className="flex-1 overflow-y-auto p-4"
        style={{ backgroundColor: '#F9FAFB' }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
                style={{ borderColor: '#E5A04D', borderTopColor: 'transparent' }}
              />
              <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>جاري تحميل المحادثة...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p style={{ fontSize: '0.875rem', color: '#EF4444', marginBottom: '8px' }}>{error}</p>
              <button 
                onClick={fetchChatRoom}
                className="px-4 py-2 rounded-lg"
                style={{ backgroundColor: '#E5A04D', color: 'white', fontWeight: 500 }}
              >
                إعادة المحاولة
              </button>
            </div>
          </div>
        ) : noRoomExists ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ backgroundColor: '#FEE2E2' }}
              >
                <WifiOff className="w-8 h-8" style={{ color: '#EF4444' }} />
              </div>
              <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '4px' }}>
                غرفة المحادثة غير متوفرة
              </p>
              <p style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                لم يتم إنشاء غرفة محادثة لهذا الطلب بعد
              </p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ backgroundColor: '#FEF3E2' }}
              >
                <span style={{ fontSize: '2rem' }}>💬</span>
              </div>
              <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '4px' }}>
                ابدأ المحادثة مع المطعم
              </p>
              <p style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                {isConnected ? 'يمكنك إرسال ملاحظات أو استفسارات عن طلبك' : 'جاري الاتصال...'}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            {messages.map((msg, index) => {
              const isMe = currentUserId != null && Number(msg.sender_id) === currentUserId;
              const prevMsg = index > 0 ? messages[index - 1] : null;
              const nextMsg = index < messages.length - 1 ? messages[index + 1] : null;
              const sameSenderAsPrev = prevMsg && Number(prevMsg.sender_id) === Number(msg.sender_id);
              const sameSenderAsNext = nextMsg && Number(nextMsg.sender_id) === Number(msg.sender_id);

              // WhatsApp-like: show name only on first message of a consecutive group from the other person
              const showName = !isMe && !sameSenderAsPrev;
              // Spacing: add more gap when sender changes
              const topMargin = sameSenderAsPrev ? '2px' : '12px';
              // Bubble radius: round inner corners for grouped messages
              const borderRadius = isMe
                ? `18px ${sameSenderAsPrev ? '6px' : '18px'} ${sameSenderAsNext ? '6px' : '18px'} 18px`
                : `${sameSenderAsPrev ? '6px' : '18px'} 18px 18px ${sameSenderAsNext ? '6px' : '18px'}`;

              return (
                <div
                  key={msg.id}
                  className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                  style={{ marginTop: index === 0 ? '0' : topMargin }}
                >
                  <div
                    className="max-w-[75%] px-3.5 py-2 shadow-sm break-words relative  "
                    style={{
                      backgroundColor: isMe ? '#E5A04D' : '#FFFFFF',
                      color: isMe ? 'white' : '#1A1A1A',
                      boxShadow: isMe ? 'none' : '0 1px 2px rgba(0,0,0,0.06)',
                      borderRadius,
                      paddingRight: isMe ? '10px' : '14px',
                      paddingLeft: isMe ? '14px' : '10px',
                      paddingTop: '8px',
                      paddingBottom: '8px',

                    }}
                  >
                    {showName && (
                      <p
                        className="mb-0.5"
                        style={{ fontSize: '0.75rem', fontWeight: 600, color: '#E5A04D' }}
                      >
                        {msg.sender_name || restaurantName}
                      </p>
                    )}
                    <p style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>
                      {msg.message}
                    </p>
                    <p
                      className="mt-0.5"
                      style={{
                        fontSize: '0.625rem',
                        textAlign: isMe ? 'left' : 'right',
                        color: isMe ? 'rgba(255,255,255,0.7)' : '#9CA3AF',
                      }}
                    >
                      {formatTime(msg.created_at)}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div 
        className="sticky bottom-0 bg-white border-t px-4 py-3"
        style={{ borderColor: '#E5E7EB' }}
      >
        {!isConnected && roomId && !isLoading && (
          <div 
            className="flex items-center justify-center gap-2 mb-2 py-2 rounded-lg"
            style={{ backgroundColor: '#FEF3C7' }}
          >
            <div 
              className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: '#F59E0B', borderTopColor: 'transparent' }}
            />
            <span style={{ fontSize: '0.75rem', color: '#92400E' }}>جاري الاتصال بالخادم...</span>
          </div>
        )}
        <div className="flex  items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={noRoomExists ? 'المحادثة غير متوفرة' : 'اكتب رسالتك...'}
            className="flex-1 px-4 py-3 rounded-full min-h-12"
            style={{
              backgroundColor: '#F3F4F6',
              border: 'none',
              fontSize: '0.875rem',
              color: '#1A1A1A'
            }}
            dir="rtl"
            disabled={isLoading || !!error || noRoomExists || !isConnected}
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isSending || isLoading || !!error || noRoomExists || !isConnected}
            className="flex items-center justify-center min-w-12 min-h-12 rounded-full transition-all active:scale-95"
            style={{
              backgroundColor: newMessage.trim() && !isSending && isConnected ? '#E5A04D' : '#E5E7EB',
              color: newMessage.trim() && !isSending && isConnected ? 'white' : '#9CA3AF'
            }}
            aria-label="Send message"
          >
            {isSending ? (
              <div 
                className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: 'white', borderTopColor: 'transparent' }}
              />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
