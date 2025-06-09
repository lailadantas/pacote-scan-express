
import MobileLayout from '@/components/MobileLayout';
import { useNavigate, useParams } from 'react-router-dom';
import { Check } from 'lucide-react';

const Entregar = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const opcoes = [
    "Maria Silva Santos",
    "Familiar/amigo", 
    "Vizinho",
    "Recepcionista/Portaria",
    "Outro"
  ];

  const handleOpcaoClick = (opcao: string) => {
    navigate(`/dadosrecebedor/${id}`, { state: { tipoRecebedor: opcao } });
  };

  return (
    <MobileLayout title="Entregar" showBackButton>
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">
          Quem recebeu a entrega?
        </h2>
        
        <div className="space-y-3">
          {opcoes.map((opcao, index) => (
            <button
              key={index}
              onClick={() => handleOpcaoClick(opcao)}
              className="w-full bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow text-left border border-gray-100 hover:border-purple-200"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-800">{opcao}</span>
                <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                  <Check className="w-4 h-4 text-transparent" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </MobileLayout>
  );
};

export default Entregar;
