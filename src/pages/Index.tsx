
import { useState, useEffect } from 'react';
import MobileLayout from '@/components/MobileLayout';
import { useNavigate } from 'react-router-dom';
import { ScanLine, Settings, Download, Upload } from 'lucide-react';

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

  const handleReceber = () => {
    navigate('/receber');
  };

  const handleEntregar = () => {
    navigate('/transferir');
  };

  return (
    <MobileLayout title={`Olá, ${userName}!`} showProfileMenu={true} showBottomNav={false}>
      <div className="p-4 space-y-4">
        {/* Iniciar Bipagem - Card Principal */}
        <button
          onClick={() => navigate('/bipagem')}
          className="w-full bg-gradient-to-r from-[#FF4713] to-[#FF4713] text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center">
            <div className="bg-white/20 p-3 rounded-xl mr-4">
              <ScanLine className="w-6 h-6" />
            </div>
            <div className="text-left">
              <h2 className="text-lg font-semibold">Iniciar bipagem</h2>
            </div>
          </div>
        </button>

        {/* Botão Meus Serviços */}
        <div className="grid grid-cols-1 gap-4">
          <button 
            onClick={() => navigate('/meusservicos')}
            className="bg-gradient-to-r from-[#FF4713] to-[#FF4713] text-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            <div className="flex items-center">
              <div className="bg-white/20 p-2 rounded-lg mr-4">
                <Settings className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h3 className="font-medium">Meus serviços</h3>
              </div>
            </div>
          </button>
        </div>

        {/* Seção Ações */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Ações</h2>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={handleReceber}
              className="bg-gradient-to-r from-[#FF4713] to-[#FF4713] text-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              <div className="bg-white/20 p-2 rounded-lg w-fit mb-2">
                <Download className="w-5 h-5" />
              </div>
              <h3 className="font-medium text-sm">Receber</h3>
            </button>

            <button 
              onClick={handleEntregar}
              className="bg-gradient-to-r from-[#FF4713] to-[#FF4713] text-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              <div className="bg-white/20 p-2 rounded-lg w-fit mb-2">
                <Upload className="w-5 h-5" />
              </div>
              <h3 className="font-medium text-sm">Entregar</h3>
              <h3 className="font-medium text-sm">transferência</h3>
            </button>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default Index;
