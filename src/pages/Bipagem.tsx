
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import MobileLayout from '@/components/MobileLayout';
import PacotesBipados from '@/components/PacotesBipados';
import BarcodeScanner from '@/components/BarcodeScanner';
import { ScanLine } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useBeepSounds } from '@/hooks/useBeepSounds';
import { useFreightTracking } from '@/hooks/useFreightTracking';
import { Pacote } from '@/types/Pacote';

const Bipagem = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [pacotes, setPacotes] = useState<Pacote[]>([]);
  const [isScannerActive, setIsScannerActive] = useState(true);
  const { playSuccessBeep, playErrorBeep } = useBeepSounds();
  const { validateFreightOrder } = useFreightTracking();

  // Detectar contexto
  const contexto = searchParams.get('contexto');
  const pontoId = searchParams.get('pontoId');
  const isColeta = contexto === 'coleta';

  // Recuperar pacotes do estado se existirem
  useEffect(() => {
    if (location.state?.pacotes) {
      setPacotes(location.state.pacotes);
    }
  }, [location.state]);

  const getTitulo = () => {
    if (isColeta) return "Bipagem - Coleta";
    return "Bipagem de itens";
  };

  const handleCodeDetected = async (code: string) => {
    console.log('Código detectado:', code);
    
    // Verifica se o código já foi bipado na lista atual
    const existingPacote = pacotes.find(p => p.codigo === code);
    if (existingPacote) {
      playErrorBeep();
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

    // Valida o código via API
    const trackingResult = await validateFreightOrder(code);
    
    if (trackingResult.success) {
      playSuccessBeep();
      const newPacote: Pacote = {
        id: Date.now().toString(),
        codigo: code,
        status: 'validado',
        trackingStatus: trackingResult.data
      };
      
      const updatedPacotes = [...pacotes, newPacote];
      
      // Registra o evento no localStorage
      const trackingEvents = JSON.parse(localStorage.getItem('trackingEvents') || '[]');
      trackingEvents.push({
        ...trackingResult.data,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('trackingEvents', JSON.stringify(trackingEvents));
      
      navigate('/resultado-bipagem', { 
        state: { 
          resultado: 'sucesso', 
          codigo: code,
          pacotes: updatedPacotes
        },
        replace: true 
      });
    } else {
      playErrorBeep();
      const newPacote: Pacote = {
        id: Date.now().toString(),
        codigo: code,
        status: 'erro',
        trackingStatus: trackingResult.data
      };
      
      const updatedPacotes = [...pacotes, newPacote];
      
      // Registra o evento mesmo com erro
      const trackingEvents = JSON.parse(localStorage.getItem('trackingEvents') || '[]');
      trackingEvents.push({
        ...trackingResult.data,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('trackingEvents', JSON.stringify(trackingEvents));
      
      navigate('/resultado-bipagem', { 
        state: { 
          resultado: 'pendencia', 
          codigo: code,
          pacotes: updatedPacotes
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
      navigate(`/assinatura-coleta/${pontoId}`);
    } else {
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
