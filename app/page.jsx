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
const BLACK = "#0a0a0a";
const FONT = "'Inter', sans-serif";

const GLOBAL_STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
* { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
html, body { margin: 0; padding: 0; background: #fff; font-family: ${FONT}; }
button, input, textarea, select { font-family: inherit; }
button:active { opacity: 0.85; transform: scale(0.99); }
textarea:focus, input:focus { outline: none; }
textarea { resize: none; }
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
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
function Spinner({ msg }) {
  return (
    <div style={{ padding: "48px 0", textAlign: "center" }}>
      <div style={{
        width: 26, height: 26,
        border: "3px solid #f0f0f0",
        borderTop: `3px solid ${RED}`,
        borderRadius: "50%",
        margin: "0 auto 14px",
        animation: "spin 0.7s linear infinite",
      }} />
      <p style={{ fontSize: 13, color: "#999", margin: 0 }}>{msg}</p>
    </div>
  );
}

function SectionLabel({ text }) {
  return (
    <p style={{
      fontSize: 10, fontWeight: 900, letterSpacing: "0.1em",
      textTransform: "uppercase", color: "#999", margin: "0 0 8px",
    }}>
      {text}
    </p>
  );
}

function Pill({ label, active, onClick, dark = false }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "8px 14px", borderRadius: 999,
        border: `1.5px solid ${active ? (dark ? BLACK : RED) : "#e4e4e4"}`,
        background: active ? (dark ? BLACK : RED) : "#fff",
        color: active ? "#fff" : "#888",
        fontSize: 12, fontWeight: 700, cursor: "pointer",
        whiteSpace: "nowrap", transition: "all 0.12s", flexShrink: 0,
      }}
    >
      {label}
    </button>
  );
}

function BigButton({ label, onClick, variant = "red", disabled = false }) {
  const bg = variant === "red" ? RED : variant === "black" ? BLACK : "#fafafa";
  const col = variant === "ghost" ? "#777" : "#fff";
  const border = variant === "ghost" ? "1.5px solid #ebebeb" : "none";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%", padding: "15px", borderRadius: 10,
        border, background: disabled ? "#ddd" : bg,
        cursor: disabled ? "not-allowed" : "pointer",
        fontSize: 14, fontWeight: 800,
        color: disabled ? "#888" : col,
        letterSpacing: "0.02em", marginBottom: 8,
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
        flex: 1, padding: "11px 0", borderRadius: 8,
        border: accent ? "none" : "1.5px solid #ebebeb",
        background: accent ? RED : "#fafafa",
        cursor: "pointer", fontSize: 11, fontWeight: 800,
        color: accent ? "#fff" : "#666",
        letterSpacing: "0.05em", textTransform: "uppercase",
      }}
    >
      {label}
    </button>
  );
}

function StickyActions({ buttons }) {
  return (
    <div style={{
      position: "fixed", bottom: 0,
      left: "50%", transform: "translateX(-50%)",
      width: "100%", maxWidth: 430,
      background: "#fff", borderTop: "1px solid #ebebeb",
      padding: "10px 14px 24px", zIndex: 100,
    }}>
      <div style={{ display: "flex", gap: 7 }}>
        {buttons.map((b) => (
          <MiniButton key={b.label} label={b.label} onClick={b.fn} accent={b.accent} />
        ))}
      </div>
    </div>
  );
}

function Header({ onBack, eyebrow, title, right }) {
  return (
    <div style={{
      padding: "50px 20px 18px",
      display: "flex", alignItems: "flex-start", justifyContent: "space-between",
    }}>
      <div style={{ display: "flex", gap: 12 }}>
        <button
          onClick={onBack}
          style={{
            background: "none", border: "none", cursor: "pointer",
            padding: 0, fontSize: 20, color: "#bbb", marginTop: 4, lineHeight: 1,
          }}
        >
          ←
        </button>
        <div>
          {eyebrow && (
            <span style={{
              fontSize: 10, fontWeight: 900, letterSpacing: "0.1em",
              textTransform: "uppercase", color: RED,
            }}>
              {eyebrow}
            </span>
          )}
          <h1 style={{
            fontSize: 22, fontWeight: 900, color: BLACK,
            margin: eyebrow ? "3px 0 0" : "0", letterSpacing: "-0.02em",
          }}>
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
        width: "100%", padding: "14px",
        background: "#fafafa", border: "1.5px solid #ebebeb",
        borderRadius: 10, fontSize: 14, lineHeight: 1.65,
        color: BLACK, marginBottom: 12,
      }}
    />
  );
}

function Divider() {
  return <div style={{ height: 1, background: "#f0f0f0", margin: "16px 0" }} />;
}

function ScoreBar({ score, label }) {
  if (score === undefined || score === null) return null;
  const strength = score >= 85 ? "Strong" : score >= 70 ? "Good" : score >= 50 ? "Mid" : "Weak";
  const col = score >= 85 ? RED : score >= 70 ? BLACK : "#aaa";
  return (
    <div style={{ padding: "16px 20px 12px", marginBottom: 4 }}>
      <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "baseline", marginBottom: 8,
      }}>
        <span style={{
          fontSize: 10, fontWeight: 800, letterSpacing: "0.1em",
          textTransform: "uppercase", color: "#999",
        }}>
          {label}
        </span>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span style={{ fontSize: 30, fontWeight: 900, color: col, letterSpacing: "-0.03em" }}>
            {score}
          </span>
          <span style={{ fontSize: 10, fontWeight: 900, color: col, letterSpacing: "0.08em" }}>
            {strength.toUpperCase()}
          </span>
        </div>
      </div>
      <div style={{ height: 3, background: "#f0f0f0", borderRadius: 2 }}>
        <div style={{
          height: "100%", width: `${Math.max(0, Math.min(100, score))}%`,
          background: RED, borderRadius: 2, transition: "width 0.8s ease",
        }} />
      </div>
    </div>
  );
}

