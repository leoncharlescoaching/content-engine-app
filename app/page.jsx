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

  rewriteTool
