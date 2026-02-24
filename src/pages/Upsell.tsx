import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Zap, Calendar, CreditCard, ArrowRight, Clock, X } from "lucide-react";
import tiktokLogo from "@/assets/tiktok-logo.png";
import { trackTikTokEvent } from "@/lib/tiktok-tracking";

const FONT = "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif";
const UPSELL_TAX = 28.74;

const Upsell = () => {
  const [selected, setSelected] = useState<"antecipar" | "aguardar">("antecipar");
  const [countdown, setCountdown] = useState(4 * 60);
  const navigate = useNavigate();

  useEffect(() => {
    trackTikTokEvent({ event: "ViewContent", properties: { page: "upsell1", content_type: "upsell" } });
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
    // TODO: navigate to upsell payment page
    navigate("/pagamento");
  };

  const handleAguardar = () => {
    // TODO: navigate to next upsell or thank you page
    navigate("/pagamento");
  };

  return (
    <div style={{ fontFamily: FONT, background: "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ width: "100%", background: "#fff", padding: "16px 0", borderBottom: "1px solid #e8e8e8", display: "flex", justifyContent: "center", alignItems: "center", position: "sticky", top: 0, zIndex: 100 }}>
        <img src={tiktokLogo} alt="TikTok" style={{ height: 24 }} loading="lazy" decoding="async" />
      </div>

      {/* Container */}
      <div style={{ maxWidth: 428, margin: "0 auto", padding: 20, flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", width: "100%" }}>
        <div style={{ background: "#fff", borderRadius: 20, padding: "28px 24px", boxShadow: "0 8px 32px rgba(0,0,0,0.12)", border: "1px solid #f0f0f0", textAlign: "center" }}>

          {/* Status icon */}
          <div style={{ width: 64, height: 64, background: "linear-gradient(135deg, #00c853, #00e676)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <Check size={28} color="#fff" strokeWidth={3} />
          </div>

          <h1 style={{ color: "#000", fontSize: 22, fontWeight: 700, marginBottom: 12, letterSpacing: "-0.3px" }}>
            Saque Solicitado!
          </h1>
          <p style={{ fontSize: 15, color: "#666", lineHeight: 1.5, marginBottom: 24 }}>
            Saque solicitado com sucesso! Seu saque será enviado em <strong style={{ color: "#000", fontWeight: 600 }}>30 dias</strong> para a chave Pix cadastrada.
          </p>

          {/* Escolha */}
          <div style={{ background: "#f8f9fa", borderRadius: 16, padding: 20, margin: "20px 0", border: "1px solid #e8e8e8" }}>
            <p style={{ fontSize: 16, fontWeight: 600, color: "#000", marginBottom: 16, textAlign: "center" }}>
              Como deseja receber?
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {/* Opção Antecipar */}
              <button
                onClick={() => setSelected("antecipar")}
                style={{
                  padding: "20px 16px",
                  borderRadius: 12,
                  textAlign: "left",
                  background: selected === "antecipar" ? "#fff9fa" : "#fff",
                  border: selected === "antecipar" ? "2px solid #ff0050" : "2px solid #e8e8e8",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  fontFamily: FONT,
                  transition: "all 0.2s",
                }}
              >
                <div style={{
                  width: 40, height: 40,
                  background: selected === "antecipar" ? "#ff0050" : "#e8e8e8",
                  borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <Zap size={18} color={selected === "antecipar" ? "#fff" : "#666"} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: "#333" }}>Receber Agora</span>
                    <span style={{ background: "#ff0050", color: "#fff", padding: "4px 8px", borderRadius: 6, fontSize: 10, fontWeight: 700, marginLeft: 8 }}>RECOMENDADO</span>
                  </div>
                  <p style={{ fontSize: 13, color: "#666", lineHeight: 1.4, marginBottom: 8 }}>
                    Antecipe seu saque e receba imediatamente via Pix
                  </p>
                  <p style={{ fontSize: 18, fontWeight: 800, color: "#ff0050", margin: "8px 0 0" }}>
                    Taxa: R$ {UPSELL_TAX.toFixed(2).replace(".", ",")}
                  </p>
                  <ul style={{ marginTop: 12, padding: 0, listStyle: "none" }}>
                    <li style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, fontSize: 12, color: "#555" }}>
                      <Check size={12} color="#00c853" /> Dinheiro na conta em segundos
                    </li>
                    <li style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#555" }}>
                      <Check size={12} color="#00c853" /> Prioridade em campanhas TikTok
                    </li>
                  </ul>
                </div>
              </button>

              {/* Opção Aguardar */}
              <button
                onClick={() => setSelected("aguardar")}
                style={{
                  padding: "20px 16px",
                  borderRadius: 12,
                  textAlign: "left",
                  background: selected === "aguardar" ? "#fff9fa" : "#fff",
                  border: selected === "aguardar" ? "2px solid #ff0050" : "2px solid #e8e8e8",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  fontFamily: FONT,
                  transition: "all 0.2s",
                }}
              >
                <div style={{
                  width: 40, height: 40,
                  background: selected === "aguardar" ? "#ff0050" : "#e8e8e8",
                  borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <Calendar size={18} color={selected === "aguardar" ? "#fff" : "#666"} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ marginBottom: 8 }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: "#333" }}>Aguardar 30 Dias</span>
                  </div>
                  <p style={{ fontSize: 13, color: "#666", lineHeight: 1.4, marginBottom: 8 }}>
                    Processamento padrão sem taxa adicional
                  </p>
                  <ul style={{ marginTop: 12, padding: 0, listStyle: "none" }}>
                    <li style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, fontSize: 12, color: "#555" }}>
                      <X size={12} color="#ff4444" /> 30 dias de espera pelo dinheiro
                    </li>
                    <li style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#555" }}>
                      <X size={12} color="#ff4444" /> Sem acesso ao valor por 1 mês
                    </li>
                  </ul>
                </div>
              </button>
            </div>
          </div>

          {/* CTA Buttons */}
          {selected === "antecipar" ? (
            <button
              onClick={handleAntecipar}
              style={{
                width: "100%",
                border: 0,
                borderRadius: 14,
                padding: "18px 24px",
                fontSize: 16,
                fontWeight: 700,
                cursor: "pointer",
                color: "#fff",
                background: "linear-gradient(135deg, #ff0050 0%, #ff2a6d 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                boxShadow: "0 6px 20px rgba(255,0,80,0.3)",
                margin: "20px 0 16px",
                fontFamily: FONT,
              }}
            >
              <CreditCard size={18} />
              QUERO RECEBER AGORA - R$ {UPSELL_TAX.toFixed(2).replace(".", ",")}
            </button>
          ) : (
            <button
              onClick={handleAguardar}
              style={{
                width: "100%",
                border: "2px solid #e8e8e8",
                borderRadius: 14,
                padding: "16px 24px",
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
                color: "#666",
                background: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                margin: "20px 0 16px",
                fontFamily: FONT,
              }}
            >
              <ArrowRight size={18} />
              CONTINUAR - AGUARDAR 30 DIAS
            </button>
          )}

          {/* Timer */}
          <div style={{ textAlign: "center", fontSize: 13, color: "#666", fontWeight: 500, background: "#f8f9fa", padding: 10, borderRadius: 8, border: "1px solid #e8e8e8", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <Clock size={14} />
            Oferta disponível por: <span style={{ color: "#ff0050", fontWeight: 700 }}>{mins}:{secs}</span>
          </div>

          {/* Footer */}
          <p style={{ textAlign: "center", fontSize: 12, color: "#888", marginTop: 16, lineHeight: 1.4 }}>
            Escolha opcional. Caso não antecipe, seu saque será processado normalmente em 30 dias úteis.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Upsell;
