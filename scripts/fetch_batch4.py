import asyncio
import json
import re
from playwright.async_api import async_playwright

PRODUCTS = [
    ("p11",   "La Roche-Posay Anthelios Tinted Mineral Fluid SPF50+"),
    ("p17",   "Pyunkang Yul Essence Toner 200ml"),
    ("p17b",  "The Ordinary Glycolic Acid 7% Toning Solution 240ml"),
    ("p22",   "La Roche-Posay Toleriane Hydrating Gentle Cleanser 400ml"),
    ("p21b",  "Elemis Pro-Collagen Cleansing Balm 100g"),
    ("p23",   "Medik8 Crystal Retinal 6 30ml"),
    ("p24",   "RoC Retinol Correxion Line Smoothing Serum"),
    ("p25",   "Glow Recipe Watermelon Glow Sleeping Mask 80ml"),
    ("p26",   "Charlotte Tilbury Goddess Skin Clay Mask 75ml"),
    ("p26b",  "Laneige Lip Sleeping Mask"),
    ("p33",   "The Ordinary Azelaic Acid Suspension 10% 30ml"),
    ("p33b",  "La Roche-Posay Effaclar Duo+ 40ml"),
    ("p46",   "Dermalogica Daily Microfoliant 74g"),
    ("p47",   "The Ordinary AHA 30% + BHA 2% Peeling Solution 30ml"),
    ("p88",   "Youth To The People Superfood Antioxidant Cleanser 237ml"),
]

# p72 = same as p46
ALIASES = {"p72": "p46"}

async def fetch_image_for_product(page, product_id, product_name):
    query = product_name.replace(" ", "+")
    url = f"https://www.lookfantastic.com/search?q={query}"
    print(f"\n[{product_id}] Fetching: {url}")
    
    try:
        await page.goto(url, wait_until="domcontentloaded", timeout=30000)
        # Wait for product images to load
        await page.wait_for_timeout(3000)
        
        # Try to find thcdn.com images
        imgs = await page.query_selector_all("img[src*='thcdn.com']")
        if imgs:
            src = await imgs[0].get_attribute("src")
            if src:
                print(f"  -> Found thcdn.com image: {src[:80]}...")
                return src
        
        # Try srcset with thcdn.com
        all_imgs = await page.query_selector_all("img")
        for img in all_imgs:
            src = await img.get_attribute("src") or ""
            srcset = await img.get_attribute("srcset") or ""
            data_src = await img.get_attribute("data-src") or ""
            
            combined = src + srcset + data_src
            if "thcdn.com" in combined:
                # Extract the URL from srcset if needed
                if "thcdn.com" in src:
                    print(f"  -> Found src: {src[:80]}...")
                    return src
                if "thcdn.com" in data_src:
                    print(f"  -> Found data-src: {data_src[:80]}...")
                    return data_src
                if "thcdn.com" in srcset:
                    # Parse srcset to get first URL
                    parts = srcset.split(",")
                    for part in parts:
                        part = part.strip().split(" ")[0]
                        if "thcdn.com" in part:
                            print(f"  -> Found in srcset: {part[:80]}...")
                            return part
        
        # Try looking at page content directly
        content = await page.content()
        matches = re.findall(r'https://[^\s"\']+thcdn\.com[^\s"\']+\.(?:jpg|jpeg|png|webp)[^\s"\']*', content)
        if matches:
            # Filter out tiny thumbnails, prefer product images
            for m in matches:
                if not any(skip in m for skip in ['logo', 'icon', 'banner']):
                    print(f"  -> Found in content: {m[:80]}...")
                    return m
        
        print(f"  -> No thcdn.com image found")
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
            viewport={"width": 1280, "height": 800}
        )
        page = await context.new_page()
        
        for product_id, product_name in PRODUCTS:
            img_url = await fetch_image_for_product(page, product_id, product_name)
            if img_url:
                results[product_id] = img_url
            else:
                results[product_id] = None
            
            # Small delay between requests
            await asyncio.sleep(1)
        
        await browser.close()
    
    # Add aliases
    for alias, target in ALIASES.items():
        if target in results and results[target]:
            results[alias] = results[target]
    
    # Save results
    output_path = "/home/user/workspace/blushmap/scripts/images_batch4.json"
    with open(output_path, "w") as f:
        json.dump(results, f, indent=2)
    
    print(f"\n\n=== RESULTS ===")
    found = sum(1 for v in results.values() if v)
    print(f"Found {found}/{len(results)} images")
    for pid, url in sorted(results.items()):
        status = "✓" if url else "✗"
        print(f"  {status} {pid}: {url[:80] if url else 'NOT FOUND'}...")
    
    print(f"\nSaved to {output_path}")
    return results

if __name__ == "__main__":
    asyncio.run(main())
