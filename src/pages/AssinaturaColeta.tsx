
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MobileLayout from '@/components/MobileLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Camera } from 'lucide-react';

const AssinaturaColeta = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [relato, setRelato] = useState('');
  const [fotoTirada, setFotoTirada] = useState(false);

  const handleTirarFoto = () => {
    setFotoTirada(true);
    // Simula tirar foto
  };

  const handleFinalizarServico = () => {
    // Redireciona para a tela de sucesso da coleta
    navigate('/coletasucesso');
  };

  return (
    <MobileLayout title="Coletar" showBackButton>
      <div className="p-4 space-y-6">
        {/* Seção de Assinatura */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-3">Assinatura do recebedor</h3>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center min-h-[120px] flex items-center justify-center">
            <div className="text-center">
              <Camera className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <p className="text-orange-500 text-sm font-medium">Tirar foto</p>
            </div>
          </div>
        </div>

        {/* Seção de Relato */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-3">Relato</h3>
          <Textarea
            placeholder="Text input"
            value={relato}
            onChange={(e) => setRelato(e.target.value)}
            className="min-h-[100px] resize-none"
          />
        </div>

        {/* Botão de Finalizar */}
        <div className="mt-auto">
          <Button 
            onClick={handleFinalizarServico}
            className="w-full bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700 text-white font-medium py-3 rounded-xl"
          >
            Finalizar serviço
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default AssinaturaColeta;
