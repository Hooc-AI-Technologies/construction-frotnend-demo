import { getRelativeDateISO } from '../config/brand';

// ─── Types ─────────────────────────────────────────────────────────────────

export interface Professional {
  id: string;
  name: string;
  specialty: string;
  category: string;
  verified: boolean;
  rating: number;
  reviewCount: number;
  experienceYears: number;
  location: string;
  city: string;
  rate: number;
  rateUnit: 'day' | 'hour' | 'project';
  rateLabel: string;
  bio: string;
  skills: string[];
  credentials: string[];
  completedProjects: number;
  portfolio: string[];
  avatar: string;
  available: boolean;
  responseTime: string;
  languages: string[];
  insurance: boolean;
  escrowProtected: boolean;
}

export interface BulkTier {
  minQty: number;
  pricePerUnit: number;
  label: string;
}

export interface Material {
  id: string;
  name: string;
  supplier: string;
  category: string;
  rating: number;
  reviewCount: number;
  price: number;
  unit: string;
  moq: number;
  qtyStep: number;
  stock: number;
  stockUnit: string;
  bulkTiers: BulkTier[];
  specs: Record<string, string>;
  image: string;
  inStock: boolean;
  grade: string;
  compliance: string[];
  deliveryDays: number;
  description: string;
  weight: string;
}

// ─── Unsplash-style placeholder images ─────────────────────────────────────

const PRO_AVATARS: Record<string, string> = {
  rajesh: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
  vikram: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
  sunil: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
  ramesh: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=200&q=80',
  suresh: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80',
  pooja: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&q=80',
  ankit: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&q=80',
  deepak: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80',
  priya: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80',
  mohan: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=200&q=80',
  arun: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&q=80',
  kavita: 'https://images.unsplash.com/photo-1588685547965-79ccf581a3be?w=200&q=80',
};

const PORTFOLIO_CONSTRUCTION = [
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80',
  'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&q=80',
  'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=400&q=80',
  'https://images.unsplash.com/photo-1513467535987-fd81bc7d62f8?w=400&q=80',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80',
  'https://images.unsplash.com/photo-1590859808308-3d2d9c515b1a?w=400&q=80',
];

// ─── Professionals Seed Data ─────────────────────────────────────────────────

