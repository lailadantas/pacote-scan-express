
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MobileLayout from '@/components/MobileLayout';
import PacotesBipados from '@/components/PacotesBipados';
import BarcodeScanner from '@/components/BarcodeScanner';
import { ScanLine } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Pacote {
  id: string;
  codigo: string;
  status: 'bipado' | 'pendencia';
}

const Bipagem = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [pacotes, setPacotes] = useState<Pacote[]>([]);
  const [isScannerActive, setIsScannerActive] = useState(true);

  // Detectar se está no contexto de coleta
  const contexto = searchParams.get('contexto');
  const pontoId = searchParams.get('pontoId');
  const isColeta = contexto === 'coleta';

  const handleCodeDetected = (code: string) => {
    console.log('Código detectado:', code);
    
    // Verifica se o código já foi bipado
    const existingPacote = pacotes.find(p => p.codigo === code);
    if (existingPacote) {
      toast({
        title: "Código já bipado",
        description: `O código ${code} já foi registrado`,
        variant: "destructive",
      });
      return;
    }

    // Simula validação do código (70% chance de sucesso)
    const isSuccess = Math.random() > 0.3;
    const newPacote: Pacote = {
      id: Date.now().toString(),
      codigo: code,
      status: isSuccess ? 'bipado' : 'pendencia'
    };
    
    setPacotes(prev => [...prev, newPacote]);
    
    if (isSuccess) {
      toast({
        title: "Item bipado com sucesso!",
        description: `Código: ${code}`,
      });
    } else {
      toast({
        title: "Item com pendência",
        description: "Verifique o código e tente novamente",
        variant: "destructive",
      });
    }
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
          <BarcodeScanner 
            onCodeDetected={handleCodeDetected}
            isActive={isScannerActive}
          />

          {/* Status Message */}
          <div className="bg-white rounded-xl p-4 my-6 shadow-sm">
            <div className="flex items-center justify-center">
              <ScanLine className="w-6 h-6 mr-3 text-gray-600" />
              <span className="text-center font-medium text-gray-600">
                Posicione o código de barras dentro da área tracejada
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/bipagem/digitar-codigo')}
              className="flex-1 bg-white border-2 border-orange-500 text-black py-3 px-4 rounded-xl font-medium hover:bg-orange-50 transition-colors"
            >
              Digitar código
            </button>
            <button
              onClick={finalizarBipagem}
              className="flex-1 bg-black text-orange-500 py-3 px-4 rounded-xl font-medium hover:bg-gray-800 transition-colors"
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
