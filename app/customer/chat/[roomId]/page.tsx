'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Pusher from 'pusher-js';
import api from '@/lib/api';
import { ProtectedRoute } from '@/app/context/AuthContext';
import { ChatMessage, ChatRoom } from '@/types';
import { ArrowLeft, Send, Phone, Info, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ChatRoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = parseInt(params.roomId as string, 10);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [roomInfo, setRoomInfo] = useState<ChatRoom | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pusherRef = useRef<Pusher | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (!roomId || isNaN(roomId)) return;

    const fetchData = async () => {
      try {
        const roomsRes = await api.get('/customer/chat-rooms');
        const rooms = roomsRes.data.rooms || roomsRes.data || [];
        const room = rooms.find((r: ChatRoom) => r.id === roomId);
        if (room) setRoomInfo(room);
      } catch {
        // مش critical
      }

      try {
        const res = await api.get(`/customer/chat-messages/${roomId}`);
        const msgs = res.data?.messages || [];
        if (msgs.length > 0) {
          setMessages(msgs);
          setTimeout(scrollToBottom, 100);
        }
      } catch {
        // هنعتمد على Pusher channel history
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [roomId, scrollToBottom]);

  useEffect(() => {
    if (!roomId || isNaN(roomId)) {
      setError('معرف الغرفة غير صالح');
      return;
    }

    const pusher = new Pusher('39ade55f3979c3c6e71b', {
      cluster: 'eu',
    });

    pusherRef.current = pusher;

    const channel = pusher.subscribe(`room-${roomId}`);

    channel.bind('pusher:subscription_succeeded', () => {
      setIsConnected(true);
    });

    channel.bind('pusher:subscription_error', () => {
      setIsConnected(false);
    });

    channel.bind('new-message', (message: ChatMessage) => {
      setMessages((prev) => {
        const exists = prev.some((m) => m.id === message.id);
        if (exists) return prev;
        return [...prev, message];
      });
      setTimeout(scrollToBottom, 100);
    });

    pusher.connection.bind('connected', () => setIsConnected(true));
    pusher.connection.bind('disconnected', () => setIsConnected(false));
    pusher.connection.bind('error', () => {
      setIsConnected(false);
    });

    return () => {
      pusher.unsubscribe(`room-${roomId}`);
      pusher.disconnect();
      pusherRef.current = null;
      setIsConnected(false);
    };
  }, [roomId, scrollToBottom]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const message = inputMessage.trim();
    if (!message || isSending) return;

    setIsSending(true);
    setInputMessage('');

    try {
      await api.post(`/room/${roomId}/message`, { message });
    } catch (err) {
      toast.error('فشل إرسال الرسالة، حاول مرة أخرى');
      setInputMessage(message);
    } finally {
      setIsSending(false);
    }
  };

  const formatMessageTime = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleTimeString('ar-EG', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  const groupedMessages = messages.reduce((groups, message) => {
    const date = new Date(message.created_at).toLocaleDateString('ar-EG');
    if (!groups[date]) groups[date] = [];
    groups[date].push(message);
    return groups;
  }, {} as Record<string, ChatMessage[]>);

  return (
    <ProtectedRoute role="customer">
      <div className="h-screen flex flex-col" dir="rtl">
        <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => router.push('/customer/chat')}
              className="p-2 -mr-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[#1A1A2E]" />
            </button>

            <div className="flex-1 text-center px-4">
              <h1 className="font-bold text-[#1A1A2E] truncate">
                {roomInfo?.restaurant_name || 'المحادثة'}
              </h1>
              <p className="text-xs flex items-center justify-center gap-1">
                <span
                  className={`inline-block w-1.5 h-1.5 rounded-full ${
                    isConnected ? 'bg-green-500' : 'bg-gray-300 animate-pulse'
                  }`}
                />
                <span className={isConnected ? 'text-green-600' : 'text-[#9CA3AF]'}>
                  {isConnected ? 'متصل' : 'جاري الاتصال...'}
                </span>
              </p>
            </div>

            <button className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
              <Info className="w-5 h-5 text-[#6B7280]" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto pb-20">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-[#E5A04D] animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={() => router.push('/customer/chat')}
                className="px-4 py-2 bg-[#E5A04D] text-white rounded-lg"
              >
                العودة للمحادثات
              </button>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-[#FFF8F0] rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-[#E5A04D]" />
              </div>
              <h3 className="text-lg font-medium text-[#1A1A2E] mb-2">ابدأ المحادثة</h3>
              <p className="text-sm text-[#6B7280]">
                يمكنك التواصل مع المطعم بخصوص طلبك هنا
              </p>
            </div>
          ) : (
            Object.entries(groupedMessages).map(([date, dayMessages]) => (
              <div key={date} className="space-y-3">
                <div className="flex items-center justify-center">
                  <span className="text-xs text-[#9CA3AF] bg-gray-100 px-3 py-1 rounded-full">
                    {date}
                  </span>
                </div>

                {dayMessages.map((message, index) => {
                  const isMe = message.sender_role === 'customer';
                  const showSenderName =
                    !isMe &&
                    (index === 0 ||
                      dayMessages[index - 1].sender_id !== message.sender_id);

                  return (
                    <div
                      key={message.id}
                      className={`flex ${isMe ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2 shadow-sm ${
                          isMe
                            ? 'bg-white text-[#1A1A2E]'
                            : 'bg-[#E5A04D] text-white'
                        }`}
                      >
                        {showSenderName && (
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

        <footer className="sticky bottom-0 bg-white">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={isConnected ? 'اكتب رسالتك...' : 'جاري الاتصال...'}
              className="flex-1 bg-gray-100 rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E5A04D]/20"
              disabled={isSending}
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isSending}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                inputMessage.trim() && !isSending
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
      </div>
    </ProtectedRoute>
  );
}