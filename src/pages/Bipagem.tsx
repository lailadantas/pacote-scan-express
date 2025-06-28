
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Bipagem = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [pacotes, setPacotes] = useState<Pacote[]>([]);
  const [isScannerActive, setIsScannerActive] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [pendingCode, setPendingCode] = useState<string>('');
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

  // Consultar itens já bipados ao entrar na tela
  useEffect(() => {
    const consultarItensBipados = async () => {
      try {
        const requestBody: any = {
          type: 'consulting'
        };

        // Recupera user_id e person_id do localStorage se disponível
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const userId = userData.user_id || userData.id;
        const personId = userData.person_id;
        const token = userData.token || localStorage.getItem('authToken');

        // Adiciona user_id se estiver disponível
        if (userId) {
          requestBody.user_id = userId;
        }

        // Adiciona person_id se estiver disponível
        if (personId) {
          requestBody.person_id = personId;
        }

        console.log('Consultando itens já bipados:', requestBody);

        const headers: any = {
          'Content-Type': 'application/json',
          'Authorization': 'Basic U21hcnRQb250bzp+ZmdrVUM0NVkyI1o='
        };

        // Adiciona o token Bearer se estiver disponível
        if (token) {
          headers['X-Auth-Token'] = `Bearer ${token}`;
        }

        const response = await fetch('https://n8n.smartenvios.com/webhook/f93ce6e9-0d1e-4165-9aa0-1c8edf3f6dcd', {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(requestBody)
        });

        if (response.ok) {
          const responseData = await response.json();
          console.log('Itens já bipados encontrados:', responseData);
          
          // Converter os itens retornados para o formato de Pacote
          if (Array.isArray(responseData)) {
            const pacotesExistentes = responseData.map((item: any) => ({
              id: item.id || Date.now().toString(),
              codigo: item.barcode,
              status: 'validado'
            }));
            setPacotes(pacotesExistentes);
          }
        } else {
          console.warn('Erro ao consultar itens bipados:', response.status);
        }
      } catch (error) {
        console.error('Erro ao consultar itens bipados:', error);
      }
    };

    consultarItensBipados();
  }, []);

  const getTitulo = () => {
    if (isColeta) return "Bipagem - Coleta";
    return "Bipagem de itens";
  };

  const sendToEndpoint = async (barcode: string, type: 'register' | 'delete') => {
    try {
      const requestBody: any = {
        type: type,
        barcodes: [barcode]
      };

      // Recupera user_id e person_id do localStorage se disponível
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const userId = userData.user_id || userData.id;
      const personId = userData.person_id;
      const token = userData.token || localStorage.getItem('authToken');

      // Adiciona user_id se estiver disponível
      if (userId) {
        requestBody.user_id = userId;
      }

      // Adiciona person_id se estiver disponível
      if (personId) {
        requestBody.person_id = personId;
      }

      console.log(`Enviando código para ${type}:`, requestBody);
      console.log('Token utilizado:', token ? 'Token encontrado' : 'Token não encontrado');

      const headers: any = {
        'Content-Type': 'application/json',
        'Authorization': 'Basic U21hcnRQb250bzp+ZmdrVUM0NVkyI1o='
      };

      // Adiciona o token Bearer se estiver disponível
      if (token) {
        headers['X-Auth-Token'] = `Bearer ${token}`;
      }

      const response = await fetch('https://n8n.smartenvios.com/webhook/f93ce6e9-0d1e-4165-9aa0-1c8edf3f6dcd', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody)
      });

      console.log('Status da resposta:', response.status);
      
      const responseData = await response.json();
      console.log('Dados da resposta:', responseData);

      if (!response.ok) {
        // Se o status for 500 mas a resposta indica "No item to return got found"
        // Pode ser que o endpoint esteja funcionando mas não encontrou os itens
        if (response.status === 500 && responseData.message === "No item to return got found") {
          console.warn('Endpoint retornou: itens não encontrados, mas continuando processamento');
          return true; // Continua o processamento mesmo com este "erro"
        }
        
        throw new Error(`HTTP error! status: ${response.status} - ${responseData.message || 'Erro desconhecido'}`);
      }

      console.log(`Código ${type === 'register' ? 'registrado' : 'removido'} com sucesso:`, barcode);
      return true;
    } catch (error) {
      console.error(`Erro ao ${type === 'register' ? 'registrar' : 'remover'} código:`, error);
      toast({
        title: `Erro ao ${type === 'register' ? 'registrar' : 'remover'} código`,
        description: error instanceof Error ? error.message : "Falha ao enviar dados para o servidor",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleCodeDetected = async (code: string) => {
    console.log('Código detectado:', code);
    
    // Verifica se o código já foi bipado na lista atual
    const existingPacote = pacotes.find(p => p.codigo === code);
    if (existingPacote) {
      playErrorBeep();
      setPendingCode(code);
      setShowDeleteDialog(true);
      return;
    }

    // Envia o código para o endpoint de registro
    const registrationSuccess = await sendToEndpoint(code, 'register');

    // Valida o código via API
    const trackingResult = await validateFreightOrder(code);
    
    if (registrationSuccess) {
      playSuccessBeep();
      const newPacote: Pacote = {
        id: Date.now().toString(),
        codigo: code,
        status: trackingResult.success ? 'validado' : 'erro',
        trackingStatus: trackingResult.data
      };
      
      setPacotes(prev => [...prev, newPacote]);
      
      // Registra o evento no localStorage
      const trackingEvents = JSON.parse(localStorage.getItem('trackingEvents') || '[]');
      trackingEvents.push({
        ...trackingResult.data,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('trackingEvents', JSON.stringify(trackingEvents));
    } else {
      playErrorBeep();
      toast({
        title: "Erro na bipagem",
        description: "Falha ao registrar o código",
        variant: "destructive",
      });
    }
  };

  const handleDeleteConfirm = async () => {
    const success = await sendToEndpoint(pendingCode, 'delete');
    
    if (success) {
      // Remove o pacote da lista local
      setPacotes(prev => prev.filter(p => p.codigo !== pendingCode));
      toast({
        title: "Item removido",
        description: `Código ${pendingCode} foi removido com sucesso`,
      });
    }
    
    setShowDeleteDialog(false);
    setPendingCode('');
  };

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
    setPendingCode('');
  };

  const removePacote = async (id: string) => {
    const pacote = pacotes.find(p => p.id === id);
    if (pacote) {
      const success = await sendToEndpoint(pacote.codigo, 'delete');
      
      if (success) {
        setPacotes(prev => prev.filter(p => p.id !== id));
        toast({
          title: "Item removido",
          description: `Código ${pacote.codigo} foi removido com sucesso`,
        });
      }
    }
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
    <>
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
            defaultExpanded={true}
          />
        </div>
      </MobileLayout>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Item já foi bipado</AlertDialogTitle>
            <AlertDialogDescription>
              O código {pendingCode} já foi bipado anteriormente. Deseja remover este item da lista?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Sim, remover</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Bipagem;
