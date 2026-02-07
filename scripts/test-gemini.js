const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config({ path: ".env.local" });

async function listModels() {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
        console.error("No API KEY found in .env.local");
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    try {
        console.log("Fetching available models...");
        // Note: listModels is on the genAI instance or model manager depending on SDK version.
        // For the current @google/generative-ai, we might not have a direct listModels helper exposed easily in all versions,
        // but let's try the standard way or just a simple generation test with a known safe model.

        // Actually, the error message itself suggests calling ListModels.
        // We'll try to use the model manager if available, or just test a basic one.

        // Alternative: simpler test - try the "gemini-1.5-flash" string which SHOULD work.
        // If it fails, maybe the key is wrong or the library version is old?

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Hello");
        console.log("Success with gemini-1.5-flash: ", result.response.text());

    } catch (e) {
        console.error("Error:", e.message);
        console.log("Full Error:", JSON.stringify(e, null, 2));
    }
}

listModels();
