
import { useState } from 'react';
import MobileLayout from '@/components/MobileLayout';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MotivoColeta = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const motivo = searchParams.get('motivo');
  const [observacoes, setObservacoes] = useState('');

  const handleFinalizar = () => {
    navigate('/registrosucesso');
  };

  return (
    <MobileLayout title="Detalhes da ocorrência" showBackButton>
      <div className="p-4 space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Motivo selecionado
          </h2>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-gray-700">{motivo}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-3">
            Observações adicionais (opcional)
          </h3>
          <textarea
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            placeholder="Descreva detalhes adicionais..."
            className="w-full h-24 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-3">
            Foto do local (opcional)
          </h3>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">Toque para tirar uma foto</p>
          </div>
        </div>

        <Button onClick={handleFinalizar} className="w-full">
          Registrar ocorrência
        </Button>
      </div>
    </MobileLayout>
  );
};

export default MotivoColeta;
