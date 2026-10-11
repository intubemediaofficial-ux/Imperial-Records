import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Mandala from "./Mandala";

export default function CtaBand({ title, text, button }: { title: string; text: string; button: string }) {
  return (
    <section className="px-4 pb-20 sm:px-6">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-gold/30 bg-gradient-to-br from-panel via-deep to-ink p-10 text-center sm:p-16">
        <Mandala className="animate-spin-slow absolute -right-20 -top-20 h-80 w-80 text-gold/15" />
        <Mandala className="animate-spin-slow absolute -bottom-24 -left-24 h-80 w-80 text-saffron/10" />
        <p className="font-hindi relative text-2xl text-saffron">ॐ</p>
        <h2 className="relative mt-2 font-display text-3xl font-bold text-gold-gradient sm:text-4xl">{title}</h2>
        <p className="relative mx-auto mt-4 max-w-2xl text-muted">{text}</p>
        <Link href="/contact" className="relative mt-8 inline-flex items-center gap-2 rounded-full bg-gold-gradient px-8 py-4 font-semibold text-ink shadow-xl shadow-gold/20">{button} <ArrowRight size={18} /></Link>
      </div>
    </section>
  );
}
