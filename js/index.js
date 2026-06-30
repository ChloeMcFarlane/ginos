// NAVBAR FUNCTIONING

const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // HAMBURGER MENU

const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');
const mobileNavOverlay = document.getElementById('mobile-nav-overlay');

function closeMobileNav() {
  hamburger.classList.remove('open');
  mobileNav.classList.remove('open');
  mobileNavOverlay.classList.remove('open');
}

hamburger.addEventListener('click', () => {
  const isOpen = mobileNav.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  mobileNavOverlay.classList.toggle('open', isOpen);
});

mobileNavOverlay.addEventListener('click', closeMobileNav);

document.querySelectorAll('.mobile-nav a').forEach(link => {
  link.addEventListener('click', closeMobileNav);
});

//SCROLL ANIMATION/ INTERSECTION OBSERVER

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      } else {
        entry.target.classList.remove('revealed');
      }
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('.reveal-word').forEach(word => observer.observe(word));

// BACK TO TOP BUTTON

const backToTopBtn = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    backToTopBtn.classList.add('show');
  } else {
    backToTopBtn.classList.remove('show');
  }
});

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── OPEN / CLOSED BADGE ──────────────────────────────────────────
// Hours: Monday–Saturday, 11:00 am – 11:00 pm (NYC local time)
function updateHoursStatus() {
  const badge = document.getElementById('hours-status-badge');
  if (!badge) return;

  // Use New York time regardless of the visitor's timezone
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));
  const day  = now.getDay();   // 0 = Sun, 1 = Mon … 6 = Sat
  const hour = now.getHours();
  const min  = now.getMinutes();

  const isWeekday  = day >= 1 && day <= 6;          // Mon–Sat
  const afterOpen  = hour > 11 || (hour === 11 && min >= 0);
  const beforeClose = hour < 23;                     // before 11 pm

  const isOpen = isWeekday && afterOpen && beforeClose;

  badge.className = `status-badge ${isOpen ? 'open' : 'closed'}`;
  badge.innerHTML = `<span class="status-dot"></span>${isOpen ? 'Open Now' : 'Closed'}`;
}

updateHoursStatus();
// Refresh every minute so it flips automatically at open/close time
setInterval(updateHoursStatus, 60_000);