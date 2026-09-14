
import { useState, useEffect, useRef } from "react";

type AlertItem = { name: string; count: number };

type Message = {
  side: "user" | "ai";
  type: "text" | "stock" | "alert" | "summary";
  text?: string;
  title?: string;
  caption?: string;
  delta?: string;
  dir?: "up" | "down";
  value?: number;
  unit?: string;
  items?: AlertItem[];
};

export default function GestionInternaAnimation() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [typing, setTyping] = useState(false);
  const [phase, setPhase] = useState("chat");
  const mountedRef = useRef(true);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const sleep = (ms: number) =>
    new Promise<void>((res) => {
      const id = setTimeout(res, ms);
      timersRef.current.push(id);
    });

  const push = (m: Message) => {
    if (mountedRef.current) setMessages((prev) => [...prev, m]);
  };

  const showTyping = async (ms: number) => {
    setTyping(true);
    await sleep(ms);
    setTyping(false);
  };

  const type = async (text: string) => {
    for (let i = 1; i <= text.length; i++) {
      if (!mountedRef.current) return;
      setInputText(text.slice(0, i));
      await sleep(26);
    }
  };

  const send = (text: string) => {
    if (!text.trim()) return;
    push({ side: "user", type: "text", text });
    setInputText("");
  };

  const countTo = async (idx: number, from: number, to: number, ms: number) => {
    const steps = 18;
    for (let i = 0; i <= steps; i++) {
      if (!mountedRef.current) return;
      const val = Math.round(from + (to - from) * (i / steps));
      setMessages((prev) => {
        const arr = [...prev];
        if (arr[idx]) arr[idx] = { ...arr[idx], value: val };
        return arr;
      });
      await sleep(ms / steps);
    }
  };

  useEffect(() => {
    mountedRef.current = true;

    const runSequence = async () => {
      while (mountedRef.current) {
        setMessages([]);
        setInputText("");
        setTyping(false);
        setPhase("chat");
        await sleep(800);

        await type("¿Cuántos vasos de vidrio tenemos?");
        await sleep(220);
        send("¿Cuántos vasos de vidrio tenemos?");
        await sleep(520);
        await showTyping(850);
        push({
          side: "ai",
          type: "text",
          text: "Actualmente hay 127 unidades disponibles.",
        });
        await sleep(1150);

        await type("Llegaron 50 juegos de cubiertos Tramontina.");
        await sleep(220);
        send("Llegaron 50 juegos de cubiertos Tramontina.");
        await sleep(520);
        await showTyping(850);
        push({
          side: "ai",
          type: "text",
          text: "Stock actualizado. Se agregaron 50 unidades.",
        });
        await sleep(420);

        let idx = 0;
        setMessages((prev) => {
          idx = prev.length;
          return [
            ...prev,
            {
              side: "ai",
              type: "stock",
              title: "Juegos de cubiertos",
              caption: "Nuevo stock",
              delta: "+50",
              dir: "up",
              value: 33,
              unit: "unidades",
            },
          ];
        });
        await sleep(50);
        await countTo(idx, 33, 83, 1000);
        await sleep(1350);

        await type("Vendí 3 termos Stanley negros.");
        await sleep(220);
        send("Vendí 3 termos Stanley negros.");
        await sleep(520);
        await showTyping(850);
        push({ side: "ai", type: "text", text: "Venta registrada." });
        await sleep(400);

        let idx2 = 0;
        setMessages((prev) => {
          idx2 = prev.length;
          return [
            ...prev,
            {
              side: "ai",
              type: "stock",
              title: "Termos Stanley negros",
              caption: "Stock restante",
              delta: "−3",
              dir: "down",
              value: 15,
              unit: "unidades",
            },
          ];
        });
        await sleep(50);
        await countTo(idx2, 15, 12, 750);
        await sleep(1350);

        await type("¿Qué tengo que reponer?");
        await sleep(220);
        send("¿Qué tengo que reponer?");
        await sleep(520);
        await showTyping(900);
        push({
          side: "ai",
          type: "alert",
          items: [
            { name: "Tazas blancas", count: 4 },
            { name: "Termos Stanley", count: 2 },
            { name: "Juegos de cubiertos", count: 3 },
          ],
        });
        await sleep(1900);

        await showTyping(800);
        push({ side: "ai", type: "summary" });
        await sleep(3800);
      }
    };

    runSequence();

    return () => {
      mountedRef.current = false;
      timersRef.current.forEach(clearTimeout);
    };
  }, []);

  const aiBubbleStyle: React.CSSProperties = {
    maxWidth: "80%",
    padding: "10px 13px",
    borderRadius: "16px 16px 16px 4px",
    background: "#1b1626",
    color: "#ece8f3",
    fontSize: "13.5px",
    lineHeight: "1.45",
    boxShadow: "0 2px 8px rgba(0,0,0,.3)",
    animation: "vMsgIn .35s ease both",
  };

  const userBubbleStyle: React.CSSProperties = {
    maxWidth: "80%",
    padding: "10px 13px",
    borderRadius: "16px 16px 4px 16px",
    background: "linear-gradient(135deg,#6d28d9,#8b5cf6)",
    color: "#f3ecff",
    fontSize: "13.5px",
    lineHeight: "1.45",
    boxShadow: "0 2px 10px rgba(124,58,237,.3)",
    animation: "vMsgIn .35s ease both",
  };

  const deltaUpStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "3px",
    padding: "3px 8px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: 700,
    fontFamily: "'Bricolage Grotesque', sans-serif",
    background: "rgba(0,255,136,.14)",
    color: "#5cffa6",
    border: "1px solid rgba(0,255,136,.3)",
  };

  const deltaDownStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "3px",
    padding: "3px 8px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: 700,
    fontFamily: "'Bricolage Grotesque', sans-serif",
    background: "rgba(245,166,35,.14)",
    color: "#f5c06a",
    border: "1px solid rgba(245,166,35,.3)",
  };

  const isClosing = false;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700&family=Inter:wght@400;500;600;700&display=swap');
        @keyframes vFloaty { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-9px); } }
        @keyframes vGlowA { 0%, 100% { transform: translate(0,0) scale(1); opacity:.8; } 50% { transform: translate(-30px,20px) scale(1.12); opacity:.95; } }
        @keyframes vGlowB { 0%, 100% { transform: translate(0,0) scale(1); opacity:.7; } 50% { transform: translate(30px,-20px) scale(1.1); opacity:1; } }
        @keyframes vMsgIn { from { opacity:0; transform: translateY(10px) scale(.96); } to { opacity:1; transform: translateY(0) scale(1); } }
        @keyframes vDot { 0%, 60%, 100% { transform: translateY(0); opacity:.45; } 30% { transform: translateY(-4px); opacity:1; } }
        @keyframes vCaret { 0%, 100% { opacity:1; } 50% { opacity:0; } }
        @keyframes vClose { from { opacity:0; transform: translateY(16px); } to { opacity:1; transform: translateY(0); } }
        @keyframes vNodeIn { from { opacity:0; transform: scale(.5); } to { opacity:1; transform: scale(1); } }
        @keyframes vLineDraw { from { stroke-dashoffset: 130; } to { stroke-dashoffset: 0; } }
        @keyframes vCorePulse { 0%, 100% { box-shadow: 0 0 28px 4px rgba(124,58,237,.5); } 50% { box-shadow: 0 0 44px 10px rgba(0,255,136,.45); } }
      `}</style>

      <div
        style={{
          position: "relative",
          width: "100%",
          height: "430px",
          minHeight: "400px",
          overflow: "hidden",
          clipPath: "inset(0)",
          background: "transparent",
          fontFamily: "'Inter', sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Glow blobs */}
        <div
          style={{
            position: "absolute",
            right: "8%",
            top: "16%",
            width: "360px",
            height: "360px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(124,58,237,.32), transparent 68%)",
            filter: "blur(70px)",
            animation: "vGlowB 11s ease-in-out infinite",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "6%",
            bottom: "12%",
            width: "380px",
            height: "380px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(0,255,136,.22), transparent 68%)",
            filter: "blur(70px)",
            animation: "vGlowA 9s ease-in-out infinite",
            pointerEvents: "none",
          }}
        />

        {/* Card wrapper */}
        <div
          style={{
            width: "100%",
            maxWidth: "344px",
            transition:
              "transform .8s cubic-bezier(.2,.7,.2,1), opacity .8s ease, filter .8s ease",
            transform: isClosing ? "scale(.9)" : "scale(1)",
            opacity: isClosing ? 0.22 : 1,
            filter: isClosing ? "blur(2px)" : "none",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "344px",
              height: "404px",
              display: "flex",
              flexDirection: "column",
              borderRadius: "26px",
              overflow: "hidden",
              background: "#0c0a12",
              border: "1px solid rgba(255,255,255,.08)",
              boxShadow:
                "0 40px 90px -30px rgba(0,0,0,.8), 0 0 60px -20px rgba(124,58,237,.3)",
              animation: "vFloaty 6s ease-in-out infinite",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "14px 16px",
                background: "linear-gradient(180deg,#16121f,#0f0c16)",
                borderBottom: "1px solid rgba(255,255,255,.06)",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "42px",
                  height: "42px",
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  background: "linear-gradient(135deg,#7c3aed,#00ff88)",
                  flexShrink: 0,
                }}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#0a0613"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="18" height="10" x="3" y="11" rx="2" />
                  <circle cx="12" cy="5" r="2" />
                  <path d="M12 7v4" />
                  <line x1="8" x2="8" y1="16" y2="16" />
                  <line x1="16" x2="16" y1="16" y2="16" />
                </svg>
                <span
                  style={{
                    position: "absolute",
                    right: "-1px",
                    bottom: "-1px",
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    background: "#22e07a",
                    border: "2px solid #0f0c16",
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  lineHeight: "1.25",
                  minWidth: 0,
                }}
              >
                <span
                  style={{
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    fontSize: "14.5px",
                    fontWeight: 600,
                    color: "#fff",
                    whiteSpace: "nowrap",
                  }}
                >
                  Asistente IA Vortex
                </span>
                {typing ? (
                  <span
                    style={{
                      fontSize: "12.5px",
                      color: "#c9b6ff",
                      fontStyle: "italic",
                    }}
                  >
                    escribiendo…
                  </span>
                ) : (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "12.5px",
                      color: "#c9b6ff",
                    }}
                  >
                    <span
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: "#22e07a",
                        boxShadow: "0 0 8px #22e07a",
                      }}
                    />
                    Conectado 24/7
                  </span>
                )}
              </div>
            </div>

            {/* Body */}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                gap: "9px",
                padding: "16px 14px",
                overflow: "hidden",
                background:
                  "linear-gradient(180deg, rgba(124,58,237,.02), transparent 30%)",
              }}
            >
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    justifyContent:
                      m.side === "user" ? "flex-end" : "flex-start",
                    animation: "vMsgIn 0.35s ease both",
                  }}
                >
                  {m.type === "text" && (
                    <div
                      style={
                        m.side === "user" ? userBubbleStyle : aiBubbleStyle
                      }
                    >
                      {m.text}
                    </div>
                  )}

                  {m.type === "stock" && (
                    <div
                      style={{
                        width: "236px",
                        padding: "13px",
                        borderRadius: "14px 14px 14px 6px",
                        background: "#191323",
                        border: "1px solid rgba(255,255,255,.08)",
                        boxShadow: "0 4px 14px rgba(0,0,0,.35)",
                        animation: "vMsgIn .35s ease both",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          justifyContent: "space-between",
                          gap: "8px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            minWidth: 0,
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "'Bricolage Grotesque', sans-serif",
                              fontSize: "13.5px",
                              fontWeight: 600,
                              color: "#fff",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {m.title}
                          </span>
                          <span
                            style={{
                              fontSize: "10px",
                              fontWeight: 600,
                              letterSpacing: ".12em",
                              textTransform: "uppercase",
                              color: "#8a82a0",
                              marginTop: "3px",
                            }}
                          >
                            {m.caption}
                          </span>
                        </div>
                        <span
                          style={
                            m.dir === "down" ? deltaDownStyle : deltaUpStyle
                          }
                        >
                          {m.dir === "up" ? (
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="m6 15 6-6 6 6" />
                            </svg>
                          ) : (
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="m6 9 6 6 6-6" />
                            </svg>
                          )}
                          {m.delta}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "baseline",
                          gap: "6px",
                          marginTop: "10px",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'Bricolage Grotesque', sans-serif",
                            fontSize: "30px",
                            fontWeight: 700,
                            lineHeight: "1",
                            color: "#fff",
                          }}
                        >
                          {m.value}
                        </span>
                        <span style={{ fontSize: "13px", color: "#9b92ad" }}>
                          {m.unit}
                        </span>
                      </div>
                    </div>
                  )}

                  {m.type === "alert" && (
                    <div
                      style={{
                        width: "248px",
                        padding: "14px",
                        borderRadius: "14px 14px 14px 6px",
                        background: "#1c1620",
                        border: "1px solid rgba(245,166,35,.28)",
                        boxShadow: "0 4px 14px rgba(0,0,0,.35)",
                        animation: "vMsgIn .35s ease both",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "9px",
                          marginBottom: "12px",
                        }}
                      >
                        <span
                          style={{
                            width: "26px",
                            height: "26px",
                            borderRadius: "8px",
                            display: "grid",
                            placeItems: "center",
                            background: "rgba(245,166,35,.16)",
                            color: "#f5b94a",
                            flexShrink: 0,
                          }}
                        >
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                            <path d="M12 9v4" />
                            <path d="M12 17h.01" />
                          </svg>
                        </span>
                        <span
                          style={{
                            fontFamily: "'Bricolage Grotesque', sans-serif",
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "#fff",
                          }}
                        >
                          Productos con stock crítico
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        {(m.items ?? []).map((item, i) => (
                          <div
                            key={i}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              padding: "7px 10px",
                              borderRadius: "9px",
                              background: "rgba(255,255,255,.03)",
                            }}
                          >
                            <span
                              style={{ fontSize: "13px", color: "#d8d2e2" }}
                            >
                              {item.name}
                            </span>
                            <span
                              style={{
                                fontFamily: "'Bricolage Grotesque', sans-serif",
                                fontSize: "13px",
                                fontWeight: 700,
                                color: "#f5b94a",
                                padding: "2px 9px",
                                borderRadius: "7px",
                                background: "rgba(245,166,35,.14)",
                              }}
                            >
                              {item.count}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {m.type === "summary" && (
                    <div
                      style={{
                        width: "262px",
                        padding: "15px",
                        borderRadius: "14px 14px 14px 6px",
                        background: "linear-gradient(160deg,#1a1426,#13101c)",
                        border: "1px solid rgba(124,58,237,.3)",
                        boxShadow: "0 6px 20px rgba(0,0,0,.4)",
                        animation: "vMsgIn .35s ease both",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "9px",
                          marginBottom: "13px",
                        }}
                      >
                        <span
                          style={{
                            width: "26px",
                            height: "26px",
                            borderRadius: "8px",
                            display: "grid",
                            placeItems: "center",
                            background:
                              "linear-gradient(135deg,rgba(124,58,237,.3),rgba(0,255,136,.2))",
                            color: "#c9b6ff",
                            flexShrink: 0,
                          }}
                        >
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M3 3v16a2 2 0 0 0 2 2h16" />
                            <path d="m19 9-5 5-4-4-3 3" />
                          </svg>
                        </span>
                        <span
                          style={{
                            fontFamily: "'Bricolage Grotesque', sans-serif",
                            fontSize: "15px",
                            fontWeight: 600,
                            color: "#fff",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Resumen del día
                        </span>
                      </div>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "9px",
                        }}
                      >
                        <div
                          style={{
                            padding: "10px",
                            borderRadius: "10px",
                            background: "rgba(255,255,255,.03)",
                          }}
                        >
                          <div
                            style={{
                              fontFamily: "'Bricolage Grotesque', sans-serif",
                              fontSize: "20px",
                              fontWeight: 700,
                              color: "#00ff88",
                            }}
                          >
                            87
                          </div>
                          <div
                            style={{
                              fontSize: "11px",
                              color: "#9b92ad",
                              marginTop: "2px",
                            }}
                          >
                            Productos vendidos
                          </div>
                        </div>
                        <div
                          style={{
                            padding: "10px",
                            borderRadius: "10px",
                            background: "rgba(255,255,255,.03)",
                          }}
                        >
                          <div
                            style={{
                              fontFamily: "'Bricolage Grotesque', sans-serif",
                              fontSize: "20px",
                              fontWeight: 700,
                              color: "#a78bfa",
                            }}
                          >
                            24
                          </div>
                          <div
                            style={{
                              fontSize: "11px",
                              color: "#9b92ad",
                              marginTop: "2px",
                            }}
                          >
                            Ingresos de mercadería
                          </div>
                        </div>
                        <div
                          style={{
                            padding: "10px",
                            borderRadius: "10px",
                            background: "rgba(255,255,255,.03)",
                          }}
                        >
                          <div
                            style={{
                              fontFamily: "'Bricolage Grotesque', sans-serif",
                              fontSize: "20px",
                              fontWeight: 700,
                              color: "#f5b94a",
                            }}
                          >
                            5
                          </div>
                          <div
                            style={{
                              fontSize: "11px",
                              color: "#9b92ad",
                              marginTop: "2px",
                            }}
                          >
                            Stock crítico
                          </div>
                        </div>
                        <div
                          style={{
                            padding: "10px",
                            borderRadius: "10px",
                            background:
                              "linear-gradient(135deg,rgba(0,255,136,.12),rgba(124,58,237,.12))",
                            border: "1px solid rgba(0,255,136,.18)",
                          }}
                        >
                          <div
                            style={{
                              fontFamily: "'Bricolage Grotesque', sans-serif",
                              fontSize: "16px",
                              fontWeight: 700,
                              background:
                                "linear-gradient(120deg,#00ff88,#a855f7)",
                              WebkitBackgroundClip: "text",
                              backgroundClip: "text",
                              color: "transparent",
                            }}
                          >
                            $1.250.000
                          </div>
                          <div
                            style={{
                              fontSize: "11px",
                              color: "#9b92ad",
                              marginTop: "2px",
                            }}
                          >
                            Facturación estimada
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {typing && (
                <div
                  style={{
                    alignSelf: "flex-start",
                    display: "flex",
                    gap: "5px",
                    padding: "13px 15px",
                    borderRadius: "16px 16px 16px 4px",
                    background: "#1b1626",
                    animation: "vMsgIn .3s ease both",
                  }}
                >
                  <span
                    style={{
                      width: "7px",
                      height: "7px",
                      borderRadius: "50%",
                      background: "#9b8aba",
                      animation: "vDot 1.2s infinite",
                    }}
                  />
                  <span
                    style={{
                      width: "7px",
                      height: "7px",
                      borderRadius: "50%",
                      background: "#9b8aba",
                      animation: "vDot 1.2s infinite .2s",
                    }}
                  />
                  <span
                    style={{
                      width: "7px",
                      height: "7px",
                      borderRadius: "50%",
                      background: "#9b8aba",
                      animation: "vDot 1.2s infinite .4s",
                    }}
                  />
                </div>
              )}
            </div>

            {/* Input */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "9px",
                padding: "11px 13px",
                background: "#0f0c16",
                borderTop: "1px solid rgba(255,255,255,.06)",
              }}
            >
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  minHeight: "38px",
                  padding: "0 14px",
                  borderRadius: "20px",
                  background: "#1b1626",
                  border: "1px solid rgba(255,255,255,.06)",
                  fontSize: "13.5px",
                  color: "#ece8f3",
                }}
              >
                {!inputText ? (
                  <span style={{ color: "#6b6178" }}>Escribí un mensaje…</span>
                ) : (
                  <>
                    <span>{inputText}</span>
                    <span
                      style={{
                        display: "inline-block",
                        width: "2px",
                        height: "16px",
                        marginLeft: "1px",
                        background: "#a78bfa",
                        animation: "vCaret 1s steps(1) infinite",
                        verticalAlign: "middle",
                      }}
                    />
                  </>
                )}
              </div>
              {!inputText ? (
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    background: "#1b1626",
                    flexShrink: 0,
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#9b8aba"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" x2="12" y1="19" y2="22" />
                  </svg>
                </div>
              ) : (
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    background: "linear-gradient(135deg,#7c3aed,#a855f7)",
                    flexShrink: 0,
                    boxShadow: "0 0 16px rgba(124,58,237,.45)",
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m5 12 14 0" />
                    <path d="m13 6 6 6-6 6" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Closing overlay */}
        {isClosing && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "26px",
              textAlign: "center",
              padding: "30px",
              zIndex: 5,
            }}
          >
            <div
              style={{ position: "relative", width: "380px", height: "210px" }}
            >
              <svg
                width="380"
                height="210"
                viewBox="0 0 380 210"
                style={{ position: "absolute", inset: 0 }}
              >
                <line
                  x1="190"
                  y1="105"
                  x2="190"
                  y2="34"
                  stroke="rgba(0,255,136,.4)"
                  strokeWidth="1.5"
                  strokeDasharray="130"
                  style={{ animation: "vLineDraw .7s ease .1s both" }}
                />
                <line
                  x1="190"
                  y1="105"
                  x2="64"
                  y2="105"
                  stroke="rgba(124,58,237,.45)"
                  strokeWidth="1.5"
                  strokeDasharray="130"
                  style={{ animation: "vLineDraw .7s ease .2s both" }}
                />
                <line
                  x1="190"
                  y1="105"
                  x2="316"
                  y2="105"
                  stroke="rgba(0,255,136,.4)"
                  strokeWidth="1.5"
                  strokeDasharray="130"
                  style={{ animation: "vLineDraw .7s ease .3s both" }}
                />
                <line
                  x1="190"
                  y1="105"
                  x2="190"
                  y2="176"
                  stroke="rgba(124,58,237,.45)"
                  strokeWidth="1.5"
                  strokeDasharray="130"
                  style={{ animation: "vLineDraw .7s ease .4s both" }}
                />
              </svg>

              {/* Center node */}
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%,-50%)",
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  background: "linear-gradient(135deg,#00ff88,#7c3aed)",
                  animation: "vCorePulse 2.4s ease-in-out infinite",
                  zIndex: 2,
                }}
              >
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#0a0613"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="18" height="10" x="3" y="11" rx="2" />
                  <circle cx="12" cy="5" r="2" />
                  <path d="M12 7v4" />
                  <line x1="8" x2="8" y1="16" y2="16" />
                  <line x1="16" x2="16" y1="16" y2="16" />
                </svg>
              </div>

              {/* Top: Stock */}
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: 0,
                  transform: "translateX(-50%)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "8px 13px",
                  borderRadius: "11px",
                  background: "#15111d",
                  border: "1px solid rgba(0,255,136,.25)",
                  animation: "vNodeIn .4s ease .5s both",
                }}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#00ff88"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m7.5 4.27 9 5.15" />
                  <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                  <path d="m3.3 7 8.7 5 8.7-5" />
                  <path d="M12 22V12" />
                </svg>
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#e8efe9",
                  }}
                >
                  Stock
                </span>
              </div>

              {/* Right: Ventas */}
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "50%",
                  transform: "translateY(-50%)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "8px 13px",
                  borderRadius: "11px",
                  background: "#15111d",
                  border: "1px solid rgba(124,58,237,.3)",
                  animation: "vNodeIn .4s ease .6s both",
                }}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#a78bfa"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" x2="12" y1="2" y2="22" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#e8e3f2",
                  }}
                >
                  Ventas
                </span>
              </div>

              {/* Bottom: Reportes */}
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  bottom: 0,
                  transform: "translateX(-50%)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "8px 13px",
                  borderRadius: "11px",
                  background: "#15111d",
                  border: "1px solid rgba(0,255,136,.25)",
                  animation: "vNodeIn .4s ease .7s both",
                }}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#00ff88"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 3v16a2 2 0 0 0 2 2h16" />
                  <rect x="7" y="13" width="3" height="5" />
                  <rect x="14" y="9" width="3" height="9" />
                </svg>
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#e8efe9",
                  }}
                >
                  Reportes
                </span>
              </div>

              {/* Left: Operaciones */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: "50%",
                  transform: "translateY(-50%)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "8px 13px",
                  borderRadius: "11px",
                  background: "#15111d",
                  border: "1px solid rgba(124,58,237,.3)",
                  animation: "vNodeIn .4s ease .8s both",
                }}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#a78bfa"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#e8e3f2",
                  }}
                >
                  Operaciones
                </span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontSize: "34px",
                  fontWeight: 700,
                  lineHeight: "1.1",
                  letterSpacing: "-.02em",
                  background: "linear-gradient(120deg,#00ff88,#a855f7)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                  animation: "vClose .7s ease .9s both",
                }}
              >
                Automatizá procesos internos
              </div>
              <div
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "18px",
                  fontWeight: 500,
                  color: "rgba(255,255,255,.7)",
                  maxWidth: "560px",
                  animation: "vClose .7s ease 1.05s both",
                }}
              >
                Conectá todos tus sistemas en una sola plataforma inteligente
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
