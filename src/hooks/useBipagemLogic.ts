
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

  // Verificar se os dados de sessão estão disponíveis
  const checkSessionData = () => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const userId = userData.user_id || userData.id;
    const personId = userData.person_id;
    const token = userData.token || localStorage.getItem('authToken');

    if (!userId || !personId || !token) {
      console.warn('Dados de sessão incompletos:', { userId, personId, token: !!token });
      
      // Limpar dados inválidos
      localStorage.removeItem('userData');
      localStorage.removeItem('authToken');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('currentUser');
      
      // Mostrar toast de erro e redirecionar para login
      playErrorBeep();
      setToast({
        show: true,
        type: 'error',
        title: 'Sessão expirada',
        description: 'Por favor, faça login novamente'
      });
      
      setTimeout(() => {
        navigate('/auth', { replace: true });
      }, 2000);
      
      return false;
    }

    return { userId, personId, token };
  };

  // Recuperar pacotes do estado se existirem
  useEffect(() => {
    if (location.state?.pacotes) {
      setPacotes(location.state.pacotes);
    }
  }, [location.state]);

  // Consultar itens já bipados ao entrar na tela
  useEffect(() => {
    const consultarItensBipados = async () => {
      const sessionData = checkSessionData();
      if (!sessionData) return;

      try {
        playRequestBeep();
        setToast({
          show: true,
          type: 'loading',
          title: 'Consultando itens...',
          description: 'Verificando itens já bipados'
        });

        const requestBody = {
          type: 'consulting',
          user_id: sessionData.userId,
          person_id: sessionData.personId
        };

        console.log('Consultando itens já bipados:', requestBody);

        const headers = {
          'Content-Type': 'application/json',
          'Authorization': 'Basic U21hcnRQb250bzp+ZmdrVUM0NVkyI1o=',
          'X-Auth-Token': `Bearer ${sessionData.token}`
        };

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
  }, [playRequestBeep, playSuccessBeep, playErrorBeep, navigate]);

  const sendToEndpoint = async (barcode: string, type: 'register' | 'delete') => {
    const sessionData = checkSessionData();
    if (!sessionData) return false;

    try {
      playRequestBeep();
      setToast({
        show: true,
        type: 'loading',
        title: `${type === 'register' ? 'Registrando' : 'Removendo'} código...`,
        description: `Processando: ${barcode}`
      });

      const requestBody = {
        type: type,
        barcodes: [barcode],
        user_id: sessionData.userId,
        person_id: sessionData.personId
      };

      console.log(`Enviando código para ${type}:`, requestBody);

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Basic U21hcnRQb250bzp+ZmdrVUM0NVkyI1o=',
        'X-Auth-Token': `Bearer ${sessionData.token}`
      };

      const response = await fetch('https://n8n.smartenvios.com/webhook/f93ce6e9-0d1e-4165-9aa0-1c8edf3f6dcd', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody)
      });

      console.log('Status da resposta:', response.status);
      
      // Verificar se a resposta é texto (caso de "Esses pacotes já foram recebidos")
      const contentType = response.headers.get('content-type');
      let responseData: any;
      
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }
      
      console.log('Dados da resposta:', responseData);

      if (response.ok) {
        // Verificar se a resposta contém "Esses pacotes já foram recebidos"
        if (typeof responseData === 'string' && responseData.includes('Esses pacotes já foram recebidos')) {
          console.log('Pacote já foi recebido, mostrando dialog de confirmação');
          playErrorBeep();
          
          // Identificar o código do pacote na resposta
          const lines = responseData.split('\n');
          const packageCode = lines.find(line => line.trim() && !line.includes('Esses pacotes já foram recebidos'))?.trim();
          
          if (packageCode === barcode) {
            setPendingCode(barcode);
            setShowDeleteDialog(true);
            setToast({ show: false, type: 'loading', title: '' });
            return 'already_exists'; // Retorno especial para indicar que já existe
          }
        }
        
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
          description: typeof responseData === 'object' ? responseData.message || 'Erro desconhecido' : responseData
        });

        if (response.status === 500 && (typeof responseData === 'object' && responseData.message === "No item to return got found")) {
          console.warn('Endpoint retornou: itens não encontrados, mas continuando processamento');
          return true;
        }
        
        throw new Error(`HTTP error! status: ${response.status} - ${typeof responseData === 'object' ? responseData.message || 'Erro desconhecido' : responseData}`);
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
      console.log('Pacote já existe na lista, mostrando dialog de confirmação');
      playErrorBeep();
      setPendingCode(code);
      setShowDeleteDialog(true);
      return;
    }

    console.log('Pacote não existe, procedendo com registro');
    const registrationResult = await sendToEndpoint(code, 'register');

    // Se o resultado for 'already_exists', o modal já foi aberto pelo sendToEndpoint
    if (registrationResult === 'already_exists') {
      return;
    }

    if (registrationResult === true) {
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
    console.log('Confirmando exclusão do código:', pendingCode);
    const success = await sendToEndpoint(pendingCode, 'delete');
    
    if (success) {
      setPacotes(prev => prev.filter(p => p.codigo !== pendingCode));
    }
    
    setShowDeleteDialog(false);
    setPendingCode('');
  };

  const handleDeleteCancel = () => {
    console.log('Cancelando exclusão do código:', pendingCode);
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

  const finalizarBipagem = async () => {
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

    const sessionData = checkSessionData();
    if (!sessionData) return;

    try {
      playRequestBeep();
      setToast({
        show: true,
        type: 'loading',
        title: 'Finalizando bipagem...',
        description: 'Processando confirmação'
      });

      const requestBody = {
        type: 'confirm',
        user_id: sessionData.userId,
        person_id: sessionData.personId
      };

      console.log('Finalizando bipagem:', requestBody);

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Basic U21hcnRQb250bzp+ZmdrVUM0NVkyI1o=',
        'X-Auth-Token': `Bearer ${sessionData.token}`
      };

      const response = await fetch('https://n8n.smartenvios.com/webhook/f93ce6e9-0d1e-4165-9aa0-1c8edf3f6dcd', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody)
      });

      console.log('Status da resposta de finalização:', response.status);
      
      // Verificar se a resposta é texto ou JSON
      const contentType = response.headers.get('content-type');
      let responseData: any;
      
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }
      
      console.log('Dados da resposta de finalização:', responseData);

      // Se o status é 200, considera sucesso independentemente da mensagem
      if (response.ok) {
        playSuccessBeep();
        
        // Verificar se há mensagem de erro nos pacotes
        const hasError = typeof responseData === 'string' && responseData.includes('Esses pacotes deram erro');
        
        setToast({
          show: true,
          type: hasError ? 'error' : 'success',
          title: hasError ? 'Alguns pacotes com erro' : 'Bipagem finalizada!',
          description: hasError ? 'Verifique os pacotes no estoque' : 'Todos os pacotes foram processados'
        });

        // Sempre redirecionar para o estoque, mesmo com erro nos pacotes
        setTimeout(() => {
          if (isColeta) {
            navigate(`/assinatura-coleta/${pontoId}`);
          } else {
            navigate('/estoque', { replace: true });
          }
        }, 2000);
      } else {
        playErrorBeep();
        setToast({
          show: true,
          type: 'error',
          title: 'Erro ao finalizar',
          description: typeof responseData === 'object' ? responseData.message || 'Erro desconhecido' : responseData
        });
      }
    } catch (error) {
      console.error('Erro ao finalizar bipagem:', error);
      playErrorBeep();
      setToast({
        show: true,
        type: 'error',
        title: 'Erro de conexão',
        description: 'Falha ao conectar com o servidor'
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
