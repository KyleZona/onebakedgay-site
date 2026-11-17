// Side Projects page: tile filters + clock.
// Each tile has data-filter="certs" (etc). Each log entry has a matching
// data-src. Clicking a tile hides the entries that don't match; clicking
// the same tile again shows everything.

const tiles = document.querySelectorAll('.tile');
const entries = document.querySelectorAll('.entry');
const label = document.getElementById('filter-label');

tiles.forEach((tile) => {
  tile.addEventListener('click', () => {
    const alreadyOn = tile.getAttribute('aria-pressed') === 'true';
    const filter = alreadyOn ? null : tile.dataset.filter;

    // Only one tile can be pressed at a time
    tiles.forEach((t) => t.setAttribute('aria-pressed', String(t === tile && !alreadyOn)));

    entries.forEach((entry) => {
      entry.hidden = filter !== null && entry.dataset.src !== filter;
    });

    label.textContent = filter ? tile.querySelector('.tile__title').textContent.toUpperCase() : 'ALL';
  });
});

// Clock in Mountain time, 24-hour like a terminal
function tick() {
  const time = new Date().toLocaleTimeString('en-GB', {
    timeZone: 'America/Denver', hour: '2-digit', minute: '2-digit'
  });
  document.getElementById('clock').textContent = time + ' MT';
}
tick();
setInterval(tick, 30 * 1000);
