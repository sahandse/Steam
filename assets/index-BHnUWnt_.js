(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))n(a);new MutationObserver(a=>{for(const r of a)if(r.type==="childList")for(const i of r.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&n(i)}).observe(document,{childList:!0,subtree:!0});function s(a){const r={};return a.integrity&&(r.integrity=a.integrity),a.referrerPolicy&&(r.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?r.credentials="include":a.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(a){if(a.ep)return;a.ep=!0;const r=s(a);fetch(a.href,r)}})();function x(e){const t=document.createElement("header");t.className="app-header",t.innerHTML=`
    <div class="header-inner">
      <div class="logo" role="button" tabindex="0">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <circle cx="14" cy="14" r="13" stroke="#66c0f4" stroke-width="2"/>
          <circle cx="14" cy="14" r="7" fill="#66c0f4"/>
          <circle cx="14" cy="14" r="3" fill="#1b2838"/>
        </svg>
        <span>Steam Explorer</span>
      </div>
      <nav class="nav-links">
        <button class="nav-btn" data-view="home">Home</button>
        <button class="nav-btn" data-view="search">Search</button>
        <button class="nav-btn" data-view="market">Market</button>
      </nav>
    </div>
  `,t.querySelectorAll(".nav-btn").forEach(n=>{n.addEventListener("click",()=>{const a=n.dataset.view;e(a)})});const s=t.querySelector(".logo");return s.addEventListener("click",()=>e("home")),s.addEventListener("keydown",n=>{n.key==="Enter"&&e("home")}),t}const E="https://corsproxy.io/?url=";function y(e,t={}){{const s=new URL(`https://store.steampowered.com${e}`);return Object.entries(t).forEach(([n,a])=>s.searchParams.set(n,a)),`${E}${encodeURIComponent(s.toString())}`}}function A(e,t={}){{const s=new URL(`https://steamcommunity.com${e}`);return Object.entries(t).forEach(([n,a])=>s.searchParams.set(n,a)),`${E}${encodeURIComponent(s.toString())}`}}async function g(e){const t=await fetch(e);if(!t.ok)throw new Error(`Request failed: ${t.status}`);return t.json()}const b={getFeatured:()=>g(y("/api/featured",{cc:"us",l:"english"})),search:(e,t="1")=>g(y("/api/storesearch",{term:e,l:"english",cc:"us",realm:"1",page:t})),getAppDetails:async e=>{const s=(await g(y("/api/appdetails",{appids:String(e),cc:"us",l:"english"})))[String(e)];return s!=null&&s.success?s.data:null},searchMarket:(e,t="730",s="0")=>g(A("/market/search/render",{query:e,appid:t,search_descriptions:"0",sort_column:"popular",sort_dir:"desc",start:s,count:"20",norender:"1"}))};function k(e,t){return e===0?"Free":`${t} ${(e/100).toFixed(2)}`}function N(e,t){const s=document.createElement("div");s.className="game-card",s.setAttribute("role","button"),s.setAttribute("tabindex","0");const n=e.discount_percent>0?`<span class="badge-discount">-${e.discount_percent}%</span>`:"",a=e.discount_percent>0?`<div class="price-row">
        <span class="price-original">${k(e.original_price,e.currency)}</span>
        <span class="price-final">${k(e.final_price,e.currency)}</span>
       </div>`:`<div class="price-row"><span class="price-final">${k(e.final_price,e.currency)}</span></div>`;s.innerHTML=`
    <div class="card-image-wrap">
      <img src="${e.header_image||e.small_capsule_image}" alt="${e.name}" loading="lazy" />
      ${n}
    </div>
    <div class="card-body">
      <h3 class="card-title">${e.name}</h3>
      ${a}
    </div>
  `;const r=()=>t(e.id);return s.addEventListener("click",r),s.addEventListener("keydown",i=>{i.key==="Enter"&&r()}),s}async function C(e,t){e.innerHTML=`
    <section class="hero">
      <h1>Explore the Steam Store</h1>
      <p>Discover games, check prices, and browse the marketplace.</p>
    </section>
    <section class="section">
      <h2 class="section-title">Featured &amp; Recommended</h2>
      <div class="game-grid loading-grid">
        ${Array(6).fill('<div class="skeleton-card"></div>').join("")}
      </div>
    </section>
  `;try{const s=await b.getFeatured(),n=[...s.large_capsules||[],...s.featured_win||[]].slice(0,12),a=e.querySelector(".game-grid");if(a.className="game-grid",a.innerHTML="",n.length===0){a.innerHTML='<p class="empty-msg">No featured games found.</p>';return}n.forEach(r=>{a.appendChild(N(r,t))})}catch{const s=e.querySelector(".game-grid");s.innerHTML='<p class="error-msg">Failed to load featured games. Try refreshing.</p>'}}let $="";function q(e,t){const s=document.createElement("div");s.className="game-card",s.setAttribute("role","button"),s.setAttribute("tabindex","0");const n=e.price?e.price.discount_percent>0?`<div class="price-row">
          <span class="badge-discount">-${e.price.discount_percent}%</span>
          <span class="price-original">${e.price.initial_formatted}</span>
          <span class="price-final">${e.price.final_formatted}</span>
         </div>`:`<div class="price-row"><span class="price-final">${e.price.final_formatted}</span></div>`:'<div class="price-row"><span class="price-final">Free / N/A</span></div>';s.innerHTML=`
    <div class="card-image-wrap">
      <img src="${e.tiny_image}" alt="${e.name}" loading="lazy" />
    </div>
    <div class="card-body">
      <h3 class="card-title">${e.name}</h3>
      ${n}
    </div>
  `;const a=()=>t(e.id);return s.addEventListener("click",a),s.addEventListener("keydown",r=>{r.key==="Enter"&&a()}),s}function P(e,t,s=""){$=s,e.innerHTML=`
    <section class="search-section">
      <h2 class="section-title">Search Games</h2>
      <div class="search-bar">
        <input type="text" id="search-input" placeholder="Search for a game..." value="${s}" autocomplete="off" />
        <button id="search-btn" class="btn-primary">Search</button>
      </div>
      <div id="search-results" class="game-grid"></div>
      <div id="pagination" class="pagination"></div>
    </section>
  `;const n=e.querySelector("#search-input"),a=e.querySelector("#search-btn"),r=async(i,o)=>{if(!i.trim())return;$=i;const l=e.querySelector("#search-results"),d=e.querySelector("#pagination");l.innerHTML=Array(6).fill('<div class="skeleton-card"></div>').join(""),d.innerHTML="";try{const p=await b.search(i,String(o));if(l.innerHTML="",!p.items||p.items.length===0){l.innerHTML='<p class="empty-msg">No results found.</p>';return}p.items.forEach(c=>l.appendChild(q(c,t)));const u=Math.ceil(p.total/25);u>1&&j(d,o,u,c=>r($,c))}catch{l.innerHTML='<p class="error-msg">Search failed. Please try again.</p>'}};a.addEventListener("click",()=>r(n.value,1)),n.addEventListener("keydown",i=>{i.key==="Enter"&&r(n.value,1)}),s&&r(s,1),setTimeout(()=>n.focus(),50)}function j(e,t,s,n){e.innerHTML="";const a=document.createElement("button");a.className="btn-page",a.textContent="← Prev",a.disabled=t===1,a.addEventListener("click",()=>n(t-1));const r=document.createElement("span");r.className="page-info",r.textContent=`Page ${t} of ${s}`;const i=document.createElement("button");i.className="btn-page",i.textContent="Next →",i.disabled=t===s,i.addEventListener("click",()=>n(t+1)),e.append(a,r,i)}async function F(e,t,s){var n,a,r,i,o,l,d,p,u;e.innerHTML=`
    <div class="details-loading">
      <div class="spinner"></div>
      <p>Loading game details...</p>
    </div>
  `;try{const c=await b.getAppDetails(t);if(!c){e.innerHTML=`
        <div class="error-state">
          <p class="error-msg">Could not load game details.</p>
          <button class="btn-primary" id="back-btn">← Go Back</button>
        </div>
      `,(n=e.querySelector("#back-btn"))==null||n.addEventListener("click",s);return}const v=c.price_overview?c.price_overview.discount_percent>0?`<div class="price-block">
            <span class="badge-discount">-${c.price_overview.discount_percent}%</span>
            <span class="price-original">${c.price_overview.initial_formatted}</span>
            <span class="price-final">${c.price_overview.final_formatted}</span>
           </div>`:`<div class="price-block"><span class="price-final">${c.price_overview.final_formatted}</span></div>`:c.is_free?'<div class="price-block"><span class="price-final free-tag">Free to Play</span></div>':'<div class="price-block"><span class="price-final">N/A</span></div>',M=((a=c.genres)==null?void 0:a.map(f=>`<span class="tag">${f.description}</span>`).join(""))??"",H=((r=c.categories)==null?void 0:r.slice(0,6).map(f=>`<span class="tag tag-alt">${f.description}</span>`).join(""))??"",T=c.metacritic?`<div class="metacritic">
          <span class="mc-score" style="background:${c.metacritic.score>=75?"#66c0f4":c.metacritic.score>=50?"#f4c266":"#e57373"}">
            ${c.metacritic.score}
          </span>
          <span>Metacritic</span>
         </div>`:"",L=((i=c.screenshots)==null?void 0:i.slice(0,4).map(f=>`<img src="${f.path_thumbnail}" alt="Screenshot" class="screenshot" loading="lazy" />`).join(""))??"";e.innerHTML=`
      <button class="btn-back" id="back-btn">← Back</button>
      <div class="details-wrapper">
        <div class="details-hero" style="background-image: url('${c.header_image}')">
          <div class="details-hero-overlay">
            <h1 class="details-title">${c.name}</h1>
            ${v}
          </div>
        </div>

        <div class="details-body">
          <div class="details-main">
            <p class="short-desc">${c.short_description}</p>
            <div class="tags-row">${M}${H}</div>

            ${L?`<h3 class="sub-heading">Screenshots</h3>
                 <div class="screenshots-grid">${L}</div>`:""}

            <h3 class="sub-heading">About</h3>
            <div class="long-desc">${c.detailed_description}</div>
          </div>

          <aside class="details-sidebar">
            ${T}
            <div class="info-block">
              <div class="info-row"><span class="info-label">Developer</span><span>${((o=c.developers)==null?void 0:o.join(", "))??"N/A"}</span></div>
              <div class="info-row"><span class="info-label">Publisher</span><span>${((l=c.publishers)==null?void 0:l.join(", "))??"N/A"}</span></div>
              <div class="info-row"><span class="info-label">Release Date</span><span>${((d=c.release_date)==null?void 0:d.date)??"TBA"}</span></div>
              <div class="info-row"><span class="info-label">Type</span><span>${c.type}</span></div>
            </div>
            <a
              href="https://store.steampowered.com/app/${t}"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-primary steam-link"
            >View on Steam ↗</a>
          </aside>
        </div>
      </div>
    `,(p=e.querySelector("#back-btn"))==null||p.addEventListener("click",s)}catch{e.innerHTML=`
      <div class="error-state">
        <p class="error-msg">Failed to load game details.</p>
        <button class="btn-primary" id="back-btn">← Go Back</button>
      </div>
    `,(u=e.querySelector("#back-btn"))==null||u.addEventListener("click",s)}}const O=[{label:"CS2",appid:"730"},{label:"Dota 2",appid:"570"},{label:"Team Fortress 2",appid:"440"},{label:"Rust",appid:"252490"},{label:"Apex Legends",appid:"1172470"}];function R(e){var a,r,i;const t=document.createElement("div");t.className="market-card";const s=(a=e.asset_description)!=null&&a.icon_url?`https://community.cloudflare.steamstatic.com/economy/image/${e.asset_description.icon_url}/96fx96f`:"",n=(r=e.asset_description)!=null&&r.name_color?`#${e.asset_description.name_color}`:"#c6d4df";return t.innerHTML=`
    <div class="market-icon-wrap">
      ${s?`<img src="${s}" alt="${e.name}" loading="lazy" />`:'<div class="no-icon">?</div>'}
    </div>
    <div class="market-info">
      <p class="market-name" style="color: ${n}">${e.name}</p>
      <p class="market-type">${((i=e.asset_description)==null?void 0:i.type)??""}</p>
      <div class="market-price-row">
        <span class="market-price">${e.sell_price_text}</span>
        <span class="market-listings">${e.sell_listings.toLocaleString()} listings</span>
      </div>
    </div>
  `,t}function D(e){e.innerHTML=`
    <section class="market-section">
      <h2 class="section-title">Steam Marketplace</h2>
      <div class="market-controls">
        <div class="game-tabs">
          ${O.map((o,l)=>`<button class="tab-btn${l===0?" active":""}" data-appid="${o.appid}">${o.label}</button>`).join("")}
        </div>
        <div class="search-bar">
          <input type="text" id="market-search" placeholder="Search items..." autocomplete="off" />
          <button id="market-search-btn" class="btn-primary">Search</button>
        </div>
      </div>
      <div id="market-results" class="market-grid">
        ${Array(8).fill('<div class="skeleton-card market-skeleton"></div>').join("")}
      </div>
      <div id="market-pagination" class="pagination"></div>
    </section>
  `;let t="730",s="";const n=20,a=async(o,l,d)=>{s=o,t=l;const p=e.querySelector("#market-results"),u=e.querySelector("#market-pagination");p.innerHTML=Array(8).fill('<div class="skeleton-card market-skeleton"></div>').join(""),u.innerHTML="";try{const c=await b.searchMarket(o,l,String(d));if(p.innerHTML="",!c.success||!c.results||c.results.length===0){p.innerHTML='<p class="empty-msg">No items found.</p>';return}c.results.forEach(v=>p.appendChild(R(v))),c.total_count>n&&U(u,d,c.total_count,n,v=>a(s,t,v))}catch{p.innerHTML='<p class="error-msg">Failed to load market items. Try again.</p>'}};e.querySelectorAll(".tab-btn").forEach(o=>{o.addEventListener("click",()=>{e.querySelectorAll(".tab-btn").forEach(d=>d.classList.remove("active")),o.classList.add("active");const l=o.dataset.appid??"730";a(s,l,0)})});const r=e.querySelector("#market-search");e.querySelector("#market-search-btn").addEventListener("click",()=>a(r.value,t,0)),r.addEventListener("keydown",o=>{o.key==="Enter"&&a(r.value,t,0)}),a("","730",0)}function U(e,t,s,n,a){e.innerHTML="";const r=Math.floor(t/n)+1,i=Math.ceil(s/n),o=document.createElement("button");o.className="btn-page",o.textContent="← Prev",o.disabled=t===0,o.addEventListener("click",()=>a(Math.max(0,t-n)));const l=document.createElement("span");l.className="page-info",l.textContent=`Page ${r} of ${i} (${s.toLocaleString()} items)`;const d=document.createElement("button");d.className="btn-page",d.textContent="Next →",d.disabled=t+n>=s,d.addEventListener("click",()=>a(t+n)),e.append(o,l,d)}const S=document.querySelector("#app");let w="home",_="home";const V=x(h),m=document.createElement("main");m.className="main-content";S.appendChild(V);S.appendChild(m);function h(e,t){switch(_=w,w=e,m.innerHTML="",e){case"home":C(m,s=>h("details",s));break;case"search":P(m,s=>h("details",s),typeof t=="string"?t:"");break;case"details":typeof t=="number"&&F(m,t,()=>h(_));break;case"market":D(m);break}}h("home");
