const menuButton = document.querySelector(".menu-toggle");
const navigationLinks = document.querySelector(".navigation-links");

const closeMenu = () => {
  if (!menuButton || !navigationLinks) return;
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Abrir menú");
  navigationLinks.classList.remove("is-open");
};

if (menuButton && navigationLinks) {
  menuButton.addEventListener("click", () => {
    const isExpanded = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isExpanded));
    menuButton.setAttribute("aria-label", isExpanded ? "Abrir menú" : "Cerrar menú");
    navigationLinks.classList.toggle("is-open", !isExpanded);
  });

  navigationLinks.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      closeMenu();
    }
  });

  document.addEventListener("click", (event) => {
    if (
      menuButton.getAttribute("aria-expanded") === "true" &&
      event.target instanceof Node &&
      !menuButton.contains(event.target) &&
      !navigationLinks.contains(event.target)
    ) {
      closeMenu();
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

const navigation = document.querySelector(".navigation");

if (navigation) {
  let animationFrame = 0;

  const updateReadingProgress = () => {
    animationFrame = 0;
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress =
      scrollableHeight > 0 ? Math.min(window.scrollY / scrollableHeight, 1) : 0;
    navigation.style.setProperty("--scroll-progress", String(progress));
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(updateReadingProgress);
    },
    { passive: true },
  );
  window.addEventListener("resize", updateReadingProgress);
  updateReadingProgress();
}

const sectionLinks = [...document.querySelectorAll(".navigation-links a[href^='#']")];
const sections = sectionLinks
  .map((link) => {
    const id = link.getAttribute("href")?.slice(1);
    return id ? { link, section: document.getElementById(id) } : null;
  })
  .filter((entry) => entry?.section);

if ("IntersectionObserver" in window && sections.length) {
  const navigationObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const activeSection = sections.find(({ section }) => section === entry.target);

        for (const { link } of sections) link.removeAttribute("aria-current");
        activeSection?.link.setAttribute("aria-current", "location");
      }
    },
    { rootMargin: "-30% 0px -55% 0px" },
  );

  for (const { section } of sections) {
    if (section) navigationObserver.observe(section);
  }
}

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const backgroundVideo = document.querySelector(".portfolio-home .page-background-video");
const cursorGlow = document.querySelector(".portfolio-home .cursor-glow");

if (prefersReducedMotion && backgroundVideo instanceof HTMLVideoElement) {
  backgroundVideo.pause();
}

if (
  cursorGlow instanceof HTMLElement &&
  window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
  !prefersReducedMotion
) {
  let cursorFrame = 0;
  let cursorPosition = { x: 0, y: 0 };

  document.addEventListener("pointermove", (event) => {
    cursorPosition = { x: event.clientX, y: event.clientY };
    cursorGlow.classList.add("is-visible");
    if (cursorFrame) return;

    cursorFrame = window.requestAnimationFrame(() => {
      cursorFrame = 0;
      cursorGlow.style.setProperty("--cursor-x", `${cursorPosition.x}px`);
      cursorGlow.style.setProperty("--cursor-y", `${cursorPosition.y}px`);
    });
  });

  document.addEventListener("pointerleave", () => {
    cursorGlow.classList.remove("is-visible");
  });
}

const hero = document.querySelector(".portfolio-home .hero");
const heroArt = document.querySelector(".portfolio-home .hero-art");

if (
  hero instanceof HTMLElement &&
  heroArt instanceof HTMLElement &&
  window.matchMedia("(pointer: fine)").matches &&
  !prefersReducedMotion
) {
  let pointerFrame = 0;
  let pointerPosition = { x: 0, y: 0 };

  hero.addEventListener("pointermove", (event) => {
    const bounds = hero.getBoundingClientRect();
    pointerPosition = {
      x: ((event.clientX - bounds.left) / bounds.width - 0.5) * 10,
      y: ((event.clientY - bounds.top) / bounds.height - 0.5) * 8,
    };

    if (pointerFrame) return;
    pointerFrame = window.requestAnimationFrame(() => {
      pointerFrame = 0;
      heroArt.style.setProperty("--parallax-x", `${pointerPosition.x}px`);
      heroArt.style.setProperty("--parallax-y", `${pointerPosition.y}px`);
    });
  });

  hero.addEventListener("pointerleave", () => {
    heroArt.style.setProperty("--parallax-x", "0px");
    heroArt.style.setProperty("--parallax-y", "0px");
  });
}

const revealTargets = document.querySelectorAll(
  ".about-content, .stats-grid, .section-heading, .project-card, .domain-card, .detail-overview, .detail-fact, .detail-preview, .detail-tags",
);

if ("IntersectionObserver" in window && !prefersReducedMotion && revealTargets.length) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -30px 0px" },
  );

  document.body.classList.add("has-reveal");
  for (const target of revealTargets) {
    target.classList.add("reveal-on-scroll");
    revealObserver.observe(target);
  }
}

const previewTrigger = document.querySelector(".detail-image-trigger");
const imageDialog = document.querySelector(".image-lightbox");
const closeDialogButton = document.querySelector(".image-lightbox-close");

if (
  previewTrigger instanceof HTMLButtonElement &&
  imageDialog instanceof HTMLDialogElement &&
  closeDialogButton instanceof HTMLButtonElement
) {
  previewTrigger.addEventListener("click", () => imageDialog.showModal());
  closeDialogButton.addEventListener("click", () => imageDialog.close());

  imageDialog.addEventListener("keydown", (event) => {
    if (event.key === "Escape") imageDialog.close();
  });

  imageDialog.addEventListener("click", (event) => {
    if (event.target === imageDialog) imageDialog.close();
  });
}
