// ==========================================================================
// Scoop & Swirl - Data Catalog & Shop Configuration
// Currency: PKR (Rs.)
// ==========================================================================

const SHOP_INFO = {
  name: "Scoop & Swirl",
  tagline: "Happiness Served One Scoop at a Time 🍨",
  subtitle: "Handcrafted artisan ice cream, decadent sundaes, rich milkshakes & celebratory ice cream cakes made with 100% pure Pakistani dairy.",
  phone: "+92 (021) 3456-7890",
  whatsapp: "+92 300 7266779", // 0300-SCOOPS
  email: "hello@scoopandswirl.pk",
  address: "Shop 14, Block 5, Clifton, Karachi, Pakistan",
  hours: "Monday – Sunday: 11:00 AM – 11:00 PM",
  deliveryFee: 100, // PRD specification: Rs. 100 delivery fee
  currency: "Rs.",
  cities: ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta", "Hyderabad", "Sialkot"]
};

// Exact products and prices specified in PRD Section 7
const PRODUCTS = [
  // ----------------- SCOOPS -----------------
  {
    id: "scoop-1",
    name: "Vanilla Dream",
    category: "Scoops",
    price: 180,
    flavor: "Madagascar Vanilla Bean",
    description: "Classic velvety smooth ice cream infused with real aromatic Madagascar vanilla beans and rich whole cream.",
    image: "./assets/vanilla icecream.png",
    rating: 4.8,
    reviewsCount: 342,
    badge: "Most Affordable",
    isPopular: true,
    flavorType: "Classic",
    dietary: ["100% Real Dairy", "Eggless", "Gluten-Free"],
    calories: "160 kcal per scoop"
  },
  {
    id: "scoop-2",
    name: "Chocolate Fudge",
    category: "Scoops",
    price: 220,
    flavor: "Belgian Dark Chocolate Fudge",
    description: "Intense Belgian cocoa churned to silky perfection and rippled with decadent gooey chocolate fudge ribbons.",
    image: "./assets/choclat-icecream.png",
    rating: 4.9,
    reviewsCount: 528,
    badge: "Bestseller",
    isPopular: true,
    flavorType: "Chocolate",
    dietary: ["100% Real Dairy", "Eggless", "Rich Cocoa"],
    calories: "210 kcal per scoop"
  },
  {
    id: "scoop-3",
    name: "Strawberry Bliss",
    category: "Scoops",
    price: 200,
    flavor: "Fresh Strawberry Coulis",
    description: "Made with hand-picked ripe Swat valley strawberries folded into creamy, luscious sweet cream.",
    image: "./assets/strawberry-icecream.png",
    rating: 4.7,
    reviewsCount: 290,
    badge: "Refreshing",
    isPopular: true,
    flavorType: "Fruity",
    dietary: ["100% Real Dairy", "Eggless", "Real Fruit"],
    calories: "175 kcal per scoop"
  },
  {
    id: "scoop-4",
    name: "Mango Magic",
    category: "Scoops",
    price: 220,
    flavor: "Chaunsa Alphonso Mango",
    description: "Sun-ripened Pakistani Chaunsa mango pulp blended into an exotic, tropical, creamy summer sensation.",
    image: "./assets/Mango-icecream.png",
    rating: 4.9,
    reviewsCount: 460,
    badge: "Chef's Special",
    isPopular: true,
    flavorType: "Fruity",
    dietary: ["100% Real Dairy", "Eggless", "Pure Mango Pulp"],
    calories: "185 kcal per scoop"
  },
  {
    id: "scoop-5",
    name: "Cookies & Cream",
    category: "Scoops",
    price: 250,
    flavor: "Sweet Cream & Crushed Oreos",
    description: "Generous chunks of dark chocolate sandwich cookies blended into a silky sweet cream base. A customer favorite!",
    image: "./assets/cookies_cream.jpg",
    rating: 4.8,
    reviewsCount: 388,
    badge: "Crowd Favorite",
    isPopular: true,
    flavorType: "Chocolate",
    dietary: ["100% Real Dairy", "Eggless", "Crunchy Cookies"],
    calories: "220 kcal per scoop"
  },
  {
    id: "scoop-6",
    name: "Pistachio Delight",
    category: "Scoops",
    price: 280,
    flavor: "Roasted Afghan Pistachio & Cardamom",
    description: "Pure roasted emerald pistachios blended with aromatic crushed green cardamom and luscious clotted cream.",
    image: "./assets/pistachio-icecream.png",
    rating: 4.9,
    reviewsCount: 412,
    badge: "Royal Treat",
    isPopular: true,
    flavorType: "Nutty",
    dietary: ["100% Real Dairy", "Eggless", "Premium Nuts"],
    calories: "230 kcal per scoop"
  },

  // ----------------- CONES -----------------
  {
    id: "cone-1",
    name: "Classic Cone",
    category: "Cones",
    price: 200,
    flavor: "Crisp Artisan Waffle Cone",
    description: "A freshly baked, crunchy caramelized waffle cone cradling your favorite single scoop of artisanal ice cream.",
    image: "./assets/icecream-con.png",
    rating: 4.7,
    reviewsCount: 210,
    badge: "Crunchy Classic",
    isPopular: false,
    flavorType: "Classic",
    dietary: ["Freshly Waffle-Baked", "100% Real Dairy"],
    calories: "220 kcal"
  },
  {
    id: "cone-2",
    name: "Chocolate Cone",
    category: "Cones",
    price: 250,
    flavor: "Belgian Chocolate Dipped Waffle",
    description: "Golden crispy waffle cone rimmed and inner-coated with premium melted chocolate, filled with your choice of scoop.",
    image: "./assets/chocolate_cone.jpg",
    rating: 4.8,
    reviewsCount: 275,
    badge: "Choco Crunch",
    isPopular: false,
    flavorType: "Chocolate",
    dietary: ["Chocolate Coated", "100% Real Dairy"],
    calories: "270 kcal"
  },
  {
    id: "cone-3",
    name: "Double Scoop Cone",
    category: "Cones",
    price: 350,
    flavor: "Two Heavenly Scoops of Your Choice",
    description: "Double the joy! Stack two generous scoops of your favorite flavors on a giant freshly baked artisanal waffle cone.",
    image: "./assets/double_scoop_cone.jpg",
    rating: 4.9,
    reviewsCount: 395,
    badge: "Double Happiness",
    isPopular: true,
    flavorType: "Classic",
    dietary: ["2 Jumbo Scoops", "Freshly Baked"],
    calories: "380 kcal"
  },

  // ----------------- SHAKES -----------------
  {
    id: "shake-1",
    name: "Chocolate Shake",
    category: "Shakes",
    price: 350,
    flavor: "Thick Blended Dutch Chocolate",
    description: "Super-thick and frosty milkshake churned with two scoops of chocolate fudge, whole milk, whipped cream, and chocolate curls.",
    image: "./assets/chocolate_shake.jpg",
    rating: 4.8,
    reviewsCount: 310,
    badge: "Thick & Frosty",
    isPopular: true,
    flavorType: "Chocolate",
    dietary: ["Whipped Cream", "Eggless", "100% Real Dairy"],
    calories: "390 kcal"
  },
  {
    id: "shake-2",
    name: "Strawberry Shake",
    category: "Shakes",
    price: 330,
    flavor: "Chilled Strawberry & Cream",
    description: "Refreshing pink milkshake blended with ripe strawberries, vanilla cream, topped with strawberry drizzle and fluffy whipped cream.",
    image: "./assets/strawberry_shake.jpg",
    rating: 4.7,
    reviewsCount: 220,
    badge: "Berry Sweet",
    isPopular: false,
    flavorType: "Fruity",
    dietary: ["Real Strawberries", "Eggless", "100% Real Dairy"],
    calories: "340 kcal"
  },
  {
    id: "shake-3",
    name: "Oreo Shake",
    category: "Shakes",
    price: 400,
    flavor: "Loaded Oreo & Fudge Milkshake",
    description: "Thick creamy vanilla milkshake packed with crushed Oreo cookies, hot fudge drizzle, cookie crumble rim, and chocolate straw.",
    image: "./assets/oreo_shake.jpg",
    rating: 4.9,
    reviewsCount: 450,
    badge: "Best Value Shake",
    isPopular: true,
    flavorType: "Chocolate",
    dietary: ["Double Cookie Blast", "100% Real Dairy"],
    calories: "440 kcal"
  },
  {
    id: "shake-4",
    name: "Mango Shake",
    category: "Shakes",
    price: 350,
    flavor: "Pure Chaunsa Mango Thickshake",
    description: "Tropical paradise in a glass! Fresh Chaunsa mango pulp blended thick with sweet cream and garnished with sweet mango cubes.",
    image: "./assets/mango_shake.jpg",
    rating: 4.9,
    reviewsCount: 380,
    badge: "Summer Sensation",
    isPopular: true,
    flavorType: "Fruity",
    dietary: ["Pure Mango Pulp", "Eggless", "100% Real Dairy"],
    calories: "360 kcal"
  },

  // ----------------- SUNDAES -----------------
  {
    id: "sundae-1",
    name: "Chocolate Brownie Sundae",
    category: "Sundaes",
    price: 450,
    flavor: "Warm Fudge Brownie & Cold Ice Cream",
    description: "A warm, chewy chocolate walnut brownie smothered in hot chocolate sauce, topped with vanilla and chocolate fudge scoops, nuts, and a cherry.",
    image: "./assets/chocolate_sundae.jpg",
    rating: 5.0,
    reviewsCount: 610,
    badge: "Ultimate Indulgence",
    isPopular: true,
    flavorType: "Chocolate",
    dietary: ["Warm Brownie", "Belgian Fudge", "100% Real Dairy"],
    calories: "520 kcal"
  },
  {
    id: "sundae-2",
    name: "Strawberry Sundae",
    category: "Sundaes",
    price: 400,
    flavor: "Strawberry Coulis & Sweet Cream",
    description: "Two scoops of strawberry bliss and vanilla cream layered with strawberry coulis, white chocolate pearls, whipped cream, and sprinkles.",
    image: "./assets/strawberry_sundae.jpg",
    rating: 4.7,
    reviewsCount: 195,
    badge: "Fruity Delight",
    isPopular: false,
    flavorType: "Fruity",
    dietary: ["Fresh Berries", "Fluffy Cream", "100% Real Dairy"],
    calories: "410 kcal"
  },
  {
    id: "sundae-3",
    name: "Oreo Crunch Sundae",
    category: "Sundaes",
    price: 450,
    flavor: "Cookies & Cream with Warm Fudge",
    description: "Two jumbo scoops of cookies & cream ice cream layered with crunchy Oreo crust, hot molten fudge, airy whipped cream, and rainbow sprinkles.",
    image: "./assets/oreo_sundae.jpg",
    rating: 4.9,
    reviewsCount: 340,
    badge: "Crunch Heaven",
    isPopular: true,
    flavorType: "Chocolate",
    dietary: ["Crushed Oreos", "Hot Fudge", "100% Real Dairy"],
    calories: "490 kcal"
  },
  {
    id: "sundae-4",
    name: "Caramel Delight",
    category: "Sundaes",
    price: 430,
    flavor: "Salted Butter Caramel & Praline",
    description: "Creamy vanilla scoops drenched in warm golden salted caramel sauce, garnished with toasted almond praline crunch and whipped cream.",
    image: "./assets/caramel_sundae.jpg",
    rating: 4.8,
    reviewsCount: 260,
    badge: "Golden Caramel",
    isPopular: false,
    flavorType: "Classic",
    dietary: ["Salted Caramel", "Almond Praline", "100% Real Dairy"],
    calories: "460 kcal"
  },

  // ----------------- ICE CREAM CAKES -----------------
  {
    id: "cake-1",
    name: "Chocolate Ice Cream Cake",
    category: "Ice Cream Cakes",
    price: 1800,
    flavor: "Triple Layer Dark Fudge Gateau",
    description: "Artisan celebration cake featuring layers of moist chocolate sponge, dark chocolate fudge ice cream, glossy ganache drip, and handcrafted rosettes. Serves 8-10.",
    image: "./assets/chocolate_cake.jpg",
    rating: 4.9,
    reviewsCount: 180,
    badge: "Party Favorite",
    isPopular: true,
    flavorType: "Chocolate",
    dietary: ["Serves 8-10", "Celebration Size", "100% Real Dairy"],
    calories: "320 kcal per slice"
  },
  {
    id: "cake-2",
    name: "Strawberry Ice Cream Cake",
    category: "Ice Cream Cakes",
    price: 1700,
    flavor: "Fresh Strawberry & White Chocolate",
    description: "Delicate vanilla sponge layered with strawberry bliss ice cream, fresh strawberry jelly, white chocolate drip, and glazed strawberries. Serves 8-10.",
    image: "./assets/strawberry_cake.jpg",
    rating: 4.8,
    reviewsCount: 140,
    badge: "Elegant Treat",
    isPopular: false,
    flavorType: "Fruity",
    dietary: ["Serves 8-10", "Real Berries", "100% Real Dairy"],
    calories: "290 kcal per slice"
  },
  {
    id: "cake-3",
    name: "Birthday Special Cake",
    category: "Ice Cream Cakes",
    price: 2200,
    flavor: "Rainbow Confetti & Multi-Flavor Swirl",
    description: "The showstopper! Triple layer ice cream cake with vanilla, strawberry, and chocolate layers, rainbow funfetti sprinkles, birthday piping, and celebration candles. Serves 12-14.",
    image: "./assets/birthday_cake.jpg",
    rating: 5.0,
    reviewsCount: 295,
    badge: "Showstopper",
    isPopular: true,
    flavorType: "Classic",
    dietary: ["Serves 12-14", "Candles Included", "100% Real Dairy"],
    calories: "340 kcal per slice"
  }
];

