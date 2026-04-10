-- ============================================================
-- BlushMap — Production Database Schema (PostgreSQL)
-- ============================================================
-- Run this on your production PostgreSQL database.
-- For development, the app uses SQLite via Drizzle ORM (see shared/schema.ts).
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ANALYSES
-- Core table: one row per skin analysis session
-- ============================================================
CREATE TABLE IF NOT EXISTS analyses (
    id                SERIAL PRIMARY KEY,
    session_id        TEXT        NOT NULL,
    capture_method    TEXT        NOT NULL DEFAULT 'upload', -- 'upload' | 'camera' | 'live-rgb'

    -- Image (stored as base64 data URL; move to S3 in production)
    image_data        TEXT,

    -- Skin profile (populated after AI analysis)
    skin_tone         TEXT,       -- fair | light | medium | tan | deep | rich
    undertone         TEXT,       -- cool | warm | neutral | olive
    skin_type         TEXT,       -- dry | oily | combination | normal | sensitive
    face_shape        TEXT,       -- oval | round | square | heart | oblong
    concerns          JSONB,      -- array of concern strings e.g. ["hyperpigmentation","dark-circles"]
    face_zones        JSONB,      -- zone-by-zone text analysis object
    rgb_analysis      JSONB,      -- { dominantTone, warmthLevel, luminosity }
    confidence        TEXT,       -- high | medium | low

    -- User preferences submitted at analysis time
    preferences       JSONB,      -- array of preference strings e.g. ["organic","spf"]

    -- Full AI outputs (raw JSON stored for auditability)
    analysis_result   JSONB,      -- full skin analysis response from Claude
    recommendations   JSONB,      -- full recommendations response incl. enriched products

    -- Metadata
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_analyses_session_id  ON analyses (session_id);
CREATE INDEX idx_analyses_created_at  ON analyses (created_at DESC);
CREATE INDEX idx_analyses_skin_tone   ON analyses (skin_tone);
CREATE INDEX idx_analyses_skin_type   ON analyses (skin_type);

-- ============================================================
-- PRODUCTS
-- Central product catalog with affiliate link management
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
    id              TEXT        PRIMARY KEY,  -- e.g. 'p1', 'p2'
    name            TEXT        NOT NULL,
    brand           TEXT        NOT NULL,
    category        TEXT        NOT NULL,     -- moisturiser | serum | spf | foundation | etc.
    description     TEXT,
    price_gbp       NUMERIC(8,2),
    image_url       TEXT,
    affiliate_url   TEXT,                     -- full affiliate URL with tag
    affiliate_tag   TEXT,                     -- e.g. 'blushmap-21' (Amazon Associates)
    tags            JSONB,                    -- array of string tags for filtering
    zones           JSONB,                    -- face zones this product applies to
    suitable_for    JSONB,                    -- skin types this product suits
    is_active       BOOLEAN     NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_brand     ON products (brand);
CREATE INDEX idx_products_category  ON products (category);
CREATE INDEX idx_products_is_active ON products (is_active);

-- ============================================================
-- AFFILIATE CLICKS
-- Track every outbound affiliate link click for revenue analytics
-- ============================================================
CREATE TABLE IF NOT EXISTS affiliate_clicks (
    id              BIGSERIAL   PRIMARY KEY,
    analysis_id     INTEGER     REFERENCES analyses(id) ON DELETE SET NULL,
    product_id      TEXT        REFERENCES products(id) ON DELETE SET NULL,
    session_id      TEXT,
    affiliate_url   TEXT        NOT NULL,
    referrer        TEXT,
    user_agent      TEXT,
    clicked_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_clicks_analysis_id  ON affiliate_clicks (analysis_id);
CREATE INDEX idx_clicks_product_id   ON affiliate_clicks (product_id);
CREATE INDEX idx_clicks_clicked_at   ON affiliate_clicks (clicked_at DESC);

-- ============================================================
-- PRODUCT RECOMMENDATIONS
-- Junction table: which products were recommended in each analysis
-- ============================================================
CREATE TABLE IF NOT EXISTS analysis_recommendations (
    id              BIGSERIAL   PRIMARY KEY,
    analysis_id     INTEGER     NOT NULL REFERENCES analyses(id) ON DELETE CASCADE,
    product_id      TEXT        NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    priority        INTEGER     NOT NULL,    -- 1 = highest priority
    reason          TEXT,                   -- AI-generated reason for recommendation
    application_zone TEXT,                  -- face zone to apply
    usage_tip       TEXT,                   -- AI-generated application tip
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_recs_analysis_id ON analysis_recommendations (analysis_id);
CREATE INDEX idx_recs_product_id  ON analysis_recommendations (product_id);
CREATE UNIQUE INDEX idx_recs_analysis_product ON analysis_recommendations (analysis_id, product_id);

-- ============================================================
-- ANALYTICS SUMMARY VIEW
-- Useful for a future admin dashboard
-- ============================================================
CREATE OR REPLACE VIEW analytics_summary AS
SELECT
    DATE_TRUNC('day', a.created_at)            AS day,
    COUNT(DISTINCT a.id)                        AS total_analyses,
    COUNT(DISTINCT ac.id)                       AS total_clicks,
    COUNT(DISTINCT a.session_id)                AS unique_sessions,
    MODE() WITHIN GROUP (ORDER BY a.skin_tone)  AS most_common_tone,
    MODE() WITHIN GROUP (ORDER BY a.skin_type)  AS most_common_type
FROM analyses a
LEFT JOIN affiliate_clicks ac ON ac.analysis_id = a.id
GROUP BY 1
ORDER BY 1 DESC;

-- ============================================================
-- SEED: Product catalog
-- ============================================================
INSERT INTO products (id, name, brand, category, description, price_gbp, image_url, affiliate_url, affiliate_tag, tags, zones, suitable_for) VALUES
('p1',  'CeraVe Moisturising Cream',               'CeraVe',          'moisturiser', 'Barrier-restoring formula with ceramides and hyaluronic acid.',                   14.50, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&q=80', 'https://www.amazon.co.uk/s?k=CeraVe+Moisturising+Cream&tag=blushmap-21',           'blushmap-21', '["dry","sensitive","fragrance-free"]',         '["full-face","cheeks","forehead"]', '["dry","combination","sensitive"]'),
('p2',  'Neutrogena Hydro Boost Gel-Cream',         'Neutrogena',      'moisturiser', 'Lightweight water-gel locks in hydration without greasiness.',                    16.99, 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=300&q=80', 'https://www.amazon.co.uk/s?k=Neutrogena+Hydro+Boost+Gel+Cream&tag=blushmap-21',    'blushmap-21', '["oily","combination","lightweight"]',         '["t-zone","full-face"]',           '["oily","combination","normal"]'),
('p3',  'Tatcha The Water Cream',                   'Tatcha',          'moisturiser', 'Japanese-inspired oil-free formula that minimises the look of pores.',            69.00, 'https://images.unsplash.com/photo-1591106840545-9e5a3b3b9e10?w=300&q=80', 'https://www.amazon.co.uk/s?k=Tatcha+Water+Cream&tag=blushmap-21',                  'blushmap-21', '["oily","korean-inspired","luxury"]',          '["t-zone","full-face"]',           '["oily","combination"]'),
('p4',  'The Ordinary Niacinamide 10% + Zinc 1%',  'The Ordinary',    'serum',       'Controls excess sebum, minimises pores and blemishes.',                            5.90, 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&q=80', 'https://www.amazon.co.uk/s?k=The+Ordinary+Niacinamide+10&tag=blushmap-21',         'blushmap-21', '["oily","blemish-prone","budget-friendly"]',   '["t-zone","cheeks"]',              '["oily","combination","blemish-prone"]'),
('p5',  'SkinCeuticals C E Ferulic',                'SkinCeuticals',   'serum',       'Gold-standard antioxidant serum for brightening and anti-ageing.',               166.00, 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&q=80', 'https://www.amazon.co.uk/s?k=SkinCeuticals+CE+Ferulic&tag=blushmap-21',            'blushmap-21', '["vitamin-c","anti-aging","brightening"]',     '["full-face","dark-spots"]',       '["normal","dry","combination","mature"]'),
('p6',  'Paula''s Choice BHA Exfoliant',            'Paula''s Choice', 'serum',       'Unclogs pores and smooths skin texture with 2% salicylic acid.',                  32.00, 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=300&q=80', 'https://www.amazon.co.uk/s?k=Paulas+Choice+BHA+Exfoliant&tag=blushmap-21',         'blushmap-21', '["blemish-prone","pores","exfoliant"]',        '["t-zone","nose","chin"]',         '["oily","combination","blemish-prone"]'),
('p7',  'La Roche-Posay Anthelios SPF 50+',         'La Roche-Posay',  'spf',         'Broad-spectrum SPF50+ with invisible finish for all skin tones.',                  19.50, 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=300&q=80', 'https://www.amazon.co.uk/s?k=La+Roche+Posay+Anthelios+SPF50&tag=blushmap-21',     'blushmap-21', '["spf","sensitive","fragrance-free"]',         '["full-face","neck"]',             '["all","sensitive"]'),
('p8',  'Black Girl Sunscreen SPF 30',              'Black Girl Sunscreen', 'spf',    'Zero white cast, moisturising SPF30 for medium-to-deep skin tones.',               18.00, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&q=80', 'https://www.amazon.co.uk/s?k=Black+Girl+Sunscreen+SPF30&tag=blushmap-21',          'blushmap-21', '["spf","dark-skin","no-white-cast"]',          '["full-face","neck"]',             '["all","oily","combination"]'),
('p9',  'NARS Natural Radiant Longwear Foundation', 'NARS',            'foundation',  'Buildable medium coverage with a natural, skin-like radiance.',                    40.00, 'https://images.unsplash.com/photo-1590156562745-5e36e44ab9e2?w=300&q=80', 'https://www.amazon.co.uk/s?k=NARS+Natural+Radiant+Foundation&tag=blushmap-21',     'blushmap-21', '["medium-coverage","radiant","inclusive-shades"]', '["full-face","under-eyes"]',   '["normal","dry","combination"]'),
('p10', 'Fenty Beauty Pro Filt''r Foundation',      'Fenty Beauty',    'foundation',  '40+ shades, full coverage matte finish that controls oil all day.',                34.00, 'https://images.unsplash.com/photo-1590156562745-5e36e44ab9e2?w=300&q=80', 'https://www.amazon.co.uk/s?k=Fenty+Beauty+Pro+Filtr+Foundation&tag=blushmap-21',  'blushmap-21', '["full-coverage","oily","matte","inclusive-shades"]', '["full-face"]',          '["oily","combination"]'),
('p11', 'RMS Beauty Un Cover-Up Concealer',         'RMS Beauty',      'concealer',   'Raw, food-grade organic ingredients in a creamy under-eye concealer.',             30.00, 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=300&q=80', 'https://www.amazon.co.uk/s?k=RMS+Beauty+Concealer&tag=blushmap-21',                'blushmap-21', '["organic","clean","natural","sensitive"]',    '["under-eyes","dark-spots"]',      '["all","sensitive","dry"]'),
('p12', 'ILIA Super Serum Skin Tint SPF 40',        'ILIA',            'tinted-spf',  'Skincare-first tinted SPF with 30% skincare actives.',                            48.00, 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=300&q=80', 'https://www.amazon.co.uk/s?k=ILIA+Super+Serum+Skin+Tint&tag=blushmap-21',         'blushmap-21', '["organic","clean","spf","tinted"]',           '["full-face"]',                    '["all","sensitive"]'),
('p13', 'COSRX Snail Mucin 96% Repairing Essence',  'COSRX',           'essence',     '96% snail secretion filtrate to repair and hydrate damaged skin.',                22.00, 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&q=80', 'https://www.amazon.co.uk/s?k=COSRX+Snail+Mucin+96&tag=blushmap-21',               'blushmap-21', '["korean","hydrating","scarring","repair"]',   '["full-face","scarring"]',         '["all","sensitive","dry"]'),
('p14', 'Some By Mi AHA BHA PHA Miracle Toner',     'Some By Mi',      'toner',       'Triple-acid exfoliating toner that visibly clears blemishes in 30 days.',          16.00, 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&q=80', 'https://www.amazon.co.uk/s?k=Some+By+Mi+AHA+BHA+Toner&tag=blushmap-21',           'blushmap-21', '["korean","exfoliant","blemish-prone"]',       '["full-face","t-zone"]',           '["oily","combination","blemish-prone"]'),
('p15', 'Kiehl''s Creamy Eye Treatment',            'Kiehl''s',        'eye-cream',   'Rich avocado-infused eye cream for dry, delicate under-eye skin.',                 32.00, 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=300&q=80', 'https://www.amazon.co.uk/s?k=Kiehls+Creamy+Eye+Treatment&tag=blushmap-21',        'blushmap-21', '["dry","under-eyes","nourishing","anti-aging"]','["under-eyes"]',             '["dry","normal","mature"]')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Auto-update updated_at trigger
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER analyses_updated_at  BEFORE UPDATE ON analyses  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER products_updated_at  BEFORE UPDATE ON products  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
