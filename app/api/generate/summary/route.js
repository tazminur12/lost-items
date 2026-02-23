import { generateText } from "@/lib/gemini";

export async function POST(req) {
  try {
    const body = await req.json();
    const { text } = body || {};

    if (!text || text.trim().length === 0) {
      return new Response(
        JSON.stringify({ message: "No text provided" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const result = await generateText(
      `Summarize the following text in 2-3 short sentences, suitable for a listing preview:\n\n${text}`
    );

    return new Response(
      JSON.stringify({ result }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Summary generation error:", err);
    return new Response(
      JSON.stringify({ message: "Failed to generate summary" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
