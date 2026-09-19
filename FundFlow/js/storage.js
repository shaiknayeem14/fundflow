const STORAGE_KEYS = {
  users:"ff_users", currentUser:"ff_currentUser", campaigns:"ff_campaigns",
  donations:"ff_donations", transactions:"ff_transactions", notifications:"ff_notifications",
  savedCampaigns:"ff_savedCampaigns", theme:"ff_theme"
};
const readJSON = (key, fallback=[]) => { try { const raw=localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; } catch { return fallback; } };
const saveJSON = (key, value) => localStorage.setItem(key, JSON.stringify(value));
function getFromStorage(key, fallback=[]) { return readJSON(key, fallback); }
function saveToStorage(key, value) { saveJSON(key, value); }
function uid(prefix="FF") { return `${prefix}${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2,7).toUpperCase()}`; }
function generateTransactionId(){ return `FFTXN${new Date().toISOString().slice(0,10).replaceAll("-","")}${String(Date.now()).slice(-6)}`; }
function generateReceiptId(){ return `FFREC${new Date().toISOString().slice(0,10).replaceAll("-","")}${String(Date.now()).slice(-6)}`; }
function generateRefundId(){ return `FFREF${new Date().toISOString().slice(0,10).replaceAll("-","")}${String(Date.now()).slice(-6)}`; }
function getCurrentUser(){
  const user=getFromStorage(STORAGE_KEYS.currentUser,null);
  if(!user) return null;
  if(user.sessionExpiresAt && Date.now()>Number(user.sessionExpiresAt)){ localStorage.removeItem(STORAGE_KEYS.currentUser); return null; }
  return user;
}
function setCurrentUser(user){ saveToStorage(STORAGE_KEYS.currentUser,user); }
function getCampaigns(){ return getFromStorage(STORAGE_KEYS.campaigns,[]); }
function getCampaign(id){ return getCampaigns().find(c=>String(c.id)===String(id)); }
function updateCampaign(id, patch){ const all=getCampaigns(); const i=all.findIndex(c=>String(c.id)===String(id)); if(i<0)return null; all[i]={...all[i],...patch}; saveToStorage(STORAGE_KEYS.campaigns,all); return all[i]; }
function getTransactions(){ return getFromStorage(STORAGE_KEYS.transactions,[]); }
function getDonations(){ return getFromStorage(STORAGE_KEYS.donations,[]); }
function showNotification(message,type="success"){ const items=getFromStorage(STORAGE_KEYS.notifications,[]); items.unshift({id:uid("N"),message,type,createdAt:new Date().toISOString(),read:false}); saveToStorage(STORAGE_KEYS.notifications,items.slice(0,50)); if(window.showToast) showToast(message,type); }
function seedData(){
 if(localStorage.getItem(STORAGE_KEYS.campaigns)) return;
 const now=Date.now(), day=86400000;
 const img=(id)=>`https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=80`;
 const campaigns=[
 {id:101,title:"Help 100 Children Continue Their Education",category:"Education",description:"Provide school supplies, books and essential learning resources to children who need a stronger start.",creator:"Aarav Kumar",goal:100000,raised:65000,supporters:125,daysLeft:18,createdAt:new Date(now-12*day).toISOString(),recentDonations:38,recentActivity:88,verification:"Verified",status:"Active",image:img("1509062522246-3755977927d7"),impact:"School kits, books, meals and annual learning support.",fundUsage:{Education:50,Materials:30,Operations:20},updates:[{date:"2026-09-12",text:"We reached our first 60% milestone."}]},
 {id:102,title:"Emergency Care Fund for Rural Families",category:"Medical",description:"Support urgent treatment, diagnostics and essential medicines for families facing unexpected medical costs.",creator:"Dr. Neha Foundation",goal:250000,raised:187500,supporters:214,daysLeft:9,createdAt:new Date(now-22*day).toISOString(),recentDonations:71,recentActivity:95,verification:"Verified",status:"Active",image:img("1584515933487-779824d29309"),impact:"Diagnostics, medicines and emergency care.",fundUsage:{Medical:70,Medicines:20,Operations:10},updates:[{date:"2026-09-16",text:"A new clinic partner joined the campaign."}]},
 {id:103,title:"Restore 10,000 Native Trees",category:"Environment",description:"Restore local biodiversity by planting native trees and funding community-led maintenance.",creator:"GreenRoots Collective",goal:180000,raised:171000,supporters:342,daysLeft:6,createdAt:new Date(now-35*day).toISOString(),recentDonations:82,recentActivity:92,verification:"Verified",status:"Active",image:img("1441974231531-c6227db76b6e"),impact:"Native trees planted and maintained.",fundUsage:{Planting:65,Maintenance:25,Operations:10},updates:[{date:"2026-09-18",text:"9,500 trees are now funded."}]},
 {id:104,title:"Rescue & Recovery for Street Animals",category:"Animals",description:"Fund vaccinations, rescue transport and recovery care for injured street animals.",creator:"Paws & Hope",goal:90000,raised:92000,supporters:286,daysLeft:0,createdAt:new Date(now-44*day).toISOString(),recentDonations:62,recentActivity:70,verification:"Verified",status:"Completed",image:img("1450778869180-41d0601e046e"),impact:"Rescue, vaccination and recovery care.",fundUsage:{Rescue:60,Care:30,Operations:10},updates:[{date:"2026-09-10",text:"Goal exceeded. Thank you supporters!"}]},
 {id:105,title:"Open-Source Solar Study Kit",category:"Technology",description:"Build affordable solar-learning kits for schools and student maker clubs.",creator:"BuildBright Labs",goal:150000,raised:42000,supporters:64,daysLeft:27,createdAt:new Date(now-5*day).toISOString(),recentDonations:22,recentActivity:64,verification:"Pending",status:"Active",image:img("1473341304170-971dccb5ac1e"),impact:"Solar kits, workshops and learning materials.",fundUsage:{Hardware:60,Workshops:25,Operations:15},updates:[]},
 {id:106,title:"Community Kitchen: 5,000 Meals",category:"Community",description:"Keep a neighborhood community kitchen running with nutritious meals for families in need.",creator:"Sahana Community Trust",goal:120000,raised:76000,supporters:190,daysLeft:14,createdAt:new Date(now-17*day).toISOString(),recentDonations:44,recentActivity:79,verification:"Verified",status:"Active",image:img("1498837167922-ddd27525d352"),impact:"Nutritious meals and kitchen supplies.",fundUsage:{Food:75,Equipment:15,Operations:10},updates:[]},
 {id:107,title:"Flood Recovery Essentials",category:"Emergency",description:"Provide emergency kits, clean water and temporary supplies to families rebuilding after flooding.",creator:"ReliefLink India",goal:300000,raised:142000,supporters:408,daysLeft:4,createdAt:new Date(now-8*day).toISOString(),recentDonations:104,recentActivity:99,verification:"Verified",status:"Active",image:img("1547683905-f686c3f6e0d7"),impact:"Emergency kits, water and temporary supplies.",fundUsage:{Kits:60,Water:25,Logistics:15},updates:[]},
 {id:108,title:"Indie Film: Stories From Our Town",category:"Creative",description:"Support an independent short film documenting everyday stories from a small Indian town.",creator:"Maya Arts Studio",goal:80000,raised:31500,supporters:51,daysLeft:31,createdAt:new Date(now-2*day).toISOString(),recentDonations:15,recentActivity:54,verification:"Pending",status:"Active",image:img("1485846234645-a62644f84728"),impact:"Production, travel and post-production.",fundUsage:{Production:60,Travel:20,PostProduction:20},updates:[]},
 {id:109,title:"Expired: Library Renovation Drive",category:"Education",description:"Renovation drive for a small community library.",creator:"ReadTogether",goal:70000,raised:38000,supporters:73,daysLeft:0,createdAt:new Date(now-70*day).toISOString(),recentDonations:3,recentActivity:10,verification:"Verified",status:"Expired",image:img("1507842217343-583bb7270b66"),impact:"Shelving, books and reading space.",fundUsage:{Books:60,Renovation:30,Operations:10},updates:[]}
 ];
 const users=[
 {id:1,name:"Demo User",email:"demo@fundflow.app",password:"demo123",role:"user",status:"Active",joined:"2026-01-10"},
 {id:2,name:"FundFlow Admin",email:"admin@fundflow.app",password:"admin123",role:"admin",status:"Active",joined:"2026-01-05"}
 ];
 const tx=[
 {transactionId:"FFTXN202609190001",campaignId:101,donorId:1,amount:1000,platformFee:20,totalAmount:1020,paymentMethod:"UPI",status:"SUCCESS",createdAt:"2026-09-19T18:00:00",updatedAt:"2026-09-19T18:01:00",receiptId:"FFREC202609190001"},
 {transactionId:"FFTXN202609190002",campaignId:102,donorId:1,amount:500,platformFee:10,totalAmount:510,paymentMethod:"Credit Card",status:"PENDING",createdAt:"2026-09-19T17:40:00",updatedAt:"2026-09-19T17:40:00"},
 {transactionId:"FFTXN202609190003",campaignId:103,donorId:1,amount:2000,platformFee:40,totalAmount:2040,paymentMethod:"UPI",status:"FAILED",createdAt:"2026-09-18T12:00:00",updatedAt:"2026-09-18T12:01:00",failureReason:"Payment declined"},
 {transactionId:"FFTXN202609190004",campaignId:101,donorId:1,amount:750,platformFee:15,totalAmount:765,paymentMethod:"Wallet",status:"REFUNDED",createdAt:"2026-09-15T12:00:00",updatedAt:"2026-09-16T12:00:00",refundId:"FFREF202609160001",receiptId:"FFREC202609150001"}
 ];
 saveToStorage(STORAGE_KEYS.campaigns,campaigns); saveToStorage(STORAGE_KEYS.users,users); saveToStorage(STORAGE_KEYS.transactions,tx); saveToStorage(STORAGE_KEYS.donations,tx.filter(t=>["SUCCESS","REFUNDED"].includes(t.status))); saveToStorage(STORAGE_KEYS.notifications,[{id:"N1",message:"Donation successful",type:"success",createdAt:new Date().toISOString(),read:false},{id:"N2",message:"🔥 Your campaign is trending",type:"info",createdAt:new Date().toISOString(),read:false}]); saveToStorage(STORAGE_KEYS.savedCampaigns,[101]); 
}
seedData();