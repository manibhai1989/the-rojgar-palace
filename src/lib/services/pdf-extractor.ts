import PDFParser from "pdf2json";
import { createWorker } from "tesseract.js";

export type ExtractedContent = {
    text: string;
    isScanned: boolean;
    confidence: number;
};

/**
 * Extracts text from a Node.js Buffer using pdf2json.
 * If text is insufficient, triggers OCR (Tesseract.js).
 */
export async function extractTextFromPDF(buffer: Buffer): Promise<ExtractedContent> {
    try {
        // 1. Try Native Text
        const text = await parseNativePDF(buffer);

        // Header heuristic: If text is extremely short, it's likely scanned.
        const isScanned = text.trim().length < 50;

        if (!isScanned) {
            return {
                text: text,
                isScanned: false,
                confidence: 1.0
            };
        }

        // 2. Fallback to OCR (Tesseract)
        console.log("Scanned PDF detected. Starting Local OCR (Tesseract)...");
        try {
            const ocrResult = await performOCR(buffer);
            return {
                text: ocrResult.text,
                isScanned: true,
                confidence: ocrResult.confidence / 100
            };
        } catch (ocrError: any) {
            console.error("OCR Failed:", ocrError);
            return {
                text: text, // Return what we have (even if empty)
                isScanned: true,
                confidence: 0
            };
        }

    } catch (e) {
        console.warn("PDF Parse Error:", e);
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

/**
 * Helper: OCR using Tesseract.js
 */
async function performOCR(buffer: Buffer): Promise<{ text: string; confidence: number }> {
    const worker = await createWorker('eng');
    const ret = await worker.recognize(buffer);
    await worker.terminate();
    return {
        text: ret.data.text,
        confidence: ret.data.confidence
    };
}
