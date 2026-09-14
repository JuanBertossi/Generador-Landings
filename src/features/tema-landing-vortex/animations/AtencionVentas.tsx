
import { useState, useEffect, useRef } from "react";

type Chip = { label: string };

type Message = {
  side: "user" | "ai";
  type: "text" | "product" | "date" | "check";
  text?: string;
  name?: string;
  storage?: string;
  price?: string;
  chips?: Chip[];
};

export default function VortexSalesAnimation() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [typing, setTyping] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
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
      await sleep(30);
    }
  };

  const send = (text: string) => {
    if (!text.trim()) return;
    push({ side: "user", type: "text", text });
    setInputText("");
  };

  useEffect(() => {
    mountedRef.current = true;

    const runSequence = async () => {
      while (mountedRef.current) {
        setMessages([]);
        setInputText("");
        setTyping(false);
        setSelectedDate(null);
        setPhase("chat");
        await sleep(900);

        await type("Me interesa un iPhone 14. ¿Tenés stock?");
        await sleep(280);
        send("Me interesa un iPhone 14. ¿Tenés stock?");
        await sleep(620);

        await showTyping(1150);
        push({
          side: "ai",
          type: "text",
          text: "¡Hola! Sí, tenemos stock disponible.",
        });
        await sleep(550);
        push({
          side: "ai",
          type: "product",
          name: "iPhone 14",
          storage: "128 GB · Nuevo",
          price: "USD 480",
        });
        await sleep(1500);

        await type("Perfecto. ¿Puedo reservar uno?");
        await sleep(250);
        send("Perfecto. ¿Puedo reservar uno?");
        await sleep(560);

        await showTyping(1000);
        push({
          side: "ai",
          type: "text",
          text: "Claro. ¿Qué día preferís retirarlo?",
        });
        await sleep(420);
        push({
          side: "ai",
          type: "date",
          chips: [{ label: "Hoy" }, { label: "Mañana" }, { label: "Pasado" }],
        });
        await sleep(950);
        setSelectedDate("Mañana");
        await sleep(750);

        await showTyping(1050);
        push({
          side: "ai",
          type: "check",
          text: "Reserva confirmada para mañana a las 15:00 hs.",
        });
        await sleep(3400);
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
    background: "#1b2420",
    color: "#e9efe9",
    fontSize: "13.5px",
    lineHeight: "1.45",
    boxShadow: "0 2px 8px rgba(0,0,0,.3)",
    animation: "vMsgIn .35s ease both",
  };

  const userBubbleStyle: React.CSSProperties = {
    maxWidth: "80%",
    padding: "10px 13px",
    borderRadius: "16px 16px 4px 16px",
    background: "linear-gradient(135deg,#067a55,#0aa06d)",
    color: "#eafff5",
    fontSize: "13.5px",
    lineHeight: "1.45",
    boxShadow: "0 2px 10px rgba(0,160,109,.25)",
    animation: "vMsgIn .35s ease both",
  };

  const chipBase: React.CSSProperties = {
    padding: "8px 14px",
    borderRadius: "12px",
    fontSize: "13px",
    fontWeight: 600,
    fontFamily: "'Bricolage Grotesque', sans-serif",
    border: "1px solid rgba(255,255,255,.12)",
    color: "rgba(255,255,255,.7)",
    background: "#172019",
    transition: "all .3s ease",
    cursor: "default",
  };

  const chipSelected: React.CSSProperties = {
    ...chipBase,
    border: "1px solid rgba(0,255,136,.6)",
    color: "#06120c",
    background: "linear-gradient(135deg,#00ff88,#11a86a)",
    boxShadow: "0 0 16px rgba(0,255,136,.4)",
  };

  const isClosing = false;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700&family=Inter:wght@400;500;600;700&display=swap');
        @keyframes vFloaty { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-9px); } }
        @keyframes vGlowA { 0%, 100% { transform: translate(0,0) scale(1); opacity:.8; } 50% { transform: translate(30px,-20px) scale(1.1); opacity:1; } }
        @keyframes vGlowB { 0%, 100% { transform: translate(0,0) scale(1); opacity:.7; } 50% { transform: translate(-30px,20px) scale(1.12); opacity:.95; } }
        @keyframes vMsgIn { from { opacity:0; transform: translateY(10px) scale(.96); } to { opacity:1; transform: translateY(0) scale(1); } }
        @keyframes vDot { 0%, 60%, 100% { transform: translateY(0); opacity:.45; } 30% { transform: translateY(-4px); opacity:1; } }
        @keyframes vCaret { 0%, 100% { opacity:1; } 50% { opacity:0; } }
        @keyframes vClose { from { opacity:0; transform: translateY(16px); } to { opacity:1; transform: translateY(0); } }
      `}</style>

      <div
        style={{
          position: "relative",
          width: "100%",
          height: "430px",
          minHeight: "400px",
          overflow: "hidden",
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
            left: "8%",
            top: "18%",
            width: "360px",
            height: "360px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(0,255,136,.28), transparent 68%)",
            filter: "blur(70px)",
            animation: "vGlowA 9s ease-in-out infinite",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: "6%",
            bottom: "12%",
            width: "380px",
            height: "380px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(124,58,237,.3), transparent 68%)",
            filter: "blur(70px)",
            animation: "vGlowB 11s ease-in-out infinite",
            pointerEvents: "none",
          }}
        />

        {/* Card wrapper */}
        <div
          style={{
            transition:
              "transform .8s cubic-bezier(.2,.7,.2,1), opacity .8s ease, filter .8s ease",
            transform: isClosing ? "scale(.9)" : "scale(1)",
            opacity: isClosing ? 0.28 : 1,
            filter: isClosing ? "blur(2px)" : "none",
            width: "100%",
            maxWidth: "344px",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "344px",
              height: "396px",
              display: "flex",
              flexDirection: "column",
              borderRadius: "26px",
              overflow: "hidden",
              background: "#0b110f",
              border: "1px solid rgba(255,255,255,.08)",
              boxShadow:
                "0 40px 90px -30px rgba(0,0,0,.8), 0 0 0 1px rgba(0,255,136,.04), 0 0 60px -20px rgba(0,255,136,.25)",
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
                background: "linear-gradient(180deg,#111a16,#0d1411)",
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
                  background: "linear-gradient(135deg,#00ff88,#7c3aed)",
                  flexShrink: 0,
                }}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#06120c"
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
                    border: "2px solid #0d1411",
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
                      color: "#22e07a",
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
                      color: "#7fe9b4",
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
                  "linear-gradient(180deg, rgba(0,255,136,.015), transparent 30%)",
              }}
            >
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    justifyContent:
                      m.side === "user" ? "flex-end" : "flex-start",
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

                  {m.type === "product" && (
                    <div
                      style={{
                        width: "228px",
                        padding: "11px",
                        borderRadius: "14px 14px 14px 6px",
                        background: "#172019",
                        border: "1px solid rgba(255,255,255,.07)",
                        boxShadow: "0 4px 14px rgba(0,0,0,.35)",
                        animation: "vMsgIn .35s ease both",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: "12px",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            width: "52px",
                            height: "52px",
                            borderRadius: "11px",
                            display: "grid",
                            placeItems: "center",
                            background:
                              "linear-gradient(135deg,#0e1a14,#1c2a22)",
                            border: "1px solid rgba(0,255,136,.18)",
                            flexShrink: 0,
                          }}
                        >
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#00ff88"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect width="14" height="20" x="5" y="2" rx="2.5" />
                            <path d="M12 18h.01" />
                          </svg>
                        </div>
                        <div
                          style={{
                            minWidth: 0,
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "'Bricolage Grotesque', sans-serif",
                              fontSize: "15px",
                              fontWeight: 600,
                              color: "#fff",
                              lineHeight: "1.15",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {m.name}
                          </span>
                          <span
                            style={{
                              fontSize: "11.5px",
                              color: "#9fb3a8",
                              marginTop: "2px",
                            }}
                          >
                            {m.storage}
                          </span>
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "8px",
                              marginTop: "4px",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "17px",
                                fontWeight: 700,
                                color: "#00ff88",
                              }}
                            >
                              {m.price}
                            </span>
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                                fontSize: "10.5px",
                                color: "#7fe9b4",
                              }}
                            >
                              <span
                                style={{
                                  width: "5px",
                                  height: "5px",
                                  borderRadius: "50%",
                                  background: "#22e07a",
                                }}
                              />
                              En stock
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {m.type === "date" && (
                    <div
                      style={{
                        display: "flex",
                        gap: "7px",
                        animation: "vMsgIn .35s ease both",
                      }}
                    >
                      {(m.chips ?? []).map((c) => (
                        <div
                          key={c.label}
                          style={
                            c.label === selectedDate ? chipSelected : chipBase
                          }
                        >
                          {c.label}
                        </div>
                      ))}
                    </div>
                  )}

                  {m.type === "check" && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        maxWidth: "240px",
                        padding: "11px 13px",
                        borderRadius: "16px 16px 16px 4px",
                        background:
                          "linear-gradient(135deg,rgba(0,255,136,.14),rgba(124,58,237,.1))",
                        border: "1px solid rgba(0,255,136,.28)",
                        animation: "vMsgIn .35s ease both",
                      }}
                    >
                      <span
                        style={{
                          flexShrink: 0,
                          width: "24px",
                          height: "24px",
                          borderRadius: "50%",
                          display: "grid",
                          placeItems: "center",
                          background: "#00ff88",
                        }}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#06120c"
                          strokeWidth="3.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                      <span
                        style={{
                          fontSize: "13.5px",
                          lineHeight: "1.4",
                          color: "#eafff5",
                          fontWeight: 500,
                        }}
                      >
                        {m.text}
                      </span>
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
                    background: "#1b2420",
                    animation: "vMsgIn .3s ease both",
                  }}
                >
                  <span
                    style={{
                      width: "7px",
                      height: "7px",
                      borderRadius: "50%",
                      background: "#8aa39a",
                      animation: "vDot 1.2s infinite",
                    }}
                  />
                  <span
                    style={{
                      width: "7px",
                      height: "7px",
                      borderRadius: "50%",
                      background: "#8aa39a",
                      animation: "vDot 1.2s infinite .2s",
                    }}
                  />
                  <span
                    style={{
                      width: "7px",
                      height: "7px",
                      borderRadius: "50%",
                      background: "#8aa39a",
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
                background: "#0d1411",
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
                  background: "#19211d",
                  border: "1px solid rgba(255,255,255,.06)",
                  fontSize: "13.5px",
                  color: "#e8efe9",
                }}
              >
                {!inputText ? (
                  <span style={{ color: "#5f6f67" }}>Escribí un mensaje…</span>
                ) : (
                  <>
                    <span>{inputText}</span>
                    <span
                      style={{
                        display: "inline-block",
                        width: "2px",
                        height: "16px",
                        marginLeft: "1px",
                        background: "#00ff88",
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
                    background: "#19211d",
                    flexShrink: 0,
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#8aa39a"
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
                    background: "linear-gradient(135deg,#00ff88,#11a86a)",
                    flexShrink: 0,
                    boxShadow: "0 0 16px rgba(0,255,136,.4)",
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#06120c"
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
              gap: "18px",
              textAlign: "center",
              padding: "40px",
              zIndex: 5,
            }}
          >
            <div
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontSize: "38px",
                fontWeight: 700,
                lineHeight: "1.1",
                letterSpacing: "-.02em",
                background: "linear-gradient(120deg,#00ff88,#a855f7)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                animation: "vClose .7s ease both",
              }}
            >
              Atiende, asesora y agenda 24/7
            </div>
            <div
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "19px",
                fontWeight: 500,
                color: "rgba(255,255,255,.7)",
                maxWidth: "560px",
                animation: "vClose .7s ease .15s both",
              }}
            >
              Convierte consultas en ventas automáticamente
            </div>
          </div>
        )}
      </div>
    </>
  );
}
