
import { useNavigate, useParams } from 'react-router-dom';
import MobileLayout from '@/components/MobileLayout';
import { Button } from '@/components/ui/button';
import { Package, User } from 'lucide-react';

const Coletar = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const handleIniciarBipagem = () => {
    // Redireciona para a bipagem no contexto de coleta
    navigate(`/bipagem?contexto=coleta&pontoId=${id}`);
  };

  return (
    <MobileLayout title="Coletar" showBackButton>
      <div className="p-4 space-y-6">
        {/* Informações do local */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center space-x-3 mb-3">
            <User className="w-5 h-5 text-gray-500" />
            <span className="font-medium">Maria Silva Santos</span>
          </div>
          <p className="text-gray-600 text-sm">
            Rua das Flores, 123 - Apto 45, Bloco B<br/>
            Centro, São Paulo - SP
          </p>
        </div>

        {/* Informações sobre a coleta */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-3">Pacotes para coletar</h3>
          <div className="flex items-center space-x-3 text-gray-600">
            <Package className="w-5 h-5" />
            <span>3 pacotes aguardando coleta</span>
          </div>
        </div>

        {/* Instruções */}
        <div className="bg-blue-50 rounded-xl p-4">
          <h3 className="font-semibold text-blue-800 mb-2">Instruções</h3>
          <p className="text-blue-700 text-sm">
            Você será direcionado para a tela de bipagem para registrar todos os pacotes que serão coletados.
          </p>
        </div>

        {/* Botão para iniciar bipagem */}
        <Button onClick={handleIniciarBipagem} className="w-full">
          Iniciar coleta (bipagem)
        </Button>
      </div>
    </MobileLayout>
  );
};

export default Coletar;
