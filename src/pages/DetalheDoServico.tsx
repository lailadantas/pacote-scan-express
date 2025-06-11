
import MobileLayout from '@/components/MobileLayout';
import { useNavigate, useParams } from 'react-router-dom';
import { MapPin, Package, Box, Weight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DetalheDoServico = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const rota = {
    id: 1,
    titulo: "Sumaré 1",
    totalServicos: 10,
    pontos: 10,
    pacotes: 35,
    volume: "2 m³",
    peso: "100 kgs"
  };

  const servicos = [
    {
      id: 1,
      tipo: "Entrega",
      numero: "#123456",
      endereco: "Rua Altino Arantes, 200",
      complemento: "Jardim América, São Paulo, CEP 14020200",
      detalhes: "Complemento do endereço aqui",
      horario: "16:00",
      horarioLabel: "Chegada",
      pacotes: 2
    },
    {
      id: 2,
      tipo: "Coleta",
      numero: "#123456",
      endereco: "Rua João Pessoa, 500",
      complemento: "Jardim América, São Paulo, CEP 14020200",
      detalhes: "Complemento do endereço aqui",
      horario: "16:15",
      horarioLabel: "Chegada",
      pacotes: 2
    }
  ];

  return (
    <MobileLayout title={rota.titulo} showBackButton>
      <div className="p-4 space-y-6">
        {/* Informações gerais */}
        <div className="space-y-4">
          <p className="text-lg text-gray-800">
            Você tem <span className="font-bold">{rota.totalServicos} serviços</span> a fazer nessa rota
          </p>
          
          <Button 
            onClick={() => navigate(`/rotaemandamento/${id}`)}
            className="w-full h-12 bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700 text-white font-medium rounded-full"
          >
            Iniciar
          </Button>

          <h3 className="text-lg font-semibold text-gray-800">Dados do serviço</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium">{rota.pontos} pontos</span>
            </div>
            <div className="flex items-center space-x-2">
              <Weight className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium">{rota.peso}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Box className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium">{rota.pacotes} pacotes</span>
            </div>
            <div className="flex items-center space-x-2">
              <Package className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium">{rota.volume}</span>
            </div>
          </div>
        </div>

        {/* Lista de serviços */}
        <div className="space-y-4">
          {servicos.map((servico, index) => (
            <div key={servico.id} className="space-y-3">
              {/* Badge do tipo de serviço */}
              <div className="flex items-center space-x-3">
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  servico.tipo === 'Coleta' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-purple-100 text-purple-800'
                }`}>
                  {servico.tipo} {servico.numero}
                </div>
                <div className="flex items-center space-x-1 text-purple-600">
                  <Package className="w-4 h-4" />
                  <span className="text-sm font-medium">{servico.pacotes} pacotes</span>
                </div>
              </div>

              {/* Card do serviço */}
              <div 
                onClick={() => navigate(`/detalhedoponto/${servico.id}`)}
                className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start space-x-3">
                      <div className="text-2xl font-bold text-purple-600">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {servico.endereco}
                        </h4>
                        <p className="text-sm text-gray-600 mb-1">
                          {servico.complemento}
                        </p>
                        <p className="text-sm text-gray-500">
                          {servico.detalhes}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="font-semibold text-gray-900">
                      {servico.horario}
                    </div>
                    <div className="text-xs text-gray-500">
                      {servico.horarioLabel}
                    </div>
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
