
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

// Cache global para evitar requisições duplicadas entre diferentes instâncias do hook
const globalCache = new Map<string, TrackingResponse>();
const globalPendingRequests = new Map<string, Promise<TrackingResponse>>();

export const useFreightTracking = () => {
  const [isLoading, setIsLoading] = useState(false);

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
      
      console.log('Request body para API SmartEnvios:', requestBody);

      const response = await fetch('https://api.smartenvios.tec.br/core/cms/freight-order-trackings', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Response status da API SmartEnvios:', response.status);

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

  const validateFreightOrder = async (code: string): Promise<TrackingResponse> => {
    console.log('=== VALIDAÇÃO INICIADA PARA CÓDIGO ===', code);
    
    // Verificar se já existe no cache global
    if (globalCache.has(code)) {
      console.log('Retornando dados do cache global para:', code);
      return globalCache.get(code)!;
    }

    // Verificar se já existe uma requisição pendente para este código
    if (globalPendingRequests.has(code)) {
      console.log('Aguardando requisição pendente global para:', code);
      return await globalPendingRequests.get(code)!;
    }

    console.log('Iniciando nova requisição para:', code);
    setIsLoading(true);
    
    // Criar a promise e armazenar como pendente globalmente
    const trackingPromise = executeTracking(code);
    globalPendingRequests.set(code, trackingPromise);
    
    try {
      const result = await trackingPromise;
      // Armazenar no cache global
      globalCache.set(code, result);
      console.log('Resultado armazenado no cache para:', code);
      return result;
    } finally {
      // Remover da lista de pendentes globais
      globalPendingRequests.delete(code);
      setIsLoading(false);
      console.log('=== VALIDAÇÃO FINALIZADA PARA CÓDIGO ===', code);
    }
  };

  return {
    validateFreightOrder,
    isLoading
  };
};
