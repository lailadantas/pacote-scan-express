
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useBeepSounds } from '@/hooks/useBeepSounds';
import { useFreightTracking } from '@/hooks/useFreightTracking';
import { Pacote } from '@/types/Pacote';

interface ToastState {
  show: boolean;
  type: 'loading' | 'success' | 'error';
  title: string;
  description?: string;
}

export const useBipagemLogic = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [pacotes, setPacotes] = useState<Pacote[]>([]);
  const [isScannerActive, setIsScannerActive] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [pendingCode, setPendingCode] = useState<string>('');
  const [toast, setToast] = useState<ToastState>({ show: false, type: 'loading', title: '' });
  const { playSuccessBeep, playErrorBeep, playRequestBeep } = useBeepSounds();
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
        playRequestBeep();
        setToast({
          show: true,
          type: 'loading',
          title: 'Consultando itens...',
          description: 'Verificando itens já bipados'
        });

        const requestBody: any = {
          type: 'consulting'
        };

        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const userId = userData.user_id || userData.id;
        const personId = userData.person_id;
        const token = userData.token || localStorage.getItem('authToken');

        if (userId) {
          requestBody.user_id = userId;
        }

        if (personId) {
          requestBody.person_id = personId;
        }

        console.log('Consultando itens já bipados:', requestBody);

        const headers: any = {
          'Content-Type': 'application/json',
          'Authorization': 'Basic U21hcnRQb250bzp+ZmdrVUM0NVkyI1o='
        };

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
          
          if (Array.isArray(responseData)) {
            const pacotesExistentes: Pacote[] = responseData.map((item: any) => ({
              id: item.id || Date.now().toString(),
              codigo: item.barcode,
              status: 'validado' as const
            }));
            setPacotes(pacotesExistentes);
          }

          playSuccessBeep();
          setToast({
            show: true,
            type: 'success',
            title: 'Consulta realizada!',
            description: `${Array.isArray(responseData) ? responseData.length : 0} itens encontrados`
          });
        } else {
          playErrorBeep();
          setToast({
            show: true,
            type: 'error',
            title: 'Erro na consulta',
            description: 'Não foi possível consultar os itens'
          });
          console.warn('Erro ao consultar itens bipados:', response.status);
        }
      } catch (error) {
        console.error('Erro ao consultar itens bipados:', error);
        playErrorBeep();
        setToast({
          show: true,
          type: 'error',
          title: 'Erro de conexão',
          description: 'Falha ao conectar com o servidor'
        });
      }
    };

    consultarItensBipados();
  }, [playRequestBeep, playSuccessBeep, playErrorBeep]);

  const sendToEndpoint = async (barcode: string, type: 'register' | 'delete') => {
    try {
      playRequestBeep();
      setToast({
        show: true,
        type: 'loading',
        title: `${type === 'register' ? 'Registrando' : 'Removendo'} código...`,
        description: `Processando: ${barcode}`
      });

      const requestBody: any = {
        type: type,
        barcodes: [barcode]
      };

      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const userId = userData.user_id || userData.id;
      const personId = userData.person_id;
      const token = userData.token || localStorage.getItem('authToken');

      if (userId) {
        requestBody.user_id = userId;
      }

      if (personId) {
        requestBody.person_id = personId;
      }

      console.log(`Enviando código para ${type}:`, requestBody);
      console.log('Token utilizado:', token ? 'Token encontrado' : 'Token não encontrado');

      const headers: any = {
        'Content-Type': 'application/json',
        'Authorization': 'Basic U21hcnRQb250bzp+ZmdrVUM0NVkyI1o='
      };

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

      if (response.ok) {
        playSuccessBeep();
        setToast({
          show: true,
          type: 'success',
          title: `Código ${type === 'register' ? 'registrado' : 'removido'}!`,
          description: `${barcode} processado com sucesso`
        });
        
        console.log(`Código ${type === 'register' ? 'registrado' : 'removido'} com sucesso:`, barcode);
        return true;
      } else {
        playErrorBeep();
        setToast({
          show: true,
          type: 'error',
          title: `Erro ao ${type === 'register' ? 'registrar' : 'remover'}`,
          description: responseData.message || 'Erro desconhecido'
        });

        if (response.status === 500 && responseData.message === "No item to return got found") {
          console.warn('Endpoint retornou: itens não encontrados, mas continuando processamento');
          return true;
        }
        
        throw new Error(`HTTP error! status: ${response.status} - ${responseData.message || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error(`Erro ao ${type === 'register' ? 'registrar' : 'remover'} código:`, error);
      playErrorBeep();
      setToast({
        show: true,
        type: 'error',
        title: `Erro ao ${type === 'register' ? 'registrar' : 'remover'}`,
        description: error instanceof Error ? error.message : "Falha ao enviar dados"
      });
      return false;
    }
  };

  const handleCodeDetected = async (code: string) => {
    console.log('Código detectado:', code);
    
    const existingPacote = pacotes.find(p => p.codigo === code);
    if (existingPacote) {
      playErrorBeep();
      setPendingCode(code);
      setShowDeleteDialog(true);
      return;
    }

    const registrationSuccess = await sendToEndpoint(code, 'register');

    if (registrationSuccess) {
      const trackingResult = await validateFreightOrder(code);
      
      const newPacote: Pacote = {
        id: Date.now().toString(),
        codigo: code,
        status: trackingResult.success ? 'validado' : 'erro',
        trackingStatus: trackingResult.data
      };
      
      setPacotes(prev => [...prev, newPacote]);
      
      const trackingEvents = JSON.parse(localStorage.getItem('trackingEvents') || '[]');
      trackingEvents.push({
        ...trackingResult.data,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('trackingEvents', JSON.stringify(trackingEvents));
    }
  };

  const handleDeleteConfirm = async () => {
    const success = await sendToEndpoint(pendingCode, 'delete');
    
    if (success) {
      setPacotes(prev => prev.filter(p => p.codigo !== pendingCode));
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
      playErrorBeep();
      setToast({
        show: true,
        type: 'error',
        title: 'Nenhum pacote bipado',
        description: 'Bipe pelo menos um pacote antes de finalizar'
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

  const getTitulo = () => {
    if (isColeta) return "Bipagem - Coleta";
    return "Bipagem de itens";
  };

  return {
    pacotes,
    isScannerActive,
    showDeleteDialog,
    pendingCode,
    toast,
    isColeta,
    getTitulo,
    handleCodeDetected,
    handleDeleteConfirm,
    handleDeleteCancel,
    removePacote,
    handleDigitarCodigo,
    finalizarBipagem,
    setToast,
    setShowDeleteDialog
  };
};
