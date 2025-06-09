
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileLayout from '@/components/MobileLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const DigitarCodigo = () => {
  const navigate = useNavigate();
  const [codigo, setCodigo] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!codigo.trim()) {
      toast({
        title: "Código inválido",
        description: "Por favor, insira um código válido",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simula processamento
    setTimeout(() => {
      toast({
        title: "Código processado!",
        description: `Código ${codigo} foi bipado com sucesso`,
      });
      navigate('/bipagem');
    }, 1500);
  };

  return (
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
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={isLoading}
              >
                {isLoading ? 'Processando...' : 'Enviar'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default DigitarCodigo;
