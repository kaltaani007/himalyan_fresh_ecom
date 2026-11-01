import type { Product, Category, District, Blog, Review, User, ChatMessage } from '@/types';

export const categories: Category[] = [
  { id: 1, name: 'Royal Apples', slug: 'apples', description: 'Premium apples from Kinnaur and Shimla orchards', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&q=80', product_count: 24 },
  { id: 2, name: 'Organic Fruits', slug: 'organic', description: 'Certified organic produce from mountain farms', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&q=80', product_count: 18 },
  { id: 3, name: 'Dry Fruits & Nuts', slug: 'dry-fruits', description: 'Premium walnuts, almonds and local nuts', image: 'https://images.unsplash.com/photo-1596097635121-14b63b7f0d5c?w=800&q=80', product_count: 12 },
  { id: 4, name: 'Mountain Vegetables', slug: 'vegetables', description: 'Fresh seasonal vegetables from high altitudes', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80', product_count: 32 },
  { id: 5, name: 'Honey & Preserves', slug: 'honey', description: 'Natural honey and traditional preserves', image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&q=80', product_count: 15 },
  { id: 6, name: 'Herbal & Medicinal', slug: 'herbal', description: 'Ayurvedic herbs and medicinal plants', image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&q=80', product_count: 20 },
];

export const products: Product[] = [
  {
    id: 1, name: 'Royal Red Delicious Apples', slug: 'royal-red-delicious', description: 'Exceptionally sweet and crispy apples from Kinnaur valley.',
    full_description: 'Premium Red Delicious apples from Kinnaur.',
    price: 599, original_price: 749,
    images: [{ id: 1, image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&q=80', alt_text: 'Red Delicious', is_primary: true }],
    category: categories[0], category_slug: 'apples',
    rating: 4.9, review_count: 328, in_stock: true, is_featured: true, is_bestseller: true, is_seasonal: true,
    badges: ['Farm Fresh', 'Handpicked'], origin: 'Kinnaur', weight: '1 kg', tags: ['apples'],
    created_at: '2024-01-15'
  },
  {
    id: 2, name: 'Golden Delicious Premium', slug: 'golden-delicious-premium', description: 'Balanced sweetness and tartness.',
    price: 449,
    images: [{ id: 1, image: 'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=800&q=80', alt_text: 'Golden', is_primary: true }],
    category: categories[0], category_slug: 'apples',
    rating: 4.8, review_count: 215, in_stock: true, is_featured: true, is_bestseller: false, is_seasonal: true,
    badges: ['Organic'], origin: 'Shimla', weight: '1 kg', tags: ['apples'],
    created_at: '2024-01-14'
  },
  {
    id: 3, name: 'Organic Strawberries', slug: 'organic-strawberries', description: 'Sun-ripened organic strawberries.',
    price: 299, original_price: 399,
    images: [{ id: 1, image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=800&q=80', alt_text: 'Strawberries', is_primary: true }],
    category: categories[1], category_slug: 'organic',
    rating: 4.7, review_count: 156, in_stock: true, is_featured: true, is_bestseller: true, is_seasonal: true,
    badges: ['Farm Fresh'], origin: 'Kullu', weight: '500g', tags: ['organic'],
    created_at: '2024-01-13'
  },
  {
    id: 4, name: 'Kinnaur Black Walnuts', slug: 'kinnaur-black-walnuts', description: 'Premium black walnuts rich in omega-3.',
    price: 899,
    images: [{ id: 1, image: 'https://images.unsplash.com/photo-1596097635121-14b63b7f0d5c?w=800&q=80', alt_text: 'Walnuts', is_primary: true }],
    category: categories[2], category_slug: 'dry-fruits',
    rating: 4.9, review_count: 89, in_stock: true, is_featured: true, is_bestseller: false, is_seasonal: false,
    badges: ['Handpicked'], origin: 'Kinnaur', weight: '250g', tags: ['nuts'],
    created_at: '2024-01-12'
  },
  {
    id: 5, name: 'Alpine Cherry Premium', slug: 'alpine-cherry', description: 'Sweet cherries from Kullu valleys.',
    price: 699, original_price: 899,
    images: [{ id: 1, image: 'https://images.unsplash.com/photo-1528821128474-27f963b062bf?w=800&q=80', alt_text: 'Cherries', is_primary: true }],
    category: categories[1], category_slug: 'organic',
    rating: 4.8, review_count: 124, in_stock: true, is_featured: true, is_bestseller: true, is_seasonal: true,
    badges: ['Seasonal'], origin: 'Kullu', weight: '500g', tags: ['fruits'],
    created_at: '2024-01-11'
  },
  {
    id: 6, name: 'Mountain Organic Potatoes', slug: 'mountain-potatoes', description: 'Earth-grown potatoes from high altitude.',
    price: 149,
    images: [{ id: 1, image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&q=80', alt_text: 'Potatoes', is_primary: true }],
    category: categories[3], category_slug: 'vegetables',
    rating: 4.6, review_count: 234, in_stock: true, is_featured: false, is_bestseller: false, is_seasonal: false,
    badges: ['Farm Fresh'], origin: 'Mandi', weight: '2 kg', tags: ['vegetables'],
    created_at: '2024-01-10'
  },
  {
    id: 7, name: 'Raw Organic Honey', slug: 'raw-organic-honey', description: 'Pure honey from mountain apiaries.',
    price: 499, original_price: 599,
    images: [{ id: 1, image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&q=80', alt_text: 'Honey', is_primary: true }],
    category: categories[4], category_slug: 'honey',
    rating: 4.9, review_count: 178, in_stock: true, is_featured: true, is_bestseller: true, is_seasonal: false,
    badges: ['100% Pure'], origin: 'Kangra', weight: '500ml', tags: ['honey'],
    created_at: '2024-01-09'
  },
  {
    id: 8, name: 'Kangra Green Almonds', slug: 'kangra-green-almonds', description: 'Premium green almonds rich in vitamins.',
    price: 549,
    images: [{ id: 1, image: 'https://images.unsplash.com/photo-1612145164037-4c11056d5c7b?w=800&q=80', alt_text: 'Almonds', is_primary: true }],
    category: categories[2], category_slug: 'dry-fruits',
    rating: 4.7, review_count: 67, in_stock: true, is_featured: false, is_bestseller: false, is_seasonal: false,
    badges: ['Handpicked'], origin: 'Kangra', weight: '250g', tags: ['nuts'],
    created_at: '2024-01-08'
  },
  {
    id: 9, name: 'Alpine Plums', slug: 'alpine-plums', description: 'Sweet plums from the hills.',
    price: 249,
    images: [{ id: 1, image: 'https://images.unsplash.com/photo-1559561853-08451507cbe7?w=800&q=80', alt_text: 'Plums', is_primary: true }],
    category: categories[1], category_slug: 'organic',
    rating: 4.5, review_count: 92, in_stock: true, is_featured: false, is_bestseller: false, is_seasonal: true,
    badges: ['Seasonal'], origin: 'Chamba', weight: '500g', tags: ['fruits'],
    created_at: '2024-01-07'
  },
  {
    id: 10, name: 'Mountain Green Tea', slug: 'mountain-green-tea', description: 'Premium green tea from Kangra.',
    price: 399,
    images: [{ id: 1, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&q=80', alt_text: 'Green Tea', is_primary: true }],
    category: categories[5], category_slug: 'herbal',
    rating: 4.8, review_count: 145, in_stock: true, is_featured: true, is_bestseller: true, is_seasonal: false,
    badges: ['Organic'], origin: 'Kangra', weight: '100g', tags: ['tea'],
    created_at: '2024-01-06'
  },
  {
    id: 11, name: 'Red Delicious Premium Box', slug: 'red-delicious-box', description: 'Gift box of premium apples.',
    price: 1299, original_price: 1599,
    images: [{ id: 1, image: 'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?w=800&q=80', alt_text: 'Gift Box', is_primary: true }],
    category: categories[0], category_slug: 'apples',
    rating: 4.9, review_count: 56, in_stock: true, is_featured: true, is_bestseller: false, is_seasonal: true,
    badges: ['Gift Box'], origin: 'Kinnaur', weight: '2.5 kg', tags: ['gift'],
    created_at: '2024-01-05'
  },
  {
    id: 12, name: 'Mixed Berry Preserve', slug: 'mixed-berry-preserve', description: 'Traditional preserve from mountain berries.',
    price: 299,
    images: [{ id: 1, image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&q=80', alt_text: 'Preserve', is_primary: true }],
    category: categories[4], category_slug: 'honey',
    rating: 4.7, review_count: 88, in_stock: true, is_featured: false, is_bestseller: false, is_seasonal: false,
    badges: ['Traditional'], origin: 'Solan', weight: '350g', tags: ['preserve'],
    created_at: '2024-01-04'
  },
];

export const districts: District[] = [
  { id: 1, name: 'Shimla', slug: 'shimla', description: 'The Queen of Hills, known for its apple orchards and colonial heritage.', image: 'https://images.unsplash.com/photo-1585938389612-a552a28d6914?w=800&q=80', specialties: ['Red Delicious Apples', 'Plums', 'Peaches', 'Cherries'], altitude: '2,200 m', population: '2.1 million', famous_for: ['Mall Road', 'Christ Church', 'Kalka-Shimla Railway'], climate: 'Temperate', products_count: 24, blogs_count: 8 },
  { id: 2, name: 'Kinnaur', slug: 'kinnaur', description: 'The land of apples, famous for premium quality apples and black walnuts.', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', specialties: ['Red Delicious', 'Black Walnuts', 'Apricots', 'Kangra Apples'], altitude: '2,300-6,500 m', population: '0.9 million', famous_for: ['Kinnaur Kailash', 'Kalpa Monastery', 'Apple Orchards'], climate: 'Cold Desert', products_count: 18, blogs_count: 6 },
  { id: 3, name: 'Kullu', slug: 'kullu', description: 'Valley of gods, known for apples, cherries and scenic beauty.', image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=80', specialties: ['Apples', 'Cherries', 'Pears', 'Plums'], altitude: '1,500 m', population: '0.4 million', famous_for: ['Great Himalayan National Park', 'Kullu Dussehra', 'Beas River'], climate: 'Temperate', products_count: 22, blogs_count: 7 },
  { id: 4, name: 'Mandi', slug: 'mandi', description: 'The rice bowl of Himachal with rich agricultural heritage.', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80', specialties: ['Basmati Rice', 'Vegetables', 'Maize', 'Potatoes'], altitude: '800 m', population: '1.0 million', famous_for: ['Rewalsar Lake', 'Panjeshwar Temples', 'Bilaspur'], climate: 'Sub-Tropical', products_count: 32, blogs_count: 5 },
  { id: 5, name: 'Kangra', slug: 'kangra', description: 'Historic valley famous for tea, almonds and Buddhist temples.', image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=800&q=80', specialties: ['Green Tea', 'Almonds', 'Honey', 'Kangra Fort'], altitude: '600 m', population: '1.5 million', famous_for: ['Kangra Fort', 'Brajeshwari Temple', 'Tea Gardens'], climate: 'Sub-Tropical', products_count: 15, blogs_count: 9 },
  { id: 6, name: 'Chamba', slug: 'chamba', description: 'Ancient valley with rich tradition of fruit cultivation.', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80', specialties: ['Apples', 'Plums', 'Apricots', 'Chukh'], altitude: '1,000 m', population: '0.5 million', famous_for: ['Chamba Palace', 'Bhuri Singh Museum', 'Mini Switzerland'], climate: 'Temperate', products_count: 14, blogs_count: 4 },
  { id: 7, name: 'Solan', slug: 'solan', description: 'The mushroom capital known for its agricultural innovation.', image: 'https://images.unsplash.com/photo-1504545102780-26774c1bb073?w=800&q=80', specialties: ['Mushrooms', 'Green Peas', 'Tomatoes', 'Vegetables'], altitude: '1,500 m', population: '0.6 million', famous_for: ['Mohan Shakti Park', 'Kumarhatti', 'Buddhist Monastery'], climate: 'Sub-Temperate', products_count: 20, blogs_count: 3 },
  { id: 8, name: 'Sirmaur', slug: 'sirmaur', description: 'Diverse agriculture zone with citrus fruits and spices.', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80', specialties: ['Citrus', 'Ginger', 'Turmeric', 'Mangoes'], altitude: '400-1,500 m', population: '0.55 million', famous_for: ['Renuka Lake', 'Koti', 'Nagar Palace'], climate: 'Sub-Tropical', products_count: 18, blogs_count: 4 },
  { id: 9, name: 'Lahaul-Spiti', slug: 'lahaul-spiti', description: 'Cold desert region with unique mountain agriculture.', image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80', specialties: ['Potatoes', 'Green Peas', 'Barley', 'Seabuckthorn'], altitude: '3,000-6,000 m', population: '0.03 million', famous_for: ['Kunzum Pass', 'Hikkim', 'Key Monastery'], climate: 'Cold Desert', products_count: 8, blogs_count: 5 },
  { id: 10, name: 'Bilaspur', slug: 'bilaspur', description: 'Emerging apple belt with growing orchards.', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', specialties: ['Apples', 'Mangoes', 'Vegetables', 'Wheat'], altitude: '400 m', population: '0.38 million', famous_for: ['Gobind Sagar', 'Naina Devi Temple', 'Bharmour'], climate: 'Sub-Tropical', products_count: 12, blogs_count: 2 },
  { id: 11, name: 'Hamirpur', slug: 'hamirpur', description: 'Progressive farming community with diverse crops.', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80', specialties: ['Wheat', 'Maize', 'Vegetables', 'Pulses'], altitude: '700 m', population: '0.5 million', famous_for: ['Sujanpur Tira', 'Tahnung Temple', 'Bilbagh'], climate: 'Sub-Tropical', products_count: 10, blogs_count: 2 },
  { id: 12, name: 'Una', slug: 'una', description: 'Gateway district with fertile plains and orchards.', image: 'https://images.unsplash.com/photo-1504545102780-26774c1bb073?w=800&q=80', specialties: ['Sugarcane', 'Wheat', 'Fruits', 'Vegetables'], altitude: '400 m', population: '0.55 million', famous_for: ['Dharamshala', 'Chintpurni Temple', 'Garner'], climate: 'Sub-Tropical', products_count: 14, blogs_count: 2 },
];

export const blogs: Blog[] = [
  {
    id: 1, title: 'The Art of Apple Growing in Kinnaur Valley', slug: 'art-apple-growing-kinnaur',
    summary: 'Discover the centuries-old traditions of apple cultivation in the high-altitude orchards of Kinnaur, where every apple tells a story of heritage and patience.',
    content: '<p>Kinnaur valley, nestled in the lap of the Himalayas, has been producing world-class apples for over a century...</p><h2>The Perfect Climate</h2><p>The unique combination of altitude, soil, and climate creates ideal conditions for apple cultivation...</p>',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=1200&q=80',
    category: { id: 1, name: 'Orchard Life', slug: 'orchard-life' },
    author: { id: 1, name: 'Rajesh Kumar', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80', bio: 'Third generation apple farmer from Kinnaur', role: 'Farmer' },
    published_at: '2024-12-15', read_time: 8, is_featured: true, is_trending: true, views: 4523, likes: 234
  },
  {
    id: 2, title: 'Seasonal Guide: When to Pick the Best Himachal Fruits', slug: 'seasonal-fruit-guide-himachal',
    summary: 'A comprehensive guide to the best seasons for harvesting different fruits in Himachal Pradesh.',
    content: '<p>Understanding the seasonal calendar of Himachal Pradesh is key to enjoying the freshest produce...</p>',
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=1200&q=80',
    category: { id: 2, name: 'Seasonal Guide', slug: 'seasonal-guide' },
    author: { id: 2, name: 'Anita Devi', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80', bio: 'Agricultural expert and food writer', role: 'Expert' },
    published_at: '2024-12-10', read_time: 6, is_featured: true, is_trending: false, views: 2891, likes: 156
  },
  {
    id: 3, title: 'From Farm to Table: The Journey of Himachal Honey', slug: 'farm-to-table-himachal-honey',
    summary: 'Follow the fascinating journey of honey from mountain apiaries to your breakfast table.',
    content: '<p>Mountain honey from Himachal Pradesh is known for its unique flavor and medicinal properties...</p>',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=1200&q=80',
    category: { id: 3, name: 'Farm Stories', slug: 'farm-stories' },
    author: { id: 3, name: 'Pankaj Thakur', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80', bio: 'Beekeeper and honey enthusiast', role: 'Producer' },
    published_at: '2024-12-05', read_time: 5, is_featured: false, is_trending: true, views: 3456, likes: 189
  },
  {
    id: 4, title: 'Traditional Kangra Tea: A Legacy in Every Cup', slug: 'kangra-tea-legacy',
    summary: 'Explore the rich history of tea cultivation in Kangra and discover what makes these mountain-grown leaves so special.',
    content: '<p>The tea gardens of Kangra have been producing premium tea since the 19th century...</p>',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=1200&q=80',
    category: { id: 4, name: 'Heritage', slug: 'heritage' },
    author: { id: 2, name: 'Anita Devi', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80', bio: 'Agricultural expert and food writer', role: 'Expert' },
    published_at: '2024-11-28', read_time: 7, is_featured: true, is_trending: false, views: 2134, likes: 112
  },
  {
    id: 5, title: 'Preserving the Season: Making Apple Preserves the Himachali Way', slug: 'apple-preserves-himachali',
    summary: 'Learn the traditional methods of preserving apples that have been passed down through generations.',
    content: '<p>In Himachali households, preserving the harvest is a time-honored tradition...</p>',
    image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=1200&q=80',
    category: { id: 5, name: 'Recipes', slug: 'recipes' },
    author: { id: 4, name: 'Sunita Devi', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80', bio: 'Traditional cooking expert', role: 'Chef' },
    published_at: '2024-11-20', read_time: 6, is_featured: false, is_trending: false, views: 1876, likes: 98
  },
  {
    id: 6, title: 'Sustainable Farming: How Himachal Farmers Are Leading the Way', slug: 'sustainable-farming-himachal',
    summary: 'Discover how traditional farming practices combined with modern sustainability techniques are shaping the future.',
    content: '<p>Himachal Pradesh has become a model for sustainable mountain agriculture...</p>',
    image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=1200&q=80',
    category: { id: 6, name: 'Sustainability', slug: 'sustainability' },
    author: { id: 5, name: 'Dr. Vikram Singh', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80', bio: 'Agricultural scientist', role: 'Researcher' },
    published_at: '2024-11-15', read_time: 9, is_featured: true, is_trending: true, views: 5234, likes: 287
  },
];

export const reviews: Review[] = [
  { id: 1, user: { id: 1, name: 'Priya Sharma', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80' }, product: 1, rating: 5, comment: 'The apples are incredibly fresh and crispy. Best quality I have found online. My family loves them!', helpful_count: 45, created_at: '2024-12-10' },
  { id: 2, user: { id: 2, name: 'Rahul Verma', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80' }, product: 1, rating: 5, comment: 'Excellent delivery service and premium packaging. The organic strawberries were a hit with my kids.', helpful_count: 32, created_at: '2024-12-08' },
  { id: 3, user: { id: 3, name: 'Anita Patel', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80' }, product: 1, rating: 4, comment: 'Finally found a reliable source for Himachal apples. The flavor is unmatched. Will definitely order again!', helpful_count: 28, created_at: '2024-12-05' },
];

export const users: User = {
  id: 1, email: 'demo@himalayafresh.in', first_name: 'Demo', last_name: 'User',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
  phone: '+91 98765 43210',
  addresses: [
    { id: 1, name: 'Home', street: '123, Model Town', city: 'Delhi', state: 'Delhi', pincode: '110001', phone: '+91 98765 43210', is_default: true },
    { id: 2, name: 'Office', street: '456, Connaught Place', city: 'Delhi', state: 'Delhi', pincode: '110001', phone: '+91 98765 43211', is_default: false },
  ],
  date_joined: '2024-01-01'
};

export const aiConversations: ChatMessage[] = [
  { id: '1', role: 'assistant', content: 'Namaste! I\'m your Himalayan shopping assistant. How can I help you today?', timestamp: new Date(), suggestions: ['Show me best apples', 'What\'s in season?', 'Tell me about Kinnaur'] },
];

export const stats = [
  { value: '50,000+', label: 'Happy Customers', icon: 'users' },
  { value: '1,00,000+', label: 'Orders Delivered', icon: 'package' },
  { value: '4.9', label: 'Average Rating', icon: 'star' },
  { value: '12', label: 'Districts Sourced', icon: 'map' },
];

export const testimonials = [
  { id: 1, name: 'Priya Sharma', location: 'Delhi', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80', rating: 5, text: 'The apples from Kinnaur are absolutely exceptional. The freshness and sweetness remind me of my childhood visits to Himachal.', purchase: 'Royal Red Delicious Apples' },
  { id: 2, name: 'Rahul Verma', location: 'Mumbai', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80', rating: 5, text: 'Impressed by the delivery speed and the premium quality of organic strawberries.', purchase: 'Organic Strawberries' },
  { id: 3, name: 'Anita Patel', location: 'Bangalore', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80', rating: 5, text: 'Finally found authentic Himachal honey that lives up to its promises.', purchase: 'Raw Organic Honey' },
  { id: 4, name: 'Vikram Sood', location: 'Chandigarh', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80', rating: 4, text: 'The black walnuts from Kinnaur are premium quality.', purchase: 'Kinnaur Black Walnuts' },
  { id: 5, name: 'Sunita Rao', location: 'Pune', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80', rating: 5, text: 'Ordered the premium apple gift box for my parents. They loved it!', purchase: 'Red Delicious Premium Box' },
];