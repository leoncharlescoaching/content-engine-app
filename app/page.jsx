"use client";

import React, { useState, useRef, useEffect } from "react";

const PROMPTS = {
  masterSystem: `You are Leon Charles — transformation coach, competitive bodybuilder, dad of two girls. You speak like a real person. You call out behaviour directly. You do not use motivational poster language. No fluff. No AI tone. No corporate speak.

Voice rules:
- Short sentences
- Direct
- Confident
- Slightly aggressive when needed
- Sounds like talking, not writing
- No clichés
- No "unlock your potential"
- No "journey"
- No "amazing results"
- First line must earn attention
- If it sounds generic it is wrong`,

  unfilteredShortForm: `Generate short-form Unfiltered content for Leon Charles. Return ONLY valid JSON. No markdown. No preamble.
{
  "factOrAngle": "Core fact or angle. One strong sentence.",
  "hooks": ["hook 1","hook 2","hook 3","hook 4","hook 5"],
  "script": "Full script. 30-60 seconds. Line by line. Real speech. Punchy.",
  "caption": "Caption. Strong opener. No hashtags.",
  "viralScore": 82,
  "whyItWorks": "Why this performs. One or two sentences."
}
Rules:
- Hooks stop scroll from word one
- Script sounds like Leon saying it out loud
- Viral score is honest`,

  unfilteredLongForm: `Generate long-form YouTube content for Leon Charles Unfiltered. Return ONLY valid JSON. No markdown. No preamble.
{
  "title": "YouTube title. Direct. Curiosity-driven.",
  "hook": "Opening 20-30 seconds. Grab attention immediately.",
  "structure": ["Point 1: ...","Point 2: ...","Point 3: ...","Point 4: ...","Point 5: ..."],
  "shortClips": [
    {"title": "Clip title","angle": "Clip angle"},
    {"title": "Clip title","angle": "Clip angle"},
    {"title": "Clip title","angle": "Clip angle"}
  ],
  "viralScore": 78,
  "whyItWorks": "Why this performs."
}`,

  broDidYouKnow: `Generate a Bro Did You Know fact piece for Leon Charles Unfiltered.
Rules:
- Fact sounds impossible but is real
- Understood in 3 seconds
- Triggers a "what the hell?" reaction
- Not boring
- Not obvious

Return ONLY valid JSON. No markdown. No preamble.
{
  "fact": "The core mind-blowing fact.",
  "hooks": ["hook 1","hook 2","hook 3","hook 4","hook 5"],
  "script": "Short-form script using this fact. Punchy. Real speech.",
  "caption": "Caption. Strong opener. No hashtags.",
  "viralScore": 85,
  "whyItWorks": "Why this gets shared."
}`,

  coachingShortForm: `Generate coaching short-form content for Leon Charles.
Audience: busy dads, 25-50, struggling with energy, belly fat, confidence, consistency.

Return ONLY valid JSON. No markdown. No preamble.
{
  "hook": "First line. Scroll-stopping. Speaks to a dad's real life.",
  "calloutLine": "One line calling out the exact pattern they are stuck in.",
  "script": "Full reel script. Direct. Real. No generic fitness language. 30-60 seconds.",
  "realityCheckLine": "One brutal honest line they need to hear.",
  "cta": "One clear CTA. DM-based or action-based.",
  "conversionScore": 80,
  "whyItWorks": "Why this converts. What emotional trigger it hits."
}
Rules:
- Never use unlock, transform your life, journey, amazing results
- Speak to a specific situation
- Sound like Leon talking to one person`,

  coachingLongForm: `Generate long-form YouTube structure for Leon Charles coaching.
Target: busy dads who need to fix their body, energy, and standards.

Return ONLY valid JSON. No markdown. No preamble.
{
  "title": "YouTube title. Direct. Speaks to dads.",
  "hook": "Opening 20-30 seconds. Grabs a dad's attention immediately.",
  "intro": "What Leon sets up and why this matters to the viewer.",
  "mainPoints": [
    {"point": "Point title","detail": "What Leon covers here"},
    {"point": "Point title","detail": "What Leon covers here"},
    {"point": "Point title","detail": "What Leon covers here"},
    {"point": "Point title","detail": "What Leon covers here"}
  ],
  "realLifeExamples": ["Specific situation 1","Specific situation 2"],
  "closingMessage": "How the video ends. What Leon leaves them with.",
  "shortClips": [
    {"title": "Clip title","angle": "Clip angle"},
    {"title": "Clip title","angle": "Clip angle"},
    {"title": "Clip title","angle": "Clip angle"}
  ],
  "conversionScore": 77,
  "whyItWorks": "Why this video converts."
}`,

  surpriseMeUnfiltered: `Generate a high-performing content idea for Leon Charles Unfiltered.
Pick the strongest angle right now: reaction, opinion, or mind-blowing fact.

Return ONLY valid JSON. No markdown. No preamble.
{
  "type": "reaction or opinion or fact",
  "topic": "What the content is about",
  "hook": "Strongest hook",
  "script": "Short-form script",
  "caption": "Caption",
  "viralScore": 88,
  "whyItWorks": "Why this will perform."
}`,

  surpriseMeCoaching: `Generate a high-converting coaching content idea for Leon Charles.
Busy dads. Pick the most powerful angle right now.

Return ONLY valid JSON. No markdown. No preamble.
{
  "topic": "What this is about",
  "hook": "Scroll-stopping hook",
  "script": "Reel script. Direct. No fluff.",
  "cta": "Clear CTA",
  "conversionScore": 85,
  "whyItWorks": "Why this converts."
}`,

  improve: `Take this content and make it stronger. Hit harder. Cut anything weak. Tighten every line.
Return the same JSON structure with every field improved.
Return ONLY valid JSON. No markdown.`,

  remix: `Take this idea and remix it. Same core topic. Fresh angle.
Return ONLY valid JSON. No markdown. No preamble.
{
  "newAngle": "Fresh angle on the same topic",
  "hooks": ["hook 1","hook 2","hook 3","hook 4","hook 5"],
  "script": "Fresh script from this new angle",
  "caption": "Fresh caption"
}`,

  youtubeExpansion: `You are Leon Charles. Build a full YouTube content expansion from the topic provided.
Every output must sound like Leon talking — direct, real, no fluff, no AI language.
Return ONLY valid JSON. No markdown. No preamble. No extra keys.

{
  "coreIdea": {
    "angle": "The clear angle in one sentence",
    "whoItsFor": "Exactly who this is for",
    "mainMessage": "The core message — one line",
    "bestContentType": "reaction or coaching or fact"
  },
  "youtubeTitles": ["Title 1","Title 2","Title 3"],
  "youtubeDescription": "Full description. First 2 lines = hook. Then value breakdown. CTA at end. Reads naturally. Sounds like Leon.",
  "videoStructure": {
    "hook": "First 10 seconds. Grabs immediately.",
    "intro": "What Leon sets up at the start.",
    "keyPoints": ["Point 1","Point 2","Point 3","Point 4","Point 5"],
    "realLifeExamples": ["Example 1","Example 2"],
    "closingMessage": "How the video ends. Strong. Direct."
  },
  "shortFormClips": [
    {"hook": "Clip hook","idea": "Clip concept","whyItWorks": "Why this clip performs"},
    {"hook": "Clip hook","idea": "Clip concept","whyItWorks": "Why this clip performs"},
    {"hook": "Clip hook","idea": "Clip concept","whyItWorks": "Why this clip performs"}
  ],
  "firstThreeSeconds": {
    "openingLine": "Exact words Leon says in the first 3 seconds",
    "visualIdea": "What the viewer sees",
    "onScreenText": "Text overlay"
  },
  "hookSystem": {
    "hooks": ["Hook 1","Hook 2","Hook 3","Hook 4","Hook 5"],
    "bestHookScore": 8,
    "bestHook": "The strongest hook from the list",
    "weakestHookImproved": "The weakest hook rewritten stronger"
  },
  "thumbnailOptions": ["Option 1","Option 2","Option 3","Option 4","Option 5"],
  "commentBait": ["Trigger 1","Trigger 2","Trigger 3","Trigger 4","Trigger 5"],
  "contentSeries": [
    {"hook": "Hook","angle": "Angle","idea": "One-line idea"},
    {"hook": "Hook","angle": "Angle","idea": "One-line idea"},
    {"hook": "Hook","angle": "Angle","idea": "One-line idea"},
    {"hook": "Hook","angle": "Angle","idea": "One-line idea"},
    {"hook": "Hook","angle": "Angle","idea": "One-line idea"}
  ],
  "instagramCaption": {
    "hook": "Caption hook line",
    "body": "Body. Conversational. Real. Short paragraphs.",
    "cta": "CTA"
  },
  "tiktokCaption": "Short. Direct. Punchy. Under 3 lines.",
  "contentImprovement": {
    "whatIsWeak": "What is weak about this idea as stated",
    "whatToRemove": "What to cut",
    "strongerVersion": "Stronger version of the core idea"
  },
  "finalScores": {
    "viralScore": 82,
    "conversionScore": 78,
    "breakdown": {
      "hookStrength": "Assessment of hook quality",
      "clarity": "Assessment of clarity",
      "relatability": "Assessment of relatability",
      "engagement": "Assessment of engagement potential",
      "actionPotential": "Assessment of action-driving potential"
    }
  }
}

Rules:
- No "unlock"
- No "journey"
- No "amazing results"
- Every line must sound like Leon saying it
- Scores must be honest`,

  captionBuilder: `Build a caption for Leon Charles. Sounds like Leon talking. Not AI writing.
Adapt tone based on intent:
- Engagement = conversational and sparks comments
- Authority = confident and demonstrates knowledge
- Conversion = direct and drives DMs

Return ONLY valid JSON. No markdown. No preamble.
{
  "hook": "First line. Must stop scroll. Under 10 words ideally.",
  "body": "Body copy. Short paragraphs. No long walls of text. Relatable. Direct.",
  "cta": "2-6 word CTA. Natural. No fluff.",
  "intent": "engagement or authority or conversion"
}
Rules:
- No unlock
- No journey
- No value-packed
- No fake hype
- If it sounds AI rewrite it`,

  ctaBuilder: `Generate CTAs for Leon Charles. 2-6 words max. Direct. Natural. No fluff.
Style examples:
- Comment RESET
- DM me PLAN
- Say READY
- Drop a fire emoji
- Comment DAD

Return ONLY valid JSON. No markdown. No preamble.
{
  "comment": ["CTA 1","CTA 2","CTA 3"],
  "dm": ["CTA 1","CTA 2","CTA 3"],
  "engagement": ["CTA 1","CTA 2","CTA 3"]
}`,

  hookRefiner: `Take this hook and rewrite it 5 ways.
Stronger. Clearer. More emotional. More direct. Under 10 words each.

Return ONLY valid JSON. No markdown. No preamble.
{
  "refined": ["version 1","version 2","version 3","version 4","version 5"],
  "strongest": "The single best version",
  "whyStrongest": "One sentence on why this one wins."
}`,

  rewriteTool: `Rewrite this copy. Same message. Sharper. Remove every weak word. Sound human. Sound like Leon.
Return ONLY valid JSON. No markdown. No preamble.
{
  "rewritten": "The full rewritten version",
  "whatChanged": "What was cut or tightened and why."
}`,

  longFormCopy: `Build long-form copy for Leon Charles.
Used for YouTube descriptions, long captions, storytelling posts.
Must read naturally. Must hold attention. No rambling. No generic advice.
Adapt tone based on intent provided.

Return ONLY valid JSON. No markdown. No preamble.
{
  "openingHook": "Opening line. Stops them immediately.",
  "body": "Body. Clean sections. Short paragraphs. Holds attention throughout.",
  "closingMessage": "How it ends. Strong. Leaves them with something.",
  "cta": "Final CTA. Direct. Natural.",
  "intent": "engagement or authority or conversion"
}`,
};

