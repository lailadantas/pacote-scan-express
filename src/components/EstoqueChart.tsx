
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { format, parseISO, startOfDay, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface EstoqueItem {
  id: string;
  barcode: string;
  status: string;
  created_at: string;
}

interface ChartData {
  date: string;
  displayDate: string;
  total: number;
  confirmed: number;
  error: number;
  bipados: number;
}

const EstoqueChart = () => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const checkSessionData = () => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const userId = userData.user_id || userData.id;
    const personId = userData.person_id;
    const token = userData.token || localStorage.getItem('authToken');

    if (!userId || !personId || !token) {
      console.warn('Dados de sessão incompletos para gráfico');
      return false;
    }

    return { userId, personId, token };
  };

  useEffect(() => {
    const consultarEstoque = async () => {
      const sessionData = checkSessionData();
      if (!sessionData) {
        setIsLoading(false);
        return;
      }

      try {
        const requestBody = {
          type: 'consulting_warehouse',
          user_id: sessionData.userId,
          person_id: sessionData.personId
        };

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
          
          if (Array.isArray(responseData)) {
            processChartData(responseData);
          }
        }
      } catch (error) {
        console.error('Erro ao consultar estoque para gráfico:', error);
      } finally {
        setIsLoading(false);
      }
    };

    consultarEstoque();
  }, []);

  const processChartData = (items: EstoqueItem[]) => {
    // Agrupar por data
    const groupedByDate: { [key: string]: EstoqueItem[] } = {};
    
    items.forEach(item => {
      const date = format(startOfDay(parseISO(item.created_at)), 'yyyy-MM-dd');
      if (!groupedByDate[date]) {
        groupedByDate[date] = [];
      }
      groupedByDate[date].push(item);
    });

    // Converter para dados do gráfico
    const chartData: ChartData[] = Object.entries(groupedByDate)
      .map(([date, items]) => {
        const confirmed = items.filter(item => item.status === 'confirmed_input_warehouse').length;
        const error = items.filter(item => item.status === 'error_input_warehouse').length;
        const bipados = items.filter(item => item.status === 'input_warehouse').length;
        
        return {
          date,
          displayDate: format(parseISO(date), 'dd/MM', { locale: ptBR }),
          total: items.length,
          confirmed,
          error,
          bipados
        };
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-7); // Últimos 7 dias

    setChartData(chartData);
  };

  const chartConfig = {
    total: {
      label: "Total de Pacotes",
      color: "#FF4713",
    },
    confirmed: {
      label: "Confirmados",
      color: "#10B981",
    },
    error: {
      label: "Com Erro",
      color: "#EF4444",
    },
    bipados: {
      label: "Bipados",
      color: "#F59E0B",
    },
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Volumetria por Dia</h3>
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-500">Carregando gráfico...</p>
        </div>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Volumetria por Dia</h3>
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-500">Nenhum dado disponível</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Volumetria por Dia</h3>
      <ChartContainer config={chartConfig} className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="displayDate" 
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <ChartTooltip 
              content={<ChartTooltipContent />}
            />
            <Bar 
              dataKey="total" 
              fill="var(--color-total)" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default EstoqueChart;
