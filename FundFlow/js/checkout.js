document.addEventListener("DOMContentLoaded",()=>{
 const user=getCurrentUser();
 if(!user){ location.href=`login.html?next=${encodeURIComponent(location.href)}`; return; }
 const c=getCheckoutCampaign(); if(!c){location.href="campaigns.html";return}
 const info=document.getElementById("checkoutCampaign");
 info.innerHTML=`<div class="checkout-campaign"><div class="checkout-thumb" style="background-image:url('${c.image}')"></div><div><span class="category-pill">${escapeHtml(c.category)}</span><h3>${escapeHtml(c.title)}</h3><small>by ${escapeHtml(c.creator)}</small></div></div>`;
 const amount=document.getElementById("donationAmount"),cover=document.getElementById("coverFee"),summary=document.getElementById("summary"),methodInputs=[...document.querySelectorAll('input[name="method"]')];
 const detailBox=document.getElementById('paymentDetails');
 function render(){const a=Math.max(0,Number(amount.value)||0),fee=calculateFee(a,cover.checked),total=a+fee;summary.innerHTML=`<div class="summary-line"><span>Donation</span><b>${formatINR(a)}</b></div><div class="summary-line"><span>Platform fee</span><b>${formatINR(fee)}</b></div><div class="summary-total"><span>Total</span><strong>${formatINR(total)}</strong></div><small class="muted">Demo gateway: no real money is charged.</small>`; renderPaymentFields();}
 function renderPaymentFields(){
   const method=document.querySelector('input[name="method"]:checked')?.value;
   if(method==='UPI') detailBox.innerHTML='<label>Demo UPI ID<input id="upiId" placeholder="name@upi" autocomplete="off"></label><small class="field-help">Use any valid-looking ID such as demo@upi.</small>';
   else if(method==='Credit Card' || method==='Debit Card') detailBox.innerHTML='<div class="two-col"><label>Card number<input id="cardNumber" inputmode="numeric" maxlength="19" placeholder="4111 1111 1111 1111" autocomplete="off"></label><label>Name on card<input id="cardName" placeholder="Demo User" autocomplete="off"></label></div><div class="two-col"><label>Expiry<input id="expiry" placeholder="MM/YY" maxlength="5" inputmode="numeric" autocomplete="off"></label><label>CVV<input id="cvv" type="password" maxlength="3" inputmode="numeric" placeholder="123" autocomplete="off"></label></div><small class="field-help">Demo only. Never enter a real card number or CVV.</small>';
   else if(method==='Net Banking') detailBox.innerHTML='<label>Select demo bank<select id="bank"><option>State Bank of India</option><option>HDFC Bank</option><option>ICICI Bank</option><option>Axis Bank</option></select></label><small class="field-help">No bank credentials are collected.</small>';
   else detailBox.innerHTML='<label>Demo wallet<select id="wallet"><option>FundWallet</option><option>DemoPay</option><option>CampusWallet</option></select></label><small class="field-help">Wallet authorization is simulated.</small>';
 }
 function validDetails(method){
   if(method==='UPI') return /^[\w.-]{2,}@[\w.-]{2,}$/.test(document.getElementById('upiId')?.value.trim()||'');
   if(method==='Credit Card'||method==='Debit Card'){const n=(document.getElementById('cardNumber')?.value||'').replace(/\s/g,''); return /^\d{16}$/.test(n)&&/^\d{2}\/\d{2}$/.test(document.getElementById('expiry')?.value||'')&&/^\d{3}$/.test(document.getElementById('cvv')?.value||'')&&document.getElementById('cardName')?.value.trim().length>=2;}
   return true;
 }
 methodInputs.forEach(x=>x.addEventListener('change',render)); amount.addEventListener('input',render); cover.addEventListener('change',render); render();
 document.getElementById("checkoutForm").addEventListener("submit",e=>{e.preventDefault();
   const a=Number(amount.value); if(!a||a<100){showToast("Minimum demo contribution is ₹100.","error");return}
   if(c.status==="Completed"||c.daysLeft<=0){showToast("This campaign is no longer accepting contributions.","error");return}
   const method=document.querySelector('input[name="method"]:checked')?.value; if(!validDetails(method)){showToast('Enter valid demo payment details.','error');return}
   const fee=calculateFee(a,cover.checked),tx={transactionId:generateTransactionId(),campaignId:c.id,donorId:user.id,donorName:user.name,amount:a,platformFee:fee,totalAmount:a+fee,paymentMethod:method,status:"INITIATED",createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),anonymous:document.getElementById("anonymous").checked,finalized:false};
   saveTransaction(tx); localStorage.setItem("ff_pending_tx",tx.transactionId); location.href=`payment-status.html?tx=${tx.transactionId}`;
 });
});
