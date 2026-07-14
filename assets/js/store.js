/* ============================================================
   hyggehome — глобальная конфигурация и точки интеграции.
   Пустые поля = функция работает в демо-режиме (localStorage).
   Заполненные apiBase/telegramBot = боевой режим (нужен бэкенд).
   Единый источник правды для всех страниц сайта.
   ============================================================ */
window.HH_CONFIG = {
  brand: "hyggehome",
  apiBase: "",                 // напр. "https://api.hyggehome.top" (бэкенд)
  currency: "RUB",
  locale: "ru-RU",
  siteUrl: "https://hyggehome.top",

  // Соцсети (ссылки в шапке и подвале). Подставляются автоматически (sync()).
  social: {
    vk:        "https://vk.com/hyggehome",
    telegram:  "https://t.me/hyggehome",
    instagram: "https://instagram.com/hyggehome"   // Instagram (Meta) ограничен в РФ
  },

  // Контакты и витрины на маркетплейсах (подставляются в подвал).
  contacts: {
    email: "hello@hyggehome.top",
    phone: "+7 999 000-00-00"
  },
  marketplaces: {
    wildberries: "",   // напр. "https://www.wildberries.ru/seller/XXXXXX"
    ozon:        ""    // напр. "https://www.ozon.ru/seller/XXXXXX"
  },

  // Telegram-бот: имя без @ для виджета входа и уведомлений о заказах
  telegramBot: "",             // напр. "hyggehome_bot"

  // Программа лояльности: скидка по накопленной сумме покупок
  loyalty: {
    tiers: [
      { key: "guest",  name: "Гость",    min: 0,     discount: 0 },
      { key: "member", name: "Участник", min: 0,     discount: 5,  requiresAuth: true },
      { key: "silver", name: "Серебро",  min: 10000, discount: 7,  requiresAuth: true },
      { key: "gold",   name: "Золото",   min: 30000, discount: 10, requiresAuth: true }
    ]
  },

  // Способы доставки. price — демо-оценка; реальный расчёт считает API службы.
  delivery: {
    freeFrom: 5000,
    methods: [
      { id: "courier", label: "Курьер по Москве",   price: 350, needsPvz: false },
      { id: "cdek",    label: "СДЭК — пункт выдачи", price: 300, needsPvz: true, api: "https://api.cdek.ru" },
      { id: "ozon",    label: "Ozon — пункт выдачи", price: 250, needsPvz: true },
      { id: "wb",      label: "Wildberries — ПВЗ",   price: 250, needsPvz: true },
      { id: "post",    label: "Почта России",        price: 400, needsPvz: false }
    ]
  },

  paymentProvider: "yookassa"  // yookassa | cloudpayments | robokassa | tinkoff | sbp
};

/* ============================================================
   hyggehome — демо-каталог.
   В будущем эти данные отдаёт бэкенд (GET {apiBase}/products).
   Сейчас — статический массив, чтобы витрина и поиск работали.
   Поля: id, name, category, sub, price, oldPrice (необяз.), tag (необяз.),
   rating, desc.
   ============================================================ */
window.HH_CATEGORIES = {
  kitchen:  { name: "Посуда",   slug: "kitchen",  desc: "Тарелки, кружки, сковороды",
              subs: ["Тарелки", "Кружки", "Сковороды", "Приборы", "Хранение"] },
  textile:  { name: "Текстиль", slug: "textile",  desc: "Полотенца и постельное бельё",
              subs: ["Полотенца", "Постельное бельё", "Пледы", "Декор"] },
  cleaning: { name: "Уборка",   slug: "cleaning", desc: "Спреи, щётки, салфетки",
              subs: ["Средства", "Микрофибра", "Щётки"] },
  misc:     { name: "Мелочи",   slug: "misc",     desc: "Ролики для одежды и не только",
              subs: ["Ролики", "Свечи", "Хранение", "Крючки"] }
};

