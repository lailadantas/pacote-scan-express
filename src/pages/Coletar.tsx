
import { useState } from 'react';
import MobileLayout from '@/components/MobileLayout';
import { useNavigate, useParams } from 'react-router-dom';
import { Package, User, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Coletar = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [pacotesSelecionados, setPacotesSelecionados] = useState<string[]>([]);

  const pacotes = [
    { codigo: 'PKG001', status: 'Aguardando coleta' },
    { codigo: 'PKG002', status: 'Aguardando coleta' },
    { codigo: 'PKG003', status: 'Aguardando coleta' }
  ];

  const togglePacote = (codigo: string) => {
    setPacotesSelecionados(prev => 
      prev.includes(codigo) 
        ? prev.filter(p => p !== codigo)
        : [...prev, codigo]
    );
  };

  const handleContinuar = () => {
    if (pacotesSelecionados.length > 0) {
      navigate(`/dadosremetente/${id}`);
    }
  };

  return (
    <MobileLayout title="Coletar" showBackButton>
      <div className="p-4 space-y-6">
        {/* Informações do local */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center space-x-3 mb-3">
            <User className="w-5 h-5 text-gray-500" />
            <span className="font-medium">Maria Silva Santos</span>
          </div>
          <p className="text-gray-600 text-sm">
            Rua das Flores, 123 - Apto 45, Bloco B<br/>
            Centro, São Paulo - SP
          </p>
        </div>

        {/* Lista de pacotes para coletar */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="font-semibold text-gray-800">Selecione os pacotes para coletar</h3>
          </div>
          
          <div className="divide-y">
            {pacotes.map((pacote) => (
              <div 
                key={pacote.codigo}
                onClick={() => togglePacote(pacote.codigo)}
                className="p-4 flex items-center space-x-3 cursor-pointer hover:bg-gray-50"
              >
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                  pacotesSelecionados.includes(pacote.codigo)
                    ? 'bg-blue-500 border-blue-500'
                    : 'border-gray-300'
                }`}>
                  {pacotesSelecionados.includes(pacote.codigo) && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <Package className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                  <div className="font-medium">{pacote.codigo}</div>
                  <div className="text-sm text-gray-500">{pacote.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Seção de foto */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-3">Foto dos pacotes (opcional)</h3>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">Toque para tirar uma foto</p>
          </div>
        </div>

        {/* Botão continuar */}
        <Button 
          onClick={handleContinuar}
          disabled={pacotesSelecionados.length === 0}
          className="w-full"
        >
          Continuar ({pacotesSelecionados.length} selecionados)
        </Button>
      </div>
    </MobileLayout>
  );
};

export default Coletar;
