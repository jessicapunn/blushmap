# BlushMap — Database

## Development (SQLite)
The app uses SQLite locally via Drizzle ORM. No setup needed — the database file (`blushmap.db`) is created automatically when you run the dev server.

```bash
npm run dev
```

## Production (PostgreSQL)
For production deployment, run the schema against your PostgreSQL database:

```bash
psql $DATABASE_URL -f database/schema.sql
```

### Tables
| Table | Purpose |
|---|---|
| `analyses` | One row per skin analysis session — stores image, AI results, skin profile |
| `products` | Product catalog with affiliate URLs and tags |
| `analysis_recommendations` | Junction table linking analyses to recommended products |
| `affiliate_clicks` | Click tracking for affiliate revenue analytics |

### Views
| View | Purpose |
|---|---|
| `analytics_summary` | Daily rollup of analyses, clicks, and skin type distribution |

## Affiliate Tags
All affiliate URLs use the tag `blushmap-21`. Replace with your Amazon Associates tag:
```sql
UPDATE products SET affiliate_tag = 'YOUR-TAG-21',
  affiliate_url = REPLACE(affiliate_url, 'blushmap-21', 'YOUR-TAG-21');
```

## Environment Variables
```env
DATABASE_URL=postgresql://user:password@host:5432/blushmap
ANTHROPIC_API_KEY=your_key_here
```
