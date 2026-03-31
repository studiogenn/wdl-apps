import { LOCATIONS, type Location } from "@/content/locations/index";

export type GeoData = {
  readonly city: string;
  readonly region: string;
  readonly country: string;
};

export type ResolvedLocation = {
  readonly location: Location;
  readonly matchType: "city" | "neighborhood" | "region";
};

const CITY_TO_LOCATION: ReadonlyMap<string, string> = new Map([
  ["new york", "manhattan"],
  ["manhattan", "manhattan"],
  ["queens", "queens"],
  ["jamaica", "queens"],
  ["ozone park", "queens"],
  ["richmond hill", "queens"],
  ["far rockaway", "queens"],
  ["jersey city", "hudson-county"],
  ["hoboken", "hudson-county"],
  ["bayonne", "hudson-county"],
  ["union city", "hudson-county"],
  ["weehawken", "hudson-county"],
  ["west new york", "hudson-county"],
  ["north bergen", "hudson-county"],
  ["secaucus", "hudson-county"],
  ["harrison", "hudson-county"],
  ["kearny", "hudson-county"],
  ["fort lee", "bergen-county"],
  ["hackensack", "bergen-county"],
  ["paramus", "bergen-county"],
  ["teaneck", "bergen-county"],
  ["englewood", "bergen-county"],
  ["fair lawn", "bergen-county"],
  ["ridgewood", "bergen-county"],
  ["dumont", "bergen-county"],
  ["oakland", "bergen-county"],
  ["river vale", "bergen-county"],
  ["rochelle park", "bergen-county"],
  ["westwood", "bergen-county"],
  ["montclair", "essex-county"],
  ["bloomfield", "essex-county"],
  ["clifton", "essex-county"],
  ["east orange", "essex-county"],
  ["livingston", "essex-county"],
  ["morristown", "morris-county"],
  ["parsippany", "morris-county"],
  ["madison", "morris-county"],
  ["chatham", "morris-county"],
  ["chester", "morris-county"],
  ["cedar knolls", "morris-county"],
  ["morris plains", "morris-county"],
  ["elizabeth", "union-county"],
  ["plainfield", "union-county"],
  ["westfield", "union-county"],
  ["paterson", "passaic-county"],
  ["avenel", "middlesex-county"],
  ["hempstead", "long-island"],
  ["garden city", "long-island"],
  ["freeport", "long-island"],
  ["long beach", "long-island"],
  ["valley stream", "long-island"],
  ["levittown", "long-island"],
  ["elmont", "long-island"],
  ["east meadow", "long-island"],
  ["oceanside", "long-island"],
  ["bellerose", "long-island"],
]);

const REGION_STATE_MAP: ReadonlyMap<string, string> = new Map([
  ["NY", "NY"],
  ["NJ", "NJ"],
]);

export function resolveLocation(
  city: string,
  region: string,
  country: string
): ResolvedLocation | null {
  if (country.toUpperCase() !== "US") return null;

  const normalizedCity = city.toLowerCase().trim();

  const slugByCity = CITY_TO_LOCATION.get(normalizedCity);
  if (slugByCity) {
    const location = LOCATIONS.find((loc) => loc.slug === slugByCity);
    if (location) return { location, matchType: "city" };
  }

  for (const location of LOCATIONS) {
    const match = location.neighborhoods.find(
      (n) => n.toLowerCase() === normalizedCity
    );
    if (match) return { location, matchType: "neighborhood" };
  }

  const normalizedRegion = region.toUpperCase().trim();
  const state = REGION_STATE_MAP.get(normalizedRegion);
  if (state) {
    const location = LOCATIONS.find((loc) => loc.state === state);
    if (location) return { location, matchType: "region" };
  }

  return null;
}
