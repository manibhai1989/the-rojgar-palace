import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
// Top-level imports
// Removed pdf-parse from here to avoid "DOMMatrix is not defined" build error.
// Force Node.js runtime for proper file handling
// Vercel Build Fix: Using require for pdf-parse to avoid ESM/Turbopack issues
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

// @ts-ignore
import PDFParser from "pdf2json";

// Helper to parse PDF using pdf2json (Native Node.js, no DOM dependencies)
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
    return new Promise((resolve, reject) => {
        const parser = new PDFParser(null, true); // true = text only

        parser.on("pdfParser_dataError", (errData: any) => {
            reject(new Error(errData.parserError));
        });

        parser.on("pdfParser_dataReady", () => {
            // getRawTextContent() returns the text content from the parsed PDF
            const text = parser.getRawTextContent();
            resolve(text);
        });

        parser.parseBuffer(buffer);
    });
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
                    // CRITICAL: Send the actual error to the user so we know WHAT failed
                    userMessage: `❌ Internal Parser Error: ${pdfError.message}`
                },
                { status: 400 }
            );
        }

        // Truncate text logic (Varies by provider context window)
        // Gemini 1.5 Flash: 1M tokens (Huge)
        // Llama 3.3 (Groq): 128k context window, but we want response speed.
        // We'll curb it to 25k chars (~6k tokens) to be safe and fast.
        const charLimit = AI_PROVIDER === "gemini" ? 500000 : 25000;
        const truncatedText = rawText.slice(0, charLimit);

        // 2. Construct Prompt (Shared)
        const sysPrompt = `You are an expert Data Extraction AI. Extract structured data from Job Notification PDFs.`;
        const userPrompt = `
            Extract the following fields into a clean JSON format.
            Rules:
            1. Return ONLY valid JSON. No Markdown block.
            2. If a value is missing, use empty string "" or empty array [].
            3. "vacancyObj" MUST be an array of specific breakdowns: { postName: string, gen: number, sc: number, st: number, obc: number, ews: number, total: number }. 
               - If categories are not explicitly cited for a post, put the total in "total" and 0 in others.
               - Consolidate "UR"/"Unreserved" to "gen".
            4. "feesObj": { category: string, amount: string }[] (e.g. [{ category: "SC/ST", amount: "0" }, { category: "Gen", amount: "100" }]).
            5. "customDates": { label: string, value: string }[] (e.g. { label: "Exam Date", value: "2024-10-10" }).
            6. "educationalQualification": Summarize the core requirements clearly.
            7. "selectionStages": ["Stage 1", "Stage 2"] simple strings.
            8. "importantLinks": Extract URLs. Standardize titles: "Apply Online", "Download Notification", "Official Website".
            9. "extraDetails": THIS IS CRITICAL. Capture ANY and ALL tables found in the document (like Physical Standards, Zone-wise vacancies, Exam Patterns, State-wise breakdown) as Markdown Tables inside 'content'. Do not skip any table.
            10. "educationalQualification": Be detailed. proper bullet points.
            11. "ageLimitDetails": { calculateDate: string, relaxation: string, details: string }. Extract the specific cut-off date.

             Fields to extract:
            - postName
            - shortInfo
            - applicationBegin
            - lastDateApply
            - lastDateFee
            - examDate
            - minAge
            - maxAge
            - totalVacancy
            - feesObj
            - vacancyObj
            - customDates
            - ageLimitDetails
            - selectionStages
            - educationalQualification
            - importantLinks
            - extraDetails

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
