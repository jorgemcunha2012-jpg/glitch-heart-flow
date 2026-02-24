import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Coins, Wallet, Clock, Check, Undo2, Zap } from "lucide-react";
import tiktokLogo from "@/assets/tiktok-logo.png";
import { trackTikTokEvent } from "@/lib/tiktok-tracking";

const FONT = "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif";
const UPSELL3_TAX = 26.48;
const CASHBACK = 647.79;

const Upsell3 = () => {
  const [countdown, setCountdown] = useState(6 * 60);
  const navigate = useNavigate();

  useEffect(() => {
    trackTikTokEvent({ event: "ViewContent", properties: { page: "upsell3", content_type: "cashback" } });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const mins = String(Math.floor(countdown / 60)).padStart(2, "0");
  const secs = String(countdown % 60).padStart(2, "0");

  const handlePagar = () => {
    trackTikTokEvent({ event: "InitiateCheckout", properties: { page: "upsell3", value: UPSELL3_TAX } });
    navigate("/pagamento");
  };

  return (
    <div style={{ fontFamily: FONT, background: "#fff", minHeight: "100vh", lineHeight: 1.4 }}>
      {/* Header */}
      <div style={{ width: "100%", background: "#fff", padding: "12px 0", borderBottom: "1px solid #f0f0f0", display: "flex", justifyContent: "center", position: "sticky", top: 0, zIndex: 100 }}>
        <img src={tiktokLogo} alt="TikTok" style={{ height: 20 }} loading="lazy" decoding="async" />
      </div>

      {/* Alert Banner */}
      <div style={{ background: "linear-gradient(90deg, #ff0050, #ff2a6d)", color: "#fff", textAlign: "center", padding: "10px 12px", fontWeight: 700, fontSize: 12, lineHeight: 1.3, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
        <Zap size={14} />
        RECEBA SALDO + TAXAS DE VOLTA
      </div>

      {/* Main Content */}
      <div style={{ padding: 16, maxWidth: 428, margin: "0 auto" }}>
        {/* Success Icon */}
        <div style={{ width: 60, height: 60, background: "linear-gradient(135deg, #00c853, #00e676)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
          <Coins size={24} color="#fff" />
        </div>

        <h1 style={{ color: "#000", fontSize: 20, fontWeight: 700, marginBottom: 8, textAlign: "center", letterSpacing: "-0.3px" }}>
          Receba Todo o Valor Completo
        </h1>

        <p style={{ fontSize: 14, color: "#666", lineHeight: 1.4, textAlign: "center", marginBottom: 16 }}>
          Pague apenas <strong style={{ color: "#000", fontWeight: 600 }}>9%</strong> das taxas e receba <strong style={{ color: "#000", fontWeight: 600 }}>R$ {CASHBACK.toFixed(2).replace(".", ",")}</strong> na sua conta!
        </p>

        {/* Cashback Card */}
        <div style={{ background: "#f8f9fa", borderRadius: 10, padding: 16, margin: "16px 0", border: "1px solid #e8e8e8" }}>
          {/* Badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#ff0050", color: "#fff", padding: "6px 10px", borderRadius: 14, fontSize: 11, fontWeight: 700, marginBottom: 12 }}>
            <Undo2 size={12} />
            VALOR TOTAL A RECEBER
          </div>

          {/* Highlight Box */}
          <div style={{ background: "#fff9fa", borderRadius: 8, padding: 12, margin: "12px 0", border: "1px solid #ffebee", textAlign: "center" }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: "#000", marginBottom: 4 }}>Você vai receber:</p>
            <p style={{ fontSize: 22, fontWeight: 800, color: "#ff0050", margin: "4px 0" }}>R$ {CASHBACK.toFixed(2).replace(".", ",")}</p>
            <p style={{ fontSize: 11, color: "#888" }}>Pagando apenas 9% das taxas</p>
          </div>

          {/* Simple message */}
          <p style={{ textAlign: "center", fontSize: 13, color: "#666", margin: "8px 0", lineHeight: 1.4, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, flexWrap: "wrap" }}>
            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", background: "#ff0050", color: "#fff", width: 24, height: 24, borderRadius: "50%", fontSize: 10, fontWeight: 700 }}>9%</span>
            Esta pequena taxa cobre os custos para liberar seu saldo completo + todas as taxas de volta.
          </p>

          {/* Fee Section */}
          <div style={{ background: "#fff", borderRadius: 8, padding: 10, margin: "12px 0", border: "1px solid #e8e8e8", textAlign: "center" }}>
            <p style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Valor a pagar agora:</p>
            <p style={{ fontSize: 16, fontWeight: 800, color: "#ff0050", marginBottom: 4 }}>R$ {UPSELL3_TAX.toFixed(2).replace(".", ",")}</p>
            <p style={{ fontSize: 11, color: "#888" }}>Único pagamento para receber R$ {CASHBACK.toFixed(2).replace(".", ",")}</p>
          </div>

          {/* CTA */}
          <button
            onClick={handlePagar}
            style={{
              width: "100%", border: 0, borderRadius: 10,
              padding: "14px 16px", fontSize: 14, fontWeight: 700,
              cursor: "pointer", color: "#fff",
              background: "linear-gradient(135deg, #00c853, #00e676)",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              boxShadow: "0 4px 12px rgba(0,200,83,0.3)",
              margin: "12px 0 8px", fontFamily: FONT,
            }}
          >
            <Wallet size={16} />
            RECEBER R$ {CASHBACK.toFixed(2).replace(".", ",")} AGORA
          </button>

          {/* Timer */}
          <div style={{ textAlign: "center", fontSize: 11, color: "#666", fontWeight: 500, background: "#f8f9fa", padding: 6, borderRadius: 6, border: "1px solid #e8e8e8", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
            <Clock size={12} />
            Oferta por: <span style={{ color: "#ff0050", fontWeight: 700 }}>{mins}:{secs}</span>
          </div>
        </div>

        {/* Footer */}
        <p style={{ textAlign: "center", fontSize: 10, color: "#888", marginTop: 8, lineHeight: 1.4 }}>
          Esta é sua última oportunidade de receber o valor completo com todas as taxas de volta.
        </p>
      </div>
    </div>
  );
};

export default Upsell3;
