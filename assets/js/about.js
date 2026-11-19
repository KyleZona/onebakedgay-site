// About page behaviour: open/close windows, cert pop-ups, taskbar, clock.
// The HTML marks buttons with data attributes so this file needs no IDs
// hard-coded per button:
//   data-open="win-id"    opens a window
//   data-close="win-id"   closes it
//   data-toggle="win-id"  opens or closes it (taskbar buttons)
//   data-cert             fills and opens the cert pop-up

const byId = (id) => document.getElementById(id);

function setOpen(id, open) {
  const win = byId(id);
  if (!win) return;
  win.hidden = !open;
  // Keep the taskbar button's pressed look in sync
  document.querySelectorAll(`[data-toggle="${id}"]`).forEach((btn) => {
    btn.setAttribute('aria-pressed', String(open));
  });
  // Move keyboard focus into a pop-up when it opens, for accessibility
  if (open && win.classList.contains('popup')) {
    const first = win.querySelector('input, button, a');
    if (first) first.focus();
  }
}

// One click listener for the whole page ("event delegation")
document.addEventListener('click', (event) => {
  const el = event.target.closest('[data-open], [data-close], [data-toggle], [data-cert]');
  if (!el) return;

  if (el.dataset.open) setOpen(el.dataset.open, true);
  if (el.dataset.close) setOpen(el.dataset.close, false);
  if (el.dataset.toggle) setOpen(el.dataset.toggle, byId(el.dataset.toggle).hidden);

  if (el.hasAttribute('data-cert')) {
    const earned = el.dataset.earned === 'true';
    byId('t-cert').textContent = el.querySelector('.icon__label').textContent.trim().replace(/ /g, '_') + '.cert';
    byId('cert-name').textContent = el.dataset.name;
    byId('cert-org').textContent = el.dataset.org;
    byId('cert-status').textContent = el.dataset.status;
    byId('cert-status').classList.toggle('cert__status--earned', earned);
    const badge = byId('cert-badge');
    badge.textContent = el.querySelector('.badge').textContent;
    badge.classList.toggle('badge--earned', earned);
    // Earned certs with an official logo show the logo instead of the badge
    const logo = el.dataset.logo;
    byId('cert-logo').hidden = !logo;
    badge.hidden = Boolean(logo);
    if (logo) {
      byId('cert-logo-img').src = logo;
      byId('cert-logo-img').alt = el.dataset.logoAlt || '';
    }
    setOpen('win-cert', true);
  }
});

// Escape closes any open pop-up
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  document.querySelectorAll('.popup:not([hidden])').forEach((win) => setOpen(win.id, false));
});

// Taskbar starts with the open windows shown as pressed
['win-notes', 'win-now', 'win-mail'].forEach((id) => setOpen(id, !byId(id).hidden));

// Clock in Mountain time
function tick() {
  byId('clock').textContent = new Date().toLocaleTimeString('en-US', {
    timeZone: 'America/Denver', hour: 'numeric', minute: '2-digit'
  });
}
tick();
setInterval(tick, 30 * 1000);
