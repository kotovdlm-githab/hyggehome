/* ===== hyggehome — shared app logic ===== */
(function(){
  "use strict";
  window.HH = window.HH || {};

  var CATS = {
    posuda:   {name:'Посуда',   color:'#EFE7DB'},
    textile:  {name:'Текстиль', color:'#E7ECE6'},
    cleaning: {name:'Уборка',   color:'#E9F0EA'},
    misc:     {name:'Мелочи',   color:'#F1E4D8'}
  };
  var ICONS = {
    posuda:'<circle cx="20" cy="20" r="15"/><circle cx="20" cy="20" r="8"/>',
    textile:'<rect x="8" y="9" width="24" height="22" rx="3"/><path d="M8 16h24"/><path d="M14 9v22"/>',
    cleaning:'<path d="M17 6h6v6h-6z"/><path d="M16 12h8l2 6v16H14V18z"/><path d="M23 6l5 3"/>',
    misc:'<rect x="9" y="9" width="22" height="11" rx="3"/><path d="M20 20v6"/><path d="M16 26h8v8h-8z"/>'
  };
  HH.CATS = CATS; HH.ICONS = ICONS;
  HH.catName = function(c){ return (CATS[c]||{}).name || c; };

  function esc(s){ return String(s).replace(/[<>&"]/g,function(m){return {'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[m];}); }
  HH.esc = esc;
  HH.money = function(n){ return new Intl.NumberFormat('ru-RU').format(n) + ' \u20BD'; };

  /* SVG placeholder image (no external photos needed) */
  HH.placeholder = function(p){
    var c = (CATS[p.category]||{}).color || '#EFE7DB';
    var icon = ICONS[p.category] || '';
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">'
      + '<rect width="400" height="300" fill="'+c+'"/>'
      + '<g transform="translate(180,70) scale(1.1)" fill="none" stroke="#2E3A34" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" opacity="0.45">'+icon+'</g>'
      + '<text x="200" y="200" text-anchor="middle" font-family="Manrope,Arial,sans-serif" font-size="19" fill="#2E3A34" font-weight="600">'+esc(p.name).slice(0,42)+'</text>'
      + '</svg>';
    return 'data:image/svg+xml,' + encodeURIComponent(svg);
  };

  HH.all = function(){ return (window.PRODUCTS||[]).slice(); };
  HH.get = function(id){ return (window.PRODUCTS||[]).filter(function(p){return p.id===id;})[0]; };

  /* ---- cart (localStorage) ---- */
  var KEY='hh_cart';
  function read(){ try{ return JSON.parse(localStorage.getItem(KEY))||[]; }catch(e){ return []; } }
  function write(c){ try{ localStorage.setItem(KEY, JSON.stringify(c)); }catch(e){} HH.updateCount(); }
  HH.getCart = read;
  HH.addToCart = function(id,qty){ qty=qty||1; var c=read(); var it=c.filter(function(x){return x.id===id;})[0];
    if(it) it.qty+=qty; else c.push({id:id,qty:qty}); write(c); };
  HH.setQty = function(id,qty){ var c=read().map(function(x){return x.id===id?{id:id,qty:qty}:x;}).filter(function(x){return x.qty>0;}); write(c); };
  HH.removeItem = function(id){ write(read().filter(function(x){return x.id!==id;})); };
  HH.cartCount = function(){ return read().reduce(function(s,x){return s+x.qty;},0); };
  HH.updateCount = function(){ var n=HH.cartCount(); document.querySelectorAll('[data-cart-count]').forEach(function(e){ e.textContent=n; }); };

  /* ---- product card markup ---- */
  HH.card = function(p){
    var badge = p.badge ? '<span class="badge'+(/^-/.test(p.badge)?'':(p.badge==='Эко'||p.badge==='Хит'?' green':' dark'))+'">'+esc(p.badge)+'</span>' : '';
    var old = p.oldPrice ? '<span class="old">'+HH.money(p.oldPrice)+'</span>' : '';
    return '<div class="card">'
      + badge
      + '<a href="product.html?id='+encodeURIComponent(p.id)+'"><img class="ph" loading="lazy" alt="'+esc(p.name)+'" src="'+HH.placeholder(p)+'"></a>'
      + '<div class="body">'
      +   '<span class="cat">'+esc(HH.catName(p.category))+'</span>'
      +   '<h3><a href="product.html?id='+encodeURIComponent(p.id)+'">'+esc(p.name)+'</a></h3>'
      +   '<div class="price-row"><span class="price">'+HH.money(p.price)+'</span>'+old+'</div>'
      +   '<div class="add"><button class="btn btn-primary" data-add="'+esc(p.id)+'">В корзину</button></div>'
      + '</div></div>';
  };

  /* ---- toast ---- */
  var toastEl;
  HH.toast = function(msg){
    if(!toastEl){ toastEl=document.createElement('div'); toastEl.className='toast'; document.body.appendChild(toastEl); }
    toastEl.textContent=msg; toastEl.classList.add('show');
    clearTimeout(HH._t); HH._t=setTimeout(function(){ toastEl.classList.remove('show'); },1800);
  };

  /* ---- global init ---- */
  function init(){
    HH.updateCount();
    // add-to-cart delegation
    document.addEventListener('click', function(e){
      var b = e.target.closest('[data-add]');
      if(b){ e.preventDefault(); HH.addToCart(b.getAttribute('data-add'),1); HH.toast('Добавлено в корзину'); }
    });
    // mobile menu
    var burger=document.getElementById('burger'), links=document.getElementById('navlinks');
    if(burger&&links){ burger.addEventListener('click',function(){ links.classList.toggle('open'); }); }
    // nav elevation
    var nav=document.querySelector('.site-nav');
    if(nav){ var onS=function(){ nav.classList.toggle('scrolled', window.scrollY>12); }; window.addEventListener('scroll',onS,{passive:true}); onS(); }
    // year
    document.querySelectorAll('[data-year]').forEach(function(e){ e.textContent=new Date().getFullYear(); });
    // reveal
    if(!window.matchMedia('(prefers-reduced-motion:reduce)').matches){
      var items=document.querySelectorAll('[data-reveal]');
      items.forEach(function(el){ el.classList.add('reveal'); });
      if('IntersectionObserver' in window && items.length){
        var io=new IntersectionObserver(function(ents){ ents.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target);} }); },{threshold:.12,rootMargin:'0px 0px -6% 0px'});
        items.forEach(function(el,i){ el.style.transitionDelay=((i%4)*60)+'ms'; io.observe(el); });
      } else { items.forEach(function(el){ el.classList.add('in'); }); }
    }
  }
  if(document.readyState!=='loading') init(); else document.addEventListener('DOMContentLoaded', init);
})();
