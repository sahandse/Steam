(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))c(t);new MutationObserver(t=>{for(const n of t)if(n.type==="childList")for(const i of n.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&c(i)}).observe(document,{childList:!0,subtree:!0});function s(t){const n={};return t.integrity&&(n.integrity=t.integrity),t.referrerPolicy&&(n.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?n.credentials="include":t.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function c(t){if(t.ep)return;t.ep=!0;const n=s(t);fetch(t.href,n)}})();function T(e,a){const s=document.createElement("header");s.className="app-header";const c=[{label:"خانه",view:"home"},{label:"جستجو",view:"search"},{label:"پیشنهاد",view:"suggest"},{label:"بازار",view:"market"}];s.innerHTML=`
    <div class="header-inner">
      <nav class="nav-links">
        ${c.map(({label:n,view:i})=>`<button class="nav-btn${i===a?" active":""}" data-view="${i}">${n}</button>`).join("")}
      </nav>
      <div class="logo" role="button" tabindex="0">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <circle cx="11" cy="11" r="10" stroke="#5b8def" stroke-width="1.5"/>
          <circle cx="11" cy="11" r="5.5" fill="#5b8def"/>
          <circle cx="11" cy="11" r="2.2" fill="#0c0c0c"/>
        </svg>
        استیم
      </div>
    </div>
  `,s.querySelectorAll(".nav-btn").forEach(n=>{n.addEventListener("click",()=>{e(n.dataset.view)})});const t=s.querySelector(".logo");return t.addEventListener("click",()=>e("home")),t.addEventListener("keydown",n=>{n.key==="Enter"&&e("home")}),s}const S="https://corsproxy.io/?url=";function L(e,a={}){{const s=new URL(`https://store.steampowered.com${e}`);return Object.entries(a).forEach(([c,t])=>s.searchParams.set(c,t)),`${S}${encodeURIComponent(s.toString())}`}}function x(e,a={}){{const s=new URL(`https://steamcommunity.com${e}`);return Object.entries(a).forEach(([c,t])=>s.searchParams.set(c,t)),`${S}${encodeURIComponent(s.toString())}`}}async function $(e){const a=await fetch(e);if(!a.ok)throw new Error(`Request failed: ${a.status}`);return a.json()}const y={getFeatured:()=>$(L("/api/featured",{cc:"us",l:"english"})),search:(e,a="1")=>$(L("/api/storesearch",{term:e,l:"english",cc:"us",realm:"1",page:a})),getAppDetails:async e=>{const s=(await $(L("/api/appdetails",{appids:String(e),cc:"us",l:"english"})))[String(e)];return s!=null&&s.success?s.data:null},searchMarket:(e,a="730",s="0")=>$(x("/market/search/render",{query:e,appid:a,search_descriptions:"0",sort_column:"popular",sort_dir:"desc",start:s,count:"20",norender:"1"}))};function w(e,a){return e===0?"رایگان":`${a} ${(e/100).toFixed(2)}`}function q(e,a){const s=document.createElement("div");s.className="game-card",s.tabIndex=0;const c=e.discount_percent>0?`<span class="badge-discount">٪${e.discount_percent}-</span>`:"",t=e.discount_percent>0?`<div class="price-row">
        <span class="price-final">${w(e.final_price,e.currency)}</span>
        <span class="price-original">${w(e.original_price,e.currency)}</span>
       </div>`:`<div class="price-row"><span class="${e.final_price===0?"free-label":"price-final"}">${w(e.final_price,e.currency)}</span></div>`;s.innerHTML=`
    <div class="card-image-wrap">
      <img src="${e.header_image||e.small_capsule_image}" alt="${e.name}" loading="lazy" />
      ${c}
    </div>
    <div class="card-body">
      <h3 class="card-title">${e.name}</h3>
      ${t}
    </div>
  `;const n=()=>a(e.id);return s.addEventListener("click",n),s.addEventListener("keydown",i=>{i.key==="Enter"&&n()}),s}async function C(e,a){e.innerHTML=`
    <div class="hero">
      <h1>دنیای بازی را کشف کن</h1>
      <p>جستجو، قیمت‌ها و بازار استیم — همه در یک جا</p>
    </div>
    <div class="section-title">ویژه و پیشنهادی</div>
    <div class="game-grid">
      ${Array(8).fill('<div class="skeleton skeleton-card"></div>').join("")}
    </div>
  `;try{const s=await y.getFeatured(),c=[...s.large_capsules??[],...s.featured_win??[]].slice(0,12),t=e.querySelector(".game-grid");if(t.innerHTML="",!c.length){t.innerHTML='<p class="empty-msg">بازی‌ای یافت نشد.</p>';return}c.forEach(n=>t.appendChild(q(n,a)))}catch{const s=e.querySelector(".game-grid");s.innerHTML='<p class="error-msg">خطا در بارگذاری. لطفاً دوباره تلاش کنید.</p>'}}function A(e,a){const s=document.createElement("div");s.className="game-card",s.tabIndex=0;const c=e.price?e.price.discount_percent>0?`<div class="price-row">
          <span class="badge-discount">٪${e.price.discount_percent}-</span>
          <span class="price-final">${e.price.final_formatted}</span>
          <span class="price-original">${e.price.initial_formatted}</span>
         </div>`:`<div class="price-row"><span class="price-final">${e.price.final_formatted}</span></div>`:'<div class="price-row"><span class="free-label">رایگان</span></div>';s.innerHTML=`
    <div class="card-image-wrap">
      <img src="${e.tiny_image}" alt="${e.name}" loading="lazy" />
    </div>
    <div class="card-body">
      <h3 class="card-title">${e.name}</h3>
      ${c}
    </div>
  `;const t=()=>a(e.id);return s.addEventListener("click",t),s.addEventListener("keydown",n=>{n.key==="Enter"&&t()}),s}function j(e,a,s=""){let c=s;e.innerHTML=`
    <div class="section-title">جستجوی بازی</div>
    <div class="search-row">
      <input class="input" id="search-input" type="text" placeholder="نام بازی را بنویسید..." value="${s}" autocomplete="off" />
      <button class="btn btn-primary" id="search-btn">جستجو</button>
    </div>
    <div id="results" class="game-grid"></div>
    <div id="pager" class="pagination"></div>
  `;const t=e.querySelector("#search-input"),n=e.querySelector("#search-btn"),i=async(l,o)=>{var p;if(!l.trim())return;c=l;const r=e.querySelector("#results"),v=e.querySelector("#pager");r.innerHTML=Array(6).fill('<div class="skeleton skeleton-card"></div>').join(""),v.innerHTML="";try{const d=await y.search(l,String(o));if(r.innerHTML="",!((p=d.items)!=null&&p.length)){r.innerHTML='<p class="empty-msg">نتیجه‌ای پیدا نشد.</p>';return}d.items.forEach(f=>r.appendChild(A(f,a)));const m=Math.ceil(d.total/25);m>1&&N(v,o,m,f=>i(c,f))}catch{r.innerHTML='<p class="error-msg">جستجو با خطا مواجه شد.</p>'}};n.addEventListener("click",()=>i(t.value,1)),t.addEventListener("keydown",l=>{l.key==="Enter"&&i(t.value,1)}),s?i(s,1):setTimeout(()=>t.focus(),50)}function N(e,a,s,c){e.innerHTML="";const t=document.createElement("button");t.className="btn-page",t.textContent="قبلی",t.disabled=a===1,t.onclick=()=>c(a-1);const n=document.createElement("span");n.className="page-info",n.textContent=`صفحه ${a} از ${s}`;const i=document.createElement("button");i.className="btn-page",i.textContent="بعدی",i.disabled=a===s,i.onclick=()=>c(a+1),e.append(i,n,t)}async function P(e,a,s){var c,t,n,i,l,o;e.innerHTML=`
    <div class="loading-state">
      <div class="spinner"></div>
      <p>در حال بارگذاری...</p>
    </div>
  `;try{const r=await y.getAppDetails(a);if(!r){e.innerHTML=`
        <button class="btn-back" id="back">بازگشت</button>
        <p class="error-msg">اطلاعات بازی یافت نشد.</p>
      `,(c=e.querySelector("#back"))==null||c.addEventListener("click",s);return}const v=r.price_overview?r.price_overview.discount_percent>0?`<div class="price-block">
            <span class="badge-discount">٪${r.price_overview.discount_percent}-</span>
            <span class="price-final">${r.price_overview.final_formatted}</span>
            <span class="price-original">${r.price_overview.initial_formatted}</span>
           </div>`:`<div class="price-block"><span class="price-final">${r.price_overview.final_formatted}</span></div>`:r.is_free?'<div class="price-block"><span class="free-label">رایگان</span></div>':"",p=(r.genres??[]).map(b=>`<span class="tag">${b.description}</span>`).join(""),d=(r.categories??[]).slice(0,5).map(b=>`<span class="tag">${b.description}</span>`).join(""),m=r.metacritic?`<div class="metacritic-block">
          <div class="mc-score" style="background:${r.metacritic.score>=75?"#4caf78":r.metacritic.score>=50?"#d4a843":"#e05252"}">
            ${r.metacritic.score}
          </div>
          <div>
            <div style="font-weight:600;color:var(--text)">Metacritic</div>
            <div style="font-size:.78rem">امتیاز منتقدان</div>
          </div>
        </div>`:"",f=(r.screenshots??[]).slice(0,4).map(b=>`<img src="${b.path_thumbnail}" class="screenshot" loading="lazy" alt="" />`).join("");e.innerHTML=`
      <button class="btn-back" id="back">بازگشت</button>
      <div class="details-wrap">
        <div class="details-hero">
          <img src="${r.header_image}" alt="${r.name}" />
          <div class="details-hero-overlay">
            <h1 class="details-title">${r.name}</h1>
            ${v}
          </div>
        </div>

        <div class="details-body">
          <div class="details-main">
            <p class="short-desc">${r.short_description}</p>
            <div class="tags-row">${p}${d}</div>

            ${f?`<div class="sub-heading">تصاویر</div><div class="screenshots-grid">${f}</div>`:""}

            <div class="sub-heading">درباره بازی</div>
            <div class="long-desc">${r.detailed_description}</div>
          </div>

          <aside class="details-sidebar">
            ${m}
            <div class="info-block">
              <div class="info-row">
                <span class="info-label">سازنده</span>
                <span class="info-value">${((t=r.developers)==null?void 0:t.join("، "))??"—"}</span>
              </div>
              <div class="info-row">
                <span class="info-label">ناشر</span>
                <span class="info-value">${((n=r.publishers)==null?void 0:n.join("، "))??"—"}</span>
              </div>
              <div class="info-row">
                <span class="info-label">تاریخ انتشار</span>
                <span class="info-value">${((i=r.release_date)==null?void 0:i.date)??"—"}</span>
              </div>
              <div class="info-row">
                <span class="info-label">نوع</span>
                <span class="info-value">${r.type}</span>
              </div>
            </div>
            <a
              href="https://store.steampowered.com/app/${a}"
              target="_blank"
              rel="noopener noreferrer"
              class="steam-link"
            >مشاهده در استیم ↗</a>
          </aside>
        </div>
      </div>
    `,(l=e.querySelector("#back"))==null||l.addEventListener("click",s)}catch{e.innerHTML=`
      <button class="btn-back" id="back">بازگشت</button>
      <p class="error-msg">بارگذاری اطلاعات با خطا مواجه شد.</p>
    `,(o=e.querySelector("#back"))==null||o.addEventListener("click",s)}}const O=[{fa:"CS2",appid:"730"},{fa:"Dota 2",appid:"570"},{fa:"TF2",appid:"440"},{fa:"Rust",appid:"252490"},{fa:"Apex",appid:"1172470"}],g=20;function R(e){var t,n,i;const a=document.createElement("div");a.className="market-card";const s=(t=e.asset_description)!=null&&t.icon_url?`<img src="https://community.cloudflare.steamstatic.com/economy/image/${e.asset_description.icon_url}/96fx96f" alt="" />`:"?",c=(n=e.asset_description)!=null&&n.name_color?`#${e.asset_description.name_color}`:"var(--text)";return a.innerHTML=`
    <div class="market-icon">${s}</div>
    <div class="market-info">
      <div class="market-name" style="color:${c}">${e.name}</div>
      <div class="market-type">${((i=e.asset_description)==null?void 0:i.type)??""}</div>
      <div class="market-meta">
        <span class="market-price">${e.sell_price_text}</span>
        <span class="market-count">${e.sell_listings.toLocaleString()} آیتم</span>
      </div>
    </div>
  `,a}function z(e){e.innerHTML=`
    <div class="section-title">بازار استیم</div>
    <div class="market-controls">
      <div class="game-tabs">
        ${O.map((i,l)=>`<button class="tab-btn${l===0?" active":""}" data-appid="${i.appid}">${i.fa}</button>`).join("")}
      </div>
      <div class="search-row">
        <input class="input" id="market-input" type="text" placeholder="جستجوی آیتم..." autocomplete="off" />
        <button class="btn btn-primary" id="market-btn">جستجو</button>
      </div>
    </div>
    <div id="market-list" class="market-list">
      ${Array(8).fill('<div class="skeleton skeleton-market"></div>').join("")}
    </div>
    <div id="market-pager" class="pagination"></div>
  `;let a="730",s="";const c=async(i,l,o)=>{var p;s=i,a=l;const r=e.querySelector("#market-list"),v=e.querySelector("#market-pager");r.innerHTML=Array(8).fill('<div class="skeleton skeleton-market"></div>').join(""),v.innerHTML="";try{const d=await y.searchMarket(i,l,String(o));if(r.innerHTML="",!d.success||!((p=d.results)!=null&&p.length)){r.innerHTML='<p class="empty-msg">آیتمی یافت نشد.</p>';return}d.results.forEach(m=>r.appendChild(R(m))),d.total_count>g&&I(v,o,d.total_count,m=>c(s,a,m))}catch{r.innerHTML='<p class="error-msg">بارگذاری بازار با خطا مواجه شد.</p>'}};e.querySelectorAll(".tab-btn").forEach(i=>{i.addEventListener("click",()=>{e.querySelectorAll(".tab-btn").forEach(l=>l.classList.remove("active")),i.classList.add("active"),c(s,i.dataset.appid??"730",0)})});const t=e.querySelector("#market-input");e.querySelector("#market-btn").addEventListener("click",()=>c(t.value,a,0)),t.addEventListener("keydown",i=>{i.key==="Enter"&&c(t.value,a,0)}),c("","730",0)}function I(e,a,s,c){e.innerHTML="";const t=Math.floor(a/g)+1,n=Math.ceil(s/g),i=document.createElement("button");i.className="btn-page",i.textContent="قبلی",i.disabled=a===0,i.onclick=()=>c(Math.max(0,a-g));const l=document.createElement("span");l.className="page-info",l.textContent=`${t} از ${n} (${s.toLocaleString()} آیتم)`;const o=document.createElement("button");o.className="btn-page",o.textContent="بعدی",o.disabled=a+g>=s,o.onclick=()=>c(a+g),e.append(o,l,i)}const E=[{fa:"اکشن",en:"action"},{fa:"ماجراجویی",en:"adventure"},{fa:"نقش‌آفرینی",en:"RPG"},{fa:"استراتژی",en:"strategy"},{fa:"شبیه‌ساز",en:"simulation"},{fa:"ترسناک",en:"horror"},{fa:"پازل",en:"puzzle"},{fa:"ورزشی",en:"sports"},{fa:"مسابقه‌ای",en:"racing"},{fa:"رایگان",en:"free to play"}];function V(e,a){const s=document.createElement("div");s.className="game-card",s.tabIndex=0;const c=e.price?e.price.discount_percent>0?`<div class="price-row">
          <span class="badge-discount">٪${e.price.discount_percent}-</span>
          <span class="price-final">${e.price.final_formatted}</span>
         </div>`:`<div class="price-row"><span class="price-final">${e.price.final_formatted}</span></div>`:'<div class="price-row"><span class="free-label">رایگان</span></div>';s.innerHTML=`
    <div class="card-image-wrap">
      <img src="${e.tiny_image}" alt="${e.name}" loading="lazy" />
    </div>
    <div class="card-body">
      <h3 class="card-title">${e.name}</h3>
      ${c}
    </div>
  `;const t=()=>a(e.id);return s.addEventListener("click",t),s.addEventListener("keydown",n=>{n.key==="Enter"&&t()}),s}function U(e,a){let s=E[0];e.innerHTML=`
    <div class="section-title">پیشنهاد بازی</div>
    <div class="suggest-genres">
      ${E.map((t,n)=>`<button class="genre-btn${n===0?" active":""}" data-en="${t.en}">${t.fa}</button>`).join("")}
    </div>
    <div class="suggest-header">
      <span id="genre-label" style="font-size:.9rem;color:var(--muted)">بازی‌های ${s.fa}</span>
      <span id="result-count" class="suggest-count"></span>
    </div>
    <div id="suggest-grid" class="game-grid">
      ${Array(8).fill('<div class="skeleton skeleton-suggest"></div>').join("")}
    </div>
  `;const c=async t=>{var o;s=t;const n=e.querySelector("#suggest-grid"),i=e.querySelector("#genre-label"),l=e.querySelector("#result-count");n.innerHTML=Array(8).fill('<div class="skeleton skeleton-suggest"></div>').join(""),i.textContent=`بازی‌های ${t.fa}`,l.textContent="";try{const r=await y.search(t.en,String(Math.floor(Math.random()*3)+1));if(n.innerHTML="",!((o=r.items)!=null&&o.length)){n.innerHTML='<p class="empty-msg">بازی‌ای در این دسته یافت نشد.</p>';return}[...r.items].sort(()=>Math.random()-.5).slice(0,12).forEach(p=>n.appendChild(V(p,a))),l.textContent=`${r.total} بازی`}catch{n.innerHTML='<p class="error-msg">خطا در بارگذاری پیشنهادات.</p>'}};e.querySelectorAll(".genre-btn").forEach(t=>{t.addEventListener("click",()=>{e.querySelectorAll(".genre-btn").forEach(l=>l.classList.remove("active")),t.classList.add("active");const n=t.dataset.en??"",i=t.textContent??"";c({fa:i,en:n})})}),c(s)}const H=document.querySelector("#app"),u=document.createElement("main");u.className="main-content";let _="home",M="home",k=null;function F(){k&&k.remove(),k=T(h,_),H.insertBefore(k,u)}function h(e,a){switch(M=_,_=e,u.innerHTML="",F(),e){case"home":C(u,s=>h("details",s));break;case"search":j(u,s=>h("details",s),typeof a=="string"?a:"");break;case"suggest":U(u,s=>h("details",s));break;case"details":typeof a=="number"&&P(u,a,()=>h(M));break;case"market":z(u);break}}H.appendChild(u);h("home");
