const links = Array.from(document.querySelectorAll('.nav-links a'));
const sections = Array.from(document.querySelectorAll('main section[id]'));

const setActiveLink = () => {
  const scrollPosition = window.scrollY + 140;

  sections.forEach((section) => {
    const id = section.getAttribute('id');
    const link = links.find((item) => item.getAttribute('href') === `#${id}`);

    if (!link) return;

    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;

    if (scrollPosition >= top && scrollPosition < bottom) {
      links.forEach((item) => item.classList.remove('active'));
      link.classList.add('active');
    }
  });
};

window.addEventListener('scroll', setActiveLink);
window.addEventListener('load', setActiveLink);

// Certifications carousel
const certTrack = document.querySelector('.cert-track');
const certPrev = document.querySelector('.cert-prev');
const certNext = document.querySelector('.cert-next');
const certViewport = document.querySelector('.cert-viewport');
const certHeading = document.querySelector('#certifications .section-heading');
if (certTrack && certPrev && certNext && certViewport && certHeading) {
  const certCards = Array.from(certTrack.querySelectorAll('.cert-card'));
  const cardCount = certCards.length;
  const viewportWidth = () => certViewport.getBoundingClientRect().width;

  const updateCertIndicator = () => {
    const currentIndex = Math.round(certTrack.scrollLeft / viewportWidth());
    const safeIndex = Math.min(Math.max(currentIndex, 0), cardCount - 1);
    certHeading.dataset.counter = `${String(safeIndex + 1).padStart(2, '0')} / ${String(cardCount).padStart(2, '0')}`;
    certPrev.disabled = safeIndex === 0;
    certNext.disabled = safeIndex === cardCount - 1;
  };

  const scrollByCard = (direction) => {
    certTrack.scrollBy({ left: viewportWidth() * direction, behavior: 'smooth' });
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
