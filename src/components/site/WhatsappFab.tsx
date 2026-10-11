import { WhatsappIcon } from "@/components/icons";

export default function WhatsappFab({ number, company }: { number: string; company: string }) {
  if (!number) return null;
  const text = encodeURIComponent(`Namaste ${company}, I want to know more about song release / services.`);
  return (
    <a href={`https://wa.me/${number.replace(/\D/g, "")}?text=${text}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-xl shadow-black/40 transition hover:scale-110">
      <WhatsappIcon size={28} />
    </a>
  );
}
