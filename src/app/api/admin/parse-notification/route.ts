import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
// @ts-ignore
import pdf from "pdf-parse";

// Force Node.js runtime for proper file handling
export const runtime = 'nodejs';

// --- CONFIGURATION ---
// Supported Providers: 'gemini', 'ollama', 'groq'
const AI_PROVIDER = process.env.NEXT_PUBLIC_AI_PROVIDER || "gemini";

// OLLAMA Config
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3";

// GROQ Config
// VALIDATED MODEL: llama-3.3-70b-versatile
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

// Initialize Gemini (Only if needed)
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Helper to parse PDF using pdf-parse (More reliable for Vercel Serverless)
// Switched to pdf-parse to resolve Vercel buffer issues
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
    try {
        const data = await pdf(buffer);
        return data.text;
    } catch (error: any) {
        console.error("pdf-parse Error:", error);
        throw new Error("Failed to parse PDF content: " + error.message);
    }
}

export async function POST(req: NextRequest) {
    console.log(`API /api/admin/parse-notification HIT. Provider: ${AI_PROVIDER}`);

    // Basic Validation per provider
    if (AI_PROVIDER === "gemini" && !process.env.GOOGLE_API_KEY) {
        return NextResponse.json(
            { error: "API Key Missing. Set GOOGLE_API_KEY for Gemini." },
            { status: 500 }
        );
    }
    if (AI_PROVIDER === "groq" && !process.env.GROQ_API_KEY) {
        return NextResponse.json(
            { error: "API Key Missing. Set GROQ_API_KEY for Groq." },
            { status: 500 }
        );
    }

    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        // 1. Extract Text from PDF
        let rawText = "";
        try {
            console.log("Starting PDF Parse (pdf2json)...");
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            rawText = await extractTextFromPDF(buffer);

            if (!rawText || rawText.trim().length === 0) {
                // Return a structured error that the frontend can display clearly
                console.warn("PDF Text Extraction result was empty. Likely a scanned text.");
                return NextResponse.json(
                    {
                        error: "Scanned PDF Detected",
                        message: "This PDF appears to be a scanned image. Please upload a version with selectable text.",
                        userMessage: "⚠️ This PDF has no selectable text (Scanned Image). Please use a text-based PDF or convert it using an OCR tool."
                    },
                    { status: 400 }
                );
            }
            console.log("PDF Parsed successfully. Length:", rawText.length);
        } catch (pdfError: any) {
            console.error("PDF Parsing Failed:", pdfError);
            return NextResponse.json(
                {
                    error: "PDF Parsing Failed",
                    message: "Could not read text from this PDF. It may be corrupt or encrypted.",
                    details: pdfError.message
                },
                { status: 400 }
            );
        }

        // Truncate text logic (Varies by provider context window)
        // Gemini 1.5 Flash: 1M tokens (Huge)
        // Llama 3.3 (Groq): 128k context window, but we want response speed.
        // We'll curb it to 25k chars (~6k tokens) to be safe and fast.
        const charLimit = AI_PROVIDER === "gemini" ? 50000 : 25000;
        const truncatedText = rawText.slice(0, charLimit);

        // 2. Construct Prompt (Shared)
        const sysPrompt = `You are a Data Extractor Pro. Extract fields from Job Notification into JSON.`;
        const userPrompt = `
            Extract the following fields into a clean JSON format compatible with my frontend structure.
            Rules:
            - Return ONLY valid JSON. No Markdown block (\`\`\`json).
            - If a value is missing, use empty string "" or empty array [].
            - Dates should be in DD/MM/YYYY format.
            - "feesObj" should be an array of objects: { category: string, amount: string }.
            - "vacancyObj" should be an array of objects representing the breakdown.
                - STRATEGY: PDF text often scrambles tables. Data might appear as a list of Headers first, then a list of Values.
                - LOOK FOR PATTERNS:
                    - "UR 200 SC 50 ST 20" (Horizontal)
                    - "UR\nSC\nST\n\n200\n50\n20" (Vertical grouping)
                - KEYWORDS to map: "UR"/"Unreserved" -> UR, "SC"/"Scheduled Caste" -> SC, "ST" -> ST, "OBC" -> OBC, "EWS" -> EWS.
                - EXTRACTION RULES:
                    1. Identify the 'Category' keywords in the vacancy section.
                    2. Look for the nearest numbers associated with them.
                    3. If you see a sequence of numbers matching the sequence of categories, map them.
                    4. Output specifically: [{ "postName": "...", "category": "UR", "count": ... }, ...].
                - FALLBACK: Only use "Total" if you are completely unable to map specific categories.
            - "customDates" should capture specific events like "Re-Open", "Phase 2", "Admit Card", etc. Format: { label: string, value: string }.
            - "ageLimitDetails" should capture the reference date (as on...) and relaxation rules. Format: { calculateDate: string, relaxation: string }.
            - "selectionStages" is an array of strings (e.g. ["Pre Exam", "Mains", "Interview"]).
            - "importantLinks" should capture URLs. Format: { title: string, url: string }.
                - STANDARDIZE TITLES (Critical):
                    - If text says "Official Application Portal", "Registration Link", or "Apply Here" -> set title to "Apply Online".
                    - If text says "Detailed Notification", "Advertisement", or "PDF" -> set title to "Download Notification".
                    - If text says "Official Website", "Home Page", or "Main Site" -> set title to "Official Website".
                - Extract numeric links if found.
            - "extraDetails" should capture any other SIGNIFICANT tables or lists not covered above (e.g. "Physical Standards", "Exam Centers", "Pay Scale").
                - Format: [{ title: string, content: string }].
                - IMPORTANT: If the data represents a table (like Physical Efficiency Test or Exam Pattern), "content" field MUST be formatted as a valid MARKDOWN TABLE (using | pipes).
                - Example: "| Category | Height | Chest |\n| --- | --- | --- |\n| Gen | 170cm | 80cm |"
                - If not a table, use clear bullet points.
            
            Fields to extract:
            - postName (e.g. "RRB Group D")
            - shortInfo (A nice brief summary of 2-3 lines)
            - applicationBegin (Date)
            - lastDateApply (Date)
            - lastDateFee (Date)
            - examDate (Date or text like "Notify Soon")
            - minAge (Number or String)
            - maxAge (Number or String)
            - totalVacancy (Number or String)
            - feesObj (Array)
            - vacancyObj (Array)
            - customDates (Array)
            - ageLimitDetails (Object)
            - selectionStages (Array)
            - educationalQualification (Detailed text summary of eligibility)
            - importantLinks (Array)
            - extraDetails (Array)

            Input Text:
            ${truncatedText}
        `;

        // 3. Call AI Provider
        let responseText = "";

        // --- GROQ (Cloud Open Source) ---
        if (AI_PROVIDER === "groq") {
            console.log("Using Groq Provider...");
            try {
                const groqResp = await fetch(GROQ_API_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
                    },
                    body: JSON.stringify({
                        model: GROQ_MODEL,
                        messages: [
                            { role: "system", content: sysPrompt },
                            { role: "user", content: userPrompt }
                        ],
                        temperature: 0.1,
                        response_format: { type: "json_object" } // Force JSON
                    })
                });

                if (!groqResp.ok) {
                    const errText = await groqResp.text();
                    console.error("GROQ API ERROR TEXT:", errText); // Log actual error
                    throw new Error(`Groq API Error: ${groqResp.status} - ${errText}`);
                }

                const groqJson = await groqResp.json();
                responseText = groqJson.choices[0].message.content;
                console.log("Groq response received.");

            } catch (err: any) {
                console.error("Groq Failed:", err);
                return NextResponse.json({
                    error: "Groq Processing Failed",
                    message: "Failed to process with Groq API.",
                    details: err.message
                }, { status: 500 });
            }
        }
        // --- OLLAMA (Local) ---
        else if (AI_PROVIDER === "ollama") {
            console.log("Using Ollama Provider...");
            try {
                const ollamaResponse = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        model: OLLAMA_MODEL,
                        prompt: userPrompt, // Ollama generic endpoint uses simple prompt usually
                        system: sysPrompt,
                        stream: false,
                        format: "json"
                    })
                });

                if (!ollamaResponse.ok) {
                    throw new Error(`Ollama Error: ${ollamaResponse.statusText}. Is Ollama running?`);
                }

                const ollamaJson = await ollamaResponse.json();
                responseText = ollamaJson.response;
                console.log("Ollama response received.");
            } catch (err: any) {
                console.error("Ollama Connection Failed:", err);
                return NextResponse.json({
                    error: "Ollama Connection Failed",
                    message: "Could not connect to local AI. Make sure Ollama is installed and running.",
                    userMessage: "⚠️ Ensure 'ollama run llama3' is active in your terminal."
                }, { status: 503 });
            }
        }
        // --- GEMINI (Default) ---
        else {
            console.log("Using Gemini Provider...");
            try {
                const result = await geminiModel.generateContent(sysPrompt + "\n" + userPrompt);
                responseText = result.response.text();
            } catch (aiError: any) {
                console.error("Gemini Error:", aiError);
                if (aiError.message?.includes('429') || aiError.message?.includes('quota')) {
                    return NextResponse.json(
                        {
                            error: "API Quota Exceeded",
                            message: "Gemini Free Tier limit reached.",
                            userMessage: "⏰ Daily limit reached. Switch to Groq or Ollama."
                        },
                        { status: 429 }
                    );
                }
                throw aiError;
            }
        }

        console.log("Raw AI Response:", responseText.substring(0, 100) + "...");

        // 4. Parse JSON
        const cleanJsonString = responseText.replace(/```json|```/g, "").trim();
        let extractedData = JSON.parse(cleanJsonString);

        // Helper to recursively decode strings
        const decodeEntities = (input: any): any => {
            if (typeof input === 'string') {
                return input
                    .replace(/&#x2F;/g, "/")
                    .replace(/&#47;/g, "/")
                    .replace(/&amp;/g, "&")
                    .replace(/&lt;/g, "<")
                    .replace(/&gt;/g, ">")
                    .replace(/&quot;/g, '"')
                    .replace(/&#39;/g, "'");
            }
            if (Array.isArray(input)) {
                return input.map(decodeEntities);
            }
            if (input !== null && typeof input === 'object') {
                const newData: any = {};
                for (const key in input) {
                    newData[key] = decodeEntities(input[key]);
                }
                return newData;
            }
            return input;
        };

        extractedData = decodeEntities(extractedData);
        console.log("JSON Parsed Successfully.");

        return NextResponse.json({ success: true, data: extractedData });

    } catch (error: any) {
        console.error("Critical API Error:", error);
        return NextResponse.json(
            {
                error: "Processing Failed",
                message: error.message || "Failed to process the document.",
                userMessage: "❌ Something went wrong. Check console for details.",
                details: error.message
            },
            { status: 500 }
        );
    }
}
