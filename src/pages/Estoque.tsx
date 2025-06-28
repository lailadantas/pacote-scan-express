
import { useEffect, useState } from 'react';
import MobileLayout from '@/components/MobileLayout';
import { useNavigate } from 'react-router-dom';
import { Package, PackageCheck, PackageMinus, PackageOpen, ChevronRight } from 'lucide-react';

interface EstoqueItem {
  id: string;
  barcode: string;
  status: 'confirmed_output_warehouse' | 'input_warehouse' | 'confirmed_input_warehouse';
}

const Estoque = () => {
  const navigate = useNavigate();
  const [itensEstoque, setItensEstoque] = useState<EstoqueItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar se os dados de sessão estão disponíveis
  const checkSessionData = () => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const userId = userData.user_id || userData.id;
    const personId = userData.person_id;
    const token = userData.token || localStorage.getItem('authToken');

    if (!userId || !personId || !token) {
      console.warn('Dados de sessão incompletos:', { userId, personId, token: !!token });
      navigate('/auth', { replace: true });
      return false;
    }

    return { userId, personId, token };
  };

  useEffect(() => {
    const consultarEstoque = async () => {
      const sessionData = checkSessionData();
      if (!sessionData) return;

      try {
        setIsLoading(true);

        const requestBody = {
          type: 'consulting_warehouse',
          user_id: sessionData.userId,
          person_id: sessionData.personId
        };

        console.log('Consultando estoque:', requestBody);

        const headers = {
          'Content-Type': 'application/json',
          'Authorization': 'Basic U21hcnRQb250bzp+ZmdrVUM0NVkyI1o=',
          'X-Auth-Token': `Bearer ${sessionData.token}`
        };

        const response = await fetch('https://n8n.smartenvios.com/webhook/f93ce6e9-0d1e-4165-9aa0-1c8edf3f6dcd', {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(requestBody)
        });

        if (response.ok) {
          const responseData = await response.json();
          console.log('Itens do estoque encontrados:', responseData);
          
          if (Array.isArray(responseData)) {
            const itensFormatados: EstoqueItem[] = responseData.map((item: any) => ({
              id: item.id || Date.now().toString(),
              barcode: item.barcode,
              status: item.status
            }));
            setItensEstoque(itensFormatados);
          }
        } else {
          console.warn('Erro ao consultar estoque:', response.status);
        }
      } catch (error) {
        console.error('Erro ao consultar estoque:', error);
      } finally {
        setIsLoading(false);
      }
    };

    consultarEstoque();
  }, [navigate]);

  // Contar itens por status
  const contadores = {
    confirmed_output_warehouse: itensEstoque.filter(item => item.status === 'confirmed_output_warehouse').length,
    input_warehouse: itensEstoque.filter(item => item.status === 'input_warehouse').length,
    confirmed_input_warehouse: itensEstoque.filter(item => item.status === 'confirmed_input_warehouse').length
  };

  const estoqueData = [
    {
      title: "Pacotes enviados",
      description: "Já saíram do estoque",
      count: contadores.confirmed_output_warehouse,
      icon: PackageMinus,
      path: "/estoque/pacotes-enviados",
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      title: "Pacotes bipados",
      description: "Bipados, mas não finalizados",
      count: contadores.input_warehouse,
      icon: PackageOpen,
      path: "/estoque/pacotes-bipados",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      title: "Pacotes no estoque",
      description: "Bipados e finalizados",
      count: contadores.confirmed_input_warehouse,
      icon: PackageCheck,
      path: "/estoque/pacotes-confirmados",
      color: "text-green-600",
      bgColor: "bg-green-50"
    }
  ];

  if (isLoading) {
    return (
      <MobileLayout title="Estoque" showBottomNav={true}>
        <div className="p-4 flex justify-center items-center h-64">
          <div className="text-gray-500">Carregando estoque...</div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title="Estoque" showBottomNav={true}>
      <div className="p-4 space-y-4">
        {estoqueData.map((item) => (
          <button
            key={item.title}
            onClick={() => navigate(item.path, { state: { status: item.title.includes('enviados') ? 'confirmed_output_warehouse' : item.title.includes('bipados') ? 'input_warehouse' : 'confirmed_input_warehouse', itens: itensEstoque } })}
            className="w-full bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow text-left"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-xl ${item.bgColor} ${item.color}`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {item.count}
                  </div>
                  <div className="text-gray-900 font-medium text-sm">
                    {item.title}
                  </div>
                  <div className="text-gray-500 text-xs">
                    {item.description}
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
