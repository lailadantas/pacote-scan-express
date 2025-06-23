
import { useState, useRef } from 'react';

interface TrackingResponse {
  success: boolean;
  data?: {
    freight_order: string;
    code_status: string;
    observation: string;
    date_event: string;
  };
}

interface WebhookResponse {
  success: boolean;
  freight_order_id?: string;
  message?: string;
}

export const useFreightTracking = () => {
  const [isLoading, setIsLoading] = useState(false);
  const cacheRef = useRef<Map<string, TrackingResponse>>(new Map());
  const pendingRequestsRef = useRef<Map<string, Promise<TrackingResponse>>>(new Map());

  const getFreightOrderId = async (code: string): Promise<WebhookResponse> => {
    console.log('=== INÍCIO DO WEBHOOK N8N ===');
    console.log('Código para webhook:', code);
    
    try {
      const response = await fetch('https://n8n.smartenvios.com/webhook/e4842cb5-8b7d-47ae-9328-f775ebb46883', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      console.log('Webhook response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Webhook response data:', data);
        
        // Se a resposta é um array, pegar o primeiro item
        const responseData = Array.isArray(data) ? data[0] : data;
        
        return {
          success: true,
          freight_order_id: responseData.freight_order_id,
        };
      } else {
        console.error('Webhook error response:', response.status);
        return {
          success: false,
          message: `Webhook error: ${response.status}`,
        };
      }
    } catch (error) {
      console.error('Webhook request error:', error);
      return {
        success: false,
        message: 'Erro de conexão com webhook',
      };
    } finally {
      console.log('=== FIM DO WEBHOOK N8N ===');
    }
  };

  const validateFreightOrder = async (code: string): Promise<TrackingResponse> => {
    // Verificar se já existe no cache
    if (cacheRef.current.has(code)) {
      console.log('Retornando dados do cache para:', code);
      return cacheRef.current.get(code)!;
    }

    // Verificar se já existe uma requisição pendente para este código
    if (pendingRequestsRef.current.has(code)) {
      console.log('Aguardando requisição pendente para:', code);
      return pendingRequestsRef.current.get(code)!;
    }

    console.log('=== INÍCIO DO TRACKING COMPLETO ===');
    console.log('Código original:', code);
    
    setIsLoading(true);
    
    // Criar a promise e armazenar como pendente
    const trackingPromise = this.executeTracking(code);
    pendingRequestsRef.current.set(code, trackingPromise);
    
    try {
      const result = await trackingPromise;
      // Armazenar no cache
      cacheRef.current.set(code, result);
      return result;
    } finally {
      // Remover da lista de pendentes
      pendingRequestsRef.current.delete(code);
      setIsLoading(false);
      console.log('=== FIM DO TRACKING COMPLETO ===');
    }
  };

  const executeTracking = async (code: string): Promise<TrackingResponse> => {
    try {
      // Primeiro, obter o freight_order_id do webhook
      const webhookResult = await getFreightOrderId(code);
      
      if (!webhookResult.success || !webhookResult.freight_order_id) {
        console.error('Falha ao obter freight_order_id:', webhookResult.message);
        return {
          success: false,
          data: {
            freight_order: code,
            code_status: "3",
            observation: webhookResult.message || "Erro ao obter freight_order_id",
            date_event: new Date().toISOString().replace('T', ' ').substring(0, 19)
          }
        };
      }

      const freightOrderId = webhookResult.freight_order_id;
      console.log('freight_order_id obtido:', freightOrderId);

      // Agora consultar o status usando o freight_order_id
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const token = userData.token;
      
      console.log('Token extraído:', token ? 'Token encontrado' : 'Token não encontrado');
      console.log('Token length:', token ? token.length : 0);
      console.log('Token completo:', token);

      if (!token) {
        console.error('Token não encontrado no localStorage');
        return {
          success: false,
          data: {
            freight_order: code,
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
      console.log('Authorization header completo:', `Bearer ${token}`);

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
            freight_order: code,
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
            freight_order: code,
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
          freight_order: code,
          code_status: "3",
          observation: "Erro de conexão - usando dados mock",
          date_event: new Date().toISOString().replace('T', ' ').substring(0, 19)
        }
      };
    }
  };

  return {
    validateFreightOrder,
    isLoading
  };
};
