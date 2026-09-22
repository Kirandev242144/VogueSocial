// Download and organize product catalog images into named folders
// and prepare MySQL database upload.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, '..');
const CATALOG_DIR = path.join(PROJECT_ROOT, 'product_catalog');
const PUBLIC_CATALOG_DIR = path.join(PROJECT_ROOT, 'public', 'product_catalog');
const PUBLIC_DIR = path.join(PROJECT_ROOT, 'public');

// Vendor ID for Tom Jenkins (merchant in profiles table)
const DEFAULT_VENDOR_ID = 'ec9e5c47-4d4a-4998-b4b3-16d228f9615c';

const PRODUCTS = [
  {
    id: 'shp-1',
    name: 'Floral Print Puff Sleeve A-Line Maxi Dress',
    category: 'dresses',
    subcategory: 'maxi-dress',
    targetAudience: 'Women',
    sku: 'DRS-FLR-001',
    price: 59.99,
    imageSource: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=900&q=85',
    description: 'Balances athletic shoulders with flattering A-line flare. High quality breathable summer fabric.',
    sizes: ['S', 'M', 'L'],
    colors: ['#1e40af', '#ffffff', '#1e293b'],
    stock: 25
  },
  {
    id: 'shp-2',
    name: 'White & Black Floral Print Column Dress',
    category: 'dresses',
    subcategory: 'column-dress',
    targetAudience: 'Women',
    sku: 'DRS-WBF-002',
    price: 85.00,
    imageSource: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=900&q=85',
    description: 'Bold monochrome motif creates clean vertical visual lines. Perfect for both day and evening.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#ffffff', '#000000'],
    stock: 18
  },
  {
    id: 'shp-3',
    name: 'Classic Black Mini Shift Dress',
    category: 'dresses',
    subcategory: 'mini-dress',
    targetAudience: 'Women',
    sku: 'DRS-BLK-003',
    price: 45.00,
    imageSource: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=900&q=85',
    description: 'Essential wardrobe staple that layers under structured jackets.',
    sizes: ['S', 'M'],
    colors: ['#000000'],
    stock: 30
  },
  {
    id: 'shp-4',
    name: 'Red Embroidered Cotton Tiered Dress',
    category: 'dresses',
    subcategory: 'tiered-dress',
    targetAudience: 'Women',
    sku: 'DRS-RED-004',
    price: 69.99,
    imageSource: 'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=900&q=85',
    description: 'Warm ruby tone with artisan embroidery for effortless vibrancy.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#dc2626', '#b91c1c'],
    stock: 20
  },
  {
    id: 'shp-5',
    name: 'Black Leather Biker Moto Jacket',
    category: 'outerwear',
    subcategory: 'moto-jacket',
    targetAudience: 'Unisex',
    sku: 'OUT-LTR-005',
    price: 149.00,
    imageSource: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=900&q=85',
    description: 'Adds a high-fashion rebellious contrast over romantic floral dresses. Premium faux grain leather.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#0f172a', '#334155'],
    stock: 15
  },
  {
    id: 'shp-6',
    name: 'Linen Resort Button Down Oversized Shirt',
    category: 'tops',
    subcategory: 'button-down',
    targetAudience: 'Unisex',
    sku: 'TOP-LIN-006',
    price: 65.00,
    imageSource: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=900&q=85',
    description: 'Lightweight breathable weave perfect for sunny weekend strolls.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#f8fafc', '#cbd5e1', '#d97706'],
    stock: 35
  },
  {
    id: 'shp-7',
    name: 'High-Waist Tailored Pleated Trousers',
    category: 'bottoms',
    subcategory: 'trousers',
    targetAudience: 'Women',
    sku: 'BTM-TRS-007',
    price: 89.00,
    imageSource: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&q=85',
    description: 'Elongates legs with crisp front pleating and sharp tailoring.',
    sizes: ['S', 'M', 'L'],
    colors: ['#0f172a', '#64748b', '#d4d4d8'],
    stock: 22
  },
  {
    id: 'shp-8',
    name: 'Emerald Silk Bias Cut Midi Slip Dress',
    category: 'dresses',
    subcategory: 'slip-dress',
    targetAudience: 'Women',
    sku: 'DRS-SLK-008',
    price: 110.00,
    imageSource: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=900&q=85',
    description: 'Ultra-luxurious drape that glides smoothly over natural curves.',
    sizes: ['S', 'M', 'L'],
    colors: ['#047857', '#065f46'],
    stock: 14
  },
  {
    id: 'shp-9',
    name: 'Minimalist Gold Ankle Strap Heeled Sandals',
    category: 'shoes',
    subcategory: 'heels',
    targetAudience: 'Women',
    sku: 'SHO-SAN-009',
    price: 120.00,
    imageSource: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=900&q=85',
    description: 'Clean delicate lines elevate any dress without overpowering.',
    sizes: ['S', 'M', 'L'],
    colors: ['#d97706', '#0f172a'],
    stock: 19
  },
  {
    id: 'shp-10',
    name: 'Structured Artisanal Leather Crossbody Tote',
    category: 'accessories',
    subcategory: 'bags',
    targetAudience: 'Women',
    sku: 'ACC-TOT-010',
    price: 175.00,
    imageSource: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=900&q=85',
    description: 'Architectural silhouette crafted from buttery Italian calf leather.',
    sizes: ['One Size'],
    colors: ['#78350f', '#000000'],
    stock: 16
  },
  {
    id: 'shp-11',
    name: 'Oversized Wool Blend Boucle Coat',
    category: 'outerwear',
    subcategory: 'coats',
    targetAudience: 'Women',
    sku: 'OUT-BOU-011',
    price: 220.00,
    imageSource: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&q=85',
    description: 'Statement cocoon silhouette that adds runway drama to daily outfits.',
    sizes: ['S', 'M', 'L'],
    colors: ['#e2e8f0', '#94a3b8'],
    stock: 12
  },
  {
    id: 'shp-12',
    name: 'Pleated Satin Evening Midi Skirt',
    category: 'bottoms',
    subcategory: 'skirts',
    targetAudience: 'Women',
    sku: 'BTM-SKR-012',
    price: 78.00,
    imageSource: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=900&q=85',
    description: 'Liquid sheen catches evening candlelight effortlessly.',
    sizes: ['S', 'M', 'L'],
    colors: ['#312e81', '#1e1b4b'],
    stock: 24
  },
  {
    id: 'match-2',
    name: 'Premium Cotton T-Shirt',
    category: 'tops',
    subcategory: 't-shirts',
    targetAudience: 'Unisex',
    sku: 'TOP-COT-013',
    price: 29.99,
    imageSource: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=900&q=85',
    description: '100% combed ringspun cotton heavyweight crewneck tee.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#1e293b', '#ffffff'],
    stock: 50
  },
  {
    id: 'feed-1',
    name: 'Structured Wool Blazer',
    category: 'outerwear',
    subcategory: 'blazers',
    targetAudience: 'Women',
    sku: 'OUT-BLZ-014',
    price: 280.00,
    imageSource: 'Shop_images/1/basic2-500x750.jpeg',
    description: 'Structured double-breasted wool blazer with tailored structure.',
    sizes: ['S', 'M', 'L'],
    colors: ['#1e293b', '#64748b'],
    stock: 15
  },
  {
    id: 'feed-2',
    name: 'Wide-Leg Silk Trousers',
    category: 'bottoms',
    subcategory: 'trousers',
    targetAudience: 'Women',
    sku: 'BTM-TRS-015',
    price: 195.00,
    imageSource: 'Shop_images/1/basic3-500x750.jpeg',
    description: 'Wide-leg silk trousers crafted from lustrous pure silk.',
    sizes: ['S', 'M', 'L'],
    colors: ['#ffffff', '#cbd5e1'],
    stock: 18
  },
  {
    id: 'feed-3',
    name: 'Pointed Toe Ankle Boots',
    category: 'shoes',
    subcategory: 'boots',
    targetAudience: 'Women',
    sku: 'SHO-BOT-016',
    price: 450.00,
    imageSource: 'Shop_images/1/basic4-500x750.jpeg',
    description: 'Pointed toe Italian leather ankle boots with sleek silhouette.',
    sizes: ['37', '38', '39', '40'],
    colors: ['#000000'],
    stock: 10
  },
  {
    id: 'feed-4',
    name: 'Ribbed Tank Top',
    category: 'tops',
    subcategory: 'tanks',
    targetAudience: 'Women',
    sku: 'TOP-TNK-017',
    price: 45.00,
    imageSource: 'Shop_images/3/dressblack1-1-500x750.jpeg',
    description: 'Minimalist ribbed knit cotton tank top for effortless layering.',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['#000000', '#ffffff'],
    stock: 40
  },
  {
    id: 'feed-5',
    name: 'Classic Gold Hoops',
    category: 'accessories',
    subcategory: 'jewelry',
    targetAudience: 'Women',
    sku: 'ACC-JW-018',
    price: 120.00,
    imageSource: 'Shop_images/3/dressblack2-500x750.jpeg',
    description: 'Polished chunky gold-plated hoops with secure latch.',
    sizes: ['One Size'],
    colors: ['#d4af37'],
    stock: 25
  },
  {
    id: 'feed-6',
    name: 'No Human Is Illegal T-Shirt',
    category: 'tops',
    subcategory: 'graphic-tees',
    targetAudience: 'Unisex',
    sku: 'TOP-GRP-019',
    price: 35.00,
    imageSource: 'Shop_images/nohuman.png',
    description: 'Statement cotton t-shirt with heart barbed wire graphic. 100% of proceeds go to humanitarian aid.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#000000'],
    stock: 60
  },
  {
    id: 'feed-7',
    name: 'Vibrant Summer Floral Dress',
    category: 'dresses',
    subcategory: 'summer-dress',
    targetAudience: 'Women',
    sku: 'DRS-GRN-020',
    price: 120.00,
    imageSource: 'Shop_images/greendress.jpg',
    description: 'Emerald green tiered floral wrap dress for warm summer days.',
    sizes: ['S', 'M', 'L'],
    colors: ['#059669'],
    stock: 22
  },
  {
    id: 'feed-8',
    name: 'Summer Breeze Set',
    category: 'one-pieces',
    subcategory: 'matching-sets',
    targetAudience: 'Women',
    sku: 'SET-BRZ-021',
    price: 115.00,
    imageSource: 'Shop_images/2/cup1-500x750.jpeg',
    description: 'Lightweight two-piece summer crop top and matching shorts set.',
    sizes: ['S', 'M', 'L'],
    colors: ['#f8fafc'],
    stock: 16
  },
  {
    id: 'feed-9',
    name: 'Midnight Silk Dress',
    category: 'one-pieces',
    subcategory: 'evening-dress',
    targetAudience: 'Women',
    sku: 'DRS-MID-022',
    price: 320.00,
    imageSource: 'Shop_images/3/dressblack3-500x750.jpeg',
    description: 'Elegant midnight black silk evening gown.',
    sizes: ['S', 'M', 'L'],
    colors: ['#000000'],
    stock: 10
  },
  {
    id: 'feed-10',
    name: 'Knotted Casual Tee',
    category: 'tops',
    subcategory: 't-shirts',
    targetAudience: 'Women',
    sku: 'TOP-KNT-023',
    price: 55.00,
    imageSource: 'Shop_images/5/knotted1-500x750.jpeg',
    description: 'Relaxed cotton everyday tee with front knot detail.',
    sizes: ['S', 'M', 'L'],
    colors: ['#ffffff'],
    stock: 30
  },
  {
    id: 'feed-11',
    name: 'Sculpting Leggings',
    category: 'bottoms',
    subcategory: 'activewear',
    targetAudience: 'Women',
    sku: 'BTM-LEG-024',
    price: 85.00,
    imageSource: 'Shop_images/6/leggings1-500x750.jpeg',
    description: 'High-compression sculpting leggings for workout and studio.',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['#0f172a'],
    stock: 35
  },
  {
    id: 'feed-12',
    name: 'Cargo Pocket Trousers',
    category: 'bottoms',
    subcategory: 'cargo',
    targetAudience: 'Men',
    sku: 'BTM-CRG-025',
    price: 110.00,
    imageSource: 'Shop_images/9/pocketmen1-500x750.jpeg',
    description: 'Multi-pocket utility cargo trousers with tapered cuff.',
    sizes: ['30', '32', '34', '36'],
    colors: ['#3f3f46'],
    stock: 20
  },
  {
    id: 'feed-13',
    name: 'Distressed Boyfriend Jeans',
    category: 'bottoms',
    subcategory: 'denim',
    targetAudience: 'Women',
    sku: 'BTM-DNM-026',
    price: 160.00,
    imageSource: 'Shop_images/10/ripped1-500x750.jpeg',
    description: 'Relaxed vintage wash denim with hand-distressed detailing.',
    sizes: ['26', '28', '30', '32'],
    colors: ['#60a5fa'],
    stock: 15
  },
  {
    id: 'feed-14',
    name: 'Bell Sleeve Blouse',
    category: 'tops',
    subcategory: 'blouses',
    targetAudience: 'Women',
    sku: 'TOP-BEL-027',
    price: 145.00,
    imageSource: 'Shop_images/11/sleev1-500x750.jpeg',
    description: 'Dramatic bell sleeve lightweight crepe blouse.',
    sizes: ['S', 'M', 'L'],
    colors: ['#ffffff'],
    stock: 14
  },
  {
    id: 'feed-15',
    name: 'Women Halter Neck Printed Jumpsuit',
    category: 'one-pieces',
    subcategory: 'jumpsuits',
    targetAudience: 'Women',
    sku: 'ONE-JMP-028',
    price: 65.00,
    imageSource: 'Shop_images/14/bTgDVAex_00915cef3b634c61a7a77980d8384727.jpg',
    description: 'Elegant halter neck jumpsuit featuring a vibrant print and comfortable fit.',
    sizes: ['S', 'M', 'L'],
    colors: ['#f43f5e'],
    stock: 22
  },
  {
    id: 'feed-16',
    name: 'Women Solid Shirt Dress with Belt',
    category: 'one-pieces',
    subcategory: 'shirt-dress',
    targetAudience: 'Women',
    sku: 'ONE-SHR-029',
    price: 78.00,
    imageSource: 'Shop_images/15/1000016314131-Red-RED-1000016314131_01-2100.jpg',
    description: 'A versatile solid shirt dress with a waist belt for a flattering silhouette.',
    sizes: ['S', 'M', 'L'],
    colors: ['#b91c1c'],
    stock: 25
  },
  {
    id: 'feed-17',
    name: 'Chemistry Floral Print Midi Dress',
    category: 'one-pieces',
    subcategory: 'midi-dress',
    targetAudience: 'Women',
    sku: 'ONE-FLR-030',
    price: 89.00,
    imageSource: 'Shop_images/16/2062af47-4098-4cc2-9e3f-f36ebca76b881725273460897-Chemistry-Women-Dresses-9631725273460568-5.jpg',
    description: 'A beautiful floral print midi dress from Chemistry with premium fabric.',
    sizes: ['S', 'M', 'L'],
    colors: ['#1e293b'],
    stock: 19
  },
  {
    id: 'top-1',
    name: 'Structured Double-Breasted Trench',
    category: 'outerwear',
    subcategory: 'trench-coats',
    targetAudience: 'Women',
    sku: 'OUT-TRN-031',
    price: 520.00,
    imageSource: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=900&q=85',
    description: 'Water-repellent gabardine classic tailored trench coat with horn buttons.',
    sizes: ['S', 'M', 'L'],
    colors: ['#d4b996', '#1c1917'],
    stock: 12
  },
  {
    id: 'top-2',
    name: 'Minimalist Relaxed Cashmere Knit',
    category: 'tops',
    subcategory: 'sweaters',
    targetAudience: 'Unisex',
    sku: 'TOP-CSH-032',
    price: 290.00,
    imageSource: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=900&q=85',
    description: '100% Grade-A Mongolian cashmere relaxed crewneck sweater.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#e5e7eb', '#78716c'],
    stock: 18
  }
];