// Special Offers from PRD Section 11
const SPECIAL_OFFERS = [
  {
    id: "deal-1",
    title: "Happy Hour Special",
    tagline: "20% OFF Everything between 4 PM – 6 PM!",
    discountText: "20% OFF",
    code: "HAPPYHOUR",
    discountPercent: 20,
    priceInfo: "Applied at checkout",
    timing: "Daily: 4:00 PM – 6:00 PM",
    badge: "Limited Time",
    description: "Enjoy an extra 20% discount on all scoops, shakes, and sundaes when ordering during our golden happy hour window.",
    icon: "⏰",
    accentColor: "linear-gradient(135deg, #FF6B8B 0%, #FF8E53 100%)"
  },
  {
    id: "deal-2",
    title: "Double Scoop Deal",
    tagline: "Any 2 Scoops of your choice for just Rs. 320!",
    discountText: "Save up to Rs. 240",
    code: "DOUBLESCOOP",
    fixedPrice: 320,
    priceInfo: "Rs. 320 (Regular up to Rs. 560)",
    timing: "All Day, Every Day",
    badge: "Super Saver",
    description: "Pick any two scoops from our entire range (even Pistachio and Cookies & Cream) and get both for an unbeatable Rs. 320.",
    icon: "🍨🍨",
    accentColor: "linear-gradient(135deg, #9C27B0 0%, #E040FB 100%)",
    comboItems: ["scoop-2", "scoop-4"] // Default combo items
  },
  {
    id: "deal-3",
    title: "Family Combo",
    tagline: "4 Scoops + 2 Shakes — only Rs. 1,150!",
    discountText: "Save Rs. 430",
    code: "FAMILYCOMBO",
    fixedPrice: 1150,
    priceInfo: "Rs. 1,150 (Value Rs. 1,580)",
    timing: "Great for Family Gatherings",
    badge: "Best Value",
    description: "The ultimate family dessert pack! 4 large scoops of your favorite flavors plus 2 rich thickshakes to share with loved ones.",
    icon: "👨‍👩‍👧‍👦",
    accentColor: "linear-gradient(135deg, #00B0FF 0%, #00E5FF 100%)",
    comboItems: ["scoop-1", "scoop-2", "scoop-3", "scoop-4", "shake-1", "shake-2"]
  },
  {
    id: "deal-4",
    title: "Weekend Special",
    tagline: "Buy 2 Sundaes and get 1 Topping FREE!",
    discountText: "Free Topping",
    code: "WEEKENDSUNDAE",
    priceInfo: "Free Gourmet Topping",
    timing: "Saturday & Sunday",
    badge: "Weekend Treat",
    description: "Order any two decadent sundaes this weekend and choose an extra gourmet hot fudge, roasted praline, or berry topping on the house.",
    icon: "🎉",
    accentColor: "linear-gradient(135deg, #FF9800 0%, #FFC107 100%)"
  }
];

