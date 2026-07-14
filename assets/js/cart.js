/* Корзина: список, изменение количества, удаление, итог, оформление (заглушка). */
(function () {
  var root = document.getElementById("cart-root");
  var cfg = HH.config;

  function render() {
    var lines = HH.cartLines();
    if (!lines.length) {
      root.innerHTML = '<div class="empty"><h3>Корзина пуста</h3>' +
        '<p>Загляните в каталог — там есть из чего собрать уют.</p>' +
        '<p style="margin-top:16px"><a class="btn btn-primary" href="catalog.html">В каталог</a></p></div>';
      return;
    }
    var subtotal = HH.cartSubtotal();
    var d = cfg.delivery || { price: 0, freeFrom: 0 };
    var delivery = (d.freeFrom && subtotal >= d.freeFrom) ? 0 : (d.price || 0);
    var total = subtotal + delivery;

    var items = lines.map(function (l) {
      var p = l.product;
      return '<div class="cart-item" data-id="' + p.id + '">' +
        '<a href="product.html?id=' + p.id + '">' + HH.thumb(p) + '</a>' +
        '<div><div class="ci-name"><a href="product.html?id=' + p.id + '">' + p.name + '</a></div>' +
          '<div class="ci-meta">' + HH.price(p.price) + ' / шт.</div>' +
          '<div class="stepper" style="margin-top:8px">' +
            '<button data-act="dec">−</button><span>' + l.qty + '</span><button data-act="inc">+</button></div>' +
        '</div>' +
        '<div class="ci-right"><span class="ci-sum">' + HH.price(l.sum) + '</span>' +
          '<button class="ci-remove" data-act="rm">Удалить</button></div>' +
      '</div>';
    }).join("");

    var freeHint = (d.freeFrom && subtotal < d.freeFrom)
      ? '<div class="note">До бесплатной доставки осталось ' + HH.price(d.freeFrom - subtotal) + '</div>'
      : "";

    root.innerHTML =
      '<div class="cart-wrap">' +
        '<div class="cart-list">' + items + '</div>' +
        '<aside class="summary">' +
          '<h3>Итого</h3>' +
          '<div class="row"><span>Товары (' + lines.length + ')</span><span>' + HH.price(subtotal) + '</span></div>' +
          '<div class="row"><span>Доставка</span><span>' + (delivery ? HH.price(delivery) : "бесплатно") + '</span></div>' +
          '<div class="row total"><span>К оплате</span><span>' + HH.price(total) + '</span></div>' +
          freeHint +
          '<button class="btn btn-primary btn-block" id="checkout" style="margin-top:14px">Оформить заказ</button>' +
          '<div id="checkout-area"></div>' +
        '</aside>' +
      '</div>';

    // qty / remove handlers
    root.querySelectorAll(".cart-item").forEach(function (row) {
      var pid = row.getAttribute("data-id");
      row.querySelector('[data-act="inc"]').onclick = function () {
        HH.setQty(pid, lineQty(pid) + 1);
      };
      row.querySelector('[data-act="dec"]').onclick = function () {
        HH.setQty(pid, lineQty(pid) - 1);
      };
      row.querySelector('[data-act="rm"]').onclick = function () { HH.removeFromCart(pid); };
    });

    document.getElementById("checkout").onclick = showCheckout;
  }

  function lineQty(pid) {
    var l = HH.cartLines().find(function (x) { return x.product.id === pid; });
    return l ? l.qty : 1;
  }

  function showCheckout() {
    var area = document.getElementById("checkout-area");
    area.innerHTML =
      '<div class="checkout-form">' +
        '<input id="co-name" placeholder="Имя и фамилия" autocomplete="name">' +
        '<input id="co-phone" placeholder="Телефон" inputmode="tel" autocomplete="tel">' +
        '<input id="co-addr" placeholder="Адрес или ПВЗ" autocomplete="street-address">' +
        '<select id="co-deliv"><option>Курьер</option><option>Пункт выдачи</option><option>Почта России</option></select>' +
        '<button class="btn btn-primary btn-block" id="pay">Перейти к оплате</button>' +
      '</div>' +
      '<div class="notice"><b>Демо-режим.</b> Приём оплаты подключается на бэкенде ' +
        '(' + (cfg.paymentProvider || "yookassa") + '). Сейчас заказ никуда не отправляется — ' +
        'см. README, раздел «Оплата».</div>';
    document.getElementById("pay").onclick = createOrder;
    document.getElementById("co-name").focus();
  }

  /* ── ТОЧКА ИНТЕГРАЦИИ ──────────────────────────────────────────────
     Здесь в будущем создаётся заказ на бэкенде и инициируется оплата.
     Пример боевого потока (псевдокод):

       const order = {
         items: HH.cartLines().map(l => ({ id:l.product.id, qty:l.qty })),
         customer: { name, phone, address, delivery }
       };
       const r = await fetch(cfg.apiBase + "/orders", {
         method:"POST", headers:{ "Content-Type":"application/json" },
         body: JSON.stringify(order)
       });
       const { paymentUrl } = await r.json();  // бэкенд создал платёж в ЮKassa/CloudPayments/…
       location.href = paymentUrl;             // редирект на оплату; чек по 54-ФЗ формирует провайдер
     ─────────────────────────────────────────────────────────────── */
  function createOrder() {
    var name = (document.getElementById("co-name").value || "").trim();
    var phone = (document.getElementById("co-phone").value || "").trim();
    if (!name || !phone) { HH.toast("Заполните имя и телефон"); return; }
    if (!cfg.apiBase) {
      HH.toast("Демо: оплата подключается на бэкенде");
      return;
    }
    // боевой код подставляется здесь (см. комментарий выше)
  }

  document.addEventListener("hh:cart-changed", render);
  render();
})();
