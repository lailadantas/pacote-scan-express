
import RequestToast from '@/components/RequestToast';

interface ToastState {
  show: boolean;
  type: 'loading' | 'success' | 'error';
  title: string;
  description?: string;
}

interface BipagemToastManagerProps {
  toast: ToastState;
  onClose: () => void;
}

const BipagemToastManager = ({ toast, onClose }: BipagemToastManagerProps) => {
  if (!toast.show) return null;

  return (
    <RequestToast
      type={toast.type}
      title={toast.title}
      description={toast.description}
      onClose={onClose}
    />
  );
};

export default BipagemToastManager;
