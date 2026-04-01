"use client";

import React, { useState } from "react";

// ================= DESIGN =================
const RED = "#be302c";
const BG = "#050505";
const CARD = "#0f1115";
const CARD_2 = "#0a0c10";
const BORDER = "#1f2329";
const TEXT = "#ffffff";
const MUTED = "#9ca3af";
const MAX_WIDTH = 420;

// ================= GLOBAL =================
const GLOBAL_STYLE = `
* { box-sizing: border-box; }

html, body {
  margin: 0;
  padding: 0;
  min-height: 100%;
  background: ${BG};
  color: ${TEXT};
  font-family: Inter, sans-serif;
}

body {
  min-height: 100vh;
}

button, textarea {
  font-family: inherit;
}

button {
  cursor: pointer;
  transition: all 0.2s ease;
}

textarea:focus {
  outline: none;
}

pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
}
`;

// ================= API =================
async function callAPI(systemPrompt, userMessage) {
  try {
    const res = await fetch("/api/claude", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemPrompt,
        userMessage,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { error: data.error || "Request failed" };
    }

    try {
      return JSON.parse(data.text);
    } catch {
      return { raw: data.text || "No response text returned." };
    }
  } catch {
    return { error: "Network error" };
  }
}

// ================= UI =================
function Card({ children }) {
  return (
    <div
      style={{
        background: CARD,
        border: `1px solid ${BORDER}`,
        borderRadius: 18,
        padding: 20,
        marginBottom: 16,
        boxShadow: "0 8px 25px rgba(0,0,0,0.4)",
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
        padding: 18,
        borderRadius: 16,
        border: `1px solid ${BORDER}`,
        background: CARD,
        textAlign: "left",
        marginBottom: 14,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.border = `1px solid ${RED}`;
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.border = `1px solid ${BORDER}`;
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div
        style={{
          fontWeight: 900,
          fontSize: 20,
          marginBottom: 6,
          color: TEXT,
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </div>

      <div
        style={{
          color: MUTED,
          fontSize: 13,
          lineHeight: 1.45,
        }}
      >
        {desc}
      </div>
    </button>
  );
}

function PrimaryButton({ text, onClick, disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%",
        padding: 16,
        borderRadius: 14,
        border: "none",
        background: disabled ? "#4a4a4a" : RED,
        color: "#fff",
        fontWeight: 900,
        fontSize: 15,
        marginTop: 12,
        opacity: disabled ? 0.7 : 1,
      }}
    >
      {text}
    </button>
  );
}

function SecondaryButton({ text, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        padding: 15,
        borderRadius: 14,
        border: `1px solid ${BORDER}`,
        background: CARD,
        color: TEXT,
        fontWeight: 800,
        fontSize: 14,
        marginTop: 10,
      }}
    >
      {text}
    </button>
  );
}

// ================= CONTENT CONFIG =================
const SCREEN_CONFIG = {
  unfiltered: {
    title: "Unfiltered",
    desc: "Reaction · Opinion · Bro Did You Know",
    placeholder: "Enter topic... e.g. crazy fact people wouldn't believe is real",
    systemPrompt:
      "You are Leon Charles. Direct. No fluff. Give strong unfiltered content ideas, hooks, captions and punchy scripts. Return JSON where possible.",
  },
  coaching: {
    title: "Coaching",
    desc: "Hooks · Reels · Scripts",
    placeholder: "Enter topic... e.g. dads skipping the gym because they're tired",
    systemPrompt:
      "You are Leon Charles. Direct. No fluff. Create coaching content for busy dads. Strong hooks. Real talk. Return JSON where possible.",
  },
  copy: {
    title: "Copy System",
    desc: "Captions · CTA · Rewrite",
    placeholder: "Enter topic or paste copy to improve...",
    systemPrompt:
      "You are Leon Charles. Direct. No fluff. Improve captions, CTAs and copy. Make it sharper, cleaner and more human. Return JSON where possible.",
  },
  youtube: {
    title: "YouTube Expansion",
    desc: "Titles · Clips · Structure",
    placeholder: "Enter topic... e.g. why dads lose shape after kids",
    systemPrompt:
      "You are Leon Charles. Direct. No fluff. Build YouTube ideas, titles, structure, clips and angles. Return JSON where possible.",
  },
};

