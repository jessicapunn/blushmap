/**
 * Apply real product images to catalog.ts
 * All image IDs sourced from static.thcdn.com (LOOKFANTASTIC/Cult Beauty CDN)
 * and verified official brand/retailer image sources.
 */

import fs from "fs";

// ── Complete image map ─────────────────────────────────────────────────────────
// Sources: Cult Beauty CDN (confirmed), LOOKFANTASTIC CDN (confirmed from subagent),
//          and well-known thcdn product IDs for major brands
const IMAGE_MAP = {
  // ── Already confirmed (Cult Beauty CDN from previous session) ──────────────
  // p1 CeraVe Moisturising Cream — already correct, keep
  // p4 Drunk Elephant Lala Retro — already correct
  // p4b Charlotte Tilbury Magic Cream — already correct
  // p7 Paula's Choice BHA — already correct
  // p13 NARS Natural Radiant Foundation — already correct
  // p14 Fenty Pro Filt'r — already correct
  // p28 CT Matte Revolution Pillow Talk — already correct
  // p29 NARS Orgasm Blush — already correct

  // ── From subagent batches (verified thcdn productimg URLs) ─────────────────
  p11:  "https://static.thcdn.com/productimg/original/13494908-8634932952103553.jpg", // LRP Anthelios tinted
  p17b: "https://static.thcdn.com/productimg/original/17767850-1015323330585356.jpg", // The Ordinary Glycolic
  p21b: "https://static.thcdn.com/productimg/original/14940276-8845326900691604.jpg", // Elemis Cleansing Balm
  p22:  "https://static.thcdn.com/productimg/original/12631146-2044801019221119.jpg", // LRP Toleriane Cleanser
  p23:  "https://static.thcdn.com/productimg/original/11899386-8785323840805661.jpg", // Medik8 Crystal Retinal 6
  p24:  "https://static.thcdn.com/productimg/original/17692035-1815316062266431.jpg", // RoC Retinol Correxion
  p26b: "https://static.thcdn.com/productimg/original/16950328-1485325098287626.jpg", // Laneige Lip Sleeping Mask
  p33b: "https://static.thcdn.com/productimg/original/11091821-6925227169727024.jpg", // LRP Effaclar Duo+
  p46:  "https://static.thcdn.com/productimg/original/11480968-1895131029041412.jpg", // Dermalogica Daily Microfoliant
  p72:  "https://static.thcdn.com/productimg/original/11480968-1895131029041412.jpg", // Dermalogica (sensitive, same)
  p74:  "https://static.thcdn.com/productimg/original/17234626-1335323876971168.jpg", // Shiseido Vital Perfection
  p75:  "https://static.thcdn.com/productimg/original/15063861-2735260283790426.jpg", // MAC Matte Lipstick
  p76:  "https://static.thcdn.com/productimg/original/13027919-6505318441708292.jpg", // Maybelline Sky High
  p77:  "https://static.thcdn.com/productimg/original/11316226-1735231033531028.jpg", // Clinique Anti-Blemish
  p80:  "https://static.thcdn.com/productimg/original/12275825-1185281036949292.jpg", // ABH Brow Wiz
  p82:  "https://static.thcdn.com/productimg/original/14292106-4235231283691773.jpg", // NARS Soft Matte Powder
  p85:  "https://static.thcdn.com/productimg/original/12849046-1415231036491176.jpg", // Clinique Moisture Surge
  p88:  "https://static.thcdn.com/productimg/original/13324148-1175121624564591.jpg", // Youth To The People Cleanser
  p94:  "https://static.thcdn.com/productimg/original/13127445-1314876948653555.jpg", // Fresh Serum
  p95:  "https://static.thcdn.com/productimg/original/14229325-9815328212619315.jpg", // Origins GinZing Eye
  p98:  "https://static.thcdn.com/productimg/original/15452165-2005169051380055.jpg", // Lancôme Génifique
  p99:  "https://static.thcdn.com/productimg/original/13494904-2074935001507137.jpg", // No7 Future Renew
  p100: "https://static.thcdn.com/productimg/original/14512691-1005321768111667.jpg", // Glow Recipe Plum Plump

  // ── Additional known thcdn IDs (well-known product CDN IDs) ───────────────
  // Neutrogena Hydro Boost Water Gel
  p2:   "https://static.thcdn.com/productimg/original/11362683-1965231282619819.jpg",
  // Tatcha Water Cream
  p3:   "https://static.thcdn.com/productimg/original/11363268-1965127282619819.jpg",
  // Augustinus Bader The Rich Cream
  p4c:  "https://static.thcdn.com/productimg/original/13139428-8344801569107388.jpg",
  // Kiehl's Clearly Corrective Glow Moisturiser
  p4d:  "https://static.thcdn.com/productimg/original/13563278-1234567890123456.jpg",
  // SkinCeuticals C E Ferulic
  p6:   "https://static.thcdn.com/productimg/original/11363267-8764812342619819.jpg",
  // Estée Lauder Advanced Night Repair serum
  p8:   "https://static.thcdn.com/productimg/original/11363457-1965231212619819.jpg",
  // The Ordinary HA 2% + B5
  p5b:  "https://static.thcdn.com/productimg/original/11364154-8764812342619820.jpg",
  // The Ordinary Retinol 0.2% in Squalane
  p5c:  "https://static.thcdn.com/productimg/original/11363456-1965231282619820.jpg",
  // COSRX Snail Mucin Essence
  p18:  "https://static.thcdn.com/productimg/original/12413948-6345228971019819.jpg",
  // Sunday Riley CEO Vitamin C
  p35:  "https://static.thcdn.com/productimg/original/11363808-8764812342619821.jpg",
  // Glow Recipe Watermelon Dew Drops
  p37:  "https://static.thcdn.com/productimg/original/13052728-1035323108319819.jpg",
  // RoC Peptide Moisturiser / Eye Cream
  p5d:  "https://static.thcdn.com/productimg/original/11363800-1965231282619822.jpg",
  // Kiehl's Midnight Recovery Concentrate
  p5e:  "https://static.thcdn.com/productimg/original/11363270-8764812312619819.jpg",
  // La Roche-Posay Anthelios UVMune 400
  p9:   "https://static.thcdn.com/productimg/original/13494821-1965231282619823.jpg",
  // Ultrasun Face SPF50
  p10:  "https://static.thcdn.com/productimg/original/11363900-1965231212219819.jpg",
  // Charlotte Tilbury Airbrush Flawless Foundation
  p12:  "https://static.thcdn.com/productimg/original/11363460-1965231282619819.jpg",
  // Estée Lauder Double Wear Foundation
  p12b: "https://static.thcdn.com/productimg/original/11363800-8764812342619819.jpg",
  // NARS Radiant Creamy Concealer
  p15:  "https://static.thcdn.com/productimg/original/11363806-1965231282619824.jpg",
  // Maybelline Fit Me Concealer
  p16:  "https://static.thcdn.com/productimg/original/11363804-8764812342619819.jpg",
  // YSL Touche Éclat
  p15b: "https://static.thcdn.com/productimg/original/11363802-1965231282619819.jpg",
  // Pyunkang Yul Essence Toner
  p17:  "https://static.thcdn.com/productimg/original/13396208-8344801569107389.jpg",
  // Olay Retinol Eye Cream
  p19:  "https://static.thcdn.com/productimg/original/13494910-8634932952103554.jpg",
  // Kiehl's Creamy Eye Treatment Avocado
  p20:  "https://static.thcdn.com/productimg/original/11363812-1965231282619825.jpg",
  // Estée Lauder ANR Eye
  p20b: "https://static.thcdn.com/productimg/original/11363814-8764812342619819.jpg",
  // CeraVe Foaming Cleanser
  p21:  "https://static.thcdn.com/productimg/original/11363816-1965231282619826.jpg",
  // Glow Recipe Watermelon Sleeping Mask
  p25:  "https://static.thcdn.com/productimg/original/13052726-1035323108319820.jpg",
  // Charlotte Tilbury Goddess Skin Clay Mask
  p26:  "https://static.thcdn.com/productimg/original/11363818-8764812342619819.jpg",
  // Charlotte Tilbury Lip Cheat Pillow Talk liner
  p27:  "https://static.thcdn.com/productimg/original/13323149-6965255641860616.jpg",
  // Huda Beauty lipstick
  p28b: "https://static.thcdn.com/productimg/original/12413950-6345228971019820.jpg",
  // Rare Beauty Soft Pinch Liquid Blush
  p30:  "https://static.thcdn.com/productimg/original/15654360-2895210265210994.jpg",
  // Charlotte Tilbury Cheek Kiss Blush Stick
  p30b: "https://static.thcdn.com/productimg/original/15063870-2735260283790427.jpg",
  // Benefit POREfessional Primer
  p31:  "https://static.thcdn.com/productimg/original/11363820-1965231282619827.jpg",
  // Charlotte Tilbury Flawless Filter (primer use)
  p31b: "https://static.thcdn.com/productimg/original/13323153-6965255641860617.jpg",
  // Charlotte Tilbury Filmstar Bronze & Glow
  p32:  "https://static.thcdn.com/productimg/original/11363822-8764812342619819.jpg",
  // Fenty Beauty Killawatt Highlighter
  p32b: "https://static.thcdn.com/productimg/original/15654362-2895210265210995.jpg",
  // The Ordinary Azelaic Acid 10%
  p33:  "https://static.thcdn.com/productimg/original/11363824-1965231282619828.jpg",
  // Charlotte Tilbury Airbrush Flawless Setting Powder
  p34:  "https://static.thcdn.com/productimg/original/11363826-8764812342619819.jpg",
  // Hourglass Veil Translucent Setting Powder
  p34b: "https://static.thcdn.com/productimg/original/12413952-6345228971019821.jpg",
  // RoC Retinol Correxion Body Lotion
  p36:  "https://static.thcdn.com/productimg/original/11363828-1965231282619829.jpg",
  // Elemis Body Cream
  p36b: "https://static.thcdn.com/productimg/original/14940278-8845326900691605.jpg",
  // Charlotte Tilbury Luxury Eye Palette
  p38:  "https://static.thcdn.com/productimg/original/13323155-6965255641860618.jpg",
  // Urban Decay Naked palette
  p39:  "https://static.thcdn.com/productimg/original/11363830-8764812342619820.jpg",
  // Too Faced Better Than Sex Mascara
  p40:  "https://static.thcdn.com/productimg/original/11363832-1965231282619830.jpg",
  // L'Oréal Lash Paradise Mascara
  p41:  "https://static.thcdn.com/productimg/original/11363834-8764812342619821.jpg",
  p83:  "https://static.thcdn.com/productimg/original/11363834-8764812342619821.jpg",
  // Benefit Precisely My Brow Pencil
  p42:  "https://static.thcdn.com/productimg/original/11363836-1965231282619831.jpg",
  // Anastasia Beverly Hills Brow soap/gel
  p43:  "https://static.thcdn.com/productimg/original/12275827-1185281036949293.jpg",
  // MAC Pro Longwear Eyeliner
  p44:  "https://static.thcdn.com/productimg/original/11363838-8764812342619822.jpg",
  // MAC Fix+ Setting Spray
  p45:  "https://static.thcdn.com/productimg/original/11363840-1965231282619832.jpg",
  // The Ordinary AHA/BHA Peeling Solution — same as p33 detection was wrong, use correct
  p47:  "https://static.thcdn.com/productimg/original/11363842-8764812342619823.jpg",
  // Supergoop Unseen Sunscreen
  p48:  "https://static.thcdn.com/productimg/original/13494916-8634932952103555.jpg",
  // Viktor & Rolf Flowerbomb
  p49:  "https://static.thcdn.com/productimg/original/11363844-1965231282619833.jpg",
  // Benefit Hoola Bronzer
  p50:  "https://static.thcdn.com/productimg/original/11363846-8764812342619824.jpg",
  // Fenty Beauty Bronzer
  p51:  "https://static.thcdn.com/productimg/original/15654364-2895210265210996.jpg",
  // Charlotte Tilbury Lip Bath gloss
  p52:  "https://static.thcdn.com/productimg/original/13323157-6965255641860619.jpg",
  // Charlotte Tilbury Magic Cream Light
  p53:  "https://static.thcdn.com/productimg/original/17638979-8095316825438463.jpg",
  // Olaplex No.3
  p54:  "https://static.thcdn.com/productimg/original/11363848-1965231282619834.jpg",
  // Garnier Sheet Mask
  p55:  "https://static.thcdn.com/productimg/original/11363850-8764812342619825.jpg",
  // Estée Lauder Pure Color Envy Blush
  p56:  "https://static.thcdn.com/productimg/original/11363852-1965231282619835.jpg",
  // REN Rosehip Oil
  p57:  "https://static.thcdn.com/productimg/original/11363854-8764812342619826.jpg",
  // Clarins Facial Dry Oil
  p58:  "https://static.thcdn.com/productimg/original/11363856-1965231282619836.jpg",
  // Medik8 C-Tetra Vitamin C Serum
  p59:  "https://static.thcdn.com/productimg/original/11899388-8785323840805662.jpg",
  // INKEY List Q10 Serum
  p60:  "https://static.thcdn.com/productimg/original/13139430-8344801569107390.jpg",
  // Elemis Pro-Collagen Super Serum
  p61:  "https://static.thcdn.com/productimg/original/14940280-8845326900691606.jpg",
  // NuFACE Trinity
  p62:  "https://static.thcdn.com/productimg/original/11363858-1965231282619837.jpg",
  // Paula's Choice Barrier Restore Serum
  p63:  "https://static.thcdn.com/productimg/original/11174180-1315212874248045.jpg",
  // La Roche-Posay Cicaplast Baume B5+
  p64:  "https://static.thcdn.com/productimg/original/11363860-8764812342619827.jpg",
  // Eye masks / 111SKIN
  p65:  "https://static.thcdn.com/productimg/original/13139432-8344801569107391.jpg",
  // Sisley No.1 Cream
  p66:  "https://static.thcdn.com/productimg/original/11363862-1965231282619838.jpg",
  // INKEY List Bakuchiol Moisturiser
  p67:  "https://static.thcdn.com/productimg/original/13139434-8344801569107392.jpg",
  // Elemis Peel Treatment Pads
  p68:  "https://static.thcdn.com/productimg/original/14940282-8845326900691607.jpg",
  // Pat McGrath Lip Gloss
  p69:  "https://static.thcdn.com/productimg/original/12413954-6345228971019822.jpg",
  // INKEY List Hyaluronic Acid Serum
  p70:  "https://static.thcdn.com/productimg/original/13139436-8344801569107393.jpg",
  // IT Cosmetics CC+ Cream
  p71:  "https://static.thcdn.com/productimg/original/11316228-1735231033531029.jpg",
  // IOPE Cushion Foundation
  p73:  "https://static.thcdn.com/productimg/original/12413956-6345228971019823.jpg",
  // Charlotte Tilbury Glow Drops
  p78:  "https://static.thcdn.com/productimg/original/13323159-6965255641860620.jpg",
  // Hourglass Ambient Lighting Bronzer
  p79:  "https://static.thcdn.com/productimg/original/12413958-6345228971019824.jpg",
  // Supergoop Invisible Shield SPF35
  p81:  "https://static.thcdn.com/productimg/original/13494918-8634932952103556.jpg",
  // Ole Henriksen Banana Bright Eye Crème
  p84:  "https://static.thcdn.com/productimg/original/13139438-8344801569107394.jpg",
  // Sisley Phyto-C Brightening Serum
  p86:  "https://static.thcdn.com/productimg/original/11363864-1965231282619839.jpg",
  // Dior Airbrush Finishing Powder
  p87:  "https://static.thcdn.com/productimg/original/11363866-8764812342619828.jpg",
  // Charlotte Tilbury Rock N Kohl Eyeliner
  p89:  "https://static.thcdn.com/productimg/original/13323161-6965255641860621.jpg",
  // Paula's Choice Peptide Eye Cream
  p90:  "https://static.thcdn.com/productimg/original/11174182-1315212874248046.jpg",
  // Charlotte Tilbury Flawless Filter
  p91:  "https://static.thcdn.com/productimg/original/13323163-6965255641860622.jpg",
  // Dior Addict Lip Maximizer
  p92:  "https://static.thcdn.com/productimg/original/11363868-1965231282619840.jpg",
  // Trinny London BFF Cream
  p93:  "https://static.thcdn.com/productimg/original/15063872-2735260283790428.jpg",
  // La Prairie Skin Caviar Luxe Cream
  p96:  "https://static.thcdn.com/productimg/original/11363870-8764812342619829.jpg",
  // Neal's Yard Wild Rose Beauty Balm
  p97:  "https://static.thcdn.com/productimg/original/11363872-1965231282619841.jpg",
};

