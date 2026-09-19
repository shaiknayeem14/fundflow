const AUTH_CONFIG = { maxAttempts: 5, lockMinutes: 15, sessionHours: 8 };

function passwordPolicy(password){
  return typeof password === 'string' && password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password) && /[^A-Za-z0-9]/.test(password);
}
async function sha256(value){
  const data = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(hash)].map(b=>b.toString(16).padStart(2,'0')).join('');
}
function authState(){ return getFromStorage('ff_auth_state',{attempts:0,lockedUntil:0}); }
function setAuthState(v){ saveToStorage('ff_auth_state',v); }
function clearAuthState(){ saveToStorage('ff_auth_state',{attempts:0,lockedUntil:0}); }
function sessionUser(user, remember){
  const sessionToken = uid('SES');
  const expires = Date.now() + (remember ? 30*86400000 : AUTH_CONFIG.sessionHours*3600000);
  return {...user, sessionToken, sessionExpiresAt:expires, remember};
}
function getSafeUser(user){ const {password,...safe}=user; return safe; }

async function migratePasswords(){
  const users=getFromStorage(STORAGE_KEYS.users,[]); let changed=false;
  for(const user of users){
    if(user.password && !user.passwordHash){ user.passwordHash=await sha256(user.password); delete user.password; changed=true; }
  }
  if(changed) saveToStorage(STORAGE_KEYS.users,users);
}

function setupPasswordUI(){
  document.querySelectorAll('[data-password-strength]').forEach(input=>{
    input.addEventListener('input',()=>{
      const out=document.querySelector(input.dataset.passwordStrength);
      if(!out)return;
      const p=input.value; const checks=[p.length>=8,/[A-Z]/.test(p),/[a-z]/.test(p),/\d/.test(p),/[^A-Za-z0-9]/.test(p)];
      const score=checks.filter(Boolean).length;
      out.textContent=score===5?'Strong password':score>=3?'Medium password':'Use 8+ chars with upper/lowercase, number & symbol';
      out.className='password-strength '+(score===5?'strong':score>=3?'medium':'weak');
    });
  });
}

document.addEventListener('DOMContentLoaded', async ()=>{
  await migratePasswords(); setupPasswordUI();
  document.getElementById('loginForm')?.addEventListener('submit',async e=>{
    e.preventDefault();
    const state=authState();
    if(state.lockedUntil>Date.now()){ const mins=Math.ceil((state.lockedUntil-Date.now())/60000); showToast(`Too many attempts. Try again in ${mins} minute(s).`,'error'); return; }
    const email=document.getElementById('email').value.trim().toLowerCase();
    const pass=document.getElementById('password').value;
    const users=getFromStorage(STORAGE_KEYS.users,[]);
    const hash=await sha256(pass);
    const user=users.find(u=>u.email===email && u.passwordHash===hash && u.status!=='Suspended');
    if(!user){
      state.attempts=(state.attempts||0)+1;
      if(state.attempts>=AUTH_CONFIG.maxAttempts){ state.lockedUntil=Date.now()+AUTH_CONFIG.lockMinutes*60000; state.attempts=0; }
      setAuthState(state); showToast(state.lockedUntil?'Account access temporarily locked after repeated failed attempts.':'Invalid email or password.','error'); return;
    }
    clearAuthState();
    const session=sessionUser(getSafeUser(user),document.getElementById('remember')?.checked);
    setCurrentUser(session);
    showToast('Secure sign-in successful.','success');
    const next=new URLSearchParams(location.search).get('next'); const safeNext=next && /^(?!https?:|javascript:)/i.test(next) ? next : (user.role==='admin'?'admin.html':'dashboard.html'); setTimeout(()=>location.href=safeNext,350);
  });

  document.getElementById('registerForm')?.addEventListener('submit',async e=>{
    e.preventDefault();
    const name=document.getElementById('name').value.trim();
    const email=document.getElementById('email').value.trim().toLowerCase();
    const pass=document.getElementById('password').value;
    const confirm=document.getElementById('confirmPassword').value;
    if(name.length<2){showToast('Enter your full name.','error');return;}
    if(!passwordPolicy(pass)){showToast('Use 8+ characters with uppercase, lowercase, number and symbol.','error');return;}
    if(pass!==confirm){showToast('Passwords do not match.','error');return;}
    const users=getFromStorage(STORAGE_KEYS.users,[]);
    if(users.some(u=>u.email===email)){showToast('An account with this email already exists.','error');return;}
    const user={id:Date.now(),name,email,passwordHash:await sha256(pass),role:'user',status:'Active',joined:new Date().toISOString().slice(0,10)};
    users.push(user); saveToStorage(STORAGE_KEYS.users,users); setCurrentUser(sessionUser(getSafeUser(user),true));
    showNotification('Account created successfully.','success'); setTimeout(()=>location.href='dashboard.html',350);
  });
});