async function callClaude(systemPrompt, userMessage) {
  const res = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemPrompt: `${PROMPTS.masterSystem}\n\n${systemPrompt}`,
      userMessage,
    }),
  });

  const data = await res.json();

  if (!res.ok || data.error) {
    return {
      error: data.error || "Request failed",
      details: data.details || "",
    };
  }

  const text = typeof data.text === "string" ? data.text : "";
  const clean = text.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(clean);
  } catch {
    return {
      error: "Failed to parse response.",
      raw: text.slice(0, 400),
    };
  }
}

const RED = "#be302c";
const BLACK = "#0b0b0c";
const TEXT = "#f5f5f7";
const MUTED = "#a3a3aa";
const SOFT = "#18181b";
const BORDER = "#232327";
const CARD = "#0b0b0c";
const FONT = "'Inter', sans-serif";
const MAX_WIDTH = 460;

const GLOBAL_STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

* { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
html, body { margin: 0; padding: 0; background: #000000; font-family: ${FONT}; color: ${TEXT}; }
body { min-height: 100vh; }
button, input, textarea, select { font-family: inherit; }
button:active { transform: scale(0.99); }
textarea:focus, input:focus { outline: none; }
textarea { resize: none; }
img { display: block; max-width: 100%; }

@keyframes spin { to { transform: rotate(360deg); } }
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

::-webkit-scrollbar { width: 8px; height: 8px; }
::-webkit-scrollbar-thumb { background: #d8d8dd; border-radius: 999px; }
::-webkit-scrollbar-track { background: transparent; }
`;

const LOADER_MSGS = [
  "Writing it out…",
  "Cutting the fluff…",
  "Making it harder…",
  "Tightening every line…",
  "Scoring the output…",
  "Almost done…",
];

function useLoader() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const ref = useRef(null);

  const start = (m) => {
    setLoading(true);
    setMsg(m || "Generating…");
    let i = 0;
    ref.current = setInterval(() => {
      i += 1;
      if (i < LOADER_MSGS.length) setMsg(LOADER_MSGS[i]);
    }, 1900);
  };

  const stop = () => {
    clearInterval(ref.current);
    setLoading(false);
  };

  return { loading, msg, start, stop };
}

function AppShell({ children, sticky = false }) {
  return (
    <div
      style={{
        maxWidth: MAX_WIDTH,
        margin: "0 auto",
        minHeight: "100vh",
        background: CARD,
        position: "relative",
        paddingBottom: sticky ? 98 : 36,
      }}
    >
      {children}
    </div>
  );
}

function Spinner({ msg }) {
  return (
    <div style={{ padding: "56px 0 40px", textAlign: "center" }}>
      <div
        style={{
          width: 28,
          height: 28,
          border: "3px solid #ededf0",
          borderTop: `3px solid ${RED}`,
          borderRadius: "50%",
          margin: "0 auto 16px",
          animation: "spin 0.7s linear infinite",
        }}
      />
      <p style={{ fontSize: 13, color: MUTED, margin: 0, fontWeight: 600 }}>{msg}</p>
    </div>
  );
}

function SectionLabel({ text }) {
  return (
    <p
      style={{
        fontSize: 10,
        fontWeight: 900,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "#8d8d93",
        margin: "0 0 9px",
      }}
    >
      {text}
    </p>
  );
}

function Pill({ label, active, onClick, dark = false }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "11px 16px",
        borderRadius: 999,
        border: `1.5px solid ${active ? (dark ? BLACK : RED) : "#d9d9de"}`,
        background: active ? (dark ? BLACK : RED) : "#fff",
        color: active ? "#fff" : "#7e7e85",
        fontSize: 12,
        fontWeight: 800,
        cursor: "pointer",
        whiteSpace: "nowrap",
        transition: "all 0.15s ease",
        flexShrink: 0,
      }}
    >
      {label}
    </button>
  );
}

function BigButton({ label, onClick, variant = "red", disabled = false }) {
  const bg = variant === "red" ? RED : variant === "black" ? BLACK : "#fafafb";
  const col = variant === "ghost" ? "#6f6f75" : "#fff";
  const border = variant === "ghost" ? `1.5px solid ${BORDER}` : "none";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%",
        padding: "16px 18px",
        borderRadius: 16,
        border,
        background: disabled ? "#ddd" : bg,
        cursor: disabled ? "not-allowed" : "pointer",
        fontSize: 15,
        fontWeight: 900,
        color: disabled ? "#888" : col,
        letterSpacing: "-0.01em",
        marginBottom: 9,
      }}
    >
      {label}
    </button>
  );
}

function MiniButton({ label, onClick, accent = false }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        padding: "12px 0",
        borderRadius: 12,
        border: accent ? "none" : `1.5px solid ${BORDER}`,
        background: accent ? RED : "#fafafb",
        cursor: "pointer",
        fontSize: 11,
        fontWeight: 900,
        color: accent ? "#fff" : "#666a70",
        letterSpacing: "0.06em",
        textTransform: "uppercase",
      }}
    >
      {label}
    </button>
  );
}

function StickyActions({ buttons }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: MAX_WIDTH,
        background: "rgba(11,11,12,0.96)",
        backdropFilter: "blur(12px)",
        borderTop: `1px solid ${BORDER}`,
        padding: "12px 14px 18px",
        zIndex: 100,
      }}
    >
      <div style={{ display: "flex", gap: 8 }}>
        {buttons.map((b) => (
          <MiniButton key={b.label} label={b.label} onClick={b.fn} accent={b.accent} />
        ))}
      </div>
    </div>
  );
}

function Header({ onBack, eyebrow, title, right }) {
  return (
    <div
      style={{
        padding: "32px 20px 20px",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        borderBottom: `1px solid ${SOFT}`,
      }}
    >
      <div style={{ display: "flex", gap: 14 }}>
        <button
          onClick={onBack}
          style={{
            background: "#121216",
            border: `1px solid ${BORDER}`,
            cursor: "pointer",
            padding: 0,
            width: 40,
            height: 40,
            borderRadius: 12,
            fontSize: 19,
            color: "#666",
            lineHeight: 1,
            flexShrink: 0,
          }}
        >
          ←
        </button>
        <div>
          {eyebrow && (
            <span
              style={{
                fontSize: 10,
                fontWeight: 900,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: RED,
              }}
            >
              {eyebrow}
            </span>
          )}
          <h1
            style={{
              fontSize: 24,
              fontWeight: 900,
              color: TEXT,
              margin: eyebrow ? "6px 0 0" : "0",
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
            }}
          >
            {title}
          </h1>
        </div>
      </div>
      {right}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, rows = 4 }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      style={{
        width: "100%",
        padding: "18px",
        background: "#0b0b0c",
        border: `1.5px solid ${BORDER}`,
        borderRadius: 18,
        fontSize: 15,
        lineHeight: 1.65,
        color: TEXT,
        marginBottom: 14,
      }}
    />
  );
}

function Divider() {
  return <div style={{ height: 1, background: "#121216", margin: "18px 0" }} />;
}

function ScoreBar({ score, label }) {
  if (score === undefined || score === null) return null;
  const strength = score >= 85 ? "Strong" : score >= 70 ? "Good" : score >= 50 ? "Mid" : "Weak";
  const col = score >= 85 ? RED : score >= 70 ? BLACK : "#aaa";

  return (
    <div
      style={{
        padding: "18px 18px 14px",
        marginBottom: 8,
        background: "#0b0b0c",
        border: `1px solid ${BORDER}`,
        borderRadius: 18,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 10,
        }}
      >
        <span
          style={{
            fontSize: 10,
            fontWeight: 900,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#8d8d93",
          }}
        >
          {label}
        </span>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span style={{ fontSize: 34, fontWeight: 900, color: col, letterSpacing: "-0.04em" }}>{score}</span>
          <span
            style={{
              fontSize: 10,
              fontWeight: 900,
              color: col,
              letterSpacing: "0.08em",
            }}
          >
            {strength.toUpperCase()}
          </span>
        </div>
      </div>
      <div style={{ height: 5, background: "#1b1b20", borderRadius: 999 }}>
        <div
          style={{
            height: "100%",
            width: `${Math.max(0, Math.min(100, score))}%`,
            background: RED,
            borderRadius: 999,
            transition: "width 0.8s ease",
          }}
        />
      </div>
    </div>
  );
}

function WhyBox({ text }) {
  if (!text) return null;
  return (
    <div
      style={{
        padding: "14px 16px",
        background: "#140d0d",
        border: "1px solid #f0d5d4",
        borderRadius: 16,
        marginBottom: 10,
        animation: "fadeUp 0.2s ease",
      }}
    >
      <p
        style={{
          fontSize: 10,
          fontWeight: 900,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: RED,
          margin: "0 0 6px",
        }}
      >
        Why it works
      </p>
      <p style={{ fontSize: 13, lineHeight: 1.7, color: "#555", margin: 0 }}>{text}</p>
    </div>
  );
}

function Card({ title, content, mono = false, accent = false }) {
  const [copied, setCopied] = useState(false);
  if (!content || (Array.isArray(content) && content.length === 0)) return null;

  const flatText = Array.isArray(content)
    ? content
        .map((item, i) => {
          if (typeof item === "object") {
            if (item.point) return `${i + 1}. ${item.point}: ${item.detail}`;
            if (item.title) return `${i + 1}. ${item.title} - ${item.angle || item.detail || ""}`;
            return `${i + 1}. ${JSON.stringify(item)}`;
          }
          return `${i + 1}. ${item}`;
        })
        .join("\n")
    : String(content);

  const copy = async () => {
    await navigator.clipboard.writeText(flatText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        marginBottom: 10,
        padding: "16px 16px 15px",
        background: accent ? "#fff8f8" : "#ffffff",
        border: `1px solid ${accent ? "#f0d5d4" : BORDER}`,
        borderRadius: 18,
        animation: "fadeUp 0.2s ease",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <span
          style={{
            fontSize: 10,
            fontWeight: 900,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: RED,
          }}
        >
          {title}
        </span>
        <button
          onClick={copy}
          style={{
            fontSize: 10,
            fontWeight: 900,
            letterSpacing: "0.07em",
            textTransform: "uppercase",
            color: copied ? RED : "#b1b1b7",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          {copied ? "COPIED" : "COPY"}
        </button>
      </div>

      {Array.isArray(content) ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {content.map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 10 }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 900,
                  color: RED,
                  minWidth: 14,
                  paddingTop: 2,
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </span>
              <p style={{ fontSize: 14, lineHeight: 1.68, color: TEXT, margin: 0 }}>
                {typeof item === "object"
                  ? item.point
                    ? `${item.point}: ${item.detail}`
                    : item.title
                    ? `${item.title} — ${item.angle || item.detail || ""}`
                    : JSON.stringify(item)
                  : item}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p
          style={{
            lineHeight: 1.78,
            color: TEXT,
            margin: 0,
            whiteSpace: "pre-wrap",
            fontFamily: mono ? "'Courier New', monospace" : FONT,
            fontSize: mono ? 13 : 14,
          }}
        >
          {content}
        </p>
      )}
    </div>
  );
}

function FormatToggle({ value, onChange }) {
  return (
    <div
      style={{
        display: "flex",
        background: "#121216",
        borderRadius: 18,
        padding: 5,
        marginBottom: 16,
        border: `1px solid ${BORDER}`,
      }}
    >
      {["short", "long"].map((f) => (
        <button
          key={f}
          onClick={() => onChange(f)}
          style={{
            flex: 1,
            padding: "13px 0",
            borderRadius: 14,
            border: "none",
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 900,
            background: value === f ? BLACK : "transparent",
            color: value === f ? "#fff" : "#8a8a90",
            transition: "all 0.14s ease",
          }}
        >
          {f === "short" ? "Short Form" : "Long Form"}
        </button>
      ))}
    </div>
  );
}

function SoftPanel({ children }) {
  return (
    <div
      style={{
        background: "#0b0b0c",
        border: `1px solid ${BORDER}`,
        borderRadius: 20,
        padding: 16,
      }}
    >
      {children}
    </div>
  );
}

function HomeScreen({ onLane, onCopy, onYT, onSaved, savedCount }) {
  return (
    <AppShell>
      <div style={{ padding: "28px 18px 24px" }}>
        <div
          style={{
            marginBottom: 18,
            borderRadius: 22,
            background: "#0b0b0c",
            border: `1px solid ${BORDER}`,
            padding: "18px 16px 16px",
          }}
        >
          <img
            src="/logo.png"
            alt="Content Engine"
            style={{
              width: "52%",
              maxWidth: 190,
              height: "auto",
              margin: "0 auto 16px",
            }}
          />

          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
            <div style={{ width: 7, height: 7, background: RED, borderRadius: "50%" }} />
            <span
              style={{
                fontSize: 10,
                fontWeight: 900,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: RED,
              }}
            >
              Private
            </span>
          </div>

          <h1
            style={{
              fontSize: 36,
              fontWeight: 900,
              color: TEXT,
              margin: "0 0 8px",
              letterSpacing: "-0.04em",
              lineHeight: 0.94,
            }}
          >
            Content
            <br />
            Engine
          </h1>

          <p style={{ fontSize: 15, color: MUTED, margin: 0, lineHeight: 1.55 }}>
            Unfiltered · Coaching · Copy.
            <br />
            Private. No noise.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button
            onClick={() => onLane("unfiltered")}
            style={{
              padding: "24px 20px",
              background: BLACK,
              borderRadius: 20,
              border: "none",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <p
              style={{
                fontSize: 10,
                fontWeight: 900,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#7f7f86",
                margin: "0 0 8px",
              }}
            >
              Lane 01
            </p>
            <h2
              style={{
                fontSize: 22,
                fontWeight: 900,
                color: "#f5f5f7",
                margin: "0 0 6px",
                letterSpacing: "-0.03em",
              }}
            >
              Unfiltered
            </h2>
            <p style={{ fontSize: 13, color: "#9a9aa1", margin: 0, lineHeight: 1.45 }}>
              Reaction · Opinion · Bro Did You Know
            </p>
          </button>

          <button
            onClick={() => onLane("coaching")}
            style={{
              padding: "24px 20px",
              background: "#0b0b0c",
              borderRadius: 20,
              border: `2px solid ${BLACK}`,
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <p
              style={{
                fontSize: 10,
                fontWeight: 900,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: RED,
                margin: "0 0 8px",
              }}
            >
              Lane 02
            </p>
            <h2
              style={{
                fontSize: 22,
                fontWeight: 900,
                color: TEXT,
                margin: "0 0 6px",
                letterSpacing: "-0.03em",
              }}
            >
              Coaching
            </h2>
            <p style={{ fontSize: 13, color: MUTED, margin: 0, lineHeight: 1.45 }}>
              Hooks · Reels · Scripts · Long Form
            </p>
          </button>

          <button
            onClick={onCopy}
            style={{
              padding: "20px 18px",
              background: "#0b0b0c",
              borderRadius: 18,
              border: `1.5px solid ${BORDER}`,
              cursor: "pointer",
              textAlign: "left",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 900,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#9b9ba1",
                  margin: "0 0 6px",
                }}
              >
                Lane 03
              </p>
              <h2
                style={{
                  fontSize: 18,
                  fontWeight: 900,
                  color: TEXT,
                  margin: "0 0 4px",
                  letterSpacing: "-0.02em",
                }}
              >
                Copy System
              </h2>
              <p style={{ fontSize: 12.5, color: MUTED, margin: 0, lineHeight: 1.45 }}>
                Captions · CTAs · Hook Refiner · Rewrite · Long Form
              </p>
            </div>
            <span style={{ fontSize: 20, color: "#d0d0d6", marginLeft: 10 }}>›</span>
          </button>

          <button
            onClick={onYT}
            style={{
              padding: "20px 18px",
              background: "#0b0b0c",
              borderRadius: 18,
              border: `1.5px solid ${BORDER}`,
              cursor: "pointer",
              textAlign: "left",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 900,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#9b9ba1",
                  margin: "0 0 6px",
                }}
              >
                Lane 04
              </p>
              <h2
                style={{
                  fontSize: 18,
                  fontWeight: 900,
                  color: TEXT,
                  margin: "0 0 4px",
                  letterSpacing: "-0.02em",
                }}
              >
                YouTube Expansion
              </h2>
              <p style={{ fontSize: 12.5, color: MUTED, margin: 0, lineHeight: 1.45 }}>
                Full breakdown · Titles · Clips · Series · Scores
              </p>
            </div>
            <span style={{ fontSize: 20, color: "#d0d0d6", marginLeft: 10 }}>›</span>
          </button>

          <button
            onClick={onSaved}
            style={{
              padding: "16px 18px",
              background: "#0b0b0c",
              borderRadius: 18,
              border: `1.5px solid ${BORDER}`,
              cursor: "pointer",
              textAlign: "left",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 17 }}>📌</span>
              <div>
                <p style={{ fontSize: 14, fontWeight: 800, color: TEXT, margin: 0 }}>Saved Ideas</p>
                <p style={{ fontSize: 12, color: "#8d8d93", margin: "2px 0 0" }}>{savedCount} saved</p>
              </div>
            </div>
            <span style={{ fontSize: 18, color: "#d0d0d6" }}>›</span>
          </button>
        </div>
      </div>
    </AppShell>
  );
}

function GeneratorScreen({ lane, onBack, onOutput, hasLastOutput }) {
  const [format, setFormat] = useState("short");
  const [contentType, setContentType] = useState("general");
  const [input, setInput] = useState("");
  const [error, setError] = useState(null);
  const { loading, msg, start, stop } = useLoader();
  const isCoaching = lane === "coaching";

  const getPrompt = () => {
    if (!isCoaching && contentType === "bro") return PROMPTS.broDidYouKnow;
    if (!isCoaching) return format === "short" ? PROMPTS.unfilteredShortForm : PROMPTS.unfilteredLongForm;
    return format === "short" ? PROMPTS.coachingShortForm : PROMPTS.coachingLongForm;
  };

  const run = async () => {
    setError(null);
    start();
    try {
      const result = await callClaude(getPrompt(), input || "Generate a strong idea for this lane and format.");
      stop();
      if (result.error) {
        setError(result.details ? `${result.error}${result.details ? `: ${result.details}` : ""}` : result.error);
        return;
      }
      onOutput(result, lane, format);
    } catch {
      stop();
      setError("Something went wrong. Try again.");
    }
  };

  const surprise = async () => {
    setError(null);
    start("Surprising you…");
    try {
      const prompt = isCoaching ? PROMPTS.surpriseMeCoaching : PROMPTS.surpriseMeUnfiltered;
      const result = await callClaude(prompt, "Surprise me with a strong content idea.");
      stop();
      if (result.error) {
        setError(result.details ? `${result.error}${result.details ? `: ${result.details}` : ""}` : result.error);
        return;
      }
      onOutput(result, lane, format);
    } catch {
      stop();
      setError("Something went wrong.");
    }
  };

  return (
    <AppShell>
      <Header onBack={onBack} eyebrow={lane.toUpperCase()} title={isCoaching ? "Coaching Generator" : "Unfiltered Generator"} />

      <div style={{ padding: "18px 14px 0" }}>
        <SoftPanel>
          <FormatToggle value={format} onChange={setFormat} />

          {!isCoaching && (
            <div style={{ display: "flex", gap: 8, marginBottom: 16, overflowX: "auto", paddingBottom: 2 }}>
              {[
                { id: "general", label: "General" },
                { id: "bro", label: "Bro Did You Know" },
                { id: "reaction", label: "Reaction" },
                { id: "opinion", label: "Opinion" },
              ].map((ct) => (
                <Pill key={ct.id} label={ct.label} active={contentType === ct.id} dark onClick={() => setContentType(ct.id)} />
              ))}
            </div>
          )}

          <TextInput
            value={input}
            onChange={setInput}
            placeholder={
              isCoaching
                ? "Topic or angle... e.g. dads who skip the gym because they're tired"
                : "Fact, topic, or idea... e.g. honey never spoils"
            }
            rows={6}
          />

          {error && (
            <div
              style={{
                padding: "13px 14px",
                background: "#140d0d",
                border: "1px solid #f0d5d4",
                borderRadius: 14,
                marginBottom: 12,
              }}
            >
              <p style={{ fontSize: 13, color: RED, margin: 0, lineHeight: 1.55 }}>{error}</p>
            </div>
          )}

          {loading ? (
            <Spinner msg={msg} />
          ) : (
            <>
              <BigButton label="Generate →" onClick={run} />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: hasLastOutput ? "1fr 1fr" : "1fr",
                  gap: 8,
                }}
              >
                <BigButton label="✦ Surprise Me" onClick={surprise} variant="black" />
                {hasLastOutput && <BigButton label="← Last Output" onClick={() => onOutput(null, null, null, true)} variant="ghost" />}
              </div>
            </>
          )}
        </SoftPanel>
      </div>
    </AppShell>
  );
}

function OutputScreen({ output: initialOutput, lane, format, onBack, onSave, onRerun }) {
  const [output, setOutput] = useState(initialOutput);
  const { loading, msg, start, stop } = useLoader();
  const isCoaching = lane === "coaching";

  const mutate = async (promptStr) => {
    start(promptStr === PROMPTS.improve ? "Making it hit harder…" : "Remixing…");
    try {
      const result = await callClaude(promptStr, JSON.stringify(output));
      stop();
      if (!result.error) setOutput(result);
    } catch {
      stop();
    }
  };

  const copyAll = async () => {
    const lines = Object.entries(output)
      .filter(([k]) => !["viralScore", "conversionScore"].includes(k))
      .map(([k, v]) => {
        const body = Array.isArray(v)
          ? v
              .map((i, idx) =>
                typeof i === "object"
                  ? `${idx + 1}. ${i.title || i.point || JSON.stringify(i)}`
                  : `${idx + 1}. ${i}`
              )
              .join("\n")
          : v;
        return `${k.toUpperCase()}\n${body}`;
      })
      .join("\n\n");
    await navigator.clipboard.writeText(lines);
  };

  if (!output) return null;
  const score = output.viralScore || output.conversionScore;

  return (
    <AppShell sticky>
      <Header
        onBack={onBack}
        eyebrow={`${lane?.toUpperCase()} · ${format?.toUpperCase()}`}
        title="Output"
        right={
          <button
            onClick={() => onSave(output)}
            style={{
              padding: "10px 14px",
              background: "#121216",
              border: `1.5px solid ${BORDER}`,
              borderRadius: 12,
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 900,
              color: "#67676d",
              marginTop: 2,
            }}
          >
            🔖 Save
          </button>
        }
      />

      {loading ? (
        <Spinner msg={msg} />
      ) : (
        <div style={{ padding: "18px 14px 0" }}>
          {score != null && <ScoreBar score={score} label={isCoaching ? "Conversion Score" : "Viral Score"} />}
          <WhyBox text={output.whyItWorks} />

          <Card title="Fact / Angle" content={output.factOrAngle || output.fact} />
          <Card title="Hooks" content={output.hooks} />
          {typeof output.hook === "string" && <Card title="Hook" content={output.hook} />}
          <Card title="Call-out Line" content={output.calloutLine} />
          <Card title="Script" content={output.script} mono />
          <Card title="Reality Check" content={output.realityCheckLine} />
          <Card title="Caption" content={output.caption} />
          <Card title="CTA" content={output.cta} />
          <Card title="Title" content={output.title} />
          <Card title="Intro" content={output.intro} />
          {output.structure && <Card title="Structure" content={output.structure} />}
          {output.mainPoints && <Card title="Main Points" content={output.mainPoints.map((p) => `${p.point}: ${p.detail}`)} />}
          {output.realLifeExamples && <Card title="Real-Life Examples" content={output.realLifeExamples} />}
          <Card title="Closing Message" content={output.closingMessage} />

          {output.shortClips && (
            <div
              style={{
                marginBottom: 10,
                padding: "16px 16px 14px",
                background: "#0b0b0c",
                border: `1px solid ${BORDER}`,
                borderRadius: 18,
              }}
            >
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 900,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: RED,
                  margin: "0 0 10px",
                }}
              >
                Short Clips
              </p>
              {output.shortClips.map((clip, i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 900,
                      color: RED,
                      minWidth: 14,
                      flexShrink: 0,
                    }}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <p style={{ fontSize: 13.5, fontWeight: 800, color: TEXT, margin: "0 0 3px" }}>{clip.title}</p>
                    <p style={{ fontSize: 12.5, color: MUTED, margin: 0, lineHeight: 1.55 }}>{clip.angle}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {output.type && (
            <div
              style={{
                display: "inline-block",
                padding: "6px 11px",
                background: "#121216",
                borderRadius: 999,
                marginBottom: 10,
                border: `1px solid ${BORDER}`,
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 900,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#8b8b91",
                }}
              >
                {output.type}
              </span>
            </div>
          )}

          {output.topic && !output.title && <Card title="Topic" content={output.topic} />}
          {output.newAngle && <Card title="New Angle" content={output.newAngle} accent />}
          {output.newAngle && output.hooks && <Card title="Fresh Hooks" content={output.hooks} />}
          {output.newAngle && output.script && <Card title="Fresh Script" content={output.script} mono />}
          {output.newAngle && output.caption && <Card title="Fresh Caption" content={output.caption} />}
        </div>
      )}

      {!loading && (
        <StickyActions
          buttons={[
            { label: "Improve", fn: () => mutate(PROMPTS.improve), accent: true },
            { label: "Remix", fn: () => mutate(PROMPTS.remix) },
            { label: "Regen", fn: onRerun },
            { label: "Copy All", fn: copyAll },
          ]}
        />
      )}
    </AppShell>
  );
}

const COPY_TOOLS = [
  {
    id: "caption",
    label: "Caption Builder",
    desc: "Hook · Body · CTA",
    prompt: "captionBuilder",
    hasIntent: true,
    inputLabel: "Topic or paste content from generator",
    inputPlaceholder: "e.g. why dads stop going to the gym after 3 weeks",
  },
  {
    id: "cta",
    label: "CTA Builder",
    desc: "Comment · DM · Engagement CTAs",
    prompt: "ctaBuilder",
    hasIntent: true,
    inputLabel: "What is the post or offer about",
    inputPlaceholder: "e.g. fat loss coaching for busy dads",
  },
  {
    id: "hookRefiner",
    label: "Hook Refiner",
    desc: "5 stronger hook versions",
    prompt: "hookRefiner",
    hasIntent: false,
    inputLabel: "Hook to refine",
    inputPlaceholder: "Paste your existing hook here...",
  },
  {
    id: "rewrite",
    label: "Rewrite Tool",
    desc: "Tighten any copy",
    prompt: "rewriteTool",
    hasIntent: false,
    inputLabel: "Copy to rewrite",
    inputPlaceholder: "Paste any caption, script, or copy...",
    rows: 6,
  },
  {
    id: "longform",
    label: "Long Form Copy",
    desc: "Descriptions · Storytelling",
    prompt: "longFormCopy",
    hasIntent: true,
    inputLabel: "Topic or angle",
    inputPlaceholder: "e.g. how I went from dad bod to stage-ready while coaching clients full time",
  },
];

const INTENTS = ["Engagement", "Authority", "Conversion"];

function CopySystemScreen({ onBack }) {
  const [toolId, setToolId] = useState(null);
  const [intent, setIntent] = useState("Engagement");
  const [input, setInput] = useState("");
  const [hook, setHook] = useState("");
  const [output, setOutput] = useState(null);
  const [error, setError] = useState(null);
  const { loading, msg, start, stop } = useLoader();
  const tool = COPY_TOOLS.find((t) => t.id === toolId);

  const run = async () => {
    if (!tool) return;
    setError(null);
    setOutput(null);
    start("Writing copy…");
    const userMsg = `Intent: ${intent}\n${hook ? `Hook: ${hook}\n` : ""}Content: ${
      input || "Generate a strong example for a busy dad coaching audience."
    }`;

    try {
      let result;
      if (toolId === "hookRefiner") {
        result = await callClaude(PROMPTS.hookRefiner, `Hook to refine: ${input}`);
      } else if (toolId === "rewrite") {
        result = await callClaude(PROMPTS.rewriteTool, `Copy to rewrite:\n\n${input}`);
      } else {
        result = await callClaude(PROMPTS[tool.prompt], userMsg);
      }
      stop();
      if (result?.error) {
        setError(result.error);
        return;
      }
      setOutput(result);
    } catch {
      stop();
      setError("Something went wrong. Try again.");
    }
  };

  const reset = () => {
    setOutput(null);
    setInput("");
    setHook("");
  };

  return (
    <AppShell>
      <Header onBack={onBack} eyebrow="Lane 03" title="Copy System" />
      <div style={{ padding: "18px 14px 24px" }}>
        <SoftPanel>
          <SectionLabel text="Select Tool" />
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
            {COPY_TOOLS.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setToolId(t.id);
                  setOutput(null);
                  setInput("");
                  setHook("");
                }}
                style={{
                  padding: "16px 16px",
                  borderRadius: 16,
                  border: `1.5px solid ${toolId === t.id ? BLACK : BORDER}`,
                  background: toolId === t.id ? BLACK : "#fff",
                  cursor: "pointer",
                  textAlign: "left",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <p style={{ fontSize: 13, fontWeight: 800, color: toolId === t.id ? "#fff" : BLACK, margin: 0 }}>
                    {t.label}
                  </p>
                  <p style={{ fontSize: 11.5, color: toolId === t.id ? "#87878e" : MUTED, margin: "4px 0 0" }}>
                    {t.desc}
                  </p>
                </div>
                {toolId === t.id && <span style={{ fontSize: 14, color: RED }}>✓</span>}
              </button>
            ))}
          </div>

          {tool && !output && (
            <>
              <Divider />

              {tool.hasIntent && (
                <>
                  <SectionLabel text="Intent" />
                  <div style={{ display: "flex", gap: 7, marginBottom: 14, overflowX: "auto", paddingBottom: 2 }}>
                    {INTENTS.map((i) => (
                      <Pill key={i} label={i} active={intent === i} onClick={() => setIntent(i)} />
                    ))}
                  </div>
                </>
              )}

              {(toolId === "caption" || toolId === "longform") && (
                <>
                  <SectionLabel text="Hook (optional)" />
                  <TextInput value={hook} onChange={setHook} placeholder="Paste a hook or leave blank to auto-generate..." rows={2} />
                </>
              )}

              <SectionLabel text={tool.inputLabel} />
              <TextInput value={input} onChange={setInput} placeholder={tool.inputPlaceholder} rows={tool.rows || 4} />

              {error && (
                <div
                  style={{
                    padding: "13px 14px",
                    background: "#140d0d",
                    border: "1px solid #f0d5d4",
                    borderRadius: 14,
                    marginBottom: 12,
                  }}
                >
                  <p style={{ fontSize: 13, color: RED, margin: 0, lineHeight: 1.55 }}>{error}</p>
                </div>
              )}

              {loading ? <Spinner msg={msg} /> : <BigButton label={`Run ${tool.label} →`} onClick={run} />}
            </>
          )}

          {output && !loading && (
            <div style={{ animation: "fadeUp 0.2s ease" }}>
              <Divider />
              <Card title="Hook Line" content={output.hook} accent />
              {output.body && <Card title="Body" content={output.body} />}
              {output.cta && !output.comment && <Card title="CTA" content={output.cta} />}

              {output.comment && <Card title="Comment CTAs" content={output.comment} />}
              {output.dm && <Card title="DM CTAs" content={output.dm} />}
              {output.engagement && <Card title="Engagement CTAs" content={output.engagement} />}

              {output.refined && <Card title="Refined Hooks" content={output.refined} />}

              {output.strongest && (
                <div
                  style={{
                    padding: "14px 16px",
                    background: "#140d0d",
                    border: "1px solid #f0d5d4",
                    borderRadius: 16,
                    marginBottom: 10,
                  }}
                >
                  <p
                    style={{
                      fontSize: 10,
                      fontWeight: 900,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: RED,
                      margin: "0 0 5px",
                    }}
                  >
                    Strongest
                  </p>
                  <p style={{ fontSize: 14, fontWeight: 800, color: TEXT, margin: "0 0 5px" }}>{output.strongest}</p>
                  {output.whyStrongest && (
                    <p style={{ fontSize: 12, color: "#888", margin: 0, fontStyle: "italic", lineHeight: 1.6 }}>
                      {output.whyStrongest}
                    </p>
                  )}
                </div>
              )}

              {output.rewritten && <Card title="Rewritten" content={output.rewritten} accent />}
              {output.whatChanged && (
                <div
                  style={{
                    padding: "12px 14px",
                    background: "#0b0b0c",
                    border: `1px solid ${BORDER}`,
                    borderRadius: 16,
                    marginBottom: 10,
                  }}
                >
                  <p
                    style={{
                      fontSize: 10,
                      fontWeight: 900,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#999",
                      margin: "0 0 4px",
                    }}
                  >
                    What Changed
                  </p>
                  <p style={{ fontSize: 13, lineHeight: 1.6, color: "#777", margin: 0 }}>{output.whatChanged}</p>
                </div>
              )}

              {output.openingHook && <Card title="Opening Hook" content={output.openingHook} accent />}
              {output.closingMessage && <Card title="Closing" content={output.closingMessage} />}
              {output.cta && output.openingHook && <Card title="CTA" content={output.cta} />}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 4 }}>
                <BigButton label="Regenerate" onClick={run} />
                <BigButton label="New Input" onClick={reset} variant="ghost" />
              </div>
            </div>
          )}
        </SoftPanel>
      </div>
    </AppShell>
  );
}

function SavedScreen({ saved, onBack, onDelete }) {
  return (
    <AppShell>
      <Header onBack={onBack} title="Saved Ideas" />
      <div style={{ padding: "18px 14px 24px" }}>
        {saved.length === 0 ? (
          <SoftPanel>
            <p style={{ fontSize: 13, color: "#8a8a90", textAlign: "center", padding: "34px 0", lineHeight: 1.8, margin: 0 }}>
              Nothing saved yet.
              <br />
              Hit 🔖 on any output to save it here.
            </p>
          </SoftPanel>
        ) : (
          saved.map((item, i) => (
            <div
              key={i}
              style={{
                padding: "16px 16px",
                background: "#0b0b0c",
                border: `1px solid ${BORDER}`,
                borderRadius: 18,
                marginBottom: 10,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 900,
                      letterSpacing: "0.07em",
                      textTransform: "uppercase",
                      color: item.lane === "coaching" ? RED : "#666",
                      background: item.lane === "coaching" ? "#fff4f4" : "#f0f0f0",
                      padding: "4px 8px",
                      borderRadius: 999,
                    }}
                  >
                    {item.lane}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#999",
                      background: "#121216",
                      padding: "4px 8px",
                      borderRadius: 999,
                    }}
                  >
                    {item.format}
                  </span>
                </div>

                <button
                  onClick={() => onDelete(i)}
                  style={{
                    fontSize: 14,
                    color: "#bbb",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    marginLeft: 12,
                  }}
                >
                  ✕
                </button>
              </div>

              <p style={{ fontSize: 14, fontWeight: 800, color: TEXT, margin: "0 0 5px", lineHeight: 1.45 }}>
                {item.topic || item.hook || "Saved idea"}
              </p>

              {item.score && (
                <p style={{ fontSize: 12.5, color: "#8c8c92", margin: 0 }}>
                  Score: <span style={{ color: RED, fontWeight: 900 }}>{item.score}</span>
                </p>
              )}

              <p style={{ fontSize: 11.5, color: "#b1b1b7", margin: "8px 0 0" }}>{item.date}</p>
            </div>
          ))
        )}
      </div>
    </AppShell>
  );
}

function YouTubeExpansionScreen({ onBack }) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState(null);
  const [error, setError] = useState(null);
  const { loading, msg, start, stop } = useLoader();

  const run = async () => {
    if (!input.trim()) {
      setError("Enter a topic or idea first.");
      return;
    }
    setError(null);
    setOutput(null);
    start("Building full expansion…");
    try {
      const result = await callClaude(PROMPTS.youtubeExpansion, `Topic: ${input}`);
      stop();
      if (result?.error) {
        setError(result.error);
        return;
      }
      setOutput(result);
    } catch {
      stop();
      setError("Something went wrong. Try again.");
    }
  };

  const regenerate = () => {
    setOutput(null);
    run();
  };

  const YTSectionHeader = ({ number, title }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, marginTop: 6 }}>
      <span
        style={{
          fontSize: 10,
          fontWeight: 900,
          color: "#f5f5f7",
          background: RED,
          width: 22,
          height: 22,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {number}
      </span>
      <span
        style={{
          fontSize: 11,
          fontWeight: 900,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: TEXT,
        }}
      >
        {title}
      </span>
    </div>
  );

  const Block = ({ children }) => (
    <div
      style={{
        marginBottom: 14,
        padding: "16px 16px 15px",
        background: "#0b0b0c",
        border: `1px solid ${BORDER}`,
        borderRadius: 18,
        animation: "fadeUp 0.2s ease",
      }}
    >
      {children}
    </div>
  );

  const CopyLine = ({ text }) => {
    const [copied, setCopied] = useState(false);
    return (
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
        <button
          onClick={() => {
            navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          style={{
            fontSize: 10,
            fontWeight: 900,
            letterSpacing: "0.07em",
            textTransform: "uppercase",
            color: copied ? RED : "#bbb",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          {copied ? "COPIED" : "COPY"}
        </button>
      </div>
    );
  };

  const ListItems = ({ items }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {(items || []).map((item, i) => (
        <div key={i} style={{ display: "flex", gap: 10 }}>
          <span
            style={{
              fontSize: 11,
              fontWeight: 900,
              color: RED,
              minWidth: 14,
              paddingTop: 2,
              flexShrink: 0,
            }}
          >
            {i + 1}
          </span>
          <p style={{ fontSize: 13.5, lineHeight: 1.68, color: TEXT, margin: 0 }}>{item}</p>
        </div>
      ))}
    </div>
  );

  const YTLabel = ({ text }) => (
    <p
      style={{
        fontSize: 10,
        fontWeight: 900,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: RED,
        margin: "0 0 4px",
      }}
    >
      {text}
    </p>
  );

  const Body = ({ text }) => (
    <p style={{ fontSize: 13.5, lineHeight: 1.74, color: TEXT, margin: 0, whiteSpace: "pre-wrap" }}>{text}</p>
  );

  const DualScore = ({ viral, conversion }) => (
    <div style={{ display: "flex", gap: 10, marginBottom: 4 }}>
      {[
        { label: "Viral Score", score: viral },
        { label: "Conversion Score", score: conversion },
      ].map(({ label, score }) => {
        const strength = score >= 85 ? "Strong" : score >= 70 ? "Good" : score >= 50 ? "Mid" : "Weak";
        const col = score >= 85 ? RED : score >= 70 ? BLACK : "#aaa";
        return (
          <div
            key={label}
            style={{
              flex: 1,
              padding: "14px",
              background: "#0b0b0c",
              border: `1px solid ${BORDER}`,
              borderRadius: 18,
            }}
          >
            <p
              style={{
                fontSize: 10,
                fontWeight: 900,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#999",
                margin: "0 0 4px",
              }}
            >
              {label}
            </p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 8 }}>
              <span style={{ fontSize: 28, fontWeight: 900, color: col, letterSpacing: "-0.03em" }}>{score}</span>
              <span style={{ fontSize: 10, fontWeight: 900, color: col, letterSpacing: "0.08em" }}>
                {strength.toUpperCase()}
              </span>
            </div>
            <div style={{ height: 4, background: "#1b1b20", borderRadius: 999 }}>
              <div style={{ height: "100%", width: `${score}%`, background: RED, borderRadius: 999 }} />
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderOutput = () => {
    if (!output) return null;
    const o = output;

    return (
      <div style={{ animation: "fadeUp 0.25s ease" }}>
        <YTSectionHeader number={1} title="Core Idea Breakdown" />
        <Block>
          <YTLabel text="Angle" />
          <Body text={o.coreIdea?.angle} />
          <div style={{ height: 1, background: "#121216", margin: "10px 0" }} />
          <YTLabel text="Who It's For" />
          <Body text={o.coreIdea?.whoItsFor} />
          <div style={{ height: 1, background: "#121216", margin: "10px 0" }} />
          <YTLabel text="Main Message" />
          <Body text={o.coreIdea?.mainMessage} />
          <div style={{ height: 1, background: "#121216", margin: "10px 0" }} />
          <YTLabel text="Best Content Type" />
          <span
            style={{
              fontSize: 11,
              fontWeight: 900,
              color: RED,
              background: "#1a1010",
              padding: "5px 10px",
              borderRadius: 999,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            {o.coreIdea?.bestContentType}
          </span>
        </Block>

        <YTSectionHeader number={2} title="YouTube Titles" />
        <Block>
          {o.youtubeTitles?.map((t, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                padding: "9px 0",
                borderBottom: i < o.youtubeTitles.length - 1 ? `1px solid ${SOFT}` : "none",
              }}
            >
              <div style={{ display: "flex", gap: 10, flex: 1 }}>
                <span style={{ fontSize: 11, fontWeight: 900, color: RED, minWidth: 14 }}>{i + 1}</span>
                <p style={{ fontSize: 14.5, fontWeight: 800, color: TEXT, margin: 0, lineHeight: 1.5 }}>{t}</p>
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(t)}
                style={{
                  fontSize: 10,
                  fontWeight: 900,
                  color: "#bbb",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "2px 0 0 12px",
                  flexShrink: 0,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                COPY
              </button>
            </div>
          ))}
        </Block>

        <YTSectionHeader number={3} title="YouTube Description" />
        <Block>
          <Body text={o.youtubeDescription} />
          <CopyLine text={o.youtubeDescription} />
        </Block>

        <YTSectionHeader number={4} title="Video Structure" />
        <Block>
          <YTLabel text="Hook (First 10 Seconds)" />
          <Body text={o.videoStructure?.hook} />
          <div style={{ height: 1, background: "#121216", margin: "10px 0" }} />
          <YTLabel text="Intro" />
          <Body text={o.videoStructure?.intro} />
          <div style={{ height: 1, background: "#121216", margin: "10px 0" }} />
          <YTLabel text="Key Points" />
          <ListItems items={o.videoStructure?.keyPoints} />
          {o.videoStructure?.realLifeExamples?.length > 0 && (
            <>
              <div style={{ height: 1, background: "#121216", margin: "10px 0" }} />
              <YTLabel text="Real-Life Examples" />
              <ListItems items={o.videoStructure.realLifeExamples} />
            </>
          )}
          <div style={{ height: 1, background: "#121216", margin: "10px 0" }} />
          <YTLabel text="Closing Message" />
          <Body text={o.videoStructure?.closingMessage} />
        </Block>

        <YTSectionHeader number={5} title="Short-Form Clips" />
        {o.shortFormClips?.map((clip, i) => (
          <Block key={i}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 900,
                  color: "#f5f5f7",
                  background: RED,
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </span>
              <p style={{ fontSize: 13.5, fontWeight: 800, color: TEXT, margin: 0 }}>{clip.idea}</p>
            </div>
            <YTLabel text="Hook" />
            <Body text={clip.hook} />
            <div style={{ height: 1, background: "#121216", margin: "8px 0" }} />
            <YTLabel text="Why It Works" />
            <p style={{ fontSize: 12.5, color: "#888", lineHeight: 1.6, margin: 0, fontStyle: "italic" }}>
              {clip.whyItWorks}
            </p>
          </Block>
        ))}

        <YTSectionHeader number={6} title="First 3 Seconds" />
        <Block>
          <div
            style={{
              padding: "12px 14px",
              background: "#1a1010",
              border: `1.5px solid ${RED}`,
              borderRadius: 14,
              marginBottom: 10,
            }}
          >
            <YTLabel text="Opening Line" />
            <p style={{ fontSize: 15, fontWeight: 800, color: TEXT, margin: 0, lineHeight: 1.5 }}>
              {o.firstThreeSeconds?.openingLine}
            </p>
          </div>
          <YTLabel text="Visual Idea" />
          <Body text={o.firstThreeSeconds?.visualIdea} />
          <div style={{ height: 1, background: "#121216", margin: "8px 0" }} />
          <YTLabel text="On-Screen Text" />
          <span
            style={{
              display: "inline-block",
              fontSize: 13,
              fontWeight: 900,
              color: TEXT,
              background: "#121216",
              padding: "7px 12px",
              borderRadius: 10,
            }}
          >
            {o.firstThreeSeconds?.onScreenText}
          </span>
        </Block>

        <YTSectionHeader number={7} title="Hook System" />
        <Block>
          <YTLabel text="All Hooks" />
          <ListItems items={o.hookSystem?.hooks} />
          <div style={{ height: 1, background: "#121216", margin: "10px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <YTLabel text="Best Hook" />
            <span style={{ fontSize: 20, fontWeight: 900, color: RED }}>
              {o.hookSystem?.bestHookScore}
              <span style={{ fontSize: 11, fontWeight: 700, color: "#999" }}>/10</span>
            </span>
          </div>
          <div
            style={{
              padding: "11px 12px",
              background: "#1a1010",
              border: "1px solid #f0d5d4",
              borderRadius: 14,
              marginBottom: 10,
            }}
          >
            <p style={{ fontSize: 13.5, fontWeight: 800, color: TEXT, margin: 0 }}>{o.hookSystem?.bestHook}</p>
          </div>
          <YTLabel text="Weakest Hook — Improved" />
          <Body text={o.hookSystem?.weakestHookImproved} />
        </Block>

        <YTSectionHeader number={8} title="Thumbnail / Overlay Text" />
        <Block>
          {o.thumbnailOptions?.map((opt, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "9px 0",
                borderBottom: i < o.thumbnailOptions.length - 1 ? `1px solid ${SOFT}` : "none",
              }}
            >
              <div style={{ display: "flex", gap: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 900, color: RED, minWidth: 14 }}>{i + 1}</span>
                <p style={{ fontSize: 14, fontWeight: 900, color: TEXT, margin: 0 }}>{opt}</p>
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(opt)}
                style={{
                  fontSize: 10,
                  fontWeight: 900,
                  color: "#bbb",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  flexShrink: 0,
                  marginLeft: 10,
                }}
              >
                COPY
              </button>
            </div>
          ))}
        </Block>

        <YTSectionHeader number={9} title="Comment Bait" />
        <Block>
          <ListItems items={o.commentBait} />
        </Block>

        <YTSectionHeader number={10} title="5-Part Content Series" />
        {o.contentSeries?.map((ep, i) => (
          <Block key={i}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 900,
                  color: "#f5f5f7",
                  background: BLACK,
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </span>
              <p style={{ fontSize: 12, fontWeight: 800, color: "#888", margin: 0, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                Part {i + 1}
              </p>
            </div>
            <YTLabel text="Hook" />
            <p style={{ fontSize: 13.5, fontWeight: 800, color: TEXT, margin: "0 0 6px" }}>{ep.hook}</p>
            <YTLabel text="Angle" />
            <p style={{ fontSize: 13.5, color: "#555", lineHeight: 1.65, margin: "0 0 6px" }}>{ep.angle}</p>
            <YTLabel text="Idea" />
            <p style={{ fontSize: 13, fontStyle: "italic", color: "#888", margin: 0 }}>{ep.idea}</p>
          </Block>
        ))}

        <YTSectionHeader number={11} title="Instagram Caption" />
        <Block>
          <div
            style={{
              padding: "12px 14px",
              background: "#1a1010",
              border: "1px solid #f0d5d4",
              borderRadius: 14,
              marginBottom: 10,
            }}
          >
            <YTLabel text="Hook" />
            <p style={{ fontSize: 14, fontWeight: 800, color: TEXT, margin: 0 }}>{o.instagramCaption?.hook}</p>
          </div>
          <YTLabel text="Body" />
          <Body text={o.instagramCaption?.body} />
          <div style={{ height: 1, background: "#121216", margin: "8px 0" }} />
          <YTLabel text="CTA" />
          <p style={{ fontSize: 13.5, fontWeight: 800, color: TEXT, margin: 0 }}>{o.instagramCaption?.cta}</p>
          <CopyLine text={`${o.instagramCaption?.hook}\n\n${o.instagramCaption?.body}\n\n${o.instagramCaption?.cta}`} />
        </Block>

        <YTSectionHeader number={12} title="TikTok Caption" />
        <Block>
          <Body text={o.tiktokCaption} />
          <CopyLine text={o.tiktokCaption} />
        </Block>

        <YTSectionHeader number={13} title="Content Improvement" />
        <Block>
          <YTLabel text="What's Weak" />
          <Body text={o.contentImprovement?.whatIsWeak} />
          <div style={{ height: 1, background: "#121216", margin: "10px 0" }} />
          <YTLabel text="What to Remove" />
          <Body text={o.contentImprovement?.whatToRemove} />
          <div style={{ height: 1, background: "#121216", margin: "10px 0" }} />
          <YTLabel text="Stronger Version" />
          <div
            style={{
              padding: "12px 14px",
              background: "#1a1010",
              border: "1px solid #f0d5d4",
              borderRadius: 14,
            }}
          >
            <p style={{ fontSize: 13.5, fontWeight: 800, color: TEXT, margin: 0, lineHeight: 1.68 }}>
              {o.contentImprovement?.strongerVersion}
            </p>
          </div>
        </Block>

        <YTSectionHeader number={14} title="Final Scores" />
        <DualScore viral={o.finalScores?.viralScore} conversion={o.finalScores?.conversionScore} />
        <Block>
          {o.finalScores?.breakdown &&
            Object.entries(o.finalScores.breakdown).map(([key, val]) => (
              <div key={key} style={{ paddingBottom: 8, marginBottom: 8, borderBottom: `1px solid ${SOFT}` }}>
                <p
                  style={{
                    fontSize: 10,
                    fontWeight: 900,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#999",
                    margin: "0 0 3px",
                  }}
                >
                  {key.replace(/([A-Z])/g, " $1").toUpperCase()}
                </p>
                <p style={{ fontSize: 13.5, color: "#555", margin: 0, lineHeight: 1.6 }}>{val}</p>
              </div>
            ))}
        </Block>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 4 }}>
          <BigButton label="Regenerate" onClick={regenerate} />
          <BigButton label="New Topic" onClick={() => { setOutput(null); setInput(""); }} variant="ghost" />
        </div>
        <div style={{ height: 10 }} />
      </div>
    );
  };

  return (
    <AppShell>
      <Header onBack={onBack} eyebrow="Lane 04" title="YouTube Expansion" />
      <div style={{ padding: "18px 14px 24px" }}>
        {!output && (
          <SoftPanel>
            <p style={{ fontSize: 13.5, color: MUTED, lineHeight: 1.7, margin: "0 0 14px" }}>
              Drop a topic or idea. Get the full 14-section breakdown — titles, structure, clips, hooks, captions, series, and scores.
            </p>
            <TextInput value={input} onChange={setInput} placeholder="e.g. why dads lose muscle faster after 35" rows={5} />
            {error && (
              <div
                style={{
                  padding: "13px 14px",
                  background: "#140d0d",
                  border: "1px solid #f0d5d4",
                  borderRadius: 14,
                  marginBottom: 12,
                }}
              >
                <p style={{ fontSize: 13, color: RED, margin: 0, lineHeight: 1.55 }}>{error}</p>
              </div>
            )}
            {loading ? <Spinner msg={msg} /> : <BigButton label="Build Full Expansion →" onClick={run} />}
          </SoftPanel>
        )}

        {loading && !output && <Spinner msg={msg} />}
        {output && !loading && renderOutput()}
        {output && loading && <Spinner msg={msg} />}
      </div>
    </AppShell>
  );
}

const STORAGE_KEY = "content-engine-saved";

export default function App() {
  const [screen, setScreen] = useState("home");
  const [lane, setLane] = useState(null);
  const [output, setOutput] = useState(null);
  const [outputLane, setOutputLane] = useState(null);
  const [outputFormat, setOutputFormat] = useState(null);
  const [saved, setSaved] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSaved(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    } catch {
      // ignore
    }
  }, [saved]);

  const handleOutput = (result, l, f, showLast = false) => {
    if (showLast) {
      setScreen("output");
      return;
    }
    setOutput(result);
    setOutputLane(l);
    setOutputFormat(f);
    setScreen("output");
  };

  const handleSave = (item) => {
    setSaved((prev) => [
      {
        lane: outputLane,
        format: outputFormat,
        topic: item.topic || item.title || item.factOrAngle || "",
        hook: item.hook || (Array.isArray(item.hooks) ? item.hooks[0] : "") || "",
        score: item.viralScore || item.conversionScore || null,
        fullOutput: item,
        date: new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
      },
      ...prev,
    ]);
  };

  const handleDelete = (i) => {
    setSaved((prev) => prev.filter((_, idx) => idx !== i));
  };

  return (
    <>
      <style>{GLOBAL_STYLE}</style>

      {screen === "home" && (
        <HomeScreen
          onLane={(l) => {
            setLane(l);
            setScreen("generator");
          }}
          onCopy={() => setScreen("copy")}
          onYT={() => setScreen("youtube")}
          onSaved={() => setScreen("saved")}
          savedCount={saved.length}
        />
      )}

      {screen === "generator" && (
        <GeneratorScreen lane={lane} onBack={() => setScreen("home")} onOutput={handleOutput} hasLastOutput={!!output} />
      )}

      {screen === "output" && output && (
        <OutputScreen
          output={output}
          lane={outputLane}
          format={outputFormat}
          onBack={() => setScreen("generator")}
          onSave={handleSave}
          onRerun={() => setScreen("generator")}
        />
      )}

      {screen === "copy" && <CopySystemScreen onBack={() => setScreen("home")} />}
      {screen === "youtube" && <YouTubeExpansionScreen onBack={() => setScreen("home")} />}

      {screen === "saved" && <SavedScreen saved={saved} onBack={() => setScreen("home")} onDelete={handleDelete} />}
    </>
  );
}
