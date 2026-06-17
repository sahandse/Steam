(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))n(a);new MutationObserver(a=>{for(const i of a)if(i.type==="childList")for(const r of i.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&n(r)}).observe(document,{childList:!0,subtree:!0});function s(a){const i={};return a.integrity&&(i.integrity=a.integrity),a.referrerPolicy&&(i.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?i.credentials="include":a.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(a){if(a.ep)return;a.ep=!0;const i=s(a);fetch(a.href,i)}})();function B(e,t){const s=document.createElement("header");s.className="app-header";const n=[{label:"خانه",view:"home"},{label:"جستجو",view:"search"},{label:"پیشنهاد",view:"suggest"},{label:"بازار",view:"market"}];s.innerHTML=`
    <div class="header-inner">
      <nav class="nav-links">
        ${n.map(({label:i,view:r})=>`<button class="nav-btn${r===t?" active":""}" data-view="${r}">${i}</button>`).join("")}
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
  `,s.querySelectorAll(".nav-btn").forEach(i=>{i.addEventListener("click",()=>{e(i.dataset.view)})});const a=s.querySelector(".logo");return a.addEventListener("click",()=>e("home")),a.addEventListener("keydown",i=>{i.key==="Enter"&&e("home")}),s}const F="https://corsproxy.io/?url=";function k(e,t={}){{const s=new URL(`https://store.steampowered.com${e}`);return Object.entries(t).forEach(([n,a])=>s.searchParams.set(n,a)),`${F}${encodeURIComponent(s.toString())}`}}function R(e,t={}){{const s=new URL(`https://api.steampowered.com${e}`);return Object.entries(t).forEach(([n,a])=>s.searchParams.set(n,a)),`${F}${encodeURIComponent(s.toString())}`}}function D(e,t={}){{const s=new URL(`https://steamcommunity.com${e}`);return Object.entries(t).forEach(([n,a])=>s.searchParams.set(n,a)),`${F}${encodeURIComponent(s.toString())}`}}async function h(e){const t=await fetch(e);if(!t.ok)throw new Error(`${t.status}`);return t.json()}const f={getFeatured:()=>h(k("/api/featured",{cc:"us",l:"english"})),search:(e,t="1")=>h(k("/api/storesearch",{term:e,l:"english",cc:"us",realm:"1",page:t})),getFreeGames:()=>h(k("/api/storesearch",{term:"free to play",l:"english",cc:"us",realm:"1",page:"1"})),getAppDetails:async e=>{var s;const t=await h(k("/api/appdetails",{appids:String(e),cc:"us",l:"english"}));return(s=t[String(e)])!=null&&s.success?t[String(e)].data:null},getReviews:e=>h(k(`/appreviews/${e}`,{json:"1",language:"all",review_type:"all",purchase_type:"all",num_per_page:"8",cursor:"*",filter:"recent"})),getDLCIds:e=>h(k("/api/dlcforapp",{appid:String(e)})),getDLCDetails:e=>h(k("/api/appdetails",{appids:e.slice(0,8).join(","),filters:"basic,price_overview"})),searchMarket:(e,t="730",s="0")=>h(D("/market/search/render",{query:e,appid:t,search_descriptions:"0",sort_column:"popular",sort_dir:"desc",start:s,count:"20",norender:"1"})),getPriceHistory:(e,t)=>h(D("/market/pricehistory",{appid:e,market_hash_name:t,currency:"1"})),getCurrentPlayers:e=>h(R("/ISteamUserStats/GetNumberOfCurrentPlayers/v1/",{appid:String(e)})),getAchievements:e=>h(R("/ISteamUserStats/GetGlobalAchievementPercentagesForApp/v2/",{gameid:String(e)}))};function A(e,t){return e===0?"رایگان":`${t} ${(e/100).toFixed(2)}`}function O(e,t){const s=document.createElement("div");s.className="game-card",s.tabIndex=0;const n=e.discount_percent>0?`<span class="badge-discount">٪${e.discount_percent}-</span>`:"",a=e.discount_percent>0?`<div class="price-row">
        <span class="price-final">${A(e.final_price,e.currency)}</span>
        <span class="price-original">${A(e.original_price,e.currency)}</span>
       </div>`:`<div class="price-row"><span class="${e.final_price===0?"free-label":"price-final"}">${A(e.final_price,e.currency)}</span></div>`;s.innerHTML=`
    <div class="card-image-wrap">
      <img src="${e.header_image||e.small_capsule_image}" alt="${e.name}" loading="lazy" />
      ${n}
    </div>
    <div class="card-body">
      <h3 class="card-title">${e.name}</h3>
      ${a}
    </div>
  `;const i=()=>t(e.id);return s.addEventListener("click",i),s.addEventListener("keydown",r=>{r.key==="Enter"&&i()}),s}function K(e,t){const s=document.createElement("div");s.className="game-card",s.tabIndex=0,s.innerHTML=`
    <div class="card-image-wrap">
      <img src="${e.tiny_image}" alt="${e.name}" loading="lazy" />
      <span class="badge-free">رایگان</span>
    </div>
    <div class="card-body">
      <h3 class="card-title">${e.name}</h3>
      <div class="price-row"><span class="free-label">رایگان</span></div>
    </div>
  `;const n=()=>t(e.id);return s.addEventListener("click",n),s.addEventListener("keydown",a=>{a.key==="Enter"&&n()}),s}function N(e,t="skeleton-card"){return Array(e).fill(`<div class="skeleton ${t}"></div>`).join("")}async function W(e,t){e.innerHTML=`
    <div class="hero">
      <h1>دنیای بازی را کشف کن</h1>
      <p>جستجو، قیمت‌ها و بازار استیم — همه در یک جا</p>
    </div>

    <div class="section-title">ویژه و پیشنهادی</div>
    <div id="featured-grid" class="game-grid">${N(8)}</div>

    <div class="section-title" style="margin-top:36px">بیشترین تخفیف 🔥</div>
    <div id="deals-grid" class="game-grid">${N(6)}</div>

    <div class="section-title" style="margin-top:36px">بازی‌های رایگان 🎮</div>
    <div id="free-grid" class="game-grid">${N(6,"skeleton-suggest")}</div>
  `,f.getFeatured().then(s=>{const n=[...s.large_capsules??[],...s.featured_win??[]],a=e.querySelector("#featured-grid"),i=e.querySelector("#deals-grid"),r=n.slice(0,10);a.innerHTML="",r.length?r.forEach(c=>a.appendChild(O(c,t))):a.innerHTML='<p class="empty-msg">بازی‌ای یافت نشد.</p>';const o=[...n].filter(c=>c.discount_percent>0).sort((c,d)=>d.discount_percent-c.discount_percent).slice(0,8);i.innerHTML="",o.length?o.forEach(c=>i.appendChild(O(c,t))):i.innerHTML='<p class="empty-msg">تخفیفی موجود نیست.</p>'}).catch(()=>{const s=e.querySelector("#featured-grid");s.innerHTML='<p class="error-msg">خطا در بارگذاری.</p>';const n=e.querySelector("#deals-grid");n.innerHTML='<p class="error-msg">خطا در بارگذاری.</p>'}),f.getFreeGames().then(s=>{const n=e.querySelector("#free-grid");n.innerHTML="";const a=(s.items??[]).filter(i=>!i.price||i.price.final===0).slice(0,8);a.length?a.forEach(i=>n.appendChild(K(i,t))):n.innerHTML='<p class="empty-msg">بازی رایگانی یافت نشد.</p>'}).catch(()=>{const s=e.querySelector("#free-grid");s.innerHTML='<p class="error-msg">خطا در بارگذاری.</p>'})}function J(e,t){const s=document.createElement("div");s.className="game-card",s.tabIndex=0;const n=e.price?e.price.discount_percent>0?`<div class="price-row">
          <span class="badge-discount">٪${e.price.discount_percent}-</span>
          <span class="price-final">${e.price.final_formatted}</span>
          <span class="price-original">${e.price.initial_formatted}</span>
         </div>`:`<div class="price-row"><span class="price-final">${e.price.final_formatted}</span></div>`:'<div class="price-row"><span class="free-label">رایگان</span></div>';s.innerHTML=`
    <div class="card-image-wrap">
      <img src="${e.tiny_image}" alt="${e.name}" loading="lazy" />
    </div>
    <div class="card-body">
      <h3 class="card-title">${e.name}</h3>
      ${n}
    </div>
  `;const a=()=>t(e.id);return s.addEventListener("click",a),s.addEventListener("keydown",i=>{i.key==="Enter"&&a()}),s}function Q(e,t,s=""){let n=s;e.innerHTML=`
    <div class="section-title">جستجوی بازی</div>
    <div class="search-row">
      <input class="input" id="search-input" type="text" placeholder="نام بازی را بنویسید..." value="${s}" autocomplete="off" />
      <button class="btn btn-primary" id="search-btn">جستجو</button>
    </div>
    <div id="results" class="game-grid"></div>
    <div id="pager" class="pagination"></div>
  `;const a=e.querySelector("#search-input"),i=e.querySelector("#search-btn"),r=async(o,c)=>{var l;if(!o.trim())return;n=o;const d=e.querySelector("#results"),p=e.querySelector("#pager");d.innerHTML=Array(6).fill('<div class="skeleton skeleton-card"></div>').join(""),p.innerHTML="";try{const m=await f.search(o,String(c));if(d.innerHTML="",!((l=m.items)!=null&&l.length)){d.innerHTML='<p class="empty-msg">نتیجه‌ای پیدا نشد.</p>';return}m.items.forEach($=>d.appendChild(J($,t)));const u=Math.ceil(m.total/25);u>1&&X(p,c,u,$=>r(n,$))}catch{d.innerHTML='<p class="error-msg">جستجو با خطا مواجه شد.</p>'}};i.addEventListener("click",()=>r(a.value,1)),a.addEventListener("keydown",o=>{o.key==="Enter"&&r(a.value,1)}),s?r(s,1):setTimeout(()=>a.focus(),50)}function X(e,t,s,n){e.innerHTML="";const a=document.createElement("button");a.className="btn-page",a.textContent="قبلی",a.disabled=t===1,a.onclick=()=>n(t-1);const i=document.createElement("span");i.className="page-info",i.textContent=`صفحه ${t} از ${s}`;const r=document.createElement("button");r.className="btn-page",r.textContent="بعدی",r.disabled=t===s,r.onclick=()=>n(t+1),e.append(r,i,a)}const Y={"Overwhelmingly Positive":"بی‌نهایت مثبت","Very Positive":"بسیار مثبت","Mostly Positive":"عمدتاً مثبت",Positive:"مثبت",Mixed:"مختلط","Mostly Negative":"عمدتاً منفی",Negative:"منفی","Very Negative":"بسیار منفی","Overwhelmingly Negative":"بی‌نهایت منفی"};function U(e){return e>=75?"#4caf78":e>=50?"#d4a843":"#e05252"}function Z(e){return e<60?`${e} دقیقه`:`${Math.round(e/60)} ساعت`}function ee(e){return e>=1e6?`${(e/1e6).toFixed(1)}M`:e>=1e3?`${(Math.round(e/100)/10).toFixed(1)}K`:e.toLocaleString()}function se(e){return e.replace(/_/g," ").toLowerCase().replace(/\b\w/g,t=>t.toUpperCase())}function te(e){const t=e.total_reviews>0?Math.round(e.total_positive/e.total_reviews*100):0,s=Y[e.review_score_desc]??e.review_score_desc,n=U(t);return`
    <div class="review-summary">
      <div class="review-bar-wrap"><div class="review-bar" style="width:${t}%;background:${n}"></div></div>
      <div class="review-meta">
        <span style="color:${n};font-weight:700">${s}</span>
        <span class="review-counts">${e.total_positive.toLocaleString()} مثبت از ${e.total_reviews.toLocaleString()}</span>
      </div>
    </div>`}function ae(e){const t=new Date(e.timestamp_created*1e3).toLocaleDateString("fa-IR"),s=e.voted_up?"👍":"👎",n=e.review.length>260?e.review.slice(0,260)+"…":e.review;return`
    <div class="review-card">
      <div class="review-header">
        <span class="review-vote">${s}</span>
        <span class="review-time">${Z(e.author.playtime_at_review??e.author.playtime_forever)} بازی کرده</span>
        <span class="review-date">${t}</span>
      </div>
      <p class="review-text">${n.replace(/</g,"&lt;")}</p>
    </div>`}function ie(e){const t=e.is_free?'<span class="free-label">رایگان</span>':e.price_overview?e.price_overview.discount_percent>0?`<span class="badge-discount">٪${e.price_overview.discount_percent}-</span><span class="price-final">${e.price_overview.final_formatted}</span>`:`<span class="price-final">${e.price_overview.final_formatted}</span>`:"";return`
    <div class="dlc-card">
      <img src="${e.header_image}" alt="${e.name}" loading="lazy" />
      <div class="dlc-info">
        <div class="dlc-name">${e.name}</div>
        <div class="price-row">${t}</div>
      </div>
    </div>`}function ne(e){if(!e.length)return'<p class="empty-msg">دستاوردی یافت نشد.</p>';const t=[...e].sort((i,r)=>r.percent-i.percent),s=t.slice(0,5),n=t.slice(-5).reverse(),a=i=>`
    <div class="ach-row">
      <div class="ach-name">${se(i.name)}</div>
      <div class="ach-bar-wrap">
        <div class="ach-bar" style="width:${Math.max(i.percent,.5)}%"></div>
      </div>
      <div class="ach-pct">${i.percent.toFixed(1)}٪</div>
    </div>`;return`
    <div class="ach-group">
      <div class="ach-group-label">آسان‌ترین (بیشترین بازیکن)</div>
      ${s.map(a).join("")}
    </div>
    <div class="ach-group" style="margin-top:16px">
      <div class="ach-group-label">نادرترین (کمترین بازیکن)</div>
      ${n.map(a).join("")}
    </div>
    <p class="ach-total">مجموع: ${e.length} دستاورد</p>`}async function re(e,t,s){var n,a,i,r,o,c,d,p;e.innerHTML='<div class="loading-state"><div class="spinner"></div><p>در حال بارگذاری...</p></div>';try{const l=await f.getAppDetails(t);if(!l){e.innerHTML='<button class="btn-back" id="back">بازگشت</button><p class="error-msg">اطلاعات بازی یافت نشد.</p>',(n=e.querySelector("#back"))==null||n.addEventListener("click",s);return}const m=l.price_overview?l.price_overview.discount_percent>0?`<div class="price-block">
            <span class="badge-discount">٪${l.price_overview.discount_percent}-</span>
            <span class="price-final">${l.price_overview.final_formatted}</span>
            <span class="price-original">${l.price_overview.initial_formatted}</span>
           </div>`:`<div class="price-block"><span class="price-final">${l.price_overview.final_formatted}</span></div>`:l.is_free?'<div class="price-block"><span class="free-label">رایگان</span></div>':"",u=(l.genres??[]).map(v=>`<span class="tag">${v.description}</span>`).join(""),$=(l.categories??[]).slice(0,5).map(v=>`<span class="tag">${v.description}</span>`).join(""),S=l.metacritic?`<div class="metacritic-block">
          <div class="mc-score" style="background:${U(l.metacritic.score)}">${l.metacritic.score}</div>
          <div><div style="font-weight:600;color:var(--text)">Metacritic</div><div style="font-size:.78rem">امتیاز منتقدان</div></div>
         </div>`:"",_=(l.screenshots??[]).slice(0,4).map(v=>`<img src="${v.path_thumbnail}" class="screenshot" loading="lazy" alt="" />`).join("");e.innerHTML=`
      <button class="btn-back" id="back">بازگشت</button>
      <div class="details-wrap">
        <div class="details-hero">
          <img src="${l.header_image}" alt="${l.name}" />
          <div class="details-hero-overlay">
            <h1 class="details-title">${l.name}</h1>
            ${m}
          </div>
        </div>

        <div class="details-body">
          <div class="details-main">
            <p class="short-desc">${l.short_description}</p>
            <div class="tags-row">${u}${$}</div>
            ${_?`<div class="sub-heading">تصاویر</div><div class="screenshots-grid">${_}</div>`:""}
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
          </div>

          <aside class="details-sidebar">
            ${S}

            <!-- Live players -->
            <div class="stat-block" id="players-block">
              <div class="loading-state" style="min-height:70px"><div class="spinner"></div></div>
            </div>

            <div class="info-block">
              <div class="info-row"><span class="info-label">سازنده</span><span class="info-value">${((a=l.developers)==null?void 0:a.join("، "))??"—"}</span></div>
              <div class="info-row"><span class="info-label">ناشر</span><span class="info-value">${((i=l.publishers)==null?void 0:i.join("، "))??"—"}</span></div>
              <div class="info-row"><span class="info-label">تاریخ انتشار</span><span class="info-value">${((r=l.release_date)==null?void 0:r.date)??"—"}</span></div>
              <div class="info-row"><span class="info-label">نوع</span><span class="info-value">${l.type}</span></div>
              ${(o=l.dlc)!=null&&o.length?`<div class="info-row"><span class="info-label">DLC</span><span class="info-value">${l.dlc.length} عدد</span></div>`:""}
            </div>

            <a href="https://store.steampowered.com/app/${t}" target="_blank" rel="noopener noreferrer" class="steam-link">
              مشاهده در استیم ↗
            </a>
          </aside>
        </div>
      </div>
    `,(c=e.querySelector("#back"))==null||c.addEventListener("click",s);const T=e.querySelector("#players-block");f.getCurrentPlayers(t).then(v=>{var L;const g=((L=v.response)==null?void 0:L.player_count)??0;T.innerHTML=`
        <div class="players-header">
          <span class="pulse-dot"></span>
          <span class="players-label">بازیکنان آنلاین</span>
        </div>
        <div class="players-count">${ee(g)}</div>
        <div class="players-exact">${g.toLocaleString()} نفر در حال حاضر</div>
      `}).catch(()=>{T.innerHTML=""});const H=e.querySelector("#reviews-section");f.getReviews(t).then(v=>{if(!(v!=null&&v.query_summary)){H.innerHTML="";return}const g=(v.reviews??[]).filter(L=>{var x;return((x=L.review)==null?void 0:x.trim().length)>10}).slice(0,6);H.innerHTML=`
        ${te(v.query_summary)}
        <div class="reviews-list">
          ${g.length?g.map(ae).join(""):'<p class="empty-msg">نقدی یافت نشد.</p>'}
        </div>`}).catch(()=>{H.innerHTML='<p class="error-msg">بارگذاری نقدها ناموفق بود.</p>'});const b=e.querySelector("#ach-section"),w=e.querySelector("#ach-toggle");let C=!1;if(w.addEventListener("click",async()=>{var g;if(b.style.display!=="none"){b.style.display="none",w.textContent="نمایش";return}if(b.style.display="block",w.textContent="بستن",!C){C=!0,b.innerHTML='<div class="loading-state" style="min-height:60px"><div class="spinner"></div></div>';try{const x=((g=(await f.getAchievements(t)).achievementpercentages)==null?void 0:g.achievements)??[];b.innerHTML=ne(x)}catch{b.innerHTML='<p class="error-msg">دستاوردها در دسترس نیستند.</p>'}}}),(d=l.dlc)!=null&&d.length){const v=e.querySelector("#dlc-section");v.innerHTML='<div class="sub-heading" style="margin-top:28px">محتوای دانلودی (DLC)</div><div class="loading-state" style="min-height:50px"><div class="spinner"></div></div>',f.getDLCIds(t).then(async g=>{var G;if(!((G=g.dlc)!=null&&G.length)){v.innerHTML="";return}const L=await f.getDLCDetails(g.dlc),x=Object.values(L).filter(j=>j.success).map(j=>ie(j.data)).join("");v.innerHTML=`
          <div class="sub-heading" style="margin-top:28px">محتوای دانلودی — ${g.dlc.length} عدد</div>
          <div class="dlc-grid">${x||'<p class="empty-msg">جزئیات در دسترس نیست.</p>'}</div>`}).catch(()=>{v.innerHTML=""})}}catch{e.innerHTML='<button class="btn-back" id="back">بازگشت</button><p class="error-msg">بارگذاری با خطا مواجه شد.</p>',(p=e.querySelector("#back"))==null||p.addEventListener("click",s)}}const ce=[{fa:"CS2",appid:"730"},{fa:"Dota 2",appid:"570"},{fa:"TF2",appid:"440"},{fa:"Rust",appid:"252490"},{fa:"Apex",appid:"1172470"}],M=20;function le(e,t){if(e.length<2)return'<p class="empty-msg">داده‌ای برای نمایش وجود ندارد.</p>';const s=e.slice(-90).map(w=>parseFloat(w[1])).filter(Boolean);if(!s.length)return"";const n=Math.min(...s),a=Math.max(...s),i=a-n||1,r=420,o=110,c=52,d=10,p=12,l=24,m=r-c-d,u=o-p-l,$=s.map((w,C)=>{const v=c+C/(s.length-1)*m,g=p+u-(w-n)/i*u;return`${v.toFixed(1)},${g.toFixed(1)}`}),S=s[s.length-1],_=s.length>1?(S-s[0])/s[0]*100:0,T=_>=0?"#4caf78":"#e05252",H=_>=0?"+":"",b=[`${c},${p+u}`,...$,`${c+m},${p+u}`].join(" ");return`
    <div class="chart-wrap">
      <div class="chart-stats">
        <span>کمترین: <b>${t}${n.toFixed(2)}</b></span>
        <span style="color:${T}">${H}${_.toFixed(1)}٪</span>
        <span>بیشترین: <b>${t}${a.toFixed(2)}</b></span>
      </div>
      <svg viewBox="0 0 ${r} ${o}" preserveAspectRatio="none" class="price-chart">
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#5b8def" stop-opacity="0.25"/>
            <stop offset="100%" stop-color="#5b8def" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <polygon points="${b}" fill="url(#chartGrad)"/>
        <polyline points="${$.join(" ")}" fill="none" stroke="#5b8def" stroke-width="1.8" stroke-linejoin="round"/>
        <text x="${c-4}" y="${p+u}" fill="#555" font-size="9" text-anchor="end">${t}${n.toFixed(2)}</text>
        <text x="${c-4}" y="${p+8}" fill="#555" font-size="9" text-anchor="end">${t}${a.toFixed(2)}</text>
        <circle cx="${c+m}" cy="${p+u-(S-n)/i*u}" r="3" fill="#5b8def"/>
        <text x="${c+m}" y="${p+u+16}" fill="#666" font-size="9" text-anchor="end">اکنون: ${t}${S.toFixed(2)}</text>
      </svg>
    </div>
  `}function oe(e,t){var r,o,c;const s=document.createElement("div");s.className="market-card clickable",s.dataset.hash=e.hash_name,s.dataset.appid=t;const n=(r=e.asset_description)!=null&&r.icon_url?`<img src="https://community.cloudflare.steamstatic.com/economy/image/${e.asset_description.icon_url}/96fx96f" alt="" />`:"?",a=(o=e.asset_description)!=null&&o.name_color?`#${e.asset_description.name_color}`:"var(--text)";s.innerHTML=`
    <div class="market-icon">${n}</div>
    <div class="market-info">
      <div class="market-name" style="color:${a}">${e.name}</div>
      <div class="market-type">${((c=e.asset_description)==null?void 0:c.type)??""}</div>
      <div class="market-meta">
        <span class="market-price">${e.sell_price_text}</span>
        <span class="market-count">${e.sell_listings.toLocaleString()} آیتم</span>
        <span class="chart-hint">📈 تاریخچه قیمت</span>
      </div>
    </div>
  `;let i=null;return s.addEventListener("click",async()=>{var d;if(i){i.remove(),i=null,s.classList.remove("expanded");return}s.classList.add("expanded"),i=document.createElement("div"),i.className="chart-loading",i.innerHTML='<div class="spinner" style="width:24px;height:24px;margin:12px auto"></div>',s.after(i);try{const p=await f.getPriceHistory(t,e.hash_name);p.success&&((d=p.prices)!=null&&d.length)?(i.className="chart-container",i.innerHTML=le(p.prices,p.price_prefix)):(i.className="chart-container",i.innerHTML='<p class="empty-msg" style="padding:12px 0">تاریخچه قیمت در دسترس نیست.</p>')}catch{i.className="chart-container",i.innerHTML='<p class="error-msg" style="padding:12px 0">خطا در بارگذاری تاریخچه.</p>'}}),s}function de(e){e.innerHTML=`
    <div class="section-title">بازار استیم</div>
    <div class="market-controls">
      <div class="game-tabs">
        ${ce.map((r,o)=>`<button class="tab-btn${o===0?" active":""}" data-appid="${r.appid}">${r.fa}</button>`).join("")}
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
  `;let t="730",s="";const n=async(r,o,c)=>{var l;s=r,t=o;const d=e.querySelector("#market-list"),p=e.querySelector("#market-pager");d.innerHTML=Array(8).fill('<div class="skeleton skeleton-market"></div>').join(""),p.innerHTML="";try{const m=await f.searchMarket(r,o,String(c));if(d.innerHTML="",!m.success||!((l=m.results)!=null&&l.length)){d.innerHTML='<p class="empty-msg">آیتمی یافت نشد.</p>';return}m.results.forEach(u=>d.appendChild(oe(u,o))),m.total_count>M&&pe(p,c,m.total_count,u=>n(s,t,u))}catch{d.innerHTML='<p class="error-msg">بارگذاری بازار با خطا مواجه شد.</p>'}};e.querySelectorAll(".tab-btn").forEach(r=>{r.addEventListener("click",()=>{e.querySelectorAll(".tab-btn").forEach(o=>o.classList.remove("active")),r.classList.add("active"),n(s,r.dataset.appid??"730",0)})});const a=e.querySelector("#market-input");e.querySelector("#market-btn").addEventListener("click",()=>n(a.value,t,0)),a.addEventListener("keydown",r=>{r.key==="Enter"&&n(a.value,t,0)}),n("","730",0)}function pe(e,t,s,n){const a=Math.floor(t/M)+1,i=Math.ceil(s/M);e.innerHTML="";const r=document.createElement("button");r.className="btn-page",r.textContent="قبلی",r.disabled=t===0,r.onclick=()=>n(Math.max(0,t-M));const o=document.createElement("span");o.className="page-info",o.textContent=`${a} از ${i} (${s.toLocaleString()} آیتم)`;const c=document.createElement("button");c.className="btn-page",c.textContent="بعدی",c.disabled=t+M>=s,c.onclick=()=>n(t+M),e.append(c,o,r)}const I=[{fa:"اکشن",en:"action"},{fa:"ماجراجویی",en:"adventure"},{fa:"نقش‌آفرینی",en:"RPG"},{fa:"استراتژی",en:"strategy"},{fa:"شبیه‌ساز",en:"simulation"},{fa:"ترسناک",en:"horror"},{fa:"پازل",en:"puzzle"},{fa:"ورزشی",en:"sports"},{fa:"مسابقه‌ای",en:"racing"},{fa:"رایگان",en:"free to play"}];function ve(e,t){const s=document.createElement("div");s.className="game-card",s.tabIndex=0;const n=e.price?e.price.discount_percent>0?`<div class="price-row">
          <span class="badge-discount">٪${e.price.discount_percent}-</span>
          <span class="price-final">${e.price.final_formatted}</span>
         </div>`:`<div class="price-row"><span class="price-final">${e.price.final_formatted}</span></div>`:'<div class="price-row"><span class="free-label">رایگان</span></div>';s.innerHTML=`
    <div class="card-image-wrap">
      <img src="${e.tiny_image}" alt="${e.name}" loading="lazy" />
    </div>
    <div class="card-body">
      <h3 class="card-title">${e.name}</h3>
      ${n}
    </div>
  `;const a=()=>t(e.id);return s.addEventListener("click",a),s.addEventListener("keydown",i=>{i.key==="Enter"&&a()}),s}function ue(e,t){let s=I[0];e.innerHTML=`
    <div class="section-title">پیشنهاد بازی</div>
    <div class="suggest-genres">
      ${I.map((a,i)=>`<button class="genre-btn${i===0?" active":""}" data-en="${a.en}">${a.fa}</button>`).join("")}
    </div>
    <div class="suggest-header">
      <span id="genre-label" style="font-size:.9rem;color:var(--muted)">بازی‌های ${s.fa}</span>
      <span id="result-count" class="suggest-count"></span>
    </div>
    <div id="suggest-grid" class="game-grid">
      ${Array(8).fill('<div class="skeleton skeleton-suggest"></div>').join("")}
    </div>
  `;const n=async a=>{var c;s=a;const i=e.querySelector("#suggest-grid"),r=e.querySelector("#genre-label"),o=e.querySelector("#result-count");i.innerHTML=Array(8).fill('<div class="skeleton skeleton-suggest"></div>').join(""),r.textContent=`بازی‌های ${a.fa}`,o.textContent="";try{const d=await f.search(a.en,String(Math.floor(Math.random()*3)+1));if(i.innerHTML="",!((c=d.items)!=null&&c.length)){i.innerHTML='<p class="empty-msg">بازی‌ای در این دسته یافت نشد.</p>';return}[...d.items].sort(()=>Math.random()-.5).slice(0,12).forEach(l=>i.appendChild(ve(l,t))),o.textContent=`${d.total} بازی`}catch{i.innerHTML='<p class="error-msg">خطا در بارگذاری پیشنهادات.</p>'}};e.querySelectorAll(".genre-btn").forEach(a=>{a.addEventListener("click",()=>{e.querySelectorAll(".genre-btn").forEach(o=>o.classList.remove("active")),a.classList.add("active");const i=a.dataset.en??"",r=a.textContent??"";n({fa:r,en:i})})}),n(s)}const V=document.querySelector("#app"),y=document.createElement("main");y.className="main-content";let P="home",z="home",q=null;function me(){q&&q.remove(),q=B(E,P),V.insertBefore(q,y)}function E(e,t){switch(z=P,P=e,y.innerHTML="",me(),e){case"home":W(y,s=>E("details",s));break;case"search":Q(y,s=>E("details",s),typeof t=="string"?t:"");break;case"suggest":ue(y,s=>E("details",s));break;case"details":typeof t=="number"&&re(y,t,()=>E(z));break;case"market":de(y);break}}V.appendChild(y);E("home");
