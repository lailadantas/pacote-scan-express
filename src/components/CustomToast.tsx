
import { Check, AlertTriangle, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CustomToastProps {
  type: 'success' | 'warning' | 'error';
  title: string;
  description?: string;
  duration?: number;
  onClose: () => void;
}

const CustomToast = ({ type, title, description, duration = 3000, onClose }: CustomToastProps) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        const decrement = 100 / (duration / 50);
        const newProgress = prev - decrement;
        return newProgress <= 0 ? 0 : newProgress;
      });
    }, 50);

    return () => {
      clearTimeout(timer);
      clearInterval(progressTimer);
    };
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <Check className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'error':
        return <X className="w-5 h-5 text-red-600" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50 border-green-200',
          progress: 'bg-green-500'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50 border-yellow-200',
          progress: 'bg-yellow-500'
        };
      case 'error':
        return {
          bg: 'bg-red-50 border-red-200',
          progress: 'bg-red-500'
        };
    }
  };

  const colors = getColors();

  return (
    <div className={`fixed top-4 right-4 z-50 ${colors.bg} border rounded-lg shadow-lg p-4 max-w-sm w-full`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
          {description && (
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      {/* Progress bar */}
      <div className="mt-3 w-full bg-gray-200 rounded-full h-1">
        <div 
          className={`h-1 rounded-full transition-all duration-75 ease-linear ${colors.progress}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default CustomToast;
