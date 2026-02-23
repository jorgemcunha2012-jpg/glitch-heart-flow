import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Loader2, CheckCircle2 } from "lucide-react";
import tiktokLogo from "@/assets/tiktok-logo.png";

const Landing = () => {
  const [username, setUsername] = useState("");
  const [step, setStep] = useState<"idle" | "verifying" | "success">("idle");
  const navigate = useNavigate();

  const handleVerify = () => {
    if (!username.trim()) return;
    setStep("verifying");
    setTimeout(() => {
      setStep("success");
    }, 3000);
  };

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

      {/* Modal Verificando */}
      <Dialog open={step === "verifying"}>
        <DialogContent className="bg-white border-gray-200 text-black sm:max-w-sm [&>button]:hidden">
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="h-16 w-16 rounded-full border-4 border-gray-200 border-t-primary animate-spin" style={{ animationDuration: '1s' }} />
            <h3 className="text-lg font-bold">Verificando sua conta...</h3>
            <p className="text-sm text-gray-500 text-center">
              Analisando @{username} no TikTok
            </p>
            <div className="flex flex-col gap-2 w-full text-sm">
              <VerifyStep label="Verificando perfil" done />
              <VerifyStep label="Analisando seguidores" done />
              <VerifyStep label="Verificando elegibilidade" />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Sucesso */}
      <Dialog open={step === "success"} onOpenChange={() => {}}>
        <DialogContent className="bg-white border-gray-200 text-black sm:max-w-sm [&>button]:hidden">
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary/20">
              <CheckCircle2 className="h-12 w-12 text-secondary" />
            </div>
            <h3 className="text-xl font-bold">Parabéns! 🎉</h3>
            <p className="text-sm text-gray-500 text-center">
              Sua conta <span className="font-semibold text-black">@{username}</span> foi verificada com sucesso e é elegível para monetização!
            </p>
            <Button
              onClick={() => navigate("/progresso")}
              className="w-full h-12 text-base font-bold bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-xl"
            >
              Continuar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const VerifyStep = ({ label, done }: { label: string; done?: boolean }) => (
  <div className="flex items-center gap-2">
    {done ? (
      <CheckCircle2 className="h-4 w-4 text-secondary" />
    ) : (
      <Loader2 className="h-4 w-4 animate-spin text-primary" />
    )}
    <span className={done ? "text-gray-400" : "text-black"}>{label}</span>
  </div>
);

export default Landing;
