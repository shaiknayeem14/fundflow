document.addEventListener("DOMContentLoaded",()=>{initApp();});
function initApp(){
 renderHeader(); renderFooter(); initTheme(); initGlobalEvents(); animateCounters();
}
function renderHeader(){
 const user=getCurrentUser(), path=location.pathname.split("/").pop()||"index.html";
 const initials=user?.name?.split(" ").map(x=>x[0]).join("").slice(0,2).toUpperCase()||"GU";
 const header=document.getElementById("appHeader"); if(!header)return;
 header.innerHTML=`<header class="site-header"><div class="container nav"><a class="brand" href="index.html"><span class="brand-mark">F</span><span>FundFlow</span></a><nav class="nav-links"><a class="${path==="index.html"?"active":""}" href="index.html">Home</a><a class="${path==="campaigns.html"?"active":""}" href="campaigns.html">Campaigns</a><a href="create-campaign.html">Start a Campaign</a><a href="dashboard.html">Dashboard</a>${user?.role==="admin"?`<a href="admin.html">Admin</a>`:""}</nav><div class="nav-actions"><button class="icon-btn theme-toggle" title="Toggle theme"><i class="fa-solid fa-moon"></i></button><a class="notification-btn" href="dashboard.html" title="Notifications"><i class="fa-regular fa-bell"></i><span class="notification-dot"></span></a>${user?`<div class="user-menu"><span class="avatar">${initials}</span><span class="user-name">${escapeHtml(user.name)}</span><button class="icon-btn" data-logout title="Sign out"><i class="fa-solid fa-arrow-right-from-bracket"></i></button></div>`:`<a class="btn btn-outline btn-sm" href="login.html">Sign in</a>`}<button class="mobile-menu icon-btn" aria-label="Open menu"><i class="fa-solid fa-bars"></i></button></div></div></header>`;
}
function renderFooter(){const f=document.getElementById("appFooter");if(!f)return;f.innerHTML=`<footer class="footer"><div class="container footer-grid"><div><a class="brand" href="index.html"><span class="brand-mark">F</span>FundFlow</a><p>Fund an Idea. Change a Life.</p></div><div><h4>Explore</h4><a href="campaigns.html">Campaigns</a><a href="create-campaign.html">Start a Campaign</a></div><div><h4>Account</h4><a href="login.html">Sign in</a><a href="dashboard.html">Dashboard</a></div><div><h4>Safety</h4><p class="muted">Frontend demo. No real money is transferred.</p></div></div><div class="container footer-bottom"><span>© 2026 FundFlow</span><span>Built as a portfolio demonstration</span></div></footer>`;}
function initGlobalEvents(){
 document.addEventListener("click",e=>{
   const logout=e.target.closest("[data-logout]"); if(logout){localStorage.removeItem(STORAGE_KEYS.currentUser); showToast("Signed out","success"); setTimeout(()=>location.href="index.html",400);}
   const theme=e.target.closest(".theme-toggle"); if(theme)toggleTheme();
   const toggle=e.target.closest("[data-toggle-password]"); if(toggle){const input=toggle.parentElement.querySelector("input");input.type=input.type==="password"?"text":"password";toggle.innerHTML=`<i class="fa-regular fa-eye${input.type==="text"?"-slash":""}"></i>`;}
   const menu=e.target.closest(".mobile-menu"); if(menu)document.querySelector(".nav-links")?.classList.toggle("open");
 });
}
function showToast(message,type="success"){const c=document.getElementById("toastContainer");if(!c)return;const el=document.createElement("div");el.className=`toast ${type}`;el.innerHTML=`<i class="fa-solid ${type==="success"?"fa-circle-check":type==="error"?"fa-circle-xmark":"fa-circle-info"}"></i><span>${escapeHtml(message)}</span>`;c.appendChild(el);setTimeout(()=>el.classList.add("show"),10);setTimeout(()=>{el.classList.remove("show");setTimeout(()=>el.remove(),300)},3200);}
function escapeHtml(s=""){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function formatINR(n){return new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(Number(n)||0);}
function daysFromNow(date){return Math.max(0,Math.ceil((new Date(date)-Date.now())/86400000));}
function calculateTrendingScore(c){
 const funding=Math.min(100,(c.raised/c.goal)*100);
 const recent=Math.min(100,(c.recentDonations/100)*100);
 const supporters=Math.min(100,(c.supporters/500)*100);
 const activity=Math.min(100,Number(c.recentActivity)||0);
 return 0.4*funding+0.25*recent+0.2*supporters+0.15*activity;
}
function progress(c){return Math.min(100,Math.round((c.raised/c.goal)*100));}
function campaignCard(c){
 const saved=getFromStorage(STORAGE_KEYS.savedCampaigns,[]).includes(c.id);
 return `<article class="campaign-card reveal"><div class="campaign-media" style="background-image:url('${c.image}')"><span class="category-pill">${escapeHtml(c.category)}</span>${calculateTrendingScore(c)>=60?'<span class="trend-badge">🔥 Trending</span>':""}<button class="save-btn ${saved?"saved":""}" data-save="${c.id}" aria-label="Save campaign"><i class="${saved?"fa-solid":"fa-regular"} fa-heart"></i></button></div><div class="campaign-body"><div class="creator-row"><span class="avatar small">${c.creator.split(" ").map(x=>x[0]).join("").slice(0,2)}</span><span>${escapeHtml(c.creator)}</span>${c.verification==="Verified"?'<i class="verified fa-solid fa-circle-check" title="Verified"></i>':""}</div><h3>${escapeHtml(c.title)}</h3><p>${escapeHtml(c.description)}</p><div class="progress-label"><span>${formatINR(c.raised)} raised</span><span>${progress(c)}%</span></div><div class="progress"><span style="width:${progress(c)}%"></span></div><div class="mini-stats"><span><b>${c.supporters}</b> supporters</span><span><b>${c.daysLeft}</b> days left</span></div><a class="btn btn-primary btn-block" href="checkout.html?campaignId=${c.id}">Support Campaign <i class="fa-solid fa-arrow-right"></i></a></div></article>`;
}
function animateCounters(){document.querySelectorAll(".stat-card span").forEach(el=>{const text=el.textContent;if(!/^\d/.test(text))return;});}
function toggleTheme(){const next=document.documentElement.dataset.theme==="dark"?"light":"dark";document.documentElement.dataset.theme=next;saveToStorage(STORAGE_KEYS.theme,next);document.querySelectorAll(".theme-toggle i").forEach(i=>i.className=`fa-solid ${next==="dark"?"fa-sun":"fa-moon"}`);}
function initTheme(){const t=getFromStorage(STORAGE_KEYS.theme,"light");document.documentElement.dataset.theme=t;}