(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))a(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const r of i.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&a(r)}).observe(document,{childList:!0,subtree:!0});function s(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerPolicy&&(i.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?i.credentials="include":n.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function a(n){if(n.ep)return;n.ep=!0;const i=s(n);fetch(n.href,i)}})();const N="steam_wishlist";function E(){try{return JSON.parse(localStorage.getItem(N)??"[]")}catch{return[]}}function R(e){return E().some(t=>t.id===e)}function ie(e){const t=E();return t.some(s=>s.id===e.id)?(localStorage.setItem(N,JSON.stringify(t.filter(s=>s.id!==e.id))),!1):(localStorage.setItem(N,JSON.stringify([e,...t])),!0)}function ae(e){localStorage.setItem(N,JSON.stringify(E().filter(t=>t.id!==e)))}function ne(e,t){const s=document.createElement("header");s.className="app-header";const a=E().length,n=[{label:"خانه",view:"home"},{label:"جستجو",view:"search"},{label:"پیشنهاد",view:"suggest"},{label:"بازار",view:"market"}];s.innerHTML=`
    <div class="header-inner">
      <nav class="nav-links">
        ${n.map(({label:r,view:o})=>`<button class="nav-btn${o===t?" active":""}" data-view="${o}">${r}</button>`).join("")}
        <button class="nav-btn nav-wish${t==="wishlist"?" active":""}" data-view="wishlist">
          ♥<span class="wish-badge${a>0?" has-items":""}">${a>0?a:""}</span>
        </button>
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
  `,s.querySelectorAll(".nav-btn").forEach(r=>{r.addEventListener("click",()=>{e(r.dataset.view)})});const i=s.querySelector(".logo");return i.addEventListener("click",()=>e("home")),i.addEventListener("keydown",r=>{r.key==="Enter"&&e("home")}),s}const V="https://corsproxy.io/?url=";function _(e,t={}){{const s=new URL(`https://store.steampowered.com${e}`);return Object.entries(t).forEach(([a,n])=>s.searchParams.set(a,n)),`${V}${encodeURIComponent(s.toString())}`}}function Y(e,t={}){{const s=new URL(`https://api.steampowered.com${e}`);return Object.entries(t).forEach(([a,n])=>s.searchParams.set(a,n)),`${V}${encodeURIComponent(s.toString())}`}}function Q(e,t={}){{const s=new URL(`https://steamcommunity.com${e}`);return Object.entries(t).forEach(([a,n])=>s.searchParams.set(a,n)),`${V}${encodeURIComponent(s.toString())}`}}async function $(e){const t=await fetch(e);if(!t.ok)throw new Error(`${t.status}`);return t.json()}const y={getFeatured:()=>$(_("/api/featured",{cc:"us",l:"english"})),search:(e,t="1")=>$(_("/api/storesearch",{term:e,l:"english",cc:"us",realm:"1",page:t})),getFreeGames:()=>$(_("/api/storesearch",{term:"free to play",l:"english",cc:"us",realm:"1",page:"1"})),getAppDetails:async e=>{var s;const t=await $(_("/api/appdetails",{appids:String(e),cc:"us",l:"english"}));return(s=t[String(e)])!=null&&s.success?t[String(e)].data:null},getReviews:e=>$(_(`/appreviews/${e}`,{json:"1",language:"all",review_type:"all",purchase_type:"all",num_per_page:"8",cursor:"*",filter:"recent"})),getDLCIds:e=>$(_("/api/dlcforapp",{appid:String(e)})),getDLCDetails:e=>$(_("/api/appdetails",{appids:e.slice(0,8).join(","),filters:"basic,price_overview"})),searchMarket:(e,t="730",s="0")=>$(Q("/market/search/render",{query:e,appid:t,search_descriptions:"0",sort_column:"popular",sort_dir:"desc",start:s,count:"20",norender:"1"})),getPriceHistory:(e,t)=>$(Q("/market/pricehistory",{appid:e,market_hash_name:t,currency:"1"})),getCurrentPlayers:e=>$(Y("/ISteamUserStats/GetNumberOfCurrentPlayers/v1/",{appid:String(e)})),getAchievements:e=>$(Y("/ISteamUserStats/GetGlobalAchievementPercentagesForApp/v2/",{gameid:String(e)}))};function z(e,t){return e===0?"رایگان":`${t} ${(e/100).toFixed(2)}`}function X(e,t){const s=document.createElement("div");s.className="game-card",s.tabIndex=0;const a=e.discount_percent>0?`<span class="badge-discount">٪${e.discount_percent}-</span>`:"",n=e.discount_percent>0?`<div class="price-row">
        <span class="price-final">${z(e.final_price,e.currency)}</span>
        <span class="price-original">${z(e.original_price,e.currency)}</span>
       </div>`:`<div class="price-row"><span class="${e.final_price===0?"free-label":"price-final"}">${z(e.final_price,e.currency)}</span></div>`;s.innerHTML=`
    <div class="card-image-wrap">
      <img src="${e.header_image||e.small_capsule_image}" alt="${e.name}" loading="lazy" />
      ${a}
    </div>
    <div class="card-body">
      <h3 class="card-title">${e.name}</h3>
      ${n}
    </div>
  `;const i=()=>t(e.id);return s.addEventListener("click",i),s.addEventListener("keydown",r=>{r.key==="Enter"&&i()}),s}function re(e,t){const s=document.createElement("div");s.className="game-card",s.tabIndex=0,s.innerHTML=`
    <div class="card-image-wrap">
      <img src="${e.tiny_image}" alt="${e.name}" loading="lazy" />
      <span class="badge-free">رایگان</span>
    </div>
    <div class="card-body">
      <h3 class="card-title">${e.name}</h3>
      <div class="price-row"><span class="free-label">رایگان</span></div>
    </div>
  `;const a=()=>t(e.id);return s.addEventListener("click",a),s.addEventListener("keydown",n=>{n.key==="Enter"&&a()}),s}function D(e,t="skeleton-card"){return Array(e).fill(`<div class="skeleton ${t}"></div>`).join("")}async function ce(e,t){e.innerHTML=`
    <div class="hero">
      <h1>دنیای بازی را کشف کن</h1>
      <p>جستجو، قیمت‌ها و بازار استیم — همه در یک جا</p>
    </div>

    <div class="section-title">ویژه و پیشنهادی</div>
    <div id="featured-grid" class="game-grid">${D(8)}</div>

    <div class="section-title" style="margin-top:36px">بیشترین تخفیف 🔥</div>
    <div id="deals-grid" class="game-grid">${D(6)}</div>

    <div class="section-title" style="margin-top:36px">بازی‌های رایگان 🎮</div>
    <div id="free-grid" class="game-grid">${D(6,"skeleton-suggest")}</div>
  `,y.getFeatured().then(s=>{const a=[...s.large_capsules??[],...s.featured_win??[]],n=e.querySelector("#featured-grid"),i=e.querySelector("#deals-grid"),r=a.slice(0,10);n.innerHTML="",r.length?r.forEach(c=>n.appendChild(X(c,t))):n.innerHTML='<p class="empty-msg">بازی‌ای یافت نشد.</p>';const o=[...a].filter(c=>c.discount_percent>0).sort((c,p)=>p.discount_percent-c.discount_percent).slice(0,8);i.innerHTML="",o.length?o.forEach(c=>i.appendChild(X(c,t))):i.innerHTML='<p class="empty-msg">تخفیفی موجود نیست.</p>'}).catch(()=>{const s=e.querySelector("#featured-grid");s.innerHTML='<p class="error-msg">خطا در بارگذاری.</p>';const a=e.querySelector("#deals-grid");a.innerHTML='<p class="error-msg">خطا در بارگذاری.</p>'}),y.getFreeGames().then(s=>{const a=e.querySelector("#free-grid");a.innerHTML="";const n=(s.items??[]).filter(i=>!i.price||i.price.final===0).slice(0,8);n.length?n.forEach(i=>a.appendChild(re(i,t))):a.innerHTML='<p class="empty-msg">بازی رایگانی یافت نشد.</p>'}).catch(()=>{const s=e.querySelector("#free-grid");s.innerHTML='<p class="error-msg">خطا در بارگذاری.</p>'})}function le(e,t){const s=document.createElement("div");s.className="game-card",s.tabIndex=0;const a=e.price?e.price.discount_percent>0?`<div class="price-row">
          <span class="badge-discount">٪${e.price.discount_percent}-</span>
          <span class="price-final">${e.price.final_formatted}</span>
          <span class="price-original">${e.price.initial_formatted}</span>
         </div>`:`<div class="price-row"><span class="price-final">${e.price.final_formatted}</span></div>`:'<div class="price-row"><span class="free-label">رایگان</span></div>';s.innerHTML=`
    <div class="card-image-wrap">
      <img src="${e.tiny_image}" alt="${e.name}" loading="lazy" />
    </div>
    <div class="card-body">
      <h3 class="card-title">${e.name}</h3>
      ${a}
    </div>
  `;const n=()=>t(e.id);return s.addEventListener("click",n),s.addEventListener("keydown",i=>{i.key==="Enter"&&n()}),s}function oe(e,t,s=""){let a=s;e.innerHTML=`
    <div class="section-title">جستجوی بازی</div>
    <div class="search-row">
      <input class="input" id="search-input" type="text" placeholder="نام بازی را بنویسید..." value="${s}" autocomplete="off" />
      <button class="btn btn-primary" id="search-btn">جستجو</button>
    </div>
    <div id="results" class="game-grid"></div>
    <div id="pager" class="pagination"></div>
  `;const n=e.querySelector("#search-input"),i=e.querySelector("#search-btn"),r=async(o,c)=>{var f;if(!o.trim())return;a=o;const p=e.querySelector("#results"),d=e.querySelector("#pager");p.innerHTML=Array(6).fill('<div class="skeleton skeleton-card"></div>').join(""),d.innerHTML="";try{const u=await y.search(o,String(c));if(p.innerHTML="",!((f=u.items)!=null&&f.length)){p.innerHTML='<p class="empty-msg">نتیجه‌ای پیدا نشد.</p>';return}u.items.forEach(l=>p.appendChild(le(l,t)));const g=Math.ceil(u.total/25);g>1&&de(d,c,g,l=>r(a,l))}catch{p.innerHTML='<p class="error-msg">جستجو با خطا مواجه شد.</p>'}};i.addEventListener("click",()=>r(n.value,1)),n.addEventListener("keydown",o=>{o.key==="Enter"&&r(n.value,1)}),s?r(s,1):setTimeout(()=>n.focus(),50)}function de(e,t,s,a){e.innerHTML="";const n=document.createElement("button");n.className="btn-page",n.textContent="قبلی",n.disabled=t===1,n.onclick=()=>a(t-1);const i=document.createElement("span");i.className="page-info",i.textContent=`صفحه ${t} از ${s}`;const r=document.createElement("button");r.className="btn-page",r.textContent="بعدی",r.disabled=t===s,r.onclick=()=>a(t+1),e.append(r,i,n)}const pe={"Overwhelmingly Positive":"بی‌نهایت مثبت","Very Positive":"بسیار مثبت","Mostly Positive":"عمدتاً مثبت",Positive:"مثبت",Mixed:"مختلط","Mostly Negative":"عمدتاً منفی",Negative:"منفی","Very Negative":"بسیار منفی","Overwhelmingly Negative":"بی‌نهایت منفی"};function se(e){return e>=75?"#4caf78":e>=50?"#d4a843":"#e05252"}function ve(e){return e<60?`${e} دقیقه`:`${Math.round(e/60)} ساعت`}function ue(e){return e>=1e6?`${(e/1e6).toFixed(1)}M`:e>=1e3?`${(Math.round(e/100)/10).toFixed(1)}K`:e.toLocaleString()}function me(e){return e.replace(/_/g," ").toLowerCase().replace(/\b\w/g,t=>t.toUpperCase())}function ge(e){const t=e.total_reviews>0?Math.round(e.total_positive/e.total_reviews*100):0,s=pe[e.review_score_desc]??e.review_score_desc,a=se(t);return`
    <div class="review-summary">
      <div class="review-bar-wrap"><div class="review-bar" style="width:${t}%;background:${a}"></div></div>
      <div class="review-meta">
        <span style="color:${a};font-weight:700">${s}</span>
        <span class="review-counts">${e.total_positive.toLocaleString()} مثبت از ${e.total_reviews.toLocaleString()}</span>
      </div>
    </div>`}function he(e){const t=new Date(e.timestamp_created*1e3).toLocaleDateString("fa-IR"),s=e.voted_up?"👍":"👎",a=e.review.length>260?e.review.slice(0,260)+"…":e.review;return`
    <div class="review-card">
      <div class="review-header">
        <span class="review-vote">${s}</span>
        <span class="review-time">${ve(e.author.playtime_at_review??e.author.playtime_forever)} بازی کرده</span>
        <span class="review-date">${t}</span>
      </div>
      <p class="review-text">${a.replace(/</g,"&lt;")}</p>
    </div>`}function fe(e){const t=e.is_free?'<span class="free-label">رایگان</span>':e.price_overview?e.price_overview.discount_percent>0?`<span class="badge-discount">٪${e.price_overview.discount_percent}-</span><span class="price-final">${e.price_overview.final_formatted}</span>`:`<span class="price-final">${e.price_overview.final_formatted}</span>`:"";return`
    <div class="dlc-card">
      <img src="${e.header_image}" alt="${e.name}" loading="lazy" />
      <div class="dlc-info">
        <div class="dlc-name">${e.name}</div>
        <div class="price-row">${t}</div>
      </div>
    </div>`}function ye(e){if(!e.length)return'<p class="empty-msg">دستاوردی یافت نشد.</p>';const t=[...e].sort((i,r)=>r.percent-i.percent),s=t.slice(0,5),a=t.slice(-5).reverse(),n=i=>`
    <div class="ach-row">
      <div class="ach-name">${me(i.name)}</div>
      <div class="ach-bar-wrap">
        <div class="ach-bar" style="width:${Math.max(i.percent,.5)}%"></div>
      </div>
      <div class="ach-pct">${i.percent.toFixed(1)}٪</div>
    </div>`;return`
    <div class="ach-group">
      <div class="ach-group-label">آسان‌ترین (بیشترین بازیکن)</div>
      ${s.map(n).join("")}
    </div>
    <div class="ach-group" style="margin-top:16px">
      <div class="ach-group-label">نادرترین (کمترین بازیکن)</div>
      ${a.map(n).join("")}
    </div>
    <p class="ach-total">مجموع: ${e.length} دستاورد</p>`}function $e(e,t){const s=document.createElement("div");s.className="game-card",s.tabIndex=0;const a=e.price?e.price.discount_percent>0?`<span class="badge-discount">٪${e.price.discount_percent}-</span><span class="price-final">${e.price.final_formatted}</span>`:`<span class="price-final">${e.price.final_formatted}</span>`:'<span class="free-label">رایگان</span>';s.innerHTML=`
    <div class="card-image-wrap"><img src="${e.tiny_image}" alt="${e.name}" loading="lazy" /></div>
    <div class="card-body">
      <h3 class="card-title">${e.name}</h3>
      <div class="price-row">${a}</div>
    </div>`;const n=()=>t(e.id);return s.addEventListener("click",n),s.addEventListener("keydown",i=>{i.key==="Enter"&&n()}),s}async function be(e,t,s,a=()=>{}){var n,i,r,o,c,p,d,f,u,g;e.innerHTML='<div class="loading-state"><div class="spinner"></div><p>در حال بارگذاری...</p></div>';try{const l=await y.getAppDetails(t);if(!l){e.innerHTML='<button class="btn-back" id="back">بازگشت</button><p class="error-msg">اطلاعات بازی یافت نشد.</p>',(n=e.querySelector("#back"))==null||n.addEventListener("click",s);return}const H=l.price_overview?l.price_overview.discount_percent>0?`<div class="price-block">
            <span class="badge-discount">٪${l.price_overview.discount_percent}-</span>
            <span class="price-final">${l.price_overview.final_formatted}</span>
            <span class="price-original">${l.price_overview.initial_formatted}</span>
           </div>`:`<div class="price-block"><span class="price-final">${l.price_overview.final_formatted}</span></div>`:l.is_free?'<div class="price-block"><span class="free-label">رایگان</span></div>':"",T=(l.genres??[]).map(v=>`<span class="tag">${v.description}</span>`).join(""),j=(l.categories??[]).slice(0,5).map(v=>`<span class="tag">${v.description}</span>`).join(""),A=l.metacritic?`<div class="metacritic-block">
          <div class="mc-score" style="background:${se(l.metacritic.score)}">${l.metacritic.score}</div>
          <div><div style="font-weight:600;color:var(--text)">Metacritic</div><div style="font-size:.78rem">امتیاز منتقدان</div></div>
         </div>`:"",C=(l.screenshots??[]).slice(0,4).map(v=>`<img src="${v.path_thumbnail}" class="screenshot" loading="lazy" alt="" />`).join("");e.innerHTML=`
      <button class="btn-back" id="back">بازگشت</button>
      <div class="details-wrap">
        <div class="details-hero">
          <img src="${l.header_image}" alt="${l.name}" />
          <div class="details-hero-overlay">
            <h1 class="details-title">${l.name}</h1>
            ${H}
          </div>
        </div>

        <div class="details-body">
          <div class="details-main">
            <p class="short-desc">${l.short_description}</p>
            <div class="tags-row">${T}${j}</div>
            ${C?`<div class="sub-heading">تصاویر</div><div class="screenshots-grid">${C}</div>`:""}
            <div class="sub-heading">درباره بازی</div>
            <div class="long-desc">${l.detailed_description}</div>

            <div class="sub-heading" style="margin-top:28px">نقد و بررسی کاربران</div>
            <div id="reviews-section"><div class="loading-state" style="min-height:60px"><div class="spinner"></div></div></div>

            <div class="sub-heading" style="margin-top:28px">
              دستاوردها
              <button class="ach-toggle-btn" id="ach-toggle">نمایش</button>
            </div>
            <div id="ach-section" style="display:none"></div>

            <div id="dlc-section"></div>

            <!-- Similar games -->
            <div class="sub-heading" style="margin-top:28px">بازی‌های مشابه</div>
            <div id="similar-grid" class="game-grid" style="grid-template-columns:repeat(auto-fill,minmax(160px,1fr))">
              ${Array(4).fill('<div class="skeleton skeleton-card"></div>').join("")}
            </div>
          </div>

          <aside class="details-sidebar">
            ${A}

            <!-- Wishlist button -->
            <button class="wishlist-btn" id="wishlist-btn">
              <span id="wish-icon">${R(t)?"♥":"♡"}</span>
              <span id="wish-label">${R(t)?"در علاقه‌مندی‌ها":"افزودن به علاقه‌مندی‌ها"}</span>
            </button>

            <!-- Live players -->
            <div class="stat-block" id="players-block">
              <div class="loading-state" style="min-height:70px"><div class="spinner"></div></div>
            </div>

            <div class="info-block">
              <div class="info-row"><span class="info-label">سازنده</span><span class="info-value">${((i=l.developers)==null?void 0:i.join("، "))??"—"}</span></div>
              <div class="info-row"><span class="info-label">ناشر</span><span class="info-value">${((r=l.publishers)==null?void 0:r.join("، "))??"—"}</span></div>
              <div class="info-row"><span class="info-label">تاریخ انتشار</span><span class="info-value">${((o=l.release_date)==null?void 0:o.date)??"—"}</span></div>
              <div class="info-row"><span class="info-label">نوع</span><span class="info-value">${l.type}</span></div>
              ${(c=l.dlc)!=null&&c.length?`<div class="info-row"><span class="info-label">DLC</span><span class="info-value">${l.dlc.length} عدد</span></div>`:""}
            </div>

            <a href="https://store.steampowered.com/app/${t}" target="_blank" rel="noopener noreferrer" class="steam-link">
              مشاهده در استیم ↗
            </a>
          </aside>
        </div>
      </div>
    `,(p=e.querySelector("#back"))==null||p.addEventListener("click",s);const L=e.querySelector("#wishlist-btn"),P=e.querySelector("#wish-icon"),I=e.querySelector("#wish-label");L.addEventListener("click",()=>{var h;const v=((h=l.price_overview)==null?void 0:h.final_formatted)??(l.is_free?"رایگان":"—"),m=ie({id:t,name:l.name,image:l.header_image,price:v});P.textContent=m?"♥":"♡",I.textContent=m?"در علاقه‌مندی‌ها":"افزودن به علاقه‌مندی‌ها",L.classList.toggle("active",m)}),R(t)&&L.classList.add("active");const k=e.querySelector("#similar-grid"),W=(f=(d=l.genres)==null?void 0:d[0])==null?void 0:f.description;W?y.search(W).then(v=>{k.innerHTML="";const m=(v.items??[]).filter(h=>h.id!==t).slice(0,8);m.length?m.forEach(h=>k.appendChild($e(h,a))):k.innerHTML='<p class="empty-msg">بازی مشابهی یافت نشد.</p>'}).catch(()=>{k.innerHTML=""}):k.innerHTML="";const B=e.querySelector("#players-block");y.getCurrentPlayers(t).then(v=>{var h;const m=((h=v.response)==null?void 0:h.player_count)??0;B.innerHTML=`
        <div class="players-header">
          <span class="pulse-dot"></span>
          <span class="players-label">بازیکنان آنلاین</span>
        </div>
        <div class="players-count">${ue(m)}</div>
        <div class="players-exact">${m.toLocaleString()} نفر در حال حاضر</div>
      `}).catch(()=>{B.innerHTML=""});const F=e.querySelector("#reviews-section");y.getReviews(t).then(v=>{if(!(v!=null&&v.query_summary)){F.innerHTML="";return}const m=(v.reviews??[]).filter(h=>{var M;return((M=h.review)==null?void 0:M.trim().length)>10}).slice(0,6);F.innerHTML=`
        ${ge(v.query_summary)}
        <div class="reviews-list">
          ${m.length?m.map(he).join(""):'<p class="empty-msg">نقدی یافت نشد.</p>'}
        </div>`}).catch(()=>{F.innerHTML='<p class="error-msg">بارگذاری نقدها ناموفق بود.</p>'});const x=e.querySelector("#ach-section"),G=e.querySelector("#ach-toggle");let J=!1;if(G.addEventListener("click",async()=>{var m;if(x.style.display!=="none"){x.style.display="none",G.textContent="نمایش";return}if(x.style.display="block",G.textContent="بستن",!J){J=!0,x.innerHTML='<div class="loading-state" style="min-height:60px"><div class="spinner"></div></div>';try{const M=((m=(await y.getAchievements(t)).achievementpercentages)==null?void 0:m.achievements)??[];x.innerHTML=ye(M)}catch{x.innerHTML='<p class="error-msg">دستاوردها در دسترس نیستند.</p>'}}}),(u=l.dlc)!=null&&u.length){const v=e.querySelector("#dlc-section");v.innerHTML='<div class="sub-heading" style="margin-top:28px">محتوای دانلودی (DLC)</div><div class="loading-state" style="min-height:50px"><div class="spinner"></div></div>',y.getDLCIds(t).then(async m=>{var K;if(!((K=m.dlc)!=null&&K.length)){v.innerHTML="";return}const h=await y.getDLCDetails(m.dlc),M=Object.values(h).filter(O=>O.success).map(O=>fe(O.data)).join("");v.innerHTML=`
          <div class="sub-heading" style="margin-top:28px">محتوای دانلودی — ${m.dlc.length} عدد</div>
          <div class="dlc-grid">${M||'<p class="empty-msg">جزئیات در دسترس نیست.</p>'}</div>`}).catch(()=>{v.innerHTML=""})}}catch{e.innerHTML='<button class="btn-back" id="back">بازگشت</button><p class="error-msg">بارگذاری با خطا مواجه شد.</p>',(g=e.querySelector("#back"))==null||g.addEventListener("click",s)}}const we=[{fa:"CS2",appid:"730"},{fa:"Dota 2",appid:"570"},{fa:"TF2",appid:"440"},{fa:"Rust",appid:"252490"},{fa:"Apex",appid:"1172470"}],S=20;function Le(e,t){if(e.length<2)return'<p class="empty-msg">داده‌ای برای نمایش وجود ندارد.</p>';const s=e.slice(-90).map(L=>parseFloat(L[1])).filter(Boolean);if(!s.length)return"";const a=Math.min(...s),n=Math.max(...s),i=n-a||1,r=420,o=110,c=52,p=10,d=12,f=24,u=r-c-p,g=o-d-f,l=s.map((L,P)=>{const I=c+P/(s.length-1)*u,k=d+g-(L-a)/i*g;return`${I.toFixed(1)},${k.toFixed(1)}`}),H=s[s.length-1],T=s.length>1?(H-s[0])/s[0]*100:0,j=T>=0?"#4caf78":"#e05252",A=T>=0?"+":"",C=[`${c},${d+g}`,...l,`${c+u},${d+g}`].join(" ");return`
    <div class="chart-wrap">
      <div class="chart-stats">
        <span>کمترین: <b>${t}${a.toFixed(2)}</b></span>
        <span style="color:${j}">${A}${T.toFixed(1)}٪</span>
        <span>بیشترین: <b>${t}${n.toFixed(2)}</b></span>
      </div>
      <svg viewBox="0 0 ${r} ${o}" preserveAspectRatio="none" class="price-chart">
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#5b8def" stop-opacity="0.25"/>
            <stop offset="100%" stop-color="#5b8def" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <polygon points="${C}" fill="url(#chartGrad)"/>
        <polyline points="${l.join(" ")}" fill="none" stroke="#5b8def" stroke-width="1.8" stroke-linejoin="round"/>
        <text x="${c-4}" y="${d+g}" fill="#555" font-size="9" text-anchor="end">${t}${a.toFixed(2)}</text>
        <text x="${c-4}" y="${d+8}" fill="#555" font-size="9" text-anchor="end">${t}${n.toFixed(2)}</text>
        <circle cx="${c+u}" cy="${d+g-(H-a)/i*g}" r="3" fill="#5b8def"/>
        <text x="${c+u}" y="${d+g+16}" fill="#666" font-size="9" text-anchor="end">اکنون: ${t}${H.toFixed(2)}</text>
      </svg>
    </div>
  `}function ke(e,t){var r,o,c;const s=document.createElement("div");s.className="market-card clickable",s.dataset.hash=e.hash_name,s.dataset.appid=t;const a=(r=e.asset_description)!=null&&r.icon_url?`<img src="https://community.cloudflare.steamstatic.com/economy/image/${e.asset_description.icon_url}/96fx96f" alt="" />`:"?",n=(o=e.asset_description)!=null&&o.name_color?`#${e.asset_description.name_color}`:"var(--text)";s.innerHTML=`
    <div class="market-icon">${a}</div>
    <div class="market-info">
      <div class="market-name" style="color:${n}">${e.name}</div>
      <div class="market-type">${((c=e.asset_description)==null?void 0:c.type)??""}</div>
      <div class="market-meta">
        <span class="market-price">${e.sell_price_text}</span>
        <span class="market-count">${e.sell_listings.toLocaleString()} آیتم</span>
        <span class="chart-hint">📈 تاریخچه قیمت</span>
      </div>
    </div>
  `;let i=null;return s.addEventListener("click",async()=>{var p;if(i){i.remove(),i=null,s.classList.remove("expanded");return}s.classList.add("expanded"),i=document.createElement("div"),i.className="chart-loading",i.innerHTML='<div class="spinner" style="width:24px;height:24px;margin:12px auto"></div>',s.after(i);try{const d=await y.getPriceHistory(t,e.hash_name);d.success&&((p=d.prices)!=null&&p.length)?(i.className="chart-container",i.innerHTML=Le(d.prices,d.price_prefix)):(i.className="chart-container",i.innerHTML='<p class="empty-msg" style="padding:12px 0">تاریخچه قیمت در دسترس نیست.</p>')}catch{i.className="chart-container",i.innerHTML='<p class="error-msg" style="padding:12px 0">خطا در بارگذاری تاریخچه.</p>'}}),s}function _e(e){e.innerHTML=`
    <div class="section-title">بازار استیم</div>
    <div class="market-controls">
      <div class="game-tabs">
        ${we.map((r,o)=>`<button class="tab-btn${o===0?" active":""}" data-appid="${r.appid}">${r.fa}</button>`).join("")}
      </div>
      <div class="search-row">
        <input class="input" id="market-input" type="text" placeholder="جستجوی آیتم..." autocomplete="off" />
        <button class="btn btn-primary" id="market-btn">جستجو</button>
      </div>
    </div>
    <p class="market-hint">روی هر آیتم کلیک کنید تا نمودار تاریخچه قیمت آن را ببینید</p>
    <div id="market-list" class="market-list">
      ${Array(8).fill('<div class="skeleton skeleton-market"></div>').join("")}
    </div>
    <div id="market-pager" class="pagination"></div>
  `;let t="730",s="";const a=async(r,o,c)=>{var f;s=r,t=o;const p=e.querySelector("#market-list"),d=e.querySelector("#market-pager");p.innerHTML=Array(8).fill('<div class="skeleton skeleton-market"></div>').join(""),d.innerHTML="";try{const u=await y.searchMarket(r,o,String(c));if(p.innerHTML="",!u.success||!((f=u.results)!=null&&f.length)){p.innerHTML='<p class="empty-msg">آیتمی یافت نشد.</p>';return}u.results.forEach(g=>p.appendChild(ke(g,o))),u.total_count>S&&xe(d,c,u.total_count,g=>a(s,t,g))}catch{p.innerHTML='<p class="error-msg">بارگذاری بازار با خطا مواجه شد.</p>'}};e.querySelectorAll(".tab-btn").forEach(r=>{r.addEventListener("click",()=>{e.querySelectorAll(".tab-btn").forEach(o=>o.classList.remove("active")),r.classList.add("active"),a(s,r.dataset.appid??"730",0)})});const n=e.querySelector("#market-input");e.querySelector("#market-btn").addEventListener("click",()=>a(n.value,t,0)),n.addEventListener("keydown",r=>{r.key==="Enter"&&a(n.value,t,0)}),a("","730",0)}function xe(e,t,s,a){const n=Math.floor(t/S)+1,i=Math.ceil(s/S);e.innerHTML="";const r=document.createElement("button");r.className="btn-page",r.textContent="قبلی",r.disabled=t===0,r.onclick=()=>a(Math.max(0,t-S));const o=document.createElement("span");o.className="page-info",o.textContent=`${n} از ${i} (${s.toLocaleString()} آیتم)`;const c=document.createElement("button");c.className="btn-page",c.textContent="بعدی",c.disabled=t+S>=s,c.onclick=()=>a(t+S),e.append(c,o,r)}const Z=[{fa:"اکشن",en:"action"},{fa:"ماجراجویی",en:"adventure"},{fa:"نقش‌آفرینی",en:"RPG"},{fa:"استراتژی",en:"strategy"},{fa:"شبیه‌ساز",en:"simulation"},{fa:"ترسناک",en:"horror"},{fa:"پازل",en:"puzzle"},{fa:"ورزشی",en:"sports"},{fa:"مسابقه‌ای",en:"racing"},{fa:"رایگان",en:"free to play"}];function Me(e,t){const s=document.createElement("div");s.className="game-card",s.tabIndex=0;const a=e.price?e.price.discount_percent>0?`<div class="price-row">
          <span class="badge-discount">٪${e.price.discount_percent}-</span>
          <span class="price-final">${e.price.final_formatted}</span>
         </div>`:`<div class="price-row"><span class="price-final">${e.price.final_formatted}</span></div>`:'<div class="price-row"><span class="free-label">رایگان</span></div>';s.innerHTML=`
    <div class="card-image-wrap">
      <img src="${e.tiny_image}" alt="${e.name}" loading="lazy" />
    </div>
    <div class="card-body">
      <h3 class="card-title">${e.name}</h3>
      ${a}
    </div>
  `;const n=()=>t(e.id);return s.addEventListener("click",n),s.addEventListener("keydown",i=>{i.key==="Enter"&&n()}),s}function Se(e,t){let s=Z[0],a=[];e.innerHTML=`
    <div class="section-title">پیشنهاد بازی</div>
    <div class="suggest-genres">
      ${Z.map((i,r)=>`<button class="genre-btn${r===0?" active":""}" data-en="${i.en}">${i.fa}</button>`).join("")}
    </div>
    <div class="suggest-header">
      <span id="genre-label" style="font-size:.9rem;color:var(--muted)">بازی‌های ${s.fa}</span>
      <div style="display:flex;gap:8px;align-items:center">
        <span id="result-count" class="suggest-count"></span>
        <button id="random-btn" class="btn-random" title="بازی تصادفی">🎲 تصادفی</button>
      </div>
    </div>
    <div id="suggest-grid" class="game-grid">
      ${Array(8).fill('<div class="skeleton skeleton-suggest"></div>').join("")}
    </div>
  `;const n=async i=>{var p;s=i;const r=e.querySelector("#suggest-grid"),o=e.querySelector("#genre-label"),c=e.querySelector("#result-count");r.innerHTML=Array(8).fill('<div class="skeleton skeleton-suggest"></div>').join(""),o.textContent=`بازی‌های ${i.fa}`,c.textContent="",a=[];try{const d=await y.search(i.en,String(Math.floor(Math.random()*3)+1));if(r.innerHTML="",!((p=d.items)!=null&&p.length)){r.innerHTML='<p class="empty-msg">بازی‌ای در این دسته یافت نشد.</p>';return}const f=[...d.items].sort(()=>Math.random()-.5).slice(0,12);a=f,f.forEach(u=>r.appendChild(Me(u,t))),c.textContent=`${d.total} بازی`}catch{r.innerHTML='<p class="error-msg">خطا در بارگذاری پیشنهادات.</p>'}};e.querySelector("#random-btn").addEventListener("click",()=>{if(!a.length)return;const i=a[Math.floor(Math.random()*a.length)];t(i.id)}),e.querySelectorAll(".genre-btn").forEach(i=>{i.addEventListener("click",()=>{e.querySelectorAll(".genre-btn").forEach(c=>c.classList.remove("active")),i.classList.add("active");const r=i.dataset.en??"",o=i.textContent??"";n({fa:o,en:r})})}),n(s)}function Ee(e,t,s){const a=document.createElement("div");a.className="game-card",a.tabIndex=0,a.innerHTML=`
    <div class="card-image-wrap">
      <img src="${e.image}" alt="${e.name}" loading="lazy" />
      <button class="wish-remove-btn" title="حذف">✕</button>
    </div>
    <div class="card-body">
      <h3 class="card-title">${e.name}</h3>
      <div class="price-row"><span class="price-final">${e.price}</span></div>
    </div>
  `,a.querySelector(".wish-remove-btn").addEventListener("click",i=>{i.stopPropagation(),ae(e.id),a.style.opacity="0",a.style.transform="scale(.95)",a.style.transition="all .2s",setTimeout(()=>a.remove(),200),s(e.id)});const n=()=>t(e.id);return a.addEventListener("click",n),a.addEventListener("keydown",i=>{i.key==="Enter"&&n()}),a}function He(e,t){const s=E();if(e.innerHTML=`
    <div class="section-title">علاقه‌مندی‌ها <span id="wish-count" class="wish-count">${s.length}</span></div>
    ${s.length===0?`<div class="wish-empty">
          <div class="wish-empty-icon">♡</div>
          <p>هنوز بازی‌ای اضافه نکرده‌اید.</p>
          <p style="font-size:.85rem;color:var(--muted);margin-top:6px">در صفحه جزئیات هر بازی دکمه ♥ را بزنید.</p>
         </div>`:'<div id="wish-grid" class="game-grid"></div>'}
  `,!s.length)return;const a=e.querySelector("#wish-grid"),n=e.querySelector("#wish-count");s.forEach(i=>a.appendChild(Ee(i,t,()=>{const r=E().length;n.textContent=String(r),r===0&&(a.innerHTML=`
          <div class="wish-empty" style="grid-column:1/-1">
            <div class="wish-empty-icon">♡</div>
            <p>لیست خالی شد.</p>
          </div>`)})))}const te=document.querySelector("#app"),b=document.createElement("main");b.className="main-content";let U="home",ee="home",q=null;function Te(){q&&q.remove(),q=ne(w,U),te.insertBefore(q,b)}function w(e,t){switch(ee=U,U=e,b.innerHTML="",Te(),e){case"home":ce(b,s=>w("details",s));break;case"search":oe(b,s=>w("details",s),typeof t=="string"?t:"");break;case"suggest":Se(b,s=>w("details",s));break;case"details":typeof t=="number"&&be(b,t,()=>w(ee),s=>w("details",s));break;case"market":_e(b);break;case"wishlist":He(b,s=>w("details",s));break}}te.appendChild(b);w("home");
