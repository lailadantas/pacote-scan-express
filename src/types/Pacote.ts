
export interface Pacote {
  id: string;
  codigo: string;
  status: 'bipado' | 'validado' | 'erro';
  trackingStatus?: {
    freight_order: string;
    code_status: string;
    observation: string;
    date_event: string;
  };
}
