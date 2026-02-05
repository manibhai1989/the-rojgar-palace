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
const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash-002" });

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
            console.log("PDF RAW TEXT SNAPSHOT:", rawText.substring(0, 500));
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
            You must extract job details from the input text below and return them in the following JSON format.
            
            STRICT JSON ONLY. NO MARKDOWN. NO EXPLANATIONS.
            If a value is not found, use "" for strings and [] for arrays.

            Required JSON Structure:
            {
                "postName": "Name of the post/job role",
                "shortInfo": "Brief summary of the recruitment",
                "applicationBegin": "YYYY-MM-DD",
                "lastDateApply": "YYYY-MM-DD",
                "lastDateFee": "YYYY-MM-DD",
                "examDate": "Date or 'Notify Soon'",
                "minAge": "Minimum Age (e.g. 18)",
                "maxAge": "Maximum Age (e.g. 30)",
                "totalVacancy": "Total count (e.g. 500)",
                "feesObj": [
                    { "category": "General/OBC", "amount": "500" },
                    { "category": "SC/ST", "amount": "0" }
                ],
                "vacancyObj": [
                    { "postName": "Sub-Post Name", "total": "10", "eligibility": "B.Tech" }
                ],
                "customDates": [
                    { "label": "Correction Date", "value": "10-12 May 2026" }
                ],
                "ageLimitDetails": {
                    "calculateDate": "01/01/2026",
                    "relaxation": "SC/ST: 5 Years, OBC: 3 Years",
                    "details": "Age between 18-30 years"
                },

            IMPORTANT - FIELD MAPPING RULES:
            - "applicationBegin": Map from "Application Start Date", "Opening Date", "Online Form Starts".
            - "lastDateApply": Map from "Closing Date", "Last Date", "Submission Deadline".
            - "lastDateFee": Map from "Payment Deadline", "Fee Last Date".
            - "examDate": Map from "Date of Exam", "Tentative Date". If unknown, use "Notify Soon".
            - "minAge": Map from "Minimum Age", "Age from".
            - "maxAge": Map from "Maximum Age", "Age up to".
                "selectionStages": [ "Written Exam", "Interview" ],
                "educationalQualification": "Markdown bullet points of requirements",
                "importantLinks": [
                    { "title": "Apply Online", "url": "https://..." },
                    { "title": "Notification", "url": "https://..." }
                ],
                "extraDetails": [
                   { "title": "Physical Eligibility", "content": "Markdown Table" }
                ]
            }

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
                    console.error("GROQ API ERROR:", errText);
                    throw new Error(`Groq Error ${groqResp.status}: ${errText}`);
                }

                const groqJson = await groqResp.json();
                responseText = groqJson.choices[0].message.content;
                console.log("Groq response received.");

            } catch (err: any) {
                console.error("Groq Failed, attempting Fallback to Gemini...", err);

                // FALLBACK TO GEMINI
                if (process.env.GOOGLE_API_KEY) {
                    try {
                        console.log("Fallback: Using Gemini Provider...");
                        const result = await geminiModel.generateContent(sysPrompt + "\n" + userPrompt);
                        responseText = result.response.text();
                        console.log("Fallback: Gemini success.");
                    } catch (geminiErr: any) {
                        console.error("Fallback Gemini Failed:", geminiErr);
                        throw new Error(`Both Groq and Gemini failed. Groq: ${err.message}. Gemini: ${geminiErr.message}`);
                    }
                } else {
                    throw err; // No fallback available
                }
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
        // --- GEMINI (Default with Robust Fallback) ---
        else {
            console.log("Using Gemini Provider with Fallback Strategy...");

            // List of models to try in order of preference (Newest/Fastest -> Stable -> Powerful)
            const modelsToTry = [
                "gemini-2.0-flash",       // Newest, fast, high limits
                "gemini-1.5-flash",       // Standard stable
                "gemini-1.5-flash-latest", // Latest alias
                "gemini-1.5-pro"          // Fallback powerhouse
            ];

            let lastError: any = null;
            let success = false;

            for (const modelName of modelsToTry) {
                if (success) break;
                try {
                    console.log(`Attempting Gemini Model: ${modelName}...`);
                    const currentModel = genAI.getGenerativeModel({ model: modelName });

                    const result = await currentModel.generateContent(sysPrompt + "\n" + userPrompt);
                    responseText = result.response.text();

                    if (responseText) {
                        console.log(`Success with ${modelName}`);
                        success = true;
                    }
                } catch (err: any) {
                    console.warn(`Failed with ${modelName}:`, err.message);
                    lastError = err;

                    // Specific check: If it's a quota issue (429), we MIGHT want to fail fast if we know all share quota?
                    // Actually, sometimes different models have different quotas/tiers. We continue trying.
                    if (err.message?.includes('429')) {
                        console.warn("Quota exceeded for this model, trying next...");
                    }
                }
            }

            if (!success) {
                console.error("All Gemini Models failed.");
                if (lastError?.message?.includes('429') || lastError?.message?.includes('quota')) {
                    return NextResponse.json(
                        {
                            error: "API Quota Exceeded",
                            message: "All AI models are currently busy or at limit.",
                            userMessage: "⏰ Daily AI limit reached. Please try using a local AI (Ollama) or wait for quota reset."
                        },
                        { status: 429 }
                    );
                }
                throw lastError || new Error("All AI models failed to respond.");
            }
        }

        console.log("Raw AI Response:", responseText.substring(0, 100) + "...");

        // 4. Parse JSON (Robust)
        let cleanJsonString = responseText.replace(/```json|```/g, "").trim();

        // Find first '{' and last '}' to handle conversational prefixes/suffixes
        const firstOpen = cleanJsonString.indexOf('{');
        const lastClose = cleanJsonString.lastIndexOf('}');
        if (firstOpen !== -1 && lastClose !== -1) {
            cleanJsonString = cleanJsonString.substring(firstOpen, lastClose + 1);
        }

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

        // 5. Debugging Logs (Added)
        console.log("Extracted Raw Dates (Pre-Norm):", {
            begin: extractedData.applicationBegin || "N/A",
            end: extractedData.lastDateApply || "N/A",
            fee: extractedData.lastDateFee || "N/A"
        });

        // Helper to normalize dates to YYYY-MM-DD for HTML input
        const normalizeDate = (dateStr: string): string => {
            if (!dateStr || typeof dateStr !== 'string' || dateStr.toLowerCase().includes("notify")) return dateStr;

            // Cleanup: remove "st", "nd", "rd", "th" from text like "21st Jan"
            let cleanStr = dateStr.replace(/(\d+)(st|nd|rd|th)/g, "$1").trim();

            // Try parsing "DD Month YYYY" or "DD/MM/YYYY" or "DD-MM-YYYY"
            try {
                const date = new Date(cleanStr);
                if (!isNaN(date.getTime())) {
                    // Fix: Use local time instead of UTC to avoid "off-by-one" day shifts
                    // (toISOString() converts to UTC, which shifts 00:00 local time to previous day for GMT+ timezones)
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    return `${year}-${month}-${day}`;
                }

                // Fallback for DD/MM/YYYY
                const parts = cleanStr.match(/(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})/);
                if (parts) {
                    return `${parts[3]}-${parts[2].padStart(2, '0')}-${parts[1].padStart(2, '0')}`;
                }
            } catch (e) {
                console.error("Date Parse Error:", e);
                return dateStr;
            }
            return dateStr;
        };

        if (extractedData.applicationBegin) extractedData.applicationBegin = normalizeDate(extractedData.applicationBegin);
        if (extractedData.lastDateApply) extractedData.lastDateApply = normalizeDate(extractedData.lastDateApply);
        if (extractedData.lastDateFee) extractedData.lastDateFee = normalizeDate(extractedData.lastDateFee);

        console.log("Final Normalized Dates:", {
            begin: extractedData.applicationBegin,
            end: extractedData.lastDateApply
        });

        console.log("JSON Parsed Successfully.");

        return NextResponse.json({ success: true, data: extractedData });

    } catch (error: any) {
        console.error("Critical API Error:", error);
        return NextResponse.json(
            {
                error: "Processing Failed",
                message: error.message || "Failed to process the document.",
                userMessage: `❌ Error: ${error.message || "Unknown internal error"}`,
                details: error.message
            },
            { status: 500 }
        );
    }
}
