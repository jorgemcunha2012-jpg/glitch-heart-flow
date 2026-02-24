import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Sparkles, Timer } from "lucide-react";
import tiktokLogo from "@/assets/tiktok-logo.png";
import { useEffect, useState } from "react";

const PRECO_ORIGINAL = 21.34;
const PRECO_DESCONTO = 13.84;
const DESCONTO_PERCENT = 40;

const BackRedirect = () => {
  const navigate = useNavigate();
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse((p) => !p);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-white overflow-hidden relative">

      <div className="px-5 py-8 space-y-6 max-w-md mx-auto w-full relative z-10">
        {/* TikTok logo */}
        <div className="flex justify-center animate-fade-in">
          <img src={tiktokLogo} alt="TikTok" className="h-9" />
        </div>

        {/* Headline */}
        <div className="text-center space-y-3 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <h1 className="text-[26px] font-extrabold text-black leading-tight tracking-tight">
            ESPERE! Não Vá<br />Embora Ainda…
          </h1>
          <p className="text-[15px] font-semibold text-secondary leading-snug">
            Você foi uma das{" "}
            <span className="bg-primary text-white px-2.5 py-0.5 rounded-md font-black text-base inline-block transform scale-105">
              1000
            </span>{" "}
            pessoas selecionadas{" "}
            <span className="font-extrabold text-black">para um desconto EXCLUSIVO!</span>
          </p>
        </div>

        {/* Price card */}
        <div className="rounded-3xl border-2 border-secondary/30 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <div className="rounded-3xl bg-gradient-to-b from-secondary/5 to-secondary/10 p-6 text-center space-y-2">
            <p className="text-sm text-gray-400 line-through">
              De R$ {PRECO_ORIGINAL.toFixed(2).replace(".", ",")}
            </p>
            <p className="text-xl font-extrabold text-black leading-tight">
              Agora por<br />
              <span className="text-secondary">APENAS</span>
            </p>
            <p
              className={`text-5xl font-black text-primary leading-none transition-transform duration-300 ${pulse ? "scale-110" : "scale-100"}`}
            >
              R$ {PRECO_DESCONTO.toFixed(2).replace(".", ",")}
            </p>
            <div className="flex items-center justify-center gap-1.5 pt-1">
              <Timer className="h-3.5 w-3.5 text-secondary" />
              <p className="text-xs font-bold text-secondary">
                Aproveite {DESCONTO_PERCENT}% de Desconto Imediato!
              </p>
            </div>
          </div>
        </div>

        {/* Info cards */}
        <div className="space-y-3 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <div className="rounded-2xl border border-gray-200 bg-white p-4 flex items-start gap-3">
            <div className="h-9 w-9 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
              <Shield className="h-4 w-4 text-secondary" />
            </div>
            <div>
              <p className="text-sm font-bold text-black">Sua Segurança Garantida</p>
              <p className="text-xs text-gray-500 leading-relaxed mt-1">
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-4 flex items-start gap-3">
            <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold text-black">Oferta Por Tempo Limitado</p>
              <p className="text-xs text-gray-500 leading-relaxed mt-1">
                Os cupons com este super desconto são limitados. Garanta o seu antes que esta oportunidade exclusiva termine!
              </p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <Button
            onClick={() => navigate("/pagamento")}
            className="w-full h-16 rounded-2xl text-lg font-extrabold bg-primary hover:bg-primary/90 text-primary-foreground uppercase tracking-wide shadow-[0_0_30px_hsl(348,87%,52%,0.4)] hover:shadow-[0_0_40px_hsl(348,87%,52%,0.6)] transition-all duration-300"
          >
            QUERO MEU DESCONTO AGORA!
          </Button>
        </div>

        {/* Footer text */}
        <div className="text-center space-y-1 animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <p className="text-sm font-bold text-black">
            Milhares já aproveitaram este benefício hoje!
          </p>
          <p className="text-xs text-gray-400 italic">
            Não deixe essa chance escapar e finalize sua experiência com economia.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BackRedirect;
