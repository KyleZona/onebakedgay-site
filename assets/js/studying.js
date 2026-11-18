// "Studying for": reads the cert roadmap on projects.html and shows the
// step marked step--next. The roadmap is the single source of truth: when
// you pass a cert, move step--next on projects.html and this updates too.
// The text already in the HTML is shown if anything goes wrong.

async function updateStudying() {
  const els = document.querySelectorAll('[data-studying]');
  if (!els.length) return;
  try {
    const res = await fetch('projects.html');
    if (!res.ok) return;
    const page = new DOMParser().parseFromString(await res.text(), 'text/html');
    const next = page.querySelector('.step--next .step__name');
    if (next) els.forEach((el) => { el.textContent = next.textContent.trim(); });
  } catch (err) {
    // keep the fallback text
  }
}

updateStudying();
