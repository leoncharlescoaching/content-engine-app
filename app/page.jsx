"use client";

import { useState } from "react";

// ===== DESIGN =====
const RED = "#be302c";
const BG = "#050505";
const CARD = "#0f0f0f";
const BORDER = "#1c1c1c";
const TEXT = "#ffffff";
const SUB = "#8a8a8a";

// ===== API CALL =====
async function callAPI(input) {
  try {
    const res = await fetch("/api/claude", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemPrompt:
          "You are Leon Charles. Direct. No fluff. Call people out. Speak like a real person.",
        userMessage: input || "Give a strong content idea",
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { error: data.error || "Request failed" };
    }

    try {
      return JSON.parse(data.text);
    } catch {
      return { raw: data.text };
    }
  } catch (err) {
    return { error: "Network error" };
  }
}

// ===== COMPONENTS =====
function Card({ children }) {
  return (
    <div
      style={{
        background: CARD,
        border: `1px solid ${BORDER}`,
        borderRadius: 16,
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
        borderRadius: 12,
        border: "none",
        background: RED,
        color: "#fff",
        fontWeight: 800,
        fontSize: 14,
        cursor: "pointer",
      }}
    >
      {text}
    </button>
  );
}

// ===== MAIN APP =====
export default function Page() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    setOutput(null);

    const result = await callAPI(input);

    setOutput(result);
    setLoading(false);
  };

  return (
    <div
      style={{
        maxWidth: 420,
        margin: "0 auto",
        padding: 16,
        minHeight: "100vh",
        background: BG,
        color: TEXT,
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* HEADER */}
      <Card>
        <p
          style={{
            color: RED,
            fontSize: 11,
            fontWeight: 900,
            letterSpacing: "0.1em",
          }}
        >
          PRIVATE
        </p>

        <h1
          style={{
            margin: "6px 0",
            fontSize: 30,
            fontWeight: 900,
          }}
        >
          Content Engine
        </h1>

        <p style={{ color: SUB, fontSize: 13 }}>
          Unfiltered · Coaching · Copy
        </p>
      </Card>

      {/* INPUT */}
      <Card>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Drop a topic..."
          style={{
            width: "100%",
            height: 130,
            background: BG,
            border: `1px solid ${BORDER}`,
            borderRadius: 12,
            padding: 14,
            color: TEXT,
            fontSize: 14,
          }}
        />

        <div style={{ marginTop: 10 }}>
          <Button text="Generate" onClick={generate} />
        </div>
      </Card>

      {/* LOADING */}
      {loading && (
        <p style={{ textAlign: "center", color: SUB }}>
          Generating...
        </p>
      )}

      {/* OUTPUT */}
      {output && !output.error && (
        <Card>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              fontSize: 13,
              lineHeight: 1.6,
            }}
          >
            {typeof output === "object"
              ? JSON.stringify(output, null, 2)
              : output}
          </pre>
        </Card>
      )}

      {/* ERROR */}
      {output?.error && (
        <p style={{ color: RED, textAlign: "center" }}>
          {output.error}
        </p>
      )}
    </div>
  );
}
