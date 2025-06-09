
import { useState } from 'react';
import MobileLayout from '@/components/MobileLayout';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NaoPudeColetar = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [motivoSelecionado, setMotivoSelecionado] = useState('');

  const motivos = [
    'Destinatário ausente',
    'Endereço não localizado',
    'Recusa do remetente',
    'Problema no acesso',
    'Documentação incorreta',
    'Outros'
  ];

  const handleContinuar = () => {
    if (motivoSelecionado) {
      navigate(`/motivocoleta/${id}?motivo=${encodeURIComponent(motivoSelecionado)}`);
    }
  };

  return (
    <MobileLayout title="Não pude coletar" showBackButton>
      <div className="p-4 space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Por que não foi possível fazer a coleta?
          </h2>

          <div className="space-y-3">
            {motivos.map((motivo) => (
              <button
                key={motivo}
                onClick={() => setMotivoSelecionado(motivo)}
                className={`w-full p-4 text-left rounded-lg border transition-colors ${
                  motivoSelecionado === motivo
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {motivo}
              </button>
            ))}
          </div>
        </div>

        <Button 
          onClick={handleContinuar}
          disabled={!motivoSelecionado}
          className="w-full"
        >
          Continuar
        </Button>
      </div>
    </MobileLayout>
  );
};

export default NaoPudeColetar;
