import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(request: Request) {
  try {
    const { prompt, systemInstruction } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not set in the environment.' }, { status: 500 });
    }

    // Explicitly pass the API key to avoid the 'project' undefined TypeError in some environments
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            systemInstruction: systemInstruction || `You are an elite Digital Marketing Assistant. 
            RULES: 
            1. Never hallucinate facts or statistics.
            2. Always adopt the exact brand voice requested.
            3. Do not output generic or vague "AI-like" language.
            4. Format output strictly in Markdown.`,
            temperature: 0.3 // Lower temperature for more focused, less hallucinated output
        }
    });

    return NextResponse.json({ result: response.text });
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate content" }, { status: 500 });
  }
}
