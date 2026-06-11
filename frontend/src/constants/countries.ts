// Mirrors app/services/constants.py — kept here as a fallback in case /meta
// hasn't loaded yet so the dropdown is never empty.
export interface CountryOption {
  code: string;
  name: string;
}

export const FALLBACK_COUNTRIES: CountryOption[] = [
  { code: "us", name: "United States" },
  { code: "gb", name: "United Kingdom" },
  { code: "ca", name: "Canada" },
  { code: "au", name: "Australia" },
  { code: "in", name: "India" },
  { code: "pk", name: "Pakistan" },
  { code: "bd", name: "Bangladesh" },
  { code: "ir", name: "Iran" },
  { code: "sa", name: "Saudi Arabia" },
  { code: "ae", name: "United Arab Emirates" },
  { code: "cn", name: "China" },
  { code: "jp", name: "Japan" },
  { code: "kr", name: "South Korea" },
  { code: "de", name: "Germany" },
  { code: "fr", name: "France" },
  { code: "it", name: "Italy" },
  { code: "es", name: "Spain" },
  { code: "ru", name: "Russia" },
  { code: "tr", name: "Turkey" },
  { code: "br", name: "Brazil" },
  { code: "mx", name: "Mexico" },
  { code: "za", name: "South Africa" },
  { code: "eg", name: "Egypt" },
  { code: "ng", name: "Nigeria" },
  { code: "id", name: "Indonesia" },
  { code: "sg", name: "Singapore" },
  { code: "nl", name: "Netherlands" },
  { code: "se", name: "Sweden" },
];

export const FALLBACK_CATEGORIES: string[] = [
  "World",
  "Technology",
  "Business",
  "Sports",
  "Entertainment",
  "Science",
  "Health",
  "Politics",
];
