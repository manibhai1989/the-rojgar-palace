import { formatText } from "@/lib/utils";
import React from "react";

interface MarkdownTextProps {
    content: string;
}

export function MarkdownText({ content }: MarkdownTextProps) {
    if (!content) return null;

    // Decode HTML entities first using our robust helper
    const cleanContent = formatText(content);
    const lines = cleanContent.split('\n');

    const elements: React.ReactNode[] = [];
    let tableBuffer: string[] = [];
    let inTable = false;

    const renderTable = (rows: string[], keyPrefix: number) => {
        if (rows.length < 2) return null; // Need at least header + separator

        // Parse Header
        const headerRow = rows[0].trim();
        const headers = headerRow.split('|').filter(c => c.trim() !== '').map(c => c.trim());

        // Parse Body (Skip separator row 1)
        const bodyRows = rows.slice(2).map(r =>
            r.split('|').filter(c => c.trim() !== '').map(c => c.trim())
        );

        return (
            <div key={`table-${keyPrefix}`} className="overflow-x-auto my-4 border border-slate-300 dark:border-slate-700 rounded-md">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-100 dark:bg-slate-800 uppercase text-xs font-bold text-slate-700 dark:text-slate-300">
                        <tr>
                            {headers.map((h, i) => (
                                <th key={i} className="px-4 py-3 border-r border-slate-300 dark:border-slate-700 last:border-none">
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {bodyRows.map((row, rI) => (
                            <tr key={rI} className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                {row.map((cell, cI) => (
                                    <td key={cI} className="px-4 py-2 border-r border-slate-200 dark:border-slate-700 last:border-none">
                                        {cell}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    // Helper: Heuristic Table Builder for plain text
    const renderHeuristicTable = (text: string, keyPrefix: number) => {
        // Split by period followed by space, or newline
        const sentences = text.split(/(?:\. |\.\n|\n)/).filter(s => s.trim().length > 0);

        // Check if we have enough sentences to justify a table
        if (sentences.length < 2) return null;

        const rows: { key: string, value: string }[] = [];
        let matchCount = 0;

        for (const sentence of sentences) {
            let key = "";
            let value = "";

            // Try splitting by " - " (often used in these texts)
            if (sentence.includes(" - ")) {
                const parts = sentence.split(" - ");
                key = parts[0].trim();
                value = parts.slice(1).join(" - ").trim();
            }
            // Try splitting by ": "
            else if (sentence.includes(": ")) {
                const parts = sentence.split(": ");
                key = parts[0].trim();
                value = parts.slice(1).join(": ").trim();
            }

            if (key && value && key.length < 50) {
                rows.push({ key, value });
                matchCount++;
            } else {
                // If no clear split, just add as a full row
                rows.push({ key: "Note", value: sentence.trim() });
            }
        }

        // Only render as table if we found significant structured data (at least 50% matches)
        if (matchCount < sentences.length * 0.4) return null;

        return (
            <div key={`heuristic-table-${keyPrefix}`} className="overflow-x-auto my-4 border border-slate-300 dark:border-slate-700 rounded-md">
                <table className="w-full text-sm text-left">
                    <tbody className="bg-white dark:bg-slate-900/50">
                        {rows.map((row, i) => (
                            <tr key={i} className="border-b border-slate-200 dark:border-slate-700 last:border-none hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                <td className="px-4 py-3 font-semibold text-[#AC1E23] dark:text-red-400 border-r border-slate-200 dark:border-slate-700 w-1/3 align-top">
                                    {row.key.replace(/^For /, "")} {/* Clean up common prefix */}
                                </td>
                                <td className="px-4 py-3 text-slate-700 dark:text-slate-300 align-top">
                                    {row.value}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    lines.forEach((line, index) => {
        const trimmed = line.trim();

        // 1. Explicit Markdown Table Detection
        const isTableLine = trimmed.includes('|') && trimmed.length > 2;

        if (isTableLine) {
            if (!inTable) {
                inTable = true;
            }
            tableBuffer.push(trimmed);
        } else {
            // Flush MD Table buffer
            if (inTable) {
                elements.push(renderTable(tableBuffer, index));
                tableBuffer = [];
                inTable = false;
            }

            // 2. Normal Text Processing
            if (trimmed.length > 0) {
                // Try Heuristic Table first for long paragraphs
                const heuristicTable = trimmed.length > 100 ? renderHeuristicTable(trimmed, index) : null;

                if (heuristicTable) {
                    elements.push(heuristicTable);
                }
                // Fallback to List detection
                else if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
                    elements.push(
                        <li key={index} className="ml-4 list-disc pl-1 mb-1">{trimmed.substring(1).trim()}</li>
                    );
                }
                // Fallback to Key-Value single line
                else if (trimmed.match(/^[^:]+:/) && trimmed.length < 100) {
                    const parts = trimmed.split(':');
                    const key = parts[0].trim();
                    const val = parts.slice(1).join(':').trim();
                    elements.push(
                        <div key={index} className="flex flex-col sm:flex-row gap-2 mb-2 p-2 bg-slate-50 dark:bg-slate-900/40 rounded border border-slate-100 dark:border-slate-800">
                            <span className="font-bold text-[#AC1E23] dark:text-red-400 min-w-fit">{key}:</span>
                            <span className="text-slate-700 dark:text-slate-300">{val}</span>
                        </div>
                    );
                }
                // Fallback to Paragraph
                else {
                    elements.push(
                        <p key={index} className="mb-2 whitespace-pre-line">{trimmed}</p>
                    );
                }
            }
        }
    });

    // Flush remaining table buffer
    if (inTable && tableBuffer.length > 0) {
        elements.push(renderTable(tableBuffer, lines.length));
    }

    return <div className="text-sm font-medium leading-relaxed">{elements}</div>;
}
