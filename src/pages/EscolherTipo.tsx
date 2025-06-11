
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
    setShowTransferencia(value === 'transferencia');
    if (value !== 'transferencia') {
      setLocalTransferencia('');
    }
  };

  const handleFinalizar = () => {
    if (!tipoServico) {
      toast({
        title: "Selecione o tipo de serviço",
        description: "Escolha entre Recebimento ou Entrega de transferência",
        variant: "destructive",
      });
      return;
    }

    if (tipoServico === 'transferencia' && !localTransferencia) {
      toast({
        title: "Selecione o local de transferência",
        description: "Escolha para onde os pacotes serão transferidos",
        variant: "destructive",
      });
      return;
    }

    setShowConfirmModal(true);
  };

  const confirmarAcao = () => {
    if (tipoServico === 'recebimento') {
      // Adiciona ao estoque local
      const existingStock = JSON.parse(localStorage.getItem('userStock') || '[]');
      const updatedStock = [...existingStock, ...pacotes];
      localStorage.setItem('userStock', JSON.stringify(updatedStock));
      
      toast({
        title: "Recebimento finalizado!",
        description: `${pacotes.length} pacotes recebidos no estoque`,
      });
    } else if (tipoServico === 'transferencia') {
      // Remove do estoque local
      const existingStock = JSON.parse(localStorage.getItem('userStock') || '[]');
      const pacoteIds = pacotes.map(p => p.id);
      const updatedStock = existingStock.filter(item => !pacoteIds.includes(item.id));
      localStorage.setItem('userStock', JSON.stringify(updatedStock));
      
      toast({
        title: "Transferência finalizada!",
        description: `${pacotes.length} pacotes enviados para ${localTransferencia}`,
      });
    }
    
    setShowConfirmModal(false);
    navigate('/estoque');
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
                tipoServico === 'recebimento' 
                  ? 'border-orange-500 bg-orange-50' 
                  : 'border-gray-200 bg-white'
              }`}>
                <RadioGroupItem 
                  value="recebimento" 
                  id="recebimento"
                  className={tipoServico === 'recebimento' ? 'border-orange-500 text-orange-500' : ''}
                />
                <Label 
                  htmlFor="recebimento" 
                  className={`flex-1 cursor-pointer ${
                    tipoServico === 'recebimento' ? 'text-orange-600' : 'text-gray-900'
                  }`}
                >
                  Recebimento
                </Label>
              </div>
              
              <div className={`flex items-center space-x-3 p-4 border-2 rounded-xl transition-colors ${
                tipoServico === 'transferencia' 
                  ? 'border-orange-500 bg-orange-50' 
                  : 'border-gray-200 bg-white'
              }`}>
                <RadioGroupItem 
                  value="transferencia" 
                  id="transferencia"
                  className={tipoServico === 'transferencia' ? 'border-orange-500 text-orange-500' : ''}
                />
                <Label 
                  htmlFor="transferencia" 
                  className={`flex-1 cursor-pointer ${
                    tipoServico === 'transferencia' ? 'text-orange-600' : 'text-gray-900'
                  }`}
                >
                  Entrega de transferência
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
            disabled={!tipoServico || (tipoServico === 'transferencia' && !localTransferencia)}
            className={`w-full py-3 rounded-xl font-medium text-white transition-colors ${
              tipoServico && (tipoServico !== 'transferencia' || localTransferencia)
                ? 'bg-orange-500 hover:bg-orange-600'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            Finalizar serviço
          </Button>
        </div>
      </div>

      {/* Modal de Confirmação */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle>Confirmar ação</DialogTitle>
            <DialogDescription>
              {tipoServico === 'recebimento' 
                ? `Deseja realmente finalizar o recebimento de ${pacotes.length} pacotes?`
                : `Deseja realmente finalizar a transferência de ${pacotes.length} pacotes para ${localTransferencia}?`
              }
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col space-y-2 sm:flex-col sm:space-y-2 sm:space-x-0">
            <Button onClick={confirmarAcao} className="w-full bg-orange-500 hover:bg-orange-600">
              Confirmar
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowConfirmModal(false)}
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
