import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Sparkles } from "lucide-react";
import tiktokLogo from "@/assets/tiktok-logo.png";

const PRECO_ORIGINAL = 21.34;
const PRECO_DESCONTO = 13.84;
const DESCONTO_PERCENT = 40;

const BackRedirect = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="px-6 py-8 space-y-6 max-w-md mx-auto w-full">
        {/* TikTok logo */}
        <div className="flex justify-center">
          <img src={tiktokLogo} alt="TikTok" className="h-10" />
        </div>

        {/* Headline */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-extrabold text-black leading-tight">
            ESPERE! Não Vá<br />Embora Ainda…
          </h1>
          <p className="text-base font-semibold text-[#69C9D0] leading-snug">
            Você foi uma das{" "}
            <span className="bg-black text-white px-2 py-0.5 rounded font-extrabold">1000</span>{" "}
            pessoas selecionadas{" "}
            <span className="font-extrabold">para um desconto EXCLUSIVO!</span>
          </p>
        </div>

        {/* Price card */}
        <div className="rounded-2xl border-2 border-[#69C9D0]/30 bg-gradient-to-b from-[#69C9D0]/5 to-[#69C9D0]/10 p-6 text-center space-y-1">
          <p className="text-sm text-gray-400 line-through">
            De R$ {PRECO_ORIGINAL.toFixed(2).replace(".", ",")}
          </p>
          <p className="text-xl font-extrabold text-black leading-tight">
            Agora por<br />APENAS
          </p>
          <p className="text-5xl font-extrabold text-[#EE1D52] leading-none">
            R$ {PRECO_DESCONTO.toFixed(2).replace(".", ",")}
          </p>
          <p className="text-sm font-semibold text-[#69C9D0]">
            Aproveite {DESCONTO_PERCENT}% de Desconto Imediato!
          </p>
        </div>

        {/* Info cards */}
        <div className="space-y-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-[#69C9D0]/10 flex items-center justify-center shrink-0 mt-0.5">
              <Shield className="h-4 w-4 text-[#69C9D0]" />
            </div>
            <div>
              <p className="text-sm font-bold text-black">Sua Segurança Garantida</p>
              <p className="text-xs text-gray-500 leading-relaxed mt-1">
                A Taxa Anti-Fraude é essencial para verificar sua identidade e proteger sua conta. Um pequeno valor para sua tranquilidade.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-4 flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-[#EE1D52]/10 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="h-4 w-4 text-[#EE1D52]" />
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
        <Button
          onClick={() => navigate("/pagamento")}
          className="w-full h-16 rounded-2xl text-lg font-extrabold bg-[#EE1D52] hover:bg-[#EE1D52]/90 text-white uppercase tracking-wide"
        >
          QUERO MEU DESCONTO AGORA!
        </Button>

        {/* Footer text */}
        <div className="text-center space-y-1">
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
