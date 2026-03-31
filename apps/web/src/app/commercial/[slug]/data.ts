export interface CommercialPage {
  // Routing
  slug: string
  vertical: string

  // SEO
  metaTitle: string
  metaDescription: string

  // Hero
  h1: string
  heroSubtitle: string

  // Content
  introParagraph: string
  painPoints: string[]

  // FAQ
  localFAQ_question: string
  localFAQ_answer: string

  // Social proof
  reviewQuote: string
  reviewAuthor: string

  // Pricing CTA
  pricingCTA: string

  // Final section
  finalHeadline: string
  finalSub: string

  // Coverage
  serviceArea: string
}

// ─── All 8 commercial verticals from spreadsheet ────────────────────────────

export const commercialPages: Record<string, CommercialPage> = {
  "commercial-laundry-hotels": {
    slug: "commercial-laundry-hotels",
    vertical: "Hotels & Hospitality",
    metaTitle: "Commercial Laundry for Hotels in NYC & NJ | We Deliver Laundry",
    metaDescription:
      "Professional commercial laundry pickup and delivery for hotels in NYC and New Jersey. Linens, towels, and staff uniforms washed and returned in 24 hours. Get a quote.",
    h1: "Hotel Laundry, Handled. Professionally.",
    heroSubtitle:
      "We pick up, professionally clean all linens, towels, and uniforms, and deliver back within 24 hours. No harsh chemicals. Consistent quality your guests will notice. Serving hotels across NYC and New Jersey.",
    introParagraph:
      "Your guests judge your hotel by the feel of the sheets. We Deliver Laundry provides reliable, professional commercial laundry service for hotels across New York City and New Jersey — from boutique properties to multi-floor operations. We pick up your linens, towels, robes, and staff uniforms, wash everything without harsh chemicals, and deliver back the next day perfectly folded and ready for your next guest. Flexible weekly plans starting at $1.95/lb.",
    painPoints: [
      "Guest-ready linens returned in 24 hours",
      "No harsh chemicals — gentle on fabric, tough on stains",
      "Dedicated account management for consistent, reliable service",
    ],
    localFAQ_question: "Can you handle large linen volumes for a hotel on a weekly schedule?",
    localFAQ_answer:
      "Yes — we offer weekly recurring pickup schedules for hotels of all sizes across NYC and New Jersey. We manage linens, towels, robes, and uniforms. Contact us at start@wedeliverlaundry.com or call 855.968.5511 to set up your commercial account.",
    reviewQuote:
      "We run a boutique hotel in Midtown and WDL has been our laundry partner for six months. Pickup Tuesday, back Wednesday, always immaculate. Our guests have noticed the difference.",
    reviewAuthor: "GM, Boutique Hotel — Midtown Manhattan",
    pricingCTA:
      "Custom commercial pricing available. Weekly plans from $1.95/lb. Free pickup. Call 855.968.5511 or email start@wedeliverlaundry.com.",
    finalHeadline: "Your Guests Deserve Better Linens.",
    finalSub:
      "Let us handle the laundry so your team can focus on the guest experience. Schedule your first commercial pickup today.",
    serviceArea: "NYC + All NJ Counties (Bergen, Essex, Hudson, Morris, Union, Passaic)",
  },

  "commercial-laundry-airbnb": {
    slug: "commercial-laundry-airbnb",
    vertical: "Airbnb & Short-Term Rentals",
    metaTitle: "Laundry Service for Airbnb Hosts in NYC & NJ | We Deliver Laundry",
    metaDescription:
      "Laundry pickup and delivery for Airbnb hosts in NYC and New Jersey. Fresh linens and towels returned in 24 hours between guest stays. Starting at $1.95/lb. Free pickup.",
    h1: "Airbnb Hosts — Fresh Linens Between Every Guest.",
    heroSubtitle:
      "We pick up after checkout, professionally wash everything, and deliver back guest-ready in 24 hours. So your next 5-star review is already in the bag.",
    introParagraph:
      "Every Airbnb host knows the pressure of the turnaround — checkout at 11, check-in at 3, and a pile of laundry sitting in between. We Deliver Laundry solves that completely. We pick up linens, towels, and anything else that needs washing after each stay, clean everything without harsh chemicals, and deliver it back the next day fresh, folded, and guest-ready. Serving Airbnb hosts across NYC and New Jersey. Weekly plan from $1.95/lb.",
    painPoints: [
      "24-hour turnaround between guest checkouts and check-ins",
      "No harsh chemicals — gentle on your linens, better for your guests",
      "Weekly recurring pickup keeps your calendar stress-free",
    ],
    localFAQ_question: "Can I set up recurring laundry pickup after each guest checkout?",
    localFAQ_answer:
      "Yes — we work with Airbnb hosts across NYC and New Jersey on flexible schedules. Whether you have one listing or ten, we can set up pickup after each checkout and deliver back before your next check-in. Contact us to set up your host account: start@wedeliverlaundry.com.",
    reviewQuote:
      "I manage four Airbnb listings in Brooklyn and Jersey City. WDL handles all the laundry between stays. Pickup same day as checkout, everything back next morning. Reviews went up instantly.",
    reviewAuthor: "Airbnb Superhost — Brooklyn & Jersey City",
    pricingCTA:
      "Flexible pricing for hosts. Weekly plans from $1.95/lb. Free pickup every time. Call 855.968.5511.",
    finalHeadline: "5-Star Linens. Every Stay.",
    finalSub:
      "Schedule your first Airbnb laundry pickup. Clean, folded, and back before your next guest arrives.",
    serviceArea: "NYC + All NJ Counties (Bergen, Essex, Hudson, Morris, Union, Passaic)",
  },

  "commercial-laundry-gyms": {
    slug: "commercial-laundry-gyms",
    vertical: "Gyms & Fitness Studios",
    metaTitle: "Commercial Laundry for Gyms & Fitness Studios in NYC & NJ | We Deliver Laundry",
    metaDescription:
      "Laundry pickup and delivery for gyms and fitness studios in NYC and New Jersey. Towels, uniforms, and workout gear washed in 24 hours. No harsh chemicals. Get a quote.",
    h1: "Gym Laundry That Keeps Up With Your Members.",
    heroSubtitle:
      "We pick up your towels, workout gear, and staff uniforms — wash everything without harsh chemicals — and deliver back in 24 hours. So your gym always smells as good as it looks.",
    introParagraph:
      "A gym that smells fresh keeps members coming back. We Deliver Laundry provides commercial laundry service for gyms, fitness studios, yoga studios, and boxing gyms across New York City and New Jersey. We pick up your towels, uniforms, and equipment covers, wash everything without harsh chemicals, and deliver back the next day clean and folded. Consistent quality, flexible scheduling, and pricing that makes sense for your volume. Starting at $1.95/lb on the weekly plan.",
    painPoints: [
      "Fresh towels and uniforms returned in 24 hours",
      "No harsh chemicals — better for your members' skin and your fabric life",
      "Consistent weekly schedule keeps your supply chain simple",
    ],
    localFAQ_question: "Do you handle high-volume towel laundry for gyms on a daily or weekly basis?",
    localFAQ_answer:
      "Yes — we work with gyms and fitness studios across NYC and New Jersey on recurring weekly schedules. High-volume towel programs available. Contact us at start@wedeliverlaundry.com or 855.968.5511 to get a custom quote.",
    reviewQuote:
      "Our CrossFit box goes through hundreds of hand towels a week. WDL picks up Monday and Wednesday and everything is back the next day. Our coaches love it and our members notice.",
    reviewAuthor: "Owner, CrossFit Gym — Jersey City, NJ",
    pricingCTA:
      "Volume pricing available for gyms. Weekly plans from $1.95/lb. Free pickup. Email start@wedeliverlaundry.com for a custom quote.",
    finalHeadline: "Fresh Gym. Happy Members.",
    finalSub:
      "Let us handle the laundry. Schedule your first commercial pickup and keep your gym smelling great.",
    serviceArea: "NYC + All NJ Counties (Bergen, Essex, Hudson, Morris, Union, Passaic)",
  },

  "commercial-laundry-salons-spas": {
    slug: "commercial-laundry-salons-spas",
    vertical: "Salons & Spas",
    metaTitle: "Commercial Laundry for Salons & Spas in NYC & NJ | We Deliver Laundry",
    metaDescription:
      "Laundry pickup and delivery for salons and spas in NYC and New Jersey. Towels, robes, and linens washed without harsh chemicals and returned in 24 hours. Get a quote.",
    h1: "Salon & Spa Laundry — As Premium As Your Service.",
    heroSubtitle:
      "We pick up your towels, robes, and linens — wash without harsh chemicals — and deliver back in 24 hours. Because your clients deserve the softest towels in the city.",
    introParagraph:
      "The details matter in a salon or spa — and nothing communicates quality like a fresh, fluffy towel or a perfectly clean robe. We Deliver Laundry handles commercial laundry for salons, spas, nail studios, and wellness centers across New York City and New Jersey. We pick up your towels, robes, draping linens, and uniforms, wash everything without harsh chemicals, and deliver back the next day immaculate. Your clients will feel the difference. Starting at $1.95/lb on the weekly plan.",
    painPoints: [
      "Towels and robes returned soft, fresh, and guest-ready in 24 hours",
      "No harsh chemicals — essential for sensitive skin and premium fabric care",
      "Reliable weekly schedule so you're never running low",
    ],
    localFAQ_question: "Do you use gentle detergents safe for spa-quality towels and robes?",
    localFAQ_answer:
      "Yes — we never use harsh chemicals on any laundry, which makes us especially well-suited for salons and spas. We protect fabric quality and keep everything soft. Contact us to set up your salon or spa account: start@wedeliverlaundry.com or 855.968.5511.",
    reviewQuote:
      "We run a med spa in Hoboken and towel quality is everything. WDL has been incredible — picks up twice a week, no harsh chemicals, everything comes back incredibly soft. Our clients notice.",
    reviewAuthor: "Owner, Med Spa — Hoboken, NJ",
    pricingCTA:
      "Salon & spa pricing available. Weekly plans from $1.95/lb. No harsh chemicals. Free pickup. Email start@wedeliverlaundry.com.",
    finalHeadline: "Premium Service Deserves Premium Laundry.",
    finalSub:
      "Schedule your first salon or spa pickup. Fresh towels, clean robes, delivered in 24 hours.",
    serviceArea: "NYC + All NJ Counties (Bergen, Essex, Hudson, Morris, Union, Passaic)",
  },

  "commercial-laundry-restaurants": {
    slug: "commercial-laundry-restaurants",
    vertical: "Restaurants & Food Service",
    metaTitle: "Commercial Laundry for Restaurants in NYC & NJ | We Deliver Laundry",
    metaDescription:
      "Laundry pickup and delivery for restaurants in NYC and New Jersey. Linens, aprons, uniforms, and tablecloths returned in 24 hours. Starting at $1.95/lb. Get a quote.",
    h1: "Restaurant Laundry. Done. Every 24 Hours.",
    heroSubtitle:
      "Aprons, linens, tablecloths, staff uniforms — we pick up, wash without harsh chemicals, and deliver back the next day. So your front of house always looks the part.",
    introParagraph:
      "A restaurant's presentation starts with clean linens and sharp uniforms — and keeping up with that volume is a full-time job. We Deliver Laundry handles commercial laundry for restaurants, cafés, catering operations, and food service businesses across New York City and New Jersey. We pick up aprons, tablecloths, napkins, dish towels, and staff uniforms, wash everything without harsh chemicals, and deliver back the next day ready for service. Flexible weekly plans starting at $1.95/lb.",
    painPoints: [
      "Tablecloths, napkins, and uniforms returned crisp and clean in 24 hours",
      "Reliable weekly pickup keeps your front and back of house stocked",
      "No harsh chemicals — better for fabric longevity and staff comfort",
    ],
    localFAQ_question: "Can you handle mixed loads — tablecloths, aprons, uniforms, and kitchen towels?",
    localFAQ_answer:
      "Yes — we handle all restaurant laundry in one pickup including tablecloths, napkins, aprons, staff uniforms, and kitchen towels. We serve restaurants across NYC and all NJ counties. Email start@wedeliverlaundry.com or call 855.968.5511 to set up your account.",
    reviewQuote:
      "We have a 60-seat restaurant in the West Village and laundry used to be a daily headache. WDL picks up three times a week and everything comes back clean and pressed. Huge relief.",
    reviewAuthor: "Owner, West Village Restaurant — Manhattan",
    pricingCTA:
      "Restaurant volume pricing available. Weekly plans from $1.95/lb. Free pickup. Call 855.968.5511 for a custom quote.",
    finalHeadline: "Clean Linens. Every Service.",
    finalSub:
      "Schedule your first restaurant laundry pickup. We'll handle the washing while you handle the food.",
    serviceArea: "NYC + All NJ Counties (Bergen, Essex, Hudson, Morris, Union, Passaic)",
  },

  "commercial-laundry-medical": {
    slug: "commercial-laundry-medical",
    vertical: "Medical & Healthcare",
    metaTitle: "Commercial Laundry for Medical Offices in NYC & NJ | We Deliver Laundry",
    metaDescription:
      "Professional laundry pickup and delivery for medical offices, clinics, and healthcare facilities in NYC and New Jersey. Scrubs, linens, and uniforms returned in 24 hours.",
    h1: "Medical Office Laundry — Reliable, Professional, On Time.",
    heroSubtitle:
      "We pick up scrubs, patient gowns, medical linens, and staff uniforms — wash with care — and deliver back in 24 hours. Clean, professional, and always on schedule.",
    introParagraph:
      "Medical offices and healthcare facilities require laundry service they can count on — consistent, professional, and on time. We Deliver Laundry provides commercial laundry pickup and delivery for medical offices, dental practices, chiropractic offices, physical therapy studios, and healthcare facilities across New York City and New Jersey. We pick up scrubs, lab coats, patient gowns, and medical linens, handle everything with care, and deliver back the next day. Reliable weekly schedules, no harsh chemicals, and consistent quality every time. Starting at $1.95/lb.",
    painPoints: [
      "Scrubs and medical linens returned clean and professional in 24 hours",
      "Consistent weekly schedule — never run short before a busy clinic day",
      "No harsh chemicals — gentle on fabric, gentle on your team",
    ],
    localFAQ_question: "Do you serve medical offices and healthcare facilities in NYC and New Jersey?",
    localFAQ_answer:
      "Yes — we serve medical offices, clinics, dental practices, physical therapy studios, and healthcare facilities across all of NYC and New Jersey. We handle scrubs, lab coats, patient gowns, and medical linens on a reliable weekly schedule. Contact us at start@wedeliverlaundry.com or 855.968.5511.",
    reviewQuote:
      "Our physical therapy practice in Montclair goes through a lot of linens. WDL set us up with a twice-weekly pickup and we haven't thought about laundry since. Exactly what we needed.",
    reviewAuthor: "Practice Manager, PT Clinic — Montclair, NJ",
    pricingCTA:
      "Healthcare facility pricing available. Reliable weekly schedules. From $1.95/lb. Email start@wedeliverlaundry.com.",
    finalHeadline: "Your Practice Runs Better With Clean Linens.",
    finalSub:
      "Schedule your first medical laundry pickup. Consistent, professional, and back in 24 hours.",
    serviceArea: "NYC + All NJ Counties (Bergen, Essex, Hudson, Morris, Union, Passaic)",
  },

  "commercial-laundry-childcare": {
    slug: "commercial-laundry-childcare",
    vertical: "Childcare & Schools",
    metaTitle: "Commercial Laundry for Daycares & Schools in NYC & NJ | We Deliver Laundry",
    metaDescription:
      "Laundry pickup and delivery for daycares, preschools, and schools in NYC and New Jersey. Nap mats, bibs, uniforms, and linens returned in 24 hours. Free pickup. Get a quote.",
    h1: "Childcare Laundry. Clean, Safe, On Time.",
    heroSubtitle:
      "We pick up nap mats, bibs, uniforms, and linens from your daycare or school — wash without harsh chemicals — and deliver back in 24 hours. Safe for kids. Easy for you.",
    introParagraph:
      "Childcare facilities go through more laundry than almost any other business — and the parents and kids in your care deserve the cleanest, safest environment possible. We Deliver Laundry provides commercial laundry service for daycares, preschools, after-school programs, and schools across New York City and New Jersey. We pick up nap mats, bibs, smocks, uniforms, and soft furnishings, wash everything without harsh chemicals, and deliver back the next day. No chemicals that could irritate young children. Just clean, safe, professionally handled laundry. Starting at $1.95/lb.",
    painPoints: [
      "Nap mats, bibs, and uniforms returned clean and safe in 24 hours",
      "No harsh chemicals — safe for children's sensitive skin",
      "Reliable weekly pickup keeps your facility consistently stocked",
    ],
    localFAQ_question: "Do you use child-safe, chemical-free detergents for daycare laundry?",
    localFAQ_answer:
      "Yes — we never use harsh chemicals on any laundry, making us especially well-suited for childcare facilities. We serve daycares, preschools, and schools across NYC and all NJ counties. Contact us at start@wedeliverlaundry.com or 855.968.5511 to set up your account.",
    reviewQuote:
      "We run a daycare in Teaneck with 40 kids. The laundry volume was overwhelming our staff. WDL picks up Monday and everything is back Tuesday. Parents love that we use gentle detergents.",
    reviewAuthor: "Director, Daycare Center — Teaneck, NJ",
    pricingCTA:
      "Childcare facility pricing available. No harsh chemicals. Weekly plans from $1.95/lb. Free pickup. Call 855.968.5511.",
    finalHeadline: "Cleaner Facility. Happier Kids.",
    finalSub:
      "Schedule your first childcare laundry pickup. Safe for kids, easy for you, back in 24 hours.",
    serviceArea: "NYC + All NJ Counties (Bergen, Essex, Hudson, Morris, Union, Passaic)",
  },

  "commercial-laundry-corporate": {
    slug: "commercial-laundry-corporate",
    vertical: "Corporate Offices",
    metaTitle: "Corporate Laundry Service in NYC & NJ | We Deliver Laundry",
    metaDescription:
      "Commercial laundry pickup and delivery for corporate offices in NYC and New Jersey. Uniforms, branded apparel, and employee laundry perks. Starting at $1.95/lb. Get a quote.",
    h1: "Corporate Laundry Perks. A Benefit Your Team Will Actually Use.",
    heroSubtitle:
      "Offer your employees a laundry pickup and delivery benefit at the office. We handle uniforms, branded apparel, and team laundry — picked up and delivered back in 24 hours.",
    introParagraph:
      "Forward-thinking companies in New York City and New Jersey are adding We Deliver Laundry to their employee benefits package — and the response is overwhelmingly positive. Whether it's branded uniforms, corporate apparel, or a laundry pickup benefit for your team, we handle everything professionally. We pick up from your office or building, wash without harsh chemicals, and deliver back the next day. A benefit that actually saves your employees hours every week. Starting at $1.95/lb on the weekly plan.",
    painPoints: [
      "Employee laundry benefit that gets used and appreciated every week",
      "Branded apparel and uniforms handled with professional care",
      "Flexible billing — invoice per team, per location, or per employee",
    ],
    localFAQ_question: "Can you set up a corporate laundry benefit for employees in our NYC or NJ office?",
    localFAQ_answer:
      "Yes — we work with companies across NYC and New Jersey to set up employee laundry pickup programs and handle corporate uniforms and branded apparel. Contact us at start@wedeliverlaundry.com or call 855.968.5511 to discuss your corporate account options.",
    reviewQuote:
      "We added WDL as an employee perk at our Hudson Yards office. Pickup every Friday, uniforms back Monday. The team loves it. It's become one of our most talked-about benefits.",
    reviewAuthor: "Head of People Operations, Corporate Office — Hudson Yards, NYC",
    pricingCTA:
      "Corporate account pricing available. Flexible billing options. Weekly plans from $1.95/lb. Email start@wedeliverlaundry.com for a proposal.",
    finalHeadline: "The Benefit Your Team Will Actually Use.",
    finalSub:
      "Schedule a corporate laundry consultation. Uniforms, perks, and branded apparel — handled professionally, back in 24 hours.",
    serviceArea: "NYC + All NJ Counties (Bergen, Essex, Hudson, Morris, Union, Passaic)",
  },
}

export function getCommercialPage(slug: string): CommercialPage | null {
  return commercialPages[slug] ?? null
}

export function getAllCommercialSlugs(): { slug: string }[] {
  return Object.keys(commercialPages).map((slug) => ({ slug }))
}
