CREATE TABLE IF NOT EXISTS portfolio_projects (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  services_json TEXT NOT NULL DEFAULT '[]',
  features_json TEXT NOT NULL DEFAULT '[]',
  technologies_json TEXT NOT NULL DEFAULT '[]',
  cover_image TEXT NOT NULL,
  preview_url TEXT,
  featured INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft','published','archived')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_portfolio_status_order ON portfolio_projects(status, sort_order, created_at DESC);
INSERT OR IGNORE INTO portfolio_projects (id,slug,title,category,description,services_json,features_json,technologies_json,cover_image,featured,sort_order,status) VALUES
('concept-salon','salon-braiding-barbering','Hair, Braiding & Barbering','Beauty & Grooming','A warm editorial salon and barbershop experience bringing protective styling, precision cuts and personal service together.','["UX strategy","Visual identity direction","Responsive web design","Booking experience"]','["Service and price selection","Stylist and barber profiles","Appointment time selection","Before-and-after gallery","Responsive booking flow"]','["React","Responsive design","Interactive booking UI"]','/assets/portfolio/salon-hero.webp',1,1,'published'),
('concept-cleaning','professional-cleaning','Professional Cleaning Co.','Professional Services','A clear, confidence-building digital home for a premium residential and commercial cleaning team.','["Conversion-focused UX","Service architecture","Responsive web design","Quote request experience"]','["Residential and commercial services","Property-type selection","Instant estimate calculator","Quote request form","Service area information"]','["React","Interactive estimator","Responsive design"]','/assets/portfolio/cleaning-hero.webp',1,2,'published'),
('concept-nails','luxury-nail-studio','The Nail Atelier','Beauty & Lifestyle','A fashion-led nail studio concept built around expressive nail art, considered treatments and a refined booking journey.','["Art direction","Editorial web design","Service presentation","Booking interface"]','["Nail art gallery filters","Treatment and pricing menu","Technician selection","Appointment time selection","Design inspiration"]','["React","Interactive gallery","Responsive design"]','/assets/portfolio/nails-hero.webp',1,3,'published'),
('concept-studio','beauty-grooming-studio','Forme Beauty House','Beauty & Wellness','A multi-service beauty and grooming studio with an elegant experience that makes a broad service menu feel effortless.','["Information architecture","Digital art direction","Responsive web design","Service discovery"]','["Multi-category service navigation","Team profiles","Curated work gallery","Service-led booking","Mobile-first layout"]','["React","Responsive design","Interactive navigation"]','/assets/portfolio/studio-hero.webp',1,4,'published');
