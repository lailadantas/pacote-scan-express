
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Bipagem from "./pages/Bipagem";
import DigitarCodigo from "./pages/DigitarCodigo";
import Servicos from "./pages/Servicos";
import Estoque from "./pages/Estoque";
import PacotesComigo from "./pages/PacotesComigo";
import PacotesProblema from "./pages/PacotesProblema";
import PacotesRota from "./pages/PacotesRota";
import DetalhePacote from "./pages/DetalhePacote";
import Chat from "./pages/Chat";
import Financeiro from "./pages/Financeiro";
import NotFound from "./pages/NotFound";
import MeusServicos from "./pages/MeusServicos";
import DetalheDoServico from "./pages/DetalheDoServico";
import RotaEmAndamento from "./pages/RotaEmAndamento";
import DetalheDoPonto from "./pages/DetalheDoPonto";
import Entregar from "./pages/Entregar";
import DadosRecebedor from "./pages/DadosRecebedor";
import EntregaSucesso from "./pages/EntregaSucesso";
import NaoPudeEntregar from "./pages/NaoPudeEntregar";
import MotivoEntrega from "./pages/MotivoEntrega";
import RegistroSucesso from "./pages/RegistroSucesso";
import RotaFinalizada from "./pages/RotaFinalizada";
import Coletar from "./pages/Coletar";
import DadosRemetente from "./pages/DadosRemetente";
import ColetaSucesso from "./pages/ColetaSucesso";
import NaoPudeColetar from "./pages/NaoPudeColetar";
import MotivoColeta from "./pages/MotivoColeta";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/bipagem" element={<Bipagem />} />
          <Route path="/bipagem/digitar-codigo" element={<DigitarCodigo />} />
          <Route path="/servicos" element={<Servicos />} />
          <Route path="/meusservicos" element={<MeusServicos />} />
          <Route path="/detalhedoservico/:id" element={<DetalheDoServico />} />
          <Route path="/rotaemandamento/:id" element={<RotaEmAndamento />} />
          <Route path="/detalhedoponto/:id" element={<DetalheDoPonto />} />
          <Route path="/entregar/:id" element={<Entregar />} />
          <Route path="/dadosrecebedor/:id" element={<DadosRecebedor />} />
          <Route path="/entregasucesso" element={<EntregaSucesso />} />
          <Route path="/naopudeentregar/:id" element={<NaoPudeEntregar />} />
          <Route path="/motivoentrega/:id" element={<MotivoEntrega />} />
          <Route path="/coletar/:id" element={<Coletar />} />
          <Route path="/dadosremetente/:id" element={<DadosRemetente />} />
          <Route path="/coletasucesso" element={<ColetaSucesso />} />
          <Route path="/naopudecoletar/:id" element={<NaoPudeColetar />} />
          <Route path="/motivocoleta/:id" element={<MotivoColeta />} />
          <Route path="/registrosucesso" element={<RegistroSucesso />} />
          <Route path="/rotafinalizada" element={<RotaFinalizada />} />
          <Route path="/estoque" element={<Estoque />} />
          <Route path="/estoque/pacotes-comigo" element={<PacotesComigo />} />
          <Route path="/estoque/pacotes-problema" element={<PacotesProblema />} />
          <Route path="/estoque/pacotes-rota" element={<PacotesRota />} />
          <Route path="/estoque/detalhes/:id" element={<DetalhePacote />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/financeiro" element={<Financeiro />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
