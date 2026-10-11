// Central business + payment configuration shown to customers.
// Bank details and contact points live here so they are easy to change in one
// place. When the Admin Panel ships, these values will be served from an
// editable settings table instead of being hard-coded.

export interface BankDetails {
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  iban: string;
  swift: string;
  currency: string;
}

export const BANK_DETAILS: BankDetails = {
  bankName: "ADIB",
  accountHolder: "MUHAMMAD AHSAN",
  accountNumber: "28867164",
  iban: "AE760500000000028867164",
  swift: "ABDIAEADXXX",
  currency: "AED",
};

export const BUSINESS = {
  name: "Paws and Claws Pets Grooming Salon LLC",
  phone: "+971 55 703 3165",
  phoneHref: "tel:+971557033165",
  whatsapp: "+971 55 703 3165",
  // wa.me format: country code + number, no "+", no spaces.
  whatsappNumber: "971557033165",
  email: "Pawsandclawsauh@gmail.com",
};

// Official social profiles. Kept in one place so every surface stays in sync.
export const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/pawsandclaws.ad?utm_source=qr&stkn=MTZ2ZGMxMnIyd3htcg==",
  facebook: "https://www.facebook.com/share/1Bf4HuLpJX/",
  tiktok: "https://www.tiktok.com/@pawsandclaws.ad?_r=1&_t=ZS-9A1e1vg3fBV",
  snapchat: "https://www.snapchat.com/add/pawsandclaws.ad?share_id=f5ZgJGqmo4A&locale=en-AE",
};

/** Build a wa.me deep link with a pre-filled message. */
export function whatsappLink(message: string): string {
  return `https://wa.me/${BUSINESS.whatsappNumber}?text=${encodeURIComponent(message)}`;
}