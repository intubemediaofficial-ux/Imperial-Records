"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowDown, ArrowUp, Briefcase, Building2, Check, Download, ExternalLink, FolderTree, Home, Image as ImageIcon, Inbox,
  KeyRound, Loader2, LogOut, Mail, Menu, Music2, Phone, Plus, Save, Share2, Trash2, Type, Upload, Users, X,
} from "lucide-react";
import Link from "next/link";
import { releaseImage, type Release, type SeoPage, type SiteContent, type SiteTexts } from "@/lib/siteContent";

type Enquiry = {
  id: string; name: string; phone: string; email: string; city: string; subject: string; link: string; message: string;
  status: "new" | "contacted" | "in-progress" | "closed"; note: string; createdAt: string;
};

type FieldType = "text" | "textarea" | "checkbox" | "image" | "list";
type Field = { key: string; label: string; type?: FieldType; placeholder?: string; options?: string[]; fields?: Field[]; blank?: object; addLabel?: string };

const input = "w-full rounded-lg border border-[#164640] bg-[#031413] px-3 py-2.5 text-sm text-white placeholder:text-gray-600 focus:border-[#d9b45a] focus:outline-none";
const card = "rounded-2xl border border-[#164640] bg-[#0a2e2a] p-5";
const btnGold = "inline-flex items-center justify-center gap-2 rounded-lg bg-gold-gradient px-4 py-2.5 text-sm font-bold text-black transition hover:brightness-110 disabled:opacity-50";
const btnGhost = "inline-flex items-center justify-center gap-2 rounded-lg border border-[#164640] px-3 py-2 text-sm text-gray-300 transition hover:border-[#d9b45a] hover:text-[#d9b45a] disabled:opacity-40";

async function uploadFiles(files: FileList | File[]): Promise<string[]> {
  const form = new FormData();
  Array.from(files).forEach((f) => form.append("files", f));
  const res = await fetch("/api/admin/upload", { method: "POST", body: form });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Upload failed");
  return data.urls;
}

function ImageInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [busy, setBusy] = useState(false);
  return (
    <div className="flex items-center gap-3">
      {value ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="h-16 w-16 shrink-0 rounded-lg border border-[#164640] object-cover" />
      ) : (
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-dashed border-[#164640] text-gray-600"><ImageIcon size={20} /></div>
      )}
      <div className="flex-1 space-y-2">
        <input className={input} value={value} placeholder="/images/... or https://..." onChange={(e) => onChange(e.target.value)} />
        <label className={`${btnGhost} cursor-pointer`}>
          {busy ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />} Upload image
          <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
            if (!e.target.files?.length) return;
            setBusy(true);
            try { onChange((await uploadFiles(e.target.files))[0]); } catch (err) { alert((err as Error).message); }
            setBusy(false);
            e.target.value = "";
          }} />
        </label>
      </div>
    </div>
  );
}

function FieldInput({ field, value, onChange }: { field: Field; value: unknown; onChange: (v: unknown) => void }) {
  if (field.type === "checkbox") {
    return (
      <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-300">
        <input type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-[#d9b45a]" />
        {field.label}
      </label>
    );
  }
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">{field.label}</span>
      {field.type === "textarea" ? (
        <textarea className={`${input} min-h-24`} value={String(value ?? "")} placeholder={field.placeholder} onChange={(e) => onChange(e.target.value)} />
      ) : field.type === "image" ? (
        <ImageInput value={String(value ?? "")} onChange={onChange} />
      ) : field.type === "list" ? (
        <div className="rounded-xl border border-dashed border-[#164640] p-3">
          <ListEditor items={(value as object[]) ?? []} fields={field.fields ?? []} blank={field.blank ?? {}} addLabel={field.addLabel} onChange={onChange}
            title={(it) => Object.values(it).filter((v) => typeof v === "string" && v).slice(0, 2).join(" · ")} />
        </div>
      ) : field.options ? (
        <select className={input} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)}>
          {field.options.map((o) => <option key={o}>{o}</option>)}
        </select>
      ) : (
        <input className={input} value={String(value ?? "")} placeholder={field.placeholder} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  );
}

function ObjectEditor<T extends object>({ value, fields, onChange }: { value: T; fields: Field[]; onChange: (v: T) => void }) {
  const rec = value as Record<string, unknown>;
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {fields.map((f) => (
        <div key={f.key} className={f.type === "textarea" || f.type === "image" || f.type === "list" ? "md:col-span-2" : ""}>
          <FieldInput field={f} value={rec[f.key]} onChange={(v) => onChange({ ...value, [f.key]: v })} />
        </div>
      ))}
    </div>
  );
}