export const PROFESSIONALS_SEED: Professional[] = [
  {
    id: 'pro-001',
    name: 'Rajesh Sharma',
    specialty: 'Master Mason & Brickwork Specialist',
    category: 'Mason',
    verified: true,
    rating: 4.9,
    reviewCount: 127,
    experienceYears: 18,
    location: 'Sector 15, Noida',
    city: 'Noida',
    rate: 950,
    rateUnit: 'day',
    rateLabel: '₹950/day',
    bio: 'Expert mason with 18 years in residential and commercial construction. Specialised in brick masonry, plaster finishing, RCC work, and stone cladding. Known for precise workmanship and on-time project completion.',
    skills: ['Brick Masonry', 'RCC Work', 'Plaster Finishing', 'Stone Cladding', 'Waterproofing'],
    credentials: ['NSDC Certified Mason', 'Rajasthan Govt. Skilled Worker', 'ISO 9001 Compliant Work'],
    completedProjects: 94,
    portfolio: PORTFOLIO_CONSTRUCTION.slice(0, 4),
    avatar: PRO_AVATARS.rajesh,
    available: true,
    responseTime: '< 2 hours',
    languages: ['Hindi', 'English', 'Bhojpuri'],
    insurance: true,
    escrowProtected: true,
  },
  {
    id: 'pro-002',
    name: 'Vikram Singh',
    specialty: 'Electrician — Residential & Commercial',
    category: 'Electrician',
    verified: true,
    rating: 4.8,
    reviewCount: 203,
    experienceYears: 12,
    location: 'Lajpat Nagar, Delhi',
    city: 'Delhi',
    rate: 500,
    rateUnit: 'day',
    rateLabel: '₹500/day',
    bio: 'Licensed electrician with expertise in full-house wiring, panel upgrades, solar installations, and EV charger fitting. Carries valid IE licence and third-party liability insurance.',
    skills: ['Full Wiring', 'Panel Upgrades', 'Solar Panels', 'EV Chargers', 'Industrial Wiring'],
    credentials: ['IE Licence (Punjab)', 'CPRI Certified', 'ISA Member'],
    completedProjects: 186,
    portfolio: PORTFOLIO_CONSTRUCTION.slice(1, 5),
    avatar: PRO_AVATARS.vikram,
    available: true,
    responseTime: '< 1 hour',
    languages: ['Hindi', 'Punjabi', 'English'],
    insurance: true,
    escrowProtected: true,
  },
  {
    id: 'pro-003',
    name: 'Sunil Paswan',
    specialty: 'Senior Plumber — Pipes & Sanitation',
    category: 'Plumber',
    verified: true,
    rating: 4.9,
    reviewCount: 89,
    experienceYears: 14,
    location: 'Indirapuram, Ghaziabad',
    city: 'Ghaziabad',
    rate: 600,
    rateUnit: 'day',
    rateLabel: '₹600/day',
    bio: 'Expert plumber specialising in concealed plumbing, bathroom fittings, drainage systems, and water-tank installation. All work guaranteed for 12 months.',
    skills: ['Concealed Plumbing', 'Bathroom Fittings', 'Drainage', 'Water Tanks', 'Hot Water Systems'],
    credentials: ['CPWD Empanelled', 'ISP Member', 'Jal Shakti Trained'],
    completedProjects: 71,
    portfolio: PORTFOLIO_CONSTRUCTION.slice(2, 6),
    avatar: PRO_AVATARS.sunil,
    available: true,
    responseTime: '< 3 hours',
    languages: ['Hindi', 'Maithili'],
    insurance: true,
    escrowProtected: true,
  },
  {
    id: 'pro-004',
    name: 'Ramesh Patel',
    specialty: 'Master Electrician — High-Voltage',
    category: 'Electrician',
    verified: true,
    rating: 4.7,
    reviewCount: 156,
    experienceYears: 20,
    location: 'Bandra West, Mumbai',
    city: 'Mumbai',
    rate: 450,
    rateUnit: 'hour',
    rateLabel: '₹450/hr',
    bio: "High-voltage specialist with 20 years across Mumbai's commercial and industrial sector. Handles transformer installations, DG sets, and complex panel wiring.",
    skills: ['High Voltage', 'Transformer Installation', 'DG Sets', 'Panel Wiring', 'Load Balancing'],
    credentials: ['MERC Licensed', 'CPRI Grade A', 'Fire NOC Compliant'],
    completedProjects: 142,
    portfolio: PORTFOLIO_CONSTRUCTION.slice(0, 3),
    avatar: PRO_AVATARS.ramesh,
    available: true,
    responseTime: '< 4 hours',
    languages: ['Hindi', 'Marathi', 'Gujarati'],
    insurance: true,
    escrowProtected: true,
  },
  {
    id: 'pro-005',
    name: 'Suresh Kumar',
    specialty: 'Mason — Tiles & Flooring Specialist',
    category: 'Mason',
    verified: true,
    rating: 4.6,
    reviewCount: 74,
    experienceYears: 9,
    location: 'Electronic City, Bengaluru',
    city: 'Bengaluru',
    rate: 380,
    rateUnit: 'hour',
    rateLabel: '₹380/hr',
    bio: 'Flooring and tiling specialist focusing on vitrified, marble, and mosaic work. Delivers flawless grout lines and level finishes every time.',
    skills: ['Vitrified Tiles', 'Marble Flooring', 'Mosaic Work', 'Waterproof Bedding', 'Staircase Cladding'],
    credentials: ['Karnataka BBMP Empanelled', 'NSDC Tiles Specialist'],
    completedProjects: 58,
    portfolio: PORTFOLIO_CONSTRUCTION.slice(1, 4),
    avatar: PRO_AVATARS.suresh,
    available: false,
    responseTime: '< 6 hours',
    languages: ['Kannada', 'Tamil', 'Hindi'],
    insurance: false,
    escrowProtected: true,
  },
  {
    id: 'pro-006',
    name: 'Pooja Verma',
    specialty: 'Civil Contractor — Turnkey Projects',
    category: 'Civil Contractor',
    verified: true,
    rating: 4.8,
    reviewCount: 42,
    experienceYears: 11,
    location: 'Baner, Pune',
    city: 'Pune',
    rate: 0,
    rateUnit: 'project',
    rateLabel: 'Milestone-based quotation',
    bio: 'Experienced civil contractor managing end-to-end residential projects — from foundation to finishing. Known for transparent milestone payments and quality assurance.',
    skills: ['Project Management', 'Structural Work', 'Finishing', 'Waterproofing', 'Renovation'],
    credentials: ['CE Licence Maharashtra', 'ISO 9001:2015 Certified Firm', 'RERA Registered Agent'],
    completedProjects: 29,
    portfolio: PORTFOLIO_CONSTRUCTION.slice(2, 6),
    avatar: PRO_AVATARS.pooja,
    available: true,
    responseTime: '< 12 hours',
    languages: ['Marathi', 'Hindi', 'English'],
    insurance: true,
    escrowProtected: true,
  },
  {
    id: 'pro-007',
    name: 'Ankit Tiwari',
    specialty: 'Painter — Interior & Exterior',
    category: 'Painter',
    verified: true,
    rating: 4.7,
    reviewCount: 93,
    experienceYears: 8,
    location: 'Vaishali Nagar, Jaipur',
    city: 'Jaipur',
    rate: 350,
    rateUnit: 'day',
    rateLabel: '₹350/day',
    bio: 'Skilled painter with expertise in texture, wall putty, enamel, and waterproof exterior coatings. Asian Paints certified applicator.',
    skills: ['Texture Painting', 'Wall Putty', 'Enamel', 'Waterproof Exterior', 'Stencil Work'],
    credentials: ['Asian Paints Certified', 'Berger Authorised Applicator'],
    completedProjects: 112,
    portfolio: PORTFOLIO_CONSTRUCTION.slice(3, 6),
    avatar: PRO_AVATARS.ankit,
    available: true,
    responseTime: '< 2 hours',
    languages: ['Hindi', 'Rajasthani'],
    insurance: false,
    escrowProtected: true,
  },
  {
    id: 'pro-008',
    name: 'Deepak Nair',
    specialty: 'Structural Engineer & Consultant',
    category: 'Engineer',
    verified: true,
    rating: 4.9,
    reviewCount: 31,
    experienceYears: 16,
    location: 'Koramangala, Bengaluru',
    city: 'Bengaluru',
    rate: 2500,
    rateUnit: 'day',
    rateLabel: '₹2,500/day',
    bio: 'Licensed structural engineer with expertise in RCC design, soil testing interpretation, seismic analysis, and quality audits for residential and commercial buildings.',
    skills: ['RCC Design', 'Seismic Analysis', 'Quality Audit', 'Soil Testing', 'Retrofit Design'],
    credentials: ['M.Tech Structures IIT-B', 'IEI Fellow', 'KSCST Empanelled'],
    completedProjects: 47,
    portfolio: PORTFOLIO_CONSTRUCTION.slice(0, 3),
    avatar: PRO_AVATARS.deepak,
    available: true,
    responseTime: '< 8 hours',
    languages: ['Malayalam', 'Kannada', 'English', 'Hindi'],
    insurance: true,
    escrowProtected: true,
  },
  {
    id: 'pro-009',
    name: 'Priya Mehta',
    specialty: 'Interior Designer & Space Planner',
    category: 'Interior Designer',
    verified: true,
    rating: 4.8,
    reviewCount: 67,
    experienceYears: 7,
    location: 'Salt Lake, Kolkata',
    city: 'Kolkata',
    rate: 1500,
    rateUnit: 'day',
    rateLabel: '₹1,500/day',
    bio: 'Award-winning interior designer crafting modern, functional, and budget-conscious living spaces. Expertise in modular kitchens, false ceilings, and smart storage.',
    skills: ['Space Planning', 'Modular Kitchens', 'False Ceilings', '3D Rendering', 'Lighting Design'],
    credentials: ['NIFT Graduate', 'IIID Member', 'Houzz Pro Badge'],
    completedProjects: 53,
    portfolio: PORTFOLIO_CONSTRUCTION.slice(0, 4),
    avatar: PRO_AVATARS.priya,
    available: true,
    responseTime: '< 4 hours',
    languages: ['Bengali', 'Hindi', 'English'],
    insurance: true,
    escrowProtected: true,
  },
  {
    id: 'pro-010',
    name: 'Mohan Reddy',
    specialty: 'Waterproofing Specialist',
    category: 'Waterproofing',
    verified: true,
    rating: 4.6,
    reviewCount: 58,
    experienceYears: 13,
    location: 'Kukatpally, Hyderabad',
    city: 'Hyderabad',
    rate: 700,
    rateUnit: 'day',
    rateLabel: '₹700/day',
    bio: 'Expert in terrace, basement, and bathroom waterproofing using crystalline, bituminous, and polyurethane systems. 5-year leakage warranty on all projects.',
    skills: ['Terrace Waterproofing', 'Basement Waterproofing', 'Crystalline Systems', 'Polyurethane Coating', 'Epoxy Flooring'],
    credentials: ['Sika Authorised Applicator', 'BASF Certified', 'IGBC Green Trained'],
    completedProjects: 88,
    portfolio: PORTFOLIO_CONSTRUCTION.slice(2, 5),
    avatar: PRO_AVATARS.mohan,
    available: true,
    responseTime: '< 3 hours',
    languages: ['Telugu', 'Hindi', 'English'],
    insurance: true,
    escrowProtected: true,
  },
  {
    id: 'pro-011',
    name: 'Arun Krishnan',
    specialty: 'Carpenter & Woodwork Contractor',
    category: 'Carpenter',
    verified: true,
    rating: 4.7,
    reviewCount: 81,
    experienceYears: 15,
    location: 'T. Nagar, Chennai',
    city: 'Chennai',
    rate: 600,
    rateUnit: 'day',
    rateLabel: '₹600/day',
    bio: 'Expert carpenter specialising in teak/hardwood furniture, modular wardrobes, and custom joinery. All work hand-finished with BWR/BWP grade plywood.',
    skills: ['Custom Furniture', 'Wardrobes', 'Modular Joinery', 'Wood Carving', 'False Ceiling Frames'],
    credentials: ['CPCL Empanelled', 'Tamil Nadu Govt. Certified Craftsman'],
    completedProjects: 104,
    portfolio: PORTFOLIO_CONSTRUCTION.slice(1, 5),
    avatar: PRO_AVATARS.arun,
    available: true,
    responseTime: '< 5 hours',
    languages: ['Tamil', 'Malayalam', 'Hindi'],
    insurance: false,
    escrowProtected: true,
  },
  {
    id: 'pro-012',
    name: 'Kavita Rao',
    specialty: 'Architect — Residential & Villas',
    category: 'Architect',
    verified: true,
    rating: 4.9,
    reviewCount: 22,
    experienceYears: 10,
    location: 'Jubilee Hills, Hyderabad',
    city: 'Hyderabad',
    rate: 0,
    rateUnit: 'project',
    rateLabel: 'Quoted per project',
    bio: 'COA-registered architect designing sustainable, Vastu-compliant homes. Offers end-to-end services from concept to building plan approval and site supervision.',
    skills: ['Residential Design', 'Vastu Compliance', 'Building Plans', '3D Visualisation', 'Site Supervision'],
    credentials: ['COA Registered (AR-24689)', 'IGBC Associate', 'IIA Member'],
    completedProjects: 18,
    portfolio: PORTFOLIO_CONSTRUCTION.slice(0, 4),
    avatar: PRO_AVATARS.kavita,
    available: true,
    responseTime: '< 24 hours',
    languages: ['Telugu', 'English', 'Hindi'],
    insurance: true,
    escrowProtected: true,
  },
];

