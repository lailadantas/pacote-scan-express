import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MobileLayout from '@/components/MobileLayout';
import PacotesBipados from '@/components/PacotesBipados';
import { ScanLine } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Pacote {
  id: string;
  codigo: string;
  status: 'bipado' | 'pendencia';
}

type ScanStatus = 'idle' | 'scanning' | 'loading' | 'success' | 'error';

const Bipagem = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [scanStatus, setScanStatus] = useState<ScanStatus>('idle');
  const [pacotes, setPacotes] = useState<Pacote[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  // Detectar se está no contexto de coleta
  const contexto = searchParams.get('contexto');
  const pontoId = searchParams.get('pontoId');
  const isColeta = contexto === 'coleta';

  const simulateScan = () => {
    if (isScanning) return;
    
    setIsScanning(true);
    setScanStatus('loading');
    
    // Simula o tempo de carregamento da bipagem
    setTimeout(() => {
      const isSuccess = Math.random() > 0.3; // 70% chance de sucesso
      const newPacote: Pacote = {
        id: Date.now().toString(),
        codigo: `${Math.random().toString().substring(2, 17)}`,
        status: isSuccess ? 'bipado' : 'pendencia'
      };
      
      setPacotes(prev => [...prev, newPacote]);
      setScanStatus(isSuccess ? 'success' : 'error');
      
      if (isSuccess) {
        toast({
          title: "Item bipado com sucesso!",
          description: `Código: ${newPacote.codigo}`,
        });
      } else {
        toast({
          title: "Item com pendência",
          description: "Verifique o código e tente novamente",
          variant: "destructive",
        });
      }
      
      // Volta ao estado inicial após 2 segundos
      setTimeout(() => {
        setScanStatus('idle');
        setIsScanning(false);
      }, 2000);
    }, 1500);
  };

  const removePacote = (id: string) => {
    setPacotes(prev => prev.filter(p => p.id !== id));
  };

  const finalizarBipagem = () => {
    if (pacotes.length === 0) {
      toast({
        title: "Nenhum pacote bipado",
        description: "Bipe pelo menos um pacote antes de finalizar",
        variant: "destructive",
      });
      return;
    }
    
    if (isColeta) {
      // Se é coleta, vai para a tela de assinatura
      navigate(`/assinatura-coleta/${pontoId}`);
    } else {
      // Se é estoque normal, vai para estoque
      toast({
        title: "Bipagem finalizada!",
        description: `${pacotes.length} pacotes enviados para o estoque`,
      });
      navigate('/estoque');
    }
  };

  const getStatusMessage = () => {
    switch (scanStatus) {
      case 'loading':
        return 'Carregando...';
      case 'success':
        return 'Item bipado';
      case 'error':
        return 'Item com pendência';
      default:
        return 'Posicione o código de barras dentro da área tracejada';
    }
  };

  const getStatusColor = () => {
    switch (scanStatus) {
      case 'loading':
        return 'text-blue-600';
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <MobileLayout 
      title={isColeta ? "Bipagem - Coleta" : "Bipagem de itens"} 
      showBackButton 
      showBottomNav={false}
    >
      <div className="flex flex-col h-full relative">
        {/* Área de Bipagem */}
        <div className="flex-1 p-4 pb-32">
          {/* Scanner Area */}
          <div 
            className="relative bg-black rounded-xl h-64 mb-6 cursor-pointer overflow-hidden"
            onClick={simulateScan}
          >
            {/* Corner markers */}
            <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-white"></div>
            <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-white"></div>
            <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-white"></div>
            <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-white"></div>
            
            {/* Scanning animation */}
            {scanStatus === 'loading' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-0.5 bg-red-500 animate-pulse"></div>
              </div>
            )}
          </div>

          {/* Status Message */}
          <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
            <div className="flex items-center justify-center">
              <ScanLine className={`w-6 h-6 mr-3 ${getStatusColor()}`} />
              <span className={`text-center font-medium ${getStatusColor()}`}>
                {getStatusMessage()}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/bipagem/digitar-codigo')}
              className="flex-1 bg-black text-orange-500 py-3 px-4 rounded-xl font-medium hover:bg-gray-800 transition-colors"
            >
              Digitar código
            </button>
            <button
              onClick={finalizarBipagem}
              className="flex-1 bg-white border border-gray-300 text-black py-3 px-4 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              Finalizar
            </button>
          </div>
        </div>

        {/* Pacotes Bipados (Fixed at bottom) */}
        <PacotesBipados 
          pacotes={pacotes}
          onRemovePacote={removePacote}
        />
      </div>
    </MobileLayout>
  );
};

export default Bipagem;
