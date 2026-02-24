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
    <div className="flex min-h-screen flex-col bg-black overflow-hidden relative">
      {/* Ambient glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-secondary/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="px-5 py-8 space-y-6 max-w-md mx-auto w-full relative z-10">
        {/* TikTok logo */}
        <div className="flex justify-center animate-fade-in">
          <img src={tiktokLogo} alt="TikTok" className="h-9 brightness-0 invert" />
        </div>

        {/* Headline */}
        <div className="text-center space-y-3 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <h1 className="text-[26px] font-extrabold text-white leading-tight tracking-tight">
            ESPERE! Não Vá<br />Embora Ainda…
          </h1>
          <p className="text-[15px] font-semibold text-secondary leading-snug">
            Você foi uma das{" "}
            <span className="bg-primary text-white px-2.5 py-0.5 rounded-md font-black text-base inline-block transform scale-105">
              1000
            </span>{" "}
            pessoas selecionadas{" "}
            <span className="font-extrabold text-white">para um desconto EXCLUSIVO!</span>
          </p>
        </div>

        {/* Price card */}
        <div
          className="rounded-3xl p-[1px] bg-gradient-to-br from-secondary via-secondary/40 to-primary/40 animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="rounded-3xl bg-black/90 backdrop-blur-sm p-6 text-center space-y-2">
            <p className="text-sm text-muted-foreground line-through">
              De R$ {PRECO_ORIGINAL.toFixed(2).replace(".", ",")}
            </p>
            <p className="text-xl font-extrabold text-white leading-tight">
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
          <div className="rounded-2xl border border-border bg-card p-4 flex items-start gap-3">
            <div className="h-9 w-9 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
              <Shield className="h-4 w-4 text-secondary" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Sua Segurança Garantida</p>
              <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                A Taxa Anti-Fraude é essencial para verificar sua identidade e proteger sua conta. Um pequeno valor para sua tranquilidade.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 flex items-start gap-3">
            <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Oferta Por Tempo Limitado</p>
              <p className="text-xs text-muted-foreground leading-relaxed mt-1">
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
          <p className="text-sm font-bold text-white">
            Milhares já aproveitaram este benefício hoje!
          </p>
          <p className="text-xs text-muted-foreground italic">
            Não deixe essa chance escapar e finalize sua experiência com economia.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BackRedirect;
