import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Progresso from "./pages/Progresso";
import Bonus from "./pages/Bonus";
import Pix from "./pages/Pix";
import Checkout from "./pages/Checkout";
import Pagamento from "./pages/Pagamento";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/landing" replace />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/progresso" element={<Progresso />} />
          <Route path="/bonus" element={<Bonus />} />
          <Route path="/pix" element={<Pix />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/pagamento" element={<Pagamento />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
