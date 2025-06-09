
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MobileLayout from '@/components/MobileLayout';
import { ChevronDown } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const DadosTransferencia = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pacotes = location.state?.pacotes || [];
  
  const [origem, setOrigem] = useState('');
  const [destino, setDestino] = useState('');

  // Mock de dados para as opções
  const origemAtual = "HUB São Paulo - Centro";
  const destinosDisponiveis = [
    "HUB Rio de Janeiro - Zona Sul",
    "Franquia Santos - Centro",
    "Ponto de Coleta Campinas - Shopping",
    "HUB Brasília - Asa Norte",
    "Franquia Sorocaba - Vila Lucy"
  ];

  const handleProximo = () => {
    if (!destino) {
      toast({
        title: "Destino obrigatório",
        description: "Selecione o destino da transferência",
        variant: "destructive",
      });
      return;
    }

    navigate('/upload-transferencia', {
      state: { 
        pacotes,
        origem: origemAtual,
        destino
      }
    });
  };

  return (
    <MobileLayout title="Dados da Transferência" showBackButton showBottomNav={false}>
      <div className="p-4 space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Informações da Transferência</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Origem
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={origemAtual}
                  disabled
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destino *
              </label>
              <div className="relative">
                <select
                  value={destino}
                  onChange={(e) => setDestino(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white"
                >
                  <option value="">Selecione o destino</option>
                  {destinosDisponiveis.map((destinoOption) => (
                    <option key={destinoOption} value={destinoOption}>
                      {destinoOption}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>Pacotes para transferência:</strong> {pacotes.length} itens
            </p>
          </div>
        </div>

        <button
          onClick={handleProximo}
          className="w-full bg-black text-orange-500 py-3 px-4 rounded-xl font-medium hover:bg-gray-800 transition-colors"
        >
          Próximo
        </button>
      </div>
    </MobileLayout>
  );
};

export default DadosTransferencia;
