
import { useState } from 'react';
import MobileLayout from '@/components/MobileLayout';
import { useNavigate, useParams } from 'react-router-dom';

const NaoPudeEntregar = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [motivoSelecionado, setMotivoSelecionado] = useState('');

  const motivos = [
    "Ninguém para receber",
    "Endereço não encontrado", 
    "Local fechado",
    "Recusa",
    "Avaria",
    "Documento retido",
    "Outro"
  ];

  const handleMotivoClick = (motivo: string) => {
    setMotivoSelecionado(motivo);
    navigate(`/motivoentrega/${id}`, { state: { motivo } });
  };

  return (
    <MobileLayout title="Não pude entregar" showBackButton>
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">
          Motivo:
        </h2>
        
        <div className="space-y-3">
          {motivos.map((motivo, index) => (
            <label key={index} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="motivo"
                value={motivo}
                checked={motivoSelecionado === motivo}
                onChange={() => setMotivoSelecionado(motivo)}
                className="w-4 h-4 text-purple-600"
              />
              <span className="text-gray-800">{motivo}</span>
            </label>
          ))}
        </div>

        {motivoSelecionado && (
          <div className="mt-6">
            <button
              onClick={() => handleMotivoClick(motivoSelecionado)}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              Continuar
            </button>
          </div>
        )}
      </div>
    </MobileLayout>
  );
};

export default NaoPudeEntregar;
