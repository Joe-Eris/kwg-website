(() => {
  const API=(window.KWGM_CONFIG&&window.KWGM_CONFIG.API_BASE)||'/api';
  const form=document.getElementById('contactForm'); const status=document.getElementById('contactStatus'); if(!form)return;
  form.addEventListener('submit',async e=>{e.preventDefault(); if(!form.reportValidity())return; const button=form.querySelector('[type="submit"]'); if(button)button.disabled=true; if(status)status.textContent='Sending…';
    try{const data=Object.fromEntries(new FormData(form).entries()); const res=await fetch(`${API}/public/contact`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)}); const body=await res.json().catch(()=>({})); if(!res.ok)throw new Error(body.error||'Unable to send'); form.reset(); if(status)status.textContent='Message sent successfully.';}
    catch(err){if(status)status.textContent=err.message||'Unable to send your message.';} finally{if(button)button.disabled=false;}
  });
})();