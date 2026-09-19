function getCheckoutCampaign(){return getCampaign(new URLSearchParams(location.search).get("campaignId"));}
function calculateFee(amount,cover){return cover?Math.round(amount*.02):0;}
function saveTransaction(tx){const all=getTransactions();all.unshift(tx);saveToStorage(STORAGE_KEYS.transactions,all);return tx;}