function WhyBox({ text }) {
  if (!text) return null;
  return (
    <div style={{
      padding: "12px 16px", background: "#fff8f8",
      border: "1px solid #f0d5d4", borderRadius: 8,
      marginBottom: 10, animation: "fadeUp 0.2s ease",
    }}>
      <p style={{
        fontSize: 10, fontWeight: 900, letterSpacing: "0.1em",
        textTransform: "uppercase", color: RED, margin: "0 0 5px",
      }}>
        Why it works
      </p>
      <p style={{ fontSize: 13, lineHeight: 1.65, color: "#555", margin: 0 }}>{text}</p>
    </div>
  );
}

function Card({ title, content, mono = false, accent = false }) {
  const [copied, setCopied] = useState(false);
  if (!content || (Array.isArray(content) && content.length === 0)) return null;

  const flatText = Array.isArray(content)
    ? content.map((item, i) => {
        if (typeof item === "object") {
          if (item.point) return `${i + 1}. ${item.point}: ${item.detail}`;
          if (item.title) return `${i + 1}. ${item.title} - ${item.angle || item.detail || ""}`;
          return `${i + 1}. ${JSON.stringify(item)}`;
        }
        return `${i + 1}. ${item}`;
      }).join("\n")
    : String(content);

  const copy = async () => {
    await navigator.clipboard.writeText(flatText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      marginBottom: 10, padding: "14px 16px",
      background: accent ? "#fff8f8" : "#fafafa",
      border: `1px solid ${accent ? "#f0d5d4" : "#ebebeb"}`,
      borderRadius: 8, animation: "fadeUp 0.2s ease",
    }}>
      <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: 8,
      }}>
        <span style={{
          fontSize: 10, fontWeight: 900, letterSpacing: "0.1em",
          textTransform: "uppercase", color: RED,
        }}>
          {title}
        </span>
        <button
          onClick={copy}
          style={{
            fontSize: 10, fontWeight: 800, letterSpacing: "0.07em",
            textTransform: "uppercase", color: copied ? RED : "#bbb",
            background: "none", border: "none", cursor: "pointer", padding: 0,
          }}
        >
          {copied ? "COPIED" : "COPY"}
        </button>
      </div>

      {Array.isArray(content) ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {content.map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 10 }}>
              <span style={{
                fontSize: 11, fontWeight: 900, color: RED,
                minWidth: 14, paddingTop: 2, flexShrink: 0,
              }}>
                {i + 1}
              </span>
              <p style={{ fontSize: 14, lineHeight: 1.65, color: BLACK, margin: 0 }}>
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
        <p style={{
          lineHeight: 1.75, color: BLACK, margin: 0,
          whiteSpace: "pre-wrap",
          fontFamily: mono ? "'Courier New', monospace" : FONT,
          fontSize: mono ? 13 : 14,
        }}>
          {content}
        </p>
      )}
    </div>
  );
}

function FormatToggle({ value, onChange }) {
  return (
    <div style={{
      display: "flex", background: "#f5f5f5",
      borderRadius: 8, padding: 4, marginBottom: 14,
    }}>
      {["short", "long"].map((f) => (
        <button
          key={f}
          onClick={() => onChange(f)}
          style={{
            flex: 1, padding: "10px 0", borderRadius: 6, border: "none",
            cursor: "pointer", fontSize: 13, fontWeight: 800,
            background: value === f ? BLACK : "transparent",
            color: value === f ? "#fff" : "#888",
            transition: "all 0.12s",
          }}
        >
          {f === "short" ? "Short Form" : "Long Form"}
        </button>
      ))}
    </div>
  );
}

