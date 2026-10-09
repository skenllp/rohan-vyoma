/* ===== Central editable configuration ===== */
const CFG = {
  kicker: 'A Celebration of Love & Togetherness', groom: 'C Rohan Nair', bride: 'Vyoma Mehta',
  hero: [['26 January 2027', 'Wedding, Mumbai'], ['28–31 January 2027', 'Celebrations, Calicut']],
  host: 'M Pramila Nair', pre: 'has the pleasure of informing you of the marriage of her beloved grandson',
  aGroom: 'C Rohan Nair', aBride: 'Vyoma Mehta', aDate: 'Tuesday, 26 January 2027', aPlace: 'Mumbai',
  post: 'and seeks your prayers, best wishes and blessings for the couple.',
  music: 'assets/bansuri.mp3', volume: 0.35,
  // Google Maps searches until verified pins are available
  maps: { reception: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('K-Hills, Calicut'),
          stay: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Hotel Tiara, Calicut') },
  cal: { start: '20270130T180000', end: '20270130T220000', tz: 'Asia/Kolkata', venue: 'K-Hills, Calicut' },
  days: [
    { tab: 'Thu', date: '28 Jan', title: 'Thursday, 28 January 2027', items: [['PM', 'Guests arrive at Hotel Tiara, Calicut'], ['', 'Check-in as per rooming plan'], ['', 'Quiet dinner at the hotel']] },
    { tab: 'Fri', date: '29 Jan', title: 'Friday, 29 January 2027', items: [['06:30 – 07:30 AM', 'Breakfast at the hotel'], ['08:30 AM – 12:00 Noon', 'Heritage Visit to places of historical and cultural interest in Calicut'], ['12:00 – 12:45 PM', 'Return to hotel, freshen up and change'], ['01:00 – 02:30 PM', 'Traditional Kerala Feast'], ['03:00 – 08:00 PM', 'Executive Time'], ['08:00 – 10:00 PM', 'Dinner at the hotel']] },
    { tab: 'Sat', date: '30 Jan', title: 'Saturday, 30 January 2027', items: [['08:30 – 10:00 AM', 'Breakfast at the hotel'], ['10:00 AM – 12:30 PM', 'Shopping'], ['01:00 – 02:00 PM', 'Lunch at the hotel'], ['02:00 – 05:00 PM', 'Executive Time'], ['05:30 PM', 'Depart for K-Hills'], ['06:00 – 10:00 PM', 'Wedding Reception & Dinner'], ['11:00 PM', 'Return to hotel']] },
    { tab: 'Sun', date: '31 Jan', title: 'Sunday, 31 January 2027', items: [['Morning', 'Depart as convenient. Breakfast and lunch at Hotel']] },
  ],
  family: [['RAdm M D Suresh (Retd)', 'Preetha Chengalath', 'Kairali Suresh'], ['M D Ramesh', 'Reina Mary Ramesh', 'Neha Eva Ramesh', 'Nithya Elsa Ramesh'], ['C Rahul Nair', 'Niveditha Nair', 'Adithya Nair'], ['Rohit Chengalath', 'Radhika Rohit', 'Raghav Menon']],
};

const $ = (s) => document.querySelector(s);
const esc = (t) => t.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ----- fill text ----- */
document.querySelectorAll('[data-k]').forEach((el) => (el.textContent = CFG[el.dataset.k]));
$('#heroLines').innerHTML = CFG.hero.map(([d, e]) => `<p style="margin:.1em 0;line-height:1.25;font-size:clamp(14px,3.7cqw,18px)"><b class="head" style="letter-spacing:.12em">${d}</b> — ${e}</p>`).join('');
$('#family').innerHTML = CFG.family.map((g) => `<p style="margin:0;line-height:1.3;font-size:clamp(13px,3.3cqw,16px)">${g.map((n) => `<span style="display:block">${esc(n)}</span>`).join('')}</p>`).join('');
$('#dirBtn').href = $('#recBtn').href = CFG.maps.reception; $('#stayBtn').href = CFG.maps.stay;

/* ----- programme tabs ----- */
const tabs = $('#tabs'), tp = $('#tabpanel');
tabs.innerHTML = CFG.days.map((d, i) => `<button role="tab" id="tab${i}" class="tab head" aria-controls="tabpanel" style="letter-spacing:.06em;font-size:clamp(12px,3.2cqw,15px)">${d.tab}<br><span style="font-weight:600;text-transform:none;letter-spacing:0;color:var(--burg);opacity:.95">${d.date}</span></button>`).join('');
function showDay(i) {
  const d = CFG.days[i];
  tabs.querySelectorAll('.tab').forEach((b, k) => b.setAttribute('aria-selected', k === i));
  tp.setAttribute('aria-labelledby', 'tab' + i);
  tp.style.opacity = 0;
  setTimeout(() => {
    tp.innerHTML = `<div style="background:rgba(247,240,229,.92);padding:1.2em 1em;border-radius:4px;box-shadow:0 2px 8px rgba(113,51,59,.15)"><h3 class="head" style="margin:0 0 .5em;font-size:clamp(14px,3.8cqw,18px);letter-spacing:.1em;color:var(--burg)">${d.title}</h3><ul class="tl">${d.items.map(([t, e]) => `<li>${t ? `<span class="t">${t}</span>` : ''}${esc(e)}</li>`).join('')}</ul></div>`;
    tp.style.opacity = 1;
  }, reduce ? 0 : 200);
}
tp.style.transition = 'opacity .35s';
tabs.addEventListener('click', (e) => { 
  const b = e.target.closest('.tab'); 
  if (b) {
    // Haptic feedback for mobile devices
    if ('vibrate' in navigator) {
      navigator.vibrate(10); // Short vibration pulse
    }
    
    // Click animation - pulse effect
    b.classList.remove('click-animate');
    void b.offsetWidth; // Force reflow to restart animation
    b.classList.add('click-animate');
    setTimeout(() => b.classList.remove('click-animate'), 400);
    showDay([...tabs.children].indexOf(b));
  }
});
showDay(0);

/* ----- calendar (.ics) ----- */
$('#calBtn').addEventListener('click', () => {
  const c = CFG.cal;
  const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Rohan Vyoma//EN', 'BEGIN:VEVENT', 'UID:reception-20270130@rohan-vyoma',
    'DTSTAMP:' + new Date().toISOString().replace(/[-:]|\.\d{3}/g, ''), `DTSTART;TZID=${c.tz}:${c.start}`, `DTEND;TZID=${c.tz}:${c.end}`,
    'SUMMARY:Rohan & Vyoma – Wedding Reception', 'LOCATION:' + c.venue, 'DESCRIPTION:Wedding Reception & Dinner', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
  a.download = 'rohan-vyoma-reception.ics'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
});

/* ----- scroll reveals ----- */
const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
document.querySelectorAll('.reveal,.mono').forEach((el) => io.observe(el));

/* ----- music (only shown if the file really exists) ----- */
const audio = $('#audio'), mbtn = $('#music'); let musicOK = false, fade;
let muted = sessionStorage.getItem('rv-muted') === '1';
fetch(CFG.music, { method: 'HEAD' }).then((r) => { musicOK = r.ok && (r.headers.get('content-type') || '').startsWith('audio'); if (musicOK) { audio.src = CFG.music; mbtn.hidden = false; paint(); } }).catch(() => {});
function paint() { mbtn.setAttribute('aria-pressed', !muted); mbtn.setAttribute('aria-label', muted ? 'Unmute music' : 'Mute music'); $('#slash').hidden = !muted; }
function ramp(to) { clearInterval(fade); fade = setInterval(() => { const v = audio.volume; if (Math.abs(to - v) < .02) { audio.volume = to; clearInterval(fade); if (!to) audio.pause(); } else audio.volume = Math.min(1, Math.max(0, v + Math.sign(to - v) * .02)); }, 80); }
function startMusic() { if (!musicOK || muted) return; audio.volume = 0; audio.play().then(() => ramp(CFG.volume)).catch(() => {}); }
mbtn.addEventListener('click', () => { muted = !muted; sessionStorage.setItem('rv-muted', muted ? '1' : '0'); paint(); if (muted) ramp(0); else { audio.play().then(() => ramp(CFG.volume)).catch(() => {}); } });

/* ----- petals ----- */
function petals() {
  if (reduce) return; const box = $('#petals');
  for (let i = 0; i < 16; i++) { const s = document.createElement('span'); s.className = 'petal'; s.style.cssText = `left:${Math.random() * 100}%;animation-duration:${12 + Math.random() * 10}s;animation-delay:${-Math.random() * 18}s;--dx:${(Math.random() - .5) * 120}px`; box.appendChild(s); }
}

/* ----- intro ----- */
const intro = $('#intro'), vid = $('#vid'); let finished = false;
function finish() {
  if (finished) return; finished = true;
  document.body.classList.remove('lock'); document.body.classList.add('ready'); // hero is already underneath: no black flash
  intro.classList.add('out'); intro.setAttribute('aria-hidden', 'true'); petals();
  setTimeout(() => { intro.remove(); }, 1500);
}
$('#openBtn').addEventListener('click', () => {
  startMusic(); $('#openBox').remove();
  vid.currentTime = 0; vid.play().catch(finish);
});
vid.addEventListener('ended', finish); vid.addEventListener('error', () => { if ($('#openBox')) return; finish(); });
$('#skip').addEventListener('click', finish);
