import asyncio
import json
import re
from playwright.async_api import async_playwright

PRODUCTS = [
    ("p74",  "Shiseido Vital Perfection Uplifting Firming Cream 50ml"),
    ("p75",  "MAC Matte Lipstick Ruby Woo"),
    ("p76",  "Maybelline Lash Sensational Sky High Mascara"),
    ("p77",  "Clinique Anti-Blemish Solutions Liquid Makeup"),
    ("p78",  "Charlotte Tilbury Glow Drops Liquid Highlighter"),
    ("p79",  "Hourglass Ambient Lighting Bronzer"),
    ("p80",  "Anastasia Beverly Hills Brow Wiz Ultra Slim Pencil"),
    ("p81",  "Supergoop Invisible Shield Daily Sunscreen SPF35"),
    ("p82",  "NARS Soft Matte Complete Powder"),
    ("p85",  "Clinique Moisture Surge 72-Hour moisturiser"),
    ("p86",  "Sisley Paris Phyto-Blanc Brightening Serum"),
    ("p87",  "Dior Forever Natural Bronze powder"),
    ("p88",  "Youth To The People Superfood Antioxidant Cleanser 237ml"),
    ("p89",  "Charlotte Tilbury Rock N Kohl Eye Pencil"),
    ("p90",  "Paula's Choice Peptide Booster Serum"),
    ("p91",  "Charlotte Tilbury Flawless Filter Complexion Booster"),
    ("p92",  "Dior Addict Lip Maximizer Plumping Gloss"),
    ("p93",  "Trinny London BFF De-Stress SPF30 Cream"),
    ("p94",  "Fresh Vitamin Nectar Vibrancy Boosting Face Mask"),
    ("p95",  "Origins GinZing Brightening Eye Cream"),
    ("p96",  "La Prairie Skin Caviar Luxe Cream 50ml"),
    ("p97",  "Neal's Yard Wild Rose Beauty Balm"),
    ("p98",  "Lancome Advanced Genifique Serum 30ml"),
    ("p99",  "No7 Future Renew Serum 30ml"),
    ("p100", "Glow Recipe Plum Plump Hyaluronic Moisturiser"),
]


def extract_thcdn_url(text):
    """Extract first thcdn.com image URL from text."""
    patterns = [
        r'https://[^\s"\']+thcdn\.com[^\s"\']+\.(?:jpg|jpeg|png|webp)(?:\?[^\s"\']*)?',
        r'//[^\s"\']+thcdn\.com[^\s"\']+\.(?:jpg|jpeg|png|webp)(?:\?[^\s"\']*)?',
    ]
    for pat in patterns:
        matches = re.findall(pat, text, re.IGNORECASE)
        for m in matches:
            if not any(skip in m.lower() for skip in ['logo', 'icon', 'banner', 'sprite']):
                if not m.startswith('http'):
                    m = 'https:' + m
                return m
    return None


async def fetch_image_for_product(page, product_id, product_name):
    query = product_name.replace(" ", "+")
    url = f"https://www.lookfantastic.com/search?q={query}"
    print(f"\n[{product_id}] Fetching: {url}")
    
    try:
        await page.goto(url, wait_until="domcontentloaded", timeout=30000)
        await page.wait_for_timeout(4000)
        
        # Try to find thcdn.com images directly in src attribute
        imgs = await page.query_selector_all("img[src*='thcdn.com']")
        if imgs:
            src = await imgs[0].get_attribute("src")
            if src:
                print(f"  -> Found thcdn.com image (src): {src[:100]}...")
                return src
        
        # Try data-src
        imgs = await page.query_selector_all("img[data-src*='thcdn.com']")
        if imgs:
            src = await imgs[0].get_attribute("data-src")
            if src:
                print(f"  -> Found thcdn.com image (data-src): {src[:100]}...")
                return src

        # Try srcset
        all_imgs = await page.query_selector_all("img")
        for img in all_imgs:
            srcset = await img.get_attribute("srcset") or ""
            if "thcdn.com" in srcset:
                parts = srcset.split(",")
                for part in parts:
                    part = part.strip().split(" ")[0]
                    if "thcdn.com" in part:
                        if not part.startswith("http"):
                            part = "https:" + part
                        print(f"  -> Found thcdn.com image (srcset): {part[:100]}...")
                        return part
        
        # Try page content regex
        content = await page.content()
        url_found = extract_thcdn_url(content)
        if url_found:
            print(f"  -> Found in content: {url_found[:100]}...")
            return url_found
        
        print(f"  -> No thcdn.com image found, trying screenshot approach")
        return None
        
    except Exception as e:
        print(f"  -> Error: {e}")
        return None


async def main():
    results = {}
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            viewport={"width": 1280, "height": 900}
        )
        page = await context.new_page()
        
        for product_id, product_name in PRODUCTS:
            img_url = await fetch_image_for_product(page, product_id, product_name)
            if img_url:
                results[product_id] = img_url
            else:
                results[product_id] = None
            
            await asyncio.sleep(1.5)
        
        await browser.close()
    
    # Save results
    output_path = "/home/user/workspace/blushmap/scripts/images_batch5.json"
    with open(output_path, "w") as f:
        json.dump(results, f, indent=2)
    
    print(f"\n\n=== RESULTS ===")
    found = sum(1 for v in results.values() if v)
    print(f"Found {found}/{len(results)} images")
    for pid, url in sorted(results.items(), key=lambda x: int(x[0][1:])):
        status = "✓" if url else "✗"
        print(f"  {status} {pid}: {(url[:100] + '...') if url else 'NOT FOUND'}")
    
    print(f"\nSaved to {output_path}")
    return results

if __name__ == "__main__":
    asyncio.run(main())
