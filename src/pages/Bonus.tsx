import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import calendarCoinsImg from "@/assets/calendar-coins.png";
import pixLogoFull from "@/assets/pix-logo-full.png";
import coinIcon from "@/assets/coin-icon.png";
import goldenBallImg from "@/assets/golden-ball.png";

const TARGET = 3200.00;
const TT_RED = "#FE2C55";
const TT_BLACK = "#161823";

const checkInValues = [50, 100, 150, 200, 250, 300];

const CoinImg = ({ size = 32 }: { size?: number }) => (
  <img src={coinIcon} alt="moeda" style={{ width: size, height: size }} className="object-contain" />
);

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

  const formatBRL = (v: number) =>
    v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="flex min-h-screen flex-col bg-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      {/* Header */}
      <div className="flex items-center justify-center px-5 py-3.5">
        <h1 className="text-[17px] font-bold tracking-tight" style={{ color: TT_BLACK }}>TikTok Bônus</h1>
      </div>

      <div className="flex-1 px-4 pb-8 pt-2">
        {/* Saldo Card */}
        <div className="rounded-2xl bg-[#f5f5f5] p-5 mb-4 animate-fade-in">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-[15px] font-medium" style={{ color: '#545454' }}>Seu saldo</span>
            <CoinImg size={20} />
          </div>
          <div className="flex items-end justify-between mt-1">
            <p className="text-[32px] font-extrabold leading-none tracking-tight" style={{ color: TT_BLACK }}>
              R$ {formatBRL(value)}
            </p>
            <div className="flex flex-col items-center gap-1.5">
              <img src={pixLogoFull} alt="PIX" className="h-[22px] object-contain" loading="lazy" decoding="async" />
              <Button
                onClick={() => navigate("/pix")}
                className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-7 h-[38px] text-[14px]"
              >
                Sacar
              </Button>
            </div>
          </div>
        </div>

        {/* Parabéns Banner */}
        <div className="rounded-2xl overflow-hidden relative mb-4 animate-fade-in" style={{ animationDelay: '80ms' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-[#fff0f3] via-white to-[#fff5f7]" />
          <div className="relative px-5 py-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h2 className="text-[22px] font-extrabold leading-[1.2]" style={{ color: TT_BLACK }}>
                  Parabéns!
                  <br />
                  Você concluiu
                  <br />
                  todas as tarefas
                </h2>
                <p className="text-[22px] font-extrabold text-primary mt-1.5">
                  R$ {formatBRL(TARGET)}
                </p>
              </div>
              <img
                src={calendarCoinsImg}
                alt="Calendário com moedas"
                className="w-[130px] h-[130px] object-contain -mr-2"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>

        {/* ─── Check-in Section ─── */}
        <div className="px-1 animate-fade-in" style={{ animationDelay: '160ms' }}>
          <div className="border-t-[1.5px] border-dashed border-[#ddd] mb-5" />

          <div className="flex items-start justify-between mb-1.5">
            <p className="text-[16px] font-bold leading-snug" style={{ color: TT_BLACK }}>
              Entre por 14 dias para ganhar
              <br />
              <span style={{ color: TT_RED }}>8.414 pontos</span>
            </p>
            <span className="rounded-full bg-[#f0f0f0] px-4 py-1.5 text-[13px] font-medium text-[#b0b0b0] shrink-0 ml-3">
              Concluído
            </span>
          </div>

          <div className="flex items-center gap-1.5 mb-3">
            <span className="h-[5px] w-[5px] rounded-full bg-[#aaa]" />
            <p className="text-[12px]" style={{ color: TT_RED }}>12 de nov - 25 de nov</p>
          </div>

          <div className="border-l-[2px] border-[#e8e8e8] pl-3 mb-5">
            <p className="text-[13px] text-[#999] italic">Você concluiu todos os dias de check-in.</p>
          </div>

          <div className="flex items-start justify-between px-1 mb-6">
            {checkInValues.map((pts, i) => (
              <div key={i} className="flex flex-col items-center" style={{ gap: '4px' }}>
                <div className="relative">
                  <div
                    className="rounded-full flex items-center justify-center"
                    style={{ width: 48, height: 48, border: '2px solid #fcc', backgroundColor: '#fff5f7' }}
                  >
                    <CoinImg size={26} />
                  </div>
                  <div
                    className="absolute flex items-center justify-center bg-white rounded-full"
                    style={{ top: -3, right: -3, width: 20, height: 20 }}
                  >
                    <Check style={{ color: TT_RED }} size={14} strokeWidth={3} />
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-[#c49a20]">{pts}</span>
                <span className="text-[10px] text-[#aaa]">Dia {String(i + 1).padStart(2, '0')}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Anúncios ─── */}
        <div className="px-1 animate-fade-in" style={{ animationDelay: '240ms' }}>
          <div className="border-t-[1.5px] border-dashed border-[#ddd] mb-5" />
          <div className="flex items-start justify-between mb-1.5">
            <p className="text-[16px] font-bold leading-snug" style={{ color: TT_BLACK }}>
              Vê anúncios direcionados diariamente
              <br />
              para ganhares até<span style={{ color: TT_RED }}> 2.730 pontos</span>
            </p>
            <span className="rounded-full bg-[#f0f0f0] px-4 py-1.5 text-[13px] font-medium text-[#b0b0b0] shrink-0 ml-3">
              Concluído
            </span>
          </div>
          <div className="flex items-center gap-1.5 mb-6">
            <span className="h-[5px] w-[5px] rounded-full bg-[#aaa]" />
            <p className="text-[12px]" style={{ color: TT_RED }}>30/30 anúncios assistidos</p>
          </div>
        </div>

        {/* ─── Assistir vídeos ─── */}
        <div className="px-1 animate-fade-in" style={{ animationDelay: '320ms' }}>
          <div className="border-t-[1.5px] border-dashed border-[#ddd] mb-5" />
          <div className="flex items-start justify-between mb-3">
            <p className="text-[16px] font-bold leading-snug" style={{ color: TT_BLACK }}>
              Assistir vídeos<span style={{ color: TT_RED }}> 500 pontos</span>
            </p>
            <span className="rounded-full bg-[#f0f0f0] px-4 py-1.5 text-[13px] font-medium text-[#b0b0b0] shrink-0 ml-3">
              Concluído
            </span>
          </div>
          <div className="inline-block rounded-full bg-[#f0f0f0] px-4 py-1.5 text-[13px] font-semibold mb-5" style={{ color: TT_BLACK }}>
            Assista por 10 min
          </div>
          <div className="relative mb-6">
            <div className="absolute top-[18px] left-[10%] right-[10%] h-[2px] bg-[#e0e0e0]" />
            <div className="flex items-center justify-between relative">
              {["50 pontos", "100 pontos", "150 pontos", "225 pontos"].map((label, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5 z-10">
                  <CoinImg size={36} />
                  <span className="text-[11px] text-[#888] font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Recompensas ─── */}
        <div className="px-1 animate-fade-in" style={{ animationDelay: '400ms' }}>
          <div className="border-t-[1.5px] border-dashed border-[#ddd] mb-5" />
          <div className="flex items-start justify-between mb-1.5">
            <p className="text-[16px] font-bold leading-snug" style={{ color: TT_BLACK }}>
              Resgate suas recompensas e ganhe<span style={{ color: TT_RED }}>640 pontos</span>
            </p>
            <span className="rounded-full bg-[#f0f0f0] px-4 py-1.5 text-[13px] font-medium text-[#b0b0b0] shrink-0 ml-3">
              Concluído
            </span>
          </div>
          <div className="flex items-center gap-1.5 mb-6">
            <span className="h-[5px] w-[5px] rounded-full bg-[#aaa]" />
            <p className="text-[12px]" style={{ color: TT_RED }}>8/8 resgatados</p>
          </div>
        </div>

        {/* ─── Pesquisas diárias ─── */}
        <div className="px-1 animate-fade-in" style={{ animationDelay: '480ms' }}>
          <div className="border-t-[1.5px] border-dashed border-[#ddd] mb-5" />
          <div className="flex items-start justify-between mb-1.5">
            <p className="text-[16px] font-bold leading-snug" style={{ color: TT_BLACK }}>
              Faça 60 pesquisas diárias para ganhar
              <br />
              até<span style={{ color: TT_RED }}> 996 pontos</span>
            </p>
            <span className="rounded-full bg-[#f0f0f0] px-4 py-1.5 text-[13px] font-medium text-[#b0b0b0] shrink-0 ml-3">
              Concluído
            </span>
          </div>
          <div className="flex items-center gap-1.5 mb-2">
            <span className="h-[5px] w-[5px] rounded-full bg-[#aaa]" />
            <p className="text-[12px]" style={{ color: TT_RED }}>60 pesquisas feitas hoje</p>
          </div>
          <div className="inline-block rounded-full bg-[#f0f0f0] px-4 py-1.5 text-[13px] font-semibold mb-5" style={{ color: TT_BLACK }}>
            Até 756 pontos
          </div>
          <div className="relative mb-3">
            <div className="absolute top-[18px] left-[20%] right-[20%] h-[2px] bg-[#ddd]" />
            <div className="flex items-center justify-around relative">
              {["36 pesquisas", "60 pesquisas"].map((label, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5 z-10">
                  <CoinImg size={36} />
                  <span className="text-[11px] text-[#888] font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#f7f7f7] rounded-xl p-4 mt-2 mb-6">
            <p className="text-[12px] text-[#999] leading-relaxed">
              Obtém 21 pontos por escreveres uma consulta na barra de pesquisa, ou 0 ponto por tocares numa pesquisa sugerida, como em "Podes gostar".
            </p>
          </div>
        </div>

        {/* ─── Convide amigos ─── */}
        <div className="px-1 animate-fade-in" style={{ animationDelay: '560ms' }}>
          <div className="border-t-[1.5px] border-dashed border-[#ddd] mb-5" />
          <div className="flex items-start justify-between mb-6">
            <p className="text-[16px] font-bold leading-snug" style={{ color: TT_BLACK }}>
              Convide 1 amigo para se inscrever e ganhar{" "}
              <span style={{ color: TT_RED }}>100.000 pontos - 200.000 pontos</span>
            </p>
            <span className="rounded-full bg-[#f0f0f0] px-4 py-1.5 text-[13px] font-medium text-[#b0b0b0] shrink-0 ml-3">
              Concluído
            </span>
          </div>
        </div>
      </div>

      {/* Modal Gol de Prêmios */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
          <div className="w-full max-w-[320px] rounded-3xl bg-[#fffdf5] pt-16 pb-6 px-6 text-center shadow-2xl animate-scale-in relative">
            <div className="absolute -top-14 left-1/2 -translate-x-1/2">
              <img src={goldenBallImg} alt="Bola dourada" className="h-[100px] w-[100px] object-contain drop-shadow-lg" loading="lazy" decoding="async" />
            </div>

            <h3 className="text-[20px] font-extrabold mb-2" style={{ color: TT_BLACK }}>Gol de Prêmios</h3>
            <p className="text-[13px] text-[#666] mb-5 leading-relaxed">
              Parabéns! Como parte de uma campanha de recompensas exclusiva.
            </p>

            <p className="text-[36px] font-extrabold tracking-tight mb-5" style={{ color: TT_BLACK }}>
              R$ {formatBRL(TARGET)}
            </p>

            <div className="flex items-center justify-center gap-2 mb-5">
              <span className="text-[13px] text-[#999]">Expira em</span>
              <div className="flex items-center gap-1">
                <span className="inline-flex items-center justify-center w-[32px] h-[30px] rounded-md border border-[#e0e0e0] bg-white text-[14px] font-bold" style={{ color: TT_BLACK }}>{pad(hours)}</span>
                <span className="text-[14px] font-bold" style={{ color: TT_BLACK }}>:</span>
                <span className="inline-flex items-center justify-center w-[32px] h-[30px] rounded-md border border-[#e0e0e0] bg-white text-[14px] font-bold" style={{ color: TT_BLACK }}>{pad(mins)}</span>
                <span className="text-[14px] font-bold" style={{ color: TT_BLACK }}>:</span>
                <span className="inline-flex items-center justify-center w-[32px] h-[30px] rounded-md border border-[#e0e0e0] bg-white text-[14px] font-bold" style={{ color: TT_BLACK }}>{pad(secs)}</span>
              </div>
            </div>

            <div className="border-t border-dashed border-[#ddd] mb-5" />

            <Button
              onClick={() => setShowModal(false)}
              className="w-full h-[50px] rounded-full text-[16px] font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
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