// Why Choose Us Pillars from PRD Section 5
const WHY_CHOOSE_US = [
  {
    id: "why-1",
    title: "Fresh Ingredients",
    icon: "🥛",
    desc: "100% natural, farm-fresh Pakistani milk, fresh farm cream, real ripe fruits, and pure Belgian cocoa. Zero artificial stabilizers."
  },
  {
    id: "why-2",
    title: "Delicious Flavors",
    icon: "🍓",
    desc: "18+ signature recipes churned slowly in small batches for ultra-velvety richness and authentic melt-in-the-mouth texture."
  },
  {
    id: "why-3",
    title: "Fast Service",
    icon: "⚡",
    desc: "Delivered in insulated chilled boxes with dry ice in just 30–45 minutes across town, arriving perfectly frozen."
  },
  {
    id: "why-4",
    title: "Affordable Prices",
    icon: "🏷️",
    desc: "Premium artisanal quality shouldn't break the bank! Generous scoops starting at just Rs. 180 and loaded sundaes from Rs. 400."
  }
];

// Customer Reviews from PRD Section 5
const REVIEWS = [
  {
    id: "rev-1",
    name: "Ayesha Khan",
    city: "Karachi",
    rating: 5,
    text: "The Mango Magic scoop is hands down the best mango ice cream in Karachi! Tastes like sweet Chaunsa mango fresh off the tree. And ScoopBot recommended the family deal which saved us so much!",
    avatar: "👩‍💼",
    favoriteItem: "Mango Magic (Rs. 220)",
    date: "2 days ago"
  },
  {
    id: "rev-2",
    name: "Bilal Ahmed",
    city: "Lahore",
    rating: 5,
    text: "Ordered the Chocolate Brownie Sundae and the Oreo Shake. The brownie was warm, fudge was rich and decadent, and delivery was under 30 minutes! 10/10 recommended.",
    avatar: "👨‍💻",
    favoriteItem: "Chocolate Brownie Sundae (Rs. 450)",
    date: "1 week ago"
  },
  {
    id: "rev-3",
    name: "Fatima Zahra",
    city: "Islamabad",
    rating: 5,
    text: "We ordered the Birthday Special Cake for my daughter's 10th birthday. It was breathtakingly colorful and so delicious! Everyone at the party asked where we got it from.",
    avatar: "👩‍👧",
    favoriteItem: "Birthday Special Cake (Rs. 2,200)",
    date: "3 weeks ago"
  },
  {
    id: "rev-4",
    name: "Daniyal Sheikh",
    city: "Karachi",
    rating: 5,
    text: "Pistachio Delight has real roasted pistachios and subtle cardamom notes. The website checkout was super fast with Easypaisa, and the chat bot answered all my questions instantly!",
    avatar: "🧑‍🎓",
    favoriteItem: "Pistachio Delight (Rs. 280)",
    date: "Just yesterday"
  }
];

