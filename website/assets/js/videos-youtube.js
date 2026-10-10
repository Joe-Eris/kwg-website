(() => {
  const API = (window.KWGM_CONFIG && window.KWGM_CONFIG.API_BASE) || '/api';
  const grid = document.getElementById('videoGrid');
  const status = document.getElementById('videoStatus');
  const searchInput = document.getElementById('videoSearchInput');
  const searchBtn = document.getElementById('videoSearchBtn');
  const tabs = Array.from(document.querySelectorAll('.library-tab'));
  const modal = document.getElementById('playerModal');
  const modalTitle = document.getElementById('playerTitle');
  const playerFrame = document.getElementById('playerFrame');
  const closeBtn = document.getElementById('playerCloseBtn');
  const SAVED_KEY = 'kwgm_saved_media_v2';
  let items = [];
  let view = 'all';
  let query = '';

  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const saved = () => { try { return JSON.parse(localStorage.getItem(SAVED_KEY) || '[]'); } catch { return []; } };
  const saveList = list => localStorage.setItem(SAVED_KEY, JSON.stringify(list));
  const isSaved = id => saved().some(x => x.id === id);
  const toggleSaved = item => { const list=saved(); const i=list.findIndex(x=>x.id===item.id); i>=0?list.splice(i,1):list.unshift(item); saveList(list); render(); };

  async function load() {
    status.textContent = 'Loading messages…';
    try {
      const res = await fetch(`${API}/public/media?limit=100`);
      if (!res.ok) throw new Error('Media API unavailable');
      const data = await res.json();
      items = data.items || [];
      render();
    } catch (e) {
      console.error(e); status.textContent = 'Unable to load the message library.';
    }
  }

  function filtered() {
    let src = view === 'saved' ? saved() : items;
    const q = query.trim().toLowerCase();
    return q ? src.filter(x => `${x.title} ${x.description||''} ${x.speaker||''}`.toLowerCase().includes(q)) : src;
  }

  function openPlayer(item) {
    modalTitle.textContent = item.title;
    if (item.youtube_id) {
      playerFrame.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(item.youtube_id)}?autoplay=1" title="${esc(item.title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
    } else if (item.stream_url || item.download_url) {
      const src = item.stream_url || item.download_url;
      playerFrame.innerHTML = `<video src="${esc(src)}" controls autoplay playsinline style="width:100%;height:100%;background:#000"></video>`;
    } else {
      playerFrame.innerHTML = '<p style="padding:30px">This message does not have a playable source yet.</p>';
    }
    modal.hidden=false; modal.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; closeBtn.focus();
  }
  function closePlayer(){modal.hidden=true;modal.setAttribute('aria-hidden','true');playerFrame.innerHTML='';document.body.style.overflow='';}
  closeBtn?.addEventListener('click', closePlayer); modal?.addEventListener('click', e=>{if(e.target===modal)closePlayer();}); document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!modal.hidden)closePlayer();});

  async function downloadOffline(item, btn) {
    if (!item.download_url) return;
    btn.disabled = true; btn.textContent = 'Saving…';
    try {
      if ('caches' in window) {
        const cache = await caches.open('kwgm-offline-media-v1');
        const response = await fetch(item.download_url);
        if (!response.ok) throw new Error('Download failed');
        await cache.put(item.download_url, response.clone());
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href=url; a.download=(item.slug||item.title||'message')+'.mp4'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(url),1000);
      } else {
        window.location.href = item.download_url;
      }
      btn.textContent='Downloaded ✓';
    } catch(e) { console.error(e); btn.textContent='Download failed'; }
    finally { setTimeout(()=>{btn.disabled=false; if(btn.textContent==='Download failed')btn.innerHTML='<i class="fa-solid fa-download"></i> Download';},1600); }
  }

  function card(item){
    const article=document.createElement('article'); article.className='glass-panel video-card';
    const thumb=item.thumbnail_url || 'assets/images/hero-worship.webp';
    const sv=isSaved(item.id);
    article.innerHTML=`<div class="video-thumb"><img src="${esc(thumb)}" alt="" loading="lazy" decoding="async"><button class="video-play-btn" type="button" aria-label="Play ${esc(item.title)}"><i class="fa-solid fa-play"></i></button></div><div class="video-card-copy"><h2>${esc(item.title)}</h2><p>${esc(item.description||'Watch this ministry message.')}</p><div class="video-card-actions"><button class="video-mini-btn watch-btn" type="button"><i class="fa-solid fa-circle-play"></i> Watch</button><button class="video-mini-btn save-btn ${sv?'saved':''}" type="button"><i class="fa-${sv?'solid':'regular'} fa-bookmark"></i> ${sv?'Saved':'Save'}</button>${item.download_url?'<button class="video-mini-btn download-btn" type="button"><i class="fa-solid fa-download"></i> Download</button>':''}<button class="video-mini-btn share-btn" type="button"><i class="fa-solid fa-share-nodes"></i> Share</button></div></div>`;
    article.querySelectorAll('.watch-btn,.video-play-btn').forEach(b=>b.addEventListener('click',()=>openPlayer(item)));
    article.querySelector('.save-btn').addEventListener('click',()=>toggleSaved(item));
    article.querySelector('.download-btn')?.addEventListener('click',e=>downloadOffline(item,e.currentTarget));
    article.querySelector('.share-btn').addEventListener('click',async()=>{const url=item.youtube_id?`https://youtu.be/${item.youtube_id}`:(item.stream_url||item.download_url||location.href); if(navigator.share){try{await navigator.share({title:item.title,url});}catch{}}else{await navigator.clipboard.writeText(url); alert('Link copied.');}});
    return article;
  }
  function render(){const list=filtered();grid.innerHTML='';status.textContent=`${list.length} message${list.length===1?'':'s'}`;if(!list.length){status.textContent=view==='saved'?'No saved messages yet.':'No messages found.';return;} const f=document.createDocumentFragment();list.forEach(x=>f.appendChild(card(x)));grid.appendChild(f);}
  searchBtn?.addEventListener('click',()=>{query=searchInput.value;render();}); searchInput?.addEventListener('input',()=>{query=searchInput.value;render();});
  tabs.forEach(t=>t.addEventListener('click',()=>{tabs.forEach(x=>x.classList.remove('is-active'));t.classList.add('is-active');view=t.dataset.view;render();}));
  load();
})();