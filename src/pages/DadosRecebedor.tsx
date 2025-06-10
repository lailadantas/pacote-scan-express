
import { useState, useRef } from 'react';
import MobileLayout from '@/components/MobileLayout';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Upload, Camera, PenTool, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const DadosRecebedor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const tipoRecebedor = location.state?.tipoRecebedor || '';
  const nomePreenchido = location.state?.nomePreenchido || '';

  const assinaturaInputRef = useRef<HTMLInputElement>(null);
  const fotoInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    nome: nomePreenchido,
    tipoDocumento: 'RG',
    numeroDocumento: '',
    assinatura: null as File | null,
    fotoLocal: null as File | null
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (field: 'assinatura' | 'fotoLocal', file: File) => {
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  const handleRemoveFile = (field: 'assinatura' | 'fotoLocal') => {
    setFormData(prev => ({ ...prev, [field]: null }));
  };

  const handleSubmit = () => {
    if (formData.nome && formData.numeroDocumento && formData.assinatura && formData.fotoLocal) {
      navigate('/entregasucesso');
    }
  };

  const isFormValid = formData.nome && formData.numeroDocumento && formData.assinatura && formData.fotoLocal;

  return (
    <MobileLayout title="Entregar" showBackButton>
      <div className="p-4 space-y-6">
        <h2 className="text-lg font-semibold text-gray-800">
          Quem recebeu a entrega?
        </h2>
        
        <p className="text-purple-600 font-medium">
          {tipoRecebedor}
        </p>

        <div className="space-y-4">
          {/* Nome */}
          <div>
            <Label htmlFor="nome">Nome completo</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => handleInputChange('nome', e.target.value)}
              placeholder="Digite o nome completo"
            />
          </div>

          {/* Tipo de documento */}
          <div>
            <Label htmlFor="tipoDocumento">Tipo de documento</Label>
            <select
              id="tipoDocumento"
              value={formData.tipoDocumento}
              onChange={(e) => handleInputChange('tipoDocumento', e.target.value)}
              className="w-full h-10 px-3 py-2 text-sm rounded-md border border-input bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="RG">RG</option>
              <option value="CPF">CPF</option>
            </select>
          </div>

          {/* Número do documento */}
          <div>
            <Label htmlFor="numeroDocumento">Número do documento</Label>
            <Input
              id="numeroDocumento"
              value={formData.numeroDocumento}
              onChange={(e) => handleInputChange('numeroDocumento', e.target.value)}
              placeholder="Digite o número do documento"
            />
          </div>

          {/* Upload de assinatura */}
          <div>
            <Label>Assinatura</Label>
            {formData.assinatura ? (
              <div className="space-y-2">
                <div className="relative">
                  <img 
                    src={URL.createObjectURL(formData.assinatura)} 
                    alt="Assinatura" 
                    className="w-full h-24 object-cover rounded-lg border"
                  />
                  <button
                    onClick={() => handleRemoveFile('assinatura')}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => assinaturaInputRef.current?.click()}
                  className="h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-purple-400 transition-colors"
                >
                  <Upload className="w-6 h-6 text-gray-400 mb-1" />
                  <span className="text-xs text-gray-500">Upload</span>
                </button>
                <button
                  onClick={() => {
                    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                      navigator.mediaDevices.getUserMedia({ video: true })
                        .then(stream => {
                          // Simular captura de foto
                          const canvas = document.createElement('canvas');
                          canvas.toBlob((blob) => {
                            if (blob) {
                              const file = new File([blob], 'assinatura.jpg', { type: 'image/jpeg' });
                              handleFileUpload('assinatura', file);
                            }
                          });
                          stream.getTracks().forEach(track => track.stop());
                        });
                    }
                  }}
                  className="h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-purple-400 transition-colors"
                >
                  <Camera className="w-6 h-6 text-gray-400 mb-1" />
                  <span className="text-xs text-gray-500">Câmera</span>
                </button>
              </div>
            )}
            <input
              ref={assinaturaInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload('assinatura', file);
              }}
            />
          </div>

          {/* Upload de foto */}
          <div>
            <Label>Foto do local</Label>
            {formData.fotoLocal ? (
              <div className="space-y-2">
                <div className="relative">
                  <img 
                    src={URL.createObjectURL(formData.fotoLocal)} 
                    alt="Foto do local" 
                    className="w-full h-24 object-cover rounded-lg border"
                  />
                  <button
                    onClick={() => handleRemoveFile('fotoLocal')}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => fotoInputRef.current?.click()}
                  className="h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-purple-400 transition-colors"
                >
                  <Upload className="w-6 h-6 text-gray-400 mb-1" />
                  <span className="text-xs text-gray-500">Upload</span>
                </button>
                <button
                  onClick={() => {
                    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                      navigator.mediaDevices.getUserMedia({ video: true })
                        .then(stream => {
                          // Simular captura de foto
                          const canvas = document.createElement('canvas');
                          canvas.toBlob((blob) => {
                            if (blob) {
                              const file = new File([blob], 'foto-local.jpg', { type: 'image/jpeg' });
                              handleFileUpload('fotoLocal', file);
                            }
                          });
                          stream.getTracks().forEach(track => track.stop());
                        });
                    }
                  }}
                  className="h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-purple-400 transition-colors"
                >
                  <Camera className="w-6 h-6 text-gray-400 mb-1" />
                  <span className="text-xs text-gray-500">Câmera</span>
                </button>
              </div>
            )}
            <input
              ref={fotoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload('fotoLocal', file);
              }}
            />
          </div>
        </div>

        <Button 
          onClick={handleSubmit}
          disabled={!isFormValid}
          className="w-full"
        >
          Confirmar entrega
        </Button>
      </div>
    </MobileLayout>
  );
};

export default DadosRecebedor;
