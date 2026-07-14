/* ============================================================
   hyggehome — общий слой: корзина (localStorage), цены, превью.
   Экспортирует глобальный объект window.HH.
   Когда появится бэкенд, методы корзины/заказа можно переключить
   на запросы к {apiBase} — интерфейс останется тем же.
   ============================================================ */
(function () {
  var CART_KEY = "hh_cart_v1";
  var cfg = window.HH_CONFIG || {};
  var fmt = new Intl.NumberFormat(cfg.locale || "ru-RU");

  function getProducts() { return window.HH_PRODUCTS || []; }
  function findProduct(id) { return getProducts().find(function (p) { return p.id === id; }); }

  function readCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
    catch (e) { return []; }
  }
  function writeCart(items) {
    try { localStorage.setItem(CART_KEY, JSON.stringify(items)); } catch (e) {}
    updateBadges();
    document.dispatchEvent(new CustomEvent("hh:cart-changed"));
  }

  function addToCart(id, qty) {
    qty = qty || 1;
    var items = readCart();
    var row = items.find(function (i) { return i.id === id; });
    if (row) row.qty += qty; else items.push({ id: id, qty: qty });
    writeCart(items);
  }
  function setQty(id, qty) {
    var items = readCart();
    var row = items.find(function (i) { return i.id === id; });
    if (!row) return;
    row.qty = Math.max(1, qty);
    writeCart(items);
  }
  function removeFromCart(id) {
    writeCart(readCart().filter(function (i) { return i.id !== id; }));
  }
  function clearCart() { writeCart([]); }

  function cartCount() {
    return readCart().reduce(function (n, i) { return n + i.qty; }, 0);
  }
  function cartLines() {
    return readCart().map(function (i) {
      var p = findProduct(i.id);
      return p ? { product: p, qty: i.qty, sum: p.price * i.qty } : null;
    }).filter(Boolean);
  }
  function cartSubtotal() {
    return cartLines().reduce(function (s, l) { return s + l.sum; }, 0);
  }

  function price(v) { return fmt.format(v) + " ₽"; }

  function updateBadges() {
    var n = cartCount();
    document.querySelectorAll(".cart-count").forEach(function (el) { el.textContent = n; });
    document.querySelectorAll("[data-cart-empty-toggle]").forEach(function (el) {
      el.style.display = n === 0 ? "" : "none";
    });
  }

  // Декоративное превью товара (без фото): мягкий градиент по категории + иконка.
  var ICONS = {
    kitchen:  '<circle cx="32" cy="32" r="18" fill="none" stroke="currentColor" stroke-width="2.4"/><circle cx="32" cy="32" r="9" fill="none" stroke="currentColor" stroke-width="2.4"/>',
    textile:  '<rect x="14" y="16" width="36" height="32" rx="4" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M14 26h36M23 16v32" stroke="currentColor" stroke-width="2.4"/>',
    cleaning: '<path d="M27 12h10v9H27z" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M25 21h14l3 9v22H22V30z" fill="none" stroke="currentColor" stroke-width="2.4"/>',
    misc:     '<rect x="15" y="15" width="34" height="17" rx="4" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M32 32v9" stroke="currentColor" stroke-width="2.4"/><path d="M26 41h12v12H26z" fill="none" stroke="currentColor" stroke-width="2.4"/>'
  };
  var BG = {
    kitchen:  ["#EFE7DB", "#E3D8C6"],
    textile:  ["#E7ECE6", "#D7E0D6"],
    cleaning: ["#E5EAE6", "#D6E1DA"],
    misc:     ["#F1E4D8", "#E8D3BF"]
  };
  function thumb(p, big) {
    var bg = BG[p.category] || BG.misc;
    var ic = ICONS[p.category] || ICONS.misc;
    var size = big ? 120 : 64;
    return '' +
      '<div class="thumb" style="background:linear-gradient(135deg,' + bg[0] + ',' + bg[1] + ')">' +
        '<svg viewBox="0 0 64 64" width="' + size + '" height="' + size + '" style="color:#2E3A34;opacity:.55">' + ic + '</svg>' +
      '</div>';
  }

  function tagLabel(t) {
    return t === "hit" ? "хит" : t === "new" ? "новинка" : t === "sale" ? "скидка" : "";
  }

  // Лёгкое всплывающее уведомление «добавлено в корзину».
  function toast(msg) {
    var el = document.createElement("div");
    el.className = "hh-toast";
    el.textContent = msg;
    document.body.appendChild(el);
    requestAnimationFrame(function () { el.classList.add("in"); });
    setTimeout(function () { el.classList.remove("in"); setTimeout(function () { el.remove(); }, 300); }, 1900);
  }

  window.HH = {
    config: cfg, categories: window.HH_CATEGORIES,
    getProducts: getProducts, findProduct: findProduct,
    addToCart: addToCart, setQty: setQty, removeFromCart: removeFromCart, clearCart: clearCart,
    cartCount: cartCount, cartLines: cartLines, cartSubtotal: cartSubtotal,
    price: price, thumb: thumb, tagLabel: tagLabel, toast: toast, updateBadges: updateBadges
  };

  document.addEventListener("DOMContentLoaded", function () {
    updateBadges();
    // Глобальная привязка кнопок «в корзину»: <button data-add="id">
    document.body.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-add]");
      if (!btn) return;
      e.preventDefault();
      var p = findProduct(btn.getAttribute("data-add"));
      addToCart(btn.getAttribute("data-add"), 1);
      toast(p ? "Добавлено: " + p.name : "Добавлено в корзину");
    });
  });
  // Синхронизация корзины между вкладками.
  window.addEventListener("storage", function (e) { if (e.key === CART_KEY) updateBadges(); });
})();
