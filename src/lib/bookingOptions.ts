// Shared booking configuration: pet types, sizes and address fields.
// Kept in one place so the form, the service filter and the summary stay in sync.

export interface PetTypeOption {
  value: string;
  label: string;
  icon: string;
}

export interface PetSizeOption {
  value: string;
  label: string;
}

export const PET_TYPES: PetTypeOption[] = [
  { value: "dog", label: "Dog", icon: "ri-footprint-line" },
  { value: "cat", label: "Cat", icon: "ri-emotion-happy-line" },
  { value: "bird", label: "Bird", icon: "ri-flight-takeoff-line" },
  { value: "rabbit", label: "Rabbit", icon: "ri-heart-line" },
  { value: "other", label: "Other Animals", icon: "ri-bear-smile-line" },
];

export const PET_TYPE_LABELS: Record<string, string> = PET_TYPES.reduce(
  (acc, type) => ({ ...acc, [type.value]: type.label }),
  {} as Record<string, string>,
);

// Only dogs carry a size dimension (cats are always "S & Cat").
export const PET_SIZES: PetSizeOption[] = [
  { value: "small", label: "Small (9–13 kg)" },
  { value: "medium", label: "Medium (13–22 kg)" },
  { value: "large", label: "Large (22–40 kg)" },
  { value: "xl", label: "XL (40 kg and up)" },
];

export const PET_SIZE_LABELS: Record<string, string> = PET_SIZES.reduce(
  (acc, size) => ({ ...acc, [size.value]: size.label }),
  {} as Record<string, string>,
);

// Suggested breeds per pet type — shown as a datalist so customers can pick
// their breed quickly or type their own if it isn't listed.
export const PET_BREEDS: Record<string, string[]> = {
  dog: [
    "Labrador Retriever",
    "Golden Retriever",
    "German Shepherd",
    "French Bulldog",
    "Poodle",
    "Beagle",
    "Rottweiler",
    "Shih Tzu",
    "Yorkshire Terrier",
    "Pomeranian",
    "Siberian Husky",
    "Mixed Breed",
    "Other",
  ],
  cat: [
    "Persian",
    "Siamese",
    "Maine Coon",
    "British Shorthair",
    "Bengal",
    "Scottish Fold",
    "Ragdoll",
    "Domestic Shorthair",
    "Mixed Breed",
    "Other",
  ],
};

export interface AddressFields {
  house_number: string;
  street_number: string;
  street_name: string;
  area: string;
  city: string;
  province: string;
  country: string;
  postal_code: string;
  landmark: string;
}

export const EMPTY_ADDRESS: AddressFields = {
  house_number: "",
  street_number: "",
  street_name: "",
  area: "",
  city: "",
  province: "",
  country: "United Arab Emirates",
  postal_code: "",
  landmark: "",
};

// Live GPS location the customer optionally shares (with permission only).
export interface LocationInfo {
  lat: number | null;
  lng: number | null;
  sharedAt: string | null;
}

export const EMPTY_LOCATION: LocationInfo = {
  lat: null,
  lng: null,
  sharedAt: null,
};

/** True when the customer actually shared usable coordinates. */
export function hasLocation(loc: LocationInfo): boolean {
  return (
    loc.lat != null &&
    loc.lng != null &&
    Number.isFinite(loc.lat) &&
    Number.isFinite(loc.lng)
  );
}

/** Google Maps deep link / embed URL for a pair of coordinates. */
export function mapsLink(lat: number, lng: number): string {
  return `https://www.google.com/maps?q=${lat},${lng}`;
}

export function mapsEmbedSrc(lat: number, lng: number): string {
  return `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`;
}

// Fields the customer MUST fill so the grooming team can physically reach them.
export const REQUIRED_ADDRESS_KEYS: (keyof AddressFields)[] = [
  "house_number",
  "street_number",
  "street_name",
  "area",
  "city",
  "province",
  "country",
];

/** Compose a single-line address for emails, receipts and the DB summary column. */
export function formatAddress(addr: AddressFields): string {
  const line1 = [addr.house_number, addr.street_number, addr.street_name].filter(Boolean).join(" ");
  const parts = [
    line1,
    addr.area,
    addr.city,
    addr.province,
    addr.country,
    addr.postal_code,
  ].filter(Boolean);
  const base = parts.join(", ");
  return addr.landmark ? `${base} (Landmark: ${addr.landmark})` : base;
}