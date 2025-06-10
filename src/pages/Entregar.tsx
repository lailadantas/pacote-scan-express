
import { useState } from 'react';
import MobileLayout from '@/components/MobileLayout';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Entregar = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedOption, setSelectedOption] = useState('');

  const destinatarioNome = "Maria Silva Santos";

  const opcoes = [
    { id: 'destinatario', label: destinatarioNome },
    { id: 'responsavel', label: 'Responsável pelo local' },
    { id: 'porteiro', label: 'Porteiro' },
    { id: 'vizinho', label: 'Vizinho' },
    { id: 'outros', label: 'Outros' }
  ];

  const handleContinuar = () => {
    const tipoRecebedor = opcoes.find(op => op.id === selectedOption)?.label || '';
    navigate(`/dadosrecebedor/${id}`, { 
      state: { 
        tipoRecebedor,
        nomePreenchido: selectedOption === 'destinatario' ? destinatarioNome : ''
      } 
    });
  };

  return (
    <MobileLayout title="Entregar" showBackButton>
      <div className="p-4 space-y-6">
        <h2 className="text-lg font-semibold text-gray-800">
          Quem recebeu a entrega?
        </h2>

        <div className="space-y-3">
          {opcoes.map((opcao) => (
            <button
              key={opcao.id}
              onClick={() => setSelectedOption(opcao.id)}
              className={`w-full p-4 text-left rounded-xl border-2 transition-colors ${
                selectedOption === opcao.id
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                  selectedOption === opcao.id
                    ? 'border-purple-500 bg-purple-500'
                    : 'border-gray-300'
                }`}>
                  {selectedOption === opcao.id && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <span className="font-medium text-gray-800">{opcao.label}</span>
              </div>
            </button>
          ))}
        </div>

        <Button 
          onClick={handleContinuar}
          disabled={!selectedOption}
          className="w-full"
        >
          Continuar
        </Button>
      </div>
    </MobileLayout>
  );
};

export default Entregar;
