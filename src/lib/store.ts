import "server-only";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import { defaultContent, type SiteContent } from "./siteContent";

export const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), "data");
export const UPLOAD_DIR = path.join(DATA_DIR, "uploads");
const CONTENT_FILE = path.join(DATA_DIR, "content.json");
const ENQUIRY_FILE = path.join(DATA_DIR, "enquiries.json");
const ADMIN_FILE = path.join(DATA_DIR, "admin.json");

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await fs.readFile(file, "utf8")) as T;
  } catch {
    return fallback;
  }
}

async function writeJson(file: string, value: unknown) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  const tmp = `${file}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(value, null, 2));
  await fs.rename(tmp, file);
}

export async function getContent(): Promise<SiteContent> {
  const saved = await readJson<Partial<SiteContent>>(CONTENT_FILE, {});
  const d = defaultContent;
  return {
    ...d,
    ...saved,
    settings: { ...d.settings, ...saved.settings },
    socials: { ...d.socials, ...saved.socials },
    about: { ...d.about, ...saved.about },
    texts: { ...d.texts, ...saved.texts },
    seo: Object.fromEntries(
      Object.keys(d.seo).map((k) => [k, { ...d.seo[k as keyof typeof d.seo], ...saved.seo?.[k as keyof typeof d.seo] }]),
    ) as SiteContent["seo"],
  };
}

export async function saveContent(content: SiteContent) {
  const backupDir = path.join(DATA_DIR, "backups");
  await fs.mkdir(backupDir, { recursive: true });
  try {
    await fs.copyFile(CONTENT_FILE, path.join(backupDir, `content-${Date.now()}.json`));
  } catch {}
  await writeJson(CONTENT_FILE, content);
}

export type EnquiryStatus = "new" | "contacted" | "in-progress" | "closed";

export type Enquiry = {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  subject: string;
  link: string;
  message: string;
  status: EnquiryStatus;
  note: string;
  createdAt: string;
};

export async function listEnquiries(): Promise<Enquiry[]> {
  return readJson<Enquiry[]>(ENQUIRY_FILE, []);
}

let enquiryQueue: Promise<unknown> = Promise.resolve();
function serial<T>(fn: () => Promise<T>): Promise<T> {
  const next = enquiryQueue.then(fn, fn);
  enquiryQueue = next.catch(() => undefined);
  return next;
}

export function addEnquiry(input: Omit<Enquiry, "id" | "status" | "note" | "createdAt">) {
  return serial(async () => {
    const all = await listEnquiries();
    const enquiry: Enquiry = { ...input, id: crypto.randomUUID(), status: "new", note: "", createdAt: new Date().toISOString() };
    all.unshift(enquiry);
    await writeJson(ENQUIRY_FILE, all);
    return enquiry;
  });
}

export function updateEnquiry(id: string, patch: Partial<Pick<Enquiry, "status" | "note">>) {
  return serial(async () => {
    const all = await listEnquiries();
    const item = all.find((e) => e.id === id);
    if (!item) return null;
    Object.assign(item, patch);
    await writeJson(ENQUIRY_FILE, all);
    return item;
  });
}

export function deleteEnquiry(id: string) {
  return serial(async () => {
    const all = await listEnquiries();
    const next = all.filter((e) => e.id !== id);
    if (next.length === all.length) return false;
    const backupDir = path.join(DATA_DIR, "backups");
    await fs.mkdir(backupDir, { recursive: true });
    await writeJson(path.join(backupDir, `enquiries-${Date.now()}.json`), all);
    await writeJson(ENQUIRY_FILE, next);
    return true;
  });
}

type AdminRecord = { email: string; salt: string; hash: string };

function hashPassword(password: string, salt: string) {
  return crypto.scryptSync(password, salt, 64).toString("hex");
}

async function getAdminRecord(): Promise<AdminRecord> {
  const saved = await readJson<AdminRecord | null>(ADMIN_FILE, null);
  if (saved) return saved;
  const salt = crypto.randomBytes(16).toString("hex");
  const record = {
    email: (process.env.ADMIN_EMAIL || "intubemediaofficial@gmail.com").toLowerCase(),
    salt,
    hash: hashPassword(process.env.ADMIN_PASSWORD || crypto.randomBytes(12).toString("hex"), salt),
  };
  await writeJson(ADMIN_FILE, record);
  return record;
}

export async function checkAdmin(email: string, password: string) {
  const rec = await getAdminRecord();
  const candidate = Buffer.from(hashPassword(password, rec.salt), "hex");
  const ok = crypto.timingSafeEqual(candidate, Buffer.from(rec.hash, "hex"));
  return ok && email.trim().toLowerCase() === rec.email;
}

export async function setAdminPassword(password: string) {
  const rec = await getAdminRecord();
  const salt = crypto.randomBytes(16).toString("hex");
  await writeJson(ADMIN_FILE, { ...rec, salt, hash: hashPassword(password, salt) });
}
