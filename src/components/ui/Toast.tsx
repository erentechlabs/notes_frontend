import { useEffect } from 'react';
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react';

export type ToastType = 'error' | 'success' | 'info';

interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  onClose: (id: string) => void;
  duration?: number;
}

export default function Toast({ id, message, type, onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  const icons = {
    error: AlertCircle,
    success: CheckCircle,
    info: Info,
  };

  const styles = {
    error: 'bg-red-500 border-red-600',
    success: 'bg-green-500 border-green-600',
    info: 'bg-blue-500 border-blue-600',
  };

  const Icon = icons[type];

  return (
    <div
      className={`${styles[type]} border-l-4 rounded-lg shadow-lg p-4 flex items-start gap-3 min-w-[320px] max-w-md animate-slide-in-right`}
      role="alert"
    >
      <Icon className="h-5 w-5 text-white flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-white font-medium text-sm leading-relaxed">{message}</p>
      </div>
      <button
        onClick={() => onClose(id)}
        className="text-white/80 hover:text-white transition-colors flex-shrink-0"
        aria-label="Close notification"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}
