
import MobileLayout from '@/components/MobileLayout';
import { useNavigate, useParams } from 'react-router-dom';
import { MapPin, Package, Box, Weight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DetalheDoServico = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const rota = {
    id: 1,
    titulo: "Rota Centro - Manhã",
    totalServicos: 5,
    pontos: 12,
    pacotes: 45,
    volume: "2.5m³",
    peso: "150kg"
  };

  const servicos = [
    {
      id: 1,
      tipo: "Entrega",
      numero: "ENT001",
      endereco: "Rua das Flores, 123 - Centro",
      horario: "09:00",
      pacotes: 3
    },
    {
      id: 2,
      tipo: "Coleta",
      numero: "COL001",
      endereco: "Av. Principal, 456 - Centro",
      horario: "09:30",
      pacotes: 2
    },
    {
      id: 3,
      tipo: "Entrega",
      numero: "ENT002",
      endereco: "Rua do Comércio, 789 - Centro",
      horario: "10:15",
      pacotes: 5
    },
    {
      id: 4,
      tipo: "Entrega",
      numero: "ENT003",
      endereco: "Rua da Paz, 321 - Centro",
      horario: "10:45",
      pacotes: 1
    },
    {
      id: 5,
      tipo: "Coleta",
      numero: "COL002",
      endereco: "Av. Libertadores, 654 - Centro",
      horario: "11:30",
      pacotes: 4
    }
  ];

  return (
    <MobileLayout title={rota.titulo} showBackButton>
      <div className="p-4 space-y-6">
        {/* Informações gerais */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <p className="text-lg font-medium text-gray-800 mb-4">
            Você tem {rota.totalServicos} serviços a fazer nessa rota
          </p>
          
          <Button 
            onClick={() => navigate(`/rotaemandamento/${id}`)}
            className="w-full mb-6"
          >
            Iniciar
          </Button>

          <h3 className="text-lg font-semibold text-gray-800 mb-4">Dados dos serviços</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-gray-500" />
              <span className="text-sm">{rota.pontos} pontos</span>
            </div>
            <div className="flex items-center space-x-2">
              <Package className="w-5 h-5 text-gray-500" />
              <span className="text-sm">{rota.pacotes} pacotes</span>
            </div>
            <div className="flex items-center space-x-2">
              <Box className="w-5 h-5 text-gray-500" />
              <span className="text-sm">{rota.volume}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Weight className="w-5 h-5 text-gray-500" />
              <span className="text-sm">{rota.peso}</span>
            </div>
          </div>
        </div>

        {/* Lista de serviços */}
        <div className="space-y-3">
          {servicos.map((servico) => (
            <div 
              key={servico.id}
              onClick={() => navigate(`/detalhedoponto/${servico.id}`)}
              className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow w-full"
            >
              {/* Header do card */}
              <div className={`text-white p-3 flex justify-between items-center ${
                servico.tipo === 'Coleta' ? 'bg-orange-500' : 'bg-blue-500'
              }`}>
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                  {servico.tipo}
                </span>
                <div className="flex items-center space-x-1">
                  <Package className="w-4 h-4" />
                  <span className="text-sm">{servico.pacotes}</span>
                </div>
              </div>

              {/* Body do card */}
              <div className="p-4 space-y-3">
                <div className="font-medium text-gray-800">{servico.numero}</div>
                <div className="text-gray-600 text-sm">{servico.endereco}</div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2 text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{servico.horario}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MobileLayout>
  );
};

export default DetalheDoServico;