// Team Members for About Page
const TEAM_MEMBERS = [
  {
    name: "Chef Zainab Tariq",
    role: "Master Churner & Head Alchemist",
    bio: "Trained in artisan gelato in Italy, Zainab crafts our velvety churns using authentic local dairy and exotic infusions.",
    avatar: "👩‍🍳",
    badge: "Gelato Master"
  },
  {
    name: "Hamza Malik",
    role: "Flavor Innovation Lead",
    bio: "Obsessed with pairing sweet fruits like Chaunsa mango with rich creams, roasted nuts, and delicate spices.",
    avatar: "🧑‍🔬",
    badge: "Flavor Wizard"
  },
  {
    name: "Sara Qureshi",
    role: "Customer Delight & Happiness Manager",
    bio: "Ensures every order is packed with dry ice and delivered with a smile within 30 to 45 minutes guaranteed.",
    avatar: "👩‍💼",
    badge: "Happiness Champion"
  }
];

// Quick Action Prompts for ScoopBot
const CHATBOT_QUICK_ACTIONS = [
  { label: "🍨 View Menu", query: "show menu" },
  { label: "💰 Check Prices", query: "check prices" },
  { label: "⭐ Popular Flavors", query: "popular flavors" },
  { label: "🎉 Today's Offers", query: "offers" },
  { label: "💡 Recommend Something", query: "recommend" },
  { label: "🏷️ Under Rs. 300", query: "under 300" },
  { label: "🍫 Chocolate Delights", query: "chocolate" },
  { label: "🥭 Mango Availability", query: "mango" }
];