// ─── Materials Seed Data ─────────────────────────────────────────────────────

const MAT_IMAGES: Record<string, string> = {
  cement: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
  tmt: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&q=80',
  bricks: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&q=80',
  pipe: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80',
  sand: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=400&q=80',
  tiles: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80',
  paint: 'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=400&q=80',
  aggregate: 'https://images.unsplash.com/photo-1565608438257-fac3c27bdbec?w=400&q=80',
  steel_plate: 'https://images.unsplash.com/photo-1565009247694-2cc0c1a39aca?w=400&q=80',
  plywood: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80',
  wire: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&q=80',
  waterproof: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&q=80',
};

export const MATERIALS_SEED: Material[] = [
  {
    id: 'mat-001',
    name: 'UltraTech Super Cement OPC 53',
    supplier: 'UltraTech Cement Ltd.',
    category: 'Cement',
    rating: 4.8,
    reviewCount: 2341,
    price: 385,
    unit: '50 kg bag',
    moq: 10,
    qtyStep: 1,
    stock: 2400,
    stockUnit: 'bags',
    bulkTiers: [
      { minQty: 10, pricePerUnit: 385, label: '₹385/bag' },
      { minQty: 50, pricePerUnit: 370, label: '₹370/bag (50+ bags)' },
      { minQty: 200, pricePerUnit: 355, label: '₹355/bag (200+ bags)' },
    ],
    specs: { Grade: 'OPC 53', Standard: 'IS 12269', Setting: '30 min initial', Strength: '53 MPa', 'Pack Type': 'Moisture-proof PP bag' },
    image: MAT_IMAGES.cement,
    inStock: true,
    grade: 'OPC 53',
    compliance: ['IS 12269', 'BIS Mark'],
    deliveryDays: 2,
    description: 'High-strength OPC 53 grade cement ideal for RCC construction, foundations, and high-rise buildings.',
    weight: '50 kg',
  },
  {
    id: 'mat-002',
    name: 'Tata Tiscon TMT Rebar 12mm Fe500D',
    supplier: 'Tata Steel Ltd.',
    category: 'Steel',
    rating: 4.9,
    reviewCount: 1872,
    price: 64,
    unit: 'kg',
    moq: 100,
    qtyStep: 50,
    stock: 85000,
    stockUnit: 'kg',
    bulkTiers: [
      { minQty: 100, pricePerUnit: 64, label: '₹64/kg' },
      { minQty: 1000, pricePerUnit: 61, label: '₹61/kg (1T+)' },
      { minQty: 5000, pricePerUnit: 58, label: '₹58/kg (5T+)' },
    ],
    specs: { Grade: 'Fe500D', Diameter: '12mm', Length: '12m standard', Rib: 'High-rib pattern', 'Elongation': '>16%' },
    image: MAT_IMAGES.tmt,
    inStock: true,
    grade: 'Fe500D',
    compliance: ['IS 1786', 'BIS Mark', 'TATA Quality Certified'],
    deliveryDays: 3,
    description: 'Tata Tiscon TMT Fe500D rebars — earthquake resistant, superior weldability, and corrosion resistant.',
    weight: '1 kg',
  },
  {
    id: 'mat-003',
    name: 'Red Clay Bricks — First Class',
    supplier: 'Rajasthan Brick Works Pvt Ltd',
    category: 'Bricks',
    rating: 4.5,
    reviewCount: 834,
    price: 9.5,
    unit: 'piece',
    moq: 500,
    qtyStep: 500,
    stock: 250000,
    stockUnit: 'pieces',
    bulkTiers: [
      { minQty: 500, pricePerUnit: 9.5, label: '₹9.50/pc' },
      { minQty: 5000, pricePerUnit: 8.75, label: '₹8.75/pc (5,000+)' },
      { minQty: 20000, pricePerUnit: 8.25, label: '₹8.25/pc (20,000+)' },
    ],
    specs: { Class: 'First Class', Size: '230×115×75mm', Compressive: '>10.5 N/mm²', Absorption: '<20%', 'Efflorescence': 'Nil' },
    image: MAT_IMAGES.bricks,
    inStock: true,
    grade: 'First Class',
    compliance: ['IS 1077', 'BIS Mark'],
    deliveryDays: 4,
    description: 'First-class red clay bricks with uniform shape, consistent colour, and excellent compressive strength for load-bearing walls.',
    weight: '~3.2 kg',
  },
  {
    id: 'mat-004',
    name: 'Supreme SWR PVC Pipe 4" — 3m',
    supplier: 'Supreme Industries Ltd.',
    category: 'Pipes',
    rating: 4.6,
    reviewCount: 678,
    price: 620,
    unit: '3m length',
    moq: 5,
    qtyStep: 1,
    stock: 3200,
    stockUnit: 'lengths',
    bulkTiers: [
      { minQty: 5, pricePerUnit: 620, label: '₹620/length' },
      { minQty: 25, pricePerUnit: 595, label: '₹595/length (25+)' },
      { minQty: 100, pricePerUnit: 565, label: '₹565/length (100+)' },
    ],
    specs: { Material: 'uPVC', Size: '4" / 110mm OD', Length: '3 metres', Wall: 'SN2 stiffness class', Colour: 'Grey', 'Pressure': '6 kg/cm²' },
    image: MAT_IMAGES.pipe,
    inStock: true,
    grade: 'SWR Grade',
    compliance: ['IS 4985', 'IS 13592', 'BIS Mark'],
    deliveryDays: 2,
    description: 'Supreme SWR uPVC pipes for soil-waste-rainwater drainage in residential and commercial buildings.',
    weight: '4.2 kg',
  },
  {
    id: 'mat-005',
    name: 'Coarse River Sand (Washed)',
    supplier: 'GreenBuild Aggregates Co.',
    category: 'Aggregates',
    rating: 4.4,
    reviewCount: 419,
    price: 52,
    unit: 'CFT',
    moq: 100,
    qtyStep: 50,
    stock: 50000,
    stockUnit: 'CFT',
    bulkTiers: [
      { minQty: 100, pricePerUnit: 52, label: '₹52/CFT' },
      { minQty: 500, pricePerUnit: 48, label: '₹48/CFT (500+)' },
      { minQty: 2000, pricePerUnit: 45, label: '₹45/CFT (2,000+)' },
    ],
    specs: { Type: 'Coarse River Sand', Zone: 'Zone II (IS 383)', Fineness: '2.5–3.5 FM', Silt: '<6%', Moisture: '<5%', Source: 'Yamuna River Bed' },
    image: MAT_IMAGES.sand,
    inStock: true,
    grade: 'Zone II',
    compliance: ['IS 383', 'IS 2116'],
    deliveryDays: 1,
    description: 'Well-graded, washed river sand ideal for concrete mixing, plastering, and masonry mortar.',
    weight: '~47 kg/CFT',
  },
  {
    id: 'mat-006',
    name: 'Kajaria Astino Vitrified Tiles 600×600',
    supplier: 'Kajaria Ceramics Ltd.',
    category: 'Tiles',
    rating: 4.7,
    reviewCount: 1124,
    price: 65,
    unit: 'sq.ft',
    moq: 50,
    qtyStep: 10,
    stock: 15000,
    stockUnit: 'sq.ft',
    bulkTiers: [
      { minQty: 50, pricePerUnit: 65, label: '₹65/sq.ft' },
      { minQty: 500, pricePerUnit: 60, label: '₹60/sq.ft (500+)' },
      { minQty: 2000, pricePerUnit: 56, label: '₹56/sq.ft (2,000+)' },
    ],
    specs: { Size: '600×600mm', Thickness: '9mm', Surface: 'Polished', Slip: 'R9 Rating', Water: '<0.1%', 'Breaking': '>1300N' },
    image: MAT_IMAGES.tiles,
    inStock: true,
    grade: 'GVT Premium',
    compliance: ['IS 15622', 'CE Marked', 'ISO 9001'],
    deliveryDays: 5,
    description: 'Kajaria Astino polished vitrified tiles — elegant, durable, and low-maintenance for living rooms, kitchens, and offices.',
    weight: '~19 kg/sq.m',
  },
  {
    id: 'mat-007',
    name: 'Asian Paints Apex Weatherproof Exterior',
    supplier: 'Asian Paints Ltd.',
    category: 'Paints',
    rating: 4.8,
    reviewCount: 2108,
    price: 185,
    unit: 'litre',
    moq: 10,
    qtyStep: 1,
    stock: 8000,
    stockUnit: 'litres',
    bulkTiers: [
      { minQty: 10, pricePerUnit: 185, label: '₹185/L' },
      { minQty: 50, pricePerUnit: 175, label: '₹175/L (50L+)' },
      { minQty: 200, pricePerUnit: 165, label: '₹165/L (200L+)' },
    ],
    specs: { Type: 'Acrylic Emulsion', Coverage: '100–130 sq.ft/L (2 coats)', Finish: 'Matt', Durability: '6+ years', 'Drying': '2 hours recoat' },
    image: MAT_IMAGES.paint,
    inStock: true,
    grade: 'Premium',
    compliance: ['IS 15489', 'BIS Mark', 'Green Pro Certified'],
    deliveryDays: 2,
    description: 'Asian Paints Apex — India\'s #1 exterior paint with 6-year durability and UV/algae resistance.',
    weight: '1 kg/L approx',
  },
  {
    id: 'mat-008',
    name: '20mm Coarse Aggregate (Crushed Stone)',
    supplier: 'GreenBuild Aggregates Co.',
    category: 'Aggregates',
    rating: 4.5,
    reviewCount: 561,
    price: 38,
    unit: 'CFT',
    moq: 200,
    qtyStep: 100,
    stock: 100000,
    stockUnit: 'CFT',
    bulkTiers: [
      { minQty: 200, pricePerUnit: 38, label: '₹38/CFT' },
      { minQty: 1000, pricePerUnit: 35, label: '₹35/CFT (1,000+)' },
      { minQty: 5000, pricePerUnit: 32, label: '₹32/CFT (5,000+)' },
    ],
    specs: { Size: '20mm', Type: 'Crushed Granite', Shape: 'Cubical', Flakiness: '<15%', LA: '<30%', Source: 'Rajasthan Quarry' },
    image: MAT_IMAGES.aggregate,
    inStock: true,
    grade: 'Crushed Granite',
    compliance: ['IS 383'],
    deliveryDays: 1,
    description: 'Well-graded 20mm crushed granite aggregate for M20–M30 concrete mixes.',
    weight: '~44 kg/CFT',
  },
  {
    id: 'mat-009',
    name: 'SAIL HR Steel Plate 8mm IS 2062',
    supplier: 'Steel Authority of India Ltd.',
    category: 'Steel',
    rating: 4.7,
    reviewCount: 287,
    price: 72,
    unit: 'kg',
    moq: 200,
    qtyStep: 100,
    stock: 40000,
    stockUnit: 'kg',
    bulkTiers: [
      { minQty: 200, pricePerUnit: 72, label: '₹72/kg' },
      { minQty: 1000, pricePerUnit: 68, label: '₹68/kg (1T+)' },
      { minQty: 5000, pricePerUnit: 65, label: '₹65/kg (5T+)' },
    ],
    specs: { Grade: 'E250A', Thickness: '8mm', Width: '1250mm/1500mm', Standard: 'IS 2062', 'Yield': '>250 MPa' },
    image: MAT_IMAGES.steel_plate,
    inStock: true,
    grade: 'E250A',
    compliance: ['IS 2062', 'BIS Mark'],
    deliveryDays: 5,
    description: 'SAIL hot-rolled structural steel plates for fabrication, bridges, industrial structures, and heavy machinery.',
    weight: '62.8 kg/m²',
  },
  {
    id: 'mat-010',
    name: 'Greenply BWR Plywood 19mm',
    supplier: 'Greenply Industries Ltd.',
    category: 'Wood & Boards',
    rating: 4.6,
    reviewCount: 743,
    price: 92,
    unit: 'sq.ft',
    moq: 20,
    qtyStep: 5,
    stock: 5000,
    stockUnit: 'sq.ft',
    bulkTiers: [
      { minQty: 20, pricePerUnit: 92, label: '₹92/sq.ft' },
      { minQty: 100, pricePerUnit: 87, label: '₹87/sq.ft (100+)' },
      { minQty: 500, pricePerUnit: 82, label: '₹82/sq.ft (500+)' },
    ],
    specs: { Grade: 'BWR (Boiling Water Resistant)', Thickness: '19mm', Size: '8×4 ft', Layers: '13-ply', 'Glue': 'Phenolic Resin' },
    image: MAT_IMAGES.plywood,
    inStock: true,
    grade: 'BWR',
    compliance: ['IS 303', 'IS 710', 'E1 Emission'],
    deliveryDays: 3,
    description: 'Greenply BWR plywood — boiling water resistant, ideal for modular furniture, flooring shuttering, and shutters.',
    weight: '~20 kg per 8×4 ft sheet',
  },
  {
    id: 'mat-011',
    name: 'Finolex FRLS Copper Wire 2.5 sqmm',
    supplier: 'Finolex Cables Ltd.',
    category: 'Electricals',
    rating: 4.8,
    reviewCount: 1564,
    price: 47,
    unit: 'metre',
    moq: 100,
    qtyStep: 50,
    stock: 200000,
    stockUnit: 'metres',
    bulkTiers: [
      { minQty: 100, pricePerUnit: 47, label: '₹47/m' },
      { minQty: 500, pricePerUnit: 44, label: '₹44/m (500m+)' },
      { minQty: 2000, pricePerUnit: 41, label: '₹41/m (2,000m+)' },
    ],
    specs: { Conductor: '99.9% Electrolytic Copper', Size: '2.5 sq.mm', Insulation: 'FRLS PVC', Voltage: '1100V', 'Temp': '-20°C to 70°C' },
    image: MAT_IMAGES.wire,
    inStock: true,
    grade: 'FRLS',
    compliance: ['IS 694', 'BIS Mark', 'RoHS'],
    deliveryDays: 2,
    description: 'Finolex FRLS (Flame Retardant Low Smoke) copper wires for safe residential and commercial wiring.',
    weight: '18 kg/100m',
  },
  {
    id: 'mat-012',
    name: 'Dr. Fixit Pidilite Waterproofing 20kg',
    supplier: 'Pidilite Industries Ltd.',
    category: 'Waterproofing',
    rating: 4.7,
    reviewCount: 923,
    price: 1850,
    unit: '20 kg pail',
    moq: 2,
    qtyStep: 1,
    stock: 1200,
    stockUnit: 'pails',
    bulkTiers: [
      { minQty: 2, pricePerUnit: 1850, label: '₹1,850/pail' },
      { minQty: 10, pricePerUnit: 1750, label: '₹1,750/pail (10+)' },
      { minQty: 50, pricePerUnit: 1650, label: '₹1,650/pail (50+)' },
    ],
    specs: { Type: 'Cementitious 2-component', Coverage: '1.5 kg/sq.m per coat', Coats: 'Min. 2 coats', 'Pot Life': '1.5 hours', 'Cure': '7 days' },
    image: MAT_IMAGES.waterproof,
    inStock: true,
    grade: 'Type 2 Cementitious',
    compliance: ['IS 16168 Part 2', 'IGBC Approved'],
    deliveryDays: 3,
    description: 'Dr. Fixit Krystalline — crystalline waterproofing compound for terraces, basements, water tanks, and swimming pools.',
    weight: '20 kg',
  },
];