// ============================================================
// HOME
// ============================================================
function HomeScreen({ onLane, onCopy, onYT, onSaved, savedCount }) {
  return (
    <div style={{ padding: "0 0 40px" }}>
      <div style={{ padding: "56px 20px 28px" }}>
        <div style={{ marginBottom: 20, textAlign: "center" }}>
          <img
            src="/logo.png"
            alt="Content Engine"
            style={{ width: "68%", maxWidth: 260, height: "auto", display: "block", margin: "0 auto" }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
          <div style={{ width: 7, height: 7, background: RED, borderRadius: "50%" }} />
          <span style={{
            fontSize: 10, fontWeight: 900, letterSpacing: "0.12em",
            textTransform: "uppercase", color: RED,
          }}>
            Private
          </span>
        </div>

        <h1 style={{
          fontSize: 38, fontWeight: 900, color: BLACK,
          margin: "0 0 6px", letterSpacing: "-0.03em", lineHeight: 1,
        }}>
          Content<br />Engine
        </h1>

        <p style={{ fontSize: 14, color: "#999", margin: 0, lineHeight: 1.5 }}>
          Unfiltered · Coaching · Copy.<br />Private. No noise.
        </p>
      </div>

      <div style={{ padding: "0 14px", display: "flex", flexDirection: "column", gap: 10 }}>
        <button
          onClick={() => onLane("unfiltered")}
          style={{
            padding: "26px 22px", background: BLACK,
            borderRadius: 12, border: "none", cursor: "pointer",
            textAlign: "left", display: "block",
          }}
        >
          <p style={{
            fontSize: 10, fontWeight: 900, letterSpacing: "0.1em",
            textTransform: "uppercase", color: "#555", margin: "0 0 6px",
          }}>
            Lane 01
          </p>
          <h2 style={{
            fontSize: 24, fontWeight: 900, color: "#fff",
            margin: "0 0 5px", letterSpacing: "-0.02em",
          }}>
            Unfiltered
          </h2>
          <p style={{ fontSize: 12, color: "#777", margin: 0, lineHeight: 1.4 }}>
            Reaction · Opinion · Bro Did You Know
          </p>
        </button>

        <button
          onClick={() => onLane("coaching")}
          style={{
            padding: "26px 22px", background: "#fff",
            borderRadius: 12, border: `2px solid ${BLACK}`,
            cursor: "pointer", textAlign: "left", display: "block",
          }}
        >
          <p style={{
            fontSize: 10, fontWeight: 900, letterSpacing: "0.1em",
            textTransform: "uppercase", color: RED, margin: "0 0 6px",
          }}>
            Lane 02
          </p>
          <h2 style={{
            fontSize: 24, fontWeight: 900, color: BLACK,
            margin: "0 0 5px", letterSpacing: "-0.02em",
          }}>
            Coaching
          </h2>
          <p style={{ fontSize: 12, color: "#999", margin: 0, lineHeight: 1.4 }}>
            Hooks · Reels · Scripts · Long Form
          </p>
        </button>

        <button
          onClick={onCopy}
          style={{
            padding: "22px", background: "#fff", borderRadius: 12,
            border: "1.5px solid #e4e4e4", cursor: "pointer", textAlign: "left",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}
        >
          <div>
            <p style={{
              fontSize: 10, fontWeight: 900, letterSpacing: "0.1em",
              textTransform: "uppercase", color: "#999", margin: "0 0 5px",
            }}>
              Lane 03
            </p>
            <h2 style={{
              fontSize: 22, fontWeight: 900, color: BLACK,
              margin: "0 0 4px", letterSpacing: "-0.02em",
            }}>
              Copy System
            </h2>
            <p style={{ fontSize: 12, color: "#999", margin: 0 }}>
              Captions · CTAs · Hook Refiner · Rewrite · Long Form
            </p>
          </div>
          <span style={{ fontSize: 20, color: "#ddd", marginLeft: 10 }}>›</span>
        </button>

        <button
          onClick={onYT}
          style={{
            padding: "22px", background: "#fff", borderRadius: 12,
            border: "1.5px solid #e4e4e4", cursor: "pointer", textAlign: "left",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}
        >
          <div>
            <p style={{
              fontSize: 10, fontWeight: 900, letterSpacing: "0.1em",
              textTransform: "uppercase", color: "#999", margin: "0 0 5px",
            }}>
              Lane 04
            </p>
            <h2 style={{
              fontSize: 22, fontWeight: 900, color: BLACK,
              margin: "0 0 4px", letterSpacing: "-0.02em",
            }}>
              YouTube Expansion
            </h2>
            <p style={{ fontSize: 12, color: "#999", margin: 0 }}>
              Full breakdown · Titles · Clips · Series · Scores
            </p>
          </div>
          <span style={{ fontSize: 20, color: "#ddd", marginLeft: 10 }}>›</span>
        </button>

        <button
          onClick={onSaved}
          style={{
            padding: "16px 18px", background: "#fafafa", borderRadius: 10,
            border: "1px solid #ebebeb", cursor: "pointer", textAlign: "left",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 18 }}>🔖</span>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: BLACK, margin: 0 }}>Saved Ideas</p>
              <p style={{ fontSize: 12, color: "#999", margin: 0 }}>{savedCount} saved</p>
            </div>
          </div>
          <span style={{ fontSize: 18, color: "#ddd" }}>›</span>
        </button>
      </div>
    </div>
  );
}

// ============================================================
// GENERATOR
// ============================================================
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
      if (result.error) { setError(result.error); return; }
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
      if (result.error) { setError(result.error); return; }
      onOutput(result, lane, format);
    } catch {
      stop();
      setError("Something went wrong.");
    }
  };

  return (
    <div style={{ paddingBottom: 40 }}>
      <Header
        onBack={onBack}
        eyebrow={lane.toUpperCase()}
        title={isCoaching ? "Coaching Generator" : "Unfiltered Generator"}
      />
      <div style={{ padding: "0 14px" }}>
        <FormatToggle value={format} onChange={setFormat} />

        {!isCoaching && (
          <div style={{ display: "flex", gap: 7, marginBottom: 14, overflowX: "auto", paddingBottom: 2 }}>
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
        />

        {error && <p style={{ fontSize: 13, color: RED, marginBottom: 10 }}>{error}</p>}

        {loading ? (
          <Spinner msg={msg} />
        ) : (
          <>
            <BigButton label="Generate →" onClick={run} />
            <div style={{
              display: "grid",
              gridTemplateColumns: hasLastOutput ? "1fr 1fr" : "1fr",
              gap: 8,
            }}>
              <BigButton label="✦ Surprise Me" onClick={surprise} variant="black" />
              {hasLastOutput && (
                <BigButton label="← Last Output" onClick={() => onOutput(null, null, null, true)} variant="ghost" />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ============================================================
// OUTPUT
// ============================================================
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
          ? v.map((i, idx) =>
              typeof i === "object"
                ? `${idx + 1}. ${i.title || i.point || JSON.stringify(i)}`
                : `${idx + 1}. ${i}`
            ).join("\n")
          : v;
        return `${k.toUpperCase()}\n${body}`;
      }).join("\n\n");
    await navigator.clipboard.writeText(lines);
  };

  if (!output) return null;
  const score = output.viralScore || output.conversionScore;

  return (
    <div style={{ paddingBottom: 90 }}>
      <Header
        onBack={onBack}
        eyebrow={`${lane?.toUpperCase()} · ${format?.toUpperCase()}`}
        title="Output"
        right={
          <button
            onClick={() => onSave(output)}
            style={{
              padding: "8px 13px", background: "#fafafa",
              border: "1.5px solid #ebebeb", borderRadius: 8,
              cursor: "pointer", fontSize: 12, fontWeight: 800,
              color: "#777", marginTop: 4,
            }}
          >
            🔖 Save
          </button>
        }
      />

      {loading ? (
        <Spinner msg={msg} />
      ) : (
        <div style={{ padding: "0 14px" }}>
          {score != null && (
            <ScoreBar score={score} label={isCoaching ? "Conversion Score" : "Viral Score"} />
          )}
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
          {output.mainPoints && (
            <Card title="Main Points" content={output.mainPoints.map((p) => `${p.point}: ${p.detail}`)} />
          )}
          {output.realLifeExamples && <Card title="Real-Life Examples" content={output.realLifeExamples} />}
          <Card title="Closing Message" content={output.closingMessage} />

          {output.shortClips && (
            <div style={{
              marginBottom: 10, padding: "14px 16px",
              background: "#fafafa", border: "1px solid #ebebeb", borderRadius: 8,
            }}>
              <p style={{
                fontSize: 10, fontWeight: 900, letterSpacing: "0.1em",
                textTransform: "uppercase", color: RED, margin: "0 0 10px",
              }}>
                Short Clips
              </p>
              {output.shortClips.map((clip, i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8 }}>
                  <span style={{
                    fontSize: 11, fontWeight: 900, color: RED,
                    minWidth: 14, flexShrink: 0,
                  }}>
                    {i + 1}
                  </span>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: BLACK, margin: "0 0 2px" }}>
                      {clip.title}
                    </p>
                    <p style={{ fontSize: 12, color: "#888", margin: 0 }}>{clip.angle}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {output.type && (
            <div style={{
              display: "inline-block", padding: "4px 10px",
              background: "#f5f5f5", borderRadius: 5, marginBottom: 10,
            }}>
              <span style={{
                fontSize: 10, fontWeight: 900, letterSpacing: "0.08em",
                textTransform: "uppercase", color: "#999",
              }}>
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
    </div>
  );
}

// ============================================================
// COPY SYSTEM
// ============================================================
const COPY_TOOLS = [
  {
    id: "caption", label: "Caption Builder", desc: "Hook · Body · CTA",
    prompt: "captionBuilder", hasIntent: true,
    inputLabel: "Topic or paste content from generator",
    inputPlaceholder: "e.g. why dads stop going to the gym after 3 weeks",
  },
  {
    id: "cta", label: "CTA Builder", desc: "Comment · DM · Engagement CTAs",
    prompt: "ctaBuilder", hasIntent: true,
    inputLabel: "What is the post or offer about",
    inputPlaceholder: "e.g. fat loss coaching for busy dads",
  },
  {
    id: "hookRefiner", label: "Hook Refiner", desc: "5 stronger hook versions",
    prompt: "hookRefiner", hasIntent: false,
    inputLabel: "Hook to refine",
    inputPlaceholder: "Paste your existing hook here...",
  },
  {
    id: "rewrite", label: "Rewrite Tool", desc: "Tighten any copy",
    prompt: "rewriteTool", hasIntent: false,
    inputLabel: "Copy to rewrite",
    inputPlaceholder: "Paste any caption, script, or copy...",
    rows: 6,
  },
  {
    id: "longform", label: "Long Form Copy", desc: "Descriptions · Storytelling",
    prompt: "longFormCopy", hasIntent: true,
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
      if (result?.error) { setError(result.error); return; }
      setOutput(result);
    } catch {
      stop();
      setError("Something went wrong. Try again.");
    }
  };

  const reset = () => { setOutput(null); setInput(""); setHook(""); };

  return (
    <div style={{ paddingBottom: 60 }}>
      <Header onBack={onBack} eyebrow="Lane 03" title="Copy System" />
      <div style={{ padding: "0 14px" }}>
        <SectionLabel text="Select Tool" />
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
          {COPY_TOOLS.map((t) => (
            <button
              key={t.id}
              onClick={() => { setToolId(t.id); setOutput(null); setInput(""); setHook(""); }}
              style={{
                padding: "14px 16px", borderRadius: 9,
                border: `1.5px solid ${toolId === t.id ? BLACK : "#e8e8e8"}`,
                background: toolId === t.id ? BLACK : "#fafafa",
                cursor: "pointer", textAlign: "left",
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}
            >
              <div>
                <p style={{ fontSize: 13, fontWeight: 800, color: toolId === t.id ? "#fff" : BLACK, margin: 0 }}>
                  {t.label}
                </p>
                <p style={{ fontSize: 11, color: toolId === t.id ? "#777" : "#aaa", margin: "2px 0 0" }}>
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
                <div style={{ display: "flex", gap: 7, marginBottom: 14 }}>
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
            {error && <p style={{ fontSize: 13, color: RED, marginBottom: 10 }}>{error}</p>}
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
              <div style={{
                padding: "13px 16px", background: "#fff8f8",
                border: "1px solid #f0d5d4", borderRadius: 8, marginBottom: 10,
              }}>
                <p style={{
                  fontSize: 10, fontWeight: 900, letterSpacing: "0.1em",
                  textTransform: "uppercase", color: RED, margin: "0 0 5px",
                }}>
                  Strongest
                </p>
                <p style={{ fontSize: 14, fontWeight: 800, color: BLACK, margin: "0 0 5px" }}>
                  {output.strongest}
                </p>
                {output.whyStrongest && (
                  <p style={{ fontSize: 12, color: "#888", margin: 0, fontStyle: "italic" }}>
                    {output.whyStrongest}
                  </p>
                )}
              </div>
            )}
            {output.rewritten && <Card title="Rewritten" content={output.rewritten} accent />}
            {output.whatChanged && (
              <div style={{
                padding: "11px 14px", background: "#fafafa",
                border: "1px solid #ebebeb", borderRadius: 8, marginBottom: 10,
              }}>
                <p style={{
                  fontSize: 10, fontWeight: 900, letterSpacing: "0.1em",
                  textTransform: "uppercase", color: "#999", margin: "0 0 4px",
                }}>
                  What Changed
                </p>
                <p style={{ fontSize: 13, lineHeight: 1.6, color: "#777", margin: 0 }}>
                  {output.whatChanged}
                </p>
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
      </div>
    </div>
  );
}

// ============================================================
// SAVED
// ============================================================
function SavedScreen({ saved, onBack, onDelete }) {
  return (
    <div style={{ paddingBottom: 40 }}>
      <Header onBack={onBack} title="Saved Ideas" />
      <div style={{ padding: "0 14px" }}>
        {saved.length === 0 ? (
          <p style={{
            fontSize: 13, color: "#aaa", textAlign: "center",
            padding: "50px 0", lineHeight: 1.7,
          }}>
            Nothing saved yet.<br />Hit 🔖 on any output to save it here.
          </p>
        ) : (
          saved.map((item, i) => (
            <div key={i} style={{
              padding: "14px 16px", background: "#fafafa",
              border: "1px solid #ebebeb", borderRadius: 8, marginBottom: 10,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ display: "flex", gap: 6 }}>
                  <span style={{
                    fontSize: 10, fontWeight: 900, letterSpacing: "0.07em",
                    textTransform: "uppercase",
                    color: item.lane === "coaching" ? RED : "#666",
                    background: item.lane === "coaching" ? "#fff4f4" : "#f0f0f0",
                    padding: "3px 8px", borderRadius: 4,
                  }}>
                    {item.lane}
                  </span>
                  <span style={{
                    fontSize: 10, fontWeight: 700, color: "#999",
                    background: "#f0f0f0", padding: "3px 8px", borderRadius: 4,
                  }}>
                    {item.format}
                  </span>
                </div>
                <button
                  onClick={() => onDelete(i)}
                  style={{
                    fontSize: 13, color: "#bbb", background: "none",
                    border: "none", cursor: "pointer", padding: 0,
                  }}
                >
                  ✕
                </button>
              </div>
              <p style={{ fontSize: 13, fontWeight: 700, color: BLACK, margin: "0 0 3px" }}>
                {item.topic || item.hook || "Saved idea"}
              </p>
              {item.score && (
                <p style={{ fontSize: 12, color: "#999", margin: 0 }}>
                  Score: <span style={{ color: RED, fontWeight: 900 }}>{item.score}</span>
                </p>
              )}
              <p style={{ fontSize: 11, color: "#bbb", margin: "6px 0 0" }}>{item.date}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ============================================================
// YOUTUBE EXPANSION
// ============================================================
function YouTubeExpansionScreen({ onBack }) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState(null);
  const [error, setError] = useState(null);
  const { loading, msg, start, stop } = useLoader();

  const run = async () => {
    if (!input.trim()) { setError("Enter a topic or idea first."); return; }
    setError(null);
    setOutput(null);
    start("Building full expansion…");
    try {
      const result = await callClaude(PROMPTS.youtubeExpansion, `Topic: ${input}`);
      stop();
      if (result?.error) { setError(result.error); return; }
      setOutput(result);
    } catch {
      stop();
      setError("Something went wrong. Try again.");
    }
  };

  const regenerate = () => { setOutput(null); run(); };

  const YTSectionHeader = ({ number, title }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, marginTop: 6 }}>
      <span style={{
        fontSize: 10, fontWeight: 900, color: "#fff", background: RED,
        width: 22, height: 22, borderRadius: "50%",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        {number}
      </span>
      <span style={{
        fontSize: 11, fontWeight: 900, letterSpacing: "0.1em",
        textTransform: "uppercase", color: BLACK,
      }}>
        {title}
      </span>
    </div>
  );

  const Block = ({ children }) => (
    <div style={{
      marginBottom: 14, padding: "14px 16px",
      background: "#fafafa", border: "1px solid #ebebeb",
      borderRadius: 8, animation: "fadeUp 0.2s ease",
    }}>
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
            fontSize: 10, fontWeight: 800, letterSpacing: "0.07em",
            textTransform: "uppercase", color: copied ? RED : "#bbb",
            background: "none", border: "none", cursor: "pointer", padding: 0,
          }}
        >
          {copied ? "COPIED" : "COPY"}
        </button>
      </div>
    );
  };

  const ListItems = ({ items }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {(items || []).map((item, i) => (
        <div key={i} style={{ display: "flex", gap: 10 }}>
          <span style={{
            fontSize: 11, fontWeight: 900, color: RED,
            minWidth: 14, paddingTop: 2, flexShrink: 0,
          }}>
            {i + 1}
          </span>
          <p style={{ fontSize: 13, lineHeight: 1.65, color: BLACK, margin: 0 }}>{item}</p>
        </div>
      ))}
    </div>
  );

  const YTLabel = ({ text }) => (
    <p style={{
      fontSize: 10, fontWeight: 900, letterSpacing: "0.1em",
      textTransform: "uppercase", color: RED, margin: "0 0 4px",
    }}>
      {text}
    </p>
  );

  const Body = ({ text }) => (
    <p style={{ fontSize: 13, lineHeight: 1.7, color: BLACK, margin: 0, whiteSpace: "pre-wrap" }}>
      {text}
    </p>
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
          <div key={label} style={{
            flex: 1, padding: "14px", background: "#fafafa",
            border: "1px solid #ebebeb", borderRadius: 8,
          }}>
            <p style={{
              fontSize: 10, fontWeight: 900, letterSpacing: "0.1em",
              textTransform: "uppercase", color: "#999", margin: "0 0 4px",
            }}>
              {label}
            </p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 8 }}>
              <span style={{ fontSize: 28, fontWeight: 900, color: col, letterSpacing: "-0.03em" }}>
                {score}
              </span>
              <span style={{ fontSize: 10, fontWeight: 900, color: col, letterSpacing: "0.08em" }}>
                {strength.toUpperCase()}
              </span>
            </div>
            <div style={{ height: 3, background: "#f0f0f0", borderRadius: 2 }}>
              <div style={{ height: "100%", width: `${score}%`, background: RED, borderRadius: 2 }} />
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
          <YTLabel text="Angle" /><Body text={o.coreIdea?.angle} />
          <div style={{ height: 1, background: "#f0f0f0", margin: "10px 0" }} />
          <YTLabel text="Who It's For" /><Body text={o.coreIdea?.whoItsFor} />
          <div style={{ height: 1, background: "#f0f0f0", margin: "10px 0" }} />
          <YTLabel text="Main Message" /><Body text={o.coreIdea?.mainMessage} />
          <div style={{ height: 1, background: "#f0f0f0", margin: "10px 0" }} />
          <YTLabel text="Best Content Type" />
          <span style={{
            fontSize: 11, fontWeight: 900, color: RED, background: "#fff4f4",
            padding: "4px 10px", borderRadius: 4, letterSpacing: "0.06em", textTransform: "uppercase",
          }}>
            {o.coreIdea?.bestContentType}
          </span>
        </Block>

        <YTSectionHeader number={2} title="YouTube Titles" />
        <Block>
          {o.youtubeTitles?.map((t, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between", alignItems: "flex-start",
              padding: "8px 0",
              borderBottom: i < o.youtubeTitles.length - 1 ? "1px solid #f0f0f0" : "none",
            }}>
              <div style={{ display: "flex", gap: 10, flex: 1 }}>
                <span style={{ fontSize: 11, fontWeight: 900, color: RED, minWidth: 14 }}>{i + 1}</span>
                <p style={{ fontSize: 14, fontWeight: 700, color: BLACK, margin: 0, lineHeight: 1.5 }}>{t}</p>
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(t)}
                style={{
                  fontSize: 10, fontWeight: 800, color: "#bbb", background: "none",
                  border: "none", cursor: "pointer", padding: "2px 0 0 12px",
                  flexShrink: 0, letterSpacing: "0.06em", textTransform: "uppercase",
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
          <YTLabel text="Hook (First 10 Seconds)" /><Body text={o.videoStructure?.hook} />
          <div style={{ height: 1, background: "#f0f0f0", margin: "10px 0" }} />
          <YTLabel text="Intro" /><Body text={o.videoStructure?.intro} />
          <div style={{ height: 1, background: "#f0f0f0", margin: "10px 0" }} />
          <YTLabel text="Key Points" /><ListItems items={o.videoStructure?.keyPoints} />
          {o.videoStructure?.realLifeExamples?.length > 0 && (
            <>
              <div style={{ height: 1, background: "#f0f0f0", margin: "10px 0" }} />
              <YTLabel text="Real-Life Examples" /><ListItems items={o.videoStructure.realLifeExamples} />
            </>
          )}
          <div style={{ height: 1, background: "#f0f0f0", margin: "10px 0" }} />
          <YTLabel text="Closing Message" /><Body text={o.videoStructure?.closingMessage} />
        </Block>

        <YTSectionHeader number={5} title="Short-Form Clips" />
        {o.shortFormClips?.map((clip, i) => (
          <Block key={i}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{
                fontSize: 10, fontWeight: 900, color: "#fff", background: RED,
                width: 20, height: 20, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                {i + 1}
              </span>
              <p style={{ fontSize: 13, fontWeight: 800, color: BLACK, margin: 0 }}>{clip.idea}</p>
            </div>
            <YTLabel text="Hook" /><Body text={clip.hook} />
            <div style={{ height: 1, background: "#f0f0f0", margin: "8px 0" }} />
            <YTLabel text="Why It Works" />
            <p style={{ fontSize: 12, color: "#888", lineHeight: 1.6, margin: 0, fontStyle: "italic" }}>
              {clip.whyItWorks}
            </p>
          </Block>
        ))}

        <YTSectionHeader number={6} title="First 3 Seconds" />
        <Block>
          <div style={{
            padding: "10px 14px", background: "#fff4f4",
            border: `1.5px solid ${RED}`, borderRadius: 6, marginBottom: 10,
          }}>
            <YTLabel text="Opening Line" />
            <p style={{ fontSize: 15, fontWeight: 800, color: BLACK, margin: 0, lineHeight: 1.5 }}>
              {o.firstThreeSeconds?.openingLine}
            </p>
          </div>
          <YTLabel text="Visual Idea" /><Body text={o.firstThreeSeconds?.visualIdea} />
          <div style={{ height: 1, background: "#f0f0f0", margin: "8px 0" }} />
          <YTLabel text="On-Screen Text" />
          <span style={{
            display: "inline-block", fontSize: 13, fontWeight: 900, color: BLACK,
            background: "#f0f0f0", padding: "6px 12px", borderRadius: 5,
          }}>
            {o.firstThreeSeconds?.onScreenText}
          </span>
        </Block>

        <YTSectionHeader number={7} title="Hook System" />
        <Block>
          <YTLabel text="All Hooks" /><ListItems items={o.hookSystem?.hooks} />
          <div style={{ height: 1, background: "#f0f0f0", margin: "10px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <YTLabel text="Best Hook" />
            <span style={{ fontSize: 20, fontWeight: 900, color: RED }}>
              {o.hookSystem?.bestHookScore}
              <span style={{ fontSize: 11, fontWeight: 700, color: "#999" }}>/10</span>
            </span>
          </div>
          <div style={{
            padding: "10px 12px", background: "#fff4f4",
            border: "1px solid #f0d5d4", borderRadius: 6, marginBottom: 10,
          }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: BLACK, margin: 0 }}>
              {o.hookSystem?.bestHook}
            </p>
          </div>
          <YTLabel text="Weakest Hook — Improved" /><Body text={o.hookSystem?.weakestHookImproved} />
        </Block>

        <YTSectionHeader number={8} title="Thumbnail / Overlay Text" />
        <Block>
          {o.thumbnailOptions?.map((opt, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "9px 0",
              borderBottom: i < o.thumbnailOptions.length - 1 ? "1px solid #f0f0f0" : "none",
            }}>
              <div style={{ display: "flex", gap: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 900, color: RED, minWidth: 14 }}>{i + 1}</span>
                <p style={{ fontSize: 14, fontWeight: 900, color: BLACK, margin: 0 }}>{opt}</p>
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(opt)}
                style={{
                  fontSize: 10, fontWeight: 800, color: "#bbb", background: "none",
                  border: "none", cursor: "pointer", padding: 0,
                  letterSpacing: "0.06em", textTransform: "uppercase", flexShrink: 0, marginLeft: 10,
                }}
              >
                COPY
              </button>
            </div>
          ))}
        </Block>

        <YTSectionHeader number={9} title="Comment Bait" />
        <Block><ListItems items={o.commentBait} /></Block>

        <YTSectionHeader number={10} title="5-Part Content Series" />
        {o.contentSeries?.map((ep, i) => (
          <Block key={i}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{
                fontSize: 10, fontWeight: 900, color: "#fff", background: BLACK,
                width: 20, height: 20, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                {i + 1}
              </span>
              <p style={{
                fontSize: 12, fontWeight: 800, color: "#888", margin: 0,
                letterSpacing: "0.05em", textTransform: "uppercase",
              }}>
                Part {i + 1}
              </p>
            </div>
            <YTLabel text="Hook" />
            <p style={{ fontSize: 13, fontWeight: 700, color: BLACK, margin: "0 0 6px" }}>{ep.hook}</p>
            <YTLabel text="Angle" />
            <p style={{ fontSize: 13, color: "#555", lineHeight: 1.6, margin: "0 0 6px" }}>{ep.angle}</p>
            <YTLabel text="Idea" />
            <p style={{ fontSize: 13, fontStyle: "italic", color: "#888", margin: 0 }}>{ep.idea}</p>
          </Block>
        ))}

        <YTSectionHeader number={11} title="Instagram Caption" />
        <Block>
          <div style={{
            padding: "10px 14px", background: "#fff4f4",
            border: "1px solid #f0d5d4", borderRadius: 6, marginBottom: 10,
          }}>
            <YTLabel text="Hook" />
            <p style={{ fontSize: 14, fontWeight: 800, color: BLACK, margin: 0 }}>
              {o.instagramCaption?.hook}
            </p>
          </div>
          <YTLabel text="Body" /><Body text={o.instagramCaption?.body} />
          <div style={{ height: 1, background: "#f0f0f0", margin: "8px 0" }} />
          <YTLabel text="CTA" />
          <p style={{ fontSize: 13, fontWeight: 700, color: BLACK, margin: 0 }}>
            {o.instagramCaption?.cta}
          </p>
          <CopyLine text={`${o.instagramCaption?.hook}\n\n${o.instagramCaption?.body}\n\n${o.instagramCaption?.cta}`} />
        </Block>

        <YTSectionHeader number={12} title="TikTok Caption" />
        <Block>
          <Body text={o.tiktokCaption} />
          <CopyLine text={o.tiktokCaption} />
        </Block>

        <YTSectionHeader number={13} title="Content Improvement" />
        <Block>
          <YTLabel text="What's Weak" /><Body text={o.contentImprovement?.whatIsWeak} />
          <div style={{ height: 1, background: "#f0f0f0", margin: "10px 0" }} />
          <YTLabel text="What to Remove" /><Body text={o.contentImprovement?.whatToRemove} />
          <div style={{ height: 1, background: "#f0f0f0", margin: "10px 0" }} />
          <YTLabel text="Stronger Version" />
          <div style={{
            padding: "10px 14px", background: "#fff4f4",
            border: "1px solid #f0d5d4", borderRadius: 6,
          }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: BLACK, margin: 0, lineHeight: 1.65 }}>
              {o.contentImprovement?.strongerVersion}
            </p>
          </div>
        </Block>

        <YTSectionHeader number={14} title="Final Scores" />
        <DualScore viral={o.finalScores?.viralScore} conversion={o.finalScores?.conversionScore} />
        <Block>
          {o.finalScores?.breakdown && Object.entries(o.finalScores.breakdown).map(([key, val]) => (
            <div key={key} style={{ paddingBottom: 8, marginBottom: 8, borderBottom: "1px solid #f0f0f0" }}>
              <p style={{
                fontSize: 10, fontWeight: 900, letterSpacing: "0.1em",
                textTransform: "uppercase", color: "#999", margin: "0 0 3px",
              }}>
                {key.replace(/([A-Z])/g, " $1").toUpperCase()}
              </p>
              <p style={{ fontSize: 13, color: "#555", margin: 0, lineHeight: 1.6 }}>{val}</p>
            </div>
          ))}
        </Block>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 4 }}>
          <BigButton label="Regenerate" onClick={regenerate} />
          <BigButton label="New Topic" onClick={() => { setOutput(null); setInput(""); }} variant="ghost" />
        </div>
        <div style={{ height: 40 }} />
      </div>
    );
  };

  return (
    <div style={{ paddingBottom: 40 }}>
      <Header onBack={onBack} eyebrow="Lane 04" title="YouTube Expansion" />
      <div style={{ padding: "0 14px" }}>
        {!output && (
          <>
            <p style={{ fontSize: 13, color: "#999", lineHeight: 1.6, margin: "0 0 14px" }}>
              Drop a topic or idea. Get the full 14-section breakdown — titles, structure,
              clips, hooks, captions, series, and scores.
            </p>
            <TextInput value={input} onChange={setInput} placeholder="e.g. why dads lose muscle faster after 35" rows={4} />
            {error && <p style={{ fontSize: 13, color: RED, marginBottom: 10 }}>{error}</p>}
            {loading ? <Spinner msg={msg} /> : <BigButton label="Build Full Expansion →" onClick={run} />}
          </>
        )}
        {loading && !output && <Spinner msg={msg} />}
        {output && !loading && renderOutput()}
        {output && loading && <Spinner msg={msg} />}
      </div>
    </div>
  );
}

// ============================================================
// ROOT
// ============================================================
const STORAGE_KEY = "content-engine-saved";

export default function App() {
  const [screen, setScreen] = useState("home");
  const [lane, setLane] = useState(null);
  const [output, setOutput] = useState(null);
  const [outputLane, setOutputLane] = useState(null);
  const [outputFormat, setOutputFormat] = useState(null);
  const [saved, setSaved] = useState([]);

  // Load saved from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSaved(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  // Persist saved to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    } catch {
      // ignore
    }
  }, [saved]);

  const handleOutput = (result, l, f, showLast = false) => {
    if (showLast) { setScreen("output"); return; }
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
          day: "numeric", month: "short", year: "numeric",
        }),
      },
      ...prev,
    ]);
  };

  const handleDelete = (i) => {
    setSaved((prev) => prev.filter((_, idx) => idx !== i));
  };

  return (
    <div style={{ fontFamily: FONT, maxWidth: 430, margin: "0 auto", minHeight: "100vh", background: "#fff" }}>
      <style>{GLOBAL_STYLE}</style>

      {screen === "home" && (
        <HomeScreen
          onLane={(l) => { setLane(l); setScreen("generator"); }}
          onCopy={() => setScreen("copy")}
          onYT={() => setScreen("youtube")}
          onSaved={() => setScreen("saved")}
          savedCount={saved.length}
        />
      )}

      {screen === "generator" && (
        <GeneratorScreen
          lane={lane}
          onBack={() => setScreen("home")}
          onOutput={handleOutput}
          hasLastOutput={!!output}
        />
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

      {screen === "saved" && (
        <SavedScreen
          saved={saved}
          onBack={() => setScreen("home")}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
