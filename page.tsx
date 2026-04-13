"use client";
import { useState, useEffect } from "react";

const TICKERS = ["AAPL", "NVDA", "META", "MSFT", "TSLA"];

const NEWS = [
  { headline: "Fed holds rates steady, signals two cuts in 2026", source: "Reuters", age: "2h ago", sentiment: "positive" },
  { headline: "NVDA datacenter demand surges ahead of earnings report", source: "Bloomberg", age: "3h ago", sentiment: "positive" },
  { headline: "Apple expands AI features across iPhone lineup", source: "WSJ", age: "4h ago", sentiment: "positive" },
  { headline: "Oil dips on weakening demand outlook from China", source: "FT", age: "5h ago", sentiment: "negative" },
  { headline: "Microsoft Azure revenue beats estimates by 4%", source: "CNBC", age: "6h ago", sentiment: "positive" },
  { headline: "Inflation data comes in slightly above expectations", source: "Reuters", age: "7h ago", sentiment: "negative" },
];

const SIGNALS = [
  { ticker: "AAPL", action: "hold", confidence: 82, price: "$179.40", change: "+1.2%" },
  { ticker: "NVDA", action: "buy",  confidence: 74, price: "$875.20", change: "+3.4%" },
  { ticker: "META", action: "sell", confidence: 68, price: "$512.80", change: "-0.8%" },
  { ticker: "MSFT", action: "hold", confidence: 71, price: "$420.10", change: "+0.5%" },
  { ticker: "TSLA", action: "buy",  confidence: 61, price: "$248.60", change: "+2.1%" },
];

const INDICATORS = [
  { name: "RSI (14)",  value: "62.4",  label: "Neutral",   type: "hold" },
  { name: "MACD",      value: "+0.42", label: "Bullish",   type: "buy"  },
  { name: "Bollinger", value: "2.1%",  label: "Tight",     type: "hold" },
  { name: "50-day MA", value: "$174",  label: "Above",     type: "buy"  },
  { name: "200-day MA",value: "$161",  label: "Above",     type: "buy"  },
  { name: "Volume",    value: "1.3×",  label: "Above avg", type: "buy"  },
];

const sparkData: Record<string, number[]> = {
  AAPL: [170,171,172,171,173,174,175,176,177,178,179],
  NVDA: [860,855,862,870,868,872,875,871,874,876,875],
  META: [520,518,515,516,514,513,512,511,514,513,512],
  MSFT: [416,417,418,419,418,420,419,421,420,420,420],
  TSLA: [241,243,245,244,246,247,248,247,249,248,248],
};

const aiMessages: Record<string, string> = {
  AAPL: "RSI at 62 — not overbought. MACD showing a bullish crossover. Sentiment positive. Hold and watch $175 support.",
  NVDA: "Strong institutional buying detected. Earnings expectations revised upward. RSI 58 — room to run. Consider buying on any minor pullback.",
  META: "Recent ad revenue guidance came in soft. RSI approaching overbought at 71. Recommend trimming position or setting a tight stop-loss.",
  MSFT: "Azure cloud numbers solid. No immediate catalyst either way. RSI neutral at 55. Hold and reassess after next earnings.",
  TSLA: "Delivery numbers beat estimates. Short interest declining. Momentum building. Potential breakout above $250 resistance.",
};

function Sparkline({ color, data }: { color: string; data: number[] }) {
  const w = 80;
  const h = 28;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / (max - min || 1)) * h;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function PriceChart() {
  const prices = [171.2,172.1,171.8,173.4,174.0,173.5,175.2,176.1,175.8,177.0,177.5,178.2,179.1,179.4];
  const labels = ["9:30","10","10:30","11","11:30","12","12:30","1","1:30","2","2:30","3","3:30","4"];
  const w = 600;
  const h = 160;
  const padTop = 10;
  const padRight = 10;
  const padBottom = 24;
  const padLeft = 40;
  const cw = w - padLeft - padRight;
  const ch = h - padTop - padBottom;
  const min = Math.min(...prices) - 0.5;
  const max = Math.max(...prices) + 0.5;
  const px = (i: number) => padLeft + (i / (prices.length - 1)) * cw;
  const py = (v: number) => padTop + ch - ((v - min) / (max - min)) * ch;
  const polyPoints = prices.map((v, i) => `${px(i)},${py(v)}`).join(" ");
  const fillPath = `M ${px(0)},${py(prices[0])} L ${prices.map((v, i) => `${px(i)},${py(v)}`).join(" L ")} L ${px(prices.length - 1)},${h - padBottom} L ${px(0)},${h - padBottom} Z`;
  const gridYs = [min, (min + max) / 2, max];

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: "auto" }}>
      <defs>
        <linearGradient id="fillGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22c55e" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
        </linearGradient>
      </defs>
      {gridYs.map((v) => (
        <g key={v}>
          <line x1={padLeft} x2={w - padRight} y1={py(v)} y2={py(v)} stroke="rgba(128,128,128,0.12)" strokeWidth="1" />
          <text x={padLeft - 4} y={py(v) + 4} textAnchor="end" fontSize="9" fill="#888">${v.toFixed(0)}</text>
        </g>
      ))}
      <path d={fillPath} fill="url(#fillGrad)" />
      <polyline points={polyPoints} fill="none" stroke="#22c55e" strokeWidth="1.8" strokeLinejoin="round" />
      {labels
        .filter((_, i) => i % 2 === 0)
        .map((l, idx) => (
          <text key={l} x={px(idx * 2)} y={h - 4} textAnchor="middle" fontSize="9" fill="#888">{l}</text>
        ))}
    </svg>
  );
}

