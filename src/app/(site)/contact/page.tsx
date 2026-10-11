import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import PageHero from "@/components/site/PageHero";
import ContactForm from "@/components/site/ContactForm";
import { WhatsappIcon } from "@/components/icons";
import { pageMetadata } from "@/lib/seo";
import { getContent } from "@/lib/store";

export const dynamic = "force-dynamic";
export function generateMetadata(): Promise<Metadata> {
  return pageMetadata("contact", "/contact");
}

export default async function ContactPage() {
  const c = await getContent();
  const s = c.settings;
  const items = [
    { Icon: Phone, label: "Call us", value: s.phone, href: `tel:${s.phone.replace(/\s/g, "")}` },
    { Icon: WhatsappIcon, label: "WhatsApp", value: s.phone, href: `https://wa.me/${s.whatsapp.replace(/\D/g, "")}` },
    { Icon: Mail, label: "Email", value: s.email, href: `mailto:${s.email}` },
    { Icon: MapPin, label: "Office", value: s.address },
    { Icon: Clock, label: "Hours", value: s.hours },
  ];
  return (
    <>
      <PageHero eyebrow="संपर्क करें" title={c.texts.contactTitle} sub={c.texts.contactSub} />
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[380px_1fr]">
        <div className="space-y-4">
          {items.map(({ Icon, label, value, href }) => {
            const body = (
              <>
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold/10 text-gold"><Icon size={22} /></span>
                <span className="min-w-0">
                  <span className="block text-xs uppercase tracking-wider text-muted">{label}</span>
                  <span className="block break-all font-medium text-cream">{value}</span>
                </span>
              </>
            );
            return href ? (
              <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="card-royal flex items-center gap-4 rounded-2xl p-4 transition hover:-translate-y-0.5">{body}</a>
            ) : (
              <div key={label} className="card-royal flex items-center gap-4 rounded-2xl p-4">{body}</div>
            );
          })}
        </div>
        <ContactForm subjects={c.texts.contactSubjects} />
      </section>
      {s.mapQuery && (
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
          <iframe title="Map" className="h-80 w-full rounded-3xl border border-gold/20 grayscale-[40%]" loading="lazy" src={`https://www.google.com/maps?q=${encodeURIComponent(s.mapQuery)}&output=embed`} />
        </section>
      )}
    </>
  );
}
