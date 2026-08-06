const TELEGRAM_USERNAME = 'monsterrrxx';
const EMAIL = 'artdev.mds@gmail.com';

document.querySelectorAll('[data-telegram-link]').forEach((el) => {
  el.href = `https://t.me/${TELEGRAM_USERNAME}`;
});
document.querySelectorAll('[data-telegram-text]').forEach((el) => {
  el.textContent = `@${TELEGRAM_USERNAME}`;
});
document.querySelectorAll('[data-email-link]').forEach((el) => {
  el.href = `mailto:${EMAIL}`;
});
document.querySelectorAll('[data-email-text]').forEach((el) => {
  el.textContent = EMAIL;
});

const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const iconOpen = document.getElementById('icon-open');
const iconClose = document.getElementById('icon-close');

menuToggle.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('flex');
  mobileMenu.classList.toggle('hidden');
  iconOpen.classList.toggle('hidden');
  iconClose.classList.toggle('hidden');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

mobileMenu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
    mobileMenu.classList.remove('flex');
    iconOpen.classList.remove('hidden');
    iconClose.classList.add('hidden');
  });
});

const headerBgMobile = document.getElementById('header-bg-mobile');
const headerBgDesktop = document.getElementById('header-bg-desktop');

const updateHeaderBg = () => {
  const scrolled = window.scrollY > 0;
  headerBgMobile.classList.toggle('opacity-100', scrolled);
  headerBgMobile.classList.toggle('opacity-0', !scrolled);
  headerBgDesktop.classList.toggle('opacity-100', scrolled);
  headerBgDesktop.classList.toggle('opacity-0', !scrolled);
};

window.addEventListener('scroll', updateHeaderBg, { passive: true });
updateHeaderBg();

const contactForm = document.getElementById('contact-form');
const contactSubmit = document.getElementById('contact-submit');
const contactStatus = document.getElementById('contact-status');
const consentCheckbox = document.getElementById('consent-checkbox');
const contactFormLoadedAt = Date.now();
const MIN_SUBMIT_DELAY_MS = 1500;

consentCheckbox.addEventListener('change', () => {
  contactSubmit.disabled = !consentCheckbox.checked;
});

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!consentCheckbox.checked) return;
  if (Date.now() - contactFormLoadedAt < MIN_SUBMIT_DELAY_MS) return;

  const formData = new FormData(contactForm);

  if (formData.get('website')) return;

  const payload = {
    name: formData.get('name'),
    contact: formData.get('contact'),
    message: formData.get('message'),
    website: formData.get('website'),
    consent: consentCheckbox.checked,
  };

  contactSubmit.disabled = true;
  contactSubmit.textContent = 'Отправляю…';
  contactStatus.textContent = '';
  contactStatus.classList.remove('text-primary', 'text-primary-dark');

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error('request failed');

    contactForm.reset();
    contactStatus.textContent = 'Спасибо! Заявка отправлена — отвечу в Telegram.';
    contactStatus.classList.add('text-primary');
  } catch (err) {
    contactStatus.textContent = `Не получилось отправить форму. Напишите напрямую в Telegram: @${TELEGRAM_USERNAME}`;
    contactStatus.classList.add('text-primary-dark');
  } finally {
    contactSubmit.disabled = !consentCheckbox.checked;
    contactSubmit.textContent = 'Отправить заявку';
  }
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));
