// Playing / Last played: asks Lanyard what Discord sees Ky doing.
//   In a game     -> "Playing      ● Fortnite · 42m"
//   Not in a game -> "Last played  Fortnite · 3h ago"
//                    (saved by .github/workflows/last-played.yml)
//   Nothing known -> whatever text is already in the HTML
// Elements: data-game="label" (the bold word) and data-game="name".
// The Discord user ID is public information, so it's fine in the page.

const DISCORD_ID = '1416408179847462964';
const LANYARD_URL = `https://api.lanyard.rest/v1/users/${DISCORD_ID}`;

const nameEls = document.querySelectorAll('[data-game="name"]');
const labelEls = document.querySelectorAll('[data-game="label"]');
nameEls.forEach((el) => { el.dataset.fallback = el.textContent; });
labelEls.forEach((el) => { el.dataset.fallback = el.textContent; });

function minutesSince(ms) {
  const mins = Math.floor((Date.now() - ms) / 60000);
  if (mins < 1) return 'just started';
  if (mins < 60) return `${mins}m`;
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

function timeAgo(iso) {
  const mins = Math.floor((Date.now() - Date.parse(iso)) / 60000);
  if (Number.isNaN(mins)) return '';
  if (mins < 60) return 'just now';
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return days === 1 ? 'yesterday' : `${days} days ago`;
}

async function updateGame() {
  let label = null;
  let text = null;
  let live = false;
  try {
    const res = await fetch(LANYARD_URL);
    if (res.ok) {
      const { data } = await res.json();
      // Discord activity type 0 means "Playing a game"
      const game = data && data.activities && data.activities.find((a) => a.type === 0);
      const kv = (data && data.kv) || {};
      if (game) {
        const start = game.timestamps && game.timestamps.start;
        label = 'Playing';
        text = start ? `${game.name} · ${minutesSince(start)}` : game.name;
        live = true;
      } else if (kv.last_game) {
        const ago = kv.last_game_at ? timeAgo(kv.last_game_at) : '';
        label = 'Last played';
        text = ago ? `${kv.last_game} · ${ago}` : kv.last_game;
      }
    }
  } catch (err) {
    // Lanyard unreachable: fall through to the fallback text
  }
  labelEls.forEach((el) => { el.textContent = label || el.dataset.fallback; });
  nameEls.forEach((el) => {
    el.textContent = text || el.dataset.fallback;
    el.classList.toggle('is-live', live);
  });
}

updateGame();
setInterval(updateGame, 30 * 1000);
