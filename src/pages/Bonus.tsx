import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import calendarCoinsImg from "@/assets/calendar-coins.png";
import pixLogoFull from "@/assets/pix-logo-full.png";
import coinIcon from "@/assets/coin-icon.png";
import goldenBallImg from "@/assets/golden-ball.png";

const TARGET = 3200.00;
const TT_RED = "#FE2B54";
const FONT = "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif";

const checkInValues = [50, 100, 150, 200, 250, 300];

const CoinImg = ({ size = 32 }: { size?: number }) => (
  <img src={coinIcon} alt="moeda" style={{ width: size, height: size }} className="object-contain" />
);

const CompletedBtn = () => (
  <button
    disabled
    style={{
      background: "#F1F1F3",
      borderRadius: 99,
      width: 89,
      height: 35,
      fontSize: 12,
      fontWeight: 500,
      color: "rgb(212,212,212)",
      border: "none",
      cursor: "default",
      flexShrink: 0,
    }}
  >
    Concluído
  </button>
);

const Divider = () => (
  <div style={{ height: 1, background: "#E2E8F0", margin: "12px 0" }} />
);

const Bonus = () => {
  const [value, setValue] = useState(0);
  const [showModal, setShowModal] = useState(true);
  const [countdown, setCountdown] = useState(16 * 60 + 3);
  const navigate = useNavigate();

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = TARGET / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= TARGET) {
        setValue(TARGET);
        clearInterval(interval);
      } else {
        setValue(current);
      }
    }, duration / steps);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!showModal) return;
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [showModal]);

  const hours = Math.floor(countdown / 3600);
  const mins = Math.floor((countdown % 3600) / 60);
  const secs = countdown % 60;
  const pad = (n: number) => String(n).padStart(2, "0");

  const formatBRL = (v: number) =>
    v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div style={{ background: "#F5F5F5", minHeight: "100vh", fontFamily: FONT }}>
      <div style={{ maxWidth: 450, margin: "0 auto", padding: "0 12px 110px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "14px 0" }}>
          <h1 style={{ fontSize: 16, fontWeight: 600, color: "#000000", margin: 0 }}>TikTok Bônus</h1>
        </div>

        {/* Card Saldo */}
        <div
          style={{
            background: "rgba(255,255,255,0.95)",
            borderRadius: 12,
            boxShadow: "rgba(0,0,0,0.03) 0px 1px 18.4px 0px",
            padding: "22px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxSizing: "border-box",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 16, fontWeight: 500, color: "#000" }}>Seu saldo</span>
              <CoinImg size={22} />
            </div>
            <p style={{ fontSize: 28, fontWeight: 700, color: "#000000", margin: "6px 0 0" }}>
              R$ {formatBRL(value)}
            </p>
          </div>
          <div style={{ position: "relative", display: "inline-block" }}>
            <button
              onClick={() => navigate("/pix")}
              style={{
                background: TT_RED,
                color: "#fff",
                border: "none",
                borderRadius: 99,
                width: 120,
                height: 38,
                fontSize: 16,
                fontWeight: 600,
                cursor: "pointer",
                position: "relative",
              }}
            >
              Sacar
            </button>
            <img
              src={pixLogoFull}
              alt="PIX"
              style={{
                position: "absolute",
                top: -8,
                right: -6,
                height: 16,
                objectFit: "contain",
                background: "#fff",
                borderRadius: 3,
                padding: "1px 2px",
              }}
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>

        {/* Bloco Parabéns */}
        <div
          style={{
            background: "#FFFFFF",
            padding: "24px 24px",
            borderRadius: 12,
            margin: "20px 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: "#000", margin: 0, lineHeight: 1.25 }}>
              Parabéns!
              <br />
              Você concluiu
              <br />
              todas as tarefas
            </h2>
            <p style={{ fontSize: 24, fontWeight: 700, color: TT_RED, margin: "8px 0 0" }}>
              R$ {formatBRL(TARGET)}
            </p>
          </div>
          <img
            src={calendarCoinsImg}
            alt="Calendário com moedas"
            style={{ width: 150, height: 150, objectFit: "contain", marginRight: -8, flexShrink: 0 }}
            loading="lazy"
            decoding="async"
          />
        </div>

        {/* ─── Tarefas (sem cards, separadores tracejados) ─── */}
        <div style={{ padding: "0 4px" }}>

          {/* Tarefa 1: Check-in */}
          <div style={{ borderTop: "1.5px dashed #ccc", paddingTop: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <p style={{ fontSize: 14, fontWeight: 500, color: "#000", margin: 0, lineHeight: 1.5 }}>
                Entre por 14 dias para ganhar{" "}
                <span style={{ color: TT_RED }}>8.414 pontos</span>
              </p>
              <CompletedBtn />
            </div>
            <p style={{ fontSize: 12, fontWeight: 400, color: "rgb(206,66,95)", margin: "8px 0 0" }}>
              • 12 de nov - 25 de nov
            </p>
            <p style={{ fontSize: 11, fontWeight: 500, color: "rgb(132,132,134)", margin: "10px 0 0" }}>
              Você concluiu todos os dias de check-in.
            </p>

            {/* Day Tracker */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, marginBottom: 20 }}>
              {checkInValues.map((pts, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{ position: "relative", width: 45, height: 45 }}>
                    <div
                      style={{
                        width: 45,
                        height: 45,
                        borderRadius: 8.82,
                        background: "#F8F9FB",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <CoinImg size={24} />
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: 8.82,
                        background: "rgba(255,240,243,0.9)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Check style={{ color: TT_RED }} size={18} strokeWidth={2.5} />
                    </div>
                  </div>
                  <span style={{ fontSize: 10, color: "#888" }}>Dia {String(i + 1).padStart(2, "0")}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tarefa 2: Anúncios */}
          <div style={{ borderTop: "1.5px dashed #ccc", paddingTop: 20, paddingBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <p style={{ fontSize: 14, fontWeight: 500, color: "#000", margin: 0, lineHeight: 1.5 }}>
                Vê anúncios direcionados diariamente para ganhares até{" "}
                <span style={{ color: TT_RED }}>2.730 pontos</span>
              </p>
              <CompletedBtn />
            </div>
            <p style={{ fontSize: 12, fontWeight: 400, color: "rgb(206,66,95)", margin: "8px 0 0" }}>
              • 30/30 anúncios assistidos
            </p>
          </div>

          {/* Tarefa 3: Assistir vídeos */}
          <div style={{ borderTop: "1.5px dashed #ccc", paddingTop: 20, paddingBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <p style={{ fontSize: 14, fontWeight: 500, color: "#000", margin: 0 }}>
                Assistir vídeos <span style={{ color: TT_RED }}>500 pontos</span>
              </p>
              <CompletedBtn />
            </div>
            <div
              style={{
                display: "inline-block",
                background: "#F1F1F1",
                borderRadius: 6,
                padding: "4px 12px",
                fontSize: 12,
                color: "#000",
                marginTop: 12,
              }}
            >
              Assista por 10 min
            </div>

            {/* Progress bar */}
            <div style={{ position: "relative", marginTop: 16, height: 50 }}>
              <div style={{ position: "absolute", top: 14, left: "8%", right: "8%", height: 2, background: "#e0e0e0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative" }}>
                {["50 pontos", "100 pontos", "150 pontos", "225 pontos"].map((label, i) => (
                  <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                    <CoinImg size={28} />
                    <span style={{ fontSize: 10, color: "#888" }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tarefa 4: Recompensas */}
          <div style={{ borderTop: "1.5px dashed #ccc", paddingTop: 20, paddingBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <p style={{ fontSize: 14, fontWeight: 500, color: "#000", margin: 0, lineHeight: 1.5 }}>
                Resgate suas recompensas e ganhe <span style={{ color: TT_RED }}>640 pontos</span>
              </p>
              <CompletedBtn />
            </div>
            <p style={{ fontSize: 12, fontWeight: 400, color: "rgb(206,66,95)", margin: "8px 0 0" }}>
              • 8/8 resgatados
            </p>
          </div>

          {/* Tarefa 5: Pesquisas */}
          <div style={{ borderTop: "1.5px dashed #ccc", paddingTop: 20, paddingBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <p style={{ fontSize: 14, fontWeight: 500, color: "#000", margin: 0, lineHeight: 1.5 }}>
                Faça 60 pesquisas diárias para ganhar até <span style={{ color: TT_RED }}>996 pontos</span>
              </p>
              <CompletedBtn />
            </div>
            <p style={{ fontSize: 12, fontWeight: 400, color: "rgb(206,66,95)", margin: "8px 0 0" }}>
              • 60 pesquisas feitas hoje
            </p>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#F1F1F1",
                borderRadius: 99,
                height: 19,
                padding: "0 12px",
                fontSize: 11,
                fontWeight: 500,
                color: "#888",
                marginTop: 10,
              }}
            >
              Até 756 pontos
            </div>

            <div style={{ position: "relative", marginTop: 16, height: 50 }}>
              <div style={{ position: "absolute", top: 14, left: "12%", right: "12%", height: 2, background: "#e0e0e0" }} />
              <div style={{ display: "flex", justifyContent: "space-around", position: "relative" }}>
                {["16 pesquisas", "36 pesquisas", "60 pesquisas"].map((label, i) => (
                  <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                    <CoinImg size={28} />
                    <span style={{ fontSize: 10, color: "#888" }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <p style={{ fontSize: 12, color: "#999", lineHeight: 1.6, marginTop: 14 }}>
              Obtém 21 pontos por escreveres uma consulta na barra de pesquisa, ou 0 ponto por tocares numa pesquisa sugerida, como em "Podes gostar".
            </p>
          </div>

          {/* Tarefa 6: Convite */}
          <div style={{ borderTop: "1.5px dashed #ccc", paddingTop: 20, paddingBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <p style={{ fontSize: 14, fontWeight: 500, color: "#000", margin: 0, lineHeight: 1.5 }}>
                Convide 1 amigo para se inscrever e ganhar{" "}
                <span style={{ color: TT_RED }}>100.000 pontos - 200.000 pontos</span>
              </p>
              <CompletedBtn />
            </div>
          </div>
        </div>
      </div>

      {/* ─── Modal Gol de Prêmios ─── */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "linear-gradient(180deg, #fff8e1 0%, #fffdf5 50%, #FFFFFF 85%)",
              borderRadius: 11,
              padding: "14px 16px 16px",
              width: "calc(100% - 100px)",
              maxWidth: 258,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              position: "relative",
              paddingTop: 41,
            }}
          >
            <div style={{ position: "absolute", top: -37, left: "50%", transform: "translateX(-50%)" }}>
              <img src={goldenBallImg} alt="Bola dourada" style={{ width: 102, height: 102, objectFit: "contain" }} loading="lazy" decoding="async" />
            </div>

            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#000", margin: "0 0 5px" }}>Gol de Prêmios</h3>
            <p style={{ fontSize: 9, fontWeight: 500, color: "rgb(64,63,58)", margin: "0 0 11px", lineHeight: 1.5 }}>
              Parabéns! Como parte de uma campanha de recompensas exclusiva.
            </p>

            <p style={{ fontSize: 25, fontWeight: 700, color: "#000", margin: "0 0 11px" }}>
              R$ {formatBRL(TARGET)}
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 14 }}>
              <span style={{ fontSize: 7, fontWeight: 500, color: "rgb(64,63,58)" }}>Expira em</span>
              <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                {[pad(hours), pad(mins), pad(secs)].map((digit, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 14,
                        height: 15,
                        background: "#F1F1F3",
                        borderRadius: 2,
                        fontSize: 7,
                        fontWeight: 600,
                        color: "#020817",
                      }}
                    >
                      {digit}
                    </span>
                    {i < 2 && <span style={{ fontSize: 7, fontWeight: 600, color: "#020817" }}>:</span>}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowModal(false)}
              style={{
                width: 184,
                height: 36,
                background: TT_RED,
                color: "#fff",
                border: "none",
                borderRadius: 99,
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Obrigado
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bonus;