function Badge({ type, children }: { type: string; children: React.ReactNode }) {
  const styles: Record<string, { background: string; color: string }> = {
    buy:      { background: "#dcfce7", color: "#166534" },
    sell:     { background: "#fee2e2", color: "#991b1b" },
    hold:     { background: "#f3f4f6", color: "#6b7280" },
    positive: { background: "#dcfce7", color: "#166534" },
    negative: { background: "#fee2e2", color: "#991b1b" },
    neutral:  { background: "#f3f4f6", color: "#6b7280" },
  };
  const s = styles[type] || styles.hold;
  return (
    <span style={{ ...s, fontSize: 11, padding: "2px 8px", borderRadius: 20, fontWeight: 500, whiteSpace: "nowrap" }}>
      {children}
    </span>
  );
}

function ConfBar({ value }: { value: number }) {
  const color = value >= 75 ? "#22c55e" : value >= 60 ? "#f59e0b" : "#ef4444";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{ flex: 1, height: 4, background: "#e5e7eb", borderRadius: 2 }}>
        <div style={{ width: `${value}%`, height: "100%", background: color, borderRadius: 2 }} />
      </div>
      <span style={{ fontSize: 11, color: "#6b7280", minWidth: 28 }}>{value}%</span>
    </div>
  );
}

