"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

// ============================================================
// BRAND / DESIGN
// ============================================================
const RED = "#be302c";
const BG = "#050505";
const SURFACE = "#0d0d10";
const SURFACE_2 = "#121217";
const BORDER = "#222228";
const TEXT = "#f5f5f7";
const MUTED = "#9a9aa3";
const MUTED_2 = "#6f6f78";
const SOFT_RED = "#1b0d0d";
const GREEN = "#2f9d62";
const MAX_WIDTH = 440;
const FONT = "'Inter', sans-serif";

const GLOBAL_STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

* {
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

html, body {
  margin: 0;
  padding: 0;
  background: ${BG};
  color: ${TEXT};
  font-family: ${FONT};
}

body {
  min-height: 100vh;
}

button, input, textarea, select {
  font-family: inherit;
}

button {
  transition: all 0.16s ease;
}

button:hover {
  filter: brightness(1.03);
}

button:active {
  transform: scale(0.99);
}

textarea {
  resize: none;
}

textarea:focus, input:focus {
  outline: none;
}

img {
  display: block;
  max-width: 100%;
}

pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-thumb {
  background: #2a2a32;
  border-radius: 999px;
}

::-webkit-scrollbar-track {
  background: transparent;
}
`;

// ============================================================
// PROMPTS
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

  unfilteredShort: `Generate short-form Unfiltered content for Leon Charles. Return ONLY valid JSON. No markdown. No preamble.

{
  "factOrAngle": "Core fact or angle. One strong sentence.",
  "hooks": ["hook 1","hook 2","hook 3","hook 4","hook 5"],
  "script": "Full script. 30-60 seconds. Line by line. Real speech. Punchy.",
  "caption": "Caption. Strong opener. No hashtags.",
  "viralScore": 82,
  "whyItWorks": "Why this performs. One or two sentences."
}`,

  unfilteredLong: `Generate long-form YouTube content for Leon Charles Unfiltered. Return ONLY valid JSON. No markdown. No preamble.

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

  coachingShort: `Generate coaching short-form content for Leon Charles.

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
}`,

  coachingLong: `Generate long-form YouTube structure for Leon Charles coaching.

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

  surpriseUnfiltered: `Generate a high-performing content idea for Leon Charles Unfiltered.

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

  surpriseCoaching: `Generate a high-converting coaching content idea for Leon Charles.

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
}`,

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
}`,
};

const COPY_TOOLS = [
  {
    id: "caption",
    label: "Caption Builder",
    desc: "Hook · Body · CTA",
    promptKey: "captionBuilder",
    hasIntent: true,
    inputLabel: "Topic or paste content",
    inputPlaceholder: "e.g. dads stop the gym after 3 weeks because they're chasing motivation",
  },
  {
    id: "cta",
    label: "CTA Builder",
    desc: "Comment · DM · Engagement",
    promptKey: "ctaBuilder",
    hasIntent: false,
    inputLabel: "What is the post or offer about?",
    inputPlaceholder: "e.g. fat loss coaching for busy dads",
  },
  {
    id: "hook",
    label: "Hook Refiner",
    desc: "5 stronger hook versions",
    promptKey: "hookRefiner",
    hasIntent: false,
    inputLabel: "Hook to refine",
    inputPlaceholder: "Paste your hook here",
  },
  {
    id: "rewrite",
    label: "Rewrite Tool",
    desc: "Tighten any copy",
    promptKey: "rewriteTool",
    hasIntent: false,
    inputLabel: "Copy to rewrite",
    inputPlaceholder: "Paste caption, script or copy here",
  },
];

const INTENTS = ["Engagement", "Authority", "Conversion"];
const STORAGE_KEY = "content-engine-saved";

// ============================================================
// API
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
      raw: text.slice(0, 500),
    };
  }
}

// ============================================================
// HOOKS
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

  const start = (initial = "Generating…") => {
    setLoading(true);
    setMsg(initial);
    let i = 0;
    ref.current = setInterval(() => {
      i++;
      if (i < LOADER_MSGS.length) setMsg(LOADER_MSGS[i]);
    }, 1800);
  };

  const stop = () => {
    clearInterval(ref.current);
    setLoading(false);
  };

  useEffect(() => {
    return () => clearInterval(ref.current);
  }, []);

  return { loading, msg, start, stop };
}

// ============================================================
// UI
// ============================================================
function AppShell({ children, sticky = false }) {
  return (
    <div
      style={{
        maxWidth: MAX_WIDTH,
        margin: "0 auto",
        minHeight: "100vh",
        background: BG,
        paddingBottom: sticky ? 102 : 32,
      }}
    >
      {children}
    </div>
  );
}

function Notice({ text, color = RED, bg = SOFT_RED, border = "#311414" }) {
  if (!text) return null;
  return (
    <div
      style={{
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: 14,
        padding: "13px 14px",
        marginBottom: 12,
      }}
    >
      <p style={{ margin: 0, color, fontSize: 13, lineHeight: 1.55 }}>{text}</p>
    </div>
  );
}

function Header({ onBack, eyebrow, title, right }) {
  return (
    <div
      style={{
        padding: "28px 20px 18px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}
    >
      <div style={{ display: "flex", gap: 14 }}>
        <button
          onClick={onBack}
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            border: `1px solid ${BORDER}`,
            background: SURFACE,
            color: TEXT,
            fontSize: 19,
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          ←
        </button>

        <div>
          {eyebrow ? (
            <div
              style={{
                fontSize: 10,
                fontWeight: 900,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: RED,
                marginBottom: 6,
              }}
            >
              {eyebrow}
            </div>
          ) : null}

          <h1
            style={{
              margin: 0,
              color: TEXT,
              fontSize: 24,
              fontWeight: 900,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
            }}
          >
            {title}
          </h1>
        </div>
      </div>

      {right || null}
    </div>
  );
}

function Spinner({ msg }) {
  return (
    <div style={{ textAlign: "center", padding: "54px 0 38px" }}>
      <div
        style={{
          width: 28,
          height: 28,
          border: "3px solid #23232a",
          borderTop: `3px solid ${RED}`,
          borderRadius: "50%",
          margin: "0 auto 14px",
          animation: "spin 0.7s linear infinite",
        }}
      />
      <p style={{ margin: 0, color: MUTED, fontSize: 13, fontWeight: 600 }}>{msg}</p>
    </div>
  );
}

function SoftPanel({ children }) {
  return (
    <div
      style={{
        background: SURFACE,
        border: `1px solid ${BORDER}`,
        borderRadius: 20,
        padding: 16,
      }}
    >
      {children}
    </div>
  );
}

function BigButton({ label, onClick, variant = "red", disabled = false }) {
  const bg = variant === "red" ? RED : variant === "black" ? TEXT : SURFACE_2;
  const color = variant === "black" ? BG : TEXT;
  const border = variant === "ghost" ? `1px solid ${BORDER}` : "none";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%",
        padding: "16px 18px",
        borderRadius: 16,
        border,
        background: disabled ? "#3e3e44" : bg,
        color: disabled ? "#96969c" : color,
        fontSize: 15,
        fontWeight: 900,
        letterSpacing: "-0.01em",
        cursor: disabled ? "not-allowed" : "pointer",
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
        border: accent ? "none" : `1px solid ${BORDER}`,
        background: accent ? RED : SURFACE,
        color: TEXT,
        fontSize: 11,
        fontWeight: 900,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        cursor: "pointer",
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
        left: "50%",
        transform: "translateX(-50%)",
        bottom: 0,
        width: "100%",
        maxWidth: MAX_WIDTH,
        background: "rgba(5,5,5,0.96)",
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

function Pill({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "11px 16px",
        borderRadius: 999,
        border: `1px solid ${active ? TEXT : BORDER}`,
        background: active ? TEXT : SURFACE,
        color: active ? BG : MUTED,
        fontSize: 12,
        fontWeight: 800,
        whiteSpace: "nowrap",
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}

function TextInput({ value, onChange, placeholder, rows = 5 }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      style={{
        width: "100%",
        padding: 18,
        borderRadius: 18,
        border: `1px solid ${BORDER}`,
        background: SURFACE_2,
        color: TEXT,
        fontSize: 15,
        lineHeight: 1.65,
        marginBottom: 14,
      }}
    />
  );
}

function FormatToggle({ value, onChange }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 0,
        padding: 5,
        borderRadius: 18,
        background: SURFACE_2,
        border: `1px solid ${BORDER}`,
        marginBottom: 16,
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
            background: value === f ? TEXT : "transparent",
            color: value === f ? BG : MUTED,
            fontSize: 14,
            fontWeight: 900,
            cursor: "pointer",
          }}
        >
          {f === "short" ? "Short Form" : "Long Form"}
        </button>
      ))}
    </div>
  );
}

function LaneCard({ lane, title, desc, onClick, strong = false, outlined = false, arrow = false }) {
  const bg = strong ? TEXT : outlined ? BG : SURFACE;
  const border = strong ? "none" : outlined ? `2px solid ${TEXT}` : `1px solid ${BORDER}`;
  const titleColor = strong ? BG : TEXT;
  const descColor = strong ? "#4a4a52" : MUTED;
  const laneColor = strong || outlined ? RED : MUTED_2;

  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        padding: strong ? "24px 20px" : "20px 18px",
        borderRadius: 20,
        border,
        background: bg,
        textAlign: "left",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        cursor: "pointer",
      }}
    >
      <div>
        <div
          style={{
            fontSize: 10,
            fontWeight: 900,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: laneColor,
            marginBottom: 8,
          }}
        >
          {lane}
        </div>

        <div
          style={{
            fontSize: strong ? 24 : 18,
            fontWeight: 900,
            letterSpacing: "-0.03em",
            color: titleColor,
            marginBottom: 5,
          }}
        >
          {title}
        </div>

        <div
          style={{
            fontSize: strong ? 13.5 : 12.5,
            color: descColor,
            lineHeight: 1.45,
          }}
        >
          {desc}
        </div>
      </div>

      {arrow ? <span style={{ fontSize: 22, color: MUTED_2 }}>›</span> : null}
    </button>
  );
}

function ScoreBar({ score, label }) {
  if (score === undefined || score === null) return null;

  const strength =
    score >= 85 ? "Strong" : score >= 70 ? "Good" : score >= 50 ? "Mid" : "Weak";

  return (
    <div
      style={{
        background: SURFACE,
        border: `1px solid ${BORDER}`,
        borderRadius: 18,
        padding: "18px 18px 14px",
        marginBottom: 10,
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
            color: MUTED_2,
          }}
        >
          {label}
        </span>

        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span
            style={{
              fontSize: 34,
              fontWeight: 900,
              color: score >= 85 ? RED : TEXT,
              letterSpacing: "-0.04em",
            }}
          >
            {score}
          </span>
          <span
            style={{
              fontSize: 10,
              fontWeight: 900,
              color: score >= 85 ? RED : MUTED,
              letterSpacing: "0.08em",
            }}
          >
            {strength.toUpperCase()}
          </span>
        </div>
      </div>

      <div style={{ height: 5, background: "#202028", borderRadius: 999 }}>
        <div
          style={{
            height: "100%",
            width: `${Math.max(0, Math.min(100, score))}%`,
            background: RED,
            borderRadius: 999,
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
        background: SOFT_RED,
        border: "1px solid #311414",
        borderRadius: 16,
        padding: "14px 16px",
        marginBottom: 10,
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 900,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: RED,
          marginBottom: 6,
        }}
      >
        Why it works
      </div>

      <p style={{ margin: 0, color: "#d1d1d6", fontSize: 13, lineHeight: 1.7 }}>
        {text}
      </p>
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
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div
      style={{
        background: accent ? SOFT_RED : SURFACE,
        border: `1px solid ${accent ? "#311414" : BORDER}`,
        borderRadius: 18,
        padding: "16px 16px 15px",
        marginBottom: 10,
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
            background: "none",
            border: "none",
            color: copied ? RED : MUTED_2,
            fontSize: 10,
            fontWeight: 900,
            letterSpacing: "0.07em",
            textTransform: "uppercase",
            cursor: "pointer",
            padding: 0,
          }}
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      {Array.isArray(content) ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {content.map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 10 }}>
              <span
                style={{
                  minWidth: 14,
                  color: RED,
                  fontSize: 11,
                  fontWeight: 900,
                  paddingTop: 2,
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </span>

              <p style={{ margin: 0, color: TEXT, fontSize: 14, lineHeight: 1.68 }}>
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
            margin: 0,
            color: TEXT,
            lineHeight: 1.78,
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

// ============================================================
// HOME
// ============================================================
function HomeScreen({ onLane, onCopy, onYT, onSaved, savedCount }) {
  return (
    <AppShell>
      <div style={{ padding: "24px 16px 28px" }}>
        <div
          style={{
            borderRadius: 26,
            background: SURFACE,
            border: `1px solid ${BORDER}`,
            padding: "20px 18px 18px",
            marginBottom: 14,
          }}
        >
          <div
            style={{
              background: "#09090a",
              borderRadius: 18,
              border: `1px solid ${BORDER}`,
              padding: "18px 14px",
              marginBottom: 18,
            }}
          >
            <img
              src="/logo.png"
              alt="Content Engine"
              style={{
                width: "58%",
                maxWidth: 210,
                margin: "0 auto",
              }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
            <div style={{ width: 7, height: 7, background: RED, borderRadius: "50%" }} />
            <div
              style={{
                fontSize: 10,
                fontWeight: 900,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: RED,
              }}
            >
              Private
            </div>
          </div>

          <h1
            style={{
              margin: "0 0 10px",
              color: TEXT,
              fontSize: 44,
              fontWeight: 900,
              letterSpacing: "-0.05em",
              lineHeight: 0.92,
            }}
          >
            Content
            <br />
            Engine
          </h1>

          <p style={{ margin: 0, color: MUTED, fontSize: 15, lineHeight: 1.55 }}>
            Unfiltered · Coaching · Copy.
            <br />
            Private. No noise.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <LaneCard
            lane="Lane 01"
            title="Unfiltered"
            desc="Reaction · Opinion · Bro Did You Know"
            onClick={() => onLane("unfiltered")}
            strong
          />

          <LaneCard
            lane="Lane 02"
            title="Coaching"
            desc="Hooks · Reels · Scripts · Long Form"
            onClick={() => onLane("coaching")}
            outlined
          />

          <LaneCard
            lane="Lane 03"
            title="Copy System"
            desc="Captions · CTAs · Hook Refiner · Rewrite"
            onClick={onCopy}
            arrow
          />

          <LaneCard
            lane="Lane 04"
            title="YouTube Expansion"
            desc="Titles · Clips · Captions · Series · Scores"
            onClick={onYT}
            arrow
          />

          <button
            onClick={onSaved}
            style={{
              padding: "16px 18px",
              background: SURFACE,
              borderRadius: 18,
              border: `1px solid ${BORDER}`,
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
                <p style={{ margin: 0, color: TEXT, fontSize: 14, fontWeight: 800 }}>Saved Ideas</p>
                <p style={{ margin: "2px 0 0", color: MUTED, fontSize: 12 }}>{savedCount} saved</p>
              </div>
            </div>
            <span style={{ fontSize: 18, color: MUTED_2 }}>›</span>
          </button>
        </div>
      </div>
    </AppShell>
  );
}

// ============================================================
// GENERATOR
// ============================================================
function GeneratorScreen({ lane, onBack, onOutput, hasLastOutput }) {
  const [format, setFormat] = useState("short");
  const [contentType, setContentType] = useState("general");
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const { loading, msg, start, stop } = useLoader();

  const isCoaching = lane === "coaching";

  const promptToUse = useMemo(() => {
    if (isCoaching) return format === "short" ? PROMPTS.coachingShort : PROMPTS.coachingLong;
    if (contentType === "bro") return PROMPTS.broDidYouKnow;
    return format === "short" ? PROMPTS.unfilteredShort : PROMPTS.unfilteredLong;
  }, [isCoaching, format, contentType]);

  const run = async () => {
    setError("");
    start();
    try {
      const result = await callClaude(
        promptToUse,
        input || "Generate a strong content idea."
      );
      stop();

      if (result.error) {
        setError(result.details ? `${result.error}: ${result.details}` : result.error);
        return;
      }

      onOutput(result, lane,
