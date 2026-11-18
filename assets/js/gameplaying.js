// Playing: asks Lanyard what game Discord sees Ky playing (Steam, Epic,
// anything Discord detects on the PC) and fills in elements marked
//   data-game="name"   e.g. "Fortnite · 42m"
// When no game is running, it shows the text already in the HTML
// (the fallback), so edit that text in index.html / about.html to change it.
//
// The Discord user ID is public information, so it's fine in the page.

const DISCORD_ID = '1416408179847462964';
const LANYARD_URL = `https://api.lanyard.rest/v1/users/${DISCORD_ID}`;

const gameEls = document.querySelectorAll('[data-game="name"]');
gameEls.forEach((el) => { el.dataset.fallback = el.textContent; });

function minutesSince(ms) {
  const mins = Math.floor((Date.now() - ms) / 60000);
  if (mins < 1) return 'just started';
  if (mins < 60) return `${mins}m`;
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

async function updateGame() {
  let text = null;
  try {
    const res = await fetch(LANYARD_URL);
    if (res.ok) {
      const { data } = await res.json();
      // Discord activity type 0 means "Playing a game"
      const game = data && data.activities && data.activities.find((a) => a.type === 0);
      if (game) {
        const start = game.timestamps && game.timestamps.start;
        text = start ? `${game.name} · ${minutesSince(start)}` : game.name;
      }
    }
  } catch (err) {
    // Lanyard unreachable: fall through to the fallback text
  }
  gameEls.forEach((el) => {
    el.textContent = text || el.dataset.fallback;
    el.classList.toggle('is-live', Boolean(text));
  });
}

updateGame();
setInterval(updateGame, 30 * 1000);
