
import MobileLayout from '@/components/MobileLayout';
import { useNavigate, useParams } from 'react-router-dom';
import { MapPin, Package, Clock, Phone, MessageCircle, ChevronRight } from 'lucide-react';

const RotaEmAndamento = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const rota = {
    id: 1,
    titulo: "Sumaré 1",
    status: "Em andamento",
    horaInicio: "08:30"
  };

  const servicos = [
    {
      id: 1,
      tipo: "Entrega",
      status: "Em andamento",
      numero: "#123456",
      endereco: "Rua Altino Arantes, 200",
      complemento: "Jardim América, São Paulo, CEP 14020200",
      detalhes: "Complemento do endereço aqui",
      destinatario: "Maria Silva",
      telefone: "(11) 99999-9999",
      horario: "16:00",
      horarioLabel: "Chegada",
      pacotes: 2
    },
    {
      id: 2,
      tipo: "Coleta",
      status: "Em andamento", 
      numero: "#123456",
      endereco: "Rua João Pessoa, 500",
      complemento: "Jardim América, São Paulo, CEP 14020200",
      detalhes: "Complemento do endereço aqui",
      destinatario: "João Santos",
      telefone: "(11) 88888-8888",
      horario: "16:15",
      horarioLabel: "Chegada",
      pacotes: 2
    },
    {
      id: 3,
      tipo: "Entrega",
      status: "Concluído",
      numero: "#123456",
      endereco: "Rua do Comércio, 789",
      complemento: "Centro",
      detalhes: "Complemento do endereço aqui",
      destinatario: "Ana Costa",
      telefone: "(11) 77777-7777",
      horario: "10:15",
      horarioLabel: "Chegada",
      pacotes: 5
    }
  ];

  // Filtrar apenas serviços em andamento
  const servicosEmAndamento = servicos.filter(servico => servico.status === "Em andamento");
  const servicosFinalizados = servicos.filter(servico => servico.status === "Concluído");
  const totalServicos = servicos.length;
  const servicosAndamento = servicosEmAndamento.length;
  const servicosFinalizadosCount = servicosFinalizados.length;

  // Calcular progresso (1 de 10 pontos)
  const pontosCompletos = 1;
  const totalPontos = 10;
  const progresso = (pontosCompletos / totalPontos) * 100;

  return (
    <MobileLayout title={rota.titulo} showBackButton>
      <div className="bg-gray-50 min-h-screen">
        {/* Abas de Status */}
        <div className="bg-white px-4 pt-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <div className="flex-1 bg-white rounded-md py-2 px-4 text-center shadow-sm">
              <span className="text-sm font-medium text-gray-900">Em andamento</span>
              <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-medium">
                {servicosAndamento}
              </span>
            </div>
            <div className="flex-1 py-2 px-4 text-center">
              <span className="text-sm font-medium text-gray-600">Finalizados</span>
              <span className="ml-2 bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs font-medium">
                {servicosFinalizadosCount}
              </span>
            </div>
          </div>
        </div>

        {/* Barra de Progresso */}
        <div className="bg-white px-4 pb-4">
          <div className="flex items-center space-x-2 mt-4">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">{pontosCompletos}/{totalPontos} pontos</span>
          </div>
          <div className="mt-2 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progresso}%` }}
            ></div>
          </div>
        </div>

        {/* Lista de Serviços */}
        <div className="px-4 py-4 space-y-4">
          {servicosEmAndamento.map((servico, index) => (
            <div key={servico.id} className="space-y-3">
              {/* Badge do tipo de serviço */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`px-3 py-1 rounded-lg text-sm font-medium ${
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
              </div>

              {/* Card do serviço */}
              <div 
                onClick={() => navigate(`/detalhedoponto/${servico.id}`)}
                className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
              >
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
                    <p className="text-sm text-gray-500 mb-3">
                      {servico.detalhes}
                    </p>
                    
                    {/* Botão "Vou para lá" */}
                    <button className="text-purple-600 font-medium text-sm hover:text-purple-700">
                      Vou para lá
                    </button>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900 text-sm">
                      {servico.horario}
                    </div>
                    <div className="text-xs text-gray-500">
                      {servico.horarioLabel}
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 mt-1" />
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
