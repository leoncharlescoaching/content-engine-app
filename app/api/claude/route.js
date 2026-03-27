import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req) {
  try {
    const { systemPrompt, userMessage } = await req.json();

    if (!systemPrompt || !userMessage) {
      return NextResponse.json(
        { error: "Missing inputs" },
        { status: 400 }
      );
    }

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: userMessage,
            },
          ],
        },
      ],
    });

    const text =
      response.content?.map((item) => item.text || "").join("") || "";

    return NextResponse.json({ text });

  } catch (error) {
    console.error("Claude API error:", error);
    return NextResponse.json(
      {
        error: "Claude request failed",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
