export interface PickupWindow {
  readonly label: string;
  readonly time: string;
}

export interface Tier1Market {
  readonly slug: string;
  readonly name: string;
  readonly state: string;
  readonly metaTitle: string;
  readonly metaDescription: string;
  readonly headline: string;
  readonly heroCopy: string;
  readonly pickupWindows: readonly PickupWindow[];
  readonly turnaround: string;
  readonly pickupStyle: string;
  readonly neighborhoods: readonly string[];
  readonly localCopy: string;
  readonly customerProfile: string;
  readonly localFAQ: readonly { readonly question: string; readonly answer: string }[];
  readonly reviewQuote: string;
  readonly reviewAuthor: string;
  readonly ctaHeadline: string;
  readonly ctaSub: string;
  readonly schemaAreaType: "City" | "AdministrativeArea";
}

const markets: Record<string, Tier1Market> = {
  "downtown-manhattan": {
    slug: "downtown-manhattan",
    name: "Downtown Manhattan",
    state: "NY",
    metaTitle: "Laundry Pickup & Delivery in Downtown Manhattan | We Deliver Laundry",
    metaDescription:
      "Laundry pickup and delivery below 34th St. Doorman handoff or we come up to your floor. Morning and evening windows, 7 days a week. 24-hour turnaround. Starting at $1.95/lb.",
    headline: "Laundry Pickup Below 34th — Doorman or Door",
    heroCopy:
      "We pick up from your building every morning and evening. If you've got a doorman, leave it with them and forget about it. No doorman — we buzz up, any floor. Back at your door in 24 hours.",
    pickupWindows: [
      { label: "Morning", time: "8–11 AM" },
      { label: "Evening", time: "6–9 PM" },
    ],
    turnaround: "24 hours",
    pickupStyle:
      "Doorman buildings: leave with your doorman, we handle the rest. No doorman: we come up to your floor — no limit. Not home? Leave the bag outside your door.",
    neighborhoods: [
      "FiDi", "Tribeca", "SoHo", "NoHo", "Lower East Side", "East Village",
      "West Village", "Chelsea", "Nolita", "Chinatown", "Bowery", "Flatiron",
      "Gramercy", "Murray Hill", "Kips Bay", "Stuyvesant Town", "Two Bridges",
    ],
    localCopy:
      "TODO: Unique paragraph about serving downtown Manhattan — density, building types, why this market is different. Write from experience, not a template.",
    customerProfile:
      "TODO: Who actually uses the service downtown? Young professionals, families, students?",
    localFAQ: [
      {
        question: "Do you pick up from doorman buildings?",
        answer:
          "Yes — leave your bag with the doorman and we'll grab it during your pickup window. We'll drop it back with them when it's done.",
      },
      {
        question: "What if I live in a walk-up?",
        answer:
          "We come up to your door, any floor. No limit. If you're not home, leave the bag outside your door.",
      },
      {
        question: "What are the pickup times for downtown Manhattan?",
        answer:
          "Morning window is 8–11 AM, evening window is 6–9 PM. 7 days a week.",
      },
    ],
    reviewQuote:
      "TODO: Real review from a downtown Manhattan customer.",
    reviewAuthor: "TODO: Real name, Downtown Manhattan",
    ctaHeadline: "Stop Doing Laundry.",
    ctaSub:
      "Schedule your first pickup and get your time back. 24-hour turnaround, doorman handoff or right to your door.",
    schemaAreaType: "City",
  },

  "uptown-manhattan": {
    slug: "uptown-manhattan",
    name: "Uptown Manhattan",
    state: "NY",
    metaTitle: "Laundry Pickup & Delivery in Uptown Manhattan | We Deliver Laundry",
    metaDescription:
      "Laundry pickup and delivery above 59th St. We buzz up to your floor — walk-ups welcome, no limit. Morning and evening windows, 7 days a week. 24-hour turnaround.",
    headline: "Laundry Pickup Above 59th — We Come Up to You",
    heroCopy:
      "Walk-ups don't scare us. We buzz up to your floor, grab your bag, and have it back in 24 hours. Morning or evening, 7 days a week.",
    pickupWindows: [
      { label: "Morning", time: "10 AM–1 PM" },
      { label: "Evening", time: "7–10 PM" },
    ],
    turnaround: "24 hours",
    pickupStyle:
      "Mostly walk-ups — we come to your door, any floor. Not home? Leave the bag outside your door. Doorman buildings covered too.",
    neighborhoods: [
      "Upper East Side", "Upper West Side", "Harlem", "East Harlem",
      "Washington Heights", "Inwood", "Morningside Heights",
      "Hamilton Heights", "Yorkville", "Lenox Hill", "Lincoln Square",
      "Manhattan Valley", "Marble Hill", "Sugar Hill",
    ],
    localCopy:
      "TODO: Unique paragraph about serving uptown Manhattan — walk-up culture, family density, different vibe from downtown. Write from experience.",
    customerProfile:
      "TODO: Who uses the service uptown? Families, older residents, students near Columbia?",
    localFAQ: [
      {
        question: "Will you walk up to my apartment?",
        answer:
          "Yes — no floor limit. We buzz up and come to your door. If you're not home, leave the bag outside.",
      },
      {
        question: "What are the pickup times for uptown Manhattan?",
        answer:
          "Morning window is 10 AM–1 PM, evening window is 7–10 PM. 7 days a week.",
      },
    ],
    reviewQuote:
      "TODO: Real review from an uptown Manhattan customer.",
    reviewAuthor: "TODO: Real name, Uptown Manhattan",
    ctaHeadline: "Your Weekend Belongs to You.",
    ctaSub:
      "Schedule your first pickup. We come up to your floor, any floor. Back in 24 hours.",
    schemaAreaType: "City",
  },

  astoria: {
    slug: "astoria",
    name: "Astoria",
    state: "NY",
    metaTitle: "Laundry Pickup & Delivery in Astoria, Queens | We Deliver Laundry",
    metaDescription:
      "Laundry pickup and delivery in Astoria. Monday, Wednesday, and Friday service. Leave your bag at the door — back in 48 hours. Starting at $1.95/lb.",
    headline: "Laundry Pickup in Astoria — Monday, Wednesday, Friday",
    heroCopy:
      "We're in Astoria three days a week. Schedule your pickup, leave your bag at the door, and it's back in 48 hours.",
    pickupWindows: [
      { label: "Pickup days", time: "Monday, Wednesday, Friday" },
    ],
    turnaround: "48 hours",
    pickupStyle:
      "Residential door pickup. Leave your bag outside — no need to be home.",
    neighborhoods: [
      "Astoria", "Long Island City", "Ditmars", "Steinway",
    ],
    localCopy:
      "TODO: Unique paragraph about Astoria — the neighborhood, why MWF works, who lives here. Write from experience.",
    customerProfile:
      "TODO: Who uses the service in Astoria?",
    localFAQ: [
      {
        question: "Why is pickup only three days a week?",
        answer:
          "We run Astoria routes on Monday, Wednesday, and Friday. Schedule your pickup for any of those days.",
      },
      {
        question: "How long until I get my laundry back?",
        answer:
          "48-hour turnaround from pickup.",
      },
    ],
    reviewQuote:
      "TODO: Real review from an Astoria customer.",
    reviewAuthor: "TODO: Real name, Astoria",
    ctaHeadline: "Laundry Off Your Plate.",
    ctaSub:
      "Schedule your next MWF pickup. Leave the bag out, we handle the rest.",
    schemaAreaType: "City",
  },

  "the-oranges": {
    slug: "the-oranges",
    name: "The Oranges",
    state: "NJ",
    metaTitle: "Laundry Pickup & Delivery in The Oranges, NJ | We Deliver Laundry",
    metaDescription:
      "Laundry pickup and delivery in East Orange, West Orange, South Orange, and Orange, NJ. Four daily time windows. 24-hour turnaround. Starting at $1.95/lb.",
    headline: "Laundry Pickup in The Oranges — Four Windows, Every Day",
    heroCopy:
      "Morning or evening, we come to your door in East Orange, West Orange, South Orange, and Orange. Leave your bag out — back in 24 hours.",
    pickupWindows: [
      { label: "Morning", time: "8–10 AM" },
      { label: "Late morning", time: "10 AM–12 PM" },
      { label: "Afternoon", time: "4–6 PM" },
      { label: "Evening", time: "6–8 PM" },
    ],
    turnaround: "24 hours",
    pickupStyle:
      "Residential porch and door pickup. Leave your bag outside — no need to be home.",
    neighborhoods: [
      "East Orange", "West Orange", "South Orange", "Orange",
    ],
    localCopy:
      "TODO: Unique paragraph about The Oranges — suburban feel, families, why four windows matter here. Write from experience.",
    customerProfile:
      "TODO: Who uses the service in The Oranges? Families, commuters?",
    localFAQ: [
      {
        question: "Do you serve all four Oranges?",
        answer:
          "Yes — East Orange, West Orange, South Orange, and Orange. All four, every day.",
      },
      {
        question: "What are the pickup windows?",
        answer:
          "Four windows daily: 8–10 AM, 10 AM–12 PM, 4–6 PM, and 6–8 PM.",
      },
    ],
    reviewQuote:
      "TODO: Real review from a customer in The Oranges.",
    reviewAuthor: "TODO: Real name, The Oranges",
    ctaHeadline: "Done With Laundry Day.",
    ctaSub:
      "Pick a window that works, leave your bag out. Back at your door in 24 hours.",
    schemaAreaType: "City",
  },

  morristown: {
    slug: "morristown",
    name: "Morristown",
    state: "NJ",
    metaTitle: "Laundry Pickup & Delivery in Morristown, NJ | We Deliver Laundry",
    metaDescription:
      "Laundry pickup and delivery in Morristown, NJ. Daily morning service, 9 AM–1 PM. 24-hour turnaround. Leave your bag at the door. Starting at $1.95/lb.",
    headline: "Laundry Pickup in Morristown — Every Morning",
    heroCopy:
      "Drop your bag at the door before you leave for work. We pick up between 9 and 1, and have it back in 24 hours.",
    pickupWindows: [
      { label: "Morning", time: "9 AM–1 PM" },
    ],
    turnaround: "24 hours",
    pickupStyle:
      "Residential porch and door pickup. Leave your bag outside — no need to be home.",
    neighborhoods: [
      "Morristown", "Morris Plains", "Morris Township",
    ],
    localCopy:
      "TODO: Unique paragraph about Morristown — suburban families, commuters, why morning-only works. Write from experience.",
    customerProfile:
      "TODO: Who uses the service in Morristown?",
    localFAQ: [
      {
        question: "What time is pickup in Morristown?",
        answer:
          "Every day between 9 AM and 1 PM. Leave your bag at the door before you head out.",
      },
      {
        question: "Do I need to be home for pickup?",
        answer:
          "No — leave your bag at your door or porch. We'll grab it during the morning window.",
      },
    ],
    reviewQuote:
      "TODO: Real review from a Morristown customer.",
    reviewAuthor: "TODO: Real name, Morristown",
    ctaHeadline: "Morning Pickup. Next-Day Delivery.",
    ctaSub:
      "Leave your bag out before work. We handle the rest. Back in 24 hours.",
    schemaAreaType: "City",
  },
};

export function getMarket(slug: string): Tier1Market | undefined {
  return markets[slug];
}

export function getAllMarketSlugs(): { slug: string }[] {
  return Object.keys(markets).map((slug) => ({ slug }));
}
