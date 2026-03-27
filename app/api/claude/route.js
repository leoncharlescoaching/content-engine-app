import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { systemPrompt, userMessage } = body;

    if (!systemPrompt || !userMessage) {
      return NextResponse.json(
        { error: "Missing systemPrompt or userMessage" },
        { status: 400 }
      );
    }

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    });

    const text =
      response.content?.map((item) => item.text || "").join("") || "";

    return NextResponse.json({ text }, { status: 200 });
  } catch (error) {
    console.error("Claude API error:", error);
    return NextResponse.json(
      {
        error: "Claude request failed",
        details: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
