
import { useState, useEffect } from 'react';
import MobileLayout from '@/components/MobileLayout';
import { useNavigate } from 'react-router-dom';
import { Download, Upload, ScanLine, Tag, Settings } from 'lucide-react';

const Home2 = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Usuário');

  useEffect(() => {
    // Recupera o nome do usuário do localStorage
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const userData = JSON.parse(currentUser);
      setUserName(userData.name || 'Usuário');
    }
  }, []);

  const handleReceber = () => {
    navigate('/bipagem?contexto=receber');
  };

  const handleEntregar = () => {
    navigate('/bipagem?contexto=transferencia');
  };

  // Dados do dashboard (mesmo do estoque)
  const dashboardData = [
    {
      title: "Serviço em execução",
      count: 1,
      icon: Settings,
      color: "text-purple-600"
    },
    {
      title: "Pacotes comigo",
      count: 30,
      icon: Tag,
      color: "text-purple-600"
    },
    {
      title: "Pacotes entregues",
      count: 10,
      icon: Tag,
      color: "text-green-600"
    }
  ];

  return (
    <MobileLayout title="Início" showBottomNav={false}>
      <div className="bg-gradient-to-br from-orange-500 via-red-500 to-purple-600 min-h-screen">
        {/* Header */}
        <div className="p-4 pb-6">
          <div className="flex items-center justify-between mb-6">
            <button className="text-white">
              <div className="w-6 h-0.5 bg-white mb-1"></div>
              <div className="w-6 h-0.5 bg-white mb-1"></div>
              <div className="w-6 h-0.5 bg-white"></div>
            </button>
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">LA</span>
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
          {/* Para você */}
          <div>
            <h2 className="text-lg font-semibold text-purple-600 mb-4">Para você</h2>
            <div className="grid grid-cols-2 gap-4">
              <button className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="bg-orange-100 p-3 rounded-xl w-fit mb-3">
                  <Tag className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-medium text-gray-900 text-left">Ofertas</h3>
              </button>

              <button 
                onClick={() => navigate('/meusservicos')}
                className="bg-white rounded-2xl p-4 shadow-sm"
              >
                <div className="bg-orange-100 p-3 rounded-xl w-fit mb-3">
                  <Settings className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-medium text-gray-900 text-left">Meus serviços</h3>
              </button>
            </div>
          </div>

          {/* Ações */}
          <div>
            <h2 className="text-lg font-semibold text-purple-600 mb-4">Ações</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <button 
                onClick={handleReceber}
                className="bg-white rounded-2xl p-4 shadow-sm"
              >
                <div className="bg-purple-100 p-3 rounded-xl w-fit mb-3">
                  <Download className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-medium text-gray-900 text-left">Receber</h3>
              </button>

              <button 
                onClick={handleEntregar}
                className="bg-white rounded-2xl p-4 shadow-sm"
              >
                <div className="bg-purple-100 p-3 rounded-xl w-fit mb-3">
                  <Upload className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-medium text-gray-900 text-left">Entregar</h3>
              </button>
            </div>

            {/* Iniciar bipagem - Botão grande */}
            <button
              onClick={() => navigate('/bipagem')}
              className="w-full bg-white rounded-2xl p-4 shadow-sm"
            >
              <div className="bg-purple-100 p-3 rounded-xl w-fit mb-3">
                <ScanLine className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-medium text-gray-900 text-left">Iniciar bipagem</h3>
            </button>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="bg-white rounded-t-3xl">
          <nav className="px-4 py-4">
            <div className="flex justify-around">
              <button 
                onClick={() => navigate('/home')}
                className="flex flex-col items-center"
              >
                <div className="w-8 h-8 bg-purple-100 rounded-xl flex items-center justify-center mb-2">
                  <div className="w-4 h-4 bg-purple-600 rounded"></div>
                </div>
                <span className="text-xs text-purple-600 font-medium">Home</span>
              </button>
              
              <button 
                onClick={() => navigate('/servicos')}
                className="flex flex-col items-center"
              >
                <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-2">
                  <div className="w-4 h-4 bg-gray-400 rounded"></div>
                </div>
                <span className="text-xs text-gray-500">Serviços</span>
              </button>
              
              <button 
                onClick={() => navigate('/estoque')}
                className="flex flex-col items-center"
              >
                <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-2">
                  <div className="w-4 h-4 bg-gray-400 rounded"></div>
                </div>
                <span className="text-xs text-gray-500">Estoque</span>
              </button>
              
              <button 
                onClick={() => navigate('/financeiro')}
                className="flex flex-col items-center"
              >
                <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-2">
                  <div className="w-4 h-4 bg-gray-400 rounded"></div>
                </div>
                <span className="text-xs text-gray-500">Financeiro</span>
              </button>
              
              <button 
                onClick={() => navigate('/chat')}
                className="flex flex-col items-center"
              >
                <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-2">
                  <div className="w-4 h-4 bg-gray-400 rounded"></div>
                </div>
                <span className="text-xs text-gray-500">Chat</span>
              </button>
            </div>
          </nav>
        </div>
      </div>
    </MobileLayout>
  );
};

export default Home2;
