import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Coins } from "lucide-react";
import calendarCoinsImg from "@/assets/calendar-coins.png";
import pixLogo from "@/assets/pix-logo-icon.png";

const TARGET = 3834.72;

const checkInValues = [50, 100, 150, 200, 250, 300];

const Bonus = () => {
  const [value, setValue] = useState(0);
  const [showModal, setShowModal] = useState(true);
  const [countdown, setCountdown] = useState(16 * 60 + 3);
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
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-center px-5 py-4 border-b border-gray-100">
        <h1 className="text-lg font-bold text-black">TikTok Bônus</h1>
      </div>

      <div className="flex-1 px-4 pb-6 space-y-4 pt-4">
        {/* Saldo Card */}
        <div className="rounded-2xl bg-white p-5 shadow-[0_2px_16px_-2px_rgba(0,0,0,0.08)] border border-gray-100 animate-fade-in">
          <div className="flex items-center gap-1.5 mb-1">
            <Coins className="h-4 w-4 text-yellow-500" />
            <p className="text-xs text-gray-400">Seu saldo</p>
          </div>
          <p className="text-3xl font-extrabold text-black tracking-tight">
            R$ {value.toFixed(2).replace(".", ",")}
          </p>
          <p className="text-[10px] text-green-500 font-semibold mt-0.5 mb-4">
            ✓ Todas as tarefas concluídas
          </p>
          <div className="flex flex-col items-center gap-2">
            <img src={pixLogo} alt="PIX" className="h-6 object-contain" loading="lazy" decoding="async" />
            <Button
              onClick={() => navigate("/pix")}
              className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-11 text-sm shadow-md shadow-primary/20"
            >
              Sacar
            </Button>
          </div>
        </div>

        {/* Parabéns Banner */}
        <div className="rounded-2xl overflow-hidden relative shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)] animate-fade-in" style={{ animationDelay: '80ms' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-white to-pink-50" />
          <div className="relative p-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-black leading-tight">
                  Parabéns!
                  <br />
                  Você concluiu
                  <br />
                  todas as tarefas
                </h2>
                <p className="text-xl font-extrabold text-primary mt-2">
                  R$ {TARGET.toFixed(2).replace(".", ",")}
                </p>
              </div>
              <img src={calendarCoinsImg} alt="Calendário com moedas" className="h-28 w-28 object-contain" loading="lazy" decoding="async" />
            </div>
          </div>
        </div>

        {/* Check-in Section */}
        <div className="rounded-2xl bg-white p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)] border border-gray-100 animate-fade-in" style={{ animationDelay: '160ms' }}>
          {/* Dashed separator */}
          <div className="border-t border-dashed border-gray-200 mb-4" />

          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-sm font-semibold text-black">
                Entre por 14 dias para ganhar{" "}
                <span className="text-red-500 font-bold">8.414 pontos</span>
              </p>
            </div>
            <button className="rounded-full bg-gray-200 px-3 py-1 text-[11px] font-semibold text-gray-500">
              Concluído
            </button>
          </div>

          <div className="flex items-center gap-1.5 mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
            <p className="text-[11px] text-gray-400">12 de nov - 25 de nov</p>
          </div>

          {/* Message box */}
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <p className="text-[11px] text-gray-500">Você concluiu todos os dias de check-in.</p>
          </div>

          {/* Check-in circles */}
          <div className="flex items-center justify-between">
            {checkInValues.map((pts, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="relative h-11 w-11 rounded-full border-2 border-pink-200 bg-pink-50 flex items-center justify-center">
                  <Coins className="h-5 w-5 text-yellow-500" />
                  {/* Pink checkmark */}
                  <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-pink-400 flex items-center justify-center">
                    <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                  </div>
                </div>
                <span className="text-[10px] text-gray-500 font-medium">{pts}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Gol de Prêmios */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-6">
          <div className="w-full max-w-xs rounded-3xl bg-white pt-14 pb-6 px-6 text-center shadow-2xl animate-scale-in relative">
            <div className="absolute -top-12 left-1/2 -translate-x-1/2">
              <img src={calendarCoinsImg} alt="Calendário com moedas" className="h-24 w-24 object-contain drop-shadow-md" loading="lazy" decoding="async" />
            </div>

            <h3 className="text-lg font-extrabold text-black mb-1.5">Gol de Prêmios</h3>
            <p className="text-xs text-gray-500 mb-5 leading-relaxed">
              Parabéns! Como parte de uma
              <br />
              campanha de recompensas exclusiva.
            </p>

            <p className="text-3xl font-extrabold text-black tracking-tight mb-5">
              R$ {TARGET.toFixed(2).replace(".", ",")}
            </p>

            <div className="flex items-center justify-center gap-1 text-sm text-gray-400 mb-6">
              <span className="text-xs">Expira em</span>
              <span className="font-mono font-bold text-black">{pad(hours)}</span>
              <span className="font-bold">:</span>
              <span className="font-mono font-bold text-black">{pad(mins)}</span>
              <span className="font-bold">:</span>
              <span className="font-mono font-bold text-black">{pad(secs)}</span>
            </div>

            <Button
              onClick={() => setShowModal(false)}
              className="w-full h-12 rounded-full text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
            >
              Continuar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bonus;
