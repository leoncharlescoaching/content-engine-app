"use client";

import React, { useState, useEffect } from "react";

// ================= DESIGN =================
const RED = "#be302c";
const BG = "#050505";
const CARD = "#0f0f0f";
const BORDER = "#1c1c1c";
const TEXT = "#ffffff";
const SUB = "#8a8a8a";

// ================= GLOBAL =================
const GLOBAL_STYLE = `
* { box-sizing: border-box; }
body { margin:0; background:${BG}; color:${TEXT}; font-family: Inter, sans-serif; }
button { cursor:pointer; }
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

// ================= COMPONENTS =================
function Card({ children }) {
  return (
    <div
      style={{
        background: CARD,
        border: `1px solid ${BORDER}`,
        borderRadius: 14,
        padding: 18,
        marginBottom: 14,
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
        borderRadius: 10,
        border: "none",
        background: RED,
        color: "#fff",
        fontWeight: 800,
        marginTop: 10,
      }}
    >
      {text}
    </button>
  );
}

// ================= APP =================
export default function App() {
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
        <h1 style={{ margin: "6px 0", fontSize: 28 }}>
          Content Engine
        </h1>
        <p style={{ color: SUB }}>
          Unfiltered · Coaching · Copy
        </p>
      </Card>

      {/* INPUT */}
      <Card>
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

      {/* OUTPUT */}
      {loading && (
        <p style={{ color: SUB }}>Generating...</p>
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
    </div>
  );
}
