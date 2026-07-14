/* Каталог: фильтр по категории, живой поиск, сортировка, синхронизация с URL. */
(function () {
  var grid = document.getElementById("grid");
  var chipsEl = document.getElementById("chips");
  var countEl = document.getElementById("count");
  var searchEl = document.getElementById("search");
  var sortEl = document.getElementById("sort");
  var cats = window.HH_CATEGORIES;

  var params = new URLSearchParams(location.search);
  var state = {
    cat: params.get("cat") || "all",
    q: params.get("q") || "",
    sort: params.get("sort") || "pop"
  };
  searchEl.value = state.q;
  sortEl.value = state.sort;

  // chips
  var chipDefs = [{ slug: "all", name: "Все" }].concat(
    Object.keys(cats).map(function (k) { return { slug: k, name: cats[k].name }; })
  );
  chipDefs.forEach(function (c) {
    var b = document.createElement("button");
    b.className = "chip" + (c.slug === state.cat ? " active" : "");
    b.textContent = c.name;
    b.onclick = function () {
      state.cat = c.slug;
      chipsEl.querySelectorAll(".chip").forEach(function (x) { x.classList.remove("active"); });
      b.classList.add("active");
      render();
    };
    chipsEl.appendChild(b);
  });

  searchEl.addEventListener("input", function () { state.q = searchEl.value; render(); });
  sortEl.addEventListener("change", function () { state.sort = sortEl.value; render(); });

  function syncUrl() {
    var p = new URLSearchParams();
    if (state.cat !== "all") p.set("cat", state.cat);
    if (state.q) p.set("q", state.q);
    if (state.sort !== "pop") p.set("sort", state.sort);
    var qs = p.toString();
    history.replaceState(null, "", qs ? "?" + qs : location.pathname);
  }

  function filtered() {
    var q = state.q.trim().toLowerCase();
    var list = window.HH_PRODUCTS.filter(function (p) {
      if (state.cat !== "all" && p.category !== state.cat) return false;
      if (q && (p.name + " " + p.desc).toLowerCase().indexOf(q) === -1) return false;
      return true;
    });
    var tagRank = { hit: 0, new: 1, sale: 2 };
    list.sort(function (a, b) {
      if (state.sort === "cheap") return a.price - b.price;
      if (state.sort === "expensive") return b.price - a.price;
      if (state.sort === "new") return (a.tag === "new" ? 0 : 1) - (b.tag === "new" ? 0 : 1);
      // popular: rating desc, then tag
      if (b.rating !== a.rating) return b.rating - a.rating;
      return (tagRank[a.tag] ?? 9) - (tagRank[b.tag] ?? 9);
    });
    return list;
  }

  function card(p) {
    var tag = p.tag ? '<span class="tagpill ' + (p.tag === "sale" ? "sale" : "") + '">' + HH.tagLabel(p.tag) + '</span>' : "";
    var old = p.oldPrice ? '<span class="price-old">' + HH.price(p.oldPrice) + '</span>' : "";
    return '' +
      '<article class="card">' +
        '<a href="product.html?id=' + p.id + '" aria-label="' + p.name + '">' + HH.thumb(p) + tag + '</a>' +
        '<div class="body">' +
          '<div class="pname"><a href="product.html?id=' + p.id + '">' + p.name + '</a></div>' +
          '<div class="rating">★ ' + p.rating.toFixed(1) + '</div>' +
          '<div class="price-row"><span class="price">' + HH.price(p.price) + '</span>' + old + '</div>' +
          '<button class="add-mini" data-add="' + p.id + '">В корзину</button>' +
        '</div>' +
      '</article>';
  }

  function render() {
    var list = filtered();
    syncUrl();
    countEl.textContent = list.length
      ? "Найдено товаров: " + list.length
      : "";
    if (!list.length) {
      grid.innerHTML = '<div class="empty" style="grid-column:1/-1"><h3>Ничего не найдено</h3>' +
        '<p>Попробуйте изменить запрос или выбрать другую категорию.</p></div>';
      return;
    }
    grid.innerHTML = list.map(card).join("");
  }

  render();
})();
