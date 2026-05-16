'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Pusher from 'pusher-js';
import api from '@/lib/api';
import { ProtectedRoute } from '@/app/context/AuthContext';
import { ChatMessage, ChatRoom } from '@/types';
import { ArrowLeft, Send, Phone, Loader2, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

export default function VendorChatRoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = parseInt(params.roomId as string, 10);

  const [messages, setMessages]           = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage]   = useState('');
  const [roomInfo, setRoomInfo]           = useState<ChatRoom | null>(null);
  const [isLoading, setIsLoading]         = useState(true);
  const [isConnected, setIsConnected]     = useState(false);
  const [isSending, setIsSending]         = useState(false);
  const [error, setError]                 = useState<string | null>(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const pusherRef      = useRef<Pusher | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef  = useRef<HTMLDivElement>(null);
  const inputRef       = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  const handleScroll = useCallback(() => {
    const el = scrollAreaRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShowScrollBtn(distanceFromBottom > 150);
  }, []);

  // ── جلب الرسائل ──
  useEffect(() => {
    if (!params.roomId) return; // لسه مجاش
    if (isNaN(roomId)) return;

    const fetchData = async () => {
      try {
        const roomsRes = await api.get('/customer/chat-rooms');
        const rooms = roomsRes.data.rooms || roomsRes.data || [];
        const room = rooms.find((r: ChatRoom) => r.id === roomId);
        if (room) setRoomInfo(room);
      } catch { /* not critical */ }

      try {
        const res = await api.get(`/customer/chat-messages/${roomId}`);
        const msgs = res.data?.messages || [];
        if (msgs.length > 0) {
          setMessages(msgs);
          setTimeout(() => scrollToBottom('instant'), 100);
        }
      } catch { /* rely on Pusher */ }
      finally { setIsLoading(false); }
    };

    fetchData();
  }, [roomId, params.roomId, scrollToBottom]);

  // ── Pusher ──
  useEffect(() => {
    if (!params.roomId) return; // لسه مجاش

    if (isNaN(roomId)) {
      setError('معرف الغرفة غير صالح');
      setIsLoading(false);
      return;
    }

    const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY || '39ade55f3979c3c6e71b';
    const pusher = new Pusher(pusherKey, { cluster: 'eu' });
    pusherRef.current = pusher;

    const channel = pusher.subscribe(`room-${roomId}`);

    channel.bind('pusher:subscription_succeeded', () => setIsConnected(true));
    channel.bind('pusher:subscription_error',     () => setIsConnected(false));

    channel.bind('new-message', (message: ChatMessage) => {
      setMessages(prev => {
        if (prev.some(m => m.id === message.id)) return prev;
        return [...prev, message];
      });
      setTimeout(() => scrollToBottom('smooth'), 100);
    });

    pusher.connection.bind('connected',    () => setIsConnected(true));
    pusher.connection.bind('disconnected', () => setIsConnected(false));
    pusher.connection.bind('error',        () => setIsConnected(false));

    return () => {
      pusher.unsubscribe(`room-${roomId}`);
      pusher.disconnect();
      pusherRef.current = null;
      setIsConnected(false);
    };
  }, [roomId, params.roomId, scrollToBottom]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const message = inputMessage.trim();
    if (!message || isSending) return;

    setIsSending(true);
    setInputMessage('');

    try {
      await api.post(`/room/${roomId}/message`, { message });
    } catch {
      toast.error('فشل إرسال الرسالة، حاول مرة أخرى');
      setInputMessage(message);
    } finally {
      setIsSending(false);
      inputRef.current?.focus();
    }
  };

  const formatTime = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleTimeString('ar-EG', {
        hour: '2-digit', minute: '2-digit',
      });
    } catch { return ''; }
  };

  const formatDateLabel = (dateStr: string) => {
    const today     = new Date().toLocaleDateString('ar-EG');
    const yesterday = new Date(Date.now() - 86400000).toLocaleDateString('ar-EG');
    if (dateStr === today)     return 'اليوم';
    if (dateStr === yesterday) return 'أمس';
    return dateStr;
  };

  const groupedMessages = messages.reduce((groups, msg) => {
    const date = new Date(msg.created_at).toLocaleDateString('ar-EG');
    if (!groups[date]) groups[date] = [];
    groups[date].push(msg);
    return groups;
  }, {} as Record<string, ChatMessage[]>);

  return (
    <ProtectedRoute role="customer">
      <div className="h-dvh flex flex-col bg-[#F5F5F5]" dir="rtl">

        {/* ── Header ── */}
        <header className="flex-shrink-0 bg-white border-b border-gray-100 px-4 py-3">
          <div className="flex items-center gap-3">

            <button
              onClick={() => router.push('/customer/chat')}
              className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors flex-shrink-0"
            >
              <ArrowLeft className="w-5 h-5 text-[#1A1A2E]" />
            </button>

            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E5A04D] to-[#d4894a] flex items-center justify-center flex-shrink-0 shadow-sm">
              <span className="text-white text-sm font-bold">
                {(roomInfo?.customer_name || 'ع').charAt(0)}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="font-bold text-[#1A1A2E] text-sm truncate">
                {roomInfo?.customer_name || 'العميل'}
              </h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                  isConnected ? 'bg-emerald-500' : 'bg-gray-300 animate-pulse'
                }`} />
                <span className={`text-[11px] ${
                  isConnected ? 'text-emerald-600' : 'text-[#9CA3AF]'
                }`}>
                  {isConnected ? 'متصل الآن' : 'جاري الاتصال...'}
                </span>
              </div>
            </div>

            {/* Order info */}
            {roomInfo && (
              <div className="flex-shrink-0 text-left">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  roomInfo.order_status === 'completed' ? 'bg-green-100 text-green-700' :
                  roomInfo.order_status === 'cancelled' ? 'bg-red-100 text-red-700' :
                  'bg-amber-100 text-amber-700'
                }`}>
                  طلب #{roomInfo.order_id}
                </span>
              </div>
            )}
          </div>
        </header>

        {/* ── Messages ── */}
        <main
          ref={scrollAreaRef}
          onScroll={handleScroll}
          className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-1"
          style={{ scrollbarWidth: 'none' }}
        >
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 text-[#E5A04D] animate-spin" />
                <p className="text-sm text-[#9CA3AF]">جاري تحميل المحادثة...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-red-500 mb-4 text-sm">{error}</p>
                <button
                  onClick={() => router.push('/customer/chat')}
                  className="px-5 py-2 bg-[#E5A04D] text-white rounded-full text-sm font-medium"
                >
                  العودة للمحادثات
                </button>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#FFF8F0] rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-[#E5A04D]/20">
                  <Phone className="w-7 h-7 text-[#E5A04D]" />
                </div>
                <h3 className="text-base font-bold text-[#1A1A2E] mb-1">ابدأ المحادثة</h3>
                <p className="text-xs text-[#9CA3AF] max-w-[200px] mx-auto leading-relaxed">
                  تواصل مع العميل بخصوص طلبه مباشرة من هنا
                </p>
              </div>
            </div>
          ) : (
            Object.entries(groupedMessages).map(([date, dayMessages]) => (
              <div key={date}>
                {/* Date separator */}
                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-[11px] text-[#9CA3AF] font-medium px-2 flex-shrink-0">
                    {formatDateLabel(date)}
                  </span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                <div className="space-y-1.5">
                  {dayMessages.map((message, index) => {
                    const isMe = message.sender_role === 'restaurant';
                    const prevMsg = dayMessages[index - 1];
                    const nextMsg = dayMessages[index + 1];
                    const isFirstInGroup = !prevMsg || prevMsg.sender_id !== message.sender_id;
                    const isLastInGroup  = !nextMsg || nextMsg.sender_id !== message.sender_id;

                    return (
                      <div
                        key={message.id}
                        className={`flex items-end gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'} ${
                          isFirstInGroup ? 'mt-3' : 'mt-0.5'
                        }`}
                      >
                        {/* Avatar للعميل */}
                        {!isMe && (
                          <div className={`w-7 h-7 rounded-full flex-shrink-0 ${
                            isLastInGroup
                              ? 'bg-gradient-to-br from-[#E5A04D] to-[#d4894a] flex items-center justify-center'
                              : 'invisible'
                          }`}>
                            {isLastInGroup && (
                              <span className="text-white text-[10px] font-bold">
                                {(message.sender_name || 'ع').charAt(0)}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Bubble */}
                        <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[75%]`}>
                          <div className={`px-4 py-2.5 shadow-sm ${
                            isMe
                              ? `bg-[#E5A04D] text-white ${
                                  isFirstInGroup ? 'rounded-t-2xl' : 'rounded-2xl'
                                } rounded-br-md rounded-bl-2xl`
                              : `bg-white text-[#1A1A2E] ${
                                  isFirstInGroup ? 'rounded-t-2xl' : 'rounded-2xl'
                                } rounded-bl-md rounded-br-2xl border border-gray-100`
                          }`}>
                            <p className="text-sm leading-relaxed">{message.message}</p>
                          </div>

                          {isLastInGroup && (
                            <span className={`text-[10px] mt-1 px-1 ${
                              isMe ? 'text-[#9CA3AF]' : 'text-[#B0B0B0]'
                            }`}>
                              {formatTime(message.created_at)}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </main>

        {/* ── Scroll to bottom button ── */}
        {showScrollBtn && (
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10">
            <button
              onClick={() => scrollToBottom('smooth')}
              className="flex items-center gap-1.5 bg-white shadow-md border border-gray-200 rounded-full px-3 py-1.5 text-xs text-[#6B7280] hover:bg-gray-50 transition-all"
            >
              <ChevronDown className="w-3.5 h-3.5" />
              <span>رسائل جديدة</span>
            </button>
          </div>
        )}

        {/* ── Footer / Input ── */}
        <footer className="flex-shrink-0 bg-white border-t border-gray-100 px-4 py-3">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <div className="flex-1 flex items-center bg-[#F5F5F5] rounded-full px-4 border border-transparent focus-within:border-[#E5A04D]/40 focus-within:bg-white transition-all">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                placeholder={isConnected ? 'اكتب رسالتك...' : 'جاري الاتصال...'}
                className="flex-1 bg-transparent py-3 text-sm text-[#1A1A2E] placeholder:text-[#B0B0B0] outline-none"
                disabled={isSending}
                dir="rtl"
              />
            </div>

            <button
              type="submit"
              disabled={!inputMessage.trim() || isSending}
              className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                inputMessage.trim() && !isSending
                  ? 'bg-[#E5A04D] text-white shadow-md shadow-[#E5A04D]/30 active:scale-95'
                  : 'bg-[#F0F0F0] text-[#C0C0C0]'
              }`}
            >
              {isSending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </form>
        </footer>

      </div>
    </ProtectedRoute>
  );
}