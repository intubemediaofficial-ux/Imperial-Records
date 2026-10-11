import { Clapperboard, Flame, Globe, Megaphone, Mic2, MonitorPlay, Music2, ShieldCheck, Users, type LucideIcon } from "lucide-react";

const ICONS: Record<string, LucideIcon> = { Globe, Mic2, Clapperboard, MonitorPlay, Users, Flame, ShieldCheck, Megaphone, Music2 };
export const SERVICE_ICONS = Object.keys(ICONS);

export default function ServiceIcon({ name, size = 26, className }: { name: string; size?: number; className?: string }) {
  const Icon = ICONS[name] ?? Music2;
  return <Icon size={size} className={className} />;
}
