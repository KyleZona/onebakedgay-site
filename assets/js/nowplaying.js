// Now Playing: asks Last.fm what Ky is listening to on Spotify and fills
// in the music window. Any element on the page can opt in with:
//   data-np="title"   song name
//   data-np="artist"  artist name
//   data-np="status"  "NOW" while playing, "LAST" when not
//   data-np="link"    a link that opens the song in Spotify
//
// The API key is read-only (it can see public listening history, nothing
// else), so it's fine for it to live in the page. The shared secret is
// never used here.

const LASTFM_USER = 'OneBakedGay';
const LASTFM_KEY = '95f1f7b8731ff7727c6b2e5c747cf492';
const NP_URL = 'https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks'
  + `&user=${LASTFM_USER}&api_key=${LASTFM_KEY}&format=json&limit=1`;

function npSet(field, fn) {
  document.querySelectorAll(`[data-np="${field}"]`).forEach(fn);
}

async function updateNowPlaying() {
  try {
    const res = await fetch(NP_URL);
    if (!res.ok) return;                 // keep whatever is showing
    const data = await res.json();
    const track = data.recenttracks && data.recenttracks.track && data.recenttracks.track[0];
    if (!track) return;

    const title = track.name;
    const artist = track.artist['#text'];
    const playing = track['@attr'] && track['@attr'].nowplaying === 'true';

    npSet('title', (el) => { el.textContent = '♪ ' + title; el.title = title; });
    npSet('artist', (el) => { el.textContent = artist; });
    npSet('status', (el) => {
      el.textContent = playing ? '▶ NOW' : 'LAST';
      el.classList.toggle('is-live', playing);
    });
    npSet('link', (el) => {
      el.href = 'https://open.spotify.com/search/' + encodeURIComponent(`${title} ${artist}`);
    });
  } catch (err) {
    // Offline or Last.fm is down: leave the window as it is
  }
}

updateNowPlaying();
setInterval(updateNowPlaying, 30 * 1000);
