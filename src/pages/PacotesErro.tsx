
import { useState, useEffect } from 'react';
import MobileLayout from '@/components/MobileLayout';
import { useNavigate, useLocation } from 'react-router-dom';
import { Filter, ArrowUpDown, ChevronRight, PackageX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface EstoqueItem {
  id: string;
  barcode: string;
  status: string;
}

const PacotesErro = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [filtroAberto, setFiltroAberto] = useState(false);
  const [ordenacaoAberta, setOrdenacaoAberta] = useState(false);
  const [pacotes, setPacotes] = useState<EstoqueItem[]>([]);
  const [filtros, setFiltros] = useState({
    codigo: '',
    status: ''
  });
  const [ordenacao, setOrdenacao] = useState('codigo-crescente');

  useEffect(() => {
    if (location.state?.itens && location.state?.status) {
      const itensFiltrados = location.state.itens.filter(
        (item: EstoqueItem) => item.status === 'error_input_warehouse'
      );
      setPacotes(itensFiltrados);
    }
  }, [location.state]);

  const aplicarFiltros = () => {
    setFiltroAberto(false);
  };

  const aplicarOrdenacao = () => {
    setOrdenacaoAberta(false);
  };

  return (
    <MobileLayout title="Pacotes com erro" showBackButton>
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
          {pacotes.length === 0 ? (
            <div className="text-center py-8">
              <PackageX className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum pacote com erro encontrado</p>
            </div>
          ) : (
            pacotes.map((pacote) => (
              <button
                key={pacote.id}
                onClick={() => navigate(`/estoque/detalhes/${pacote.id}`)}
                className="w-full bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-gray-900">{pacote.barcode}</span>
                      <span className="text-sm text-red-600 bg-red-50 px-2 py-1 rounded-full">
                        Erro
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 ml-3" />
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </MobileLayout>
  );
};

export default PacotesErro;
