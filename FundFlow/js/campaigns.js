const CATEGORIES=["Education","Medical","Environment","Animals","Technology","Community","Emergency","Creative"];
document.addEventListener("DOMContentLoaded",()=>{
 const cats=document.getElementById("categoryGrid"); if(cats) renderCategories(cats);
 const select=document.getElementById("categoryFilter"); if(select){CATEGORIES.forEach(c=>select.insertAdjacentHTML("beforeend",`<option>${c}</option>`));renderCampaignResults();}
 const trend=document.getElementById("trendingCampaigns"); if(trend)trend.innerHTML=getCampaigns().filter(c=>c.status!=="Expired").sort((a,b)=>calculateTrendingScore(b)-calculateTrendingScore(a)).slice(0,3).map(campaignCard).join("");
 const form=document.getElementById("campaignForm"); if(form)setupCampaignForm(form);
});
function renderCategories(el){el.innerHTML=CATEGORIES.map((c,i)=>`<a class="category-card cat-${i}" href="campaigns.html?category=${encodeURIComponent(c)}"><span class="category-icon">${["📚","🩺","🌱","🐾","💡","🤝","🚑","🎨"][i]}</span><strong>${c}</strong><small>Explore campaigns</small></a>`).join("");}
function renderCampaignResults(){
 const out=document.getElementById("campaignResults"), empty=document.getElementById("emptyCampaigns");if(!out)return;
 let list=getCampaigns();const q=(document.getElementById("campaignSearch")?.value||"").trim().toLowerCase();const cat=document.getElementById("categoryFilter")?.value||"all";const sort=document.getElementById("sortFilter")?.value||"trending";
 if(q)list=list.filter(c=>[c.title,c.description,c.category,c.creator].some(v=>v.toLowerCase().includes(q)));
 if(cat!=="all")list=list.filter(c=>c.category===cat);
 list.sort((a,b)=>sort==="newest"?new Date(b.createdAt)-new Date(a.createdAt):sort==="funded"?b.raised-a.raised:sort==="ending"?a.daysLeft-b.daysLeft:sort==="supporters"?b.supporters-a.supporters:calculateTrendingScore(b)-calculateTrendingScore(a));
 out.innerHTML=list.map(campaignCard).join("");empty?.classList.toggle("hidden",list.length>0);
 out.querySelectorAll("[data-save]").forEach(btn=>btn.addEventListener("click",e=>{e.preventDefault();toggleSaved(Number(btn.dataset.save));}));
}
function toggleSaved(id){let a=getFromStorage(STORAGE_KEYS.savedCampaigns,[]);a=a.includes(id)?a.filter(x=>x!==id):[...a,id];saveToStorage(STORAGE_KEYS.savedCampaigns,a);showToast(a.includes(id)?"Campaign saved":"Campaign removed","success");renderCampaignResults();}
function setupCampaignForm(form){
 const category=document.getElementById("category");CATEGORIES.forEach(c=>category.insertAdjacentHTML("beforeend",`<option>${c}</option>`));
 const user=getCurrentUser();if(user){document.getElementById("creator").value=user.name;document.getElementById("contactEmail").value=user.email;}
 form.addEventListener("submit",e=>{e.preventDefault();const usage=["fundEducation","fundMaterials","fundOperations"].map(id=>Number(document.getElementById(id).value)||0);if(usage.reduce((a,b)=>a+b,0)!==100){showToast("Fund usage percentages must total 100%.","error");return;}
 const days=Number(document.getElementById("duration").value), campaign={id:Date.now(),title:document.getElementById("title").value.trim(),category:category.value,description:document.getElementById("description").value.trim(),creator:document.getElementById("creator").value.trim(),contactEmail:document.getElementById("contactEmail").value.trim(),goal:Number(document.getElementById("goal").value),raised:0,supporters:0,daysLeft:days,createdAt:new Date().toISOString(),recentDonations:0,recentActivity:25,verification:"Pending",status:"Active",image:document.getElementById("image").value||"https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",impact:document.getElementById("impact").value.trim(),fundUsage:{Education:usage[0],Materials:usage[1],Operations:usage[2]},updates:[]};
 const all=getCampaigns();all.unshift(campaign);saveToStorage(STORAGE_KEYS.campaigns,all);showNotification("Campaign created and sent for verification.","success");location.href=`campaign-details.html?id=${campaign.id}`;});
}