"use client";

import { ChangeEvent, DragEvent, useRef, useState } from "react";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type PreviewRow = {
  name: string;
  category: string;
  price: string;
  stock: string;
  imageUrl: string;
  errors: string[];
};

const columns = ["name", "category", "price", "stock", "imageUrl"] as const;
const acceptedExtensions = [".csv", ".xlsx", ".json"];

function normalizeKey(key: string) {
  return key.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
}

function normalizeRows(rows: Record<string, unknown>[]): PreviewRow[] {
  return rows.map((row) => {
    const values = Object.entries(row).reduce<Record<string, unknown>>((result, [key, value]) => {
      result[normalizeKey(key)] = value;
      return result;
    }, {});
    const name = String(values.name ?? "").trim();
    const category = String(values.category ?? "").trim();
    const price = String(values.price ?? "").trim();
    const stock = String(values.stock ?? "").trim();
    const imageUrl = String(values.imageurl ?? "").trim();

    return {
      name,
      category,
      price,
      stock,
      imageUrl,
      errors: [
        ...(!name ? ["Missing name"] : []),
        ...(!price ? ["Missing price"] : []),
      ],
    };
  });
}

async function parseFile(file: File) {
  const extension = `.${file.name.split(".").pop()?.toLowerCase() ?? ""}`;
  if (!acceptedExtensions.includes(extension)) {
    throw new Error("Please choose a .csv, .xlsx, or .json file.");
  }

  if (extension === ".json") {
    const parsed: unknown = JSON.parse(await file.text());
    if (!Array.isArray(parsed)) throw new Error("JSON must contain an array of furniture rows.");
    return normalizeRows(parsed.filter((row): row is Record<string, unknown> => Boolean(row && typeof row === "object")));
  }

  const workbook = XLSX.read(await file.arrayBuffer(), { type: "array" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  if (!sheet) throw new Error("The selected file does not contain a worksheet.");
  return normalizeRows(XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" }));
}

export default function BulkUploadPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [rows, setRows] = useState<PreviewRow[]>([]);
  const [fileName, setFileName] = useState("");
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function loadFile(file?: File) {
    if (!file) return;
    try {
      setRows(await parseFile(file));
      setFileName(file.name);
      toast.success(`${file.name} is ready for review.`);
    } catch (error) {
      setRows([]);
      setFileName("");
      toast.error(error instanceof Error ? error.message : "Could not parse the selected file.");
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    void loadFile(event.target.files?.[0]);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    void loadFile(event.dataTransfer.files[0]);
  }

  function downloadSample() {
    const csv = "name,category,price,stock,imageUrl\nWalnut Dining Table,Dining,125000,4,https://example.com/table.jpg\n";
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "furniture-bulk-sample.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  async function uploadRows() {
    const invalidRows = rows.filter((row) => row.errors.length > 0);
    if (!rows.length) {
      toast.error("Choose a file before uploading.");
      return;
    }
    if (invalidRows.length) {
      toast.error("Fix the row errors before uploading.");
      return;
    }

    setUploading(true);
    try {
      console.log("Mock POST /api/furniture/bulk", rows);
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success(`${rows.length} furniture ${rows.length === 1 ? "item" : "items"} uploaded successfully.`);
    } catch {
      toast.error("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  const errorCount = rows.filter((row) => row.errors.length > 0).length;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Catalog tools</p>
          <h1 className="mt-3 font-display text-4xl text-linen">Bulk Upload Furniture</h1>
          <p className="mt-1 text-linenDim">Import a spreadsheet or JSON file, review every row, then upload.</p>
        </div>
        <Button type="button" variant="outline" onClick={downloadSample}>Download Sample CSV</Button>
      </div>

      <Card>
        <CardHeader>
          <h2 className="font-display text-2xl text-linen">Choose a file</h2>
          <p className="mt-1 text-sm text-linenDim">Accepted formats: CSV, XLSX, and JSON.</p>
        </CardHeader>
        <CardContent>
          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={`cursor-pointer rounded-sm border-2 border-dashed p-10 text-center transition-colors ${dragging ? "border-brass bg-brass/10" : "border-walnut/60 bg-espresso hover:border-brass/60"}`}
          >
            <p className="font-medium text-linen">Drop your file here or click to browse</p>
            <p className="mt-2 text-sm text-linenDim">Use the column names: name, category, price, stock, imageUrl.</p>
            {fileName && <p className="mt-4 text-sm text-brass">Selected: {fileName}</p>}
            <Input ref={inputRef} type="file" accept=".csv,.xlsx,.json" onChange={handleFileChange} className="sr-only" />
          </div>
        </CardContent>
      </Card>

      {rows.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl text-linen">Preview</h2>
              <p className="mt-1 text-sm text-linenDim">{rows.length} rows loaded{errorCount ? ` · ${errorCount} with errors` : ""}</p>
            </div>
            <Button type="button" onClick={uploadRows} disabled={uploading || errorCount > 0}>
              {uploading ? "Uploading..." : "Upload to Database"}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-sm border border-walnut/50">
              <Table>
                <TableHeader>
                  <TableRow>{columns.map((column) => <TableHead key={column}>{column}</TableHead>)}<TableHead>Validation</TableHead></TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((row, index) => (
                    <TableRow key={`${row.name}-${index}`}>
                      <TableCell className="font-medium text-linen">{row.name || "-"}</TableCell>
                      <TableCell>{row.category || "-"}</TableCell>
                      <TableCell>{row.price || "-"}</TableCell>
                      <TableCell>{row.stock || "-"}</TableCell>
                      <TableCell className="max-w-64 truncate">{row.imageUrl || "-"}</TableCell>
                      <TableCell className={row.errors.length ? "text-red-400" : "text-emerald-400"}>
                        {row.errors.length ? row.errors.join(", ") : "Ready"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
