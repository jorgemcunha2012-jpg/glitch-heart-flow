import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";

// Lazy load all pages for code splitting
const Landing = lazy(() => import("./pages/Landing"));
const Progresso = lazy(() => import("./pages/Progresso"));
const Bonus = lazy(() => import("./pages/Bonus"));
const Pix = lazy(() => import("./pages/Pix"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Pagamento = lazy(() => import("./pages/Pagamento"));
const BackRedirect = lazy(() => import("./pages/BackRedirect"));
const Upsell = lazy(() => import("./pages/Upsell"));
const Upsell2 = lazy(() => import("./pages/Upsell2"));
const Upsell3 = lazy(() => import("./pages/Upsell3"));
const Upsell4 = lazy(() => import("./pages/Upsell4"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Navigate to="/landing" replace />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/progresso" element={<Progresso />} />
            <Route path="/bonus" element={<Bonus />} />
            <Route path="/pix" element={<Pix />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/pagamento" element={<Pagamento />} />
            <Route path="/up1" element={<Upsell />} />
            <Route path="/up2" element={<Upsell2 />} />
            <Route path="/up3" element={<Upsell3 />} />
            <Route path="/up4" element={<Upsell4 />} />
            <Route path="/backredirect" element={<BackRedirect />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
