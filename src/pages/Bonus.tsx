import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp } from "lucide-react";

const TARGET = 487.32;

const Bonus = () => {
  const [value, setValue] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = TARGET / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= TARGET) {
        setValue(TARGET);
        clearInterval(interval);
      } else {
        setValue(current);
      }
    }, duration / steps);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-secondary/20">
          <DollarSign className="h-10 w-10 text-secondary" />
        </div>

        <h2 className="mb-2 text-lg font-bold text-muted-foreground">Valor disponível para saque</h2>

        <div className="mb-2 text-5xl font-extrabold text-foreground animate-count-up">
          R$ {value.toFixed(2).replace(".", ",")}
        </div>

        <div className="mb-8 flex items-center justify-center gap-1 text-sm text-secondary">
          <TrendingUp className="h-4 w-4" />
          <span>Bônus de monetização ativo</span>
        </div>

        <div className="mb-6 rounded-xl border border-border bg-card p-4 text-left text-sm text-muted-foreground">
          <p>
            Sua conta foi aprovada no programa de monetização. O valor acima está disponível para saque imediato via PIX ou transferência bancária.
          </p>
        </div>

        <Button
          onClick={() => navigate("/pix")}
          className="w-full h-12 text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
        >
          Sacar Agora
        </Button>
      </div>
    </div>
  );
};

export default Bonus;
