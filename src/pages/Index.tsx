
import { useState, useEffect } from 'react';
import MobileLayout from '@/components/MobileLayout';
import EstoqueChart from '@/components/EstoqueChart';
import { useNavigate } from 'react-router-dom';
import { ScanLine, Package } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Usuário');

  useEffect(() => {
    // Verifica se o usuário está logado
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn || isLoggedIn !== 'true') {
      navigate('/auth');
      return;
    }

    // Recupera o nome do usuário do localStorage
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      try {
        const userData = JSON.parse(currentUser);
        console.log('Dados do usuário:', userData); // Para debug
        setUserName(userData.person_name || userData.name || userData.username || 'Usuário');
      } catch (error) {
        console.error('Erro ao processar dados do usuário:', error);
        setUserName('Usuário');
      }
    }
  }, [navigate]);

  return (
    <MobileLayout title={`Olá, ${userName}!`} showProfileMenu={true} showBottomNav={false}>
      <div className="p-3 space-y-4 max-w-full overflow-hidden">
        {/* Gráfico de Volumetria */}
        <div className="w-full">
          <EstoqueChart />
        </div>

        {/* Iniciar Bipagem - Card Principal */}
        <button
          onClick={() => navigate('/bipagem')}
          className="w-full bg-gradient-to-r from-[#FF4713] to-[#FF4713] text-white p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center">
            <div className="bg-white/20 p-3 rounded-xl mr-3 flex-shrink-0">
              <ScanLine className="w-5 h-5" />
            </div>
            <div className="text-left flex-1 min-w-0">
              <h2 className="text-base font-semibold">Iniciar bipagem</h2>
            </div>
          </div>
        </button>

        {/* Estoque - Card */}
        <button
          onClick={() => navigate('/estoque')}
          className="w-full bg-gradient-to-r from-[#FF4713] to-[#FF4713] text-white p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center">
            <div className="bg-white/20 p-3 rounded-xl mr-3 flex-shrink-0">
              <Package className="w-5 h-5" />
            </div>
            <div className="text-left flex-1 min-w-0">
              <h2 className="text-base font-semibold">Estoque</h2>
            </div>
          </div>
        </button>
      </div>
    </MobileLayout>
  );
};

export default Index;
