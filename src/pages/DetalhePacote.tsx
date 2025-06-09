
import MobileLayout from '@/components/MobileLayout';
import { useParams } from 'react-router-dom';
import { Package, MapPin, User, Calendar, Clock } from 'lucide-react';

const DetalhePacote = () => {
  const { id } = useParams();

  // Dados mockados baseados no ID
  const pacoteData = {
    codigo: `PKG0${id?.padStart(2, '0')}`,
    status: id && parseInt(id) <= 5 ? 'Aguardando' : 
           id && parseInt(id) <= 8 ? 'Problema' : 'Em rota',
    destinatario: 'João Silva Santos',
    telefone: '(11) 99999-9999',
    endereco: 'Rua das Flores, 123',
    bairro: 'Centro',
    cidade: 'São Paulo',
    cep: '01234-567',
    complemento: 'Apto 45, Bloco B',
    dataRecebimento: '15/01/2024',
    horarioRecebimento: '14:30',
    peso: '2.5kg',
    dimensoes: '30x20x15cm',
    observacoes: 'Entrega apenas no período da manhã'
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aguardando': return 'text-blue-600 bg-blue-50';
      case 'Problema': return 'text-red-600 bg-red-50';
      case 'Em rota': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <MobileLayout title="Detalhes do Pacote" showBackButton>
      <div className="p-4 space-y-4">
        {/* Cabeçalho do pacote */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-50 rounded-xl">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{pacoteData.codigo}</h2>
                <span className={`text-sm px-2 py-1 rounded-full ${getStatusColor(pacoteData.status)}`}>
                  {pacoteData.status}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Peso:</span>
              <span className="font-medium ml-2">{pacoteData.peso}</span>
            </div>
            <div>
              <span className="text-gray-500">Dimensões:</span>
              <span className="font-medium ml-2">{pacoteData.dimensoes}</span>
            </div>
          </div>
        </div>

        {/* Informações do destinatário */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <User className="w-5 h-5 text-gray-500" />
            <h3 className="font-semibold text-gray-900">Destinatário</h3>
          </div>
          
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-gray-500">Nome:</span>
              <span className="font-medium ml-2">{pacoteData.destinatario}</span>
            </div>
            <div>
              <span className="text-gray-500">Telefone:</span>
              <span className="font-medium ml-2">{pacoteData.telefone}</span>
            </div>
          </div>
        </div>

        {/* Endereço de entrega */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <MapPin className="w-5 h-5 text-gray-500" />
            <h3 className="font-semibold text-gray-900">Endereço de Entrega</h3>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="font-medium">{pacoteData.endereco}</div>
            <div className="text-gray-600">{pacoteData.complemento}</div>
            <div className="text-gray-600">{pacoteData.bairro} - {pacoteData.cidade}</div>
            <div className="text-gray-600">CEP: {pacoteData.cep}</div>
          </div>
        </div>

        {/* Mapa simulado */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Localização</h3>
          <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Mapa do endereço</p>
            </div>
          </div>
        </div>

        {/* Informações adicionais */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <Calendar className="w-5 h-5 text-gray-500" />
            <h3 className="font-semibold text-gray-900">Informações Adicionais</h3>
          </div>
          
          <div className="space-y-3 text-sm">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-gray-500">Data de recebimento:</span>
              <span className="font-medium">{pacoteData.dataRecebimento}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-gray-500">Horário:</span>
              <span className="font-medium">{pacoteData.horarioRecebimento}</span>
            </div>
            {pacoteData.observacoes && (
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                <span className="text-yellow-800 text-sm font-medium">Observações:</span>
                <p className="text-yellow-700 text-sm mt-1">{pacoteData.observacoes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default DetalhePacote;
