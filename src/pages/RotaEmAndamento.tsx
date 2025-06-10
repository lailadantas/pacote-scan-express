
import MobileLayout from '@/components/MobileLayout';
import { useNavigate, useParams } from 'react-router-dom';
import { MapPin, Package, Clock, Phone, MessageCircle, ChevronRight } from 'lucide-react';

const RotaEmAndamento = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const rota = {
    id: 1,
    titulo: "Rota Centro - Manhã",
    status: "Em andamento",
    horaInicio: "08:30"
  };

  const servicos = [
    {
      id: 1,
      tipo: "Entrega",
      status: "Concluído",
      endereco: "Rua das Flores, 123 - Centro",
      destinatario: "Maria Silva",
      telefone: "(11) 99999-9999",
      horario: "09:00",
      pacotes: 3
    },
    {
      id: 2,
      tipo: "Coleta",
      status: "Concluído", 
      endereco: "Av. Principal, 456 - Centro",
      destinatario: "João Santos",
      telefone: "(11) 88888-8888",
      horario: "09:30",
      pacotes: 2
    },
    {
      id: 3,
      tipo: "Entrega",
      status: "Em andamento",
      endereco: "Rua do Comércio, 789 - Centro",
      destinatario: "Ana Costa",
      telefone: "(11) 77777-7777",
      horario: "10:15",
      pacotes: 5
    },
    {
      id: 4,
      tipo: "Entrega",
      status: "Pendente",
      endereco: "Rua da Paz, 321 - Centro",
      destinatario: "Carlos Lima",
      telefone: "(11) 66666-6666",
      horario: "10:45",
      pacotes: 1
    },
    {
      id: 5,
      tipo: "Coleta",
      status: "Pendente",
      endereco: "Av. Libertadores, 654 - Centro",
      destinatario: "Fernanda Oliveira",
      telefone: "(11) 55555-5555",
      horario: "11:30",
      pacotes: 4
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Concluído':
        return 'bg-green-100 text-green-800';
      case 'Em andamento':
        return 'bg-blue-100 text-blue-800';
      case 'Pendente':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <MobileLayout title={rota.titulo} showBackButton>
      <div className="p-4 space-y-6">
        {/* Status da rota */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-gray-800">Status da rota</h3>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {rota.status}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <Clock className="w-4 h-4" />
            <span className="text-sm">Iniciado às {rota.horaInicio}</span>
          </div>
        </div>

        {/* Lista de serviços */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800">Serviços da rota</h3>
          
          {servicos.map((servico) => (
            <div 
              key={servico.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
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
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{servico.destinatario}</div>
                    <div className="text-gray-600 text-sm">{servico.endereco}</div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(servico.status)}`}>
                    {servico.status}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2 text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{servico.horario}</span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button className="p-2 bg-green-100 rounded-full hover:bg-green-200 transition-colors">
                      <Phone className="w-4 h-4 text-green-600" />
                    </button>
                    <button className="p-2 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors">
                      <MessageCircle className="w-4 h-4 text-blue-600" />
                    </button>
                    <button 
                      onClick={() => navigate(`/detalhedoponto/${servico.id}`)}
                      className="p-2 bg-purple-100 rounded-full hover:bg-purple-200 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4 text-purple-600" />
                    </button>
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

export default RotaEmAndamento;
