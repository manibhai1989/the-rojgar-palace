import PDFParser from "pdf2json";
import { createWorker } from "tesseract.js";

export type ExtractedContent = {
    text: string;
    isScanned: boolean;
    confidence: number; // 0-1 (1 = native text, <1 = OCR confidence)
};

/**
 * Extracts text from a Node.js Buffer.
 * Automatically tries native extraction first.
 * If text length is too low (indicating scanned PDF), falls back to OCR.
 */
export async function extractTextFromPDF(buffer: Buffer): Promise<ExtractedContent> {
    // 1. Try Native Text Extraction
    let rawText = "";
    try {
        rawText = await parseNativePDF(buffer);
    } catch (e) {
        console.warn("Native parsing failed, trying OCR...", e);
    }

    // 2. Check if Scanned (Heuristic: < 100 chars of text for a whole file usually means image)
    const isScanned = rawText.trim().length < 100;

    if (!isScanned) {
        return {
            text: rawText,
            isScanned: false,
            confidence: 1.0
        };
    }

    // 3. Fallback to OCR (Tesseract.js)
    console.log("Scanned PDF detected. Starting OCR...");
    try {
        const ocrResult = await performOCR(buffer);
        return {
            text: ocrResult.text,
            isScanned: true,
            confidence: ocrResult.confidence / 100 // Tesseract returns 0-100
        };
    } catch (ocrError: any) {
        console.error("OCR Failed:", ocrError);
        // Fallback: return what we had (even if empty) to avoid crashing
        return {
            text: rawText,
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
            reject(new Error(errData.parserError));
        });

        parser.on("pdfParser_dataReady", () => {
            // URI decode required because pdf-parse-json sometimes returns encoded entities
            const text = decodeURIComponent(parser.getRawTextContent());
            resolve(text);
        });

        parser.parseBuffer(buffer);
    });
}

/**
 * Helper: OCR using Tesseract.js
 * Optimized for English text in typical government notifications.
 */
async function performOCR(buffer: Buffer): Promise<{ text: string; confidence: number }> {
    const worker = await createWorker('eng');

    // Tesseract.js recognizes images/buffers
    const ret = await worker.recognize(buffer);

    await worker.terminate();

    return {
        text: ret.data.text,
        confidence: ret.data.confidence
    };
}
