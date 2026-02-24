import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Coins, Wallet, Clock, Check, Undo2, Zap, Shield } from "lucide-react";
import tiktokLogo from "@/assets/tiktok-logo.png";
import { trackTikTokEvent } from "@/lib/tiktok-tracking";

const FONT = "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif";
const RED = "#FE2B54";
const GREEN = "#10B981";
const UPSELL3_TAX = 26.48;
const CASHBACK = 647.79;

const Upsell3 = () => {
  const [countdown, setCountdown] = useState(6 * 60);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    trackTikTokEvent({ event: "ViewContent", properties: { page: "upsell3", content_type: "cashback" } });
    requestAnimationFrame(() => setVisible(true));
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

  const fadeUp = (delay: number): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(20px)",
    transition: `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
  });

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
        background: RED, color: "#fff", textAlign: "center",
        padding: "10px 16px", fontWeight: 700, fontSize: 12,
        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        boxShadow: `0 2px 12px rgba(254,43,84,0.2)`,
      }}>
        <Zap size={14} style={{ animation: "zapFlash 2s ease-in-out infinite" }} />
        RECEBA SALDO + TAXAS DE VOLTA
      </div>

      {/* Container */}
      <div style={{ maxWidth: 449, margin: "0 auto", width: "100%", padding: "16px 12px 110px" }}>

        {/* Hero Card */}
        <div style={{
          ...fadeUp(0.05),
          background: "#fff", borderRadius: 16, padding: "28px 20px 24px",
          boxShadow: "0 2px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)",
          textAlign: "center",
        }}>
          <div style={{
            ...fadeUp(0.1),
            width: 56, height: 56, background: GREEN,
            borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px",
            boxShadow: `0 4px 20px rgba(16,185,129,0.3), 0 0 0 6px rgba(16,185,129,0.08)`,
            animation: "softPulse 2.5s ease-in-out infinite",
          }}>
            <Coins size={24} color="#fff" />
          </div>

          <h1 style={{ ...fadeUp(0.15), color: "#000", fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
            Receba o Valor Completo
          </h1>
          <p style={{ ...fadeUp(0.2), fontSize: 13, color: "#666", lineHeight: 1.6, maxWidth: 300, margin: "0 auto" }}>
            Pague apenas <strong style={{ color: "#000", fontWeight: 600 }}>9%</strong> das taxas
            e receba{" "}
            <strong style={{ color: RED, fontWeight: 700 }}>
              R$ {CASHBACK.toFixed(2).replace(".", ",")}
            </strong>{" "}
            na sua conta!
          </p>
        </div>

        {/* Cashback Card */}
        <div style={{
          ...fadeUp(0.25),
          background: "#fff", borderRadius: 16, padding: "22px 20px",
          marginTop: 12,
          boxShadow: "0 2px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)",
        }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: RED, color: "#fff",
            padding: "5px 12px", borderRadius: 99,
            fontSize: 10, fontWeight: 700, marginBottom: 16,
            boxShadow: `0 3px 10px rgba(254,43,84,0.2)`,
          }}>
            <Undo2 size={11} />
            VALOR TOTAL A RECEBER
          </div>

          {/* Highlight Box */}
          <div style={{
            background: "#FFF0F3", borderRadius: 12, padding: "16px 14px",
            margin: "0 0 16px", border: `1px solid rgba(254,43,84,0.1)`,
            textAlign: "center",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
          }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#000", marginBottom: 4 }}>Você vai receber:</p>
            <p style={{ fontSize: 24, fontWeight: 800, color: RED, margin: "4px 0", animation: "countPulse 3s ease-in-out infinite" }}>
              R$ {CASHBACK.toFixed(2).replace(".", ",")}
            </p>
            <p style={{ fontSize: 11, color: "#848286" }}>Pagando apenas 9% das taxas</p>
          </div>

          {/* 9% pill */}
          <div style={{
            ...fadeUp(0.3),
            display: "flex", alignItems: "center", gap: 8,
            background: "#F8F9FB", padding: "10px 14px", borderRadius: 10,
            marginBottom: 16,
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8), 0 1px 3px rgba(0,0,0,0.03)",
          }}>
            <span style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              background: RED, color: "#fff",
              width: 26, height: 26, borderRadius: "50%",
              fontSize: 9, fontWeight: 800,
              boxShadow: `0 2px 6px rgba(254,43,84,0.2)`,
            }}>9%</span>
            <span style={{ fontSize: 12, color: "#666", lineHeight: 1.4 }}>
              Pequena taxa para liberar seu saldo completo + todas as taxas de volta.
            </span>
          </div>

          {/* Fee Section */}
          <div style={{
            ...fadeUp(0.35),
            background: "#F8F9FB", borderRadius: 12, padding: "14px",
            marginBottom: 16, textAlign: "center",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8), 0 1px 3px rgba(0,0,0,0.03)",
          }}>
            <p style={{ fontSize: 12, color: "#848286", marginBottom: 4 }}>Valor a pagar agora:</p>
            <p style={{ fontSize: 18, fontWeight: 800, color: RED, marginBottom: 4 }}>
              R$ {UPSELL3_TAX.toFixed(2).replace(".", ",")}
            </p>
            <p style={{ fontSize: 11, color: "#aaa" }}>
              Único pagamento para receber R$ {CASHBACK.toFixed(2).replace(".", ",")}
            </p>
          </div>

          {/* CTA */}
          <button
            onClick={handlePagar}
            style={{
              width: "100%", border: 0, borderRadius: 99,
              padding: "17px 16px", fontSize: 15, fontWeight: 700,
              cursor: "pointer", color: "#fff", background: GREEN,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              boxShadow: `0 6px 24px rgba(16,185,129,0.3), 0 2px 6px rgba(16,185,129,0.15), inset 0 1px 0 rgba(255,255,255,0.15)`,
              fontFamily: FONT, letterSpacing: "0.2px",
              transition: "transform 0.15s ease",
              animation: "ctaGlowGreen 2s ease-in-out infinite",
            }}
            onMouseDown={e => (e.currentTarget.style.transform = "scale(0.97)")}
            onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
          >
            <Wallet size={17} />
            RECEBER R$ {CASHBACK.toFixed(2).replace(".", ",")} AGORA
          </button>
        </div>

        {/* Timer + Security */}
        <div style={{
          ...fadeUp(0.4),
          background: "#fff", borderRadius: 12, padding: "14px 16px",
          marginTop: 12, boxShadow: "0 1px 12px rgba(0,0,0,0.04)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 500, color: "#848286" }}>
            <Clock size={13} />
            Oferta disponível por:{" "}
            <span style={{ color: RED, fontWeight: 700, fontSize: 13, background: "rgba(254,43,84,0.06)", padding: "2px 8px", borderRadius: 6 }}>
              {mins}:{secs}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#aaa", fontWeight: 500 }}>
            <Shield size={11} color={GREEN} />
            Pagamento 100% seguro e protegido
          </div>
        </div>

        <p style={{ ...fadeUp(0.45), textAlign: "center", fontSize: 11, color: "#aaa", marginTop: 14, lineHeight: 1.5, padding: "0 8px" }}>
          Última oportunidade de receber o valor completo com todas as taxas de volta.
        </p>
      </div>

      <style>{`
        @keyframes softPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.06); }
        }
        @keyframes zapFlash {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; transform: scale(1.15); }
        }
        @keyframes countPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
        @keyframes ctaGlowGreen {
          0%, 100% { box-shadow: 0 6px 24px rgba(16,185,129,0.3), 0 2px 6px rgba(16,185,129,0.15), inset 0 1px 0 rgba(255,255,255,0.15); }
          50% { box-shadow: 0 8px 32px rgba(16,185,129,0.4), 0 4px 12px rgba(16,185,129,0.2), inset 0 1px 0 rgba(255,255,255,0.15); }
        }
      `}</style>
    </div>
  );
};

export default Upsell3;