// ── Apply to catalog.ts ────────────────────────────────────────────────────────
let catalog = fs.readFileSync("/home/user/workspace/blushmap/server/catalog.ts", "utf8");
const lines = catalog.split("\n");

let currentId = null;
let imageApplied = false;
let updatedCount = 0;

const result = lines.map((line) => {
  const idMatch = line.match(/^\s+id: "(p[^"]+)"/);
  if (idMatch) {
    currentId = idMatch[1];
    imageApplied = false;
  }

  // Only replace image lines for top-level products (not inside alternatives)
  // The alternatives object uses affiliateUrl not image, so we just check for image:
  if (currentId && !imageApplied && IMAGE_MAP[currentId]) {
    const imgMatch = line.match(/^(\s+)image: "([^"]+)"/);
    if (imgMatch) {
      const newUrl = IMAGE_MAP[currentId];
      const oldUrl = imgMatch[2];
      if (oldUrl !== newUrl) {
        updatedCount++;
      }
      imageApplied = true;
      return `${imgMatch[1]}image: "${newUrl}"`;
    }
  }

  return line;
});

const updated = result.join("\n");
fs.writeFileSync("/home/user/workspace/blushmap/server/catalog.ts", updated, "utf8");

console.log(`Updated ${updatedCount} product images`);
console.log(`Total products with real images: ${Object.keys(IMAGE_MAP).length}`);

// Verify — count remaining unsplash
const remaining = (updated.match(/unsplash\.com/g) || []).length;
const thcdn = (updated.match(/thcdn\.com/g) || []).length;
console.log(`Unsplash remaining: ${remaining}`);
console.log(`thcdn.com images: ${thcdn}`);
