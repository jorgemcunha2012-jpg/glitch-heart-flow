import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import tiktokLogo from "@/assets/tiktok-logo.png";
import calendarImg from "@/assets/calendar.png";

const bimonths = ["1/2", "3/4", "5/6", "7/8", "9/10", "11/12"];

const Progresso = () => {
  const [checkedCount, setCheckedCount] = useState(0);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const navigate = useNavigate();
  const username = localStorage.getItem("tiktok_username") || "usuario";
  const avatarUrl = localStorage.getItem("tiktok_avatar") || null;
  const initial = username[0]?.toUpperCase() || "?";

  useEffect(() => {
    const calTimer = setTimeout(() => setCalendarVisible(true), 400);

    const checkStart = setTimeout(() => {
      const interval = setInterval(() => {
        setCheckedCount((prev) => {
          if (prev >= bimonths.length) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 500);
      return () => clearInterval(interval);
    }, 1200);

    return () => {
      clearTimeout(calTimer);
      clearTimeout(checkStart);
    };
  }, []);

  const rows = [
    bimonths.slice(0, 3),
    bimonths.slice(3, 6),
  ];

  return (
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-b from-pink-50 to-white px-4 py-6">
      {/* TikTok Logo */}
      <img src={tiktokLogo} alt="TikTok" className="h-6 mb-6" loading="eager" decoding="async" />

      {/* User Card */}
      <div className="w-full max-w-sm rounded-full bg-white shadow-sm border border-gray-100 flex items-center gap-3 px-4 py-3 mb-8">
        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center shrink-0 overflow-hidden">
          {avatarUrl ? (
            <img src={avatarUrl} alt={username} className="h-full w-full object-cover" loading="eager" decoding="async" />
          ) : (
            <span className="text-lg font-bold text-white">{initial}</span>
          )}
        </div>
        <span className="text-sm font-semibold text-black">@{username}</span>
        <div className="ml-auto text-2xl">🌟</div>
      </div>

      {/* Content Card */}
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center">
        {/* Title */}
        <div className="text-left w-full mb-4">
          <h1 className="text-[22px] font-bold text-black leading-tight">
            Parabéns!
            <br />
            Você concluiu todas as
            <br />
            atividades do ano.
            <br />
            <span className="text-secondary">Veja seu progresso!</span>
          </h1>
          <p className="mt-3 text-xs text-gray-400 leading-relaxed">
            Estamos carregando seu histórico mês a mês. Aguarde alguns segundos enquanto confirmamos todas as etapas.
          </p>
        </div>

        {/* Calendar Image */}
        <div
          className={`my-6 transition-all duration-700 ${
            calendarVisible
              ? "opacity-100 animate-[calendar-bounce_0.8s_ease-out]"
              : "opacity-0 scale-50"
          }`}
        >
          <img
            src={calendarImg}
            alt="Calendário"
            className="h-28 w-28 object-contain drop-shadow-lg"
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
        </div>

        {/* Bimonth progress grid */}
        <div className="w-full flex flex-col items-center gap-3 mb-4">
          {rows.map((row, rowIdx) => (
            <div key={rowIdx} className="flex items-center justify-center">
              {row.map((label, colIdx) => {
                const globalIdx = rowIdx * 3 + colIdx;
                const checked = globalIdx < checkedCount;
                const showLine = colIdx < row.length - 1;
                return (
                  <div key={label} className="flex items-center">
                    {/* Check pill */}
                    <div
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 transition-all duration-500 ${
                        checked
                          ? "border-green-400 bg-green-50 shadow-[0_0_8px_rgba(34,197,94,0.25)]"
                          : "border-gray-200 bg-gray-50"
                      }`}
                      style={{
                        transitionDelay: `${globalIdx * 100}ms`,
                      }}
                    >
                      {/* Custom check icon */}
                      <div
                        className={`h-5 w-5 rounded-full flex items-center justify-center transition-all duration-300 ${
                          checked
                            ? "bg-green-500 scale-100"
                            : "bg-gray-300 scale-90"
                        }`}
                      >
                        <svg
                          className={`h-3 w-3 text-white transition-all duration-300 ${
                            checked ? "opacity-100 scale-100" : "opacity-0 scale-50"
                          }`}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <span
                        className={`text-sm font-bold transition-colors duration-300 ${
                          checked ? "text-green-700" : "text-gray-400"
                        }`}
                      >
                        {label}
                      </span>
                    </div>
                    {/* Connecting dash */}
                    {showLine && (
                      <div
                        className={`w-5 h-[3px] mx-1.5 rounded-full transition-all duration-500 ${
                          checked && globalIdx + 1 < checkedCount
                            ? "bg-green-400"
                            : "bg-gray-200"
                        }`}
                        style={{
                          transitionDelay: `${globalIdx * 100 + 200}ms`,
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Status text */}
        <p
          className={`text-xs text-green-500 font-semibold mb-5 transition-opacity duration-500 ${
            checkedCount >= bimonths.length ? "opacity-100" : "opacity-0"
          }`}
        >
          Seu progresso foi concluído com sucesso!
        </p>

        {/* CTA Button */}
        <Button
          onClick={() => {
            setRedirecting(true);
            setTimeout(() => navigate("/bonus"), 3000);
          }}
          disabled={checkedCount < bimonths.length}
          className="w-full h-12 rounded-full text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-40 gap-2"
        >
          <Gift className="h-5 w-5" />
          Resgatar progresso
        </Button>
      </div>

      {/* Fullscreen Redirecionando */}
      {redirecting && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-block h-3 w-3 rounded-full bg-primary animate-[swap-left_1s_ease-in-out_infinite]" />
            <span className="inline-block h-3 w-3 rounded-full bg-secondary animate-[swap-right_1s_ease-in-out_infinite]" />
          </div>
          <p className="text-sm text-gray-500">Redirecionando...</p>
        </div>
      )}
    </div>
  );
};

export default Progresso;
