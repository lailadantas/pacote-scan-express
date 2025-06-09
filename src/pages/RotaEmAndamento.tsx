
import { useState } from 'react';
import MobileLayout from '@/components/MobileLayout';
import { useNavigate, useParams } from 'react-router-dom';
import { Package, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const RotaEmAndamento = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [abaAtiva, setAbaAtiva] = useState('andamento');

  const [servicos, setServicos] = useState([
    { id: 1, numero: "ENT001", endereco: "Rua das Flores, 123", horario: "09:00", pacotes: 3, status: "finalizado" },
    { id: 2, numero: "COL001", endereco: "Av. Principal, 456", horario: "09:30", pacotes: 2, status: "finalizado" },
    { id: 3, numero: "ENT002", endereco: "Rua do Comércio, 789", horario: "10:15", pacotes: 5, status: "andamento" },
    { id: 4, numero: "ENT003", endereco: "Rua da Paz, 321", horario: "10:45", pacotes: 1, status: "andamento" },
    { id: 5, numero: "COL002", endereco: "Av. Libertadores, 654", horario: "11:30", pacotes: 4, status: "andamento" }
  ]);

  const servicosAndamento = servicos.filter(s => s.status === 'andamento');
  const servicosFinalizados = servicos.filter(s => s.status === 'finalizado');
  const totalPacotes = servicos.reduce((acc, s) => acc + s.pacotes, 0);
  const pacotesFinalizados = servicosFinalizados.reduce((acc, s) => acc + s.pacotes, 0);
  const progresso = (pacotesFinalizados / totalPacotes) * 100;

  const todosFinalizados = servicosAndamento.length === 0;

  return (
    <MobileLayout title="Rota Centro - Manhã" showBackButton>
      <div className="flex flex-col h-full">
        {/* Abas */}
        <div className="bg-white border-b">
          <div className="flex">
            <button
              onClick={() => setAbaAtiva('andamento')}
              className={`flex-1 py-3 px-4 text-center font-medium ${
                abaAtiva === 'andamento' 
                  ? 'text-purple-600 border-b-2 border-purple-600' 
                  : 'text-gray-500'
              }`}
            >
              Em andamento ({servicosAndamento.length})
            </button>
            <button
              onClick={() => setAbaAtiva('finalizados')}
              className={`flex-1 py-3 px-4 text-center font-medium ${
                abaAtiva === 'finalizados' 
                  ? 'text-purple-600 border-b-2 border-purple-600' 
                  : 'text-gray-500'
              }`}
            >
              Finalizados ({servicosFinalizados.length})
            </button>
          </div>
        </div>

        {/* Barra de progresso */}
        <div className="bg-white p-4 border-b">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Package className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium">
                {pacotesFinalizados}/{totalPacotes} pacotes
              </span>
            </div>
            <span className="text-sm text-gray-500">{Math.round(progresso)}%</span>
          </div>
          <Progress value={progresso} className="h-2" />
        </div>

        {/* Conteúdo das abas */}
        <div className="flex-1 p-4 overflow-auto">
          {abaAtiva === 'andamento' ? (
            servicosAndamento.length > 0 ? (
              <div className="space-y-3">
                {servicosAndamento.map((servico) => (
                  <ServicoCard 
                    key={servico.id} 
                    servico={servico} 
                    status="andamento"
                    onClick={() => navigate(`/detalhedoponto/${servico.id}`)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Package className="w-16 h-16 text-gray-300 mb-4" />
                <p className="text-gray-500 mb-6">Não há mais serviços em andamento</p>
                <Button onClick={() => navigate('/rotafinalizada')}>
                  Finalizar
                </Button>
              </div>
            )
          ) : (
            <div className="space-y-3">
              {servicosFinalizados.map((servico) => (
                <ServicoCard 
                  key={servico.id} 
                  servico={servico} 
                  status="finalizado"
                />
              ))}
              {todosFinalizados && (
                <div className="pt-4">
                  <Button 
                    onClick={() => navigate('/rotafinalizada')}
                    className="w-full"
                  >
                    Finalizar
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </MobileLayout>
  );
};

const ServicoCard = ({ servico, status, onClick }: { servico: any; status: any; onClick?: () => void }) => {
  const headerColor = status === 'finalizado' ? 'bg-green-500' : 'bg-blue-500';
  
  return (
    <div 
      className={`bg-white rounded-xl shadow-sm overflow-hidden ${onClick ? 'cursor-pointer hover:shadow-md' : ''} transition-shadow`}
      onClick={onClick}
    >
      <div className={`${headerColor} text-white p-3 flex justify-between items-center`}>
        <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
          Entrega
        </span>
        <div className="flex items-center space-x-1">
          <Package className="w-4 h-4" />
          <span className="text-sm">{servico.pacotes}</span>
        </div>
      </div>
      <div className="p-4 space-y-3">
        <div className="font-medium text-gray-800">{servico.numero}</div>
        <div className="text-gray-600 text-sm">{servico.endereco}</div>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2 text-gray-500">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{servico.horario}</span>
          </div>
          {status === 'andamento' && (
            <Button variant="outline" size="sm">
              Vou para lá
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RotaEmAndamento;
