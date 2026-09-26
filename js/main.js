const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');

if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(open));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
    });
  });
}

const projectTrack = document.querySelector('#project-track');
const projectSlides = [...document.querySelectorAll('.project-slide')];
const projectTabs = [...document.querySelectorAll('.project-tab')];
const projectCurrent = document.querySelector('#project-current');
const projectPrev = document.querySelector('[data-project-prev]');
const projectNext = document.querySelector('[data-project-next]');

let activeProject = 0;

function updateProjectUI(index) {
  activeProject = Math.max(0, Math.min(index, projectSlides.length - 1));
  if (projectCurrent) projectCurrent.textContent = String(activeProject + 1).padStart(2, '0');
  projectTabs.forEach((tab, i) => tab.classList.toggle('is-active', i === activeProject));
}

function goToProject(index) {
  if (!projectTrack || !projectSlides.length) return;
  const safeIndex = (index + projectSlides.length) % projectSlides.length;
  const slide = projectSlides[safeIndex];
  projectTrack.scrollTo({ left: slide.offsetLeft, behavior: 'smooth' });
  updateProjectUI(safeIndex);
}

projectTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => goToProject(index));
});

projectPrev?.addEventListener('click', () => goToProject(activeProject - 1));
projectNext?.addEventListener('click', () => goToProject(activeProject + 1));

if (projectTrack) {
  let ticking = false;
  projectTrack.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const width = projectTrack.clientWidth || 1;
      const index = Math.round(projectTrack.scrollLeft / width);
      updateProjectUI(index);
      ticking = false;
    });
  });

  projectTrack.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') goToProject(activeProject + 1);
    if (event.key === 'ArrowLeft') goToProject(activeProject - 1);
  });
}

updateProjectUI(0);
