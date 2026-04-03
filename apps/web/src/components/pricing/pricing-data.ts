/* ------------------------------------------------------------------ */
/*  Pricing page – shared constants, types, and helpers               */
/* ------------------------------------------------------------------ */

/** Per-bag price depends on frequency + bag count */
export function getBagPrice(freq: "weekly" | "biweekly", bags: number): number {
  if (freq === "biweekly") return 34.99;
  return bags >= 2 ? 30.99 : 32.99;
}

export const BEDDING_PRICE = 58.99;
export const STUDENT_BAG = 24.99;
export const PAYG_RATE = 2.75;
export const PAYG_RUSH_RATE = 3.5;
export const PAYG_FEE = 5.99;
export const PAYG_MIN = 29.99;
export const DEEP_CLEAN_ITEM_PRICE = 1.49;
export const DEEP_CLEAN_PAYG_ITEM_PRICE = 1.99;

/* ---- Frequency options ---- */
export interface FreqOption {
  label: string;
  value: "weekly" | "biweekly";
  pickups: number;
  note: string;
}

export const freqOptions: FreqOption[] = [
  { label: "Every week", value: "weekly", pickups: 4, note: "4 pickups/month · Best value" },
  { label: "Every 2 weeks", value: "biweekly", pickups: 2, note: "2 pickups/month" },
];

/* ---- Care upgrades ---- */
export interface CareUpgrade {
  id: string;
  emoji: string;
  name: string;
  price: number;
  unit: string;
  note: string;
}

export const careUpgrades: CareUpgrade[] = [
  { id: "deepclean", emoji: "🧼", name: "Deep Clean", price: 9.99, unit: "per bag", note: "Or $1.49/item in a separate disposable bag" },
  { id: "family", emoji: "👨‍👩‍👧", name: "Family Sort + Hypoallergenic", price: 4.99, unit: "per bag", note: "Sorted by person, fragrance-free detergent" },
  { id: "premium", emoji: "✨", name: "Premium Care", price: 4.99, unit: "per bag", note: "For delicates — no sorting needed from you" },
];

/* ---- Specialty items ---- */
export interface SpecialtyItem {
  name: string;
  price: number;
}

export const specialtyItems: SpecialtyItem[] = [
  { name: "Bedspread", price: 5.99 },
  { name: "Blanket", price: 17.99 },
  { name: "Comforter", price: 23.99 },
  { name: "Comforter (King Size)", price: 29.99 },
  { name: "Duvet", price: 47.99 },
  { name: "Duvet Cover", price: 17.99 },
  { name: "Feather Pillow", price: 17.99 },
  { name: "Large Tablecloth", price: 23.99 },
  { name: "Long Down Coat", price: 11.99 },
  { name: "Medium Down Coat", price: 9.99 },
  { name: "Rug (Small)", price: 35.99 },
  { name: "Rug (Medium)", price: 47.99 },
  { name: "Rug (Large)", price: 59.99 },
  { name: "Rug (X-Large)", price: 71.99 },
  { name: "Short Down Coat", price: 5.99 },
  { name: "Small Tablecloth", price: 21.99 },
  { name: "Sneaker", price: 23.99 },
  { name: "Standard Pillow", price: 11.99 },
  { name: "Throw Blanket", price: 11.99 },
];

/* ---- Quiz ---- */
export interface QuizQuestion {
  id: string;
  q: string;
  options: { label: string; value: string }[];
}

export const questions: QuizQuestion[] = [
  {
    id: "who", q: "Who's doing laundry?", options: [
      { label: "Just me", value: "solo" },
      { label: "Me + partner / roommate", value: "couple" },
      { label: "Family household", value: "family" },
      { label: "Student", value: "student" },
    ],
  },
  {
    id: "pile", q: "How fast does your pile grow?", options: [
      { label: "Slow — I rewear a lot", value: "light" },
      { label: "Normal amount", value: "medium" },
      { label: "Fast — it multiplies", value: "heavy" },
    ],
  },
  {
    id: "freq", q: "How often do you want pickups?", options: [
      { label: "Every week — 4x/month", value: "weekly" },
      { label: "Every 2 weeks — 2x/month", value: "biweekly" },
    ],
  },
  {
    id: "bedding", q: "What about your bedding?", options: [
      { label: "Full bedding set monthly", value: "monthly" },
      { label: "Twice a month", value: "bimonthly" },
      { label: "Just sheets in my regular bag", value: "withlaundry" },
    ],
  },
  {
    id: "pets", q: "Do you have pets?", options: [
      { label: "Yes — fur everywhere", value: "yes" },
      { label: "Fur-free household", value: "no" },
    ],
  },
  {
    id: "baby", q: "Any little ones at home?", options: [
      { label: "Yes — baby or toddler", value: "yes" },
      { label: "No babies here", value: "no" },
    ],
  },
];

/* ---- Helpers ---- */
export const fmt = (n: number) => "$" + n.toFixed(2);

export type PageView = "home" | "quiz" | "subscription" | "payg" | "schedule";

export interface ScheduleState {
  date: string; // ISO date string e.g. "2026-04-04"
  timeSlot: string; // e.g. "8am - 12pm"
  repeatPickup: boolean;
}

export interface QuizAnswers {
  [key: string]: string;
}

export interface Suggestion {
  bags: number;
  freq: "weekly" | "biweekly";
  student: boolean;
}

export function getSuggestion(a: QuizAnswers): Suggestion {
  if (a.who === "student") return { bags: 1, freq: "weekly", student: true };
  if (a.who === "family") return { bags: 2, freq: a.freq === "weekly" ? "weekly" : "biweekly", student: false };
  if (a.who === "couple") return { bags: a.pile === "heavy" ? 2 : 1, freq: a.freq === "weekly" ? "weekly" : "biweekly", student: false };
  if (a.pile === "heavy") return { bags: 2, freq: "weekly", student: false };
  return { bags: 1, freq: a.freq === "biweekly" ? "biweekly" : "weekly", student: false };
}

export interface SubState {
  bags: number;
  freq: "weekly" | "biweekly";
  isStudent: boolean;
  addBedding: boolean;
  beddingFreq: "monthly" | "bimonthly";
  selectedCare: string[];
  suggestion: Suggestion | null;
  quizAnswers: QuizAnswers | null;
}

export const defaultSubState: SubState = {
  bags: 1,
  freq: "weekly",
  isStudent: false,
  addBedding: false,
  beddingFreq: "monthly",
  selectedCare: [],
  suggestion: null,
  quizAnswers: null,
};

export interface PaygState {
  lbs: number;
  rush: boolean;
  selectedCare: string[];
  specialtyQty: Record<string, number>;
  deepItems: number;
  showSpecialty: boolean;
  addBedding: boolean;
}

export const defaultPaygState: PaygState = {
  lbs: 15,
  rush: false,
  selectedCare: [],
  specialtyQty: {},
  deepItems: 0,
  showSpecialty: false,
  addBedding: false,
};
