import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import tiktokLogo from "@/assets/tiktok-logo.png";

const bimonths = ["1/2", "3/4", "5/6", "7/8", "9/10", "11/12"];

const Progresso = () => {
  const [checkedCount, setCheckedCount] = useState(0);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [calendarBounce, setCalendarBounce] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const navigate = useNavigate();
  const username = localStorage.getItem("tiktok_username") || "usuario";
  const avatarUrl = localStorage.getItem("tiktok_avatar") || null;
  const initial = username[0]?.toUpperCase() || "?";

  useEffect(() => {
    // Show calendar after a brief delay with bounce
    const calTimer = setTimeout(() => {
      setCalendarVisible(true);
      // Trigger bounce animation
      setTimeout(() => setCalendarBounce(true), 100);
    }, 400);

    // Start checking after calendar appears
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

  // Grid: 3 columns, 2 rows
  const rows = [
    bimonths.slice(0, 3), // 1/2, 3/4, 5/6
    bimonths.slice(3, 6), // 7/8, 9/10, 11/12
  ];

  return (
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-b from-pink-50 to-white px-4 py-6">
      {/* TikTok Logo */}
      <img src={tiktokLogo} alt="TikTok" className="h-6 mb-6" />

      {/* User Card */}
      <div className="w-full max-w-sm rounded-full bg-white shadow-sm border border-gray-100 flex items-center gap-3 px-4 py-3 mb-8">
        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center shrink-0 overflow-hidden">
          {avatarUrl ? (
            <img src={avatarUrl} alt={username} className="h-full w-full object-cover" />
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

        {/* Calendar */}
        <div
          className={`my-6 text-7xl transition-all duration-700 ${
            calendarVisible ? "opacity-100 scale-100" : "opacity-0 scale-50"
          } ${calendarBounce ? "animate-[calendar-bounce_0.8s_ease-out]" : ""}`}
        >
          📅
        </div>

        {/* Bimonth progress grid - 3 cols x 2 rows */}
        <div className="w-full flex flex-col items-center gap-4 mb-4">
          {rows.map((row, rowIdx) => (
            <div key={rowIdx} className="flex items-center justify-center gap-0">
              {row.map((label, colIdx) => {
                const globalIdx = rowIdx * 3 + colIdx;
                const checked = globalIdx < checkedCount;
                const showLine = colIdx < row.length - 1;
                return (
                  <div key={label} className="flex items-center">
                    {/* Check item */}
                    <div
                      className={`flex items-center gap-1.5 transition-all duration-500 ${
                        checked ? "opacity-100 scale-100" : "opacity-30 scale-90"
                      }`}
                      style={{
                        transitionDelay: checked ? `${globalIdx * 100}ms` : "0ms",
                      }}
                    >
                      <CheckCircle2
                        className={`h-5 w-5 shrink-0 transition-colors duration-300 ${
                          checked ? "text-green-500" : "text-gray-300"
                        }`}
                      />
                      <span
                        className={`text-sm font-semibold transition-colors duration-300 ${
                          checked ? "text-green-600" : "text-gray-400"
                        }`}
                      >
                        {label}
                      </span>
                    </div>
                    {/* Connecting line */}
                    {showLine && (
                      <div
                        className={`w-8 h-[3px] mx-3 rounded-full transition-colors duration-500 ${
                          checked && globalIdx + 1 < checkedCount
                            ? "bg-green-400"
                            : "bg-gray-200"
                        }`}
                        style={{
                          transitionDelay: checked ? `${globalIdx * 100 + 200}ms` : "0ms",
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
          className={`text-xs text-green-500 font-medium mb-5 transition-opacity duration-500 ${
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
