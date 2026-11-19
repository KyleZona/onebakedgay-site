// Builds the SCHEDULE day cards on the Home page and keeps the
// "next stream" line up to date. Edit SLOTS to change the schedule.

const SLOTS = [
  { start: 8 * 60,  end: 10 * 60, label: '8–10 AM', kind: 'am', name: 'MORNING' },
  { start: 20 * 60, end: 22 * 60, label: '8–10 PM', kind: 'pm', name: 'EVENING' }
];
const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

// The current time in Denver, whatever time zone the visitor is in
function denverNow() {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Denver' }));
}

function render() {
  const now = denverNow();
  const minutes = now.getHours() * 60 + now.getMinutes();
  const today = (now.getDay() + 6) % 7;   // JS weeks start Sunday; ours start Monday

  // 1. Status line: live now, or how long until the next stream
  const status = document.getElementById('stream-status');
  const live = SLOTS.find(s => minutes >= s.start && minutes < s.end);
  if (live) {
    status.textContent = '● LIVE NOW: ' + live.name + ' STREAM';
  } else {
    const next = SLOTS.find(s => minutes < s.start);
    const wait = (next ? next.start : 24 * 60 + SLOTS[0].start) - minutes;
    status.textContent = 'NEXT STREAM IN ' + Math.floor(wait / 60) + 'H ' + String(wait % 60).padStart(2, '0') + 'M';
  }

  // 2. Day cards
  const days = document.getElementById('days');
  days.innerHTML = DAYS.map((day, i) => {
    const classes = ['day'];
    if (i === today) classes.push('day--today');
    if (i < today) classes.push('day--past');
    const slots = SLOTS.map(s => `
      <div class="slot slot--${s.kind}">
        <span class="slot__time">${s.label}</span>
      </div>`).join('');
    return `
      <div class="${classes.join(' ')}">
        <div class="day__head"><span>${day}</span>${i === today ? '<span class="day__tag">TODAY</span>' : ''}</div>
        <div class="slots">${slots}</div>
      </div>`;
  }).join('');
}

render();
setInterval(render, 30 * 1000);   // refresh every 30 seconds
