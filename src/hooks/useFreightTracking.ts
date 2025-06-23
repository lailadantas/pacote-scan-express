
import { useState } from 'react';

interface TrackingResponse {
  success: boolean;
  data?: {
    freight_order: string;
    code_status: string;
    observation: string;
    date_event: string;
  };
}

export const useFreightTracking = () => {
  const [isLoading, setIsLoading] = useState(false);

  const validateFreightOrder = async (freightOrderId: string): Promise<TrackingResponse> => {
    console.log('=== INÍCIO DO TRACKING ===');
    console.log('Freight Order ID:', freightOrderId);
    
    setIsLoading(true);
    
    try {
      // Get token from logged user data
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      console.log('userData completo:', userData);
      
      const token = userData.token;
      console.log('Token extraído:', token ? 'Token encontrado' : 'Token não encontrado');
      console.log('Token (primeiros 50 chars):', token ? token.substring(0, 50) + '...' : 'null');

      if (!token) {
        console.error('Token não encontrado no localStorage');
        return {
          success: false,
          data: {
            freight_order: freightOrderId,
            code_status: "3",
            observation: "Token não encontrado - usando dados mock",
            date_event: new Date().toISOString().replace('T', ' ').substring(0, 19)
          }
        };
      }

      const requestBody = {
        freight_order_id: freightOrderId
      };
      
      console.log('URL da API:', 'https://api.smartenvios.tec.br/core/cms/freight-order-trackings');
      console.log('Request body:', requestBody);
      console.log('Authorization header:', `Bearer ${token.substring(0, 20)}...`);

      const response = await fetch('https://api.smartenvios.tec.br/core/cms/freight-order-trackings', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        const data = await response.json();
        console.log('Resposta da API (sucesso):', data);
        
        return {
          success: true,
          data: {
            freight_order: freightOrderId,
            code_status: data.code_status || "3",
            observation: data.observation || "Em transferência da unidade CD SME 01 para CD SME 05",
            date_event: data.date_event || new Date().toISOString().replace('T', ' ').substring(0, 19)
          }
        };
      } else {
        const errorData = await response.text();
        console.error('Erro na resposta da API:', response.status);
        console.error('Corpo da resposta de erro:', errorData);
        
        return {
          success: false,
          data: {
            freight_order: freightOrderId,
            code_status: "3",
            observation: `Erro na API (${response.status}) - usando dados mock`,
            date_event: new Date().toISOString().replace('T', ' ').substring(0, 19)
          }
        };
      }
    } catch (error) {
      console.error('Erro ao validar freight order:', error);
      console.error('Stack trace:', error instanceof Error ? error.stack : 'Sem stack trace');
      
      return {
        success: false,
        data: {
          freight_order: freightOrderId,
          code_status: "3",
          observation: "Erro de conexão - usando dados mock",
          date_event: new Date().toISOString().replace('T', ' ').substring(0, 19)
        }
      };
    } finally {
      setIsLoading(false);
      console.log('=== FIM DO TRACKING ===');
    }
  };

  return {
    validateFreightOrder,
    isLoading
  };
};