window.HH_PRODUCTS = [
  { id: "k01", name: "Керамическая тарелка «Туман»", category: "kitchen", sub: "Тарелки", price: 690, tag: "hit", rating: 4.8,
    desc: "Матовая тарелка из керамики, 26 см. Спокойный серо-зелёный оттенок, приятная на ощупь глазурь." },
  { id: "k02", name: "Кружка «Утро» 350 мл", category: "kitchen", sub: "Кружки", price: 520, oldPrice: 690, tag: "sale", rating: 4.9,
    desc: "Толстостенная кружка, дольше держит тепло. Удобная ручка, подходит для посудомоечной машины." },
  { id: "k03", name: "Сковорода с гранитным покрытием 24 см", category: "kitchen", sub: "Сковороды", price: 2390, rating: 4.6,
    desc: "Антипригарное покрытие, индукционное дно. Готовит с минимумом масла." },
  { id: "k04", name: "Набор столовых приборов, 24 предмета", category: "kitchen", sub: "Приборы", price: 1890, tag: "new", rating: 4.7,
    desc: "Нержавеющая сталь, матовая полировка. На 6 персон, в подарочной коробке." },
  { id: "k05", name: "Стеклянная банка для хранения 1 л", category: "kitchen", sub: "Хранение", price: 340, rating: 4.5,
    desc: "Герметичная крышка с зажимом. Для круп, кофе и специй." },
  { id: "k06", name: "Деревянная разделочная доска", category: "kitchen", sub: "Хранение", price: 790, rating: 4.8,
    desc: "Бук, промаслена. С отверстием для подвеса и желобком для сока." },

  { id: "t01", name: "Полотенце махровое 50×90", category: "textile", sub: "Полотенца", price: 450, tag: "hit", rating: 4.9,
    desc: "Хлопок 500 г/м², отлично впитывает и долго служит. Цвет «тёплый песок»." },
  { id: "t02", name: "Набор полотенец, 3 шт.", category: "textile", sub: "Полотенца", price: 1190, oldPrice: 1490, tag: "sale", rating: 4.8,
    desc: "Три размера в одной гамме. Мягкие после первой стирки, не линяют." },
  { id: "t03", name: "Постельное бельё, 1.5-спальное", category: "textile", sub: "Постельное бельё", price: 2290, rating: 4.7,
    desc: "Сатин-люкс, плотное плетение. Приятно прохладное летом, уютное зимой." },
  { id: "t04", name: "Плед-покрывало 150×200", category: "textile", sub: "Пледы", price: 1690, tag: "new", rating: 4.9,
    desc: "Мягкий флис с эффектом «травки». Тёплый и лёгкий, не электризуется." },
  { id: "t05", name: "Наволочка декоративная 45×45", category: "textile", sub: "Декор", price: 390, rating: 4.6,
    desc: "Фактурная ткань в природной палитре. Скрытая молния, чехол снимается." },
  { id: "t06", name: "Кухонное полотенце, набор 2 шт.", category: "textile", sub: "Полотенца", price: 320, rating: 4.5,
    desc: "Вафельный хлопок, быстро сохнет. С петелькой для подвеса." },

  { id: "c01", name: "Спрей для кухни, эко-формула 500 мл", category: "cleaning", sub: "Средства", price: 290, tag: "hit", rating: 4.7,
    desc: "Растворяет жир без едкого запаха. Биоразлагаемый состав, безопасен для поверхностей." },
  { id: "c02", name: "Набор микрофибры, 5 шт.", category: "cleaning", sub: "Микрофибра", price: 380, rating: 4.8,
    desc: "Разные цвета для разных зон. Не оставляют разводов и ворса." },
  { id: "c03", name: "Щётка для посуды с дозатором", category: "cleaning", sub: "Щётки", price: 420, tag: "new", rating: 4.6,
    desc: "Сменная насадка, мыло подаётся нажатием. Удобно лежит в руке." },
  { id: "c04", name: "Средство для пола, концентрат 1 л", category: "cleaning", sub: "Средства", price: 340, rating: 4.5,
    desc: "Экономичный концентрат, мягкий аромат. Подходит для ламината и плитки." },

  { id: "m01", name: "Ролик для чистки одежды + 2 сменных блока", category: "misc", sub: "Ролики", price: 350, tag: "hit", rating: 4.9,
    desc: "Сильная клейкая лента, удобная ручка. Снимает шерсть, ворс и пыль за пару движений." },
  { id: "m02", name: "Сменные блоки для ролика, 3 шт.", category: "misc", sub: "Ролики", price: 290, rating: 4.7,
    desc: "Совместимы со стандартными роликами. 60 слоёв в каждом блоке." },
  { id: "m03", name: "Органайзер для мелочей, 6 секций", category: "misc", sub: "Хранение", price: 540, tag: "new", rating: 4.6,
    desc: "Складной, из плотного фетра. Для ящика комода или шкафа." },
  { id: "m04", name: "Набор крючков самоклеящихся, 6 шт.", category: "misc", sub: "Крючки", price: 240, rating: 4.5,
    desc: "Держат до 3 кг, не портят стену. Для кухни, ванной и прихожей." },
  { id: "m05", name: "Свеча ароматическая «Хвоя»", category: "misc", sub: "Свечи", price: 590, tag: "hit", rating: 4.9,
    desc: "Соевый воск, 40 часов горения. Тёплый лесной аромат — настроение hygge." },
  { id: "m06", name: "Плетёная корзина для хранения", category: "misc", sub: "Хранение", price: 890, rating: 4.7,
    desc: "Натуральные волокна, держит форму. Для пледов, игрушек или белья." }
];

