import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Loader2, CheckCircle2, Music } from "lucide-react";

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
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="mb-8 flex items-center gap-3">
        <div className="relative">
          <Music className="h-10 w-10 text-primary" />
          <Music className="absolute left-[2px] top-[2px] h-10 w-10 text-secondary opacity-60" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">
          Tik<span className="text-primary">Tok</span> <span className="text-secondary">Money</span>
        </h1>
      </div>

      {/* Card */}
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8">
        <h2 className="mb-2 text-center text-xl font-bold">
          Verifique sua conta
        </h2>
        <p className="mb-6 text-center text-sm text-muted-foreground">
          Insira seu @ do TikTok para verificar se você é elegível para monetização
        </p>

        <div className="relative mb-4">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">@</span>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="seu.usuario"
            className="pl-8 h-12 bg-muted border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>

        <Button
          onClick={handleVerify}
          disabled={!username.trim()}
          className="w-full h-12 text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
        >
          Verificar Conta
        </Button>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Mais de 50.000 contas já verificadas
        </p>
      </div>

      {/* Modal Verificando */}
      <Dialog open={step === "verifying"}>
        <DialogContent className="bg-card border-border text-foreground sm:max-w-sm [&>button]:hidden">
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="relative">
              <div className="h-16 w-16 rounded-full border-4 border-muted border-t-primary animate-spin-slow" />
            </div>
            <h3 className="text-lg font-bold">Verificando sua conta...</h3>
            <p className="text-sm text-muted-foreground text-center">
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
        <DialogContent className="bg-card border-border text-foreground sm:max-w-sm [&>button]:hidden">
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary/20">
              <CheckCircle2 className="h-12 w-12 text-secondary" />
            </div>
            <h3 className="text-xl font-bold">Parabéns! 🎉</h3>
            <p className="text-sm text-muted-foreground text-center">
              Sua conta <span className="font-semibold text-foreground">@{username}</span> foi verificada com sucesso e é elegível para monetização!
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
    <span className={done ? "text-muted-foreground" : "text-foreground"}>{label}</span>
  </div>
);

export default Landing;