function ListEditor<T extends object>({ items, fields, blank, onChange, title, addLabel = "Add new" }: {
  items: T[]; fields: Field[]; blank: T; onChange: (v: T[]) => void; title: (item: T, i: number) => string; addLabel?: string;
}) {
  const move = (i: number, d: number) => {
    const next = [...items];
    const j = i + d;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className={card}>
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="truncate font-bold text-white"><span className="mr-2 text-[#d9b45a]">#{i + 1}</span>{title(item, i) || "Untitled"}</p>
            <div className="flex shrink-0 gap-2">
              <button className={btnGhost} disabled={i === 0} onClick={() => move(i, -1)} aria-label="Move up"><ArrowUp size={14} /></button>
              <button className={btnGhost} disabled={i === items.length - 1} onClick={() => move(i, 1)} aria-label="Move down"><ArrowDown size={14} /></button>
              <button className={`${btnGhost} hover:!border-red-500 hover:!text-red-400`} onClick={() => confirm("Remove this item?") && onChange(items.filter((_, k) => k !== i))} aria-label="Remove"><Trash2 size={14} /></button>
            </div>
          </div>
          <ObjectEditor value={item} fields={fields} onChange={(v) => onChange(items.map((it, k) => (k === i ? v : it)))} />
        </div>
      ))}
      <button className={btnGhost} onClick={() => onChange([...items, { ...blank }])}><Plus size={16} /> {addLabel}</button>
    </div>
  );
}

