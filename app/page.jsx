"use client";

import React, { useState } from "react";

// ================= DESIGN =================
const RED = "#be302c";
const BG = "#050505";
const BORDER = "#1c1c1c";
const TEXT = "#ffffff";
const MUTED = "#8a8a8a";

// ================= GLOBAL =================
const GLOBAL_STYLE = `
* { box-sizing: border-box; }

body {
  margin: 0;
  background: radial-gradient(circle at top, #111318 0%, #050505 70%);
  color: ${TEXT};
  font-family: Inter, sans-serif;
}

button {
  cursor: pointer;
  transition: all 0.2s ease;
}
`;

// ================= API =================
async function callAPI(systemPrompt, userMessage) {
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
function Card({ children }) {
  return (
    <div
      style={{
        background: "linear-gradient(145deg, #111318, #0b0c10)",
        border: `1px solid ${BORDER}`,
        borderRadius: 20,
        padding: 20,
        marginBottom: 14,
        boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
      }}
    >
      {children}
    </div>
  );
}

function LaneCard({ title, desc, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        padding: 20,
        borderRadius: 18,
        border: `1px solid ${BORDER}`,
        background: "linear-gradient(145deg, #101217, #0a0b0f)",
        textAlign: "left",
        marginBottom: 12,
        boxShadow: "0 6px 20px rgba(0,0,0,0.5)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.02)";
        e.currentTarget.style.border = `1px solid ${RED}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.border = `1px solid ${BORDER}`;
      }}
    >
      <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 4 }}>
        {title}
      </div>
      <div style={{ color: MUTED, fontSize: 13 }}>
        {desc}
      </div>
    </button>
  );
}

function Button({ text, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        padding: 16,
        borderRadius: 14,
        border: "none",
        background: RED,
        color: "#fff",
        fontWeight: 900,
        fontSize: 15,
        marginTop: 10,
      }}
    >
      {text}
    </button>
  );
}

// ================= APP =================
export default function App() {
  const [screen, setScreen] = useState("home");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    setOutput(null);

    const res = await callAPI(
      "You are Leon Charles. Direct. No fluff.",
      input || "Give a strong content idea"
    );

    setOutput(res);
    setLoading(false);
  };

  return (
    <div
      style={{
        maxWidth: 420,
        margin: "0 auto",
        padding: 16,
        minHeight: "100vh",
      }}
    >
      <style>{GLOBAL_STYLE}</style>

      {/* HEADER */}
      <Card>
        <p style={{ color: RED, fontSize: 12, fontWeight: 900 }}>PRIVATE</p>

        <h1 style={{ margin: "6px 0", fontSize: 34, letterSpacing: "-0.03em" }}>
          Content Engine
        </h1>

        <p style={{ color: MUTED }}>
          Unfiltered · Coaching · Copy
        </p>
      </Card>

      {/* HOME */}
      {screen === "home" && (
        <>
          <LaneCard
            title="Unfiltered"
            desc="Reaction · Opinion · Bro Did You Know"
            onClick={() => setScreen("generator")}
          />

          <LaneCard
            title="Coaching"
            desc="Hooks · Reels · Scripts"
            onClick={() => setScreen("generator")}
          />

          <LaneCard
            title="Copy System"
            desc="Captions · CTA · Rewrite"
            onClick={() => setScreen("generator")}
          />

          <LaneCard
            title="YouTube Expansion"
            desc="Titles · Clips · Structure"
            onClick={() => setScreen("generator")}
          />
        </>
      )}

      {/* GENERATOR */}
      {screen === "generator" && (
        <>
          <Card>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter topic..."
              style={{
                width: "100%",
                height: 140,
                background: "#0a0b0f",
                border: `1px solid ${BORDER}`,
                borderRadius: 14,
                padding: 14,
                color: TEXT,
                fontSize: 14,
              }}
            />

            <Button text="Generate" onClick={generate} />
          </Card>

          {loading && (
            <p style={{ color: MUTED }}>Generating...</p>
          )}

          {output && !output.error && (
            <Card>
              <pre style={{ whiteSpace: "pre-wrap" }}>
                {JSON.stringify(output, null, 2)}
              </pre>
            </Card>
          )}

          {output?.error && (
            <p style={{ color: RED }}>{output.error}</p>
          )}

          <Button text="← Back" onClick={() => setScreen("home")} />
        </>
      )}
    </div>
  );
}
