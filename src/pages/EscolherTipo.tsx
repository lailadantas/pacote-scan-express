
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

const EscolherTipo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { pacotes = [] } = location.state || {};
  const [tipoServico, setTipoServico] = useState('');
  const [localTransferencia, setLocalTransferencia] = useState('');
  const [showTransferencia, setShowTransferencia] = useState(false);

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

    if (tipoServico === 'recebimento') {
      // Adiciona ao estoque local
      const existingStock = JSON.parse(localStorage.getItem('userStock') || '[]');
      const updatedStock = [...existingStock, ...pacotes];
      localStorage.setItem('userStock', JSON.stringify(updatedStock));
      
      toast({
        title: "Recebimento finalizado!",
        description: `${pacotes.length} pacotes recebidos no estoque`,
      });
      navigate('/estoque');
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
      navigate('/estoque');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-orange-500 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8"
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-purple-600 rounded-2xl flex items-center justify-center">
            <span className="text-2xl">📦</span>
          </div>
          <h1 className="text-xl font-bold text-gray-800 mb-2">
            Que tipo de serviço você está fazendo?
          </h1>
          <p className="text-sm text-gray-600">
            {pacotes.length} pacotes bipados
          </p>
        </div>

        <div className="space-y-6">
          <RadioGroup value={tipoServico} onValueChange={handleTipoChange}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="recebimento" id="recebimento" />
              <Label htmlFor="recebimento">Recebimento</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="transferencia" id="transferencia" />
              <Label htmlFor="transferencia">Entrega de transferência</Label>
            </div>
          </RadioGroup>

          {showTransferencia && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <Label>Local de transferência</Label>
              <Select value={localTransferencia} onValueChange={setLocalTransferencia}>
                <SelectTrigger>
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

        <div className="mt-8 space-y-4">
          <Button
            onClick={handleFinalizar}
            disabled={!tipoServico || (tipoServico === 'transferencia' && !localTransferencia)}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            Finalizar Serviço
          </Button>
          
          <Button
            variant="outline"
            onClick={() => navigate('/bipagem', { state: { pacotes } })}
            className="w-full"
          >
            Voltar
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default EscolherTipo;
