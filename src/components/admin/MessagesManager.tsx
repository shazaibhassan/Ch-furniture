"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Mail, MailOpen, Trash2, Phone } from "lucide-react";
import { markMessageRead, deleteMessage } from "@/app/actions/admin";

type Message = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  message: string;
  read: boolean;
  createdAt: Date;
};

export function MessagesManager({ messages }: { messages: Message[] }) {
  return (
    <div>
      <h1 className="font-display text-4xl text-linen">Messages</h1>
      <p className="mt-1 text-linenDim">{messages.filter((m) => !m.read).length} unread · {messages.length} total</p>

      <div className="mt-8 space-y-3">
        {messages.length === 0 ? (
          <div className="rounded-sm border border-walnut/50 bg-bark p-12 text-center text-linenDim">No messages yet.</div>
        ) : messages.map((m) => <Row key={m.id} m={m} />)}
      </div>
    </div>
  );
}

function Row({ m }: { m: Message }) {
  const [read, setRead] = useState(m.read);
  return (
    <div className={`rounded-sm border bg-bark p-5 ${read ? "border-walnut/40" : "border-brass/40"}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="font-medium text-linen">{m.name}</p>
            {!read && <span className="rounded-full bg-brass/15 px-2 py-0.5 text-[10px] uppercase tracking-wider text-brass">New</span>}
          </div>
          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-linenDim">
            {m.email && <a href={`mailto:${m.email}`} className="flex items-center gap-1 hover:text-brass"><Mail className="h-3 w-3" /> {m.email}</a>}
            {m.phone && <a href={`tel:${m.phone}`} className="flex items-center gap-1 hover:text-brass"><Phone className="h-3 w-3" /> {m.phone}</a>}
            <span>{new Date(m.createdAt).toLocaleDateString()}</span>
          </div>
          <p className="mt-3 whitespace-pre-line text-sm text-linenDim">{m.message}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            title={read ? "Mark unread" : "Mark read"}
            onClick={async () => { const next = !read; setRead(next); await markMessageRead(m.id, next); }}
            className="rounded-sm border border-walnut/60 p-2 text-linenDim hover:text-linen"
          >
            {read ? <MailOpen className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
          </button>
          <button
            title="Delete"
            onClick={async () => { try { await deleteMessage(m.id); toast.success("Deleted"); } catch { toast.error("Delete failed"); } }}
            className="rounded-sm border border-walnut/60 p-2 text-linenDim hover:text-red-400"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
