import { CheckCircle, XCircle, X } from 'lucide-react';
import { useEffect } from 'react';

interface ToastProps {
  type: 'success' | 'error';
  message: string;
  onClose: () => void;
}

export function Toast({ type, message, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] animate-slide-down">
      <div
        className={`flex items-center gap-3 px-5 py-4 rounded-xl shadow-xl border-r-4 ${
          type === 'success'
            ? 'bg-[#D1FAE5] border-[#10B981]'
            : 'bg-[#FEE2E2] border-[#EF4444]'
        }`}
        style={{ minWidth: '320px', maxWidth: '400px' }}
      >
        {type === 'success' ? (
          <CheckCircle className="w-5 h-5 text-[#10B981] flex-shrink-0" />
        ) : (
          <XCircle className="w-5 h-5 text-[#EF4444] flex-shrink-0" />
        )}
        <span className="text-sm text-[#1A1A1A] flex-1">{message}</span>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/50 rounded transition-colors flex-shrink-0"
        >
          <X className="w-4 h-4 text-[#6B7280]" />
        </button>
      </div>

      <style>{`
        @keyframes slide-down {
          from {
            transform: translate(-50%, -100%);
            opacity: 0;
          }
          to {
            transform: translate(-50%, 0);
            opacity: 1;
          }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
