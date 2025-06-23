
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
      const token = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3NTA3ODAxOTYsImlhdCI6MTc1MDY5Mzc5Niwic3ViIjp7ImlkIjoiZDI1Y2VjOWMtMGMxNS00OTNlLWI3YTYtN2UyNmI3ZWYyYzlmIn0sImN1c3RvbWVycyI6W119.22yk6SK2OMFNBpIDK5Kfdy-5qy538Bux9_4tRFgvc9w';

      const response = await fetch('https://api.smartenvios.com/v1/freight-order/tracking', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'token': token,
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
            date_event: new Date().toISOString().replace('T', ' ').substring(0, 19)
          }
        };
      } else {
        return {
          success: false,
          data: {
            freight_order: freightOrderId,
            code_status: "3",
            observation: "Em transferência da unidade CD SME 01 para CD SME 05",
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
          observation: "Em transferência da unidade CD SME 01 para CD SME 05",
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
