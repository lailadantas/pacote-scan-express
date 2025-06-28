
import { useState } from 'react';
import { Package, ChevronUp, ChevronDown, Check, Trash2, ChevronRight, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Pacote } from '@/types/Pacote';
import PackageDetailsModal from './PackageDetailsModal';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PacotesBipadosProps {
  pacotes: Pacote[];
  onRemovePacote: (id: string) => void;
  defaultExpanded?: boolean;
}

const PacotesBipados = ({ pacotes, onRemovePacote, defaultExpanded = false }: PacotesBipadosProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [selectedPacote, setSelectedPacote] = useState<Pacote | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handlePacoteClick = (pacote: Pacote) => {
    if (pacote.status === 'erro') {
      setSelectedPacote(pacote);
      setIsModalOpen(true);
    } else {
      navigate(`/estoque/detalhes/${pacote.codigo}`);
    }
  };

  const getStatusIcon = (pacote: Pacote) => {
    if (pacote.status === 'validado') {
      return <Check className="w-4 h-4 text-green-600" />;
    } else if (pacote.status === 'erro') {
      return <AlertTriangle className="w-4 h-4 text-orange-500" />;
    }
    return <Check className="w-4 h-4 text-green-600" />;
  };

  const getStatusBg = (pacote: Pacote) => {
    if (pacote.status === 'validado') {
      return 'bg-green-100';
    } else if (pacote.status === 'erro') {
      return 'bg-orange-100';
    }
    return 'bg-green-100';
  };

  return (
    <>
      <div className="bg-white border-t border-gray-200 shadow-lg">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center">
            <div className="bg-purple-100 p-2 rounded-lg mr-3">
              <Package className="w-5 h-5 text-purple-600" />
            </div>
            <span className="font-medium text-gray-800">
              {pacotes.length} pacotes bipados
            </span>
          </div>
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronUp className="w-5 h-5 text-gray-600" />
          )}
        </button>

        <div
          className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out",
            isExpanded ? "max-h-80" : "max-h-0"
          )}
        >
          <div className="border-t border-gray-200">
            {pacotes.length === 0 ? (
              <div className="p-8 text-center">
                <div className="bg-gray-100 p-4 rounded-xl w-fit mx-auto mb-4">
                  <Package className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-sm">
                  Você ainda não possui pacotes bipados
                </p>
              </div>
            ) : (
              <div className="p-4">
                <div className="flex text-xs font-medium text-gray-500 pb-2 border-b mb-3">
                  <span className="flex-1">Código do pacote</span>
                  <span className="w-20 text-center">Status</span>
                  <span className="w-16"></span>
                  <span className="w-10"></span>
                </div>
                <ScrollArea className="h-60">
                  <div className="space-y-2 pr-4">
                    {pacotes.map((pacote) => (
                      <div key={pacote.id} className="flex items-center py-2 border-b border-gray-100 last:border-b-0">
                        <span className="flex-1 font-mono text-sm text-gray-800 truncate">
                          {pacote.codigo}
                        </span>
                        <div className="w-20 flex justify-center">
                          <div className={`p-1 rounded ${getStatusBg(pacote)}`}>
                            {getStatusIcon(pacote)}
                          </div>
                        </div>
                        <button
                          onClick={() => handlePacoteClick(pacote)}
                          className="w-16 flex justify-center p-1 hover:bg-gray-50 rounded"
                        >
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </button>
                        <button
                          onClick={() => onRemovePacote(pacote.id)}
                          className="w-10 flex justify-center p-1 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>
        </div>
      </div>

      <PackageDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        pacote={selectedPacote}
      />
    </>
  );
};

export default PacotesBipados;
