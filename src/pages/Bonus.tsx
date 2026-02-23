import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

const TARGET = 3834.72;

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

  const checkDays = ["Dia 01", "Dia 02", "Dia 03", "Dia 04", "Dia 05", "Dia 06"];
  const videoPoints = [
    { label: "50 pontos", color: "bg-primary" },
    { label: "100 pontos", color: "bg-primary" },
    { label: "150 pontos", color: "bg-primary" },
    { label: "225 pontos", color: "bg-primary" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white py-4 text-center border-b border-gray-100">
        <h1 className="text-lg font-bold text-black">TikTok Bônus</h1>
      </div>

      <div className="flex-1 px-4 py-4 space-y-4">
        {/* Saldo Card */}
        <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 flex items-center gap-1">Seu saldo 🪙</p>
              <p className="text-3xl font-extrabold text-black">
                R$ {value.toFixed(2).replace(".", ",")}
              </p>
            </div>
            <Button
              onClick={() => navigate("/pix")}
              className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6 h-10 text-sm"
            >
              Sacar
            </Button>
          </div>
        </div>

        {/* Parabéns Banner */}
        <div className="rounded-2xl bg-gradient-to-br from-pink-50 to-white p-5 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-black leading-tight">
                Parabéns!
                <br />
                Você concluiu
                <br />
                todas as tarefas
              </h2>
              <p className="text-xl font-extrabold text-primary mt-1">
                R$ {TARGET.toFixed(2).replace(".", ",")}
              </p>
            </div>
            <div className="text-5xl">📅✅</div>
          </div>
        </div>

        {/* Check-in Task */}
        <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-sm font-semibold text-black">Entre por 14 dias para ganhar</p>
              <p className="text-sm font-bold text-primary">8.414 pontos</p>
              <p className="text-xs text-gray-400 mt-1">• 12 de nov - 25 de nov</p>
            </div>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-400">Concluído</span>
          </div>
          <p className="text-xs text-gray-500 mb-3">Você concluiu todos os dias de check-in.</p>
          <div className="flex items-center justify-between">
            {checkDays.map((day) => (
              <div key={day} className="flex flex-col items-center gap-1">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </div>
                <span className="text-[10px] text-gray-400">{day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Anúncios Task */}
        <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-black">
                Vê anúncios direcionados diariamente para ganhares até{" "}
                <span className="font-bold text-primary">2.730 pontos</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">• 30/30 anúncios assistidos</p>
            </div>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-400 shrink-0 ml-2">Concluído</span>
          </div>
        </div>

        {/* Assistir vídeos Task */}
        <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between mb-3">
            <p className="text-sm font-semibold text-black">
              Assistir vídeos <span className="font-bold text-primary">500 pontos</span>
            </p>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-400 shrink-0 ml-2">Concluído</span>
          </div>
          <span className="inline-block rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-500 mb-3">Assista por 10 min</span>
          <div className="flex items-end justify-between">
            {videoPoints.map((vp, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className={`h-8 w-8 rounded-full ${vp.color} flex items-center justify-center text-xs font-bold text-primary-foreground`}>
                  P
                </div>
                <span className="text-[10px] text-gray-400">{vp.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Resgatar recompensas */}
        <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-black">
                Resgate suas recompensas e ganhe
              </p>
              <p className="text-sm font-bold text-primary">640 pontos</p>
              <p className="text-xs text-gray-400 mt-1">• 8/8 resgatados</p>
            </div>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-400 shrink-0 ml-2">Concluído</span>
          </div>
        </div>

        {/* Pesquisas diárias */}
        <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100 mb-4">
          <div className="flex items-start justify-between">
            <p className="text-sm font-semibold text-black">
              Faça 60 pesquisas diárias para ganhar até{" "}
              <span className="font-bold text-primary">996 pontos</span>
            </p>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-400 shrink-0 ml-2">Concluído</span>
          </div>
        </div>
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
