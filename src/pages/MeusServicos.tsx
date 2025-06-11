
import MobileLayout from '@/components/MobileLayout';
import { useNavigate } from 'react-router-dom';
import { MapPin, Package, Users, Weight, ChevronRight } from 'lucide-react';

const MeusServicos = () => {
  const navigate = useNavigate();

  const servicosPorData = [
    {
      data: "Quinta-feira - 21/11/24",
      servicos: [
        {
          id: 1,
          titulo: "Sumaré 1",
          horarioEntrada: "08:00",
          horarioSaida: "17:00h",
          pontos: 25,
          pacotes: 30,
          volume: "100m³",
          peso: "100 kgs"
        }
      ]
    },
    {
      data: "Sexta-feira - 22/11/24", 
      servicos: [
        {
          id: 2,
          titulo: "Porto Ferreira 2",
          horarioEntrada: "08:00",
          horarioSaida: "17:00h",
          pontos: 25,
          pacotes: 30,
          volume: "100m³",
          peso: "100 kgs"
        }
      ]
    },
    {
      data: "Sábado - 23/11/24",
      servicos: [
        {
          id: 3,
          titulo: "Indaiatuba 1",
          horarioEntrada: "08:00",
          horarioSaida: "17:00h",
          pontos: 25,
          pacotes: 30,
          volume: "100m³",
          peso: "100 kgs"
        }
      ]
    }
  ];

  return (
    <MobileLayout title="Meus serviços" showBackButton>
      <div className="p-4 space-y-6">
        {servicosPorData.map((grupo, index) => (
          <div key={index} className="space-y-3">
            {/* Data */}
            <div className="text-gray-600 text-sm font-medium">
              {grupo.data}
            </div>
            
            {/* Serviços do dia */}
            {grupo.servicos.map((servico) => (
              <div 
                key={servico.id}
                onClick={() => navigate(`/detalhedoservico/${servico.id}`)}
                className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              >
                {/* Header lilás */}
                <div className="bg-purple-500 text-white p-4 flex justify-between items-center">
                  <h3 className="font-semibold text-lg">{servico.titulo}</h3>
                  <div className="text-right">
                    <div className="text-sm opacity-90">{servico.horarioEntrada} - {servico.horarioSaida}</div>
                  </div>
                </div>

                {/* Conteúdo do card */}
                <div className="p-4 flex items-center justify-between">
                  <div className="grid grid-cols-2 gap-4 flex-1">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-5 h-5 text-gray-500" />
                      <span className="text-sm font-medium">{servico.pontos}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Package className="w-5 h-5 text-gray-500" />
                      <span className="text-sm font-medium">{servico.pacotes}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-5 h-5 text-gray-500" />
                      <span className="text-sm font-medium">{servico.volume}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Weight className="w-5 h-5 text-gray-500" />
                      <span className="text-sm font-medium">{servico.peso}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-6 h-6 text-gray-400 ml-4" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </MobileLayout>
  );
};

export default MeusServicos;
