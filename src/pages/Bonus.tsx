import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp } from "lucide-react";

const TARGET = 3834.72;

const Bonus = () => {
  const [value, setValue] = useState(0);
  const [showModal, setShowModal] = useState(true);
  const [countdown, setCountdown] = useState(16 * 60 + 3); // 16:03
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

  // Countdown timer
  useEffect(() => {
    if (!showModal) return;
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [showModal]);

  const hours = Math.floor(countdown / 3600);
  const mins = Math.floor((countdown % 3600) / 60);
  const secs = countdown % 60;
  const pad = (n: number) => String(n).padStart(2, "0");

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

      {/* Modal Gol de Prêmios */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl">
            <h3 className="text-xl font-bold text-black mb-2">Gol de Prêmios</h3>
            <p className="text-sm text-gray-500 mb-6">
              Parabéns! Como parte de uma campanha de recompensas exclusiva.
            </p>
            <p className="text-4xl font-extrabold text-black mb-6">
              R$ {TARGET.toFixed(2).replace(".", ",")}
            </p>
            <div className="flex items-center justify-center gap-1 text-sm text-gray-500 mb-6">
              <span>Expira em</span>
              <span className="bg-gray-100 rounded px-2 py-0.5 font-mono font-semibold text-black">{pad(hours)}</span>
              <span>:</span>
              <span className="bg-gray-100 rounded px-2 py-0.5 font-mono font-semibold text-black">{pad(mins)}</span>
              <span>:</span>
              <span className="bg-gray-100 rounded px-2 py-0.5 font-mono font-semibold text-black">{pad(secs)}</span>
            </div>
            <Button
              onClick={() => setShowModal(false)}
              className="w-full h-12 rounded-full text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Obrigado
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bonus;
