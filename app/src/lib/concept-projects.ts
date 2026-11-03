export type ConceptProject = {
  slug: string; title: string; brand: string; category: string; description: string;
  image: string; detailImage: string; accent: string; services: string[]; features: string[]; technologies: string[];
  direction: string; headline: string; subline: string;
};

export const conceptProjects: ConceptProject[] = [
  {
    slug: "salon-braiding-barbering", title: "Hair, Braiding & Barbering", brand: "HOUSE OF MANE", category: "Beauty & Grooming",
    description: "A warm editorial salon and barbershop experience bringing protective styling, precision cuts and personal service together.",
    image: "/assets/portfolio/salon-human.webp", detailImage: "/assets/portfolio/salon-human.webp", accent: "#b77b53", services: ["Knotless braids", "Locs & protective styling", "Precision cuts", "Beard grooming", "Silk press & treatments", "Colour & styling"],
    features: ["Service and price selection", "Stylist and barber profiles", "Appointment time selection", "Before-and-after gallery", "Responsive booking flow"], technologies: ["React", "Responsive design", "Interactive booking UI"],
    direction: "Warm editorial luxury", headline: "Your style.\nYour signature.", subline: "Thoughtful hair, considered grooming and a little time that is entirely yours."
  },
  {
    slug: "professional-cleaning", title: "Professional Cleaning Co.", brand: "PURESPACE", category: "Professional Services",
    description: "A clear, confidence-building digital home for a premium residential and commercial cleaning team.",
    image: "/assets/portfolio/cleaning-human.webp", detailImage: "/assets/portfolio/cleaning-human.webp", accent: "#668b72", services: ["Home cleaning", "Office cleaning", "Deep cleaning", "Move-in / move-out", "Post-construction", "Recurring care"],
    features: ["Residential and commercial services", "Property-type selection", "Instant estimate calculator", "Quote request form", "Service area information"], technologies: ["React", "Interactive estimator", "Responsive design"],
    direction: "Fresh, spacious clarity", headline: "A clearer kind\nof clean.", subline: "A considered cleaning service for spaces that deserve to feel their best."
  },
  {
    slug: "luxury-nail-studio", title: "The Nail Atelier", brand: "ATELIER N°8", category: "Beauty & Lifestyle",
    description: "A fashion-led nail studio concept built around expressive nail art, considered treatments and a refined booking journey.",
    image: "/assets/portfolio/nails-human.webp", detailImage: "/assets/portfolio/nails-human.webp", accent: "#9a5961", services: ["Signature manicure", "Gel extensions", "Acrylic sculpting", "Nail art", "Luxury pedicure", "Repair & restoration"],
    features: ["Nail art gallery filters", "Treatment and pricing menu", "Technician selection", "Appointment time selection", "Design inspiration"], technologies: ["React", "Interactive gallery", "Responsive design"],
    direction: "Fashion-led beauty editorial", headline: "The art of\nthe detail.", subline: "A little expression at your fingertips. Made slowly, finished beautifully."
  },
  {
    slug: "beauty-grooming-studio", title: "Forme Beauty House", brand: "FORME HOUSE", category: "Beauty & Wellness",
    description: "A multi-service beauty and grooming studio with an elegant experience that makes a broad service menu feel effortless.",
    image: "/assets/portfolio/forme-human.webp", detailImage: "/assets/portfolio/forme-human.webp", accent: "#9b8866", services: ["Hair & styling", "Braiding", "Barbering", "Nail care", "Makeup", "Beauty treatments"],
    features: ["Multi-category service navigation", "Team profiles", "Curated work gallery", "Service-led booking", "Mobile-first layout"], technologies: ["React", "Responsive design", "Interactive navigation"],
    direction: "Contemporary multi-discipline luxury", headline: "A place for\nyour next chapter.", subline: "One considered space for the rituals, details and moments that make you feel like you."
  }
];

export function findConcept(slug: string) { return conceptProjects.find((project) => project.slug === slug); }
