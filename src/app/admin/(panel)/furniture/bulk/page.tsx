"use client";

import { FormEvent, useState } from "react";
import { bulkUploadAction } from "@/lib/admin";

export default function BulkUploadPage() {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setUploading(true);
    setResult(null);
    setError(null);

    try {
      const formData = new FormData(event.currentTarget);
      const response = await bulkUploadAction(formData);
      setResult(response.count);
      event.currentTarget.reset();
    } catch {
      setError("The upload could not be completed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <div>
        <h1 className="font-display text-4xl text-linen">Bulk Upload</h1>
        <p className="mt-1 text-linenDim">Add multiple furniture images from filenames.</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 max-w-2xl space-y-6 rounded-sm border border-walnut/50 bg-bark p-6">
        <div>
          <label htmlFor="files" className="block text-xs uppercase tracking-wider text-brass">
            Furniture images
          </label>
          <input
            id="files"
            name="files"
            type="file"
            multiple
            accept="image/*"
            required
            className="mt-3 block w-full rounded-sm border border-walnut/60 bg-espresso px-4 py-3 text-sm text-linen file:mr-4 file:rounded-sm file:border-0 file:bg-brass file:px-4 file:py-2 file:text-sm file:font-medium file:text-espresso"
          />
          <p className="mt-2 text-xs text-linenDim">
            Category is detected from each filename: sofa, bed, chair, table, almari or wardrobe.
          </p>
        </div>

        <button type="submit" disabled={uploading} className="btn-brass disabled:opacity-60">
          {uploading ? "Uploading... Please Wait" : "Upload Furniture"}
        </button>

        {result !== null && (
          <p className="text-sm text-brass" role="status">
            Successfully uploaded {result} {result === 1 ? "item" : "items"}.
          </p>
        )}
        {error && (
          <p className="text-sm text-red-400" role="alert">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}
