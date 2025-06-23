import { useState, useEffect } from 'react';
import MobileLayout from '@/components/MobileLayout';
import { useParams, useNavigate } from 'react-router-dom';
import { Package, MapPin, User, Calendar, Clock, Edit, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { useFreightTracking } from '@/hooks/useFreightTracking';

const DetalhePacote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [trackingData, setTrackingData] = useState<any>(null);
  const [isLoadingTracking, setIsLoadingTracking] = useState(false);
  const { validateFreightOrder } = useFreightTracking();

  // Get package data from localStorage
  const userStock = JSON.parse(localStorage.getItem('userStock') || '[]');
  const pacote = userStock.find((p: any) => p.id === id);

  // If package not found, show default mock data
  const pacoteData = pacote || {
    id: id,
    codigo: `PKG0${id?.padStart(2, '0')}`,
    status: 'Bipado',
    destinatario: 'João Silva Santos',
    telefone: '(11) 99999-9999',
    endereco: 'Rua das Flores, 123',
    bairro: 'Centro',
    cidade: 'São Paulo',
    cep: '01234-567',
    complemento: 'Apto 45, Bloco B',
    dataRecebimento: '15/01/2024',
    horarioRecebimento: '14:30',
    peso: '2.5kg',
    dimensoes: '30x20x15cm',
    observacoes: 'Entrega apenas no período da manhã'
  };

  const [editData, setEditData] = useState(pacoteData);

  // Fetch tracking data when component mounts
  useEffect(() => {
    const fetchTrackingData = async () => {
      if (pacoteData.codigo) {
        setIsLoadingTracking(true);
        try {
          const result = await validateFreightOrder(pacoteData.codigo);
          setTrackingData(result.data);
        } catch (error) {
          console.error('Erro ao buscar dados de rastreamento:', error);
        } finally {
          setIsLoadingTracking(false);
        }
      }
    };

    fetchTrackingData();
  }, [pacoteData.codigo, validateFreightOrder]);

  const handleSave = () => {
    if (pacote) {
      // Update existing package in localStorage
      const updatedStock = userStock.map((p: any) => 
        p.id === id ? { ...p, ...editData } : p
      );
      localStorage.setItem('userStock', JSON.stringify(updatedStock));
    }
    
    setIsEditing(false);
    toast({
      title: "Dados atualizados",
      description: "As informações do pacote foram salvas com sucesso.",
    });
  };

  const handleDelete = () => {
    if (pacote) {
      // Remove package from localStorage
      const updatedStock = userStock.filter((p: any) => p.id !== id);
      localStorage.setItem('userStock', JSON.stringify(updatedStock));
      
      toast({
        title: "Pacote removido",
        description: "O pacote foi removido do estoque com sucesso.",
      });
    }
    
    navigate('/estoque/pacotes-comigo');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aguardando': return 'text-blue-600 bg-blue-50';
      case 'Problema': return 'text-red-600 bg-red-50';
      case 'Em rota': return 'text-green-600 bg-green-50';
      case 'Bipado': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTrackingStatusLabel = (code: string) => {
    switch (code) {
      case '1':
        return 'Coletado';
      case '2':
        return 'Em trânsito';
      case '3':
        return 'Em transferência';
      case '4':
        return 'Entregue';
      default:
        return 'Status desconhecido';
    }
  };

  const getTrackingStatusColor = (code: string) => {
    switch (code) {
      case '1':
        return 'bg-blue-100 text-blue-800';
      case '2':
        return 'bg-yellow-100 text-yellow-800';
      case '3':
        return 'bg-orange-100 text-orange-800';
      case '4':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <MobileLayout title="Detalhes do Pacote" showBackButton>
      <div className="p-4 space-y-4">
        {/* Cabeçalho do pacote */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-50 rounded-xl">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{editData.codigo}</h2>
                <span className={`text-sm px-2 py-1 rounded-full ${getStatusColor(editData.status)}`}>
                  {editData.status}
                </span>
              </div>
            </div>
            <div className="flex space-x-2">
              <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Edit className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Editar Pacote</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    <div>
                      <Label htmlFor="codigo">Código</Label>
                      <Input
                        id="codigo"
                        value={editData.codigo}
                        onChange={(e) => setEditData({...editData, codigo: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="destinatario">Destinatário</Label>
                      <Input
                        id="destinatario"
                        value={editData.destinatario}
                        onChange={(e) => setEditData({...editData, destinatario: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="telefone">Telefone</Label>
                      <Input
                        id="telefone"
                        value={editData.telefone}
                        onChange={(e) => setEditData({...editData, telefone: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="endereco">Endereço</Label>
                      <Input
                        id="endereco"
                        value={editData.endereco}
                        onChange={(e) => setEditData({...editData, endereco: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="peso">Peso</Label>
                      <Input
                        id="peso"
                        value={editData.peso}
                        onChange={(e) => setEditData({...editData, peso: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="observacoes">Observações</Label>
                      <Input
                        id="observacoes"
                        value={editData.observacoes || ''}
                        onChange={(e) => setEditData({...editData, observacoes: e.target.value})}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleSave}>
                      Salvar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon" className="text-red-600 hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirmar exclusão</DialogTitle>
                  </DialogHeader>
                  <p className="text-gray-600">
                    Tem certeza de que deseja remover o pacote {editData.codigo} do seu estoque?
                  </p>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                      Cancelar
                    </Button>
                    <Button variant="destructive" onClick={handleDelete}>
                      Remover
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Peso:</span>
              <span className="font-medium ml-2">{editData.peso}</span>
            </div>
            <div>
              <span className="text-gray-500">Dimensões:</span>
              <span className="font-medium ml-2">{editData.dimensoes}</span>
            </div>
          </div>
        </div>

        {/* Status de Rastreamento */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <Package className="w-5 h-5 text-gray-500" />
            <h3 className="font-semibold text-gray-900">Status de Rastreamento</h3>
          </div>
          
          {isLoadingTracking ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              <span className="ml-2 text-gray-500">Carregando informações...</span>
            </div>
          ) : trackingData ? (
            <div className="space-y-3">
              <div>
                <span className="text-gray-500">Status:</span>
                <Badge className={`ml-2 ${getTrackingStatusColor(trackingData.code_status)}`}>
                  {getTrackingStatusLabel(trackingData.code_status)}
                </Badge>
              </div>
              <div>
                <span className="text-gray-500">Observação:</span>
                <p className="text-sm text-gray-700 mt-1 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  {trackingData.observation}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Última atualização:</span>
                <span className="font-medium ml-2">{new Date(trackingData.date_event).toLocaleString('pt-BR')}</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500 text-sm">Não foi possível carregar as informações de rastreamento</p>
            </div>
          )}
        </div>

        {/* Informações do destinatário */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <User className="w-5 h-5 text-gray-500" />
            <h3 className="font-semibold text-gray-900">Destinatário</h3>
          </div>
          
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-gray-500">Nome:</span>
              <span className="font-medium ml-2">{editData.destinatario}</span>
            </div>
            <div>
              <span className="text-gray-500">Telefone:</span>
              <span className="font-medium ml-2">{editData.telefone}</span>
            </div>
          </div>
        </div>

        {/* Endereço de entrega */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <MapPin className="w-5 h-5 text-gray-500" />
            <h3 className="font-semibold text-gray-900">Endereço de Entrega</h3>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="font-medium">{editData.endereco}</div>
            <div className="text-gray-600">{editData.complemento}</div>
            <div className="text-gray-600">{editData.bairro} - {editData.cidade}</div>
            <div className="text-gray-600">CEP: {editData.cep}</div>
          </div>
        </div>

        {/* Mapa simulado */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Localização</h3>
          <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Mapa do endereço</p>
            </div>
          </div>
        </div>

        {/* Informações adicionais */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <Calendar className="w-5 h-5 text-gray-500" />
            <h3 className="font-semibold text-gray-900">Informações Adicionais</h3>
          </div>
          
          <div className="space-y-3 text-sm">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-gray-500">Data de recebimento:</span>
              <span className="font-medium">{editData.dataRecebimento}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-gray-500">Horário:</span>
              <span className="font-medium">{editData.horarioRecebimento}</span>
            </div>
            {editData.observacoes && (
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                <span className="text-yellow-800 text-sm font-medium">Observações:</span>
                <p className="text-yellow-700 text-sm mt-1">{editData.observacoes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default DetalhePacote;
