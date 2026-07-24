const links = Array.from(document.querySelectorAll('.nav-links a'));
const sections = Array.from(document.querySelectorAll('main section[id]'));
const header = Array.from(document.querySelectorAll('main header[id]'));
const topbar = document.querySelector('.topbar');
const menuToggle = document.querySelector('.menu-toggle');
const mobileQuery = window.matchMedia('(max-width: 1250px)');

const setActiveLink = () => {
  const offset = (topbar?.offsetHeight || 100) + 60;
  const scrollPosition = window.scrollY + offset;

  links.forEach((item) => item.classList.remove('active'));

  if (!sections.length) return;

  if (scrollPosition < sections[0].offsetTop) {
    return;
  }

  sections.forEach((section) => {
    const id = section.getAttribute('id');
    const link = links.find((item) => item.getAttribute('href') === `#${id}`);

    if (!link) return;

    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;

    if (scrollPosition >= top && scrollPosition < bottom) {
      link.classList.add('active');
    }
  });
};

const setMobileNavState = () => {
  if (!topbar || !menuToggle) return;

  if (!mobileQuery.matches) {
    topbar.classList.remove('mobile-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    return;
  }

  topbar.classList.remove('mobile-open');
  menuToggle.setAttribute('aria-expanded', 'false');
};

if (menuToggle && topbar) {
  menuToggle.addEventListener('click', () => {
    if (!mobileQuery.matches) return;

    const isOpen = topbar.classList.toggle('mobile-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  links.forEach((link) => {
    link.addEventListener('click', () => {
      if (!mobileQuery.matches) return;

      topbar.classList.remove('mobile-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

window.addEventListener('scroll', setActiveLink);
window.addEventListener('load', setActiveLink);
window.addEventListener('resize', () => {
  setMobileNavState();
  setActiveLink();
});
window.addEventListener('load', () => {
  setMobileNavState();
  setActiveLink();
});

if (typeof mobileQuery.addEventListener === 'function') {
  mobileQuery.addEventListener('change', setMobileNavState);
} else if (typeof mobileQuery.addListener === 'function') {
  mobileQuery.addListener(setMobileNavState);
}

// FAQ accordion
const faqButtons = Array.from(document.querySelectorAll('.faq-toggle'));
faqButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const item = button.closest('.faq-item');
    const answer = item?.querySelector('.faq-answer');
    const isOpen = item?.classList.contains('active');

    faqButtons.forEach((otherButton) => {
      const otherItem = otherButton.closest('.faq-item');
      const otherAnswer = otherItem?.querySelector('.faq-answer');
      otherItem?.classList.remove('active');
      otherButton.setAttribute('aria-expanded', 'false');
      if (otherAnswer) {
        otherAnswer.style.maxHeight = '0px';
        otherAnswer.style.opacity = '0';
      }
    });

    if (!isOpen && item && answer) {
      item.classList.add('active');
      button.setAttribute('aria-expanded', 'true');
      answer.style.maxHeight = `${answer.scrollHeight}px`;
      answer.style.opacity = '1';
    }
  });
});

// Certifications carousel
const certTrack = document.querySelector('.cert-track');
const certPrev = document.querySelector('.cert-prev');
const certNext = document.querySelector('.cert-next');
const certViewport = document.querySelector('.cert-viewport');
const certHeading = document.querySelector('#certifications .section-heading');
const certCounter = document.querySelector('.cert-counter');
const certCounterCurrent = certCounter?.querySelector('.cert-counter-current');
const certCounterTotal = certCounter?.querySelector('.cert-counter-total');
if (certTrack && certPrev && certNext && certViewport && certHeading) {
  const certCards = Array.from(certTrack.querySelectorAll('.cert-card'));
  const cardCount = certCards.length;
  const viewportWidth = () => certViewport.getBoundingClientRect().width;

  const updateCertIndicator = () => {
    const currentIndex = Math.min(
      Math.max(Math.round(certTrack.scrollLeft / Math.max(certCards[0]?.getBoundingClientRect().width || 1, 1)), 0),
      cardCount - 1
    );
    const safeIndex = Math.min(Math.max(currentIndex, 0), cardCount - 1);
    const currentValue = String(safeIndex + 1).padStart(2, '0');
    const totalValue = String(cardCount).padStart(2, '0');

    certHeading.dataset.counter = `${currentValue} / ${totalValue}`;
    if (certCounterCurrent) {
      certCounterCurrent.textContent = currentValue;
    }
    if (certCounterTotal) {
      certCounterTotal.textContent = totalValue;
    }
    certPrev.disabled = cardCount <= 1;
    certNext.disabled = cardCount <= 1;
  };

  const scrollByCard = (direction) => {
    if (!certCards.length) return;

    const currentIndex = Math.min(
      Math.max(Math.round(certTrack.scrollLeft / Math.max(certCards[0].getBoundingClientRect().width, 1)), 0),
      cardCount - 1
    );
    const targetIndex = (currentIndex + direction + cardCount) % cardCount;
    const targetCard = certCards[targetIndex];

    certTrack.scrollTo({
      left: targetCard.offsetLeft,
      behavior: 'smooth'
    });
  };

  certPrev.addEventListener('click', () => scrollByCard(-1));
  certNext.addEventListener('click', () => scrollByCard(1));
  certTrack.addEventListener('scroll', () => requestAnimationFrame(updateCertIndicator));
  window.addEventListener('resize', () => requestAnimationFrame(updateCertIndicator));
  window.addEventListener('load', updateCertIndicator);

  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;

  certTrack.addEventListener('mousedown', (e) => {
    isDown = true;
    certTrack.classList.add('dragging');
    startX = e.pageX - certTrack.offsetLeft;
    scrollLeft = certTrack.scrollLeft;
  });

  window.addEventListener('mouseup', () => {
    isDown = false;
    certTrack.classList.remove('dragging');
  });

  certTrack.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - certTrack.offsetLeft;
    const walk = x - startX;
    certTrack.scrollLeft = scrollLeft - walk;
  });
}
