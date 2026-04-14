import asyncio
import json
import re
import urllib.parse
from playwright.async_api import async_playwright

# Products that got bad URLs (visa icon or banner) in first pass
BAD_PRODUCTS = [
    ("p78",  "Charlotte Tilbury Glow Drops Liquid Highlighter"),
    ("p79",  "Hourglass Ambient Lighting Bronzer"),
    ("p81",  "Supergoop Invisible Shield Daily Sunscreen SPF35"),
    ("p86",  "Sisley Paris Phyto-Blanc Brightening Serum"),
    ("p87",  "Dior Forever Natural Bronze powder"),
    ("p89",  "Charlotte Tilbury Rock N Kohl Eye Pencil"),
    ("p90",  "Paula's Choice Peptide Booster Serum"),
    ("p91",  "Charlotte Tilbury Flawless Filter Complexion Booster"),
    ("p92",  "Dior Addict Lip Maximizer Plumping Gloss"),
    ("p93",  "Trinny London BFF De-Stress SPF30 Cream"),
    ("p96",  "La Prairie Skin Caviar Luxe Cream 50ml"),
    ("p97",  "Neal's Yard Wild Rose Beauty Balm"),
]

def decode_proxy_url(proxy_url):
    """Extract direct static.thcdn.com URL from lookfantastic.com/images?url= proxy"""
    if "lookfantastic.com/images?url=" in proxy_url:
        # Extract the url= parameter
        parsed = urllib.parse.urlparse(proxy_url)
        params = urllib.parse.parse_qs(parsed.query)
        if 'url' in params:
            inner_url = params['url'][0]
            return inner_url
    return proxy_url


def is_product_image(url):
    """Check if URL is a real product image (not visa icon, banner, etc.)"""
    bad_patterns = [
        'PaymentOptions',
        'visa.jpg',
        'mastercard',
        'paypal',
        'design-assets/shared-assets/components',
        'widgets/',
        'banner',
        'logo',
    ]
    url_lower = url.lower()
    for pat in bad_patterns:
        if pat.lower() in url_lower:
            return False
    return 'productimg' in url_lower or 'product' in url_lower


async def fetch_image_improved(page, product_id, product_name):
    """More targeted fetch that scrolls and waits for product grid images."""
    query = product_name.replace(" ", "+")
    url = f"https://www.lookfantastic.com/search?q={query}"
    print(f"\n[{product_id}] Fetching: {url}")
    
    try:
        await page.goto(url, wait_until="networkidle", timeout=45000)
        await page.wait_for_timeout(3000)
        
        # Scroll down a bit to trigger lazy loading
        await page.evaluate("window.scrollBy(0, 400)")
        await page.wait_for_timeout(2000)
        
        # Get page content and search for productimg URLs
        content = await page.content()
        
        # Find all productimg URLs
        pattern = r'https://static\.thcdn\.com/productimg/[^\s"\'&]+'
        matches = re.findall(pattern, content)
        
        if matches:
            # Filter for actual product images (jpg/jpeg/png/webp)
            valid = [m for m in matches if re.search(r'\.(jpg|jpeg|png|webp)$', m, re.I)]
            if valid:
                print(f"  -> Found productimg URL: {valid[0][:100]}...")
                return valid[0]
        
        # Also search the proxied form and decode it
        proxy_pattern = r'https://www\.lookfantastic\.com/images\?url=https://static\.thcdn\.com/productimg/[^\s"\']*'
        proxy_matches = re.findall(proxy_pattern, content)
        if proxy_matches:
            decoded = decode_proxy_url(proxy_matches[0])
            # Clean up the URL (remove format/width params that may be appended)
            if '&' in decoded:
                decoded = decoded.split('&')[0]
            print(f"  -> Found via proxy decode: {decoded[:100]}...")
            return decoded
        
        # Check img elements specifically for product images
        imgs = await page.query_selector_all("img")
        for img in imgs:
            src = await img.get_attribute("src") or ""
            data_src = await img.get_attribute("data-src") or ""
            srcset = await img.get_attribute("srcset") or ""
            
            for attr_val in [src, data_src]:
                if "productimg" in attr_val:
                    # decode proxy if needed
                    if "lookfantastic.com/images?url=" in attr_val:
                        decoded = decode_proxy_url(attr_val)
                        if decoded and is_product_image(decoded):
                            print(f"  -> Found product img (decoded): {decoded[:100]}...")
                            return decoded.split("&")[0]
                    elif "thcdn.com/productimg" in attr_val:
                        print(f"  -> Found product img: {attr_val[:100]}...")
                        return attr_val
            
            if "productimg" in srcset:
                parts = srcset.split(",")
                for part in parts:
                    part_url = part.strip().split(" ")[0]
                    if "productimg" in part_url:
                        if not part_url.startswith("http"):
                            part_url = "https:" + part_url
                        print(f"  -> Found in srcset: {part_url[:100]}...")
                        return part_url
        
        print(f"  -> No product image found")
        return None
        
    except Exception as e:
        print(f"  -> Error: {e}")
        return None


async def main():
    # Load existing results
    output_path = "/home/user/workspace/blushmap/scripts/images_batch5.json"
    with open(output_path, "r") as f:
        results = json.load(f)
    
    # First, decode all existing proxy URLs and clean them
    print("=== Cleaning existing product URLs ===")
    for pid, url in results.items():
        if url and "lookfantastic.com/images?url=" in url:
            decoded = decode_proxy_url(url)
            # Remove extra params after the image extension
            decoded_clean = re.sub(r'(\.(jpg|jpeg|png|webp)).*$', r'\1', decoded, flags=re.I)
            if is_product_image(decoded_clean):
                results[pid] = decoded_clean
                print(f"  [OK] {pid}: {decoded_clean[:100]}...")
            else:
                print(f"  [BAD] {pid}: {decoded_clean[:80]} -- will re-fetch")
                results[pid] = None
    
    # Re-fetch the bad ones
    bad_ids = [pid for pid, url in results.items() if url is None]
    if bad_ids:
        print(f"\n=== Re-fetching {len(bad_ids)} products: {bad_ids} ===")
        bad_products = [(pid, name) for pid, name in BAD_PRODUCTS if pid in bad_ids]
        
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            context = await browser.new_context(
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                viewport={"width": 1280, "height": 900}
            )
            page = await context.new_page()
            
            for pid, name in bad_products:
                img_url = await fetch_image_improved(page, pid, name)
                results[pid] = img_url
                await asyncio.sleep(1.5)
            
            await browser.close()
    
    # Save updated results
    with open(output_path, "w") as f:
        json.dump(results, f, indent=2)
    
    print(f"\n\n=== FINAL RESULTS ===")
    found = sum(1 for v in results.values() if v)
    print(f"Found {found}/{len(results)} images")
    for pid, url in sorted(results.items(), key=lambda x: int(x[0][1:])):
        status = "✓" if url else "✗"
        print(f"  {status} {pid}: {(url[:100] + '...') if url else 'NOT FOUND'}")
    
    print(f"\nSaved to {output_path}")

if __name__ == "__main__":
    asyncio.run(main())