export default function Dashboard() {
  const [activeTicker, setActiveTicker] = useState("AAPL");
  const [autoTrade, setAutoTrade] = useState(false);
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const activeSignal = SIGNALS.find((s) => s.ticker === activeTicker);

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#e8e8ec", fontFamily: "'DM Mono', 'Courier New', monospace" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@400;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a0f; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
        .ticker-btn { background: transparent; border: 0.5px solid #2a2a35; color: #888; padding: 5px 12px; border-radius: 6px; cursor: pointer; font-size: 12px; font-family: 'DM Mono', monospace; transition: all 0.15s; }
        .ticker-btn:hover { border-color: #555; color: #ccc; }
        .ticker-btn.active { background: #22c55e18; border-color: #22c55e66; color: #22c55e; }
        .card { background: #111118; border: 0.5px solid #1e1e28; border-radius: 12px; padding: 16px; }
        .row-hover { transition: background 0.1s; border-radius: 6px; padding: 7px 8px; }
        .row-hover:hover { background: #ffffff08; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.4s ease forwards; }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        .pulse { animation: pulse 2s infinite; }
      `}</style>

      {/* Nav */}
      <div style={{ borderBottom: "0.5px solid #1e1e28", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, background: "#22c55e", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <polyline points="1,10 4,6 7,8 10,3 13,5" stroke="#000" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
            </svg>
          </div>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15, letterSpacing: "0.02em" }}>TRADEAI</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 11, color: "#555" }}>{time}</span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span className="pulse" style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
            <span style={{ fontSize: 11, color: "#22c55e" }}>Market open</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Metrics */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 10 }} className="fade-up">
          {[
            { label: "Portfolio value", value: "$84,320", sub: "+$1,240 today", up: true },
            { label: "Today's P&L",     value: "+1.49%",  sub: "6 wins · 2 losses", up: true },
            { label: "AI confidence",   value: "78%",     sub: "Moderate bullish", up: null },
            { label: "Open positions",  value: "4",       sub: "2 tech · 1 energy · 1 ETF", up: null },
          ].map((m) => (
            <div key={m.label} className="card">
              <div style={{ fontSize: 10, color: "#555", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>{m.label}</div>
              <div style={{ fontSize: 22, fontWeight: 500, color: m.up === true ? "#22c55e" : "#e8e8ec", fontFamily: "'Syne', sans-serif" }}>{m.value}</div>
              <div style={{ fontSize: 11, color: m.up === true ? "#22c55e99" : "#555", marginTop: 3 }}>{m.sub}</div>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 14 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

            {/* Chart */}
            <div className="card fade-up">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 18 }}>{activeTicker}</span>
                  <span style={{ fontSize: 11, color: "#555", marginLeft: 10 }}>1 day · {activeSignal?.price}</span>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  {TICKERS.map((t) => (
                    <button key={t} className={`ticker-btn${activeTicker === t ? " active" : ""}`} onClick={() => setActiveTicker(t)}>{t}</button>
                  ))}
                </div>
              </div>
              <PriceChart />
            </div>

            {/* Indicators */}
            <div className="card fade-up">
              <div style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Technical indicators · {activeTicker}</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 8 }}>
                {INDICATORS.map((ind) => (
                  <div key={ind.name} style={{ border: "0.5px solid #1e1e28", borderRadius: 8, padding: "10px 12px" }}>
                    <div style={{ fontSize: 10, color: "#555", marginBottom: 4 }}>{ind.name}</div>
                    <div style={{ fontSize: 15, fontWeight: 500, color: "#e8e8ec", marginBottom: 4 }}>{ind.value}</div>
                    <Badge type={ind.type}>{ind.label}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

            {/* AI panel */}
            <div className="card fade-up">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: "0.08em" }}>AI analysis</span>
                <span style={{ fontSize: 10, background: "#1e3a2a", color: "#22c55e", padding: "2px 8px", borderRadius: 20 }}>Claude</span>
              </div>
              <p style={{ fontSize: 12, color: "#aaa", lineHeight: 1.7, marginBottom: 14 }}>{aiMessages[activeTicker]}</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderTop: "0.5px solid #1e1e28" }}>
                <span style={{ fontSize: 12, color: "#777" }}>Auto-trade</span>
                <div onClick={() => setAutoTrade(!autoTrade)} style={{ width: 36, height: 20, background: autoTrade ? "#22c55e" : "#2a2a35", borderRadius: 10, position: "relative", cursor: "pointer", transition: "background 0.2s" }}>
                  <div style={{ width: 14, height: 14, background: "#fff", borderRadius: "50%", position: "absolute", top: 3, left: autoTrade ? 19 : 3, transition: "left 0.2s" }} />
                </div>
              </div>
              {autoTrade && (
                <div style={{ fontSize: 11, color: "#f59e0b", background: "#f59e0b18", borderRadius: 6, padding: "6px 10px", marginTop: 6 }}>
                  ⚠ Auto-trade on. Paper trading only.
                </div>
              )}
            </div>

            {/* Signals */}
            <div className="card fade-up" style={{ flex: 1 }}>
              <div style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>AI trade signals</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {SIGNALS.map((s) => (
                  <div key={s.ticker} className="row-hover" style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={() => setActiveTicker(s.ticker)}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: "#1e1e28", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 500, color: "#888" }}>{s.ticker}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 12, fontWeight: 500, color: "#e8e8ec" }}>{s.price}</span>
                        <span style={{ fontSize: 11, color: s.change.startsWith("+") ? "#22c55e" : "#ef4444" }}>{s.change}</span>
                      </div>
                      <ConfBar value={s.confidence} />
                    </div>
                    <Badge type={s.action}>{s.action.toUpperCase()}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>

          {/* Watchlist */}
          <div className="card fade-up">
            <div style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Watchlist</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {SIGNALS.map((s) => (
                <div key={s.ticker} className="row-hover" style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => setActiveTicker(s.ticker)}>
                  <span style={{ fontSize: 12, fontWeight: 500, minWidth: 40 }}>{s.ticker}</span>
                  <Sparkline color={s.change.startsWith("+") ? "#22c55e" : "#ef4444"} data={sparkData[s.ticker]} />
                  <span style={{ flex: 1, fontSize: 12, color: "#aaa", textAlign: "right" }}>{s.price}</span>
                  <span style={{ fontSize: 11, color: s.change.startsWith("+") ? "#22c55e" : "#ef4444", minWidth: 44, textAlign: "right" }}>{s.change}</span>
                </div>
              ))}
            </div>
          </div>

          {/* News */}
          <div className="card fade-up">
            <div style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Market news · AI sentiment</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {NEWS.map((n, i) => (
                <div key={i} className="row-hover" style={{ borderBottom: i < NEWS.length - 1 ? "0.5px solid #1a1a22" : "none", paddingBottom: 8, marginBottom: 2 }}>
                  <div style={{ fontSize: 12, color: "#ccc", lineHeight: 1.4, marginBottom: 5 }}>{n.headline}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 10, color: "#555" }}>{n.source} · {n.age}</span>
                    <Badge type={n.sentiment}>{n.sentiment}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
