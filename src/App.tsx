
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Splash from "./pages/Splash";
import Onboarding from "./pages/Onboarding";
import Auth from "./pages/Auth";
import TipoDeUsuario from "./pages/TipoDeUsuario";
import UsuarioTipoPonto from "./pages/UsuarioTipoPonto";
import CadastroSucesso from "./pages/CadastroSucesso";
import Index from "./pages/Index";
import Bipagem from "./pages/Bipagem";
import DigitarCodigo from "./pages/DigitarCodigo";
import ResultadoBipagem from "./pages/ResultadoBipagem";
import DadosTransferencia from "./pages/DadosTransferencia";
import UploadTransferencia from "./pages/UploadTransferencia";
import TransferenciaSucesso from "./pages/TransferenciaSucesso";
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
import AssinaturaColeta from "./pages/AssinaturaColeta";
import Home2 from "./pages/Home2";
import Perfil from "./pages/Perfil";
import FinalizarRota from "./pages/FinalizarRota";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/splash" replace />} />
          <Route path="/splash" element={<Splash />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/tipodeusuario" element={<TipoDeUsuario />} />
          <Route path="/usuariotipoponto" element={<UsuarioTipoPonto />} />
          <Route path="/cadastrosucesso" element={<CadastroSucesso />} />
          <Route path="/home" element={<Index />} />
          <Route path="/home2" element={<Home2 />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/bipagem" element={<Bipagem />} />
          <Route path="/bipagem/digitar-codigo" element={<DigitarCodigo />} />
          <Route path="/resultado-bipagem" element={<ResultadoBipagem />} />
          <Route path="/dados-transferencia" element={<DadosTransferencia />} />
          <Route path="/upload-transferencia" element={<UploadTransferencia />} />
          <Route path="/transferencia-sucesso" element={<TransferenciaSucesso />} />
          <Route path="/servicos" element={<Servicos />} />
          <Route path="/meusservicos" element={<MeusServicos />} />
          <Route path="/detalhedoservico/:id" element={<DetalheDoServico />} />
          <Route path="/rotaemandamento/:id" element={<RotaEmAndamento />} />
          <Route path="/finalizar-rota/:id" element={<FinalizarRota />} />
          <Route path="/detalhedoponto/:id" element={<DetalheDoPonto />} />
          <Route path="/entregar/:id" element={<Entregar />} />
          <Route path="/dadosrecebedor/:id" element={<DadosRecebedor />} />
          <Route path="/entregasucesso" element={<EntregaSucesso />} />
          <Route path="/naopudeentregar/:id" element={<NaoPudeEntregar />} />
          <Route path="/motivoentrega/:id" element={<MotivoEntrega />} />
          <Route path="/coletar/:id" element={<Coletar />} />
          <Route path="/assinatura-coleta/:id" element={<AssinaturaColeta />} />
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
