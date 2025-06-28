
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MobileLayout from '@/components/MobileLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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

const DigitarCodigo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { pacotes = [] } = location.state || {};
  const [codigo, setCodigo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { playSuccessBeep, playErrorBeep } = useBeepSounds();
  const { validateFreightOrder } = useFreightTracking();

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

      console.log(`Enviando código digitado para ${type}:`, requestBody);
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

  const handleDeleteConfirm = async () => {
    const success = await sendToEndpoint(codigo, 'delete');
    
    if (success) {
      playSuccessBeep();
      // Remove o pacote da lista local
      const updatedPacotes = pacotes.filter((p: any) => p.codigo !== codigo);
      
      // Volta para a tela de bipagem com a lista atualizada
      navigate('/bipagem', { 
        state: { pacotes: updatedPacotes },
        replace: true 
      });
    } else {
      playErrorBeep();
      toast({
        title: "Erro ao remover",
        description: "Falha ao remover o código",
        variant: "destructive",
      });
    }
    
    setShowDeleteDialog(false);
    setIsLoading(false);
  };

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!codigo.trim()) {
      toast({
        title: "Código inválido",
        description: "Por favor, digite um código válido",
        variant: "destructive",
      });
      return;
    }

    // Verifica se o código já existe
    const existingPacote = pacotes.find((p: any) => p.codigo === codigo);
    if (existingPacote) {
      setShowDeleteDialog(true);
      return;
    }

    setIsLoading(true);
    
    // Envia o código para o endpoint de registro
    const registrationSuccess = await sendToEndpoint(codigo, 'register');
    
    if (registrationSuccess) {
      playSuccessBeep();
      
      // Valida o código via API
      const trackingResult = await validateFreightTrackingOrder(codigo);
      
      // Cria o novo pacote
      const newPacote: Pacote = {
        id: Date.now().toString(),
        codigo: codigo,
        status: trackingResult.success ? 'validado' : 'erro',
        trackingStatus: trackingResult.data
      };
      
      // Adiciona à lista de pacotes
      const updatedPacotes = [...pacotes, newPacote];
      
      // Volta para a tela de bipagem com a nova lista
      navigate('/bipagem', { 
        state: { pacotes: updatedPacotes },
        replace: true 
      });
    } else {
      playErrorBeep();
      toast({
        title: "Erro na bipagem",
        description: "Falha ao registrar o código",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <>
      <MobileLayout 
        title="Digitar código" 
        showBackButton 
        showBottomNav={false}
      >
        <div className="p-4 h-full flex flex-col">
          <div className="flex-1 flex flex-col justify-center">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Inserir código manualmente
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Código do produto
                  </label>
                  <Input
                    type="text"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                    placeholder="Digite o código aqui..."
                    className="font-mono"
                    disabled={isLoading}
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-white border-2 border-orange-500 text-orange-500 hover:bg-orange-50"
                  disabled={isLoading}
                >
                  {isLoading ? 'Processando...' : 'Enviar'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </MobileLayout>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Item já foi bipado</AlertDialogTitle>
            <AlertDialogDescription>
              O código {codigo} já foi bipado anteriormente. Deseja remover este item da lista?
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

export default DigitarCodigo;
