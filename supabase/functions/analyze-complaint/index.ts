import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface AnalysisResult {
  category: string;
  urgency: string;
  priority_score: number;
  reasoning: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { complaint_text, user_email } = await req.json();

    if (!complaint_text) {
      return new Response(
        JSON.stringify({ error: "Complaint text is required" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    
    if (!openaiApiKey) {
      return new Response(
        JSON.stringify({ error: "OpenAI API key not configured" }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are an AI complaint analyzer. Analyze the complaint and return a JSON response with:
- category: one of [Technical, Billing, Service, Product, Shipping, Account, Other]
- urgency: one of [Low, Medium, High, Critical]
- priority_score: number from 1-10 (10 being highest priority)
- reasoning: brief explanation (max 100 chars)

Consider factors like:
- Emotional tone (angry = higher urgency)
- Impact (financial loss, security issues = higher priority)
- Time sensitivity (deadlines, blocked work = higher urgency)
- Customer value (repeat issues, major problems = higher priority)

Respond ONLY with valid JSON, no other text.`
          },
          {
            role: "user",
            content: complaint_text
          }
        ],
        temperature: 0.3,
        max_tokens: 200
      }),
    });

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.statusText}`);
    }

    const openaiData = await openaiResponse.json();
    const analysisText = openaiData.choices[0].message.content;
    const analysis: AnalysisResult = JSON.parse(analysisText);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: complaint, error: dbError } = await supabase
      .from("complaints")
      .insert({
        complaint_text,
        user_email: user_email || null,
        category: analysis.category,
        urgency: analysis.urgency,
        priority_score: analysis.priority_score,
        status: "New"
      })
      .select()
      .single();

    if (dbError) {
      throw new Error(`Database error: ${dbError.message}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        complaint,
        analysis: {
          ...analysis
        }
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});