// ================= GENERATOR SCREEN =================
function GeneratorScreen({ screenKey, onBack }) {
  const config = SCREEN_CONFIG[screenKey];
  const [input, setInput] = useState("");
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    setOutput(null);

    const result = await callAPI(
      config.systemPrompt,
      input || `Give me a strong ${config.title} idea`
    );

    setOutput(result);
    setLoading(false);
  };

  return (
    <>
      <Card>
        <div
          style={{
            color: RED,
            fontSize: 12,
            fontWeight: 900,
            marginBottom: 6,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          {config.title}
        </div>

        <h2
          style={{
            margin: "0 0 6px",
            fontSize: 28,
            color: TEXT,
            letterSpacing: "-0.02em",
          }}
        >
          {config.title}
        </h2>

        <p
          style={{
            margin: "0 0 16px",
            color: MUTED,
            fontSize: 14,
          }}
        >
          {config.desc}
        </p>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={config.placeholder}
          style={{
            width: "100%",
            height: 150,
            background: CARD_2,
            border: `1px solid ${BORDER}`,
            borderRadius: 14,
            padding: 14,
            color: TEXT,
            fontSize: 14,
            lineHeight: 1.5,
          }}
        />

        <PrimaryButton text={loading ? "Generating..." : "Generate"} onClick={generate} disabled={loading} />
        <SecondaryButton text="← Back" onClick={onBack} />
      </Card>

      {loading && (
        <p
          style={{
            color: MUTED,
            textAlign: "center",
            marginTop: 10,
          }}
        >
          Generating...
        </p>
      )}

      {output && !output.error && (
        <Card>
          <div
            style={{
              color: RED,
              fontSize: 12,
              fontWeight: 900,
              marginBottom: 10,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Output
          </div>

          <pre
            style={{
              fontSize: 13,
              lineHeight: 1.6,
              color: TEXT,
            }}
          >
            {typeof output === "object"
              ? JSON.stringify(output, null, 2)
              : String(output)}
          </pre>
        </Card>
      )}

      {output?.error && (
        <Card>
          <div
            style={{
              color: RED,
              fontWeight: 800,
              fontSize: 14,
            }}
          >
            {output.error}
          </div>
        </Card>
      )}
    </>
  );
}

// ================= APP =================
export default function App() {
  const [screen, setScreen] = useState("home");

  return (
    <div
      style={{
        maxWidth: MAX_WIDTH,
        margin: "0 auto",
        padding: 18,
        minHeight: "100vh",
      }}
    >
      <style>{GLOBAL_STYLE}</style>

      <Card>
        <p
          style={{
            color: RED,
            fontSize: 12,
            fontWeight: 900,
            margin: 0,
            textTransform: "uppercase",
          }}
        >
          Private
        </p>

        <h1
          style={{
            margin: "10px 0 8px",
            fontSize: 32,
            letterSpacing: "-0.02em",
            color: TEXT,
          }}
        >
          Content Engine
        </h1>

        <p
          style={{
            margin: 0,
            color: MUTED,
            fontSize: 14,
          }}
        >
          Unfiltered · Coaching · Copy
        </p>
      </Card>

      {screen === "home" && (
        <>
          <LaneCard
            title="Unfiltered"
            desc="Reaction · Opinion · Bro Did You Know"
            onClick={() => setScreen("unfiltered")}
          />

          <LaneCard
            title="Coaching"
            desc="Hooks · Reels · Scripts"
            onClick={() => setScreen("coaching")}
          />

          <LaneCard
            title="Copy System"
            desc="Captions · CTA · Rewrite"
            onClick={() => setScreen("copy")}
          />

          <LaneCard
            title="YouTube Expansion"
            desc="Titles · Clips · Structure"
            onClick={() => setScreen("youtube")}
          />
        </>
      )}

      {screen === "unfiltered" && (
        <GeneratorScreen screenKey="unfiltered" onBack={() => setScreen("home")} />
      )}

      {screen === "coaching" && (
        <GeneratorScreen screenKey="coaching" onBack={() => setScreen("home")} />
      )}

      {screen === "copy" && (
        <GeneratorScreen screenKey="copy" onBack={() => setScreen("home")} />
      )}

      {screen === "youtube" && (
        <GeneratorScreen screenKey="youtube" onBack={() => setScreen("home")} />
      )}
    </div>
  );
}
