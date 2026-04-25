import { getStratResponseStream, handleMasteryDetection } from "../../../services/aiService";

export async function POST(req: Request) {
  try {
    const { messages, userId } = await req.json();

    if (!messages || !userId) {
      return new Response(JSON.stringify({ 
        error: "Validation Error", 
        details: "Missing required fields (messages or userId)" 
      }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const stream = await getStratResponseStream(messages, userId);

    let fullResponse = "";
    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const text = chunk.text();
          fullResponse += text;
          controller.enqueue(new TextEncoder().encode(text));
        }

        // Post-stream processing: Mastery Detection
        try {
          await handleMasteryDetection(fullResponse, userId);
        } catch (err) {
          console.error("Mastery processing error:", err);
        }

        controller.close();
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error: any) {
    console.error("Chat API error details:", error);
    return new Response(JSON.stringify({ 
      error: "Internal Server Error", 
      details: error.message 
    }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
