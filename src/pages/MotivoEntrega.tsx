
import { useState } from 'react';
import MobileLayout from '@/components/MobileLayout';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const MotivoEntrega = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const motivo = location.state?.motivo || '';

  const [relato, setRelato] = useState('');
  const [fotos, setFotos] = useState([]);

  const handleFotoUpload = () => {
    // Simular upload de foto
    setFotos(prev => [...prev, `foto_${Date.now()}.jpg`]);
  };

  const handleSalvar = () => {
    if (relato.trim()) {
      navigate('/registrosucesso');
    }
  };

  return (
    <MobileLayout title="Não pude entregar" showBackButton>
      <div className="p-4 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Motivo:
          </h2>
          <p className="text-purple-600 font-medium">{motivo}</p>
        </div>

        <div>
          <Label htmlFor="relato">Relato detalhado</Label>
          <textarea
            id="relato"
            value={relato}
            onChange={(e) => setRelato(e.target.value)}
            placeholder="Descreva o que aconteceu..."
            className="w-full h-32 px-3 py-2 text-sm rounded-md border border-input bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
          />
        </div>

        <div>
          <Label>Evidências (fotos)</Label>
          <button
            onClick={handleFotoUpload}
            className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-purple-400 transition-colors mt-2"
          >
            <Camera className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">Toque para adicionar foto</p>
          </button>
          
          {fotos.length > 0 && (
            <div className="mt-3">
              <p className="text-sm text-green-600">
                {fotos.length} foto(s) adicionada(s)
              </p>
            </div>
          )}
        </div>

        <Button 
          onClick={handleSalvar}
          disabled={!relato.trim()}
          className="w-full"
        >
          Salvar
        </Button>
      </div>
    </MobileLayout>
  );
};

export default MotivoEntrega;