function sanitizeFolderName(name) {
  return name.replace(/[<>:"/\\|?*]+/g, '').trim();
}

async function downloadOrCopyImage(source, destFile) {
  if (source.startsWith('http://') || source.startsWith('https://')) {
    const res = await fetch(source);
    if (!res.ok) throw new Error(`Failed to fetch ${source}: ${res.statusText}`);
    const arrayBuffer = await res.arrayBuffer();
    fs.writeFileSync(destFile, Buffer.from(arrayBuffer));
  } else {
    let relPath = source.startsWith('/') ? source.slice(1) : source;
    const localSrc = path.join(PUBLIC_DIR, relPath);
    if (fs.existsSync(localSrc)) {
      fs.copyFileSync(localSrc, destFile);
    } else {
      console.warn(`Local file not found: ${localSrc}`);
    }
  }
}

function escapeSql(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') return val;
  return `'${String(val).replace(/'/g, "''").replace(/\\/g, '\\\\')}'`;
}

async function main() {
  console.log(`Starting download and organization for ${PRODUCTS.length} products...`);

  [CATALOG_DIR, PUBLIC_CATALOG_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  const sqlStatements = [];
  sqlStatements.push(`-- VogueSocial Products Catalog MySQL Seed Script`);
  sqlStatements.push(`-- Generated: ${new Date().toISOString()}`);
  sqlStatements.push(`USE voguesocial_db;\n`);

  const manifest = [];

  for (let i = 0; i < PRODUCTS.length; i++) {
    const prod = PRODUCTS[i];
    const folderName = sanitizeFolderName(prod.name);

    const prodDir = path.join(CATALOG_DIR, folderName);
    const pubProdDir = path.join(PUBLIC_CATALOG_DIR, folderName);

    [prodDir, pubProdDir].forEach(d => {
      if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
    });

    const ext = prod.imageSource.includes('.png') ? '.png' : '.jpg';
    const imgFilename = `image${ext}`;
    const imgDestPath = path.join(prodDir, imgFilename);
    const pubImgDestPath = path.join(pubProdDir, imgFilename);

    console.log(`[${i + 1}/${PRODUCTS.length}] Processing: "${prod.name}"...`);

    try {
      await downloadOrCopyImage(prod.imageSource, imgDestPath);
      if (fs.existsSync(imgDestPath)) {
        fs.copyFileSync(imgDestPath, pubImgDestPath);
      }
    } catch (err) {
      console.error(`Error downloading image for ${prod.name}:`, err.message);
    }

    const publicUrl = `/product_catalog/${encodeURIComponent(folderName)}/${imgFilename}`;

    const metadata = {
      id: prod.id,
      vendor_id: DEFAULT_VENDOR_ID,
      name: prod.name,
      category: prod.category,
      subcategory: prod.subcategory,
      target_audience: prod.targetAudience,
      sku: prod.sku,
      description: prod.description,
      price: prod.price,
      currency: 'USD',
      image_url: publicUrl,
      local_file_path: imgDestPath,
      stock: prod.stock,
      status: 'live',
      sizes: prod.sizes,
      colors: prod.colors,
      created_at: new Date().toISOString()
    };

    fs.writeFileSync(path.join(prodDir, 'product.json'), JSON.stringify(metadata, null, 2));
    fs.writeFileSync(path.join(pubProdDir, 'product.json'), JSON.stringify(metadata, null, 2));

    manifest.push(metadata);

    const sql = `INSERT INTO products (id, vendor_id, name, category, subcategory, target_audience, sku, description, price, currency, image_url, stock, status, created_at)
VALUES (
  ${escapeSql(metadata.id)},
  ${escapeSql(metadata.vendor_id)},
  ${escapeSql(metadata.name)},
  ${escapeSql(metadata.category)},
  ${escapeSql(metadata.subcategory)},
  ${escapeSql(metadata.target_audience)},
  ${escapeSql(metadata.sku)},
  ${escapeSql(metadata.description)},
  ${metadata.price},
  'USD',
  ${escapeSql(metadata.image_url)},
  ${metadata.stock},
  'live',
  NOW()
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  category = VALUES(category),
  subcategory = VALUES(subcategory),
  target_audience = VALUES(target_audience),
  sku = VALUES(sku),
  description = VALUES(description),
  price = VALUES(price),
  image_url = VALUES(image_url),
  stock = VALUES(stock),
  status = VALUES(status);`;

    sqlStatements.push(sql);
  }

  fs.writeFileSync(path.join(CATALOG_DIR, 'catalog_manifest.json'), JSON.stringify(manifest, null, 2));
  fs.writeFileSync(path.join(PUBLIC_CATALOG_DIR, 'catalog_manifest.json'), JSON.stringify(manifest, null, 2));

  const sqlContent = sqlStatements.join('\n\n');
  const sqlPath = path.join(CATALOG_DIR, 'seed_products.sql');
  fs.writeFileSync(sqlPath, sqlContent);

  console.log(`\n Successfully organized ${PRODUCTS.length} products!`);
  console.log(` Catalog root: ${CATALOG_DIR}`);
  console.log(` Web-served catalog: ${PUBLIC_CATALOG_DIR}`);
  console.log(` SQL migration script: ${sqlPath}`);
}

main().catch(err => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
