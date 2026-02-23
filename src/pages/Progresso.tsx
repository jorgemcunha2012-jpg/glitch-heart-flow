import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Loader2 } from "lucide-react";

const steps = [
  "Analisando seguidores...",
  "Verificando engajamento...",
  "Calculando alcance...",
  "Verificando monetização...",
  "Finalizando análise...",
];

const Progresso = () => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => navigate("/bonus"), 800);
          return 100;
        }
        return prev + 1;
      });
    }, 80);
    return () => clearInterval(interval);
  }, [navigate]);

  useEffect(() => {
    const stepIndex = Math.min(Math.floor(progress / 20), steps.length - 1);
    setCurrentStep(stepIndex);
  }, [progress]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h2 className="mb-2 text-center text-xl font-bold">Analisando sua conta</h2>
        <p className="mb-8 text-center text-sm text-muted-foreground">
          Aguarde enquanto processamos seus dados
        </p>

        <Progress value={progress} className="mb-4 h-3 bg-muted [&>div]:bg-primary" />
        <p className="mb-8 text-center text-2xl font-extrabold text-primary">{progress}%</p>

        <div className="flex flex-col gap-3">
          {steps.map((step, i) => (
            <div key={step} className="flex items-center gap-3 text-sm">
              {i < currentStep ? (
                <CheckCircle2 className="h-5 w-5 text-secondary shrink-0" />
              ) : i === currentStep ? (
                <Loader2 className="h-5 w-5 animate-spin text-primary shrink-0" />
              ) : (
                <div className="h-5 w-5 rounded-full border border-border shrink-0" />
              )}
              <span className={i <= currentStep ? "text-foreground" : "text-muted-foreground"}>
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Progresso;
