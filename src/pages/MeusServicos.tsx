
import MobileLayout from '@/components/MobileLayout';
import { useNavigate } from 'react-router-dom';
import { MapPin, Package, Box, Weight, ChevronRight } from 'lucide-react';

const MeusServicos = () => {
  const navigate = useNavigate();

  const rotas = [
    {
      id: 1,
      titulo: "Rota Centro - Manhã",
      horarioEntrada: "08:00",
      horarioSaida: "12:00",
      pontos: 12,
      pacotes: 45,
      volume: "2.5m³",
      peso: "150kg"
    },
    {
      id: 2,
      titulo: "Rota Zona Sul - Tarde",
      horarioEntrada: "13:00",
      horarioSaida: "18:00",
      pontos: 8,
      pacotes: 32,
      volume: "1.8m³",
      peso: "120kg"
    },
    {
      id: 3,
      titulo: "Rota Express - Noite",
      horarioEntrada: "19:00",
      horarioSaida: "22:00",
      pontos: 5,
      pacotes: 18,
      volume: "0.9m³",
      peso: "65kg"
    }
  ];

  return (
    <MobileLayout title="Meus serviços" showBackButton>
      <div className="p-4 space-y-4">
        {rotas.map((rota) => (
          <div 
            key={rota.id}
            onClick={() => navigate(`/detalhedoservico/${rota.id}`)}
            className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
          >
            {/* Header lilás */}
            <div className="bg-purple-500 text-white p-4 flex justify-between items-center">
              <h3 className="font-semibold text-lg">{rota.titulo}</h3>
              <div className="text-right">
                <div className="text-sm opacity-90">Entrada: {rota.horarioEntrada}</div>
                <div className="text-sm opacity-90">Saída: {rota.horarioSaida}</div>
              </div>
            </div>

            {/* Conteúdo do card */}
            <div className="p-4 flex items-center justify-between">
              <div className="grid grid-cols-2 gap-4 flex-1">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <span className="text-sm font-medium">{rota.pontos} pontos</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Package className="w-5 h-5 text-gray-500" />
                  <span className="text-sm font-medium">{rota.pacotes} pacotes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Box className="w-5 h-5 text-gray-500" />
                  <span className="text-sm font-medium">{rota.volume}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Weight className="w-5 h-5 text-gray-500" />
                  <span className="text-sm font-medium">{rota.peso}</span>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 text-gray-400 ml-4" />
            </div>
          </div>
        ))}
      </div>
    </MobileLayout>
  );
};

export default MeusServicos;
