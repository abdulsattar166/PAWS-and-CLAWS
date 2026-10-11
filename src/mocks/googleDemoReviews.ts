// Temporary DEMO reviews used only to preview the Google reviews section design
// while the live Google Business Profile integration is being set up.
//
// These are NOT genuine Google reviews and must never be presented as such:
// every entry is clearly labelled "Demo review" on the website, and the whole
// set can be removed in one click from the Admin Panel
// (Google Reviews → "Remove all demo reviews"). As soon as genuine reviews are
// returned by the Google integration, these entries are ignored automatically.

export interface GoogleDemoReview {
  authorName: string;
  rating: number;
  text: string;
  relativeTime: string;
}

export const googleDemoReviews: GoogleDemoReview[] = [
  {
    authorName: "Aisha M.",
    rating: 5,
    text: "The mobile van turned up right on time and my golden retriever came back looking absolutely gorgeous. Zero stress for both of us.",
    relativeTime: "a week ago",
  },
  {
    authorName: "Daniel R.",
    rating: 5,
    text: "My Persian cat is usually terrified of grooming, but the team was so patient and gentle. She stayed calm the whole time.",
    relativeTime: "2 weeks ago",
  },
  {
    authorName: "Fatima A.",
    rating: 5,
    text: "Booked a full groom for my poodle and the cut was perfect. You can tell they genuinely care about the animals.",
    relativeTime: "2 weeks ago",
  },
  {
    authorName: "Sara K.",
    rating: 5,
    text: "Loved that it comes right to my door. No carrier, no car ride, no waiting room. My beagle was so relaxed afterwards.",
    relativeTime: "3 weeks ago",
  },
  {
    authorName: "Omar H.",
    rating: 5,
    text: "Friendly, professional and great with nervous pets. The deep clean left my husky's coat so soft and shiny.",
    relativeTime: "3 weeks ago",
  },
  {
    authorName: "Leila N.",
    rating: 5,
    text: "First time using a mobile groomer and I'm completely converted. Easy booking, clear pricing and a lovely result.",
    relativeTime: "a month ago",
  },
  {
    authorName: "James W.",
    rating: 5,
    text: "They handled my senior cat with such care and patience. Explained everything and even gave a little health check.",
    relativeTime: "a month ago",
  },
  {
    authorName: "Mariam S.",
    rating: 5,
    text: "Brilliant service from start to finish. Both of my dogs look amazing and smell wonderful.",
    relativeTime: "a month ago",
  },
  {
    authorName: "Hassan T.",
    rating: 5,
    text: "Very punctual and tidy, and they cleaned up after themselves. My maltese looks like a little teddy bear now.",
    relativeTime: "a month ago",
  },
  {
    authorName: "Noura B.",
    rating: 5,
    text: "The team is so gentle with my anxious rescue dog. He actually seemed happy when they had finished.",
    relativeTime: "2 months ago",
  },
  {
    authorName: "Ahmed F.",
    rating: 4,
    text: "Great value for a full groom at home and the breed cut was exactly what I asked for.",
    relativeTime: "2 months ago",
  },
  {
    authorName: "Priya D.",
    rating: 5,
    text: "Reliable, kind and clearly love what they do. My rabbit's coat has never looked better.",
    relativeTime: "2 months ago",
  },
];