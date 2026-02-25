import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Zap, Calendar, CreditCard, ArrowRight, Clock, X, Shield } from "lucide-react";
import tiktokLogo from "@/assets/tiktok-logo.png";
import { trackTikTokEvent } from "@/lib/tiktok-tracking";

const FONT = "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif";
const RED = "#FE2B54";
const GREEN = "#10B981";
const UPSELL_TAX = 28.74;

const Upsell = () => {
  const [selected, setSelected] = useState<"antecipar" | "aguardar">("antecipar");
  const [countdown, setCountdown] = useState(4 * 60);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    trackTikTokEvent({ event: "ViewContent", properties: { page: "upsell1", content_type: "upsell" } });
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

  const handleAntecipar = () => {
    trackTikTokEvent({ event: "InitiateCheckout", properties: { page: "upsell1", value: UPSELL_TAX } });
    navigate("/pagamento");
  };

  const handleAguardar = () => {
    navigate("/pagamento");
  };

  const fadeUp = (delay: number): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(20px)",
    transition: `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
  });

  return (
    <div style={{ fontFamily: FONT, background: "#F5F5F5", minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{
        width: "100%", background: "#fff", padding: "14px 0",
        borderBottom: "1px solid #eee",
        display: "flex", justifyContent: "center", alignItems: "center",
        position: "sticky", top: 0, zIndex: 100,
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}>
        <img src={tiktokLogo} alt="TikTok" style={{ height: 22 }} loading="eager" decoding="async" />
      </div>

      {/* Container */}
      <div style={{ maxWidth: 449, margin: "0 auto", padding: "16px 12px 110px", flex: 1, width: "100%" }}>

        {/* Main Card */}
        <div style={{
          ...fadeUp(0.05),
          background: "#fff", borderRadius: 16, padding: "28px 20px 24px",
          boxShadow: "0 2px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)",
          textAlign: "center",
        }}>
          {/* Status icon with glow + pulse */}
          <div style={{
            ...fadeUp(0.1),
            width: 60, height: 60,
            background: GREEN,
            borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 18px",
            boxShadow: `0 4px 20px rgba(16,185,129,0.3), 0 0 0 6px rgba(16,185,129,0.08)`,
            animation: "softPulse 2.5s ease-in-out infinite",
          }}>
            <Check size={28} color="#fff" strokeWidth={3} />
          </div>

          <h1 style={{ ...fadeUp(0.15), color: "#000", fontSize: 20, fontWeight: 700, marginBottom: 8, letterSpacing: "-0.2px" }}>
            Saque Solicitado com Sucesso!
          </h1>
          <p style={{ ...fadeUp(0.2), fontSize: 13, color: "#666", lineHeight: 1.6, marginBottom: 0, maxWidth: 320, marginLeft: "auto", marginRight: "auto" }}>
            Seu saque será enviado em{" "}
            <strong style={{ color: "#000", fontWeight: 600 }}>30 dias úteis</strong>{" "}
            para a chave Pix cadastrada.
          </p>
        </div>

        {/* Escolha Card */}
        <div style={{
          ...fadeUp(0.25),
          background: "#fff", borderRadius: 16, padding: "22px 16px",
          marginTop: 12,
          boxShadow: "0 2px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)",
        }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: "#000", marginBottom: 14, textAlign: "center" }}>
            Como deseja receber?
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {/* Opção Antecipar */}
            <button
              onClick={() => setSelected("antecipar")}
              style={{
                ...fadeUp(0.3),
                padding: "16px 14px", borderRadius: 12,
                textAlign: "left" as const,
                background: selected === "antecipar" ? "#FFF0F3" : "#FAFAFA",
                border: selected === "antecipar" ? `2px solid ${RED}` : "2px solid #F1F1F3",
                cursor: "pointer", display: "flex", alignItems: "flex-start", gap: 12,
                fontFamily: FONT,
                transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
                boxShadow: selected === "antecipar"
                  ? `0 4px 16px rgba(254,43,84,0.12), inset 0 1px 0 rgba(255,255,255,0.6)`
                  : "0 1px 4px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.8)",
              }}
            >
              <div style={{
                width: 40, height: 40,
                background: selected === "antecipar" ? RED : "#F1F1F3",
                borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                boxShadow: selected === "antecipar" ? `0 3px 10px rgba(254,43,84,0.25)` : "none",
                transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
              }}>
                <Zap size={17} color={selected === "antecipar" ? "#fff" : "#999"} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", marginBottom: 6, flexWrap: "wrap", gap: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#000" }}>Receber Agora</span>
                  <span style={{
                    background: RED, color: "#fff", padding: "2px 8px", borderRadius: 99,
                    fontSize: 9, fontWeight: 700, letterSpacing: "0.3px",
                    boxShadow: `0 2px 6px rgba(254,43,84,0.2)`,
                    animation: "badgePulse 2s ease-in-out infinite",
                  }}>RECOMENDADO</span>
                </div>
                <p style={{ fontSize: 12, color: "#848286", lineHeight: 1.5, marginBottom: 8 }}>
                  Antecipe e receba imediatamente via Pix
                </p>
                <p style={{ fontSize: 17, fontWeight: 800, color: RED, margin: 0 }}>
                  R$ {UPSELL_TAX.toFixed(2).replace(".", ",")}
                </p>
                <ul style={{ marginTop: 10, padding: 0, listStyle: "none" }}>
                  <li style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5, fontSize: 11, color: "#555" }}>
                    <Check size={11} color={GREEN} /> Dinheiro na conta em segundos
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#555" }}>
                    <Check size={11} color={GREEN} /> Prioridade em campanhas
                  </li>
                </ul>
              </div>
            </button>

            {/* Opção Aguardar */}
            <button
              onClick={() => setSelected("aguardar")}
              style={{
                ...fadeUp(0.35),
                padding: "16px 14px", borderRadius: 12,
                textAlign: "left" as const,
                background: selected === "aguardar" ? "#FFF0F3" : "#FAFAFA",
                border: selected === "aguardar" ? `2px solid ${RED}` : "2px solid #F1F1F3",
                cursor: "pointer", display: "flex", alignItems: "flex-start", gap: 12,
                fontFamily: FONT,
                transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
                boxShadow: selected === "aguardar"
                  ? `0 4px 16px rgba(254,43,84,0.12), inset 0 1px 0 rgba(255,255,255,0.6)`
                  : "0 1px 4px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.8)",
              }}
            >
              <div style={{
                width: 40, height: 40,
                background: selected === "aguardar" ? RED : "#F1F1F3",
                borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                boxShadow: selected === "aguardar" ? `0 3px 10px rgba(254,43,84,0.25)` : "none",
                transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
              }}>
                <Calendar size={17} color={selected === "aguardar" ? "#fff" : "#999"} />
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#000", display: "block", marginBottom: 6 }}>
                  Aguardar 30 Dias
                </span>
                <p style={{ fontSize: 12, color: "#848286", lineHeight: 1.5, marginBottom: 8 }}>
                  Processamento padrão sem taxa
                </p>
                <ul style={{ marginTop: 6, padding: 0, listStyle: "none" }}>
                  <li style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5, fontSize: 11, color: "#888" }}>
                    <X size={11} color="#ccc" /> Espera de 30 dias úteis
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#888" }}>
                    <X size={11} color="#ccc" /> Sem acesso ao valor imediato
                  </li>
                </ul>
              </div>
            </button>
          </div>
        </div>

        {/* CTA Section */}
        <div style={{ ...fadeUp(0.4), marginTop: 12 }}>
          {selected === "antecipar" ? (
            <button
              onClick={handleAntecipar}
              className="cta-pulse"
              style={{
                width: "100%", border: 0, borderRadius: 99,
                padding: "17px 24px", fontSize: 15, fontWeight: 700,
                cursor: "pointer", color: "#fff", background: RED,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                boxShadow: `0 6px 24px rgba(254,43,84,0.3), 0 2px 6px rgba(254,43,84,0.15), inset 0 1px 0 rgba(255,255,255,0.15)`,
                fontFamily: FONT, letterSpacing: "0.2px",
                transition: "transform 0.15s ease, box-shadow 0.15s ease",
                animation: "ctaGlow 2s ease-in-out infinite",
              }}
              onMouseDown={e => (e.currentTarget.style.transform = "scale(0.97)")}
              onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
            >
              <CreditCard size={17} />
              RECEBER AGORA — R$ {UPSELL_TAX.toFixed(2).replace(".", ",")}
            </button>
          ) : (
            <button
              onClick={handleAguardar}
              style={{
                width: "100%", border: "2px solid #E8E8E8", borderRadius: 99,
                padding: "15px 24px", fontSize: 14, fontWeight: 600,
                cursor: "pointer", color: "#999", background: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                fontFamily: FONT, boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                transition: "transform 0.15s ease",
              }}
              onMouseDown={e => (e.currentTarget.style.transform = "scale(0.97)")}
              onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
            >
              <ArrowRight size={17} />
              AGUARDAR 30 DIAS
            </button>
          )}
        </div>

        {/* Timer + Security */}
        <div style={{
          ...fadeUp(0.45),
          background: "#fff", borderRadius: 12, padding: "14px 16px",
          marginTop: 12, boxShadow: "0 1px 12px rgba(0,0,0,0.04)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 12, fontWeight: 500, color: "#848286" }}>
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

        <p style={{ ...fadeUp(0.5), textAlign: "center", fontSize: 11, color: "#aaa", marginTop: 14, lineHeight: 1.5, padding: "0 8px" }}>
          Escolha opcional. Caso não antecipe, seu saque será processado normalmente em 30 dias úteis.
        </p>
      </div>

      <style>{`
        @keyframes softPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.06); }
        }
        @keyframes badgePulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        @keyframes ctaGlow {
          0%, 100% { box-shadow: 0 6px 24px rgba(254,43,84,0.3), 0 2px 6px rgba(254,43,84,0.15), inset 0 1px 0 rgba(255,255,255,0.15); }
          50% { box-shadow: 0 8px 32px rgba(254,43,84,0.4), 0 4px 12px rgba(254,43,84,0.2), inset 0 1px 0 rgba(255,255,255,0.15); }
        }
      `}</style>
    </div>
  );
};

export default Upsell;
