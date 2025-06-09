
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
import Chat from "./pages/Chat";
import Financeiro from "./pages/Financeiro";
import NotFound from "./pages/NotFound";

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
          <Route path="/estoque" element={<Estoque />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/financeiro" element={<Financeiro />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
