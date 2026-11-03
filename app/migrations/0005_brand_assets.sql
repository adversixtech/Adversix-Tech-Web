CREATE TABLE IF NOT EXISTS brand_assets (
  asset_key TEXT PRIMARY KEY,
  asset_url TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
INSERT OR IGNORE INTO brand_assets (asset_key,asset_url) VALUES
('logo_dark','/assets/brand/adversix-logo-dark.png'),
('logo_light','/assets/brand/adversix-logo-light.png'),
('symbol','/assets/brand/adversix-symbol.png'),
('favicon','/icon-512.png'),
('social_image','/assets/brand/adversix-social.png');
