import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QrCode, Building2, Smartphone } from "lucide-react";

type Method = "pix" | "bank" | null;

const Pix = () => {
  const [method, setMethod] = useState<Method>(null);
  const [pixKey, setPixKey] = useState("");
  const navigate = useNavigate();

  const methods = [
    { id: "pix" as const, label: "Chave PIX", icon: QrCode, desc: "Receba em minutos" },
    { id: "bank" as const, label: "Conta Bancária", icon: Building2, desc: "1-2 dias úteis" },
  ];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h2 className="mb-2 text-center text-xl font-bold">Selecione o método de saque</h2>
        <p className="mb-6 text-center text-sm text-muted-foreground">
          Escolha como deseja receber R$ 487,32
        </p>

        <div className="flex flex-col gap-3 mb-6">
          {methods.map((m) => (
            <button
              key={m.id}
              onClick={() => setMethod(m.id)}
              className={`flex items-center gap-4 rounded-xl border p-4 text-left transition-all ${
                method === m.id
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card hover:border-muted-foreground/30"
              }`}
            >
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
                method === m.id ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
              }`}>
                <m.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{m.label}</p>
                <p className="text-xs text-muted-foreground">{m.desc}</p>
              </div>
            </button>
          ))}
        </div>

        {method && (
          <div className="mb-6 animate-fade-in">
            <label className="mb-2 block text-sm font-medium text-foreground">
              {method === "pix" ? "Chave PIX" : "Dados da conta"}
            </label>
            {method === "pix" ? (
              <Input
                value={pixKey}
                onChange={(e) => setPixKey(e.target.value)}
                placeholder="CPF, e-mail, telefone ou chave aleatória"
                className="h-12 bg-muted border-border"
              />
            ) : (
              <div className="flex flex-col gap-3">
                <Input placeholder="Banco" className="h-12 bg-muted border-border" />
                <Input placeholder="Agência" className="h-12 bg-muted border-border" />
                <Input placeholder="Conta" className="h-12 bg-muted border-border" />
              </div>
            )}
          </div>
        )}

        <Button
          onClick={() => navigate("/checkout")}
          disabled={!method}
          className="w-full h-12 text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
        >
          Confirmar Saque
        </Button>
      </div>
    </div>
  );
};

export default Pix;
