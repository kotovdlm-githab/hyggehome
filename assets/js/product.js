/* Страница товара: читает ?id=, рендерит карточку, степпер, похожие товары. */
(function () {
  var root = document.getElementById("product-root");
  var id = new URLSearchParams(location.search).get("id");
  var p = HH.findProduct(id);

  if (!p) {
    root.innerHTML = '<div class="empty"><h3>Товар не найден</h3>' +
      '<p>Возможно, он распродан или ссылка устарела.</p>' +
      '<p style="margin-top:16px"><a class="btn btn-primary" href="catalog.html">В каталог</a></p></div>';
    return;
  }
  document.title = p.name + " — hyggehome";

  var qty = 1;
  var catName = (HH.categories[p.category] || {}).name || "";
  var old = p.oldPrice ? '<span class="price-old">' + HH.price(p.oldPrice) + '</span>' : "";

  root.innerHTML = '' +
    '<div class="crumbs"><a href="index.html">Главная</a> / <a href="catalog.html">Каталог</a> / ' +
      '<a href="catalog.html?cat=' + p.category + '">' + catName + '</a></div>' +
    '<div class="product">' +
      '<div class="gallery">' + HH.thumb(p, true) + '</div>' +
      '<div class="info">' +
        '<span class="eyebrow">' + catName + '</span>' +
        '<h1>' + p.name + '</h1>' +
        '<div class="rating muted">★ ' + p.rating.toFixed(1) + ' · в наличии</div>' +
        '<div class="pprice">' + HH.price(p.price) + old + '</div>' +
        '<p class="pdesc">' + p.desc + '</p>' +
        '<div class="buy-row">' +
          '<div class="stepper"><button id="minus" aria-label="меньше">−</button>' +
            '<span id="q">1</span><button id="plus" aria-label="больше">+</button></div>' +
          '<button class="btn btn-primary" id="addbtn">Добавить в корзину</button>' +
          '<a class="btn btn-ghost" href="cart.html">Перейти в корзину</a>' +
        '</div>' +
        '<div class="specs">' +
          '<div><span>Категория</span><span>' + catName + '</span></div>' +
          '<div><span>Артикул</span><span>' + p.id.toUpperCase() + '</span></div>' +
          '<div><span>Доставка</span><span>по всей России</span></div>' +
        '</div>' +
      '</div>' +
    '</div>';

  var qEl = document.getElementById("q");
  document.getElementById("minus").onclick = function () { qty = Math.max(1, qty - 1); qEl.textContent = qty; };
  document.getElementById("plus").onclick = function () { qty += 1; qEl.textContent = qty; };
  document.getElementById("addbtn").onclick = function () {
    HH.addToCart(p.id, qty);
    HH.toast("Добавлено: " + p.name + " ×" + qty);
  };

  // related: same category, other items
  var rel = window.HH_PRODUCTS.filter(function (x) { return x.category === p.category && x.id !== p.id; }).slice(0, 4);
  if (rel.length) {
    document.getElementById("rel-title").hidden = false;
    document.getElementById("related").innerHTML = rel.map(function (r) {
      return '<article class="card"><a href="product.html?id=' + r.id + '">' + HH.thumb(r) + '</a>' +
        '<div class="body"><div class="pname"><a href="product.html?id=' + r.id + '">' + r.name + '</a></div>' +
        '<div class="price-row"><span class="price">' + HH.price(r.price) + '</span></div>' +
        '<button class="add-mini" data-add="' + r.id + '">В корзину</button></div></article>';
    }).join("");
  }
})();
