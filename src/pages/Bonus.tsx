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
        <div className="rounded-2xl bg-gray-50 p-5 animate-fade-in">
          <div className="flex items-center gap-1.5 mb-1">
            <p className="text-sm text-gray-600">Seu saldo</p>
            <div className="h-5 w-5 rounded-full bg-yellow-400 flex items-center justify-center text-white text-[9px] font-bold">P</div>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-3xl font-extrabold text-black tracking-tight">
              R$ {value.toFixed(2).replace(".", ",")}
            </p>
            <div className="flex flex-col items-center gap-1">
              <img src={pixLogo} alt="PIX" className="h-5 object-contain" loading="lazy" decoding="async" />
              <Button
                onClick={() => navigate("/pix")}
                className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 h-10 text-sm"
              >
                Sacar
              </Button>
            </div>
          </div>
        </div>

        {/* Parabéns Banner */}
        <div className="rounded-2xl overflow-hidden relative shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)] animate-fade-in" style={{ animationDelay: '80ms' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-white to-pink-50" />
          <div className="relative p-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-black leading-tight">
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
              <img src={calendarCoinsImg} alt="Calendário com moedas" className="h-32 w-32 object-contain" loading="lazy" decoding="async" />
            </div>
          </div>
        </div>

        {/* Check-in Section */}
        <div className="bg-white p-5 animate-fade-in" style={{ animationDelay: '160ms' }}>
          <div className="border-t border-dashed border-gray-300 mb-5" />
          <div className="flex items-start justify-between mb-2">
            <p className="text-base font-bold text-black leading-snug">
              Entre por 14 dias para ganhar
              <br />
              <span className="text-red-500">8.414 pontos</span>
            </p>
            <button className="rounded-full bg-gray-100 px-4 py-1.5 text-sm font-medium text-gray-400 shrink-0 ml-2">
              Concluído
            </button>
          </div>
          <div className="flex items-center gap-1.5 mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
            <p className="text-[12px] text-red-400">12 de nov - 25 de nov</p>
          </div>
          <div className="border-l-2 border-gray-200 pl-3 mb-5">
            <p className="text-[13px] text-gray-400 italic">Você concluiu todos os dias de check-in.</p>
          </div>
          <div className="flex items-center justify-between">
            {checkInValues.map((pts, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="relative h-12 w-12 rounded-full border-2 border-pink-200 bg-pink-50/50 flex items-center justify-center">
                  <div className="h-7 w-7 rounded-full bg-yellow-400/20 flex items-center justify-center">
                    <span className="text-yellow-600 text-[10px] font-bold">🪙</span>
                  </div>
                  <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-white flex items-center justify-center">
                    <Check className="h-3.5 w-3.5 text-red-400" strokeWidth={2.5} />
                  </div>
                </div>
                <span className="text-[11px] text-yellow-600 font-semibold">{pts}</span>
                <span className="text-[10px] text-gray-400">Dia {String(i + 1).padStart(2, '0')}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Anúncios */}
        <div className="bg-white px-5 py-4 animate-fade-in" style={{ animationDelay: '240ms' }}>
          <div className="border-t border-dashed border-gray-300 mb-5" />
          <div className="flex items-start justify-between mb-2">
            <p className="text-base font-bold text-black leading-snug">
              Vê anúncios direcionados diariamente para ganhares até
              <span className="text-red-500">2.730 pontos</span>
            </p>
            <button className="rounded-full bg-gray-100 px-4 py-1.5 text-sm font-medium text-gray-400 shrink-0 ml-2">
              Concluído
            </button>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
            <p className="text-[12px] text-red-400">30/30 anúncios assistidos</p>
          </div>
        </div>

        {/* Assistir vídeos */}
        <div className="bg-white px-5 py-4 animate-fade-in" style={{ animationDelay: '320ms' }}>
          <div className="border-t border-dashed border-gray-300 mb-5" />
          <div className="flex items-start justify-between mb-3">
            <p className="text-base font-bold text-black leading-snug">
              Assistir vídeos
              <span className="text-red-500">500 pontos</span>
            </p>
            <button className="rounded-full bg-gray-100 px-4 py-1.5 text-sm font-medium text-gray-400 shrink-0 ml-2">
              Concluído
            </button>
          </div>
          <div className="inline-block rounded-full bg-gray-100 px-4 py-1.5 text-[12px] font-semibold text-black mb-5">
            Assista por 10 min
          </div>
          <div className="relative mb-2">
            <div className="h-[2px] bg-gray-200 w-full absolute top-5" />
            <div className="flex items-center justify-between relative">
              {[
                { label: "50 pontos" },
                { label: "100 pontos" },
                { label: "150 pontos" },
                { label: "225 pontos" },
              ].map((v, i) => (
                <div key={i} className="flex flex-col items-center gap-1 z-10">
                  <div className="h-10 w-10 rounded-full bg-yellow-400 flex items-center justify-center text-white font-bold text-sm shadow-sm border-2 border-yellow-500">
                    P
                  </div>
                  <span className="text-[11px] text-gray-500 font-medium">{v.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recompensas */}
        <div className="bg-white px-5 py-4 animate-fade-in" style={{ animationDelay: '400ms' }}>
          <div className="border-t border-dashed border-gray-300 mb-5" />
          <div className="flex items-start justify-between mb-2">
            <p className="text-base font-bold text-black leading-snug">
              Resgate suas recompensas e ganhe
              <span className="text-red-500">640 pontos</span>
            </p>
            <button className="rounded-full bg-gray-100 px-4 py-1.5 text-sm font-medium text-gray-400 shrink-0 ml-2">
              Concluído
            </button>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
            <p className="text-[12px] text-red-400">8/8 resgatados</p>
          </div>
        </div>

        {/* Pesquisas diárias */}
        <div className="bg-white px-5 py-4 animate-fade-in" style={{ animationDelay: '480ms' }}>
          <div className="border-t border-dashed border-gray-300 mb-5" />
          <div className="flex items-start justify-between mb-2">
            <p className="text-base font-bold text-black leading-snug">
              Faça 60 pesquisas diárias para ganhar até
              <span className="text-red-500">996 pontos</span>
            </p>
            <button className="rounded-full bg-gray-100 px-4 py-1.5 text-sm font-medium text-gray-400 shrink-0 ml-2">
              Concluído
            </button>
          </div>
          <div className="flex items-center gap-1.5 mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
            <p className="text-[12px] text-red-400">60 pesquisas feitas hoje</p>
          </div>
          <div className="inline-block rounded-full bg-gray-100 px-4 py-1.5 text-[12px] font-semibold text-black mb-5">
            Até 756 pontos
          </div>
          <div className="relative mb-2">
            <div className="h-[2px] bg-gray-300 w-full absolute top-5" />
            <div className="flex items-center justify-around relative">
              {[
                { label: "36 pesquisas" },
                { label: "60 pesquisas" },
              ].map((v, i) => (
                <div key={i} className="flex flex-col items-center gap-1 z-10">
                  <div className="h-10 w-10 rounded-full bg-yellow-400 flex items-center justify-center text-white font-bold text-sm shadow-sm border-2 border-yellow-500">
                    P
                  </div>
                  <span className="text-[11px] text-gray-500 font-medium">{v.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 mt-4">
            <p className="text-[12px] text-gray-500 leading-relaxed">
              Obtém 21 pontos por escreveres uma consulta na barra de pesquisa, ou 0 ponto por tocares numa pesquisa sugerida, como em "Podes gostar".
            </p>
          </div>
        </div>

        {/* Convide amigos */}
        <div className="bg-white px-5 py-4 animate-fade-in" style={{ animationDelay: '560ms' }}>
          <div className="border-t border-dashed border-gray-300 mb-5" />
          <div className="flex items-start justify-between">
            <p className="text-base font-bold text-black leading-snug">
              Convide 1 amigo para se inscrever e ganhar{" "}
              <span className="text-red-500">100.000 pontos - 200.000 pontos</span>
            </p>
            <button className="rounded-full bg-gray-100 px-4 py-1.5 text-sm font-medium text-gray-400 shrink-0 ml-2">
              Concluído
            </button>
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
