
import { useEffect, useState } from 'react';
import MobileLayout from '@/components/MobileLayout';
import { useNavigate } from 'react-router-dom';
import { Package, AlertTriangle, Truck, ChevronRight } from 'lucide-react';

const Estoque = () => {
  const navigate = useNavigate();
  const [pacotesComigo, setPacotesComigo] = useState(0);

  useEffect(() => {
    // Carrega a quantidade de pacotes do localStorage
    const userStock = JSON.parse(localStorage.getItem('userStock') || '[]');
    setPacotesComigo(userStock.length);
  }, []);

  const estoqueData = [
    {
      title: "Pacotes comigo",
      count: pacotesComigo,
      icon: Package,
      path: "/estoque/pacotes-comigo",
      color: "text-blue-600"
    },
    {
      title: "Pacotes com problema",
      count: 3,
      icon: AlertTriangle,
      path: "/estoque/pacotes-problema",
      color: "text-red-600"
    },
    {
      title: "Pacotes em rota",
      count: 8,
      icon: Truck,
      path: "/estoque/pacotes-rota",
      color: "text-green-600"
    }
  ];

  return (
    <MobileLayout title="Estoque" showBottomNav={true}>
      <div className="p-4 space-y-4">
        {estoqueData.map((item) => (
          <button
            key={item.title}
            onClick={() => navigate(item.path)}
            className="w-full bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow text-left"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-xl bg-gray-50 ${item.color}`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {item.count}
                  </div>
                  <div className="text-gray-600 text-sm">
                    {item.title}
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </button>
        ))}
      </div>
    </MobileLayout>
  );
};

export default Estoque;
