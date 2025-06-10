
import { useState } from 'react';
import { Package, ChevronUp, ChevronDown, Check, Trash2, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface Pacote {
  id: string;
  codigo: string;
  status: 'bipado';
}

interface PacotesBipadosProps {
  pacotes: Pacote[];
  onRemovePacote: (id: string) => void;
}

const PacotesBipados = ({ pacotes, onRemovePacote }: PacotesBipadosProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const handlePacoteClick = (pacoteId: string) => {
    navigate(`/estoque/detalhes/${pacoteId}`);
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl" style={{
      boxShadow: '0 -10px 25px -5px rgba(0, 0, 0, 0.1), 0 -10px 10px -5px rgba(0, 0, 0, 0.04)'
    }}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center">
          <div className="bg-purple-100 p-2 rounded-lg mr-3">
            <Package className="w-5 h-5 text-purple-600" />
          </div>
          <span className="font-medium text-gray-800">
            {pacotes.length} pacotes
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
          isExpanded ? "max-h-96" : "max-h-0"
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
            <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
              <div className="flex text-xs font-medium text-gray-500 pb-2 border-b">
                <span className="flex-1">Código do pacote</span>
                <span className="w-20 text-center">Status</span>
                <span className="w-16"></span>
                <span className="w-10"></span>
              </div>
              {pacotes.map((pacote) => (
                <div key={pacote.id} className="flex items-center py-2 border-b border-gray-100 last:border-b-0">
                  <span className="flex-1 font-mono text-sm text-gray-800">
                    {pacote.codigo}
                  </span>
                  <div className="w-20 flex justify-center">
                    <div className="bg-green-100 p-1 rounded">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                  </div>
                  <button
                    onClick={() => handlePacoteClick(pacote.id)}
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
          )}
        </div>
      </div>
    </div>
  );
};

export default PacotesBipados;