/* ============================================================
   hyggehome — общий слой: корзина, пользователи, лояльность,
   доставка, заказы. Демо-хранилище — localStorage.
   Боевой режим: методы переключаются на запросы к config.apiBase
   (точки помечены "ИНТЕГРАЦИЯ").
   ============================================================ */
(function () {
  var cfg = window.HH_CONFIG || {};
  var fmt = new Intl.NumberFormat(cfg.locale || "ru-RU");
  var K = {
    cart: "hh_cart_v1", users: "hh_users_v1",
    session: "hh_session_v1", orders: "hh_orders_v1"
  };

  function read(k, def) { try { return JSON.parse(localStorage.getItem(k)) || def; } catch (e) { return def; } }
  function write(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

  function getProducts() { return window.HH_PRODUCTS || []; }
  function findProduct(id) { return getProducts().find(function (p) { return p.id === id; }); }
  function price(v) { return fmt.format(Math.round(v)) + " ₽"; }

  /* ---------- корзина ---------- */
  function readCart() { return read(K.cart, []); }
  function writeCart(items) { write(K.cart, items); sync(); }
  function addToCart(id, qty) {
    qty = qty || 1; var items = readCart();
    var r = items.find(function (i) { return i.id === id; });
    if (r) r.qty += qty; else items.push({ id: id, qty: qty });
    writeCart(items);
  }
  function setQty(id, qty) {
    var items = readCart(); var r = items.find(function (i) { return i.id === id; });
    if (!r) return; r.qty = Math.max(1, qty); writeCart(items);
  }
  function removeFromCart(id) { writeCart(readCart().filter(function (i) { return i.id !== id; })); }
  function clearCart() { writeCart([]); }
  function cartCount() { return readCart().reduce(function (n, i) { return n + i.qty; }, 0); }
  function cartLines() {
    return readCart().map(function (i) {
      var p = findProduct(i.id); return p ? { product: p, qty: i.qty, sum: p.price * i.qty } : null;
    }).filter(Boolean);
  }
  function cartSubtotal() { return cartLines().reduce(function (s, l) { return s + l.sum; }, 0); }

  /* ---------- пользователи (демо) ---------- */
  /* ВНИМАНИЕ: демо-хранение в localStorage небезопасно. В бою — бэкенд,
     хеширование паролей, сессии/JWT. См. README, раздел «Регистрация». */
  function users() { return read(K.users, {}); }
  function saveUsers(u) { write(K.users, u); }
  function currentUser() {
    var id = localStorage.getItem(K.session); if (!id) return null;
    return users()[id] || null;
  }
  function register(data) {
    var u = users(); var id = (data.contact || "").trim().toLowerCase();
    if (!id || !data.password) throw new Error("Укажите контакт и пароль");
    if (u[id]) throw new Error("Пользователь уже зарегистрирован");
    u[id] = { id: id, name: data.name || "", contact: id, password: data.password, lifetime: 0, via: "form", createdAt: Date.now() };
    saveUsers(u); localStorage.setItem(K.session, id); sync(); return u[id];
    /* ИНТЕГРАЦИЯ: POST {apiBase}/auth/register */
  }
  function login(contact, password) {
    var u = users(); var id = (contact || "").trim().toLowerCase();
    if (!u[id] || u[id].password !== password) throw new Error("Неверный контакт или пароль");
    localStorage.setItem(K.session, id); sync(); return u[id];
    /* ИНТЕГРАЦИЯ: POST {apiBase}/auth/login */
  }
  function loginTelegram(tg) {
    // tg = { id, first_name, username } из Telegram Login Widget
    var u = users(); var id = "tg:" + tg.id;
    if (!u[id]) u[id] = { id: id, name: tg.first_name || tg.username || "Гость", contact: id, lifetime: 0, via: "telegram", createdAt: Date.now() };
    saveUsers(u); localStorage.setItem(K.session, id); sync(); return u[id];
    /* ИНТЕГРАЦИЯ: проверка подписи Telegram на бэкенде, затем сессия */
  }
  function logout() { localStorage.removeItem(K.session); sync(); }
  function updateUser(patch) {
    var cu = currentUser(); if (!cu) return; var u = users();
    Object.assign(u[cu.id], patch); saveUsers(u); sync();
  }

  /* ---------- лояльность ---------- */
  function tiers() { return (cfg.loyalty && cfg.loyalty.tiers) || [{ key: "guest", name: "Гость", min: 0, discount: 0 }]; }
  function currentTier() {
    var cu = currentUser(); var auth = !!cu; var lifetime = cu ? (cu.lifetime || 0) : 0;
    var best = tiers()[0];
    tiers().forEach(function (t) {
      var okAuth = t.requiresAuth ? auth : true;
      if (okAuth && lifetime >= t.min && t.discount >= best.discount) best = t;
    });
    return best;
  }
  function nextTier() {
    var cu = currentUser(); var lifetime = cu ? (cu.lifetime || 0) : 0;
    var above = tiers().filter(function (t) { return t.min > lifetime; }).sort(function (a, b) { return a.min - b.min; });
    return above[0] || null;
  }
  function discountPercent() { return currentTier().discount || 0; }
  function cartDiscount() { return Math.round(cartSubtotal() * discountPercent() / 100); }

  /* ---------- доставка ---------- */
  function deliveryMethods() { return (cfg.delivery && cfg.delivery.methods) || []; }
  function deliveryMethod(id) { return deliveryMethods().find(function (m) { return m.id === id; }) || deliveryMethods()[0]; }
  function deliveryCost(id, payable) {
    var m = deliveryMethod(id); if (!m) return 0;
    var free = cfg.delivery && cfg.delivery.freeFrom;
    if (free && payable >= free) return 0;
    return m.price || 0;
    /* ИНТЕГРАЦИЯ: реальный тариф — API службы (СДЭК/Ozon/WB) через бэкенд */
  }
  function cartTotal(deliveryId) {
    var payable = cartSubtotal() - cartDiscount();
    return payable + deliveryCost(deliveryId, payable);
  }

  /* ---------- заказы (демо) ---------- */
  function listOrders() {
    var cu = currentUser(); if (!cu) return [];
    return (read(K.orders, {})[cu.id]) || [];
  }
  function addOrder(order) {
    var cu = currentUser();
    var all = read(K.orders, {});
    var key = cu ? cu.id : "guest";
    order.id = "HH-" + Date.now().toString().slice(-6);
    order.date = Date.now();
    (all[key] = all[key] || []).unshift(order);
    write(K.orders, all);
    if (cu) updateUser({ lifetime: (cu.lifetime || 0) + (order.paid || 0) });
    sync();
    return order;
    /* ИНТЕГРАЦИЯ: POST {apiBase}/orders -> { paymentUrl } -> redirect на оплату */
  }

  /* ---------- превью товара (без фото) ---------- */
  var ICONS = {
    kitchen:  '<circle cx="32" cy="32" r="18" fill="none" stroke="currentColor" stroke-width="2.4"/><circle cx="32" cy="32" r="9" fill="none" stroke="currentColor" stroke-width="2.4"/>',
    textile:  '<rect x="14" y="16" width="36" height="32" rx="4" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M14 26h36M23 16v32" stroke="currentColor" stroke-width="2.4"/>',
    cleaning: '<path d="M27 12h10v9H27z" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M25 21h14l3 9v22H22V30z" fill="none" stroke="currentColor" stroke-width="2.4"/>',
    misc:     '<rect x="15" y="15" width="34" height="17" rx="4" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M32 32v9" stroke="currentColor" stroke-width="2.4"/><path d="M26 41h12v12H26z" fill="none" stroke="currentColor" stroke-width="2.4"/>'
  };
  var BG = { kitchen: ["#EFE7DB", "#E3D8C6"], textile: ["#E7ECE6", "#D7E0D6"], cleaning: ["#E5EAE6", "#D6E1DA"], misc: ["#F1E4D8", "#E8D3BF"] };
  function thumb(p, big) {
    var bg = BG[p.category] || BG.misc, ic = ICONS[p.category] || ICONS.misc, s = big ? 120 : 64;
    return '<div class="thumb" style="background:linear-gradient(135deg,' + bg[0] + ',' + bg[1] + ')">' +
      '<svg viewBox="0 0 64 64" width="' + s + '" height="' + s + '" style="color:#2E3A34;opacity:.55">' + ic + '</svg></div>';
  }
  function tagLabel(t) { return t === "hit" ? "хит" : t === "new" ? "новинка" : t === "sale" ? "скидка" : ""; }

  function toast(msg) {
    var el = document.createElement("div"); el.className = "hh-toast"; el.textContent = msg;
    document.body.appendChild(el); requestAnimationFrame(function () { el.classList.add("in"); });
    setTimeout(function () { el.classList.remove("in"); setTimeout(function () { el.remove(); }, 300); }, 1900);
  }

  /* ---------- синхронизация UI ---------- */
  function setHref(sel, url) {
    if (!url) return;
    document.querySelectorAll(sel).forEach(function (a) { a.href = url; a.classList.remove("is-off"); });
  }
  function sync() {
    var n = cartCount();
    document.querySelectorAll(".cart-count").forEach(function (el) { el.textContent = n; });
    var cu = currentUser();
    document.querySelectorAll(".account-name").forEach(function (el) { el.textContent = cu ? (cu.name || "Кабинет") : "Войти"; });
    if (cfg.social) {
      setHref(".soc-vk", cfg.social.vk);
      setHref(".soc-tg", cfg.social.telegram);
      setHref(".soc-ig", cfg.social.instagram);
    }
    if (cfg.marketplaces) {
      setHref(".mp-wb", cfg.marketplaces.wildberries);
      setHref(".mp-ozon", cfg.marketplaces.ozon);
    }
    if (cfg.contacts) {
      document.querySelectorAll(".contact-email").forEach(function (a) {
        if (cfg.contacts.email) { a.textContent = cfg.contacts.email; a.href = "mailto:" + cfg.contacts.email; }
      });
      document.querySelectorAll(".contact-phone").forEach(function (a) {
        if (cfg.contacts.phone) { a.textContent = cfg.contacts.phone; a.href = "tel:" + cfg.contacts.phone.replace(/[^+\d]/g, ""); }
      });
    }
    document.dispatchEvent(new CustomEvent("hh:changed"));
  }

  window.HH = {
    config: cfg, categories: window.HH_CATEGORIES,
    getProducts: getProducts, findProduct: findProduct, price: price,
    addToCart: addToCart, setQty: setQty, removeFromCart: removeFromCart, clearCart: clearCart,
    cartCount: cartCount, cartLines: cartLines, cartSubtotal: cartSubtotal,
    cartDiscount: cartDiscount, cartTotal: cartTotal,
    auth: { register: register, login: login, loginTelegram: loginTelegram, logout: logout, currentUser: currentUser, updateUser: updateUser },
    loyalty: { tiers: tiers, currentTier: currentTier, nextTier: nextTier, discountPercent: discountPercent },
    deliveryMethods: deliveryMethods, deliveryMethod: deliveryMethod, deliveryCost: deliveryCost,
    addOrder: addOrder, listOrders: listOrders,
    thumb: thumb, tagLabel: tagLabel, toast: toast, sync: sync
  };

  document.addEventListener("DOMContentLoaded", function () {
    sync();
    document.body.addEventListener("click", function (e) {
      var add = e.target.closest("[data-add]"); if (add) { e.preventDefault(); var p = findProduct(add.getAttribute("data-add")); addToCart(add.getAttribute("data-add"), 1); toast(p ? "Добавлено: " + p.name : "Добавлено"); }
      var lo = e.target.closest("[data-logout]"); if (lo) { e.preventDefault(); logout(); location.href = "account.html"; }
    });
  });
  window.addEventListener("storage", function (e) { if (e.key && e.key.indexOf("hh_") === 0) sync(); });
})();
