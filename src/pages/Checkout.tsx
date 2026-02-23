import { Button } from "@/components/ui/button";
import { ShieldCheck, Lock, CreditCard } from "lucide-react";

const Checkout = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h2 className="mb-2 text-center text-xl font-bold">Libere seu saque</h2>
        <p className="mb-6 text-center text-sm text-muted-foreground">
          Uma pequena taxa é necessária para processar seu saque
        </p>

        {/* Card principal */}
        <div className="mb-6 rounded-2xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Valor do saque</span>
            <span className="text-lg font-bold text-secondary">R$ 487,32</span>
          </div>
          <div className="mb-4 border-t border-border" />
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Taxa de liberação</span>
            <span className="text-2xl font-extrabold text-foreground">R$ 19,90</span>
          </div>
          <p className="mb-6 text-xs text-muted-foreground">
            Pagamento único para liberar todos os seus saques futuros. Sem cobranças recorrentes.
          </p>

          <Button className="w-full h-12 text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl">
            <CreditCard className="mr-2 h-5 w-5" />
            Pagar e Liberar Saque
          </Button>
        </div>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <ShieldCheck className="h-4 w-4 text-secondary" />
            <span>Pagamento seguro</span>
          </div>
          <div className="flex items-center gap-1">
            <Lock className="h-4 w-4 text-secondary" />
            <span>Dados protegidos</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
