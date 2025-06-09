
import { useState } from 'react';
import MobileLayout from '@/components/MobileLayout';
import { useNavigate } from 'react-router-dom';
import { Filter, ArrowUpDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

const PacotesComigo = () => {
  const navigate = useNavigate();
  const [filtroAberto, setFiltroAberto] = useState(false);
  const [ordenacaoAberta, setOrdenacaoAberta] = useState(false);
  const [filtros, setFiltros] = useState({
    codigo: '',
    status: ''
  });
  const [ordenacao, setOrdenacao] = useState('codigo-crescente');

  const pacotes = [
    { id: 1, codigo: 'PKG001', status: 'Aguardando', dataRecebimento: '2024-01-15' },
    { id: 2, codigo: 'PKG002', status: 'Aguardando', dataRecebimento: '2024-01-16' },
    { id: 3, codigo: 'PKG003', status: 'Aguardando', dataRecebimento: '2024-01-17' },
    { id: 4, codigo: 'PKG004', status: 'Aguardando', dataRecebimento: '2024-01-18' },
    { id: 5, codigo: 'PKG005', status: 'Aguardando', dataRecebimento: '2024-01-19' }
  ];

  const aplicarFiltros = () => {
    setFiltroAberto(false);
  };

  const aplicarOrdenacao = () => {
    setOrdenacaoAberta(false);
  };

  return (
    <MobileLayout title="Pacotes comigo" showBackButton>
      <div className="flex flex-col h-full">
        {/* Barra de ações */}
        <div className="bg-white border-b p-4">
          <div className="flex justify-end space-x-2">
            <Sheet open={filtroAberto} onOpenChange={setFiltroAberto}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="h-auto">
                <SheetHeader>
                  <SheetTitle>Filtros</SheetTitle>
                </SheetHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Código do pacote</label>
                    <Input
                      placeholder="Digite o código"
                      value={filtros.codigo}
                      onChange={(e) => setFiltros({...filtros, codigo: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Status</label>
                    <Select value={filtros.status} onValueChange={(value) => setFiltros({...filtros, status: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aguardando">Aguardando</SelectItem>
                        <SelectItem value="processando">Processando</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={aplicarFiltros} className="w-full">
                    Aplicar Filtros
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            <Sheet open={ordenacaoAberta} onOpenChange={setOrdenacaoAberta}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <ArrowUpDown className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="h-auto">
                <SheetHeader>
                  <SheetTitle>Ordenação</SheetTitle>
                </SheetHeader>
                <div className="space-y-4 mt-4">
                  <Select value={ordenacao} onValueChange={setOrdenacao}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="codigo-crescente">Código (A-Z)</SelectItem>
                      <SelectItem value="codigo-decrescente">Código (Z-A)</SelectItem>
                      <SelectItem value="data-crescente">Data recebimento (mais antigo)</SelectItem>
                      <SelectItem value="data-decrescente">Data recebimento (mais recente)</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={aplicarOrdenacao} className="w-full">
                    Aplicar Ordenação
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Lista de pacotes */}
        <div className="flex-1 p-4 space-y-3">
          {pacotes.map((pacote) => (
            <button
              key={pacote.id}
              onClick={() => navigate(`/estoque/detalhes/${pacote.id}`)}
              className="w-full bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow text-left"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-gray-900">{pacote.codigo}</span>
                    <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                      {pacote.status}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 ml-3" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </MobileLayout>
  );
};

export default PacotesComigo;
