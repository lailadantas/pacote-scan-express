
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MobileLayout from '@/components/MobileLayout';
import { Camera, Upload, PenTool } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const UploadTransferencia = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { pacotes, origem, destino } = location.state || {};
  
  const [fotoPacotes, setFotoPacotes] = useState<File | null>(null);
  const [fotoLocal, setFotoLocal] = useState<File | null>(null);
  const [assinatura, setAssinatura] = useState<File | null>(null);

  const handleFileUpload = (file: File, type: 'pacotes' | 'local' | 'assinatura') => {
    switch (type) {
      case 'pacotes':
        setFotoPacotes(file);
        break;
      case 'local':
        setFotoLocal(file);
        break;
      case 'assinatura':
        setAssinatura(file);
        break;
    }
  };

  const handleConcluir = () => {
    if (!fotoPacotes || !fotoLocal || !assinatura) {
      toast({
        title: "Documentos obrigatórios",
        description: "Envie todas as fotos e assinatura antes de concluir",
        variant: "destructive",
      });
      return;
    }

    navigate('/transferencia-sucesso');
  };

  return (
    <MobileLayout title="Documentação da Transferência" showBackButton showBottomNav={false}>
      <div className="p-4 space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Anexar Documentos</h2>
          
          <div className="space-y-6">
            {/* Upload Foto dos Pacotes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Foto dos Pacotes *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'pacotes')}
                  className="hidden"
                  id="foto-pacotes"
                />
                <label htmlFor="foto-pacotes" className="cursor-pointer">
                  <Camera className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    {fotoPacotes ? 'Foto dos pacotes anexada' : 'Tirar foto dos pacotes'}
                  </p>
                </label>
              </div>
            </div>

            {/* Upload Foto do Local */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Foto do Local *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'local')}
                  className="hidden"
                  id="foto-local"
                />
                <label htmlFor="foto-local" className="cursor-pointer">
                  <Camera className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    {fotoLocal ? 'Foto do local anexada' : 'Tirar foto do local'}
                  </p>
                </label>
              </div>
            </div>

            {/* Upload Assinatura */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assinatura Digital *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'assinatura')}
                  className="hidden"
                  id="assinatura"
                />
                <label htmlFor="assinatura" className="cursor-pointer">
                  <PenTool className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    {assinatura ? 'Assinatura anexada' : 'Anexar assinatura'}
                  </p>
                </label>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">
              <strong>Origem:</strong> {origem}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <strong>Destino:</strong> {destino}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Pacotes:</strong> {pacotes?.length || 0} itens
            </p>
          </div>
        </div>

        <button
          onClick={handleConcluir}
          className="w-full bg-black text-orange-500 py-3 px-4 rounded-xl font-medium hover:bg-gray-800 transition-colors"
        >
          Concluir
        </button>
      </div>
    </MobileLayout>
  );
};

export default UploadTransferencia;
