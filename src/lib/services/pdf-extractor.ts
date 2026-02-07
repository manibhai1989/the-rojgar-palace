import PDFParser from "pdf2json";
// Removed Tesseract import to save bundle size and prevent timeouts.
// We rely on Gemini Multimodal for OCR now.

export type ExtractedContent = {
    text: string;
    isScanned: boolean;
    confidence: number;
};

/**
 * Extracts text from a Node.js Buffer using pdf2json.
 */
export async function extractTextFromPDF(buffer: Buffer): Promise<ExtractedContent> {
    try {
        const text = await parseNativePDF(buffer);

        // Header heuristic: If text is extremely short, it's likely scanned.
        const isScanned = text.trim().length < 50;

        return {
            text: text,
            isScanned: isScanned,
            confidence: 1.0
        };

    } catch (e) {
        console.warn("PDF Parse Error:", e);
        // If it fails completely, mark as scanned so Pipeline tries Multimodal.
        return {
            text: "",
            isScanned: true,
            confidence: 0
        };
    }
}

/**
 * Helper: Native PDF Extraction using pdf2json
 */
async function parseNativePDF(buffer: Buffer): Promise<string> {
    return new Promise((resolve, reject) => {
        const parser = new PDFParser(null, true); // true = text only

        parser.on("pdfParser_dataError", (errData: any) => {
            // pdf2json might emit error, but sometimes it just means "can't read text"
            reject(new Error(errData.parserError));
        });

        parser.on("pdfParser_dataReady", () => {
            // URI decode required because pdf-parse-json sometimes returns encoded entities
            try {
                const text = decodeURIComponent(parser.getRawTextContent());
                resolve(text);
            } catch (e) {
                resolve(parser.getRawTextContent());
            }
        });

        parser.parseBuffer(buffer);
    });
}
