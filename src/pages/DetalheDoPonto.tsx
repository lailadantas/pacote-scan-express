
import { useState } from 'react';
import MobileLayout from '@/components/MobileLayout';
import { useNavigate, useParams } from 'react-router-dom';
import { Phone, MessageCircle, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DetalheDoPonto = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [foiParaLa, setFoiParaLa] = useState(false);

  const servico = {
    tipo: "Entrega",
    status: "Pendente",
    endereco: {
      rua: "Rua das Flores, 123",
      complemento: "Apto 45 - Bloco B",
      bairro: "Centro",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01234-567"
    },
    destinatario: {
      nome: "Maria Silva Santos",
      complemento: "Apartamento 45, Bloco B"
    },
    canalVendas: "Mercado Livre"
  };

  const handleVouParaLa = () => {
    setFoiParaLa(true);
  };

  const abrirMapa = () => {
    const endereco = `${servico.endereco.rua}, ${servico.endereco.bairro}, ${servico.endereco.cidade}`;
    const url = `https://maps.google.com/?q=${encodeURIComponent(endereco)}`;
    window.open(url, '_blank');
  };

  return (
    <MobileLayout title="Detalhe do ponto" showBackButton>
      <div className="p-4 space-y-6">
        {/* Tags de status */}
        <div className="flex gap-2">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {servico.tipo}
          </span>
          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
            {servico.status}
          </span>
        </div>

        {/* Endereço */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {servico.endereco.rua}
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            {servico.endereco.bairro}, {servico.endereco.cidade} - {servico.endereco.estado}, {servico.endereco.cep}
          </p>
          
          {/* Mapa simulado */}
          <div 
            onClick={abrirMapa}
            className="bg-gray-100 h-32 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors mb-4"
          >
            <div className="text-center">
              <MapPin className="w-8 h-8 text-gray-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Clique para abrir no mapa</p>
            </div>
          </div>
        </div>

        {/* Informações do destinatário */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-600 mb-3">
            Pacote da {servico.canalVendas} para:
          </p>
          
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-800">
              {servico.destinatario.nome}
            </h3>
            <div className="flex gap-2">
              <button className="p-2 bg-green-100 rounded-full hover:bg-green-200 transition-colors">
                <Phone className="w-5 h-5 text-green-600" />
              </button>
              <button className="p-2 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors">
                <MessageCircle className="w-5 h-5 text-blue-600" />
              </button>
            </div>
          </div>
          
          <p className="text-sm text-gray-600">
            {servico.destinatario.complemento}
          </p>
        </div>

        {/* Botões de ação */}
        <div className="space-y-3">
          {!foiParaLa ? (
            <Button onClick={handleVouParaLa} className="w-full">
              Vou para lá
            </Button>
          ) : (
            <div className="space-y-3">
              <Button 
                onClick={() => navigate(`/entregar/${id}`)}
                className="w-full"
              >
                Entregar
              </Button>
              <Button 
                onClick={() => navigate(`/naopudeentregar/${id}`)}
                variant="outline" 
                className="w-full"
              >
                Não pude entregar
              </Button>
            </div>
          )}
        </div>
      </div>
    </MobileLayout>
  );
};

export default DetalheDoPonto;
