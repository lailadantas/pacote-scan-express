
import { useState } from 'react';
import MobileLayout from '@/components/MobileLayout';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Upload, Camera, PenTool } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const DadosRecebedor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const tipoRecebedor = location.state?.tipoRecebedor || '';

  const [formData, setFormData] = useState({
    nome: '',
    tipoDocumento: 'RG',
    numeroDocumento: '',
    assinatura: null,
    fotoLocal: null
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (field: string) => {
    // Simular upload de arquivo
    setFormData(prev => ({ ...prev, [field]: 'arquivo_simulado.jpg' }));
  };

  const handleSubmit = () => {
    // Validar se todos os campos estão preenchidos
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
            <button
              onClick={() => handleFileUpload('assinatura')}
              className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-purple-400 transition-colors"
            >
              {formData.assinatura ? (
                <div className="text-center">
                  <PenTool className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-green-600">Assinatura coletada</p>
                </div>
              ) : (
                <div className="text-center">
                  <PenTool className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Toque para coletar assinatura</p>
                </div>
              )}
            </button>
          </div>

          {/* Upload de foto */}
          <div>
            <Label>Foto do local</Label>
            <button
              onClick={() => handleFileUpload('fotoLocal')}
              className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-purple-400 transition-colors"
            >
              {formData.fotoLocal ? (
                <div className="text-center">
                  <Camera className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-green-600">Foto adicionada</p>
                </div>
              ) : (
                <div className="text-center">
                  <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Toque para adicionar foto</p>
                </div>
              )}
            </button>
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
