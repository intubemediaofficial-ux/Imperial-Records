"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";

const field = "w-full rounded-xl border border-gold/20 bg-ink/60 px-4 py-3 text-sm text-cream placeholder:text-muted/70 focus:border-gold focus:outline-none";

export default function ContactForm({ subjects }: { subjects: string[] }) {
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [error, setError] = useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("busy");
    setError("");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch("/api/enquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j.error || "Something went wrong");
      setState("done");
    } catch (err) {
      setError((err as Error).message);
      setState("error");
    }
  }
  if (state === "done") {
    return (
      <div className="card-royal flex flex-col items-center rounded-3xl p-10 text-center">
        <CheckCircle2 className="text-gold" size={56} />
        <h3 className="mt-4 font-display text-2xl font-bold text-cream">Thank you! 🙏</h3>
        <p className="mt-2 text-muted">Your enquiry has been received. Our team will contact you within 24 hours.</p>
        <button onClick={() => setState("idle")} className="mt-6 rounded-full border border-gold/30 px-5 py-2 text-sm text-gold hover:bg-gold/10">Send another</button>
      </div>
    );
  }
  return (
    <form onSubmit={submit} className="card-royal grid gap-4 rounded-3xl p-6 sm:grid-cols-2 sm:p-8">
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <input name="name" required placeholder="Your name *" className={field} />
      <input name="phone" required placeholder="Phone / WhatsApp *" inputMode="tel" className={field} />
      <input name="email" type="email" placeholder="Email" className={field} />
      <input name="city" placeholder="City" className={field} />
      <select name="subject" className={`${field} sm:col-span-2`} defaultValue={subjects[0]}>
        {subjects.map((s) => <option key={s} className="bg-deep">{s}</option>)}
      </select>
      <input name="link" placeholder="Song / YouTube / Drive link (optional)" className={`${field} sm:col-span-2`} />
      <textarea name="message" rows={5} placeholder="Tell us about your song, event or requirement…" className={`${field} sm:col-span-2`} />
      {error && <p className="text-sm text-red-400 sm:col-span-2">{error}</p>}
      <button disabled={state === "busy"} className="inline-flex items-center justify-center gap-2 rounded-full bg-gold-gradient px-8 py-3.5 font-semibold text-ink shadow-lg shadow-gold/20 disabled:opacity-60 sm:col-span-2 sm:justify-self-start">
        {state === "busy" ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />} Send Enquiry
      </button>
    </form>
  );
}
