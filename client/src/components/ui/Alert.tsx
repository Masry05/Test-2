import { XCircle } from 'lucide-react';
import { createPortal } from 'react-dom';

interface AlertProps {
    message: string;
    type?: 'error' | 'success';
    onClose?: () => void;
}

const Alert = ({ message, type = 'error', onClose }: AlertProps) => {
    return createPortal(
        <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[9999]
                     flex items-center gap-3 p-6 rounded-xl shadow-2xl border animate-in fade-in zoom-in-95 duration-200
                     min-w-[300px] max-w-md
      ${type === 'error' ? 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-500/50 dark:text-red-200' : 'bg-green-50 border-green-200 text-green-800'}
    `}>
            <XCircle className="w-6 h-6 shrink-0" />
            <span className="text-base font-medium flex-1">{message}</span>
            {onClose && (
                <button onClick={onClose} className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors">
                    ✕
                </button>
            )}
        </div>,
        document.body
    );
};

export default Alert;
