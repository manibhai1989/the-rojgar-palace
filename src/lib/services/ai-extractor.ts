import { GoogleGenerativeAI } from "@google/generative-ai";

export type AIProvider = "gemini" | "ollama" | "groq";

interface AIConfig {
    provider: AIProvider;
    apiKey?: string;
    baseUrl?: string; // For Ollama
    model?: string;
}

export type ExtractedData = {
    data: any; // The JSON schema
    fieldConfidence: Record<string, number>; // Field-level confidence scores
    warnings: string[];
};

export class AIExtractor {
    private config: AIConfig;

    constructor(config: AIConfig) {
        this.config = config;
    }

    async extract(text: string): Promise<ExtractedData> {
        const prompt = this.buildPrompt(text);
        return this.runExtraction(prompt);
    }

    /**
     * Multimodal Extraction (Buffer -> AI)
     * Bypasses local OCR by sending the file directly to Gemini.
     */
    async extractFromBuffer(buffer: Buffer, mimeType: string): Promise<ExtractedData> {
        if (this.config.provider !== "gemini") {
            throw new Error("Multimodal extraction (Direct PDF) is only supported by Gemini.");
        }

        const prompt = this.buildPrompt("<<IDENTIFY_FROM_ATTACHMENT>>"); // Special marker or just empty
        return this.runExtraction(prompt, buffer, mimeType);
    }

    private async runExtraction(prompt: string, buffer?: Buffer, mimeType?: string): Promise<ExtractedData> {
        try {
            let jsonString = "";

            if (this.config.provider === "gemini") {
                jsonString = await this.callGemini(prompt, buffer, mimeType);
            } else if (this.config.provider === "groq") {
                jsonString = await this.callGroq(prompt);
            } else if (this.config.provider === "ollama") {
                jsonString = await this.callOllama(prompt);
            }

            return this.parseAndValidate(jsonString);

        } catch (error: any) {
            console.error("AI Extraction Failed:", error);
            throw new Error(`AI Extraction Failed: ${error.message}`);
        }
    }

    private buildPrompt(text: string): string {
        return `
        You are an expert Data Extraction AI. Extract structured data from the Job Notification text below.
        
        STRICT RULES:
        1. Return Output EXCLUSIVELY in JSON format.
        2. Assign a "confidence_score" (0.0 to 1.0) for each major field based on how explicitly it was stated in the text.
        3. If a value is missing, use null or empty string.

        REQUIRED JSON SCHEMA:
        {
            "data": {
                "postName": "string",
                "shortInfo": "string",
                "applicationBegin": "YYYY-MM-DD",
                "lastDateApply": "YYYY-MM-DD",
                "lastDateFee": "YYYY-MM-DD",
                "examDate": "string",
                "minAge": "string",
                "maxAge": "string",
                "totalVacancy": "string",
                "feesObj": [{ "category": "string", "amount": "string" }],
                "vacancyObj": [{ "postName": "string", "category": "string", "count": "string" }],
                "educationalQualification": "string (markdown allowed)",
                "selectionStages": ["string"],
                "importantLinks": [{ "title": "string", "url": "string" }]
            },
            "warnings": ["string (list of potential issues or missing critical fields)"],
            "fieldConfidence": {
                "postName": 0.95,
                "dates": 0.8,
                "vacancy": 1.0
            }
        }

        INPUT TEXT:
        ${text.slice(0, 30000)} 
        `;
    }

    // --- PROVIDER IMPLEMENTATIONS ---

    private async callGemini(prompt: string, buffer?: Buffer, mimeType?: string): Promise<string> {
        const genAI = new GoogleGenerativeAI(this.config.apiKey || "");

        // List of models to try in order
        const candidates = [
            this.config.model,            // Try configured model first
            "gemini-1.5-flash",           // Standard Flash
            "gemini-1.5-flash-latest",    // Flash Latest
            "gemini-1.5-pro",             // Fallback to Pro
            "gemini-pro-vision",          // Legacy Multimodal
            "gemini-pro"                  // Legacy Text
        ].filter(Boolean) as string[];

        // Remove duplicates
        const models = [...new Set(candidates)];

        console.log("Gemini: Attempting models:", models);

        let lastError: any = null;

        for (const modelName of models) {
            try {
                console.log(`Gemini: Trying model '${modelName}'...`);
                const model = genAI.getGenerativeModel({ model: modelName });

                let result;
                if (buffer && mimeType) {
                    // Multimodal Request
                    result = await model.generateContent([
                        prompt.replace("<<IDENTIFY_FROM_ATTACHMENT>>", "Extract data from the attached document."),
                        {
                            inlineData: {
                                data: buffer.toString("base64"),
                                mimeType: mimeType
                            }
                        }
                    ]);
                } else {
                    // Text Request
                    result = await model.generateContent(prompt);
                }

                // Safely retrieve text
                const responseText = result.response.text();
                if (responseText) {
                    console.log(`Gemini: Success with '${modelName}'!`);
                    return responseText;
                }
            } catch (error: any) {
                // If it's a safety block or other API issue, text() might fail.
                console.warn(`Gemini: Failed with '${modelName}': ${error.message}`);

                // Inspect if it was a safety stop
                if (error.message?.includes("candidate") || error.message?.includes("safety")) {
                    console.warn("Gemini Safety Block suspected.");
                }

                lastError = error;
                // Continue to next model
            }
        }

        throw new Error(`All Gemini models failed. Last error: ${lastError?.message || lastError}`);
    }

    private async callGroq(prompt: string): Promise<string> {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.config.apiKey}`
            },
            body: JSON.stringify({
                model: this.config.model || "llama-3.3-70b-versatile",
                messages: [{ role: "user", content: prompt }],
                temperature: 0,
                response_format: { type: "json_object" }
            })
        });

        const json = await response.json();

        if (json.error) {
            throw new Error(`Groq API Error: ${json.error.message}`);
        }

        if (!json.choices || !json.choices[0] || !json.choices[0].message) {
            throw new Error("Groq API returned unexpected format (missing choices)");
        }

        return json.choices[0].message.content;
    }

    private async callOllama(prompt: string): Promise<string> {
        const response = await fetch(`${this.config.baseUrl || "http://127.0.0.1:11434"}/api/generate`, {
            method: "POST",
            body: JSON.stringify({
                model: this.config.model || "llama3",
                prompt: prompt,
                stream: false,
                format: "json",
                options: { temperature: 0 }
            })
        });
        const json = await response.json();
        return json.response;
    }

    // --- PARSERS ---

    private parseAndValidate(rawString: string): ExtractedData {
        const clean = rawString.replace(/```json|```/g, "").trim();
        const first = clean.indexOf("{");
        const last = clean.lastIndexOf("}");
        const jsonStr = clean.substring(first, last + 1);

        try {
            const parsed = JSON.parse(jsonStr);

            // Normalize dates in the parsed data (Quick pass)
            if (parsed.data) {
                // simple date normalization logic could go here if needed
            }

            return {
                data: parsed.data || {},
                fieldConfidence: parsed.fieldConfidence || {},
                warnings: parsed.warnings || []
            };
        } catch (e) {
            console.error("JSON Parse Error:", e);
            throw new Error("Failed to parse AI response as JSON");
        }
    }
}
