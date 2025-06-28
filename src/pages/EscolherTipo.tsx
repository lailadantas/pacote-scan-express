import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';

const EscolherTipo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { pacotes = [] } = location.state || {};
  const [tipoServico, setTipoServico] = useState('');
  const [localTransferencia, setLocalTransferencia] = useState('');
  const [showTransferencia, setShowTransferencia] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const locaisTransferencia = [
    'Centro de Distribuição SP',
    'Centro de Distribuição RJ',
    'Centro de Distribuição BH',
    'Filial Campinas',
    'Filial Santos',
    'Filial Ribeirão Preto'
  ];

  const handleTipoChange = (value: string) => {
    setTipoServico(value);
    setShowTransferencia(value === 'saida');
    if (value !== 'saida') {
      setLocalTransferencia('');
    }
  };

  const handleFinalizar = () => {
    if (!tipoServico) {
      toast({
        title: "Selecione o tipo de serviço",
        description: "Escolha entre Entrada ou Saída",
        variant: "destructive",
      });
      return;
    }

    if (tipoServico === 'saida' && !localTransferencia) {
      toast({
        title: "Selecione o local de transferência",
        description: "Escolha para onde os pacotes serão transferidos",
        variant: "destructive",
      });
      return;
    }

    setShowConfirmModal(true);
  };

  const sendToEndpoint = async (barcodes: string[], type: string, userId?: string, personId?: string) => {
    try {
      const requestBody: any = {
        type: type,
        barcodes: barcodes
      };

      // Adiciona user_id se estiver disponível
      if (userId) {
        requestBody.user_id = userId;
      }

      // Adiciona person_id se estiver disponível
      if (personId) {
        requestBody.person_id = personId;
      }

      console.log('Enviando dados para o endpoint:', requestBody);

      const response = await fetch('https://n8n.smartenvios.com/webhook/f93ce6e9-0d1e-4165-9aa0-1c8edf3f6dcd', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic U21hcnRQb250bzp+ZmdrVUM0NVkyI1o='
        },
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
          toast({
            title: "Aviso",
            description: "Alguns códigos podem não ter sido encontrados no sistema, mas o processamento continuará.",
            variant: "default",
          });
          return true; // Continua o processamento mesmo com este "erro"
        }
        
        throw new Error(`HTTP error! status: ${response.status} - ${responseData.message || 'Erro desconhecido'}`);
      }

      console.log('Dados enviados com sucesso:', requestBody);
      return true;
    } catch (error) {
      console.error('Erro ao enviar dados:', error);
      toast({
        title: "Erro ao processar",
        description: error instanceof Error ? error.message : "Falha ao enviar dados para o servidor",
        variant: "destructive",
      });
      return false;
    }
  };

  const confirmarAcao = async () => {
    setIsLoading(true);

    // Recupera user_id e person_id do localStorage se disponível
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const userId = userData.user_id || userData.id;
    const personId = userData.person_id;

    console.log('Dados do usuário:', userData);
    console.log('User ID encontrado:', userId);
    console.log('Person ID encontrado:', personId);

    if (tipoServico === 'entrada') {
      // Extrai os códigos dos pacotes
      const barcodes = pacotes.map(p => p.codigo);
      console.log('Códigos para entrada:', barcodes);
      
      // Envia para o endpoint com type "recepcion"
      const success = await sendToEndpoint(barcodes, 'recepcion', userId, personId);
      
      if (success) {
        // Adiciona ao estoque local
        const existingStock = JSON.parse(localStorage.getItem('userStock') || '[]');
        const updatedStock = [...existingStock, ...pacotes];
        localStorage.setItem('userStock', JSON.stringify(updatedStock));
        
        toast({
          title: "Entrada finalizada!",
          description: `${pacotes.length} pacotes recebidos no estoque`,
        });
        
        setShowConfirmModal(false);
        navigate('/estoque');
      }
    } else if (tipoServico === 'saida') {
      // Extrai os códigos dos pacotes
      const barcodes = pacotes.map(p => p.codigo);
      console.log('Códigos para saída:', barcodes);
      
      // Envia para o endpoint com type "salida"
      const success = await sendToEndpoint(barcodes, 'salida', userId, personId);
      
      if (success) {
        // Remove do estoque local
        const existingStock = JSON.parse(localStorage.getItem('userStock') || '[]');
        const pacoteIds = pacotes.map(p => p.id);
        const updatedStock = existingStock.filter(item => !pacoteIds.includes(item.id));
        localStorage.setItem('userStock', JSON.stringify(updatedStock));
        
        toast({
          title: "Saída finalizada!",
          description: `${pacotes.length} pacotes enviados para ${localTransferencia}`,
        });
        
        setShowConfirmModal(false);
        navigate('/estoque');
      }
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/bipagem', { state: { pacotes } })}
            className="mr-3"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Bipagem</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-6">
        <div className="max-w-md mx-auto">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Que tipo de serviço você está fazendo?
          </h2>
          <p className="text-sm text-gray-600 mb-8">
            {pacotes.length} pacotes bipados
          </p>

          <div className="space-y-4 mb-8">
            <RadioGroup value={tipoServico} onValueChange={handleTipoChange}>
              <div className={`flex items-center space-x-3 p-4 border-2 rounded-xl transition-colors ${
                tipoServico === 'entrada' 
                  ? 'border-orange-500 bg-orange-50' 
                  : 'border-gray-200 bg-white'
              }`}>
                <RadioGroupItem 
                  value="entrada" 
                  id="entrada"
                  className={tipoServico === 'entrada' ? 'border-orange-500 text-orange-500' : ''}
                />
                <Label 
                  htmlFor="entrada" 
                  className={`flex-1 cursor-pointer ${
                    tipoServico === 'entrada' ? 'text-orange-600' : 'text-gray-900'
                  }`}
                >
                  Entrada
                </Label>
              </div>
              
              <div className={`flex items-center space-x-3 p-4 border-2 rounded-xl transition-colors ${
                tipoServico === 'saida' 
                  ? 'border-orange-500 bg-orange-50' 
                  : 'border-gray-200 bg-white'
              }`}>
                <RadioGroupItem 
                  value="saida" 
                  id="saida"
                  className={tipoServico === 'saida' ? 'border-orange-500 text-orange-500' : ''}
                />
                <Label 
                  htmlFor="saida" 
                  className={`flex-1 cursor-pointer ${
                    tipoServico === 'saida' ? 'text-orange-600' : 'text-gray-900'
                  }`}
                >
                  Saída
                </Label>
              </div>
            </RadioGroup>

            {showTransferencia && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
                className="mt-4"
              >
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Local de transferência
                </Label>
                <Select value={localTransferencia} onValueChange={setLocalTransferencia}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o local de destino" />
                  </SelectTrigger>
                  <SelectContent>
                    {locaisTransferencia.map((local) => (
                      <SelectItem key={local} value={local}>
                        {local}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="max-w-md mx-auto">
          <Button
            onClick={handleFinalizar}
            disabled={!tipoServico || (tipoServico === 'saida' && !localTransferencia) || isLoading}
            className={`w-full py-3 rounded-xl font-medium text-white transition-colors ${
              tipoServico && (tipoServico !== 'saida' || localTransferencia) && !isLoading
                ? 'bg-orange-500 hover:bg-orange-600'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            {isLoading ? 'Processando...' : 'Finalizar serviço'}
          </Button>
        </div>
      </div>

      {/* Modal de Confirmação */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle>Confirmar ação</DialogTitle>
            <DialogDescription>
              {tipoServico === 'entrada' 
                ? `Deseja realmente finalizar a entrada de ${pacotes.length} pacotes?`
                : `Deseja realmente finalizar a saída de ${pacotes.length} pacotes para ${localTransferencia}?`
              }
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col space-y-2 sm:flex-col sm:space-y-2 sm:space-x-0">
            <Button 
              onClick={confirmarAcao} 
              disabled={isLoading}
              className="w-full bg-orange-500 hover:bg-orange-600"
            >
              {isLoading ? 'Processando...' : 'Confirmar'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowConfirmModal(false)}
              disabled={isLoading}
              className="w-full"
            >
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EscolherTipo;
