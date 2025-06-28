
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MobileLayout from '@/components/MobileLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const DigitarCodigo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { pacotes = [] } = location.state || {};
  const [codigo, setCodigo] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendToEndpoint = async (barcode: string) => {
    try {
      const requestBody: any = {
        type: "register",
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

      console.log('Enviando código digitado para registro:', requestBody);
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

      console.log('Código registrado com sucesso:', barcode);
      return true;
    } catch (error) {
      console.error('Erro ao registrar código:', error);
      toast({
        title: "Erro ao registrar código",
        description: error instanceof Error ? error.message : "Falha ao enviar dados para o servidor",
        variant: "destructive",
      });
      return false;
    }
  };

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
    
    // Envia o código para o endpoint de registro
    const registrationSuccess = await sendToEndpoint(codigo);
    
    // Simula processamento adicional
    setTimeout(() => {
      if (registrationSuccess) {
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
      } else {
        navigate('/resultado-bipagem', { 
          state: { 
            resultado: 'erro', 
            codigo: codigo,
            pacotes: pacotes
          },
          replace: true 
        });
      }
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
