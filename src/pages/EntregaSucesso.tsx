
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MobileLayout from '@/components/MobileLayout';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EntregaSucesso = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    // Marcar serviço como finalizado
    if (id) {
      localStorage.setItem('servicoFinalizado', id);
    }
  }, [id]);

  const handleVoltar = () => {
    navigate('/rotaemandamento/1');
  };

  return (
    <MobileLayout title="Entrega Realizada" showBackButton={false}>
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">
              Entrega Realizada!
            </h1>
            <p className="text-gray-600">
              O pacote foi entregue com sucesso
            </p>
          </div>

          <div className="space-y-3 w-full max-w-sm">
            <Button 
              onClick={handleVoltar}
              className="w-full"
            >
              Voltar à Rota
            </Button>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default EntregaSucesso;
