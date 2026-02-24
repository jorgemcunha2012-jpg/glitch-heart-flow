import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import tiktokLogo from "@/assets/tiktok-logo.png";
import { supabase } from "@/integrations/supabase/client";

// Confetti piece component
const CONFETTI_COLORS = ["#EE1D52", "#69C9D0", "#FFD700", "#FF6B6B", "#4ECDC4", "#A78BFA", "#F97316"];

interface ConfettiPiece {
  id: number;
  left: number;
  delay: number;
  duration: number;
  color: string;
  size: number;
  rotation: number;
  shape: "square" | "rect" | "circle";
}

const generateConfetti = (count: number): ConfettiPiece[] =>
  Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 3,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    size: 4 + Math.random() * 8,
    rotation: Math.random() * 360,
    shape: (["square", "rect", "circle"] as const)[Math.floor(Math.random() * 3)],
  }));

const Landing = () => {
  const [username, setUsername] = useState("");
  const [step, setStep] = useState<"idle" | "verifying" | "success">("idle");
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const navigate = useNavigate();

  const preloadImage = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(url);
      img.onerror = () => reject();
      img.src = url;
    });
  };

  const handleVerify = async () => {
    if (!username.trim()) return;
    setStep("verifying");

    const cleanUsername = username.trim().replace(/^@/, '');
    localStorage.setItem("tiktok_username", cleanUsername);

    try {
      const { data } = await supabase.functions.invoke('tiktok-avatar', {
        body: { username: cleanUsername },
      });
      if (data?.success && data?.avatarUrl) {
        // Preload image so it's ready before showing success
        await preloadImage(data.avatarUrl);
        setAvatarUrl(data.avatarUrl);
        localStorage.setItem("tiktok_avatar", data.avatarUrl);
      }
    } catch (err) {
      console.log('Avatar fetch failed, using fallback', err);
    }

    setStep("success");
    setConfetti(generateConfetti(60));
  };

  // Clear confetti after 5s
  useEffect(() => {
    if (step === "success" && confetti.length > 0) {
      const timer = setTimeout(() => setConfetti([]), 5000);
      return () => clearTimeout(timer);
    }
  }, [step, confetti.length]);

  // Get initial letter for avatar
  const initial = username.trim() ? username.trim()[0].toUpperCase() : "?";

  return (
    <div className="flex min-h-screen flex-col bg-white px-6 py-8">
      {/* Logo */}
      <div className="mb-10">
        <img src={tiktokLogo} alt="TikTok" className="h-8" />
      </div>

      {/* Heading */}
      <h1 className="mb-3 text-2xl font-bold text-black">
        <span className="text-primary">Verifique</span> sua conta do TikTok
      </h1>
      <p className="mb-10 text-sm text-gray-500">
        Insira seu @ para verificar a elegibilidade e liberar o bônus da plataforma.
      </p>

      {/* Input */}
      <div className="mb-2">
        <label className="mb-2 block text-sm font-semibold text-black">
          Nome de usuário
        </label>
        <div className="flex items-center border-b border-gray-300 pb-2">
          <span className="mr-2 text-sm text-gray-400 font-medium">@</span>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="seu_usuario"
            className="w-full bg-transparent text-sm text-black placeholder:text-gray-300 outline-none"
          />
        </div>
      </div>

      {/* Button */}
      <div className="mt-8">
        <Button
          onClick={handleVerify}
          disabled={!username.trim()}
          className="w-full h-12 rounded-full text-base font-bold bg-primary/80 hover:bg-primary text-primary-foreground disabled:opacity-40"
        >
          Verificar Elegibilidade
        </Button>
      </div>

      {/* Footer */}
      <div className="mt-8 flex flex-col items-center gap-3">
        <div className="flex w-full items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-400">TikTok One</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>
        <p className="text-center text-xs text-gray-400 leading-relaxed">
          Ao continuar, você concorda com os Termos de Serviço e confirma que leu a Política de Privacidade.
        </p>
      </div>

      {/* Fullscreen Verificando */}
      {step === "verifying" && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
          <img src={tiktokLogo} alt="TikTok" className="h-6 mb-6" />
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-block h-3 w-3 rounded-full bg-secondary animate-[swap-left_1s_ease-in-out_infinite]" />
            <span className="inline-block h-3 w-3 rounded-full bg-primary animate-[swap-right_1s_ease-in-out_infinite]" />
          </div>
          <p className="text-sm text-gray-500">Verificando elegibilidade...</p>
        </div>
      )}

      {/* Fullscreen Sucesso */}
      {step === "success" && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white overflow-hidden">
          {/* Confetti layer */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {confetti.map((piece) => (
              <span
                key={piece.id}
                className="absolute animate-[confetti-fall_linear_forwards]"
                style={{
                  left: `${piece.left}%`,
                  top: "-10px",
                  width: piece.shape === "rect" ? piece.size * 0.5 : piece.size,
                  height: piece.shape === "circle" ? piece.size : piece.size * (piece.shape === "rect" ? 1.5 : 1),
                  backgroundColor: piece.color,
                  borderRadius: piece.shape === "circle" ? "50%" : "1px",
                  transform: `rotate(${piece.rotation}deg)`,
                  animationDelay: `${piece.delay}s`,
                  animationDuration: `${piece.duration}s`,
                }}
              />
            ))}
          </div>

          {/* Logo top */}
          <img src={tiktokLogo} alt="TikTok" className="h-5 mb-10 opacity-40" />

          {/* Avatar circle */}
          <div className="relative mb-6">
            {/* Outer ring - teal */}
            <div className="h-36 w-36 rounded-full border-[3px] border-secondary/30 flex items-center justify-center">
              {/* Pink ring */}
              <div className="h-28 w-28 rounded-full border-[3px] border-primary/30 flex items-center justify-center">
                {/* Gradient arc ring */}
                <div className="h-24 w-24 rounded-full p-[3px] bg-gradient-to-br from-secondary via-gray-400 to-primary">
                  {/* Avatar - real photo or fallback */}
                  <div className="h-full w-full rounded-full bg-orange-500 flex items-center justify-center overflow-hidden">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={username} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-3xl font-bold text-white">{initial}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* Check badge */}
            <div className="absolute bottom-1 right-4 h-8 w-8 rounded-full bg-secondary flex items-center justify-center border-2 border-white">
              <CheckCircle2 className="h-5 w-5 text-white" />
            </div>
          </div>

          {/* Text */}
          <h3 className="text-xl font-bold text-black mb-1">Parabéns! 🎉</h3>
          <p className="text-sm text-gray-500 mb-1">Conta verificada com sucesso</p>
          <p className="text-sm font-semibold text-primary">@{username}</p>

          {/* Continue button */}
          <div className="mt-10 w-full max-w-xs px-4">
            <Button
              onClick={() => navigate("/progresso")}
              className="w-full h-12 text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
            >
              Continuar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Landing;
