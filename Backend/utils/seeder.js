const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');

dotenv.config();

const categories = [
  { name: 'Men', description: 'Men\'s fashion and accessories', slug: 'men' },
  { name: 'Women', description: 'Women\'s fashion and accessories', slug: 'women' },
  { name: 'Kids', description: 'Kids fashion and toys', slug: 'kids' },
  { name: 'Home & Living', description: 'Home decor and living essentials', slug: 'home-living' },
  { name: 'Beauty', description: 'Beauty and personal care products', slug: 'beauty' }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@primebasket.com',
      password: 'admin123',
      role: 'admin'
    });
    console.log('👤 Admin user created');

    // Create test user
    const user = await User.create({
      name: 'Test User',
      email: 'user@test.com',
      password: 'user123',
      role: 'user'
    });
    console.log('👤 Test user created');

    // Create categories
    const createdCategories = await Category.insertMany(categories);
    console.log('📁 Categories created');

    // MEN'S PRODUCTS
    const menProducts = [
      { name: 'Casual Cotton Shirt', brand: 'Roadster', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300&h=400&fit=crop', price: 849, originalPrice: 1699, stock: 15, description: 'Comfortable cotton shirt perfect for casual wear', discount: 50 },
      { name: 'Slim Fit Denim Jeans', brand: 'Levis', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=400&fit=crop', price: 2299, originalPrice: 4599, stock: 8, description: 'Classic slim fit jeans with stretch comfort', discount: 50 },
      { name: 'Formal Blazer', brand: 'Raymond', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=300&h=400&fit=crop', price: 3499, originalPrice: 6999, stock: 0, description: 'Professional formal blazer', discount: 50 },
      { name: 'Polo T-Shirt', brand: 'US Polo', image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=300&h=400&fit=crop', price: 1199, originalPrice: 1999, stock: 25, description: 'Classic polo t-shirt', discount: 40 },
      { name: 'Chino Pants', brand: 'H&M', image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=300&h=400&fit=crop', price: 1599, originalPrice: 2999, stock: 12, description: 'Comfortable chino pants', discount: 47 },
      { name: 'Leather Jacket', brand: 'Zara', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=400&fit=crop', price: 4999, originalPrice: 8999, stock: 3, description: 'Premium leather jacket', discount: 44 },
      { name: 'Running Shoes', brand: 'Nike', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=400&fit=crop', price: 3799, originalPrice: 5999, stock: 18, description: 'Lightweight running shoes', discount: 37 },
      { name: 'Formal Shirt', brand: 'Van Heusen', image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=300&h=400&fit=crop', price: 1299, originalPrice: 2499, stock: 22, description: 'Professional formal shirt', discount: 48 },
      { name: 'Ethnic Kurta', brand: 'Manyavar', image: 'https://images.unsplash.com/photo-1626497764746-6dc36546b388?w=300&h=400&fit=crop', price: 1899, originalPrice: 3499, stock: 14, description: 'Traditional ethnic kurta', discount: 46 },
      { name: 'Sports Jacket', brand: 'Puma', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300&h=400&fit=crop', price: 2199, originalPrice: 3999, stock: 9, description: 'Athletic sports jacket', discount: 45 },
      { name: 'Casual Sneakers', brand: 'Adidas', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=400&fit=crop', price: 2899, originalPrice: 4999, stock: 0, description: 'Trendy casual sneakers', discount: 42 },
      { name: 'Denim Jacket', brand: 'Levis', image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=300&h=400&fit=crop', price: 2699, originalPrice: 4999, stock: 6, description: 'Classic denim jacket', discount: 46 }
    ];

    // WOMEN'S PRODUCTS
    const womenProducts = [
      { name: 'Floral Summer Dress', brand: 'H&M', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&h=400&fit=crop', price: 1499, originalPrice: 2999, stock: 11, description: 'Beautiful floral summer dress', discount: 50 },
      { name: 'Maxi Dress', brand: 'Zara', image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=300&h=400&fit=crop', price: 2199, originalPrice: 3999, stock: 7, description: 'Elegant maxi dress', discount: 45 },
      { name: 'Casual Top', brand: 'Forever 21', image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300&h=400&fit=crop', price: 699, originalPrice: 1299, stock: 28, description: 'Comfortable casual top', discount: 46 },
      { name: 'Denim Skirt', brand: 'Levis', image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=300&h=400&fit=crop', price: 1399, originalPrice: 2499, stock: 0, description: 'Stylish denim skirt', discount: 44 },
      { name: 'Party Dress', brand: 'Mango', image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=300&h=400&fit=crop', price: 2799, originalPrice: 4999, stock: 4, description: 'Glamorous party dress', discount: 44 },
      { name: 'Casual Jeans', brand: 'Levis', image: 'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=300&h=400&fit=crop', price: 1999, originalPrice: 3999, stock: 16, description: 'Comfortable casual jeans', discount: 50 },
      { name: 'Ethnic Kurti', brand: 'Biba', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300&h=400&fit=crop', price: 1299, originalPrice: 2299, stock: 19, description: 'Traditional ethnic kurti', discount: 43 },
      { name: 'Formal Blazer', brand: 'Zara', image: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=300&h=400&fit=crop', price: 3299, originalPrice: 5999, stock: 8, description: 'Professional formal blazer', discount: 45 },
      { name: 'Stylish Blouse', brand: 'H&M', image: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=300&h=400&fit=crop', price: 899, originalPrice: 1699, stock: 21, description: 'Trendy stylish blouse', discount: 47 },
      { name: 'Palazzo Pants', brand: 'W', image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=400&fit=crop', price: 1099, originalPrice: 1999, stock: 13, description: 'Comfortable palazzo pants', discount: 45 },
      { name: 'Heels', brand: 'Steve Madden', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=300&h=400&fit=crop', price: 2499, originalPrice: 4499, stock: 5, description: 'Elegant high heels', discount: 44 },
      { name: 'Handbag', brand: 'Michael Kors', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&h=400&fit=crop', price: 3999, originalPrice: 6999, stock: 0, description: 'Premium leather handbag', discount: 43 }
    ];

    // KIDS PRODUCTS
    const kidsProducts = [
      { name: 'Kids T-Shirt', brand: 'H&M Kids', image: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=300&h=400&fit=crop', price: 399, originalPrice: 799, stock: 32, description: 'Colorful kids t-shirt', discount: 50 },
      { name: 'Kids Jeans', brand: 'Gap Kids', image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=300&h=400&fit=crop', price: 899, originalPrice: 1599, stock: 18, description: 'Comfortable kids jeans', discount: 44 },
      { name: 'Kids Dress', brand: 'Zara Kids', image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=300&h=400&fit=crop', price: 1199, originalPrice: 1999, stock: 9, description: 'Pretty kids dress', discount: 40 },
      { name: 'Kids Shorts', brand: 'Puma Kids', image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=300&h=400&fit=crop', price: 599, originalPrice: 999, stock: 24, description: 'Athletic kids shorts', discount: 40 },
      { name: 'Kids Jacket', brand: 'Nike Kids', image: 'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=300&h=400&fit=crop', price: 1799, originalPrice: 2999, stock: 11, description: 'Warm kids jacket', discount: 40 },
      { name: 'Kids Shoes', brand: 'Adidas Kids', image: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=300&h=400&fit=crop', price: 1499, originalPrice: 2499, stock: 0, description: 'Sporty kids shoes', discount: 40 },
      { name: 'Kids Hoodie', brand: 'H&M Kids', image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=300&h=400&fit=crop', price: 999, originalPrice: 1799, stock: 15, description: 'Cozy kids hoodie', discount: 44 },
      { name: 'Kids Skirt', brand: 'Gap Kids', image: 'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?w=300&h=400&fit=crop', price: 699, originalPrice: 1299, stock: 20, description: 'Cute kids skirt', discount: 46 },
      { name: 'Kids Shirt', brand: 'Zara Kids', image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=300&h=400&fit=crop', price: 799, originalPrice: 1499, stock: 14, description: 'Smart kids shirt', discount: 47 },
      { name: 'Kids Sweater', brand: 'H&M Kids', image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=300&h=400&fit=crop', price: 1099, originalPrice: 1999, stock: 7, description: 'Warm kids sweater', discount: 45 },
      { name: 'Kids Sneakers', brand: 'Nike Kids', image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=300&h=400&fit=crop', price: 1699, originalPrice: 2799, stock: 12, description: 'Trendy kids sneakers', discount: 39 },
      { name: 'Kids Cap', brand: 'Puma Kids', image: 'https://images.unsplash.com/photo-1588117305388-c2631a279f82?w=300&h=400&fit=crop', price: 399, originalPrice: 699, stock: 28, description: 'Cool kids cap', discount: 43 }
    ];

    // HOME & LIVING PRODUCTS
    const homeProducts = [
      { name: 'Bed Sheet Set', brand: 'Bombay Dyeing', image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=300&h=400&fit=crop', price: 1899, originalPrice: 3499, stock: 8, description: 'Premium bed sheet set', discount: 46 },
      { name: 'Cushion Covers', brand: 'Urban Ladder', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&h=400&fit=crop', price: 599, originalPrice: 999, stock: 16, description: 'Decorative cushion covers', discount: 40 },
      { name: 'Curtains', brand: 'IKEA', image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=300&h=400&fit=crop', price: 1299, originalPrice: 2299, stock: 0, description: 'Elegant window curtains', discount: 43 },
      { name: 'Bath Towels', brand: 'Welspun', image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=300&h=400&fit=crop', price: 799, originalPrice: 1499, stock: 22, description: 'Soft bath towels', discount: 47 },
      { name: 'Table Runner', brand: 'Home Centre', image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=300&h=400&fit=crop', price: 499, originalPrice: 899, stock: 19, description: 'Decorative table runner', discount: 44 },
      { name: 'Duvet Cover', brand: 'Urban Ladder', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=300&h=400&fit=crop', price: 1599, originalPrice: 2999, stock: 5, description: 'Comfortable duvet cover', discount: 47 },
      { name: 'Throw Blanket', brand: 'Bombay Dyeing', image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=300&h=400&fit=crop', price: 1199, originalPrice: 2199, stock: 11, description: 'Cozy throw blanket', discount: 45 },
      { name: 'Rug', brand: 'IKEA', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=300&h=400&fit=crop', price: 2499, originalPrice: 4499, stock: 6, description: 'Stylish floor rug', discount: 44 },
      { name: 'Lamp', brand: 'Philips', image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=300&h=400&fit=crop', price: 1799, originalPrice: 2999, stock: 13, description: 'Modern table lamp', discount: 40 },
      { name: 'Vase', brand: 'Home Centre', image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=300&h=400&fit=crop', price: 699, originalPrice: 1299, stock: 17, description: 'Decorative vase', discount: 46 },
      { name: 'Wall Art', brand: 'Urban Ladder', image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=300&h=400&fit=crop', price: 899, originalPrice: 1599, stock: 0, description: 'Beautiful wall art', discount: 44 },
      { name: 'Photo Frame', brand: 'Home Centre', image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=300&h=400&fit=crop', price: 399, originalPrice: 799, stock: 25, description: 'Elegant photo frame', discount: 50 }
    ];

    // BEAUTY PRODUCTS
    const beautyProducts = [
      { name: 'Face Cream', brand: 'Lakme', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&h=400&fit=crop', price: 599, originalPrice: 999, stock: 30, description: 'Moisturizing face cream', discount: 40 },
      { name: 'Lipstick', brand: 'Maybelline', image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300&h=400&fit=crop', price: 399, originalPrice: 699, stock: 45, description: 'Long-lasting lipstick', discount: 43 },
      { name: 'Perfume', brand: 'Bella Vita', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=300&h=400&fit=crop', price: 1999, originalPrice: 3999, stock: 0, description: 'Luxury perfume', discount: 50 },
      { name: 'Foundation', brand: 'Maybelline', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300&h=400&fit=crop', price: 799, originalPrice: 1499, stock: 0, description: 'Flawless foundation', discount: 47 },
      { name: 'Mascara', brand: 'Lakme', image: 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=300&h=400&fit=crop', price: 499, originalPrice: 899, stock: 38, description: 'Volumizing mascara', discount: 44 },
      { name: 'Face Wash', brand: 'Neutrogena', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=400&fit=crop', price: 349, originalPrice: 599, stock: 50, description: 'Gentle face wash', discount: 42 },
      { name: 'Shampoo', brand: 'Loreal', image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=300&h=400&fit=crop', price: 599, originalPrice: 999, stock: 40, description: 'Nourishing shampoo', discount: 40 },
      { name: 'Body Lotion', brand: 'Nivea', image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&h=400&fit=crop', price: 449, originalPrice: 799, stock: 35, description: 'Hydrating body lotion', discount: 44 },
      { name: 'Sunscreen', brand: 'Neutrogena', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=400&fit=crop', price: 699, originalPrice: 1199, stock: 28, description: 'SPF 50 sunscreen', discount: 42 },
      { name: 'Nail Polish', brand: 'Lakme', image: 'https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=300&h=400&fit=crop', price: 199, originalPrice: 349, stock: 60, description: 'Vibrant nail polish', discount: 43 },
      { name: 'Hair Serum', brand: 'Loreal', image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=300&h=400&fit=crop', price: 799, originalPrice: 1399, stock: 22, description: 'Smoothing hair serum', discount: 43 },
      { name: 'Face Mask', brand: 'Garnier', image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&h=400&fit=crop', price: 299, originalPrice: 499, stock: 42, description: 'Refreshing face mask', discount: 40 }
    ];

    // Create all products
    const allProducts = [];

    // Add Men's products
    menProducts.forEach(p => {
      allProducts.push({
        name: p.name,
        description: p.description,
        price: p.price,
        originalPrice: p.originalPrice,
        discount: p.discount,
        brand: p.brand,
        category: createdCategories[0]._id,
        images: [p.image],
        stock: p.stock,
        rating: (Math.random() * 1.5 + 3.5).toFixed(1),
        numReviews: Math.floor(Math.random() * 50) + 5,
        isFeatured: p.stock > 10
      });
    });

    // Add Women's products
    womenProducts.forEach(p => {
      allProducts.push({
        name: p.name,
        description: p.description,
        price: p.price,
        originalPrice: p.originalPrice,
        discount: p.discount,
        brand: p.brand,
        category: createdCategories[1]._id,
        images: [p.image],
        stock: p.stock,
        rating: (Math.random() * 1.5 + 3.5).toFixed(1),
        numReviews: Math.floor(Math.random() * 50) + 5,
        isFeatured: p.stock > 10
      });
    });

    // Add Kids products
    kidsProducts.forEach(p => {
      allProducts.push({
        name: p.name,
        description: p.description,
        price: p.price,
        originalPrice: p.originalPrice,
        discount: p.discount,
        brand: p.brand,
        category: createdCategories[2]._id,
        images: [p.image],
        stock: p.stock,
        rating: (Math.random() * 1.5 + 3.5).toFixed(1),
        numReviews: Math.floor(Math.random() * 50) + 5,
        isFeatured: p.stock > 10
      });
    });

    // Add Home products
    homeProducts.forEach(p => {
      allProducts.push({
        name: p.name,
        description: p.description,
        price: p.price,
        originalPrice: p.originalPrice,
        discount: p.discount,
        brand: p.brand,
        category: createdCategories[3]._id,
        images: [p.image],
        stock: p.stock,
        rating: (Math.random() * 1.5 + 3.5).toFixed(1),
        numReviews: Math.floor(Math.random() * 50) + 5,
        isFeatured: p.stock > 10
      });
    });

    // Add Beauty products
    beautyProducts.forEach(p => {
      allProducts.push({
        name: p.name,
        description: p.description,
        price: p.price,
        originalPrice: p.originalPrice,
        discount: p.discount,
        brand: p.brand,
        category: createdCategories[4]._id,
        images: [p.image],
        stock: p.stock,
        rating: (Math.random() * 1.5 + 3.5).toFixed(1),
        numReviews: Math.floor(Math.random() * 50) + 5,
        isFeatured: p.stock > 10
      });
    });

    await Product.insertMany(allProducts);
    console.log(`📦 ${allProducts.length} Products created`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📝 Login Credentials:');
    console.log('Admin: admin@primebasket.com / admin123');
    console.log('User: user@test.com / user123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
