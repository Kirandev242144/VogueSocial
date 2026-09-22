-- VogueSocial Products Catalog MySQL Seed Script

-- Generated: 2026-09-19T08:15:31.038Z

USE voguesocial_db;


INSERT INTO products (id, vendor_id, name, category, subcategory, target_audience, sku, description, price, currency, image_url, stock, status, created_at)
VALUES (
  'shp-1',
  'ec9e5c47-4d4a-4998-b4b3-16d228f9615c',
  'Floral Print Puff Sleeve A-Line Maxi Dress',
  'dresses',
  'maxi-dress',
  'Women',
  'DRS-FLR-001',
  'Balances athletic shoulders with flattering A-line flare. High quality breathable summer fabric.',
  59.99,
  'USD',
  '/product_catalog/Floral%20Print%20Puff%20Sleeve%20A-Line%20Maxi%20Dress/image.jpg',
  25,
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
  status = VALUES(status);

INSERT INTO products (id, vendor_id, name, category, subcategory, target_audience, sku, description, price, currency, image_url, stock, status, created_at)
VALUES (
  'shp-2',
  'ec9e5c47-4d4a-4998-b4b3-16d228f9615c',
  'White & Black Floral Print Column Dress',
  'dresses',
  'column-dress',
  'Women',
  'DRS-WBF-002',
  'Bold monochrome motif creates clean vertical visual lines. Perfect for both day and evening.',
  85,
  'USD',
  '/product_catalog/White%20%26%20Black%20Floral%20Print%20Column%20Dress/image.jpg',
  18,
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
  status = VALUES(status);

INSERT INTO products (id, vendor_id, name, category, subcategory, target_audience, sku, description, price, currency, image_url, stock, status, created_at)
VALUES (
  'shp-3',
  'ec9e5c47-4d4a-4998-b4b3-16d228f9615c',
  'Classic Black Mini Shift Dress',
  'dresses',
  'mini-dress',
  'Women',
  'DRS-BLK-003',
  'Essential wardrobe staple that layers under structured jackets.',
  45,
  'USD',
  '/product_catalog/Classic%20Black%20Mini%20Shift%20Dress/image.jpg',
  30,
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
  status = VALUES(status);

INSERT INTO products (id, vendor_id, name, category, subcategory, target_audience, sku, description, price, currency, image_url, stock, status, created_at)
VALUES (
  'shp-4',
  'ec9e5c47-4d4a-4998-b4b3-16d228f9615c',
  'Red Embroidered Cotton Tiered Dress',
  'dresses',
  'tiered-dress',
  'Women',
  'DRS-RED-004',
  'Warm ruby tone with artisan embroidery for effortless vibrancy.',
  69.99,
  'USD',
  '/product_catalog/Red%20Embroidered%20Cotton%20Tiered%20Dress/image.jpg',
  20,
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
  status = VALUES(status);

INSERT INTO products (id, vendor_id, name, category, subcategory, target_audience, sku, description, price, currency, image_url, stock, status, created_at)
VALUES (
  'shp-5',
  'ec9e5c47-4d4a-4998-b4b3-16d228f9615c',
  'Black Leather Biker Moto Jacket',
  'outerwear',
  'moto-jacket',
  'Unisex',
  'OUT-LTR-005',
  'Adds a high-fashion rebellious contrast over romantic floral dresses. Premium faux grain leather.',
  149,
  'USD',
  '/product_catalog/Black%20Leather%20Biker%20Moto%20Jacket/image.jpg',
  15,
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
  status = VALUES(status);

INSERT INTO products (id, vendor_id, name, category, subcategory, target_audience, sku, description, price, currency, image_url, stock, status, created_at)
VALUES (
  'shp-6',
  'ec9e5c47-4d4a-4998-b4b3-16d228f9615c',
  'Linen Resort Button Down Oversized Shirt',
  'tops',
  'button-down',
  'Unisex',
  'TOP-LIN-006',
  'Lightweight breathable weave perfect for sunny weekend strolls.',
  65,
  'USD',
  '/product_catalog/Linen%20Resort%20Button%20Down%20Oversized%20Shirt/image.jpg',
  35,
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
  status = VALUES(status);

INSERT INTO products (id, vendor_id, name, category, subcategory, target_audience, sku, description, price, currency, image_url, stock, status, created_at)
VALUES (
  'shp-7',
  'ec9e5c47-4d4a-4998-b4b3-16d228f9615c',
  'High-Waist Tailored Pleated Trousers',
  'bottoms',
  'trousers',
  'Women',
  'BTM-TRS-007',
  'Elongates legs with crisp front pleating and sharp tailoring.',
  89,
  'USD',
  '/product_catalog/High-Waist%20Tailored%20Pleated%20Trousers/image.jpg',
  22,
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
  status = VALUES(status);

INSERT INTO products (id, vendor_id, name, category, subcategory, target_audience, sku, description, price, currency, image_url, stock, status, created_at)
VALUES (
  'shp-8',
  'ec9e5c47-4d4a-4998-b4b3-16d228f9615c',
  'Emerald Silk Bias Cut Midi Slip Dress',
  'dresses',
  'slip-dress',
  'Women',
  'DRS-SLK-008',
  'Ultra-luxurious drape that glides smoothly over natural curves.',
  110,
  'USD',
  '/product_catalog/Emerald%20Silk%20Bias%20Cut%20Midi%20Slip%20Dress/image.jpg',
  14,
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
  status = VALUES(status);

INSERT INTO products (id, vendor_id, name, category, subcategory, target_audience, sku, description, price, currency, image_url, stock, status, created_at)
VALUES (
  'shp-9',
  'ec9e5c47-4d4a-4998-b4b3-16d228f9615c',
  'Minimalist Gold Ankle Strap Heeled Sandals',
  'shoes',
  'heels',
  'Women',
  'SHO-SAN-009',
  'Clean delicate lines elevate any dress without overpowering.',
  120,
  'USD',
  '/product_catalog/Minimalist%20Gold%20Ankle%20Strap%20Heeled%20Sandals/image.jpg',
  19,
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
  status = VALUES(status);

INSERT INTO products (id, vendor_id, name, category, subcategory, target_audience, sku, description, price, currency, image_url, stock, status, created_at)
VALUES (
  'shp-10',
  'ec9e5c47-4d4a-4998-b4b3-16d228f9615c',
  'Structured Artisanal Leather Crossbody Tote',
  'accessories',
  'bags',
  'Women',
  'ACC-TOT-010',
  'Architectural silhouette crafted from buttery Italian calf leather.',
  175,
  'USD',
  '/product_catalog/Structured%20Artisanal%20Leather%20Crossbody%20Tote/image.jpg',
  16,
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
  status = VALUES(status);

INSERT INTO products (id, vendor_id, name, category, subcategory, target_audience, sku, description, price, currency, image_url, stock, status, created_at)
VALUES (
  'shp-11',
  'ec9e5c47-4d4a-4998-b4b3-16d228f9615c',
  'Oversized Wool Blend Boucle Coat',
  'outerwear',
  'coats',
  'Women',
  'OUT-BOU-011',
  'Statement cocoon silhouette that adds runway drama to daily outfits.',
  220,
  'USD',
  '/product_catalog/Oversized%20Wool%20Blend%20Boucle%20Coat/image.jpg',
  12,
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
  status = VALUES(status);

INSERT INTO products (id, vendor_id, name, category, subcategory, target_audience, sku, description, price, currency, image_url, stock, status, created_at)
VALUES (
  'shp-12',
  'ec9e5c47-4d4a-4998-b4b3-16d228f9615c',
  'Pleated Satin Evening Midi Skirt',
  'bottoms',
  'skirts',
  'Women',
  'BTM-SKR-012',
  'Liquid sheen catches evening candlelight effortlessly.',
  78,
  'USD',
  '/product_catalog/Pleated%20Satin%20Evening%20Midi%20Skirt/image.jpg',
  24,
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
  status = VALUES(status);

INSERT INTO products (id, vendor_id, name, category, subcategory, target_audience, sku, description, price, currency, image_url, stock, status, created_at)
VALUES (
  'match-2',
  'ec9e5c47-4d4a-4998-b4b3-16d228f9615c',
  'Premium Cotton T-Shirt',
  'tops',
  't-shirts',
  'Unisex',
  'TOP-COT-013',
  '100% combed ringspun cotton heavyweight crewneck tee.',
  29.99,
  'USD',
  '/product_catalog/Premium%20Cotton%20T-Shirt/image.jpg',
  50,
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
  status = VALUES(status);

INSERT INTO products (id, vendor_id, name, category, subcategory, target_audience, sku, description, price, currency, image_url, stock, status, created_at)
VALUES (
  'feed-1',
  'ec9e5c47-4d4a-4998-b4b3-16d228f9615c',
  'Structured Wool Blazer',
  'outerwear',
  'blazers',
  'Women',
  'OUT-BLZ-014',
  'Structured double-breasted wool blazer with tailored structure.',
  280,
  'USD',
  '/product_catalog/Structured%20Wool%20Blazer/image.jpg',
  15,
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
  status = VALUES(status);

INSERT INTO products (id, vendor_id, name, category, subcategory, target_audience, sku, description, price, currency, image_url, stock, status, created_at)
VALUES (
  'feed-2',
  'ec9e5c47-4d4a-4998-b4b3-16d228f9615c',
  'Wide-Leg Silk Trousers',
  'bottoms',
  'trousers',
  'Women',
  'BTM-TRS-015',
  'Wide-leg silk trousers crafted from lustrous pure silk.',
  195,
  'USD',
  '/product_catalog/Wide-Leg%20Silk%20Trousers/image.jpg',
  18,
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
  status = VALUES(status);

INSERT INTO products (id, vendor_id, name, category, subcategory, target_audience, sku, description, price, currency, image_url, stock, status, created_at)
VALUES (
  'feed-3',
  'ec9e5c47-4d4a-4998-b4b3-16d228f9615c',
  'Pointed Toe Ankle Boots',
  'shoes',
  'boots',
  'Women',
  'SHO-BOT-016',
  'Pointed toe Italian leather ankle boots with sleek silhouette.',
  450,
  'USD',
  '/product_catalog/Pointed%20Toe%20Ankle%20Boots/image.jpg',
  10,
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
  status = VALUES(status);

INSERT INTO products (id, vendor_id, name, category, subcategory, target_audience, sku, description, price, currency, image_url, stock, status, created_at)
VALUES (
  'feed-4',
  'ec9e5c47-4d4a-4998-b4b3-16d228f9615c',
  'Ribbed Tank Top',
  'tops',
  'tanks',
  'Women',
  'TOP-TNK-017',
  'Minimalist ribbed knit cotton tank top for effortless layering.',
  45,
  'USD',
  '/product_catalog/Ribbed%20Tank%20Top/image.jpg',
  40,
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
  status = VALUES(status);

INSERT INTO products (id, vendor_id, name, category, subcategory, target_audience, sku, description, price, currency, image_url, stock, status, created_at)
VALUES (
  'feed-5',
  'ec9e5c47-4d4a-4998-b4b3-16d228f9615c',
  'Classic Gold Hoops',
  'accessories',
  'jewelry',
  'Women',
  'ACC-JW-018',
  'Polished chunky gold-plated hoops with secure latch.',
  120,
  'USD',
  '/product_catalog/Classic%20Gold%20Hoops/image.jpg',
  25,
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
  status = VALUES(status);

INSERT INTO products (id, vendor_id, name, category, subcategory, target_audience, sku, description, price, currency, image_url, stock, status, created_at)
VALUES (
  'feed-6',
  'ec9e5c47-4d4a-4998-b4b3-16d228f9615c',
  'No Human Is Illegal T-Shirt',
  'tops',
  'graphic-tees',
  'Unisex',
  'TOP-GRP-019',
  'Statement cotton t-shirt with heart barbed wire graphic. 100% of proceeds go to humanitarian aid.',
  35,
  'USD',
  '/product_catalog/No%20Human%20Is%20Illegal%20T-Shirt/image.png',
  60,
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
  status = VALUES(status);

INSERT INTO products (id, vendor_id, name, category, subcategory, target_audience, sku, description, price, currency, image_url, stock, status, created_at)
VALUES (
  'feed-7',
  'ec9e5c47-4d4a-4998-b4b3-16d228f9615c',
  'Vibrant Summer Floral Dress',
  'dresses',
  'summer-dress',
  'Women',
  'DRS-GRN-020',
  'Emerald green tiered floral wrap dress for warm summer days.',
  120,
  'USD',
  '/product_catalog/Vibrant%20Summer%20Floral%20Dress/image.jpg',
  22,
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
  status = VALUES(status);

INSERT INTO products (id, vendor_id, name, category, subcategory, target_audience, sku, description, price, currency, image_url, stock, status, created_at)
VALUES (
  'feed-8',
  'ec9e5c47-4d4a-4998-b4b3-16d228f9615c',
  'Summer Breeze Set',
  'one-pieces',
  'matching-sets',
  'Women',
  'SET-BRZ-021',
  'Lightweight two-piece summer crop top and matching shorts set.',
  115,
  'USD',
  '/product_catalog/Summer%20Breeze%20Set/image.jpg',
  16,
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
  status = VALUES(status);

INSERT INTO products (id, vendor_id, name, category, subcategory, target_audience, sku, description, price, currency, image_url, stock, status, created_at)
VALUES (
  'feed-9',
  'ec9e5c47-4d4a-4998-b4b3-16d228f9615c',
  'Midnight Silk Dress',
  'one-pieces',
  'evening-dress',
  'Women',
  'DRS-MID-022',
  'Elegant midnight black silk evening gown.',
  320,
  'USD',
  '/product_catalog/Midnight%20Silk%20Dress/image.jpg',
  10,
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
  status = VALUES(status);

INSERT INTO products (id, vendor_id, name, category, subcategory, target_audience, sku, description, price, currency, image_url, stock, status, created_at)
VALUES (
  'feed-10',
  'ec9e5c47-4d4a-4998-b4b3-16d228f9615c',
  'Knotted Casual Tee',
  'tops',
  't-shirts',
  'Women',
  'TOP-KNT-023',
  'Relaxed cotton everyday tee with front knot detail.',
  55,
  'USD',
  '/product_catalog/Knotted%20Casual%20Tee/image.jpg',
  30,
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
  status = VALUES(status);

INSERT INTO products (id, vendor_id, name, category, subcategory, target_audience, sku, description, price, currency, image_url, stock, status, created_at)
VALUES (
  'feed-11',
  'ec9e5c47-4d4a-4998-b4b3-16d228f9615c',
  'Sculpting Leggings',
  'bottoms',
  'activewear',
  'Women',
  'BTM-LEG-024',
  'High-compression sculpting leggings for workout and studio.',
  85,
  'USD',
  '/product_catalog/Sculpting%20Leggings/image.jpg',
  35,
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
  status = VALUES(status);

INSERT INTO products (id, vendor_id, name, category, subcategory, target_audience, sku, description, price, currency, image_url, stock, status, created_at)
VALUES (
  'feed-12',
  'ec9e5c47-4d4a-4998-b4b3-16d228f9615c',
  'Cargo Pocket Trousers',
  'bottoms',
  'cargo',
  'Men',
  'BTM-CRG-025',
  'Multi-pocket utility cargo trousers with tapered cuff.',
  110,
  'USD',
  '/product_catalog/Cargo%20Pocket%20Trousers/image.jpg',
  20,
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
  status = VALUES(status);

INSERT INTO products (id, vendor_id, name, category, subcategory, target_audience, sku, description, price, currency, image_url, stock, status, created_at)
VALUES (
  'feed-13',
  'ec9e5c47-4d4a-4998-b4b3-16d228f9615c',
  'Distressed Boyfriend Jeans',
  'bottoms',
  'denim',
  'Women',
  'BTM-DNM-026',
  'Relaxed vintage wash denim with hand-distressed detailing.',
  160,
  'USD',
  '/product_catalog/Distressed%20Boyfriend%20Jeans/image.jpg',
  15,
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
  status = VALUES(status);

INSERT INTO products (id, vendor_id, name, category, subcategory, target_audience, sku, description, price, currency, image_url, stock, status, created_at)
VALUES (
  'feed-14',
  'ec9e5c47-4d4a-4998-b4b3-16d228f9615c',
  'Bell Sleeve Blouse',
  'tops',
  'blouses',
  'Women',
  'TOP-BEL-027',
  'Dramatic bell sleeve lightweight crepe blouse.',
  145,
  'USD',
  '/product_catalog/Bell%20Sleeve%20Blouse/image.jpg',
  14,
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
  status = VALUES(status);

INSERT INTO products (id, vendor_id, name, category, subcategory, target_audience, sku, description, price, currency, image_url, stock, status, created_at)
VALUES (
  'feed-15',
  'ec9e5c47-4d4a-4998-b4b3-16d228f9615c',
  'Women Halter Neck Printed Jumpsuit',
  'one-pieces',
  'jumpsuits',
  'Women',
  'ONE-JMP-028',
  'Elegant halter neck jumpsuit featuring a vibrant print and comfortable fit.',
  65,
  'USD',
  '/product_catalog/Women%20Halter%20Neck%20Printed%20Jumpsuit/image.jpg',
  22,
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
  status = VALUES(status);

INSERT INTO products (id, vendor_id, name, category, subcategory, target_audience, sku, description, price, currency, image_url, stock, status, created_at)
VALUES (
  'feed-16',
  'ec9e5c47-4d4a-4998-b4b3-16d228f9615c',
  'Women Solid Shirt Dress with Belt',
  'one-pieces',
  'shirt-dress',
  'Women',
  'ONE-SHR-029',
  'A versatile solid shirt dress with a waist belt for a flattering silhouette.',
  78,
  'USD',
  '/product_catalog/Women%20Solid%20Shirt%20Dress%20with%20Belt/image.jpg',
  25,
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
  status = VALUES(status);

INSERT INTO products (id, vendor_id, name, category, subcategory, target_audience, sku, description, price, currency, image_url, stock, status, created_at)
VALUES (
  'feed-17',
  'ec9e5c47-4d4a-4998-b4b3-16d228f9615c',
  'Chemistry Floral Print Midi Dress',
  'one-pieces',
  'midi-dress',
  'Women',
  'ONE-FLR-030',
  'A beautiful floral print midi dress from Chemistry with premium fabric.',
  89,
  'USD',
  '/product_catalog/Chemistry%20Floral%20Print%20Midi%20Dress/image.jpg',
  19,
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
  status = VALUES(status);

INSERT INTO products (id, vendor_id, name, category, subcategory, target_audience, sku, description, price, currency, image_url, stock, status, created_at)
VALUES (
  'top-1',
  'ec9e5c47-4d4a-4998-b4b3-16d228f9615c',
  'Structured Double-Breasted Trench',
  'outerwear',
  'trench-coats',
  'Women',
  'OUT-TRN-031',
  'Water-repellent gabardine classic tailored trench coat with horn buttons.',
  520,
  'USD',
  '/product_catalog/Structured%20Double-Breasted%20Trench/image.jpg',
  12,
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
  status = VALUES(status);

INSERT INTO products (id, vendor_id, name, category, subcategory, target_audience, sku, description, price, currency, image_url, stock, status, created_at)
VALUES (
  'top-2',
  'ec9e5c47-4d4a-4998-b4b3-16d228f9615c',
  'Minimalist Relaxed Cashmere Knit',
  'tops',
  'sweaters',
  'Unisex',
  'TOP-CSH-032',
  '100% Grade-A Mongolian cashmere relaxed crewneck sweater.',
  290,
  'USD',
  '/product_catalog/Minimalist%20Relaxed%20Cashmere%20Knit/image.jpg',
  18,
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
  status = VALUES(status);