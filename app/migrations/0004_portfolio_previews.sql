ALTER TABLE portfolio_projects ADD COLUMN gallery_json TEXT NOT NULL DEFAULT '[]';
ALTER TABLE portfolio_projects ADD COLUMN desktop_preview TEXT;
ALTER TABLE portfolio_projects ADD COLUMN mobile_preview TEXT;
