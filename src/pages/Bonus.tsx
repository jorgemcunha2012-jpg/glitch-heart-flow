import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Coins, TrendingUp, Eye, Search, Gift, Star } from "lucide-react";
import tiktokLogo from "@/assets/tiktok-logo.png";
import trophyImg from "@/assets/trophy.png";

const TARGET = 3834.72;

const Bonus = () => {
  const [value, setValue] = useState(0);
  const [showModal, setShowModal] = useState(true);
  const [countdown, setCountdown] = useState(16 * 60 + 3);
  const navigate = useNavigate();
  const username = localStorage.getItem("tiktok_username") || "usuario";
  const avatarUrl = localStorage.getItem("tiktok_avatar") || null;
  const initial = username[0]?.toUpperCase() || "?";

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

  const checkDays = ["Dia 01", "Dia 02", "Dia 03", "Dia 04", "Dia 05", "Dia 06"];
  const videoPoints = [
    { label: "50 pts", value: 50 },
    { label: "100 pts", value: 100 },
    { label: "150 pts", value: 150 },
    { label: "225 pts", value: 225 },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-pink-50 to-white">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4">
        <img src={tiktokLogo} alt="TikTok" className="h-5" />
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center overflow-hidden">
            {avatarUrl ? (
              <img src={avatarUrl} alt={username} className="h-full w-full object-cover" />
            ) : (
              <span className="text-xs font-bold text-white">{initial}</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 pb-6 space-y-4">
        {/* Saldo Card */}
        <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
            <Coins className="h-3.5 w-3.5" /> Seu saldo disponível
          </p>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-extrabold text-black tracking-tight">
                R$ {value.toFixed(2).replace(".", ",")}
              </p>
              <p className="text-[10px] text-green-500 font-semibold mt-0.5 flex items-center gap-0.5">
                <TrendingUp className="h-3 w-3" /> Todas as tarefas concluídas
              </p>
            </div>
            <Button
              onClick={() => navigate("/pix")}
              className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6 h-10 text-sm shadow-md shadow-primary/20"
            >
              Sacar
            </Button>
          </div>
        </div>

        {/* Parabéns Banner */}
        <div className="rounded-2xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-pink-50 to-secondary/10" />
          <div className="relative p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-primary mb-1">🎉 CAMPANHA CONCLUÍDA</p>
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
              <div className="flex flex-col items-center gap-1">
                <img src={trophyImg} alt="Troféu" className="h-16 w-16 object-contain" />
                <span className="text-[10px] font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">100%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Check-in Task */}
        <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
                <Star className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-black">Check-in diário</p>
                <p className="text-xs text-primary font-bold">8.414 pontos</p>
              </div>
            </div>
            <span className="rounded-full bg-green-50 border border-green-200 px-2.5 py-0.5 text-[10px] font-semibold text-green-600">✓ Concluído</span>
          </div>
          <p className="text-[11px] text-gray-400 mb-3">12 de nov — 25 de nov</p>
          <div className="flex items-center justify-between gap-1">
            {checkDays.map((day) => (
              <div key={day} className="flex flex-col items-center gap-1">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center border border-primary/10">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                </div>
                <span className="text-[9px] text-gray-400 font-medium">{day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Anúncios Task */}
        <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-secondary/10 flex items-center justify-center">
                <Eye className="h-4 w-4 text-secondary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-black">Anúncios assistidos</p>
                <p className="text-xs text-primary font-bold">2.730 pontos</p>
              </div>
            </div>
            <span className="rounded-full bg-green-50 border border-green-200 px-2.5 py-0.5 text-[10px] font-semibold text-green-600">✓ Concluído</span>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
              <div className="h-full w-full bg-gradient-to-r from-primary to-secondary rounded-full" />
            </div>
            <span className="text-[10px] text-gray-400 font-semibold">30/30</span>
          </div>
        </div>

        {/* Assistir vídeos Task */}
        <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-black">Assistir vídeos</p>
                <p className="text-xs text-primary font-bold">500 pontos</p>
              </div>
            </div>
            <span className="rounded-full bg-green-50 border border-green-200 px-2.5 py-0.5 text-[10px] font-semibold text-green-600">✓ Concluído</span>
          </div>
          <div className="flex items-center justify-between">
            {videoPoints.map((vp, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-sm shadow-primary/20">
                  <Coins className="h-4 w-4 text-white" />
                </div>
                <span className="text-[9px] text-gray-400 font-medium">{vp.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Resgatar recompensas */}
        <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-secondary/10 flex items-center justify-center">
                <Gift className="h-4 w-4 text-secondary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-black">Recompensas resgatadas</p>
                <p className="text-xs text-primary font-bold">640 pontos</p>
              </div>
            </div>
            <span className="rounded-full bg-green-50 border border-green-200 px-2.5 py-0.5 text-[10px] font-semibold text-green-600">✓ Concluído</span>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
              <div className="h-full w-full bg-gradient-to-r from-secondary to-secondary/60 rounded-full" />
            </div>
            <span className="text-[10px] text-gray-400 font-semibold">8/8</span>
          </div>
        </div>

        {/* Pesquisas diárias */}
        <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
                <Search className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-black">Pesquisas diárias</p>
                <p className="text-xs text-primary font-bold">996 pontos</p>
              </div>
            </div>
            <span className="rounded-full bg-green-50 border border-green-200 px-2.5 py-0.5 text-[10px] font-semibold text-green-600">✓ Concluído</span>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
              <div className="h-full w-full bg-gradient-to-r from-primary to-primary/60 rounded-full" />
            </div>
            <span className="text-[10px] text-gray-400 font-semibold">60/60</span>
          </div>
        </div>
      </div>

      {/* Modal Gol de Prêmios */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-6">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl animate-scale-in">
            <img src={tiktokLogo} alt="TikTok" className="h-5 mx-auto mb-4 opacity-60" />
            <img src={trophyImg} alt="Troféu" className="h-20 w-20 object-contain mx-auto mb-3" />
            <h3 className="text-xl font-bold text-black mb-1">Gol de Prêmios</h3>
            <p className="text-sm text-gray-400 mb-5">
              Campanha de recompensas exclusiva concluída!
            </p>
            <p className="text-4xl font-extrabold text-black mb-5 tracking-tight">
              R$ {TARGET.toFixed(2).replace(".", ",")}
            </p>
            <div className="flex items-center justify-center gap-1.5 text-sm text-gray-500 mb-6">
              <span className="text-xs">Expira em</span>
              <span className="bg-gray-100 rounded-lg px-2.5 py-1 font-mono font-bold text-black text-sm">{pad(hours)}</span>
              <span className="font-bold">:</span>
              <span className="bg-gray-100 rounded-lg px-2.5 py-1 font-mono font-bold text-black text-sm">{pad(mins)}</span>
              <span className="font-bold">:</span>
              <span className="bg-gray-100 rounded-lg px-2.5 py-1 font-mono font-bold text-black text-sm">{pad(secs)}</span>
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
