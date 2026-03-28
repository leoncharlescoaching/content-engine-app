import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
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

    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      temperature: 0.8,
    });

    const text = response.choices?.[0]?.message?.content || "";

    return NextResponse.json({ text });
  } catch (error) {
    console.error("FULL ERROR:", error);

    return NextResponse.json(
      {
        error: error?.message || "OpenAI request failed",
        full: JSON.stringify(error, null, 2),
      },
      { status: 500 }
    );
  }
}
