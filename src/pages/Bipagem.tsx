import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import MobileLayout from '@/components/MobileLayout';
import PacotesBipados from '@/components/PacotesBipados';
import BarcodeScanner from '@/components/BarcodeScanner';
import { ScanLine } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useBeepSounds } from '@/hooks/useBeepSounds';

interface Pacote {
  id: string;
  codigo: string;
  status: 'bipado';
}

const Bipagem = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [pacotes, setPacotes] = useState<Pacote[]>([]);
  const [isScannerActive, setIsScannerActive] = useState(true);
  const { playSuccessBeep, playErrorBeep } = useBeepSounds();

  // Detectar contexto
  const contexto = searchParams.get('contexto');
  const pontoId = searchParams.get('pontoId');
  const isColeta = contexto === 'coleta';
  const isReceber = contexto === 'receber';
  const isTransferencia = contexto === 'transferencia';

  // Recuperar pacotes do estado se existirem
  useEffect(() => {
    if (location.state?.pacotes) {
      setPacotes(location.state.pacotes);
    }
  }, [location.state]);

  const getTitulo = () => {
    if (isColeta) return "Bipagem - Coleta";
    if (isReceber) return "Bipagem - Receber";
    if (isTransferencia) return "Bipagem - Transferência";
    return "Bipagem de itens";
  };

  const handleCodeDetected = (code: string) => {
    console.log('Código detectado:', code);
    
    // Verifica se o código já foi bipado na lista atual
    const existingPacote = pacotes.find(p => p.codigo === code);
    if (existingPacote) {
      playErrorBeep(); // Som de erro para item duplicado
      navigate('/resultado-bipagem', { 
        state: { 
          resultado: 'erro', 
          codigo: code,
          pacotes: pacotes
        },
        replace: true 
      });
      return;
    }

    // Simula validação do código (70% chance de sucesso)
    const isSuccess = Math.random() > 0.3;
    
    if (isSuccess) {
      playSuccessBeep(); // Som de sucesso
      const newPacote: Pacote = {
        id: Date.now().toString(),
        codigo: code,
        status: 'bipado'
      };
      
      const updatedPacotes = [...pacotes, newPacote];
      
      navigate('/resultado-bipagem', { 
        state: { 
          resultado: 'sucesso', 
          codigo: code,
          pacotes: updatedPacotes
        },
        replace: true 
      });
    } else {
      playErrorBeep(); // Som de erro para pendência
      navigate('/resultado-bipagem', { 
        state: { 
          resultado: 'pendencia', 
          codigo: code,
          pacotes: pacotes
        },
        replace: true 
      });
    }
  };

  const removePacote = (id: string) => {
    setPacotes(prev => prev.filter(p => p.id !== id));
  };

  const handleDigitarCodigo = () => {
    navigate('/bipagem/digitar-codigo', { 
      state: { pacotes } 
    });
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
    } else if (isTransferencia) {
      // Se é transferência, remove do estoque e vai para EscolherTipo
      const existingStock = JSON.parse(localStorage.getItem('userStock') || '[]');
      const pacoteIds = pacotes.map(p => p.id);
      const updatedStock = existingStock.filter(item => !pacoteIds.includes(item.id));
      localStorage.setItem('userStock', JSON.stringify(updatedStock));
      
      navigate('/escolhertipo', { 
        state: { pacotes } 
      });
    } else {
      // Para outros contextos, vai para EscolherTipo
      navigate('/escolhertipo', { 
        state: { pacotes } 
      });
    }
  };

  return (
    <MobileLayout 
      title={getTitulo()} 
      showBackButton 
      showBottomNav={false}
      onBackClick={() => navigate('/home')}
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
              onClick={handleDigitarCodigo}
              className="flex-1 bg-white border-2 border-orange-500 text-orange-500 py-3 px-4 rounded-xl font-medium hover:bg-orange-50 transition-colors"
            >
              Digitar código
            </button>
            <button
              onClick={finalizarBipagem}
              className="flex-1 bg-white border-2 border-orange-500 text-orange-500 py-3 px-4 rounded-xl font-medium hover:bg-orange-50 transition-colors"
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
