export const DOC_SECTIONS = [
  {
    id: 'overview',
    title: 'What is VogueSocial & Features',
    category: 'Architecture',
    badge: 'Start Here'
  },
  {
    id: 'how-it-works',
    title: 'The Escrow Referee & Money Flow',
    category: 'Architecture',
    badge: 'Must Read'
  },
  {
    id: 'payment-escrow',
    title: 'Stripe Escrow & Payments',
    category: 'Finance & Payments',
    badge: 'Critical'
  },
  {
    id: 'logistics-delivery',
    title: 'Shipping & Delivery (POD)',
    category: 'Logistics',
    badge: 'Automated'
  },
  {
    id: 'ai-tryon',
    title: 'AI Virtual Try-On Pipeline',
    category: 'Computer Vision',
    badge: 'GPU Cluster'
  },
  {
    id: 'database-erd',
    title: 'Database Schema & ERD',
    category: 'Data Architecture',
    badge: 'Relational Model'
  },
  {
    id: 'api-reference',
    title: 'REST API & Webhooks',
    category: 'Developer Reference',
    badge: 'OpenAPI'
  },
  {
    id: 'mobile-app',
    title: 'Mobile App Architecture',
    category: 'Flutter Client',
    badge: 'iOS / Android'
  },
  {
    id: 'glossary',
    title: 'Platform Glossary (A–Z)',
    category: 'Reference',
    badge: 'Dictionary'
  }
];

export const GLOSSARY_TERMS = [
  {
    term: 'Escrow (Holding Vault)',
    category: 'Payments',
    definition: 'A secure financial mechanism where VogueSocial holds buyer funds in a segregated Stripe Platform vault upon checkout. Funds remain locked until the courier verifies physical delivery (POD), protecting both the buyer from non-delivery and the seller from unpaid orders.'
  },
  {
    term: 'Stripe Connect',
    category: 'Payments',
    definition: 'Stripe’s multi-party marketplace routing engine. Allows VogueSocial to onboard independent fashion brands and merchants, verify their legal business identity (KYC), and programmatically transfer 95% net payouts directly into their connected bank accounts.'
  },
  {
    term: 'Proof of Delivery (POD)',
    category: 'Logistics',
    definition: 'Cryptographic delivery confirmation transmitted via carrier webhook (DHL, FedEx, UPS) when the final-mile courier collects the recipient’s electronic signature and geolocation coordinates.'
  },
  {
    term: 'Airway Bill (AWB)',
    category: 'Logistics',
    definition: 'A unique tracking number issued by air cargo and express courier companies (e.g. FX28301948IN, 1Z999999). VogueSocial runs regex pattern auto-detection on AWBs to identify the courier instantly.'
  },
  {
    term: 'Separate Charges & Transfers',
    category: 'Payments',
    definition: 'The Stripe custody pattern chosen by VogueSocial. The platform charges the customer first, holds funds in escrow, and only creates a Stripe Transfer (`tr_...`) to the merchant’s connected account after delivery is verified.'
  },
  {
    term: 'Transfer Group',
    category: 'Payments',
    definition: 'A unique reconciliation string (e.g. `order_ORD-1841`) applied to both the customer PaymentIntent and merchant Transfer to guarantee 1:1 accounting parity and auditability.'
  },
  {
    term: 'Stripe Radar & 3D Secure 2.0',
    category: 'Security',
    definition: 'Machine learning fraud detection that analyzes cardholder risk in real-time, enforcing biometric cardholder authentication for high-risk or cross-border luxury purchases.'
  },
  {
    term: 'RMA (Return Merchandise Authorization)',
    category: 'Logistics',
    definition: 'The formal protocol for customer fashion returns. Returns bypass the corporate registered office and route directly to the merchant’s dedicated `return_warehouse_address`.'
  },
  {
    term: 'Direct Merchant Fulfillment',
    category: 'Logistics',
    definition: 'Decentralized fulfillment where merchants and fashion brands ship garments directly from their fulfillment facilities (Paris, Milan, Tokyo, London, New York) using their commercial courier contracts, eliminating platform warehousing costs.'
  },
  {
    term: 'Thin-Plate Spline (TPS) Warping',
    category: 'AI / Vision',
    definition: 'A non-rigid mathematical transformation algorithm that deforms a 2D flat garment photo to fit the 3D curves, pose keypoints, and torso shape of the user’s portrait.'
  },
  {
    term: 'DensePose Human Parsing',
    category: 'AI / Vision',
    definition: 'Deep learning segmentation that maps pixels of a human body portrait to a 3D surface mesh, separating head, limbs, skin, and existing clothing for virtual garment overlay.'
  },
  {
    term: 'WebAssembly (Wasm) Background Removal',
    category: 'AI / Vision',
    definition: 'Running deep learning models locally inside the user’s web browser via WebGPU and WebAssembly (`@imgly/background-removal`), generating transparent garment cutouts without uploading photos to an external server.'
  },
  {
    term: '5-Step Payout Verification Gate',
    category: 'Finance',
    definition: 'The mandatory automated checklist evaluated before escrow funds are transferred: 1) Stripe Payment Captured, 2) Carrier POD Verified, 3) Order Active, 4) No Active Chargeback, 5) Merchant KYC Verified.'
  },
  {
    term: '48-Hour Settlement Buffer Window',
    category: 'Finance',
    definition: 'A 48-hour safety hold after delivery confirmation allowing the shopper to inspect seams, fabric, and sizing before the 95% net payout is irrevocably released to the merchant.'
  }
];
