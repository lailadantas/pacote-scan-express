
import { useState } from 'react';
import MobileLayout from '@/components/MobileLayout';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const DadosRemetente = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [dados, setDados] = useState({
    nome: '',
    documento: '',
    telefone: ''
  });

  const handleContinuar = () => {
    if (dados.nome && dados.documento) {
      navigate('/coletasucesso');
    }
  };

  return (
    <MobileLayout title="Dados do remetente" showBackButton>
      <div className="p-4 space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Informe os dados do remetente
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome completo *
              </label>
              <Input
                value={dados.nome}
                onChange={(e) => setDados(prev => ({ ...prev, nome: e.target.value }))}
                placeholder="Digite o nome completo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CPF/CNPJ *
              </label>
              <Input
                value={dados.documento}
                onChange={(e) => setDados(prev => ({ ...prev, documento: e.target.value }))}
                placeholder="Digite o CPF ou CNPJ"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefone
              </label>
              <Input
                value={dados.telefone}
                onChange={(e) => setDados(prev => ({ ...prev, telefone: e.target.value }))}
                placeholder="Digite o telefone"
              />
            </div>
          </div>
        </div>

        <Button 
          onClick={handleContinuar}
          disabled={!dados.nome || !dados.documento}
          className="w-full"
        >
          Finalizar coleta
        </Button>
      </div>
    </MobileLayout>
  );
};

export default DadosRemetente;
