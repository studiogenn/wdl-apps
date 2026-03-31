export type Location = {
  readonly name: string;
  readonly slug: string;
  readonly state: string;
  readonly neighborhoods: readonly string[];
  readonly coordinates: readonly [lng: number, lat: number];
};

export const LOCATIONS: readonly Location[] = [
  {
    name: "Manhattan",
    slug: "manhattan",
    state: "NY",
    coordinates: [-73.9712, 40.7831],
    neighborhoods: [
      "Battery Park City", "Chelsea", "East Harlem", "East Village",
      "Financial District", "Inwood", "Washington Heights",
      "Lower East Side", "Midtown East", "Midtown West",
      "Murray Hill", "Tribeca", "Upper East Side", "Upper West Side", "West Village",
    ],
  },
  {
    name: "Queens",
    slug: "queens",
    state: "NY",
    coordinates: [-73.7949, 40.7282],
    neighborhoods: ["Jamaica", "Ozone Park", "Richmond Hills", "Far Rockaway"],
  },
  {
    name: "Long Island",
    slug: "long-island",
    state: "NY",
    coordinates: [-73.5594, 40.7142],
    neighborhoods: [
      "Bellerose", "East Meadow", "Elmont", "Freeport", "Garden City",
      "Hempstead", "Levittown", "Long Beach", "Oceanside", "Valley Stream",
    ],
  },
  {
    name: "Hudson County",
    slug: "hudson-county",
    state: "NJ",
    coordinates: [-74.0776, 40.7328],
    neighborhoods: [
      "Bayonne", "Harrison", "Hoboken", "Jersey City", "Kearny",
      "North Bergen", "Secaucus", "Union City", "Weehawken", "West New York",
    ],
  },
  {
    name: "Bergen County",
    slug: "bergen-county",
    state: "NJ",
    coordinates: [-74.0776, 40.9557],
    neighborhoods: [
      "Dumont", "Englewood", "Fair Lawn", "Fort Lee", "Hackensack",
      "Oakland", "Paramus", "Ridgewood", "River Vale", "Rochelle Park", "Teaneck", "Westwood",
    ],
  },
  {
    name: "Essex County",
    slug: "essex-county",
    state: "NJ",
    coordinates: [-74.2107, 40.7870],
    neighborhoods: ["Bloomfield", "Clifton", "East Orange", "Livingston", "Montclair"],
  },
  {
    name: "Morris County",
    slug: "morris-county",
    state: "NJ",
    coordinates: [-74.4815, 40.7968],
    neighborhoods: [
      "Cedar Knolls", "Chatham", "Chester", "Madison",
      "Morris Plains", "Morristown", "Parsippany-Troy Hills",
    ],
  },
  {
    name: "Union County",
    slug: "union-county",
    state: "NJ",
    coordinates: [-74.3084, 40.6598],
    neighborhoods: ["Elizabeth", "Plainfield", "Westfield"],
  },
  {
    name: "Passaic County",
    slug: "passaic-county",
    state: "NJ",
    coordinates: [-74.1724, 40.9168],
    neighborhoods: ["Paterson"],
  },
  {
    name: "Middlesex County",
    slug: "middlesex-county",
    state: "NJ",
    coordinates: [-74.4057, 40.4396],
    neighborhoods: ["Avenel"],
  },
] as const;

export function getLocationBySlug(slug: string): Location | undefined {
  return LOCATIONS.find((loc) => loc.slug === slug);
}
