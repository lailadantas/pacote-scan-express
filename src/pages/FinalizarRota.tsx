
import { useNavigate, useParams } from 'react-router-dom';
import MobileLayout from '@/components/MobileLayout';
import { Button } from '@/components/ui/button';
import { Check, MapPin, Package, Clock } from 'lucide-react';

const FinalizarRota = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const handleFinalizar = () => {
    navigate('/rotafinalizada');
  };

  return (
    <MobileLayout title="Finalizar rota" showBackButton>
      <div className="p-4 space-y-6">
        {/* Confirmação */}
        <div className="bg-white rounded-xl p-6 shadow-sm text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Finalizar serviço?
          </h2>
          <p className="text-gray-600">
            Você está prestes a finalizar o serviço da rota. Certifique-se de que todos os pontos foram visitados.
          </p>
        </div>

        {/* Resumo da rota */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Resumo da rota</h3>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-gray-500" />
              <span className="text-sm text-gray-700">5 pontos visitados</span>
            </div>
            <div className="flex items-center space-x-3">
              <Package className="w-5 h-5 text-gray-500" />
              <span className="text-sm text-gray-700">12 entregas realizadas</span>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-gray-500" />
              <span className="text-sm text-gray-700">Iniciado há 3h 30min</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Button 
            onClick={handleFinalizar}
            className="w-full"
          >
            Finalizar serviço
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => navigate(-1)}
            className="w-full"
          >
            Cancelar
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default FinalizarRota;
