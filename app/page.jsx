"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

// ================= DESIGN =================
const RED = "#be302c";
const BG = "#050505";
const SURFACE = "#0f1014";
const SURFACE_2 = "#15171d";
const BORDER = "#23262f";
const TEXT = "#f5f7fb";
const MUTED = "#a4a8b3";
const MUTED_2 = "#7e848f";
const SOFT_RED = "#1b0d0d";
const MAX_WIDTH = 430;

// ================= GLOBAL =================
const GLOBAL_STYLE = `
* { box-sizing: border-box; }
body {
  margin: 0;
  background: radial-gradient(circle at top, #12141b 0%, #050505 70%);
  color: ${TEXT};
  font-family: Inter, sans-serif;
}
button { cursor: pointer; }
`;

// ================= API =================
async function callClaude(systemPrompt, userMessage) {
  const res = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemPrompt,
      userMessage,
    }),
  });

  const data = await res.json();

  if (!res.ok) return { error: data.error || "Error" };

  try {
    return JSON.parse(data.text);
  } catch {
    return { error: "Parse failed" };
  }
}

// ================= UI =================
function AppShell({ children }) {
  return (
    <div
      style={{
        maxWidth: MAX_WIDTH,
        margin: "0 auto",
        minHeight: "100vh",
        padding: "16px",
      }}
    >
      {children}
    </div>
  );
}

function Card({ children }) {
  return (
    <div
      style={{
        background: SURFACE,
        border: `1px solid ${BORDER}`,
        borderRadius: 20,
        padding: 18,
        marginBottom: 12,
      }}
    >
      {children}
    </div>
  );
}

function Button({ text, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        padding: 14,
        borderRadius: 14,
        border: "none",
        background: RED,
        color: "#fff",
        fontWeight: 900,
        marginTop: 10,
      }}
    >
      {text}
    </button>
  );
}

function LaneCard({ title, desc, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        padding: 18,
        borderRadius: 18,
        border: `1px solid ${BORDER}`,
        background: SURFACE,
        textAlign: "left",
        marginBottom: 10,
      }}
    >
      <div style={{ fontWeight: 900, fontSize: 18 }}>{title}</div>
      <div style={{ color: MUTED, fontSize: 13 }}>{desc}</div>
    </button>
  );
}

// ================= SCREENS =================
function HomeScreen({ setScreen }) {
  return (
    <AppShell>
      <Card>
        <p style={{ color: RED, fontSize: 12, fontWeight: 900 }}>PRIVATE</p>
        <h1 style={{ margin: "6px 0", fontSize: 32 }}>
          Content Engine
        </h1>
        <p style={{ color: MUTED }}>
          Unfiltered · Coaching · Copy
        </p>
      </Card>

      <LaneCard
        title="Unfiltered"
        desc="Reaction · Bro Did You Know"
        onClick={() => setScreen("unfiltered")}
      />

      <LaneCard
        title="Coaching"
        desc="Hooks · Reels · Scripts"
        onClick={() => setScreen("coaching")}
      />

      <LaneCard
        title="Copy System"
        desc="Captions · CTAs · Rewrite"
        onClick={() => setScreen("copy")}
      />

      <LaneCard
        title="YouTube Expansion"
        desc="Titles · Clips · Structure"
        onClick={() => setScreen("youtube")}
      />
    </AppShell>
  );
}

function Generator({ title }) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState(null);

  const generate = async () => {
    const res = await callClaude(
      "You are Leon Charles. Direct. No fluff.",
      input || "Give a strong idea"
    );
    setOutput(res);
  };

  return (
    <AppShell>
      <Card>
        <h2>{title}</h2>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter topic..."
          style={{
            width: "100%",
            height: 120,
            background: BG,
            border: `1px solid ${BORDER}`,
            borderRadius: 10,
            padding: 12,
            color: TEXT,
          }}
        />

        <Button text="Generate" onClick={generate} />
      </Card>

      {output && (
        <Card>
          <pre>{JSON.stringify(output, null, 2)}</pre>
        </Card>
      )}
    </AppShell>
  );
}

// ================= ROOT =================
export default function App() {
  const [screen, setScreen] = useState("home");

  return (
    <>
      <style>{GLOBAL_STYLE}</style>

      {screen === "home" && <HomeScreen setScreen={setScreen} />}
      {screen === "unfiltered" && <Generator title="Unfiltered" />}
      {screen === "coaching" && <Generator title="Coaching" />}
      {screen === "copy" && <Generator title="Copy System" />}
      {screen === "youtube" && <Generator title="YouTube Expansion" />}
    </>
  );
}
