
import MobileLayout from '@/components/MobileLayout';
import { useNavigate, useParams } from 'react-router-dom';
import { MapPin, Package, Clock, Phone, MessageCircle, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

const RotaEmAndamento = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [abaAtiva, setAbaAtiva] = useState<'em-andamento' | 'finalizados'>('em-andamento');
  
  // Estado para controlar quais serviços foram finalizados
  const [servicosFinalizados, setServicosFinalizados] = useState<number[]>([]);

  const rota = {
    id: 1,
    titulo: "Sumaré 1",
    status: "Em andamento",
    horaInicio: "08:30"
  };

  const servicosIniciais = [
    {
      id: 1,
      tipo: "Entrega",
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
      numero: "#123456",
      endereco: "Rua do Comércio, 789",
      complemento: "Centro",
      detalhes: "Complemento do endereço aqui",
      destinatario: "Ana Costa",
      telefone: "(11) 77777-7777",
      horario: "10:15",
      horarioLabel: "Chegou",
      pacotes: 5
    }
  ];

  // Mapear serviços com status dinâmico baseado no estado
  const servicos = servicosIniciais.map(servico => ({
    ...servico,
    status: servicosFinalizados.includes(servico.id) ? "Concluído" : "Em andamento"
  }));

  // Verificar se o usuário voltou de uma tela de finalização
  useEffect(() => {
    const servicoFinalizado = localStorage.getItem('servicoFinalizado');
    if (servicoFinalizado) {
      const servicoId = parseInt(servicoFinalizado);
      if (!servicosFinalizados.includes(servicoId)) {
        setServicosFinalizados(prev => [...prev, servicoId]);
      }
      localStorage.removeItem('servicoFinalizado');
    }
  }, [servicosFinalizados]);

  // Filtrar serviços baseado na aba ativa
  const servicosEmAndamento = servicos.filter(servico => servico.status === "Em andamento");
  const servicosConcluidos = servicos.filter(servico => servico.status === "Concluído");
  const servicosExibidos = abaAtiva === 'em-andamento' ? servicosEmAndamento : servicosConcluidos;
  
  const totalServicos = servicos.length;
  const servicosAndamento = servicosEmAndamento.length;
  const servicosFinalizadosCount = servicosConcluidos.length;

  // Calcular progresso baseado em pontos finalizados vs total de pontos
  const totalPontos = 10; // Total de pontos da rota
  const pontosFinalizados = servicosFinalizadosCount;
  const pontosEmAndamento = servicosAndamento;
  const progresso = (pontosFinalizados / totalPontos) * 100;

  const handleServicoClick = (servicoId: number) => {
    // Navegar para detalhe do ponto
    navigate(`/detalhedoponto/${servicoId}`);
  };

  return (
    <MobileLayout title={rota.titulo} showBackButton>
      <div className="bg-gray-50 min-h-screen">
        {/* Abas de Status */}
        <div className="bg-white px-4 pt-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <div 
              className={`flex-1 py-2 px-4 text-center rounded-md cursor-pointer transition-colors ${
                abaAtiva === 'em-andamento' 
                  ? 'bg-white shadow-sm' 
                  : 'hover:bg-gray-200'
              }`}
              onClick={() => setAbaAtiva('em-andamento')}
            >
              <span className={`text-sm font-medium ${
                abaAtiva === 'em-andamento' ? 'text-gray-900' : 'text-gray-600'
              }`}>
                Em andamento
              </span>
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                abaAtiva === 'em-andamento' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {servicosAndamento}
              </span>
            </div>
            <div 
              className={`flex-1 py-2 px-4 text-center rounded-md cursor-pointer transition-colors ${
                abaAtiva === 'finalizados' 
                  ? 'bg-white shadow-sm' 
                  : 'hover:bg-gray-200'
              }`}
              onClick={() => setAbaAtiva('finalizados')}
            >
              <span className={`text-sm font-medium ${
                abaAtiva === 'finalizados' ? 'text-gray-900' : 'text-gray-600'
              }`}>
                Finalizados
              </span>
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                abaAtiva === 'finalizados' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {servicosFinalizadosCount}
              </span>
            </div>
          </div>
        </div>

        {/* Barra de Progresso */}
        <div className="bg-white px-4 pb-4">
          <div className="flex items-center space-x-2 mt-4">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">{pontosFinalizados}/{totalPontos} pontos</span>
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
          {servicosExibidos.map((servico, index) => (
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
                onClick={() => handleServicoClick(servico.id)}
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
                    
                    {/* Botão "Vou para lá" apenas para serviços em andamento */}
                    {abaAtiva === 'em-andamento' && (
                      <button className="text-purple-600 font-medium text-sm hover:text-purple-700">
                        Vou para lá
                      </button>
                    )}

                    {/* Status de finalizado para aba finalizados */}
                    {abaAtiva === 'finalizados' && (
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-green-600 font-medium">Finalizado</span>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900 text-sm">
                      {servico.horario}
                    </div>
                    <div className="text-xs text-gray-500">
                      {abaAtiva === 'finalizados' ? 'Finalizado' : servico.horarioLabel}
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
