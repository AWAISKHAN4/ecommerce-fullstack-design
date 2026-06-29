require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');

const connectDB = require('../config/db');

/**
 * Sample product data — 20 products across multiple categories
 * Images use picsum.photos for realistic placeholder images
 */
const sampleProducts = [
  // ── Electronics ──
  {
    name: 'Wireless Noise-Cancelling Headphones',
    price: 79.99,
    originalPrice: 129.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600',
    ],
    description: 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and premium sound quality. Foldable design for easy portability.',
    category: 'Electronics',
    stock: 45,
    rating: 4.5,
    reviewCount: 312,
    featured: true,
    brand: 'SoundMax',
    tags: ['wireless', 'audio', 'noise-cancelling'],
  },
  {
    name: 'Smart Watch Pro Series 5',
    price: 199.99,
    originalPrice: 249.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600',
    ],
    description: 'Advanced smartwatch with health tracking, GPS, AMOLED display, and 7-day battery life. Water resistant up to 50 meters.',
    category: 'Electronics',
    stock: 28,
    rating: 4.7,
    reviewCount: 589,
    featured: true,
    brand: 'TechWear',
    tags: ['smartwatch', 'fitness', 'wearable'],
  },
  {
    name: 'Mechanical Gaming Keyboard RGB',
    price: 59.99,
    originalPrice: 89.99,
    image: 'https://images.unsplash.com/photo-1595044426077-d36d9236d54a?w=600',
    images: [
      'https://images.unsplash.com/photo-1595044426077-d36d9236d54a?w=600',
    ],
    description: 'Tactile mechanical switches with customizable RGB backlighting. Anti-ghosting, N-key rollover, and durable aluminum frame.',
    category: 'Electronics',
    stock: 60,
    rating: 4.4,
    reviewCount: 204,
    featured: false,
    brand: 'GameForce',
    tags: ['keyboard', 'gaming', 'rgb'],
  },
  {
    name: '4K Webcam with Auto-Focus',
    price: 89.99,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600',
    images: [
      'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600',
    ],
    description: 'Ultra-sharp 4K webcam with auto-focus, built-in stereo microphone, and HDR for crisp video calls and streaming.',
    category: 'Electronics',
    stock: 35,
    rating: 4.3,
    reviewCount: 127,
    featured: false,
    brand: 'ClearVision',
    tags: ['webcam', 'streaming', '4k'],
  },

  // ── Clothing ──
  {
    name: "Men's Premium Slim Fit Jacket",
    price: 89.99,
    originalPrice: 149.99,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600',
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600',
    ],
    description: 'Contemporary slim-fit jacket in premium wool blend. Features a tailored silhouette, interior pockets, and minimalist design.',
    category: 'Clothing',
    stock: 30,
    rating: 4.6,
    reviewCount: 178,
    featured: true,
    brand: 'UrbanEdge',
    tags: ['jacket', 'mens', 'formal'],
  },
  {
    name: "Women's Floral Summer Dress",
    price: 44.99,
    originalPrice: 64.99,
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600',
    images: [
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600',
    ],
    description: 'Light and breezy floral print dress perfect for summer. Made from 100% breathable cotton with adjustable waist tie.',
    category: 'Clothing',
    stock: 55,
    rating: 4.5,
    reviewCount: 263,
    featured: false,
    brand: 'BloomWear',
    tags: ['dress', 'womens', 'summer'],
  },
  {
    name: 'Classic Cotton Polo T-Shirt',
    price: 24.99,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=600',
    images: [
      'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=600',
    ],
    description: 'Everyday essential polo in soft pique cotton. Available in 12 colors with a comfortable relaxed fit.',
    category: 'Clothing',
    stock: 100,
    rating: 4.2,
    reviewCount: 89,
    featured: false,
    brand: 'BasicTee',
    tags: ['polo', 'casual', 'cotton'],
  },

  // ── Footwear ──
  {
    name: 'Air Cushion Running Sneakers',
    price: 69.99,
    originalPrice: 99.99,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600',
    ],
    description: 'Lightweight running shoes with responsive air-cushion midsole, breathable mesh upper, and durable rubber outsole.',
    category: 'Footwear',
    stock: 42,
    rating: 4.8,
    reviewCount: 421,
    featured: true,
    brand: 'SwiftRun',
    tags: ['sneakers', 'running', 'sports'],
  },
  {
    name: 'Leather Oxford Dress Shoes',
    price: 119.99,
    originalPrice: 169.99,
    image: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=600',
    images: [
      'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=600',
    ],
    description: 'Handcrafted full-grain leather oxford shoes with cushioned insole and Goodyear welt construction for lasting durability.',
    category: 'Footwear',
    stock: 20,
    rating: 4.6,
    reviewCount: 95,
    featured: false,
    brand: 'ClassicStep',
    tags: ['oxford', 'leather', 'formal'],
  },

  // ── Home & Garden ──
  {
    name: 'Smart LED Desk Lamp with Wireless Charging',
    price: 49.99,
    originalPrice: 69.99,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600',
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600',
    ],
    description: 'Adjustable brightness LED desk lamp with 3 color modes, USB-C port, and Qi wireless charging base. Touch controls included.',
    category: 'Home & Garden',
    stock: 38,
    rating: 4.4,
    reviewCount: 156,
    featured: true,
    brand: 'LumiDesk',
    tags: ['lamp', 'wireless charging', 'desk'],
  },
  {
    name: 'Ceramic Pour-Over Coffee Set',
    price: 34.99,
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600',
    images: [
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600',
    ],
    description: 'Handcrafted ceramic pour-over dripper with glass carafe. Perfect for specialty coffee lovers who want precision brewing.',
    category: 'Home & Garden',
    stock: 22,
    rating: 4.7,
    reviewCount: 74,
    featured: false,
    brand: 'BrewCraft',
    tags: ['coffee', 'ceramic', 'pour-over'],
  },
  {
    name: 'Scented Soy Candle Gift Set (3-pack)',
    price: 29.99,
    originalPrice: 39.99,
    image: 'https://images.unsplash.com/photo-1602607768-22e09c9dd0de?w=600',
    images: [
      'https://images.unsplash.com/photo-1602607768-22e09c9dd0de?w=600',
    ],
    description: 'Set of 3 premium soy candles in Lavender, Vanilla, and Eucalyptus scents. 40-hour burn time each, gift-boxed.',
    category: 'Home & Garden',
    stock: 65,
    rating: 4.9,
    reviewCount: 302,
    featured: true,
    brand: 'GlowHaven',
    tags: ['candles', 'aromatherapy', 'gift'],
  },

  // ── Sports ──
  {
    name: 'Yoga Mat Premium Non-Slip 6mm',
    price: 39.99,
    originalPrice: 54.99,
    image: 'https://images.unsplash.com/photo-1601925228203-72c00df89a62?w=600',
    images: [
      'https://images.unsplash.com/photo-1601925228203-72c00df89a62?w=600',
    ],
    description: 'Eco-friendly TPE yoga mat with alignment lines, non-slip surface, and carrying strap. Suitable for yoga, pilates, and stretching.',
    category: 'Sports',
    stock: 50,
    rating: 4.6,
    reviewCount: 188,
    featured: false,
    brand: 'ZenFlow',
    tags: ['yoga', 'fitness', 'mat'],
  },
  {
    name: 'Adjustable Dumbbell Set 5-52 lbs',
    price: 299.99,
    originalPrice: 399.99,
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600',
    images: [
      'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600',
    ],
    description: 'Space-saving adjustable dumbbell set that replaces 15 sets of weights. Quick-change dial system, 5 to 52.5 lb range.',
    category: 'Sports',
    stock: 15,
    rating: 4.8,
    reviewCount: 234,
    featured: true,
    brand: 'PowerFlex',
    tags: ['dumbbells', 'weightlifting', 'fitness'],
  },

  // ── Beauty ──
  {
    name: 'Vitamin C Brightening Serum 30ml',
    price: 29.99,
    originalPrice: 44.99,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600',
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600',
    ],
    description: '20% Vitamin C brightening serum with hyaluronic acid and niacinamide. Reduces dark spots, evens skin tone. Fragrance-free.',
    category: 'Beauty',
    stock: 75,
    rating: 4.5,
    reviewCount: 417,
    featured: false,
    brand: 'GlowLab',
    tags: ['serum', 'vitamin c', 'skincare'],
  },
  {
    name: 'Rose Gold Makeup Brush Set (12 pcs)',
    price: 24.99,
    originalPrice: 34.99,
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600',
    images: [
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600',
    ],
    description: '12-piece professional makeup brush set with rose gold ferrules and vegan synthetic bristles. Includes carrying pouch.',
    category: 'Beauty',
    stock: 90,
    rating: 4.4,
    reviewCount: 198,
    featured: false,
    brand: 'GlamTouch',
    tags: ['makeup', 'brushes', 'cosmetics'],
  },

  // ── Books ──
  {
    name: 'The Full-Stack Developer Handbook 2025',
    price: 34.99,
    originalPrice: 49.99,
    image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600',
    images: [
      'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600',
    ],
    description: 'Comprehensive guide to modern web development covering React, Node.js, MongoDB, DevOps, and cloud deployment strategies.',
    category: 'Books',
    stock: 200,
    rating: 4.7,
    reviewCount: 356,
    featured: false,
    brand: 'TechPress',
    tags: ['programming', 'web development', 'fullstack'],
  },

  // ── Toys ──
  {
    name: 'STEM Building Blocks Set 500 pcs',
    price: 39.99,
    originalPrice: 54.99,
    image: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=600',
    images: [
      'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=600',
    ],
    description: 'Creative building blocks set promoting STEM learning. Compatible with major brands. Suitable for ages 6+. Includes storage box.',
    category: 'Toys',
    stock: 45,
    rating: 4.8,
    reviewCount: 292,
    featured: false,
    brand: 'BrainBuild',
    tags: ['stem', 'educational', 'building blocks'],
  },

  // ── Food ──
  {
    name: 'Organic Trail Mix Variety Pack (12 bags)',
    price: 24.99,
    originalPrice: 29.99,
    image: 'https://images.unsplash.com/photo-1604762524889-3e2fcc145683?w=600',
    images: [
      'https://images.unsplash.com/photo-1604762524889-3e2fcc145683?w=600',
    ],
    description: 'Certified organic trail mix with almonds, cashews, cranberries, and dark chocolate chips. No preservatives, non-GMO.',
    category: 'Food',
    stock: 120,
    rating: 4.6,
    reviewCount: 145,
    featured: false,
    brand: 'NatureBite',
    tags: ['organic', 'snacks', 'healthy'],
  },

  // ── Automotive ──
  {
    name: 'Car Phone Mount Wireless Charger',
    price: 29.99,
    originalPrice: 44.99,
    image: 'https://images.unsplash.com/photo-1609349935285-3c8d6bad44c0?w=600',
    images: [
      'https://images.unsplash.com/photo-1609349935285-3c8d6bad44c0?w=600',
    ],
    description: '15W fast wireless charging car mount. Auto-clamping, 360° rotation, compatible with all Qi-enabled phones.',
    category: 'Automotive',
    stock: 58,
    rating: 4.3,
    reviewCount: 167,
    featured: false,
    brand: 'DriveCharge',
    tags: ['car', 'wireless charger', 'phone mount'],
  },
];

/**
 * Admin user seeded for testing
 */
const adminUser = {
  name: 'Admin User',
  email: 'admin@ecommerce.com',
  password: 'admin123',
  role: 'admin',
};

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('🗑️  Clearing existing data...');
    await Product.deleteMany({});
    await User.deleteMany({ email: adminUser.email });

    console.log('🌱 Seeding products...');
    await Product.insertMany(sampleProducts);
    console.log(`✅ Inserted ${sampleProducts.length} products`);

    console.log('👤 Creating admin user...');
    await User.create(adminUser);
    console.log('✅ Admin user created: admin@ecommerce.com / admin123');

    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
