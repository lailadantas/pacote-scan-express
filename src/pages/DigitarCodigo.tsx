
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MobileLayout from '@/components/MobileLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const DigitarCodigo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { pacotes = [] } = location.state || {};
  const [codigo, setCodigo] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!codigo.trim()) {
      navigate('/resultado-bipagem', { 
        state: { 
          resultado: 'erro', 
          codigo: codigo,
          pacotes: pacotes
        },
        replace: true 
      });
      return;
    }

    // Verifica se o código já existe
    const existingPacote = pacotes.find((p: any) => p.codigo === codigo);
    if (existingPacote) {
      navigate('/resultado-bipagem', { 
        state: { 
          resultado: 'erro', 
          codigo: codigo,
          pacotes: pacotes
        },
        replace: true 
      });
      return;
    }

    setIsLoading(true);
    
    // Simula processamento
    setTimeout(() => {
      // Cria o novo pacote
      const newPacote = {
        id: Date.now().toString(),
        codigo: codigo,
        status: 'bipado'
      };
      
      // Adiciona à lista de pacotes
      const updatedPacotes = [...pacotes, newPacote];
      
      navigate('/resultado-bipagem', { 
        state: { 
          resultado: 'sucesso', 
          codigo: codigo,
          pacotes: updatedPacotes
        },
        replace: true 
      });
    }, 1000);
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
  );
};

export default DigitarCodigo;
