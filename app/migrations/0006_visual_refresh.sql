UPDATE portfolio_projects SET cover_image = '/assets/portfolio/salon-human.webp' WHERE slug = 'salon-braiding-barbering';
UPDATE portfolio_projects SET cover_image = '/assets/portfolio/cleaning-human.webp' WHERE slug = 'professional-cleaning';
UPDATE portfolio_projects SET cover_image = '/assets/portfolio/nails-human.webp' WHERE slug = 'luxury-nail-studio';
UPDATE portfolio_projects SET cover_image = '/assets/portfolio/forme-human.webp' WHERE slug = 'beauty-grooming-studio';
UPDATE brand_assets SET asset_url = '/assets/brand/adversix-symbol.png', updated_at = datetime('now') WHERE asset_key = 'favicon';