function StringList({ items, onChange, placeholder }: { items: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  return (
    <div className="space-y-3">
      {items.map((s, i) => (
        <div key={i} className="flex gap-2">
          <textarea className={`${input} min-h-20`} value={s} placeholder={placeholder} onChange={(e) => onChange(items.map((x, k) => (k === i ? e.target.value : x)))} />
          <button className={btnGhost} onClick={() => onChange(items.filter((_, k) => k !== i))} aria-label="Remove"><Trash2 size={14} /></button>
        </div>
      ))}
      <button className={btnGhost} onClick={() => onChange([...items, ""])}><Plus size={16} /> Add</button>
    </div>
  );
}

function Section({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-black text-white">{title}</h2>
      {desc && <p className="mt-1 text-sm text-gray-500">{desc}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Login({ onDone }: { onDone: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#0d3b35,#031413_60%)] p-4">
      <form
        className="w-full max-w-sm rounded-[2rem] border border-[#d9b45a]/30 bg-[#0a2e2a]/90 p-8 shadow-2xl shadow-[#d9b45a]/10"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setError("");
          const res = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
          setBusy(false);
          if (res.ok) onDone();
          else setError((await res.json().catch(() => ({}))).error || "Login failed");
        }}
      >
        <div className="mb-8 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo-imperial.jpg" alt="" className="mx-auto mb-4 h-20 w-20 rounded-full border border-[#d9b45a]/40 object-cover" />
          <h1 className="text-2xl font-black text-white">Imperial Records <span className="text-gold-gradient">Admin</span></h1>
          <p className="mt-1 text-sm text-gray-500">Sign in to manage the website</p>
        </div>
        <div className="space-y-4">
          <input className={input} type="email" placeholder="Admin email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="username" />
          <input className={input} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button className={`${btnGold} w-full py-3`} disabled={busy}>{busy && <Loader2 size={16} className="animate-spin" />} Sign In</button>
        </div>
        <Link href="/" className="mt-6 block text-center text-xs text-gray-500 hover:text-[#d9b45a]">← Back to website</Link>
      </form>
    </main>
  );
}

const STATUS_STYLE: Record<Enquiry["status"], string> = {
  new: "bg-blue-500/15 text-blue-300",
  contacted: "bg-yellow-500/15 text-yellow-300",
  "in-progress": "bg-purple-500/15 text-purple-300",
  closed: "bg-gray-500/15 text-gray-400",
};

function Enquiries({ items, setItems }: { items: Enquiry[]; setItems: (v: Enquiry[]) => void }) {
  const [statusFilter, setStatusFilter] = useState<"all" | Enquiry["status"]>("all");
  const [q, setQ] = useState("");
  const shown = items.filter((e) => (statusFilter === "all" || e.status === statusFilter) && (!q || `${e.name} ${e.phone} ${e.email} ${e.subject} ${e.city}`.toLowerCase().includes(q.toLowerCase())));
  const update = async (id: string, patch: Partial<Enquiry>) => {
    const res = await fetch("/api/admin/enquiries", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, ...patch }) });
    if (res.ok) {
      const updated = await res.json();
      setItems(items.map((e) => (e.id === id ? updated : e)));
    }
  };
  const remove = async (id: string) => {
    if (!confirm("Delete this enquiry permanently?")) return;
    const res = await fetch(`/api/admin/enquiries?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    if (res.ok) setItems(items.filter((e) => e.id !== id));
  };
  const exportCsv = () => {
    const cols: (keyof Enquiry)[] = ["createdAt", "status", "name", "phone", "email", "city", "subject", "link", "message", "note"];
    const csv = [cols.join(","), ...shown.map((e) => cols.map((c) => `"${String(e[c] ?? "").replace(/"/g, '""')}"`).join(","))].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `imperial-records-enquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };
  return (
    <Section title="Enquiries" desc="Song release, artist management, studio, bhajan sandhya and contact requests from the website.">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <input className={`${input} !w-60`} placeholder="Search name / phone / subject" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className={`${input} !w-auto`} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}>
          <option value="all">All status</option>
          {Object.keys(STATUS_STYLE).map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <button className={`${btnGhost} ml-auto`} onClick={exportCsv} disabled={!shown.length}><Download size={14} /> Export CSV</button>
      </div>
      {!shown.length && <div className={`${card} py-12 text-center text-gray-500`}><Inbox className="mx-auto mb-3" />No enquiries yet</div>}
      <div className="space-y-4">
        {shown.map((e) => (
          <div key={e.id} className={card}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#d9b45a]/15 px-2.5 py-0.5 text-xs font-bold text-[#d9b45a]">{e.subject || "General"}</span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold capitalize ${STATUS_STYLE[e.status]}`}>{e.status}</span>
                  <span className="text-xs text-gray-500">{new Date(e.createdAt).toLocaleString("en-IN")}</span>
                </div>
                <p className="mt-2 text-lg font-bold text-white">{e.name}</p>
                <p className="text-sm text-gray-400">{[e.city, e.email].filter(Boolean).join(" • ")}</p>
                {e.link && <a href={e.link} target="_blank" rel="noopener noreferrer" className="mt-1 block break-all text-sm text-[#d9b45a] hover:underline">{e.link}</a>}
                {e.message && <p className="mt-2 whitespace-pre-wrap text-sm text-gray-300">{e.message}</p>}
              </div>
              <div className="flex flex-wrap gap-2">
                <a className={btnGhost} href={`tel:${e.phone}`}><Phone size={14} /> {e.phone}</a>
                <a className={btnGhost} href={`https://wa.me/${e.phone.replace(/\D/g, "").replace(/^(\d{10})$/, "91$1")}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
                {e.email && <a className={btnGhost} href={`mailto:${e.email}`}><Mail size={14} /></a>}
                <button className={`${btnGhost} hover:!border-red-500 hover:!text-red-400`} onClick={() => remove(e.id)} aria-label="Delete"><Trash2 size={14} /></button>
              </div>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-[180px_1fr]">
              <select className={input} value={e.status} onChange={(ev) => update(e.id, { status: ev.target.value as Enquiry["status"] })}>
                {Object.keys(STATUS_STYLE).map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <input className={input} placeholder="Private note (press Enter to save)" defaultValue={e.note} onKeyDown={(ev) => ev.key === "Enter" && update(e.id, { note: (ev.target as HTMLInputElement).value })} onBlur={(ev) => ev.target.value !== e.note && update(e.id, { note: ev.target.value })} />
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function PasswordForm() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [msg, setMsg] = useState("");
  return (
    <Section title="Change Password">
      <form className={`${card} max-w-md space-y-4`} onSubmit={async (e) => {
        e.preventDefault();
        const res = await fetch("/api/admin/password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ current, next }) });
        const data = await res.json();
        setMsg(res.ok ? "Password updated" : data.error);
        if (res.ok) { setCurrent(""); setNext(""); }
      }}>
        <input className={input} type="password" placeholder="Current password" value={current} onChange={(e) => setCurrent(e.target.value)} required />
        <input className={input} type="password" placeholder="New password (min 8)" value={next} onChange={(e) => setNext(e.target.value)} required minLength={8} />
        {msg && <p className="text-sm text-[#d9b45a]">{msg}</p>}
        <button className={btnGold}><KeyRound size={16} /> Update password</button>
      </form>
    </Section>
  );
}

function QuickAddRelease({ categories, artists, onAdd }: { categories: string[]; artists: string[]; onAdd: (r: Release) => void }) {
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState(categories[0] || "");
  const [artist, setArtist] = useState(artists[0] || "");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  return (
    <div className={`${card} mb-6`}>
      <p className="mb-3 font-bold text-white">Quick add from YouTube</p>
      <div className="grid gap-3 md:grid-cols-[1fr_200px_200px_auto]">
        <input className={input} placeholder="Paste YouTube link…" value={url} onChange={(e) => setUrl(e.target.value)} />
        <select className={input} value={category} onChange={(e) => setCategory(e.target.value)}>{categories.map((c) => <option key={c}>{c}</option>)}</select>
        <select className={input} value={artist} onChange={(e) => setArtist(e.target.value)}>{artists.map((c) => <option key={c}>{c}</option>)}</select>
        <button className={btnGold} disabled={!url || busy} onClick={async () => {
          setBusy(true); setErr("");
          const res = await fetch(`/api/admin/youtube?url=${encodeURIComponent(url)}`);
          const d = await res.json();
          setBusy(false);
          if (!res.ok) return setErr(d.error || "Invalid link");
          onAdd({ title: d.title || "New release", hindi: "", artist, category, youtubeId: d.id, image: "", date: new Date().toISOString().slice(0, 10), featured: true });
          setUrl("");
        }}>{busy ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} Add</button>
      </div>
      {err && <p className="mt-2 text-sm text-red-400">{err}</p>}
      <p className="mt-2 text-xs text-gray-500">Title & thumbnail are fetched automatically. New song is added at the top — press Save to publish.</p>
    </div>
  );
}

const TABS = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "enquiries", label: "Enquiries", icon: Inbox },
  { id: "home", label: "Banners & Home", icon: ImageIcon },
  { id: "categories", label: "Categories", icon: FolderTree },
  { id: "releases", label: "Songs / Releases", icon: Music2 },
  { id: "artists", label: "Artists", icon: Users },
  { id: "services", label: "Services & Platforms", icon: Briefcase },
  { id: "about", label: "About & Team", icon: Building2 },
  { id: "contact", label: "Contact & Social", icon: Share2 },
  { id: "texts", label: "Site Text & SEO", icon: Type },
  { id: "settings", label: "Password", icon: KeyRound },
] as const;
type Tab = (typeof TABS)[number]["id"];

const TEXT_FIELDS: (Field & { key: Exclude<keyof SiteTexts, "contactSubjects"> })[] = [
  { key: "topStrip", label: "Top strip text" }, { key: "ctaButton", label: "Main CTA button" },
  { key: "homeCategoriesTitle", label: "Home: categories heading" }, { key: "homeCategoriesSub", label: "Home: categories sub" },
  { key: "homeReleasesTitle", label: "Home: releases heading" }, { key: "homeReleasesSub", label: "Home: releases sub" },
  { key: "homeArtistsTitle", label: "Home: artists heading" }, { key: "homeArtistsSub", label: "Home: artists sub" },
  { key: "homeServicesTitle", label: "Home: services heading" }, { key: "homeServicesSub", label: "Home: services sub" },
  { key: "homePlatformsTitle", label: "Home: platforms heading" }, { key: "homePlatformsSub", label: "Home: platforms sub" },
  { key: "homeJourneyTitle", label: "Journey heading" }, { key: "homeTestimonialsTitle", label: "Testimonials heading" },
  { key: "ctaTitle", label: "CTA band title" }, { key: "ctaText", label: "CTA band text", type: "textarea" },
  { key: "musicTitle", label: "Music page title" }, { key: "musicSub", label: "Music page sub" },
  { key: "artistsTitle", label: "Artists page title" }, { key: "artistsSub", label: "Artists page sub" },
  { key: "servicesTitle", label: "Services page title" }, { key: "servicesSub", label: "Services page sub" },
  { key: "contactTitle", label: "Contact page title" }, { key: "contactSub", label: "Contact page sub" },
  { key: "footerAbout", label: "Footer about text", type: "textarea" },
];

const SEO_PAGES: { id: SeoPage; label: string }[] = [
  { id: "home", label: "Home page" }, { id: "music", label: "Music page" }, { id: "artists", label: "Artists page" },
  { id: "services", label: "Services page" }, { id: "about", label: "About page" }, { id: "contact", label: "Contact page" },
];

function Dashboard({ email, onLogout }: { email: string; onLogout: () => void }) {
  const [content, setContentState] = useState<SiteContent | null>(null);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [tab, setTab] = useState<Tab>("dashboard");
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [menu, setMenu] = useState(false);
  const [releaseFilter, setReleaseFilter] = useState("all");

  useEffect(() => {
    fetch("/api/admin/content").then((r) => r.json()).then(setContentState);
    fetch("/api/admin/enquiries").then((r) => r.json()).then(setEnquiries);
  }, []);

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => { if (dirty) e.preventDefault(); };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const set = useCallback(<K extends keyof SiteContent>(key: K, value: SiteContent[K]) => {
    setContentState((c) => (c ? { ...c, [key]: value } : c));
    setDirty(true);
    setSaved(false);
  }, []);

  const save = async () => {
    if (!content) return;
    setSaving(true);
    const res = await fetch("/api/admin/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(content) });
    setSaving(false);
    if (res.ok) { setDirty(false); setSaved(true); } else alert("Save failed. Please login again.");
  };

  const stats = useMemo(() => [
    { label: "New enquiries", value: enquiries.filter((e) => e.status === "new").length, icon: Inbox, tab: "enquiries" as Tab },
    { label: "Total enquiries", value: enquiries.length, icon: Mail, tab: "enquiries" as Tab },
    { label: "Songs / releases", value: content?.releases.length ?? 0, icon: Music2, tab: "releases" as Tab },
    { label: "Categories", value: content?.categories.length ?? 0, icon: FolderTree, tab: "categories" as Tab },
    { label: "Artists", value: content?.artists.length ?? 0, icon: Users, tab: "artists" as Tab },
    { label: "Services", value: content?.services.length ?? 0, icon: Briefcase, tab: "services" as Tab },
  ], [content, enquiries]);

  if (!content) return <div className="flex min-h-screen items-center justify-center bg-[#031413]"><Loader2 className="animate-spin text-[#d9b45a]" size={32} /></div>;

  const catSlugs = content.categories.map((c) => c.slug);
  const artistNames = content.artists.map((a) => a.name);
  const releaseFields: Field[] = [
    { key: "title", label: "Song title" }, { key: "hindi", label: "Hindi title (optional)" },
    { key: "artist", label: "Artist" }, { key: "category", label: "Category", options: catSlugs },
    { key: "youtubeId", label: "YouTube video ID or link", placeholder: "U8mQO-aNVqU" }, { key: "date", label: "Release date", placeholder: "2026-10-11" },
    { key: "spotify", label: "Spotify link (optional)" }, { key: "jiosaavn", label: "JioSaavn link (optional)" }, { key: "apple", label: "Apple Music link (optional)" },
    { key: "featured", label: "Show on Home page (featured)", type: "checkbox" },
    { key: "image", label: "Cover image (leave empty to use YouTube thumbnail)", type: "image" },
  ];
  const visibleReleases = content.releases.map((r, i) => ({ r, i })).filter(({ r }) => releaseFilter === "all" || r.category === releaseFilter);
  const setReleases = (v: Release[]) => set("releases", v.map((r) => ({ ...r, youtubeId: normalizeYt(r.youtubeId) })));

  return (
    <div className="min-h-screen bg-[#031413] text-white lg:flex">
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 overflow-y-auto border-r border-[#164640] bg-[#04201d] p-4 pb-28 transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${menu ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="mb-8 flex items-center gap-3 px-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={content.settings.logo} alt="" className="h-10 w-10 rounded-full border border-[#d9b45a]/40 object-cover" />
          <div><p className="font-black">Imperial Records</p><p className="text-xs text-gray-500">Admin Panel</p></div>
          <button className="ml-auto lg:hidden" onClick={() => setMenu(false)}><X size={20} /></button>
        </div>
        <nav className="space-y-1">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => { setTab(id); setMenu(false); }} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${tab === id ? "bg-[#d9b45a]/15 font-bold text-[#d9b45a]" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}>
              <Icon size={18} /> {label}
              {id === "enquiries" && enquiries.some((e) => e.status === "new") && <span className="ml-auto rounded-full bg-[#d9b45a] px-2 text-xs font-bold text-black">{enquiries.filter((e) => e.status === "new").length}</span>}
            </button>
          ))}
        </nav>
        <div className="mt-8 space-y-2">
          <a href="/" target="_blank" className={`${btnGhost} w-full`}><ExternalLink size={14} /> View website</a>
          <button onClick={onLogout} className={`${btnGhost} w-full`}><LogOut size={14} /> Logout</button>
        </div>
      </aside>
      {menu && <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setMenu(false)} />}

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-[#164640] bg-[#031413]/90 px-4 py-3 backdrop-blur sm:px-8">
          <button className="lg:hidden" onClick={() => setMenu(true)} aria-label="Menu"><Menu size={22} /></button>
          <div className="min-w-0">
            <p className="font-bold">{TABS.find((t) => t.id === tab)?.label}</p>
            <p className="truncate text-xs text-gray-500">{email}</p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            {dirty && <span className="hidden text-xs text-yellow-400 sm:inline">Unsaved changes</span>}
            {saved && !dirty && <span className="flex items-center gap-1 text-xs text-green-400"><Check size={14} /> Live on website</span>}
            <button className={btnGold} onClick={save} disabled={!dirty || saving}>{saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save</button>
          </div>
        </header>

        <main className="mx-auto max-w-5xl p-4 sm:p-8">
          {tab === "dashboard" && (
            <>
              <Section title="Namaste 🙏" desc="Overview of your website. Changes go live as soon as you press Save.">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {stats.map(({ label, value, icon: Icon, tab: t }) => (
                    <button key={label} onClick={() => setTab(t)} className={`${card} text-left transition hover:border-[#d9b45a]/50`}>
                      <Icon className="mb-3 text-[#d9b45a]" size={22} />
                      <p className="text-3xl font-black">{value}</p>
                      <p className="text-sm text-gray-500">{label}</p>
                    </button>
                  ))}
                </div>
              </Section>
              <Section title="Latest enquiries">
                <div className="space-y-2">
                  {enquiries.slice(0, 5).map((e) => (
                    <button key={e.id} onClick={() => setTab("enquiries")} className={`${card} flex w-full items-center justify-between gap-3 !py-3 text-left`}>
                      <span className="truncate"><b>{e.name}</b> <span className="text-gray-500">• {e.subject} • {e.phone}</span></span>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold capitalize ${STATUS_STYLE[e.status]}`}>{e.status}</span>
                    </button>
                  ))}
                  {!enquiries.length && <p className="text-sm text-gray-500">No enquiries yet.</p>}
                </div>
              </Section>
            </>
          )}

          {tab === "enquiries" && <Enquiries items={enquiries} setItems={setEnquiries} />}

          {tab === "home" && (
            <>
              <Section title="Hero banners" desc="Big sliding banners on the Home page. Add a YouTube ID to make the button play a video.">
                <ListEditor items={content.banners} blank={{ image: "", eyebrow: "", title: "", subtitle: "", ctaText: "Watch Now", ctaUrl: "", youtubeId: "" }} title={(b) => b.title} addLabel="Add banner" onChange={(v) => set("banners", v)} fields={[
                  { key: "image", label: "Banner image (wide, 1920×1080)", type: "image" }, { key: "eyebrow", label: "Small text above title" }, { key: "title", label: "Title" },
                  { key: "subtitle", label: "Subtitle", type: "textarea" }, { key: "ctaText", label: "Button text" }, { key: "ctaUrl", label: "Button link (if no YouTube)", placeholder: "/music" },
                  { key: "youtubeId", label: "YouTube video ID (optional)" },
                ]} />
              </Section>
              <Section title="Mantra ticker" desc="Scrolling mantras below the banner.">
                <StringList items={content.mantras} onChange={(v) => set("mantras", v)} />
              </Section>
              <Section title="Stats">
                <ListEditor items={content.stats} blank={{ value: "", label: "" }} title={(s) => `${s.value} ${s.label}`} onChange={(v) => set("stats", v)} fields={[{ key: "value", label: "Value", placeholder: "70K+" }, { key: "label", label: "Label" }]} />
              </Section>
              <Section title="Testimonials">
                <ListEditor items={content.testimonials} blank={{ name: "", role: "", text: "" }} title={(s) => s.name} onChange={(v) => set("testimonials", v)} fields={[{ key: "name", label: "Name" }, { key: "role", label: "Role / city" }, { key: "text", label: "Text", type: "textarea" }]} />
              </Section>
            </>
          )}

          {tab === "categories" && (
            <Section title="Music categories" desc="Slug is used in the URL (/music/slug) — use lowercase-with-dashes. Untick Published to hide a category.">
              <ListEditor items={content.categories} blank={{ slug: "", name: "", hindi: "", description: "", image: "", color: "#d9b45a", published: true }} title={(c) => `${c.name} (${content.releases.filter((r) => r.category === c.slug).length} songs)`} addLabel="Add category" onChange={(v) => set("categories", v)} fields={[
                { key: "name", label: "Name" }, { key: "hindi", label: "Hindi name" }, { key: "slug", label: "URL slug", placeholder: "hanuman-bhajan" }, { key: "color", label: "Accent colour", placeholder: "#ff9a3c" },
                { key: "description", label: "Description", type: "textarea" }, { key: "image", label: "Cover image", type: "image" }, { key: "published", label: "Published", type: "checkbox" },
              ]} />
            </Section>
          )}

          {tab === "releases" && (
            <Section title="Songs / Releases" desc="All songs on the website. Order here = order on website (top = newest).">
              <QuickAddRelease categories={catSlugs} artists={artistNames} onAdd={(r) => setReleases([r, ...content.releases])} />
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="text-sm text-gray-400">Filter:</span>
                <select className={`${input} !w-auto`} value={releaseFilter} onChange={(e) => setReleaseFilter(e.target.value)}>
                  <option value="all">All categories ({content.releases.length})</option>
                  {content.categories.map((c) => <option key={c.slug} value={c.slug}>{c.name} ({content.releases.filter((r) => r.category === c.slug).length})</option>)}
                </select>
              </div>
              {releaseFilter === "all" ? (
                <ListEditor items={content.releases} blank={{ title: "", hindi: "", artist: artistNames[0] || "", category: catSlugs[0] || "", youtubeId: "", image: "", date: "", featured: false }} title={(r) => r.title} addLabel="Add song manually" onChange={setReleases} fields={releaseFields} />
              ) : (
                <ListEditor items={visibleReleases.map((x) => x.r)} blank={{ title: "", hindi: "", artist: artistNames[0] || "", category: releaseFilter, youtubeId: "", image: "", date: "", featured: false }} title={(r) => r.title} addLabel="Add song manually" fields={releaseFields}
                  onChange={(v) => {
                    const others = content.releases.filter((r) => r.category !== releaseFilter);
                    setReleases([...v, ...others]);
                  }} />
              )}
              <div className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-6">
                {visibleReleases.slice(0, 12).map(({ r, i }) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={i} src={releaseImage(r)} alt={r.title} title={r.title} className="aspect-video w-full rounded-lg object-cover" />
                ))}
              </div>
            </Section>
          )}

          {tab === "artists" && (
            <Section title="Artists" desc="Artist name must match the 'Artist' field on songs so their songs show on the artist page.">
              <ListEditor items={content.artists} blank={{ slug: "", name: "", role: "Singer", genre: "", image: "", bio: "", youtube: "", instagram: "", facebook: "", spotify: "", featured: true }} title={(a) => a.name} addLabel="Add artist" onChange={(v) => set("artists", v)} fields={[
                { key: "name", label: "Name" }, { key: "slug", label: "URL slug", placeholder: "vikash-habibpur" }, { key: "role", label: "Role" }, { key: "genre", label: "Genre" },
                { key: "image", label: "Photo", type: "image" }, { key: "bio", label: "Biography", type: "textarea" },
                { key: "youtube", label: "YouTube" }, { key: "instagram", label: "Instagram" }, { key: "facebook", label: "Facebook" }, { key: "spotify", label: "Spotify" },
                { key: "featured", label: "Show on Home page", type: "checkbox" },
              ]} />
            </Section>
          )}

          {tab === "services" && (
            <>
              <Section title="Services" desc="Icon options: Globe, Mic2, Clapperboard, MonitorPlay, Users, Flame, ShieldCheck, Megaphone, Music2">
                <ListEditor items={content.services} blank={{ slug: "", icon: "Music2", name: "", description: "", points: [] }} title={(s) => s.name} addLabel="Add service" onChange={(v) => set("services", v)} fields={[
                  { key: "name", label: "Name" }, { key: "slug", label: "Slug" },
                  { key: "icon", label: "Icon", options: ["Globe", "Mic2", "Clapperboard", "MonitorPlay", "Users", "Flame", "ShieldCheck", "Megaphone", "Music2"] },
                  { key: "description", label: "Description", type: "textarea" },
                ]} />
                <p className="mt-6 mb-3 text-sm font-bold text-white">Service bullet points</p>
                <div className="space-y-4">
                  {content.services.map((s, i) => (
                    <div key={i} className={card}>
                      <p className="mb-3 font-bold text-[#d9b45a]">{s.name || "Untitled"}</p>
                      <StringList items={s.points} onChange={(v) => set("services", content.services.map((x, k) => (k === i ? { ...x, points: v } : x)))} />
                    </div>
                  ))}
                </div>
              </Section>
              <Section title="Distribution platforms">
                <ListEditor items={content.platforms} blank={{ name: "", type: "Streaming", url: "" }} title={(p) => p.name} addLabel="Add platform" onChange={(v) => set("platforms", v)} fields={[{ key: "name", label: "Name" }, { key: "type", label: "Type" }, { key: "url", label: "Link" }]} />
              </Section>
            </>
          )}

          {tab === "about" && (
            <>
              <Section title="About company">
                <div className={`${card} space-y-4`}>
                  <ObjectEditor value={content.about} onChange={(v) => set("about", v)} fields={[
                    { key: "eyebrow", label: "Eyebrow" }, { key: "heading", label: "Heading" }, { key: "intro", label: "Intro", type: "textarea" },
                    { key: "mission", label: "Mission", type: "textarea" }, { key: "vision", label: "Vision", type: "textarea" }, { key: "image", label: "About image", type: "image" },
                  ]} />
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Paragraphs</p>
                  <StringList items={content.about.paragraphs} onChange={(v) => set("about", { ...content.about, paragraphs: v })} />
                </div>
              </Section>
              <Section title="Journey / timeline">
                <ListEditor items={content.journey} blank={{ year: "", text: "" }} title={(j) => `${j.year} — ${j.text}`} onChange={(v) => set("journey", v)} fields={[{ key: "year", label: "Year" }, { key: "text", label: "Text", type: "textarea" }]} />
              </Section>
              <Section title="Team">
                <ListEditor items={content.team} blank={{ name: "", role: "", image: "", phone: "", email: "" }} title={(m) => m.name} addLabel="Add member" onChange={(v) => set("team", v)} fields={[
                  { key: "name", label: "Name" }, { key: "role", label: "Role" }, { key: "phone", label: "Phone" }, { key: "email", label: "Email" }, { key: "image", label: "Photo", type: "image" },
                ]} />
              </Section>
            </>
          )}

          {tab === "contact" && (
            <>
              <Section title="Company & contact">
                <div className={card}>
                  <ObjectEditor value={content.settings} onChange={(v) => set("settings", v)} fields={[
                    { key: "companyName", label: "Company name" }, { key: "tagline", label: "Tagline" },
                    { key: "email", label: "Email" }, { key: "phone", label: "Phone" },
                    { key: "whatsapp", label: "WhatsApp number (with 91)", placeholder: "919672405059" }, { key: "hours", label: "Office hours" },
                    { key: "address", label: "Address" }, { key: "mapQuery", label: "Google map location" },
                    { key: "description", label: "Company description (Google)", type: "textarea" }, { key: "logo", label: "Logo", type: "image" },
                  ]} />
                </div>
              </Section>
              <Section title="Social & streaming links">
                <div className={card}>
                  <ObjectEditor value={content.socials} onChange={(v) => set("socials", v)} fields={[
                    { key: "youtube", label: "YouTube (Imperial Records)" }, { key: "youtube2", label: "YouTube (2nd channel)" }, { key: "instagram", label: "Instagram" },
                    { key: "facebook", label: "Facebook" }, { key: "twitter", label: "X / Twitter" }, { key: "spotify", label: "Spotify" },
                    { key: "jiosaavn", label: "JioSaavn" }, { key: "appleMusic", label: "Apple Music" },
                  ]} />
                </div>
              </Section>
            </>
          )}

          {tab === "texts" && (
            <>
              <Section title="Website text" desc="Headings and button labels on the website.">
                <div className={card}>
                  <ObjectEditor value={content.texts} onChange={(v) => set("texts", v)} fields={TEXT_FIELDS} />
                </div>
              </Section>
              <Section title="Contact form — subjects">
                <StringList items={content.texts.contactSubjects} onChange={(v) => set("texts", { ...content.texts, contactSubjects: v })} />
              </Section>
              <Section title="Google / SEO" desc="Title and description shown in Google search results and when links are shared.">
                <div className="space-y-4">
                  {SEO_PAGES.map(({ id, label }) => (
                    <div key={id} className={card}>
                      <p className="mb-4 font-bold text-white">{label}</p>
                      <ObjectEditor value={content.seo[id]} onChange={(v) => set("seo", { ...content.seo, [id]: v })} fields={[
                        { key: "title", label: "Title" }, { key: "description", label: "Description", type: "textarea" },
                      ]} />
                    </div>
                  ))}
                </div>
              </Section>
            </>
          )}

          {tab === "settings" && <PasswordForm />}
        </main>
      </div>
    </div>
  );
}

function normalizeYt(v: string) {
  const s = (v || "").trim();
  if (/^[\w-]{11}$/.test(s)) return s;
  const m = s.match(/(?:v=|youtu\.be\/|shorts\/|embed\/|live\/)([\w-]{11})/);
  return m ? m[1] : s;
}

export default function AdminPage() {
  const [email, setEmail] = useState<string | null | undefined>(undefined);
  const check = useCallback(() => {
    fetch("/api/admin/me").then(async (r) => setEmail(r.ok ? (await r.json()).email : null)).catch(() => setEmail(null));
  }, []);
  useEffect(check, [check]);

  if (email === undefined) return <div className="flex min-h-screen items-center justify-center bg-[#031413]"><Loader2 className="animate-spin text-[#d9b45a]" size={32} /></div>;
  if (!email) return <Login onDone={check} />;
  return <Dashboard email={email} onLogout={async () => { await fetch("/api/admin/logout", { method: "POST" }); setEmail(null); }} />;
}
