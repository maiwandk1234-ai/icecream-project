// ==========================================================================
// Scoop & Swirl - React Application Main Component
// Fully compliant with PRD Sections 1 through 25
// ==========================================================================

const { useState, useEffect, useMemo, useRef } = React;

function App() {
  // Navigation & Page State
  const [activePage, setActivePage] = useState("home"); // home, menu, offers, about, contact, checkout
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [soundMuted, setSoundMuted] = useState(false);

  // Cart State (Persisted in LocalStorage)
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("scoop_cart");
      return saved ? JSON.parse(saved) : [];
    } catch(e) {
      return [];
    }
  });

  // Favorites State (Persisted in LocalStorage)
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem("scoop_favorites");
      return saved ? JSON.parse(saved) : ["scoop-2", "scoop-4"];
    } catch(e) {
      return ["scoop-2", "scoop-4"];
    }
  });

  // UI Drawers & Modals
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [favModalOpen, setFavModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeModalQty, setActiveModalQty] = useState(1);
  const [orderSuccessData, setOrderSuccessData] = useState(null);

  // Menu Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedFlavorType, setSelectedFlavorType] = useState("All");
  const [priceFilter, setPriceFilter] = useState("All");
  const [sortBy, setSortBy] = useState("featured");

  // Promo Code State
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState("");

  // Toast Notifications
  const [toasts, setToasts] = useState([]);

  // ScoopBot Chatbot State (PRD Section 12-15)
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [chatbotMinimized, setChatbotMinimized] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      id: "msg-welcome",
      sender: "bot",
      text: "Hi! I'm ScoopBot 🍨 How can I help you today?",
      time: "Just now",
      recommendations: [
        PRODUCTS.find(p => p.id === "scoop-2"), // Chocolate Fudge
        PRODUCTS.find(p => p.id === "scoop-4")  // Mango Magic
      ],
      quickReplies: ["🍨 View Menu", "💰 Check Prices", "⭐ Popular Flavors", "🎉 Today's Offers", "💡 Recommend Something"]
    }
  ]);
  const chatMessagesEndRef = useRef(null);

  // Sync Cart to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem("scoop_cart", JSON.stringify(cart));
    } catch(e) {}
  }, [cart]);

  // Sync Favorites to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem("scoop_favorites", JSON.stringify(favorites));
    } catch(e) {}
  }, [favorites]);

  // Scroll Chat to bottom
  useEffect(() => {
    if (chatMessagesEndRef.current) {
      chatMessagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, isBotTyping]);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activePage]);

  // Toast System
  const showToast = (message, icon = "🍨") => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, icon }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3200);
  };

  // Sound Toggle
  const toggleSound = () => {
    const isMuted = SoundEffects.toggleMute();
    setSoundMuted(isMuted);
    showToast(isMuted ? "Sound muted 🔇" : "Sound effects enabled 🔔", isMuted ? "🔇" : "🔔");
  };

  // Favorite Toggle
  const toggleFavorite = (productId, e) => {
    if (e) e.stopPropagation();
    SoundEffects.playPop();
    setFavorites(prev => {
      if (prev.includes(productId)) {
        showToast("Removed from favorites", "💔");
        return prev.filter(id => id !== productId);
      } else {
        const prod = PRODUCTS.find(p => p.id === productId);
        showToast(`Saved ${prod ? prod.name : 'item'} to favorites!`, "💖");
        return [...prev, productId];
      }
    });
  };

  // Cart Operations
  const addToCart = (product, quantity = 1, e) => {
    if (e) e.stopPropagation();
    SoundEffects.playScoop();
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        return [...prev, { ...product, quantity }];
      }
    });
    showToast(`Added ${quantity > 1 ? quantity + 'x ' : ''}${product.name} to cart!`, "🛒");
  };

  const updateCartQty = (productId, delta) => {
    SoundEffects.playPop();
    setCart(prev => {
      return prev.map(item => {
        if (item.id === productId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const removeFromCart = (productId) => {
    SoundEffects.playPop();
    setCart(prev => prev.filter(item => item.id !== productId));
    showToast("Item removed from cart", "🗑️");
  };

  const clearCart = () => {
    SoundEffects.playPop();
    setCart([]);
    setAppliedPromo(null);
    showToast("Cart cleared", "✨");
  };

  // Apply Special Deal as a Bundle into Cart
  const addDealToCart = (deal) => {
    SoundEffects.playScoop();
    if (deal.comboItems && deal.comboItems.length > 0) {
      // Add combo items
      deal.comboItems.forEach(itemId => {
        const p = PRODUCTS.find(prod => prod.id === itemId);
        if (p) {
          addToCart(p, 1);
        }
      });
      // Automatically apply deal promo code
      if (deal.code) {
        setAppliedPromo({
          code: deal.code,
          discountPercent: deal.discountPercent || 0,
          discountAmount: deal.fixedPrice ? 350 : 0,
          title: deal.title
        });
      }
      showToast(`Added ${deal.title} combo to cart!`, "🎉");
      setCartDrawerOpen(true);
    } else if (deal.code) {
      applyPromoCode(deal.code);
      setCartDrawerOpen(true);
    }
  };

  // Calculations (Exact PRD Example: Chocolate Fudge Rs. 220 × 2 + Mango Magic Rs. 220 × 1 = Rs. 660 subtotal + Rs. 100 delivery = Rs. 760 total)
  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [cart]);

  const discountAmount = useMemo(() => {
    if (!appliedPromo || cartSubtotal === 0) return 0;
    if (appliedPromo.discountPercent) {
      return Math.round((cartSubtotal * appliedPromo.discountPercent) / 100);
    }
    if (appliedPromo.discountAmount) {
      return Math.min(appliedPromo.discountAmount, cartSubtotal);
    }
    return 0;
  }, [appliedPromo, cartSubtotal]);

  const deliveryFee = cart.length > 0 ? SHOP_INFO.deliveryFee : 0;
  const grandTotal = Math.max(0, cartSubtotal - discountAmount + deliveryFee);
  const totalCartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Promo Code Validation
  const applyPromoCode = (codeToApply) => {
    const code = (codeToApply || promoInput).trim().toUpperCase();
    if (!code) return;

    if (code === "HAPPYHOUR" || code === "HAPPY20" || code === "SCOOP20") {
      setAppliedPromo({ code, discountPercent: 20, title: "Happy Hour 20% OFF" });
      setPromoError("");
      setPromoInput("");
      SoundEffects.playSuccess();
      showToast("Happy Hour 20% OFF applied!", "🎉");
    } else if (code === "DOUBLESCOOP") {
      setAppliedPromo({ code, discountAmount: 140, title: "Double Scoop Special" });
      setPromoError("");
      setPromoInput("");
      SoundEffects.playSuccess();
      showToast("Double Scoop Discount Applied!", "🍨");
    } else if (code === "FAMILYCOMBO") {
      setAppliedPromo({ code, discountAmount: 350, title: "Family Combo Special" });
      setPromoError("");
      setPromoInput("");
      SoundEffects.playSuccess();
      showToast("Family Combo Discount Applied!", "👨‍👩‍👧‍👦");
    } else {
      setPromoError("Invalid code. Try HAPPYHOUR or DOUBLESCOOP!");
      SoundEffects.playPop();
    }
  };

  // Chatbot Send Message & Mock AI Response
  const sendChatMessage = (textToSend) => {
    const query = (textToSend || chatInput).trim();
    if (!query) return;

    SoundEffects.playPop();
    const userMsg = {
      id: "usr-" + Date.now(),
      sender: "user",
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setIsBotTyping(true);

    // Mock AI typing delay for responsive feel
    setTimeout(() => {
      const response = ScoopBotEngine.processQuery(query);
      setIsBotTyping(false);
      SoundEffects.playBotMessage();
      setChatMessages(prev => [
        ...prev,
        {
          id: "bot-" + Date.now(),
          sender: "bot",
          text: response.text,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          recommendations: response.recommendations,
          quickReplies: response.quickReplies
        }
      ]);
    }, 750);
  };

  // Reset Conversation (PRD Section 12)
  const resetChatbot = () => {
    SoundEffects.playPop();
    setChatMessages([
      {
        id: "msg-welcome-reset-" + Date.now(),
        sender: "bot",
        text: "Hi! I'm ScoopBot 🍨 How can I help you today?",
        time: "Just now",
        recommendations: [
          PRODUCTS.find(p => p.id === "scoop-2"),
          PRODUCTS.find(p => p.id === "scoop-4")
        ],
        quickReplies: ["🍨 View Menu", "💰 Check Prices", "⭐ Popular Flavors", "🎉 Today's Offers", "💡 Recommend Something"]
      }
    ]);
    showToast("Chat conversation reset", "🔄");
  };

  // Filter & Search Logic for Menu Page
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(prod => {
      // Category match
      if (selectedCategory !== "All" && prod.category !== selectedCategory) {
        return false;
      }
      // Flavor type match
      if (selectedFlavorType !== "All" && prod.flavorType !== selectedFlavorType) {
        return false;
      }
      // Price filter
      if (priceFilter === "under250" && prod.price >= 250) return false;
      if (priceFilter === "under450" && (prod.price < 250 || prod.price > 450)) return false;
      if (priceFilter === "above450" && prod.price <= 450) return false;

      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = prod.name.toLowerCase().includes(q);
        const matchFlavor = prod.flavor.toLowerCase().includes(q);
        const matchDesc = prod.description.toLowerCase().includes(q);
        const matchCat = prod.category.toLowerCase().includes(q);
        if (!matchName && !matchFlavor && !matchDesc && !matchCat) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === "priceAsc") return a.price - b.price;
      if (sortBy === "priceDesc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "popular") return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
      return 0; // featured default
    });
  }, [searchQuery, selectedCategory, selectedFlavorType, priceFilter, sortBy]);

  // Open Product Modal
  const openProductDetails = (product) => {
    setSelectedProduct(product);
    setActiveModalQty(1);
    SoundEffects.playPop();
  };

  // Render Category Counts for Pills
  const categoryCounts = useMemo(() => {
    const counts = { All: PRODUCTS.length };
    PRODUCTS.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <div className="site-wrapper">
      {/* Toast Notifications */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className="toast-item">
            <span style={{ fontSize: "1.2rem" }}>{toast.icon}</span>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

      {/* ==================== NAVBAR ==================== */}
      <header className="site-header">
        <div className="container nav-inner">
          {/* Logo & Brand */}
          <a href="#" className="brand-logo-wrap" onClick={(e) => { e.preventDefault(); setActivePage("home"); }}>
            <img src="./assets/Logo.svg.svg" alt="Scoop & Swirl Logo" className="brand-logo-img" />
            <div className="brand-text">
              <span className="brand-name">Scoop & <span>Swirl</span></span>
              <span className="brand-sub">Artisan Creamery</span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav>
            <ul className="nav-links">
              <li>
                <a href="#home" className={`nav-link ${activePage === "home" ? "active" : ""}`} onClick={(e) => { e.preventDefault(); setActivePage("home"); }}>
                  Home
                </a>
              </li>
              <li>
                <a href="#menu" className={`nav-link ${activePage === "menu" ? "active" : ""}`} onClick={(e) => { e.preventDefault(); setActivePage("menu"); }}>
                  Menu
                </a>
              </li>
              <li>
                <a href="#offers" className={`nav-link ${activePage === "offers" ? "active" : ""}`} onClick={(e) => { e.preventDefault(); setActivePage("offers"); }}>
                  Special Offers
                </a>
              </li>
              <li>
                <a href="#about" className={`nav-link ${activePage === "about" ? "active" : ""}`} onClick={(e) => { e.preventDefault(); setActivePage("about"); }}>
                  About Us
                </a>
              </li>
              <li>
                <a href="#contact" className={`nav-link ${activePage === "contact" ? "active" : ""}`} onClick={(e) => { e.preventDefault(); setActivePage("contact"); }}>
                  Contact
                </a>
              </li>
            </ul>
          </nav>

          {/* Action Buttons: Sound, Favorites, Cart, Chatbot */}
          <div className="nav-actions">
            <button className="btn-icon" title={soundMuted ? "Enable Sound" : "Mute Sound"} onClick={toggleSound}>
              {soundMuted ? "🔇" : "🔔"}
            </button>

            <button className="btn-icon fav-nav-btn" title="View Favorites" onClick={() => setFavModalOpen(true)}>
              ❤️
              {favorites.length > 0 && <span className="fav-count-badge">{favorites.length}</span>}
            </button>

            <button className="cart-pill-btn" onClick={() => setCartDrawerOpen(true)}>
              <span>🛒</span>
              <span className="cart-count-badge">{totalCartItemsCount}</span>
              <span style={{ marginLeft: "0.2rem" }}>Rs. {cartSubtotal}</span>
            </button>

            {/* Mobile Hamburger */}
            <button className="mobile-nav-toggle btn-icon" onClick={() => setMobileMenuOpen(true)}>
              ☰
            </button>
          </div>
        </div>
      </header>

      {/* ==================== MOBILE NAVIGATION DRAWER ==================== */}
      <div className={`mobile-drawer-overlay ${mobileMenuOpen ? "open" : ""}`} onClick={() => setMobileMenuOpen(false)}></div>
      <div className={`mobile-nav-drawer ${mobileMenuOpen ? "open" : ""}`}>
        <div className="mobile-drawer-header">
          <div className="brand-logo-wrap">
            <img src="./assets/Logo.svg.svg" alt="Scoop & Swirl" style={{ width: 36, height: 36 }} />
            <span className="brand-name" style={{ fontSize: "1.2rem" }}>Scoop & <span>Swirl</span></span>
          </div>
          <button className="btn-icon" onClick={() => setMobileMenuOpen(false)}>✕</button>
        </div>

        <ul className="mobile-drawer-links">
          <li>
            <a href="#home" className={activePage === "home" ? "active" : ""} onClick={(e) => { e.preventDefault(); setActivePage("home"); setMobileMenuOpen(false); }}>
              🍨 Home
            </a>
          </li>
          <li>
            <a href="#menu" className={activePage === "menu" ? "active" : ""} onClick={(e) => { e.preventDefault(); setActivePage("menu"); setMobileMenuOpen(false); }}>
              📋 Our Menu
            </a>
          </li>
          <li>
            <a href="#offers" className={activePage === "offers" ? "active" : ""} onClick={(e) => { e.preventDefault(); setActivePage("offers"); setMobileMenuOpen(false); }}>
              🎉 Special Offers
            </a>
          </li>
          <li>
            <a href="#about" className={activePage === "about" ? "active" : ""} onClick={(e) => { e.preventDefault(); setActivePage("about"); setMobileMenuOpen(false); }}>
              ✨ About Scoop & Swirl
            </a>
          </li>
          <li>
            <a href="#contact" className={activePage === "contact" ? "active" : ""} onClick={(e) => { e.preventDefault(); setActivePage("contact"); setMobileMenuOpen(false); }}>
              📍 Contact & Hours
            </a>
          </li>
        </ul>

        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "0.8rem" }}>
          <button className="btn btn-primary" style={{ width: "100%" }} onClick={() => { setMobileMenuOpen(false); setChatbotOpen(true); }}>
            🤖 Chat with ScoopBot
          </button>
          <button className="btn btn-secondary" style={{ width: "100%" }} onClick={() => { setMobileMenuOpen(false); setCartDrawerOpen(true); }}>
            🛒 View Cart ({totalCartItemsCount})
          </button>
        </div>
      </div>

      {/* ==================== MAIN PAGE ROUTING ==================== */}
      <main>
        {/* ================= PAGE: HOME ================= */}
        {activePage === "home" && (
          <div>
            {/* HERO SECTION */}
            <section className="hero-section">
              <div className="container hero-grid">
                <div className="hero-content">
                  <div className="hero-pill">
                    <span>✨</span> Freshly Churned Daily in Pakistan
                  </div>
                  <h1 className="hero-title">
                    Happiness Served <br />
                    One <span className="highlight">Scoop</span> at a Time 🍨
                  </h1>
                  <p className="hero-desc">
                    Handcrafted artisanal ice creams, decadent loaded sundaes, creamy thick milkshakes, and celebration ice cream cakes made with 100% pure local dairy.
                  </p>

                  <div className="hero-cta-group">
                    <button className="btn btn-primary" style={{ padding: "0.9rem 2.2rem", fontSize: "1.05rem" }} onClick={() => setActivePage("menu")}>
                      Explore Menu 🍨
                    </button>
                    <button className="btn btn-secondary" style={{ padding: "0.9rem 2rem", fontSize: "1.05rem" }} onClick={() => { setActivePage("menu"); setCartDrawerOpen(true); }}>
                      Order Now ⚡
                    </button>
                    <button className="btn btn-golden" onClick={() => setChatbotOpen(true)}>
                      Ask ScoopBot 🤖
                    </button>
                  </div>

                  <div className="hero-stats">
                    <div className="hero-stat-item">
                      <span className="hero-stat-val">100%</span>
                      <span className="hero-stat-lbl">Real Dairy Milk</span>
                    </div>
                    <div className="hero-stat-item">
                      <span className="hero-stat-val">18+</span>
                      <span className="hero-stat-lbl">Artisan Flavors</span>
                    </div>
                    <div className="hero-stat-item">
                      <span className="hero-stat-val">30 Min</span>
                      <span className="hero-stat-lbl">Chilled Delivery</span>
                    </div>
                  </div>
                </div>

                <div className="hero-visual-wrap">
                  <div className="hero-image-card">
                    <img src="./assets/hero_display.jpg" alt="Artisan Ice Cream Treats" />
                    
                    {/* Floating Badges */}
                    <div className="floating-badge badge-top-left">
                      <span className="floating-badge-icon">⭐</span>
                      <div>
                        <div className="floating-badge-title">4.9 / 5 Rating</div>
                        <div className="floating-badge-sub">2,500+ Happy Scoopers</div>
                      </div>
                    </div>

                    <div className="floating-badge badge-bottom-right">
                      <span className="floating-badge-icon">🥭</span>
                      <div>
                        <div className="floating-badge-title">Chaunsa Mango Magic</div>
                        <div className="floating-badge-sub">Only Rs. 220</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* POPULAR FLAVORS SECTION (PRD Section 5) */}
            <section style={{ padding: "4rem 0" }}>
              <div className="container">
                <div className="section-header">
                  <span className="section-tag">Customer Favorites</span>
                  <h2 className="section-title">Popular Flavors</h2>
                  <p className="section-desc">
                    Our most celebrated and frequently ordered signature scoops, thickshakes, and decadent sundaes.
                  </p>
                </div>

                <div className="product-grid">
                  {PRODUCTS.filter(p => p.isPopular).slice(0, 6).map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isFavorited={favorites.includes(product.id)}
                      onToggleFav={(e) => toggleFavorite(product.id, e)}
                      onAddToCart={(e) => addToCart(product, 1, e)}
                      onCardClick={() => openProductDetails(product)}
                    />
                  ))}
                </div>

                <div style={{ textAlign: "center", marginTop: "3rem" }}>
                  <button className="btn btn-secondary" style={{ padding: "0.85rem 2.4rem" }} onClick={() => setActivePage("menu")}>
                    View All {PRODUCTS.length} Flavors & Treats →
                  </button>
                </div>
              </div>
            </section>

            {/* SPECIAL OFFERS SECTION (PRD Section 5 & 11) */}
            <section style={{ padding: "4.5rem 0", background: "var(--bg-soft-vanilla)" }}>
              <div className="container">
                <div className="section-header">
                  <span className="section-tag">Sweet Deals</span>
                  <h2 className="section-title">Special Offers & Deals</h2>
                  <p className="section-desc">
                    Save big on family packs, afternoon happy hour delights, and double scoop deals!
                  </p>
                </div>

                <div className="offers-grid">
                  {SPECIAL_OFFERS.map(offer => (
                    <div key={offer.id} className="offer-card">
                      <div className="offer-card-top">
                        <div className="offer-icon-box">{offer.icon}</div>
                        <span className="offer-badge badge badge-strawberry">{offer.badge}</span>
                      </div>
                      <h3 className="offer-title">{offer.title}</h3>
                      <div className="offer-tagline">{offer.tagline}</div>
                      <p className="offer-desc">{offer.description}</p>
                      
                      <div style={{ margin: "0.5rem 0 1rem 0", fontSize: "0.85rem", color: "var(--text-light)" }}>
                        <span>🕒 {offer.timing}</span>
                      </div>

                      <div className="offer-footer">
                        <span className="offer-code-pill">{offer.code}</span>
                        <button className="btn btn-primary" style={{ padding: "0.5rem 1.1rem", fontSize: "0.85rem" }} onClick={() => addDealToCart(offer)}>
                          Claim Offer 🎁
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* WHY CHOOSE US (PRD Section 5) */}
            <section className="why-section">
              <div className="container">
                <div className="section-header">
                  <span className="section-tag">Pure Passion</span>
                  <h2 className="section-title">Why Choose Scoop & Swirl?</h2>
                  <p className="section-desc">
                    We craft every scoop with love, authentic ingredients, and a commitment to pure happiness.
                  </p>
                </div>

                <div className="why-grid">
                  {WHY_CHOOSE_US.map(item => (
                    <div key={item.id} className="why-card">
                      <div className="why-icon-wrap">{item.icon}</div>
                      <h3 className="why-card-title">{item.title}</h3>
                      <p className="why-card-desc">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* CUSTOMER REVIEWS (PRD Section 5) */}
            <section className="reviews-section">
              <div className="container">
                <div className="section-header">
                  <span className="section-tag">Real Love</span>
                  <h2 className="section-title">What Our Customers Say</h2>
                  <p className="section-desc">
                    Read sweet stories and genuine reviews from happy ice cream lovers across Pakistan.
                  </p>
                </div>

                <div className="reviews-grid">
                  {REVIEWS.map(rev => (
                    <div key={rev.id} className="review-card">
                      <div className="review-rating-stars">
                        {"★".repeat(rev.rating)}
                      </div>
                      <p className="review-text">"{rev.text}"</p>
                      <div className="review-author-wrap">
                        <div className="review-avatar">{rev.avatar}</div>
                        <div>
                          <div className="review-author-name">{rev.name}</div>
                          <div className="review-author-city">{rev.city} • <span style={{ color: "var(--primary)" }}>{rev.favoriteItem}</span></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ================= PAGE: MENU (PRD Section 6 & 7) ================= */}
        {activePage === "menu" && (
          <section style={{ padding: "3rem 0 5rem 0" }}>
            <div className="container">
              <div className="section-header" style={{ marginBottom: "2rem" }}>
                <span className="section-tag">Artisan Catalog</span>
                <h1 className="section-title">Explore Our Menu</h1>
                <p className="section-desc">
                  Browse our full collection of fresh scoops, cones, thickshakes, loaded sundaes, and celebratory ice cream cakes.
                </p>
              </div>

              {/* SEARCH & FILTERS BOX */}
              <div className="menu-controls-box">
                {/* Search Bar */}
                <div className="menu-search-bar">
                  <span style={{ fontSize: "1.2rem" }}>🔍</span>
                  <input
                    type="text"
                    className="menu-search-input"
                    placeholder="Search by flavor name, category, or ingredients (e.g. Mango, Fudge, Pistachio)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button className="btn-icon" style={{ width: 28, height: 28 }} onClick={() => setSearchQuery("")}>
                      ✕
                    </button>
                  )}
                </div>

                {/* Category Tabs (PRD Section 6) */}
                <div className="category-tabs-wrap">
                  {["All", "Scoops", "Cones", "Shakes", "Sundaes", "Ice Cream Cakes"].map(cat => (
                    <button
                      key={cat}
                      className={`category-tab-btn ${selectedCategory === cat ? "active" : ""}`}
                      onClick={() => { setSelectedCategory(cat); SoundEffects.playPop(); }}
                    >
                      {cat === "All" && "🍨 All"}
                      {cat === "Scoops" && "🥄 Scoops"}
                      {cat === "Cones" && "🍦 Cones"}
                      {cat === "Shakes" && "🥤 Shakes"}
                      {cat === "Sundaes" && "🍧 Sundaes"}
                      {cat === "Ice Cream Cakes" && "🎂 Cakes"}
                      <span className="category-tab-count">{categoryCounts[cat] || 0}</span>
                    </button>
                  ))}
                </div>

                {/* Sub-Filters Row: Flavor Type, Price Range, Sorting */}
                <div className="menu-subfilters-row">
                  {/* Flavor Filter */}
                  <div className="flavor-filter-chips">
                    <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--choco-dark)" }}>Flavor:</span>
                    {["All", "Chocolate", "Fruity", "Nutty", "Classic"].map(type => (
                      <button
                        key={type}
                        className={`flavor-chip ${selectedFlavorType === type ? "active" : ""}`}
                        onClick={() => { setSelectedFlavorType(type); SoundEffects.playPop(); }}
                      >
                        {type}
                      </button>
                    ))}
                  </div>

                  {/* Price Filter */}
                  <div className="flavor-filter-chips">
                    <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--choco-dark)" }}>Price:</span>
                    {[
                      { id: "All", label: "All Prices" },
                      { id: "under250", label: "< Rs. 250" },
                      { id: "under450", label: "Rs. 250 – 450" },
                      { id: "above450", label: "> Rs. 450" }
                    ].map(p => (
                      <button
                        key={p.id}
                        className={`flavor-chip ${priceFilter === p.id ? "active" : ""}`}
                        onClick={() => { setPriceFilter(p.id); SoundEffects.playPop(); }}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>

                  {/* Sort By */}
                  <div className="sort-select-wrap">
                    <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--choco-dark)" }}>Sort:</span>
                    <select
                      className="sort-select"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="featured">✨ Featured</option>
                      <option value="priceAsc">💰 Price: Low to High</option>
                      <option value="priceDesc">💎 Price: High to Low</option>
                      <option value="rating">⭐ Highest Rated</option>
                      <option value="popular">🔥 Most Popular</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* PRODUCT GRID OR EMPTY STATE (PRD Section 21) */}
              {filteredProducts.length > 0 ? (
                <div className="product-grid">
                  {filteredProducts.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isFavorited={favorites.includes(product.id)}
                      onToggleFav={(e) => toggleFavorite(product.id, e)}
                      onAddToCart={(e) => addToCart(product, 1, e)}
                      onCardClick={() => openProductDetails(product)}
                    />
                  ))}
                </div>
              ) : (
                /* PRD Requirement 21: Oops! We couldn't find that flavor. with View All Flavors */
                <div className="empty-state-box">
                  <div className="empty-state-icon">🍨</div>
                  <h3 className="empty-state-title">Oops! We couldn't find that flavor.</h3>
                  <p className="empty-state-desc">
                    We couldn't find any delicious matches for "{searchQuery}". Try searching for chocolate, mango, vanilla, or pistachio!
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("All");
                      setSelectedFlavorType("All");
                      setPriceFilter("All");
                    }}
                  >
                    View All Flavors 🍨
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ================= PAGE: OFFERS (PRD Section 11) ================= */}
        {activePage === "offers" && (
          <section style={{ padding: "3rem 0 5rem 0" }}>
            <div className="container">
              <div className="section-header">
                <span className="section-tag">Sweet Savings</span>
                <h1 className="section-title">Today's Special Offers</h1>
                <p className="section-desc">
                  Exclusive deals churned specially for you. Claim your offer or apply promo codes directly in the cart!
                </p>
              </div>

              <div className="offers-grid">
                {SPECIAL_OFFERS.map(offer => (
                  <div key={offer.id} className="offer-card">
                    <div className="offer-card-top">
                      <div className="offer-icon-box">{offer.icon}</div>
                      <span className="offer-badge badge badge-strawberry">{offer.badge}</span>
                    </div>
                    <h2 className="offer-title">{offer.title}</h2>
                    <div className="offer-tagline">{offer.tagline}</div>
                    <p className="offer-desc">{offer.description}</p>
                    
                    <div style={{ margin: "0.8rem 0", padding: "0.8rem", background: "var(--bg-cream)", borderRadius: "var(--radius-sm)" }}>
                      <div style={{ fontWeight: 700, color: "var(--choco-dark)", fontSize: "0.95rem" }}>{offer.priceInfo}</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-light)" }}>⏰ {offer.timing}</div>
                    </div>

                    <div className="offer-footer">
                      <span className="offer-code-pill">CODE: {offer.code}</span>
                      <button className="btn btn-primary" onClick={() => addDealToCart(offer)}>
                        Add Deal to Cart 🎁
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chatbot Recommendation Prompt */}
              <div style={{ background: "var(--bg-strawberry)", borderRadius: "var(--radius-xl)", padding: "2.5rem", marginTop: "4rem", textAlign: "center" }}>
                <h3 style={{ fontSize: "1.8rem", marginBottom: "0.6rem" }}>Want a personalized recommendation?</h3>
                <p style={{ maxWidth: 540, margin: "0 auto 1.5rem auto" }}>
                  Chat with ScoopBot to find the best deal tailored to your group size, mood, or budget!
                </p>
                <button className="btn btn-primary" onClick={() => { setChatbotOpen(true); sendChatMessage("recommend an offer"); }}>
                  Ask ScoopBot for Best Deal 🤖
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ================= PAGE: ABOUT (PRD Section 16) ================= */}
        {activePage === "about" && (
          <section style={{ padding: "3rem 0 5rem 0" }}>
            <div className="container">
              <div className="about-hero-grid">
                <div>
                  <span className="section-tag">Our Sweet Story</span>
                  <h1 className="hero-title" style={{ fontSize: "2.8rem" }}>
                    Crafting Smiles <br />
                    Since <span className="highlight">2021</span> 🍨
                  </h1>
                  <p style={{ fontSize: "1.05rem", lineHeight: 1.7, marginBottom: "1.5rem" }}>
                    Scoop & Swirl was founded with a single pure obsession: bringing genuine, small-batch, slow-churned artisanal ice cream to dessert lovers across Pakistan. 
                  </p>
                  <p style={{ fontSize: "1.05rem", lineHeight: 1.7, marginBottom: "2rem" }}>
                    We never use artificial food dyes, palm oils, or chemical stabilizers. Every scoop starts with 100% farm-fresh local cream, sun-ripened Chaunsa mangoes, Swat strawberries, and Belgian cocoa.
                  </p>

                  <div style={{ display: "flex", gap: "1rem" }}>
                    <button className="btn btn-primary" onClick={() => setActivePage("menu")}>
                      Taste the Magic 🍨
                    </button>
                    <button className="btn btn-secondary" onClick={() => setActivePage("contact")}>
                      Visit Our Parlor 📍
                    </button>
                  </div>
                </div>

                <div style={{ textAlign: "center" }}>
                  <img
                    src="./assets/hero_display.jpg"
                    alt="Artisan Ice Cream Crafting"
                    style={{ borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-sweet)", maxHeight: 420, margin: "0 auto" }}
                  />
                </div>
              </div>

              {/* MISSION & VALUES */}
              <div style={{ margin: "5rem 0" }}>
                <div className="section-header">
                  <span className="section-tag">Core Principles</span>
                  <h2 className="section-title">Our Values & Quality Pledge</h2>
                </div>

                <div className="why-grid">
                  <div className="why-card">
                    <div className="why-icon-wrap">🥛</div>
                    <h3 className="why-card-title">100% Real Dairy</h3>
                    <p className="why-card-desc">No vegetable oil blends or powders. Only wholesome, hormone-free Pakistani farm whole milk and heavy cream.</p>
                  </div>
                  <div className="why-card">
                    <div className="why-icon-wrap">🎨</div>
                    <h3 className="why-card-title">Artisanal Churning</h3>
                    <p className="why-card-desc">Slowly churned at low overrun for dense, velvety rich texture that lingers blissfully on your palate.</p>
                  </div>
                  <div className="why-card">
                    <div className="why-icon-wrap">🌱</div>
                    <h3 className="why-card-title">Pure & Natural</h3>
                    <p className="why-card-desc">Hand-picked fresh fruits, authentic roasted nuts, pure vanilla beans, and 100% eggless formulations.</p>
                  </div>
                  <div className="why-card">
                    <div className="why-icon-wrap">💖</div>
                    <h3 className="why-card-title">Community Smiles</h3>
                    <p className="why-card-desc">Delivering happiness in insulated dry-ice boxes to ensure your treat arrives as fresh as inside our parlor.</p>
                  </div>
                </div>
              </div>

              {/* TEAM SECTION (PRD Section 16) */}
              <div style={{ marginTop: "5rem" }}>
                <div className="section-header">
                  <span className="section-tag">Passionate People</span>
                  <h2 className="section-title">Meet Our Churn Master Team</h2>
                  <p className="section-desc">The creative dessert minds and flavor architects behind Scoop & Swirl.</p>
                </div>

                <div className="team-grid">
                  {TEAM_MEMBERS.map(member => (
                    <div key={member.name} className="team-card">
                      <div className="team-avatar-box">{member.avatar}</div>
                      <span className="badge badge-strawberry" style={{ marginBottom: "0.5rem" }}>{member.badge}</span>
                      <h3 className="team-name">{member.name}</h3>
                      <div className="team-role">{member.role}</div>
                      <p className="team-bio">{member.bio}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ================= PAGE: CONTACT (PRD Section 16) ================= */}
        {activePage === "contact" && (
          <section style={{ padding: "3rem 0 5rem 0" }}>
            <div className="container">
              <div className="section-header">
                <span className="section-tag">Get in Touch</span>
                <h1 className="section-title">Contact Our Sweet Parlor</h1>
                <p className="section-desc">
                  Have a question, catering inquiry, or craving a scoop? We are always here to help!
                </p>
              </div>

              <div className="contact-grid">
                {/* Shop Details Card */}
                <div className="contact-info-card">
                  <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Visit Scoop & Swirl</h2>
                  
                  <div className="contact-detail-row">
                    <div className="contact-detail-icon">📍</div>
                    <div>
                      <div className="contact-detail-label">Shop Address</div>
                      <div className="contact-detail-val">{SHOP_INFO.address}</div>
                    </div>
                  </div>

                  <div className="contact-detail-row">
                    <div className="contact-detail-icon">⏰</div>
                    <div>
                      <div className="contact-detail-label">Opening Hours</div>
                      <div className="contact-detail-val">{SHOP_INFO.hours}</div>
                      <span style={{ fontSize: "0.78rem", color: "#10B981", fontWeight: 700 }}>● Open Today</span>
                    </div>
                  </div>

                  <div className="contact-detail-row">
                    <div className="contact-detail-icon">📞</div>
                    <div>
                      <div className="contact-detail-label">Phone & Delivery Hotline</div>
                      <div className="contact-detail-val">{SHOP_INFO.phone}</div>
                      <div style={{ fontSize: "0.85rem", color: "var(--text-light)" }}>WhatsApp: {SHOP_INFO.whatsapp}</div>
                    </div>
                  </div>

                  <div className="contact-detail-row">
                    <div className="contact-detail-icon">✉️</div>
                    <div>
                      <div className="contact-detail-label">Email Inquiries</div>
                      <div className="contact-detail-val">{SHOP_INFO.email}</div>
                    </div>
                  </div>

                  {/* Interactive Mock Map Placeholder */}
                  <div className="mock-map-placeholder">
                    <span style={{ fontSize: "2rem" }}>📍</span>
                    <strong style={{ color: "var(--choco-dark)" }}>Clifton, Block 5, Karachi</strong>
                    <span style={{ fontSize: "0.8rem", color: "var(--choco-medium)" }}>Google Maps Location Pin</span>
                  </div>
                </div>

                {/* Contact Form */}
                <div className="checkout-form-box">
                  <h2 className="checkout-title">Send Us a Sweet Note</h2>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    SoundEffects.playSuccess();
                    showToast("Thank you! Your message has been sent.", "💌");
                    e.target.reset();
                  }}>
                    <div className="form-group-grid">
                      <div className="form-group">
                        <label className="form-label">Your Name</label>
                        <input type="text" className="form-input" required placeholder="e.g. Ayesha Khan" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input type="email" className="form-input" required placeholder="ayesha@example.com" />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Phone Number (Optional)</label>
                      <input type="tel" className="form-input" placeholder="0300-1234567" />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Subject</label>
                      <select className="form-input">
                        <option>General Sweet Inquiry</option>
                        <option>Birthday & Party Catering</option>
                        <option>Custom Cake Pre-Order</option>
                        <option>Feedback or Flavor Request</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Your Message</label>
                      <textarea className="form-input" rows="4" required placeholder="Tell us how we can make your day sweeter..."></textarea>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "0.9rem", fontSize: "1rem" }}>
                      Send Message 💌
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ================= PAGE: CHECKOUT (PRD Section 10) ================= */}
        {activePage === "checkout" && (
          <section className="checkout-section">
            <div className="container">
              <div className="section-header" style={{ marginBottom: "2rem" }}>
                <span className="section-tag">Order Verification</span>
                <h1 className="section-title">Complete Your Order</h1>
                <p className="section-desc">Fast, chilled delivery to your doorstep in 30–45 minutes.</p>
              </div>

              {cart.length === 0 ? (
                /* Empty Cart Prompt */
                <div className="empty-state-box">
                  <div className="empty-state-icon">🍨</div>
                  <h3 className="empty-state-title">Your cart is feeling a little empty 🍨</h3>
                  <p className="empty-state-desc">Please add some scrumptious scoops or shakes before checking out!</p>
                  <button className="btn btn-primary" onClick={() => setActivePage("menu")}>
                    Explore Menu 🍨
                  </button>
                </div>
              ) : (
                <div className="checkout-grid">
                  {/* Checkout Form */}
                  <div className="checkout-form-box">
                    <h2 className="checkout-title">1. Delivery Information</h2>
                    <form id="checkoutForm" onSubmit={(e) => {
                      e.preventDefault();
                      const form = e.target;
                      const orderNum = "#SNS-" + Math.floor(10000 + Math.random() * 90000);
                      const orderData = {
                        orderNumber: orderNum,
                        name: form.fullName.value,
                        phone: form.phone.value,
                        email: form.email.value,
                        address: form.address.value,
                        city: form.city.value,
                        paymentMethod: form.paymentMethod.value,
                        items: [...cart],
                        subtotal: cartSubtotal,
                        delivery: deliveryFee,
                        discount: discountAmount,
                        total: grandTotal,
                        date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      };

                      SoundEffects.playSuccess();
                      setOrderSuccessData(orderData);
                      setCart([]);
                      setAppliedPromo(null);
                    }}>
                      <div className="form-group-grid">
                        <div className="form-group">
                          <label className="form-label">Full Name *</label>
                          <input type="text" name="fullName" className="form-input" required placeholder="e.g. Bilal Ahmed" defaultValue="Bilal Ahmed" />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Phone Number *</label>
                          <input type="tel" name="phone" className="form-input" required placeholder="0300-1234567" defaultValue="0321-4567890" />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Email Address *</label>
                        <input type="email" name="email" className="form-input" required placeholder="bilal@example.com" defaultValue="bilal.ahmed@gmail.com" />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Street Address *</label>
                        <input type="text" name="address" className="form-input" required placeholder="House/Apartment #, Street, Area" defaultValue="Apartment 4B, Ocean View, Clifton Block 4" />
                      </div>

                      <div className="form-group-grid">
                        <div className="form-group">
                          <label className="form-label">City *</label>
                          <select name="city" className="form-input" defaultValue="Karachi">
                            {SHOP_INFO.cities.map(c => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                        </div>
                        <div className="form-group">
                          <label className="form-label">Delivery Note (Optional)</label>
                          <input type="text" name="notes" className="form-input" placeholder="e.g. Ring bell, extra spoons" />
                        </div>
                      </div>

                      <h2 className="checkout-title" style={{ marginTop: "2rem" }}>2. Mock Payment Method</h2>
                      <div className="payment-methods-grid">
                        {[
                          { id: "Cash on Delivery", label: "Cash on Delivery", icon: "💵" },
                          { id: "Card", label: "Debit / Credit Card", icon: "💳" },
                          { id: "Easypaisa", label: "Easypaisa", icon: "📱" },
                          { id: "JazzCash", label: "JazzCash", icon: "⚡" }
                        ].map((method, idx) => (
                          <label key={method.id} className="payment-method-card active">
                            <input
                              type="radio"
                              name="paymentMethod"
                              value={method.id}
                              defaultChecked={idx === 0}
                              style={{ display: "none" }}
                            />
                            <span className="payment-method-icon">{method.icon}</span>
                            <span className="payment-method-name">{method.label}</span>
                          </label>
                        ))}
                      </div>

                      <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "1rem", fontSize: "1.1rem", marginTop: "2.5rem" }}>
                        Place Order (Rs. {grandTotal}) 🎉
                      </button>
                    </form>
                  </div>

                  {/* Sticky Order Summary */}
                  <div className="checkout-summary-card">
                    <h3 style={{ fontSize: "1.3rem", marginBottom: "1.2rem" }}>Order Summary</h3>
                    
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", maxHeight: 280, overflowY: "auto", marginBottom: "1.2rem" }}>
                      {cart.map(item => (
                        <div key={item.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.9rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                            <img src={item.image} alt={item.name} style={{ width: 36, height: 36, objectFit: "contain", borderRadius: 6, background: "var(--bg-cream)" }} />
                            <div>
                              <div style={{ fontWeight: 700, color: "var(--choco-dark)" }}>{item.name}</div>
                              <div style={{ fontSize: "0.78rem", color: "var(--text-light)" }}>Qty: {item.quantity} × Rs. {item.price}</div>
                            </div>
                          </div>
                          <div style={{ fontWeight: 700 }}>Rs. {item.price * item.quantity}</div>
                        </div>
                      ))}
                    </div>

                    {/* Promo Code Input */}
                    <div className="promo-input-row">
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Promo (e.g. HAPPYHOUR)"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        style={{ padding: "0.6rem 0.8rem", textTransform: "uppercase" }}
                      />
                      <button type="button" className="btn btn-secondary" style={{ padding: "0.6rem 1rem" }} onClick={() => applyPromoCode()}>
                        Apply
                      </button>
                    </div>
                    {promoError && <div style={{ color: "#E63946", fontSize: "0.8rem", marginBottom: "0.6rem" }}>{promoError}</div>}
                    {appliedPromo && (
                      <div style={{ background: "var(--bg-mint)", color: "#059669", padding: "0.4rem 0.8rem", borderRadius: "var(--radius-sm)", fontSize: "0.85rem", fontWeight: 700, marginBottom: "1rem" }}>
                        ✓ {appliedPromo.title} (-Rs. {discountAmount})
                      </div>
                    )}

                    {/* Breakdown */}
                    <div className="cart-summary-line">
                      <span>Subtotal</span>
                      <span>Rs. {cartSubtotal}</span>
                    </div>

                    {discountAmount > 0 && (
                      <div className="cart-summary-line" style={{ color: "var(--primary)" }}>
                        <span>Discount ({appliedPromo.code})</span>
                        <span>-Rs. {discountAmount}</span>
                      </div>
                    )}

                    <div className="cart-summary-line">
                      <span>Insulated Dry-Ice Delivery</span>
                      <span>Rs. {deliveryFee}</span>
                    </div>

                    <div className="cart-summary-line total-line">
                      <span>Grand Total</span>
                      <span style={{ color: "var(--primary)" }}>Rs. {grandTotal}</span>
                    </div>

                    <div style={{ fontSize: "0.78rem", color: "var(--text-light)", textAlign: "center" }}>
                      🔒 Frontend-only mock checkout. No real payment charged.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      {/* ==================== FOOTER (PRD Section 5) ==================== */}
      <footer className="site-footer">
        <div className="container">
          <div className="footer-grid">
            {/* Col 1: Brand Info */}
            <div>
              <div className="brand-logo-wrap" style={{ marginBottom: "1rem" }}>
                <img src="./assets/Logo.svg.svg" alt="Scoop & Swirl" style={{ width: 44, height: 44, borderRadius: 10, background: "#FFF", padding: 4 }} />
                <span className="brand-name" style={{ color: "#FFF" }}>Scoop & <span style={{ color: "var(--primary)" }}>Swirl</span></span>
              </div>
              <p style={{ color: "#D3C3BE", fontSize: "0.92rem", lineHeight: 1.6, marginBottom: "1.2rem" }}>
                Pakistan's premier cute artisan ice cream parlor. Churning happiness, real dairy scoops, and celebratory cakes daily in Karachi.
              </p>
              <div style={{ display: "flex", gap: "0.8rem", fontSize: "1.3rem" }}>
                <a href="#instagram" title="Instagram" onClick={(e) => { e.preventDefault(); showToast("Instagram @scoopandswirl.pk"); }}>📸</a>
                <a href="#facebook" title="Facebook" onClick={(e) => { e.preventDefault(); showToast("Facebook @scoopandswirl"); }}>👍</a>
                <a href="#tiktok" title="TikTok" onClick={(e) => { e.preventDefault(); showToast("TikTok @scoopandswirl"); }}>🎵</a>
                <a href="#whatsapp" title="WhatsApp" onClick={(e) => { e.preventDefault(); showToast("WhatsApp 0300-SCOOPS"); }}>💬</a>
              </div>
            </div>

            {/* Col 2: Navigation */}
            <div>
              <h3 className="footer-title">Quick Links</h3>
              <ul className="footer-links-list">
                <li><a href="#home" onClick={(e) => { e.preventDefault(); setActivePage("home"); }}>Home</a></li>
                <li><a href="#menu" onClick={(e) => { e.preventDefault(); setActivePage("menu"); }}>Our Menu</a></li>
                <li><a href="#offers" onClick={(e) => { e.preventDefault(); setActivePage("offers"); }}>Special Offers</a></li>
                <li><a href="#about" onClick={(e) => { e.preventDefault(); setActivePage("about"); }}>About Story</a></li>
                <li><a href="#contact" onClick={(e) => { e.preventDefault(); setActivePage("contact"); }}>Contact & Location</a></li>
              </ul>
            </div>

            {/* Col 3: Categories */}
            <div>
              <h3 className="footer-title">Categories</h3>
              <ul className="footer-links-list">
                <li><a href="#menu" onClick={(e) => { e.preventDefault(); setActivePage("menu"); setSelectedCategory("Scoops"); }}>Artisan Scoops</a></li>
                <li><a href="#menu" onClick={(e) => { e.preventDefault(); setActivePage("menu"); setSelectedCategory("Cones"); }}>Waffle Cones</a></li>
                <li><a href="#menu" onClick={(e) => { e.preventDefault(); setActivePage("menu"); setSelectedCategory("Shakes"); }}>Thick Shakes</a></li>
                <li><a href="#menu" onClick={(e) => { e.preventDefault(); setActivePage("menu"); setSelectedCategory("Sundaes"); }}>Loaded Sundaes</a></li>
                <li><a href="#menu" onClick={(e) => { e.preventDefault(); setActivePage("menu"); setSelectedCategory("Ice Cream Cakes"); }}>Ice Cream Cakes</a></li>
              </ul>
            </div>

            {/* Col 4: Parlor Hours & Contact (PRD Section 16) */}
            <div>
              <h3 className="footer-title">Opening Hours</h3>
              <p style={{ color: "#D3C3BE", fontSize: "0.92rem", marginBottom: "0.8rem" }}>
                <strong>Monday – Sunday:</strong><br />
                11:00 AM – 11:00 PM
              </p>
              <p style={{ color: "#D3C3BE", fontSize: "0.92rem", marginBottom: "0.8rem" }}>
                <strong>Address:</strong><br />
                {SHOP_INFO.address}
              </p>
              <p style={{ color: "#D3C3BE", fontSize: "0.92rem" }}>
                <strong>Helpline:</strong> {SHOP_INFO.phone}
              </p>
            </div>
          </div>

          <div className="footer-bottom-bar">
            <span>© 2026 Scoop & Swirl Creamery. All rights reserved.</span>
            <span>Happiness Served One Scoop at a Time 🍨</span>
          </div>
        </div>
      </footer>

      {/* ==================== CART DRAWER (PRD Section 9) ==================== */}
      <div className={`cart-drawer-overlay ${cartDrawerOpen ? "open" : ""}`} onClick={() => setCartDrawerOpen(false)}></div>
      <div className={`cart-drawer ${cartDrawerOpen ? "open" : ""}`}>
        <div className="cart-drawer-header">
          <div className="cart-drawer-title">
            <span>🛒</span>
            <span>Your Cart</span>
            <span className="badge badge-strawberry" style={{ fontSize: "0.75rem" }}>{totalCartItemsCount} Items</span>
          </div>
          <button className="btn-icon" onClick={() => setCartDrawerOpen(false)}>✕</button>
        </div>

        {cart.length === 0 ? (
          /* PRD Requirement 21: Your cart is feeling a little empty with Explore Menu */
          <div className="empty-state-box" style={{ margin: "auto 1.5rem" }}>
            <div className="empty-state-icon">🍨</div>
            <h3 className="empty-state-title">Your cart is feeling a little empty 🍨</h3>
            <p className="empty-state-desc">Discover our fresh scoops, loaded sundaes, or creamy shakes!</p>
            <button className="btn btn-primary" onClick={() => { setCartDrawerOpen(false); setActivePage("menu"); }}>
              Explore Menu 🍨
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items-list">
              {cart.map(item => (
                <div key={item.id} className="cart-item-row">
                  <img src={item.image} alt={item.name} className="cart-item-thumb" />
                  <div className="cart-item-info">
                    <div className="cart-item-name">{item.name}</div>
                    <div className="cart-item-price">Rs. {item.price} each</div>
                    <div style={{ marginTop: "0.4rem" }}>
                      <div className="qty-control-wrap">
                        <button className="qty-btn" onClick={() => updateCartQty(item.id, -1)}>-</button>
                        <span className="qty-val">{item.quantity}</span>
                        <button className="qty-btn" onClick={() => updateCartQty(item.id, 1)}>+</button>
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.5rem" }}>
                    <div style={{ fontWeight: 800, color: "var(--choco-dark)" }}>Rs. {item.price * item.quantity}</div>
                    <button className="cart-item-remove-btn" title="Remove Item" onClick={() => removeFromCart(item.id)}>
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-drawer-footer">
              <div className="cart-summary-line">
                <span>Subtotal</span>
                <span>Rs. {cartSubtotal}</span>
              </div>
              {discountAmount > 0 && (
                <div className="cart-summary-line" style={{ color: "var(--primary)" }}>
                  <span>Discount ({appliedPromo.code})</span>
                  <span>-Rs. {discountAmount}</span>
                </div>
              )}
              <div className="cart-summary-line">
                <span>Delivery Fee</span>
                <span>Rs. {deliveryFee}</span>
              </div>
              <div className="cart-summary-line total-line">
                <span>Total</span>
                <span>Rs. {grandTotal}</span>
              </div>

              <div style={{ display: "flex", gap: "0.8rem", marginTop: "1rem" }}>
                <button
                  className="btn btn-secondary"
                  style={{ flex: 1, padding: "0.8rem" }}
                  onClick={() => { setCartDrawerOpen(false); setActivePage("menu"); }}
                >
                  Continue Shopping
                </button>
                <button
                  className="btn btn-primary"
                  style={{ flex: 1.2, padding: "0.8rem" }}
                  onClick={() => { setCartDrawerOpen(false); setActivePage("checkout"); }}
                >
                  Checkout →
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ==================== FAVORITES MODAL ==================== */}
      {favModalOpen && (
        <div className="product-modal-overlay" onClick={() => setFavModalOpen(false)}>
          <div className="product-modal-box" style={{ maxWidth: 600, padding: "2rem" }} onClick={(e) => e.stopPropagation()}>
            <button className="product-modal-close-btn" onClick={() => setFavModalOpen(false)}>✕</button>
            <h2 style={{ fontSize: "1.6rem", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span>❤️</span> Your Favorite Treats ({favorites.length})
            </h2>
            <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>Your saved ice cream delights for quick ordering.</p>

            {favorites.length === 0 ? (
              <div style={{ textAlign: "center", padding: "2rem 0" }}>
                <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>💔</div>
                <h3>No favorites saved yet!</h3>
                <p style={{ marginBottom: "1rem" }}>Click the heart icon on any ice cream card to save your favorites.</p>
                <button className="btn btn-primary" onClick={() => { setFavModalOpen(false); setActivePage("menu"); }}>
                  Browse Flavors
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxHeight: 360, overflowY: "auto" }}>
                {favorites.map(id => {
                  const item = PRODUCTS.find(p => p.id === id);
                  if (!item) return null;
                  return (
                    <div key={item.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem", background: "var(--bg-cream)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-light)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                        <img src={item.image} alt={item.name} style={{ width: 50, height: 50, objectFit: "contain", borderRadius: 8, background: "#FFF" }} />
                        <div>
                          <div style={{ fontWeight: 700, color: "var(--choco-dark)" }}>{item.name}</div>
                          <div style={{ fontSize: "0.85rem", color: "var(--primary)", fontWeight: 700 }}>Rs. {item.price}</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button className="btn btn-primary" style={{ padding: "0.4rem 0.85rem", fontSize: "0.82rem" }} onClick={() => addToCart(item, 1)}>
                          + Add to Cart
                        </button>
                        <button className="btn-icon" style={{ width: 34, height: 34 }} onClick={(e) => toggleFavorite(item.id, e)}>
                          ✕
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== PRODUCT DETAILS MODAL (PRD Section 8) ==================== */}
      {selectedProduct && (
        <div className="product-modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="product-modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="product-modal-close-btn" onClick={() => setSelectedProduct(null)}>✕</button>

            <div className="product-modal-grid">
              <div className="product-modal-img-wrap">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="product-modal-img" />
              </div>

              <div className="product-modal-content">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span className="badge badge-strawberry">{selectedProduct.category}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontWeight: 700, color: "#B45309" }}>
                    ⭐ {selectedProduct.rating} ({selectedProduct.reviewsCount} reviews)
                  </div>
                </div>

                <h2 style={{ fontSize: "2rem", marginBottom: "0.3rem" }}>{selectedProduct.name}</h2>
                <div style={{ fontSize: "0.95rem", color: "var(--primary)", fontWeight: 700, marginBottom: "1rem" }}>
                  Flavor: {selectedProduct.flavor}
                </div>

                <p style={{ fontSize: "0.95rem", lineHeight: 1.6, color: "var(--choco-medium)", marginBottom: "1.2rem" }}>
                  {selectedProduct.description}
                </p>

                {/* Dietary Tags */}
                <div className="dietary-tags-list">
                  {selectedProduct.dietary && selectedProduct.dietary.map(d => (
                    <span key={d} className="dietary-tag">✓ {d}</span>
                  ))}
                  {selectedProduct.calories && <span className="dietary-tag">🔥 {selectedProduct.calories}</span>}
                </div>

                {/* Price & Quantity & Actions */}
                <div style={{ marginTop: "auto", paddingTop: "1.5rem", borderTop: "1px solid var(--border-light)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.2rem" }}>
                    <div>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-light)", textTransform: "uppercase", fontWeight: 700 }}>Price</span>
                      <div style={{ fontFamily: "Fredoka", fontSize: "1.8rem", fontWeight: 700, color: "var(--choco-dark)" }}>
                        Rs. {selectedProduct.price * activeModalQty}
                      </div>
                    </div>

                    <div className="qty-control-wrap" style={{ padding: "0.35rem 0.6rem" }}>
                      <button className="qty-btn" style={{ width: 32, height: 32 }} onClick={() => setActiveModalQty(q => Math.max(1, q - 1))}>-</button>
                      <span className="qty-val" style={{ fontSize: "1.1rem", minWidth: 28 }}>{activeModalQty}</span>
                      <button className="qty-btn" style={{ width: 32, height: 32 }} onClick={() => setActiveModalQty(q => q + 1)}>+</button>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "0.8rem" }}>
                    <button
                      className="btn btn-primary"
                      style={{ flex: 1, padding: "0.9rem", fontSize: "1rem" }}
                      onClick={() => {
                        addToCart(selectedProduct, activeModalQty);
                        setSelectedProduct(null);
                      }}
                    >
                      Add to Cart (Rs. {selectedProduct.price * activeModalQty}) 🛒
                    </button>
                    <button
                      className={`btn-icon ${favorites.includes(selectedProduct.id) ? "favorited" : ""}`}
                      style={{ width: 48, height: 48, fontSize: "1.3rem" }}
                      onClick={(e) => toggleFavorite(selectedProduct.id, e)}
                    >
                      {favorites.includes(selectedProduct.id) ? "❤️" : "🤍"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Products Section (PRD Section 8) */}
            <div style={{ padding: "1.8rem 2.5rem 2.5rem 2.5rem", background: "var(--bg-cream)", borderTop: "1px solid var(--border-light)" }}>
              <h3 style={{ fontSize: "1.15rem", marginBottom: "1rem" }}>You Might Also Love</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
                {PRODUCTS.filter(p => p.id !== selectedProduct.id && (p.category === selectedProduct.category || p.flavorType === selectedProduct.flavorType)).slice(0, 3).map(rel => (
                  <div
                    key={rel.id}
                    style={{ background: "#FFF", padding: "0.8rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-light)", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.6rem" }}
                    onClick={() => setSelectedProduct(rel)}
                  >
                    <img src={rel.image} alt={rel.name} style={{ width: 45, height: 45, objectFit: "contain" }} />
                    <div>
                      <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--choco-dark)" }}>{rel.name}</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--primary)", fontWeight: 700 }}>Rs. {rel.price}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== ORDER CONFIRMATION MODAL ==================== */}
      {orderSuccessData && (
        <div className="order-success-overlay">
          <div className="order-success-modal">
            <div className="order-success-icon-wrap">🎉</div>
            <h2 style={{ fontSize: "2rem", marginBottom: "0.4rem" }}>Order Placed Successfully!</h2>
            <p style={{ color: "var(--text-muted)" }}>
              Thank you, <strong>{orderSuccessData.name}</strong>! Your artisanal sweet treats are being prepared with dry-ice packaging.
            </p>

            <div className="order-id-badge">
              Order ID: {orderSuccessData.orderNumber}
            </div>

            <div style={{ textAlign: "left", background: "var(--bg-cream)", padding: "1.2rem", borderRadius: "var(--radius-md)", marginBottom: "1.5rem", fontSize: "0.88rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                <span>Estimated Delivery:</span>
                <strong style={{ color: "#10B981" }}>30 – 45 Minutes</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                <span>Delivery Address:</span>
                <span>{orderSuccessData.address}, {orderSuccessData.city}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                <span>Payment Method:</span>
                <strong>{orderSuccessData.paymentMethod}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px dashed var(--border-light)", paddingTop: "0.5rem", marginTop: "0.5rem" }}>
                <span>Total Amount:</span>
                <strong style={{ fontSize: "1.05rem", color: "var(--primary)" }}>Rs. {orderSuccessData.total}</strong>
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.8rem" }}>
              <button
                className="btn btn-primary"
                style={{ width: "100%", padding: "0.85rem" }}
                onClick={() => {
                  setOrderSuccessData(null);
                  setActivePage("home");
                }}
              >
                Back to Home 🍨
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== CHATBOT - SCOOPBOT (PRD Section 12-15) ==================== */}
      {/* Floating Launcher Button */}
      {!chatbotOpen && (
        <button className="chatbot-launcher-btn" onClick={() => { setChatbotOpen(true); SoundEffects.playPop(); }}>
          <img src="./assets/bot_avatar.jpg" alt="ScoopBot" className="launcher-avatar-img" />
          <span>Chat with ScoopBot 🍨</span>
        </button>
      )}

      {/* Chatbot Expandable Panel */}
      {chatbotOpen && (
        <div className={`chatbot-panel ${chatbotMinimized ? "minimized" : ""}`}>
          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-avatar-wrap">
                <img src="./assets/bot_avatar.jpg" alt="ScoopBot" className="chat-avatar-img" />
                <span className="chat-online-dot"></span>
              </div>
              <div>
                <div className="chat-header-title">ScoopBot 🍨</div>
                <div className="chat-header-sub">Your sweet assistant</div>
              </div>
            </div>

            <div className="chat-header-controls">
              <button className="chat-control-btn" title="Reset Conversation" onClick={resetChatbot}>
                🔄
              </button>
              <button className="chat-control-btn" title={chatbotMinimized ? "Expand" : "Minimize"} onClick={() => setChatbotMinimized(m => !m)}>
                {chatbotMinimized ? "🔼" : "➖"}
              </button>
              <button className="chat-control-btn" title="Close" onClick={() => setChatbotOpen(false)}>
                ✕
              </button>
            </div>
          </div>

          {!chatbotMinimized && (
            <>
              {/* Message Stream */}
              <div className="chat-messages-stream">
                {chatMessages.map(msg => (
                  <div key={msg.id} className={`chat-message-row ${msg.sender}`}>
                    <div className="chat-message-bubble">
                      <div style={{ whiteSpace: "pre-line" }}>{msg.text}</div>

                      {/* Recommended Products in Chat (PRD Section 14 & 17) */}
                      {msg.recommendations && msg.recommendations.length > 0 && (
                        <div className="chat-recommendations-list">
                          {msg.recommendations.map(prod => (
                            <div key={prod.id} className="chat-product-card">
                              <img src={prod.image} alt={prod.name} className="chat-product-thumb" />
                              <div className="chat-product-info">
                                <div className="chat-product-name">{prod.name}</div>
                                <div className="chat-product-price">Rs. {prod.price}</div>
                              </div>
                              <button
                                className="chat-add-btn"
                                onClick={() => addToCart(prod, 1)}
                              >
                                + Add to Cart
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="chat-timestamp">{msg.time}</div>
                    </div>
                  </div>
                ))}

                {/* Animated Typing Indicator (PRD Section 21) */}
                {isBotTyping && (
                  <div className="typing-indicator-row">
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                    <span className="typing-text">ScoopBot is typing...</span>
                  </div>
                )}

                <div ref={chatMessagesEndRef} />
              </div>

              {/* Quick Actions (PRD Section 13) */}
              <div className="chat-quick-actions-bar">
                {CHATBOT_QUICK_ACTIONS.map(action => (
                  <button
                    key={action.label}
                    className="quick-action-chip"
                    onClick={() => sendChatMessage(action.query)}
                  >
                    {action.label}
                  </button>
                ))}
              </div>

              {/* Chat Input Bar */}
              <form className="chat-input-bar" onSubmit={(e) => { e.preventDefault(); sendChatMessage(); }}>
                <input
                  type="text"
                  className="chat-text-input"
                  placeholder="Ask about flavors, prices, deals, chocolate..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                />
                <button type="submit" className="chat-send-btn" title="Send message">
                  ➤
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// Subcomponent: Product Card
function ProductCard({ product, isFavorited, onToggleFav, onAddToCart, onCardClick }) {
  return (
    <div className="product-card">
      <div className="product-card-thumb-wrap" onClick={onCardClick}>
        {product.badge && (
          <div className="product-badge-overlay">
            <span className="badge badge-strawberry">{product.badge}</span>
          </div>
        )}

        <button
          className={`fav-toggle-btn ${isFavorited ? "favorited" : ""}`}
          onClick={onToggleFav}
          title={isFavorited ? "Remove from Favorites" : "Save to Favorites"}
        >
          {isFavorited ? "❤️" : "🤍"}
        </button>

        <img src={product.image} alt={product.name} className="product-card-thumb" />
      </div>

      <div className="product-card-body">
        <div className="product-card-meta">
          <span className="product-card-category">{product.category}</span>
          <span className="product-card-rating">⭐ {product.rating}</span>
        </div>

        <h3 className="product-card-title" onClick={onCardClick}>{product.name}</h3>
        <div className="product-card-flavor">{product.flavor}</div>
        <p className="product-card-desc">{product.description}</p>

        <div className="product-card-footer">
          <div className="product-price-wrap">
            <span className="product-price-label">Price</span>
            <span className="product-price-value">Rs. {product.price}</span>
          </div>

          <button className="add-cart-btn" onClick={onAddToCart}>
            <span>🛒</span> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

// Mount React Root
const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);
