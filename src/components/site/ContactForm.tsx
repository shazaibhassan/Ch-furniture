"use client";
import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { toast } from "sonner";
import { submitContact, type ContactState } from "@/app/actions/contact";

const initial: ContactState = { ok: false };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-brass disabled:opacity-60">
      {pending ? "Sending…" : "Send Message"}
    </button>
  );
}

export function ContactForm() {
  const [state, action] = useFormState(submitContact, initial);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) {
      toast.success("Thanks — we'll be in touch shortly.");
      formRef.current?.reset();
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  const field =
    "w-full rounded-sm border border-walnut/60 bg-espresso px-4 py-3 text-linen placeholder:text-linenDim/60 focus:border-brass";

  return (
    <form ref={formRef} action={action} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <input name="name" required placeholder="Your name" className={field} aria-label="Your name" />
        <input name="phone" placeholder="Phone (optional)" className={field} aria-label="Phone" />
      </div>
      <input name="email" type="email" placeholder="Email (optional)" className={field} aria-label="Email" />
      <textarea name="message" required rows={5} placeholder="Tell us about the piece you're looking for…" className={field} aria-label="Message" />
      <SubmitButton />
    </form>
  );
}
