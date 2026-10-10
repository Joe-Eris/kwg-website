(() => {
  const reveal = document.getElementById('leadershipReveal');
  const altImage = document.getElementById('leadershipAltImage');
  if (!reveal || !altImage) return;

  let frame = 0;
  let pendingX = 0;
  let pendingY = 0;

  const render = () => {
    const rect = reveal.getBoundingClientRect();
    const x = Math.max(0, Math.min(pendingX - rect.left, rect.width));
    const y = Math.max(0, Math.min(pendingY - rect.top, rect.height));
    reveal.style.setProperty('--reveal-x', `${x}px`);
    reveal.style.setProperty('--reveal-y', `${y}px`);
    frame = 0;
  };

  const move = (clientX, clientY) => {
    pendingX = clientX;
    pendingY = clientY;
    if (!frame) frame = requestAnimationFrame(render);
    reveal.classList.add('is-active');
  };

  const hide = () => reveal.classList.remove('is-active');

  reveal.addEventListener('pointerenter', e => {
    if (e.pointerType !== 'touch') move(e.clientX, e.clientY);
  });
  reveal.addEventListener('pointermove', e => {
    if (e.pointerType !== 'touch') move(e.clientX, e.clientY);
  });
  reveal.addEventListener('pointerleave', hide);

  reveal.addEventListener('touchstart', e => {
    const t = e.touches[0];
    if (t) move(t.clientX, t.clientY);
  }, { passive: true });

  reveal.addEventListener('touchmove', e => {
    const t = e.touches[0];
    if (t) move(t.clientX, t.clientY);
  }, { passive: true });

  reveal.addEventListener('touchend', () => setTimeout(hide, 220), { passive: true });
  reveal.addEventListener('touchcancel', hide, { passive: true });

  altImage.addEventListener('error', () => {
    altImage.hidden = true;
    const bubble = reveal.querySelector('.reveal-bubble');
    if (bubble) bubble.hidden = true;
  });
})();
