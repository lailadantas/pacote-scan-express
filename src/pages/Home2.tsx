
import { useState, useEffect } from 'react';
import MobileLayout from '@/components/MobileLayout';
import { useNavigate } from 'react-router-dom';
import { Download, Upload, ScanLine, Settings } from 'lucide-react';

const Home2 = () => {
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
        console.log('Dados do usuário no Home2:', userData); // Para debug
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

  // Dados do dashboard (mesmo do estoque)
  const dashboardData = [
    {
      title: "Serviço em execução",
      count: 1,
      icon: Settings,
      color: "text-[#FF4713]"
    },
    {
      title: "Pacotes comigo",
      count: 30,
      icon: Settings,
      color: "text-[#FF4713]"
    },
    {
      title: "Pacotes entregues",
      count: 10,
      icon: Settings,
      color: "text-green-600"
    }
  ];

  return (
    <MobileLayout title="Início" showBottomNav={false} showProfileMenu={true}>
      <div className="bg-gradient-to-br from-[#FF4713] via-[#FF4713] to-[#FF4713] min-h-screen">
        {/* Header */}
        <div className="p-4 pb-6">
          <div className="flex items-center justify-between mb-6">
            <button className="text-white">
              <div className="w-6 h-0.5 bg-white mb-1"></div>
              <div className="w-6 h-0.5 bg-white mb-1"></div>
              <div className="w-6 h-0.5 bg-white"></div>
            </button>
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">
                {userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </span>
            </div>
          </div>

          <h1 className="text-white text-xl font-medium mb-6">
            Olá, {userName}!
          </h1>

          {/* Dashboard Cards */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 mb-6">
            <div className="grid grid-cols-3 gap-4">
              {dashboardData.map((item, index) => (
                <div key={index} className="text-center">
                  <div className={`${item.color} mb-2`}>
                    <item.icon className="w-6 h-6 mx-auto" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {item.count}
                  </div>
                  <div className="text-xs text-gray-600 leading-tight">
                    {item.title}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-gray-100 rounded-t-3xl flex-1 p-4 space-y-6">
          {/* Meus Serviços */}
          <div>
            <h2 className="text-lg font-semibold text-[#FF4713] mb-4">Meus Serviços</h2>
            <div className="grid grid-cols-1 gap-4">
              <button 
                onClick={() => navigate('/meusservicos')}
                className="bg-white rounded-2xl p-4 shadow-sm"
              >
                <div className="bg-orange-100 p-3 rounded-xl w-fit mb-3">
                  <Settings className="w-6 h-6 text-[#FF4713]" />
                </div>
                <h3 className="font-medium text-gray-900 text-left">Meus serviços</h3>
              </button>
            </div>
          </div>

          {/* Ações */}
          <div>
            <h2 className="text-lg font-semibold text-[#FF4713] mb-4">Ações</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <button 
                onClick={handleReceber}
                className="bg-white rounded-2xl p-4 shadow-sm"
              >
                <div className="bg-orange-100 p-3 rounded-xl w-fit mb-3">
                  <Download className="w-6 h-6 text-[#FF4713]" />
                </div>
                <h3 className="font-medium text-gray-900 text-left">Receber</h3>
              </button>

              <button 
                onClick={handleEntregar}
                className="bg-white rounded-2xl p-4 shadow-sm"
              >
                <div className="bg-orange-100 p-3 rounded-xl w-fit mb-3">
                  <Upload className="w-6 h-6 text-[#FF4713]" />
                </div>
                <h3 className="font-medium text-gray-900 text-left">Entregar</h3>
              </button>
            </div>

            {/* Iniciar bipagem - Botão grande */}
            <button
              onClick={() => navigate('/bipagem')}
              className="w-full bg-white rounded-2xl p-4 shadow-sm"
            >
              <div className="bg-orange-100 p-3 rounded-xl w-fit mb-3">
                <ScanLine className="w-6 h-6 text-[#FF4713]" />
              </div>
              <h3 className="font-medium text-gray-900 text-left">Iniciar bipagem</h3>
            </button>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default Home2;
