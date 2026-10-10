(() => {
  const trigger = document.getElementById('menuTrigger');
  const drawer = document.getElementById('navDrawer');
  const backdrop = document.getElementById('navBackdrop');

  if (!trigger || !drawer || !backdrop) return;

  const setOpen = (open) => {
    trigger.classList.toggle('is-active', open);
    drawer.classList.toggle('is-active', open);
    backdrop.classList.toggle('is-active', open);
    trigger.setAttribute('aria-expanded', String(open));
    drawer.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
  };

  trigger.setAttribute('aria-expanded', 'false');
  drawer.setAttribute('aria-hidden', 'true');

  trigger.addEventListener('click', () => {
    setOpen(trigger.getAttribute('aria-expanded') !== 'true');
  });

  backdrop.addEventListener('click', () => setOpen(false));

  drawer.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setOpen(false);
  });
})();