// ─── Demo Bookings ────────────────────────────────────────────────────────────

export interface Booking {
  id: string;
  professionalId: string;
  professionalName: string;
  professionalAvatar: string;
  service: string;
  date: string;
  time: string;
  address: string;
  notes: string;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  amount: number;
  amountLabel: string;
  createdAt: string;
}

export interface Quotation {
  id: string;
  contractor: string;
  service: string;
  area?: string;
  areaUnit?: string;
  amount: number;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  validUntil: string;
  notes: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  type: string;
  status: 'planning' | 'active' | 'inspection' | 'completed' | 'on-hold';
  startDate: string;
  estimatedEnd: string;
  budget: number;
  spent: number;
  progress: number;
  address: string;
  contractor?: string;
  lastUpdate: string;
  lastUpdateNote: string;
  requiresApproval?: boolean;
  approvalType?: string;
}

export const DEMO_BOOKINGS_SEED: Booking[] = [
  {
    id: 'BK-RS-001',
    professionalId: 'pro-001',
    professionalName: 'Rajesh Sharma',
    professionalAvatar: PRO_AVATARS.rajesh,
    service: 'Boundary Brick Wall Extension',
    date: getRelativeDateISO(3),
    time: '08:00',
    address: 'Plot 14B, DLF Phase 2, Gurugram 122002',
    notes: 'Approx 40 running feet of 9-inch brick wall with plaster finish.',
    status: 'upcoming',
    amount: 2100,
    amountLabel: '₹2,100/day',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const DEMO_QUOTATIONS_SEED: Quotation[] = [
  {
    id: 'QT-MC-001',
    contractor: 'Mohan Civil Contractors',
    service: 'Terrace Waterproofing',
    area: '1800',
    areaUnit: 'sq.ft',
    amount: 72000,
    status: 'pending',
    validUntil: getRelativeDateISO(7),
    notes: 'Using Dr. Fixit 2-component cementitious waterproofing with UV-resistant top coat. Includes 5-year leakage warranty. Two coats with geotextile reinforcement.',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const DEMO_PROJECTS_SEED: Project[] = [
  {
    id: 'PRJ-001',
    name: 'Gurugram Villa Renovation',
    type: 'Residential Renovation',
    status: 'active',
    startDate: getRelativeDateISO(-30),
    estimatedEnd: getRelativeDateISO(60),
    budget: 2400000,
    spent: 780000,
    progress: 32,
    address: 'Plot 14B, DLF Phase 2, Gurugram 122002',
    contractor: 'Pooja Verma Construction',
    lastUpdate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    lastUpdateNote: 'Electrical rough-in completed on Ground Floor. Plumbing concealment in progress for 1st floor bathrooms.',
    requiresApproval: true,
    approvalType: 'Structural Inspection Report',
  },
  {
    id: 'PRJ-002',
    name: 'Office Electrical Rewiring',
    type: 'Commercial Electrical',
    status: 'completed',
    startDate: getRelativeDateISO(-45),
    estimatedEnd: getRelativeDateISO(-5),
    budget: 85000,
    spent: 82500,
    progress: 100,
    address: 'Unit 204, Okhla Industrial Estate, New Delhi',
    contractor: 'Vikram Singh Electricals',
    lastUpdate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    lastUpdateNote: '✅ All electrical work completed and tested. COC issued by licensed electrician.',
    requiresApproval: false,
  },
];
