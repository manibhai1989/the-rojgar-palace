import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Columns } from "lucide-react";

interface DynamicTableProps {
    data: any[];
    onChange: (newData: any[]) => void;
    title: string;
    description?: string;
}

export function DynamicTable({ data, onChange, title, description }: DynamicTableProps) {
    const [headers, setHeaders] = useState<string[]>([]);

    // Initialize headers from data keys on mount or data change
    useEffect(() => {
        if (data && data.length > 0) {
            // Get all unique keys from all objects to ensure no data is hidden
            const allKeys = Array.from(new Set(data.flatMap(Object.keys)));
            if (allKeys.length > 0 && headers.length === 0) {
                setHeaders(allKeys);
            }
        } else if (headers.length === 0) {
            // Default headers if empty
            setHeaders(["Column 1", "Column 2"]);
        }
    }, [data]);

    const handleCellChange = (rowIndex: number, header: string, value: string) => {
        // DETECT JSON ARRAY: Replace entire table data
        if (value.trim().startsWith("[") && value.trim().endsWith("]")) {
            try {
                const parsed = JSON.parse(value);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    // Check if it looks like an object array
                    if (typeof parsed[0] === 'object') {
                        onChange(parsed);
                        // toast.success("Table data replaced from JSON"); // toast not imported here, relying on UI update
                        return;
                    }
                }
            } catch (e) {
                // ignore
            }
        }

        const newData = [...data];
        if (!newData[rowIndex]) newData[rowIndex] = {};
        newData[rowIndex][header] = value;
        onChange(newData);
    };

    const addRow = () => {
        const newRow: any = {};
        headers.forEach(h => newRow[h] = "");
        onChange([...(data || []), newRow]);
    };

    const removeRow = (index: number) => {
        const newData = [...data];
        newData.splice(index, 1);
        onChange(newData);
    };

    const addColumn = () => {
        const newHeader = `Col ${headers.length + 1}`;
        setHeaders([...headers, newHeader]);
        // Update all rows to include this new key
        const newData = (data || []).map(row => ({ ...row, [newHeader]: "" }));
        onChange(newData);
    };

    const removeColumn = (headerToRemove: string) => {
        const newHeaders = headers.filter(h => h !== headerToRemove);
        setHeaders(newHeaders);
        // Remove key from data
        const newData = (data || []).map(row => {
            const newRow = { ...row };
            delete newRow[headerToRemove];
            return newRow;
        });
        onChange(newData);
    };

    const renameColumn = (oldHeader: string, newHeader: string) => {
        // ALLOW empty string so user can clear the input
        const index = headers.indexOf(oldHeader);
        if (index === -1) return;

        const newHeaders = [...headers];
        newHeaders[index] = newHeader;
        setHeaders(newHeaders);

        const newData = (data || []).map(row => {
            const newRow: any = {};
            // Preserve order
            newHeaders.forEach(h => {
                if (h === newHeader) newRow[h] = row[oldHeader] || "";
                else newRow[h] = row[h] || "";
            });
            return newRow;
        });
        onChange(newData);
    };

    return (
        <div className="p-6 bg-slate-900/40 rounded-xl border border-white/5">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h3 className="font-semibold text-slate-200 text-lg">{title}</h3>
                    {description && <p className="text-xs text-slate-400">{description}</p>}
                </div>
                <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={addColumn} className="border-slate-600 text-slate-300 hover:bg-slate-800">
                        <Columns className="w-4 h-4 mr-2" /> Add Column
                    </Button>
                    <Button size="sm" variant="outline" onClick={addRow} className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10">
                        <Plus className="w-4 h-4 mr-2" /> Add Row
                    </Button>
                </div>
            </div>

            <div className="overflow-x-auto bg-black/20 rounded-lg border border-white/5">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-white/5 text-slate-400">
                        <tr>
                            {headers.map((header, i) => (
                                <th key={i} className="p-2 min-w-[150px] relative group border-r border-white/5 last:border-0">
                                    <div className="flex items-center justify-between">
                                        <Input
                                            value={header}
                                            onChange={(e) => renameColumn(header, e.target.value)}
                                            className="h-6 bg-transparent border-transparent focus:border-white/20 text-xs font-bold uppercase tracking-wider px-1"
                                        />
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => removeColumn(header)}
                                            className="h-5 w-5 opacity-0 group-hover:opacity-100 text-red-400 hover:bg-red-900/20"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </th>
                            ))}
                            <th className="w-10 p-2"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {(data || []).map((row, rowIndex) => (
                            <tr key={rowIndex} className="hover:bg-white/5 transition-colors">
                                {headers.map((header, colIndex) => (
                                    <td key={colIndex} className="p-2 border-r border-white/5 last:border-0">
                                        <Input
                                            value={row[header] || ""}
                                            onChange={(e) => handleCellChange(rowIndex, header, e.target.value)}
                                            className="h-8 bg-transparent border-transparent focus:bg-black/40 text-slate-300"
                                        />
                                    </td>
                                ))}
                                <td className="p-2 text-center">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => removeRow(rowIndex)}
                                        className="h-6 w-6 text-slate-600 hover:text-red-400"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {(!data || data.length === 0) && (
                    <div className="p-8 text-center text-slate-500 italic">
                        No data. Click "Add Row" to start.
                    </div>
                )}
            </div>
        </div>
    );
}
