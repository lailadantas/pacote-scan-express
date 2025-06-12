
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Package, AlertTriangle } from 'lucide-react';
import { Pacote } from '@/types/Pacote';

interface PackageDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  pacote: Pacote | null;
}

const PackageDetailsModal = ({ isOpen, onClose, pacote }: PackageDetailsModalProps) => {
  if (!pacote?.trackingStatus) return null;

  const getStatusLabel = (code: string) => {
    switch (code) {
      case '1':
        return 'Coletado';
      case '2':
        return 'Em trânsito';
      case '3':
        return 'Em transferência';
      case '4':
        return 'Entregue';
      default:
        return 'Status desconhecido';
    }
  };

  const getStatusColor = (code: string) => {
    switch (code) {
      case '1':
        return 'bg-blue-100 text-blue-800';
      case '2':
        return 'bg-yellow-100 text-yellow-800';
      case '3':
        return 'bg-orange-100 text-orange-800';
      case '4':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Package className="w-5 h-5 mr-2" />
            Detalhes do Pacote
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Código do Pacote</label>
            <p className="font-mono text-sm bg-gray-50 p-2 rounded mt-1">
              {pacote.trackingStatus.freight_order}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">Status</label>
            <div className="mt-1">
              <Badge className={getStatusColor(pacote.trackingStatus.code_status)}>
                {getStatusLabel(pacote.trackingStatus.code_status)}
              </Badge>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">Observação</label>
            <div className="mt-1 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start">
              <AlertTriangle className="w-4 h-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-yellow-800">
                {pacote.trackingStatus.observation}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PackageDetailsModal;
