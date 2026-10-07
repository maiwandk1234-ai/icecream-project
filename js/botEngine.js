// ==========================================================================
// ScoopBot - Rule-Based Mock AI Response & Recommendation Engine
// Fully compliant with PRD Sections 12, 13, 14, 15, 17
// ==========================================================================

const ScoopBotEngine = {
  // Generate response object containing: text, optional recommendations array, quick actions
  processQuery: function(input) {
    const raw = (input || "").toLowerCase().trim();

    // 1. GREETINGS
    if (/^(hi|hello|hey|salam|assalam|hola|good morning|good evening|good afternoon)/i.test(raw)) {
      return {
        text: "Hi there sweet friend! 👋 I'm ScoopBot, your dedicated ice cream assistant! How can I make your day sweeter today?",
        recommendations: [
          PRODUCTS.find(p => p.id === "scoop-2"), // Chocolate Fudge
          PRODUCTS.find(p => p.id === "scoop-4")  // Mango Magic
        ],
        quickReplies: ["🍨 View Menu", "💰 Check Prices", "⭐ Popular Flavors", "🎉 Today's Offers", "💡 Recommend Something"]
      };
    }

    // 2. CHEAPEST PRODUCT (PRD Section 14)
    if (/cheap|cheapest|lowest price|affordable|budget|least expensive/i.test(raw)) {
      const cheapestScoop = PRODUCTS.filter(p => p.category === "Scoops").sort((a,b) => a.price - b.price)[0];
      const affordableItems = PRODUCTS.filter(p => p.price <= 220);
      return {
        text: `🍨 Our most affordable treat is the **Vanilla Dream scoop** at just **Rs. ${cheapestScoop.price}**! Looking for a crunchy bite? The **Classic Cone** is also only **Rs. 200**. Here are our top budget-friendly delights:`,
        recommendations: [
          PRODUCTS.find(p => p.id === "scoop-1"), // Vanilla Dream (180)
          PRODUCTS.find(p => p.id === "cone-1"),  // Classic Cone (200)
          PRODUCTS.find(p => p.id === "scoop-3")  // Strawberry Bliss (200)
        ],
        quickReplies: ["🏷️ Under Rs. 300", "🍨 All Scoops", "🎉 Today's Offers"]
      };
    }

    // 3. PRODUCTS UNDER RS. 300 (PRD Section 14)
    if (/under 300|less than 300|below 300|300 pkr|300 rs|under 350|under 250/i.test(raw)) {
      const budgetItems = PRODUCTS.filter(p => p.price <= 300);
      return {
        text: `✨ We have **${budgetItems.length} delicious treats under Rs. 300**! From artisanal scoops to crispy chocolate cones:`,
        recommendations: budgetItems.slice(0, 4),
        quickReplies: ["🍨 View Menu", "🍫 Chocolate Delights", "🥭 Mango Availability"]
      };
    }

    // 4. CHOCOLATE PRODUCTS (PRD Section 14)
    if (/chocolate|choco|brownie|cocoa|dark chocolate|fudge/i.test(raw)) {
      const chocoItems = PRODUCTS.filter(p => p.flavorType === "Chocolate" || p.name.toLowerCase().includes("chocolate") || p.name.toLowerCase().includes("brownie") || p.name.toLowerCase().includes("oreo"));
      return {
        text: "🍫 For all the true chocoholics! Here are our rich, Belgian cocoa and molten fudge favorites:",
        recommendations: [
          PRODUCTS.find(p => p.id === "scoop-2"),   // Chocolate Fudge Rs. 220
          PRODUCTS.find(p => p.id === "sundae-1"),  // Chocolate Brownie Sundae Rs. 450
          PRODUCTS.find(p => p.id === "shake-1"),   // Chocolate Shake Rs. 350
          PRODUCTS.find(p => p.id === "cake-1")     // Chocolate Cake Rs. 1800
        ].filter(Boolean),
        quickReplies: ["🍨 View Menu", "🎉 Today's Offers", "💰 Check Prices"]
      };
    }

    // 5. MANGO AVAILABILITY (PRD Section 14)
    if (/mango|chaunsa|alphonso|aam/i.test(raw)) {
      const mangoItems = PRODUCTS.filter(p => p.name.toLowerCase().includes("mango") || p.flavor.toLowerCase().includes("mango"));
      return {
        text: "🥭 **Yes, absolutely!** We have pure Chaunsa mango delights churned daily with 100% natural mango pulp! Try our **Mango Magic scoop (Rs. 220)** or our thick and frosty **Mango Shake (Rs. 350)**! 🌞",
        recommendations: mangoItems,
        quickReplies: ["🍓 Strawberry Bliss", "⭐ Popular Flavors", "🛒 View Cart"]
      };
    }

    // 6. POPULAR FLAVORS / BESTSELLERS (PRD Section 5 & 13)
    if (/popular|bestseller|best|favorite|famous|top rated/i.test(raw)) {
      const populars = PRODUCTS.filter(p => p.isPopular).slice(0, 4);
      return {
        text: "🌟 Here are our top customer-favorite stars with over 4.8★ ratings across Pakistan:",
        recommendations: populars,
        quickReplies: ["🎉 Today's Offers", "🍫 Chocolate Delights", "💡 Recommend Something"]
      };
    }

    // 7. TODAY'S OFFERS & DEALS (PRD Section 11 & 13)
    if (/offer|deal|discount|promo|happy hour|combo|coupon|sale/i.test(raw)) {
      return {
        text: `🎉 **Today's Special Sweet Offers at Scoop & Swirl:**\n\n` +
              `⏰ **Happy Hour (4 PM–6 PM)**: 20% OFF Everything (Use code: **HAPPYHOUR**)\n` +
              `🍨 **Double Scoop Deal**: Any 2 Scoops for just **Rs. 320**!\n` +
              `👨‍👩‍👧‍👦 **Family Combo**: 4 Scoops + 2 Shakes for **Rs. 1,150**!\n` +
              `🎉 **Weekend Special**: Buy 2 Sundaes & get 1 Topping FREE!\n\n` +
              `You can apply the promo codes right at checkout!`,
        recommendations: [
          PRODUCTS.find(p => p.id === "scoop-2"), // Chocolate Fudge
          PRODUCTS.find(p => p.id === "sundae-1"), // Brownie Sundae
          PRODUCTS.find(p => p.id === "shake-3")  // Oreo Shake
        ],
        quickReplies: ["🍨 View Menu", "💰 Check Prices", "🏷️ Under Rs. 300"]
      };
    }

    // 8. RECOMMEND SOMETHING (PRD Section 13 & 14)
    if (/recommend|suggest|what should i (get|try|eat|order)|surprise me|special/i.test(raw)) {
      return {
        text: "✨ Here is my hand-picked signature trio! A rich scoop, an extravagant sundae, and our loaded Oreo shake:",
        recommendations: [
          PRODUCTS.find(p => p.id === "scoop-6"),   // Pistachio Delight Rs. 280
          PRODUCTS.find(p => p.id === "sundae-1"),  // Chocolate Brownie Sundae Rs. 450
          PRODUCTS.find(p => p.id === "shake-3")    // Oreo Shake Rs. 400
        ].filter(Boolean),
        quickReplies: ["🍫 Chocolate Delights", "🥭 Mango Availability", "⭐ Popular Flavors"]
      };
    }

    // 9. VIEW MENU / CHECK PRICES / FLAVORS (PRD Section 13 & 14)
    if (/menu|flavor|flavours|price|prices|how much|catalog|list/i.test(raw)) {
      return {
        text: `📋 **Scoop & Swirl Complete Price Guide:**\n\n` +
              `• **Scoops (Rs. 180 – 280)**: Vanilla Dream (180), Strawberry Bliss (200), Mango Magic (220), Chocolate Fudge (220), Cookies & Cream (250), Pistachio Delight (280)\n` +
              `• **Cones (Rs. 200 – 350)**: Classic (200), Chocolate Dipped (250), Double Scoop (350)\n` +
              `• **Shakes (Rs. 330 – 400)**: Strawberry (330), Chocolate (350), Mango (350), Oreo Shake (400)\n` +
              `• **Sundaes (Rs. 400 – 450)**: Strawberry (400), Caramel Delight (430), Oreo Crunch (450), Chocolate Brownie (450)\n` +
              `• **Ice Cream Cakes (Rs. 1,700 – 2,200)**: Strawberry (1,700), Chocolate (1,800), Birthday Special (2,200)`,
        recommendations: [
          PRODUCTS.find(p => p.id === "scoop-1"),
          PRODUCTS.find(p => p.id === "cone-3"),
          PRODUCTS.find(p => p.id === "sundae-1"),
          PRODUCTS.find(p => p.id === "cake-3")
        ],
        quickReplies: ["🏷️ Under Rs. 300", "⭐ Popular Flavors", "🎉 Today's Offers"]
      };
    }

    // 10. CAKES & BIRTHDAYS
    if (/cake|birthday|party|celebration|anniversary/i.test(raw)) {
      const cakes = PRODUCTS.filter(p => p.category === "Ice Cream Cakes");
      return {
        text: "🎂 Celebrating something special? Our artisanal ice cream cakes serve 8–14 people and arrive perfectly chilled in dry ice with celebration candles included!",
        recommendations: cakes,
        quickReplies: ["🍨 View Menu", "🎉 Today's Offers", "💰 Check Prices"]
      };
    }

    // 11. SHAKES
    if (/shake|milkshake|smoothie|thickshake/i.test(raw)) {
      const shakes = PRODUCTS.filter(p => p.category === "Shakes");
      return {
        text: "🥤 Made with whole dairy milk and two giant scoops of our signature ice creams! Here are our creamy shakes:",
        recommendations: shakes,
        quickReplies: ["🍨 View Menu", "⭐ Popular Flavors", "🛒 View Cart"]
      };
    }

    // 12. SUNDAES
    if (/sundae|sundaes|topping|hot fudge/i.test(raw)) {
      const sundaes = PRODUCTS.filter(p => p.category === "Sundaes");
      return {
        text: "🍨 Loaded sundaes layered with sauces, cookies, warm brownies, and fluffy cream:",
        recommendations: sundaes,
        quickReplies: ["🎉 Weekend Special", "⭐ Popular Flavors", "🛒 View Cart"]
      };
    }

    // 13. CONES
    if (/cone|cones|waffle/i.test(raw)) {
      const cones = PRODUCTS.filter(p => p.category === "Cones");
      return {
        text: "🍦 Freshly baked golden waffle cones with that irresistible artisan crunch:",
        recommendations: cones,
        quickReplies: ["🍨 View Menu", "💰 Check Prices", "🛒 View Cart"]
      };
    }

    // 14. DELIVERY, LOCATION, HOURS, PAYMENT (PRD Section 10 & 16)
    if (/deliver|timing|time|hour|open|location|address|where|phone|contact|pay|payment/i.test(raw)) {
      return {
        text: `📍 **Shop Info & Ordering Details:**\n\n` +
              `• **Address**: Shop 14, Block 5, Clifton, Karachi, Pakistan\n` +
              `• **Hours**: Monday – Sunday, 11:00 AM – 11:00 PM\n` +
              `• **Delivery**: Standard delivery is Rs. 100, delivered in 30–45 minutes in insulated dry-ice boxes!\n` +
              `• **Payment**: Cash on Delivery (COD), Debit/Credit Card, Easypaisa, and JazzCash accepted\n` +
              `• **Call/WhatsApp**: ${SHOP_INFO.phone} | ${SHOP_INFO.whatsapp}`,
        recommendations: [
          PRODUCTS.find(p => p.id === "scoop-2"),
          PRODUCTS.find(p => p.id === "sundae-1")
        ],
        quickReplies: ["🍨 View Menu", "🎉 Today's Offers", "🛒 Go to Cart"]
      };
    }

    // 15. CART & CHECKOUT
    if (/cart|checkout|order now|buy/i.test(raw)) {
      return {
        text: "🛒 You can review your cart anytime by clicking the Cart button at the top right! We deliver across town in 30–45 minutes with mock payment via Cash on Delivery, Card, Easypaisa, or JazzCash.",
        recommendations: [
          PRODUCTS.find(p => p.id === "scoop-2"),
          PRODUCTS.find(p => p.id === "sundae-1")
        ],
        quickReplies: ["🍨 View Menu", "🎉 Today's Offers", "💰 Check Prices"]
      };
    }

    // 16. INGREDIENTS / DIETARY / HALAL / REAL DAIRY (PRD Section 4 & 5)
    if (/halal|dairy|egg|eggless|milk|fresh|healthy|calories/i.test(raw)) {
      return {
        text: "🥛 All Scoop & Swirl creations are **100% Halal**, made with pure local whole milk, fresh cream, and real fruits. Most of our scoops and sundaes are **100% Eggless**! Zero artificial preservatives or gelatins.",
        recommendations: [
          PRODUCTS.find(p => p.id === "scoop-1"),
          PRODUCTS.find(p => p.id === "scoop-4")
        ],
        quickReplies: ["🍨 View Menu", "⭐ Popular Flavors", "💡 Recommend Something"]
      };
    }

    // 17. FALLBACK / GENERAL
    return {
      text: "🍨 I'd love to help you find the sweetest treat! You can ask me to **list flavors**, find **products under Rs. 300**, check the **cheapest scoop**, explore **chocolate or mango** items, or ask for a **recommendation**!",
      recommendations: [
        PRODUCTS.find(p => p.id === "scoop-2"),
        PRODUCTS.find(p => p.id === "scoop-4"),
        PRODUCTS.find(p => p.id === "shake-3")
      ],
      quickReplies: ["🍨 View Menu", "💰 Check Prices", "⭐ Popular Flavors", "🎉 Today's Offers", "💡 Recommend Something"]
    };
  }
};
