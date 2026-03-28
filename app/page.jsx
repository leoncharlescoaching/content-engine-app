"use client";

import React, { useState, useRef, useEffect } from "react";

// ============================================================
// PROMPT CONFIG — edit these without touching the UI
// ============================================================
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
}`
};

// ============================================================
// API CALL
// ============================================================
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

// ============================================================
// DESIGN TOKENS
// ============================================================
const RED = "#be302c";
const BLACK = "#0b0b0c";
const TEXT = "#151515";
const MUTED = "#6d6d72";
const SOFT = "#f5f5f7";
const BORDER = "#ececef";
const CARD = "#ffffff";
const FONT = "'Inter', sans-serif";
const MAX_WIDTH = 460;

const GLOBAL_STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

* { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
html, body { margin: 0; padding: 0; background: #ffffff; font-family: ${FONT}; color: ${TEXT}; }
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

// ============================================================
// LOADER HOOK
// ============================================================
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
      i++;
      if (i < LOADER_MSGS.length) setMsg(LOADER_MSGS[i]);
    }, 1900);
  };

  const stop = () => {
    clearInterval(ref.current);
    setLoading(false);
  };

  return { loading, msg, start, stop };
}

// ============================================================
// SHARED COMPONENTS
// ============================================================
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
        boxShadow: active ? "0 8px 20px rgba(0,0,0,0.08)" : "none",
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
        boxShadow: variant === "ghost" ? "none" : "0 10px 24px rgba(0,0,0,0.08)",
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
        background: "rgba(255,255,255,0.96)",
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
            background: SOFT,
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
              color: BLACK,
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
        background: "#ffffff",
        border: `1.5px solid ${BORDER}`,
        borderRadius: 18,
        fontSize: 15,
        lineHeight: 1.65,
        color: BLACK,
        marginBottom: 14,
      }}
    />
  );
}

function Divider() {
  return <div style={{ height: 1, background: SOFT, margin: "18px 0" }} />;
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
        background: "#ffffff",
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
          <span style={{ fontSize: 34, fontWeight: 900, color: col, letterSpacing: "-0.04em" }}>
            {score}
          </span>
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
      <div style={{ height: 5, background: "#efeff2", borderRadius: 999 }}>
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
        background: "#fff8f8",
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
        background: "#f4f4f6",
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
          {f === "short" ? "
