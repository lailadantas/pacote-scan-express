
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
    setIsLoading(true);
    
    try {
      // Get token from logged user data
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const token = userData.token;

      if (!token) {
        console.error('Token não encontrado');
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

      const response = await fetch('https://api.smartenvios.tec.br/core/cms/freight-order-trackings', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          freight_order_id: freightOrderId
        }),
      });

      if (response.ok) {
        const data = await response.json();
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
        console.error('Erro na resposta da API:', response.status);
        return {
          success: false,
          data: {
            freight_order: freightOrderId,
            code_status: "3",
            observation: "Erro na API - usando dados mock",
            date_event: new Date().toISOString().replace('T', ' ').substring(0, 19)
          }
        };
      }
    } catch (error) {
      console.error('Erro ao validar freight order:', error);
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
    }
  };

  return {
    validateFreightOrder,
    isLoading
  };
};
