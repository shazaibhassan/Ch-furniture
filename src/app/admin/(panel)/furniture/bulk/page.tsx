"use client"
import { useState } from "react"

export default function BulkPage() {
  const [fileName, setFileName] = useState("")

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Bulk Upload Furniture</h1>
      <p className="mt-1 text-gray-500">Upload multiple products via CSV</p>
      <div className="mt-8 rounded-xl border-2 border-dashed p-10 text-center">
        <input
          type="file"
          accept=".csv"
          onChange={(event) => setFileName(event.target.files?.[0]?.name || "")}
        />
        {fileName && <p className="mt-4 text-sm text-green-600">Selected: {fileName}</p>}
      </div>
      <button
        onClick={() => alert("Upload logic")}
        className="mt-6 rounded-lg bg-black px-6 py-2.5 text-white"
      >
        Upload to Database
      </button>
    </div>
  )
}
