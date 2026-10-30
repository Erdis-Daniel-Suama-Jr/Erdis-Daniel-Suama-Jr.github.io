/* Année automatique dans le pied de page. */
document.getElementById("current-year").textContent = new Date().getFullYear();

/* Menu téléphone : état annoncé aux technologies d'assistance et fermeture avec Échap. */
const menuButton = document.querySelector(".nav-toggle");
const navigation = document.querySelector(".main-nav");
const navigationLinks = [...navigation.querySelectorAll("a")];

function closeMenu() {
  const focusWasInMenu = navigation.contains(document.activeElement);
  menuButton.setAttribute("aria-expanded", "false");
  navigation.classList.remove("is-open");
  if (focusWasInMenu) menuButton.focus();
}

menuButton.addEventListener("click", () => {
  const willOpen = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(willOpen));
  navigation.classList.toggle("is-open", willOpen);
  if (willOpen) requestAnimationFrame(() => setActiveNavigation(location.hash.slice(1) || "accueil"));
});

navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

document.addEventListener("click", (event) => {
  const menuIsOpen = menuButton.getAttribute("aria-expanded") === "true";
  if (menuIsOpen && !navigation.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
});

/* Le point jaune suit le lien correspondant à la section visible. */
const navIndicator = navigation.querySelector(".nav-indicator");
const sections = [...document.querySelectorAll("main section[id]")];

function setActiveNavigation(sectionId) {
  const activeLink = navigationLinks.find((link) => link.hash === `#${sectionId}`);
  if (!activeLink) return;

  navigationLinks.forEach((link) => {
    if (link === activeLink) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });

  const linkCenter = activeLink.offsetLeft + (activeLink.offsetWidth / 2);
  const pointTop = activeLink.offsetTop + activeLink.offsetHeight + 2;
  navIndicator.style.transform = `translate3d(${linkCenter - (navIndicator.offsetWidth / 2)}px, ${pointTop}px, 0)`;
}

setActiveNavigation(location.hash.slice(1) || "accueil");
window.addEventListener("resize", () => {
  if (window.innerWidth > 767) closeMenu();
  const activeId = navigation.querySelector('[aria-current="location"]')?.hash.slice(1) || "accueil";
  setActiveNavigation(activeId);
});

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];
    if (visible) setActiveNavigation(visible.target.id);
  }, { rootMargin: "-25% 0px -55% 0px", threshold: [0, 0.15, 0.35, 0.6] });

  sections.forEach((section) => sectionObserver.observe(section));
}

/* Apparition au défilement, une seule fois. Sans IntersectionObserver, le contenu reste visible. */
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealItems = [...document.querySelectorAll(".reveal")];

if ("IntersectionObserver" in window && !reducedMotion) {
  document.documentElement.classList.add("has-reveal-motion");
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

/* Crée les éléments texte par texte pour ne jamais interpréter une fiche comme du HTML. */
function makeTextElement(tagName, className, value) {
  const element = document.createElement(tagName);
  element.className = className;
  element.textContent = value || "";
  return element;
}

function isSafeLink(href) {
  return typeof href === "string" && /^(https?:\/\/|mailto:|\/|\.\/|\.\.\/|#)/i.test(href);
}

function isSafeImageSource(source) {
  return typeof source === "string" && /^(https?:\/\/|\/|\.\/|\.\.\/)/i.test(source);
}

/* Réalisations : les cartes proviennent exclusivement de js/projects.js. */
function renderProjects() {
  const container = document.getElementById("projects-content");
  const projects = Array.isArray(window.projects) ? window.projects : [];

  if (projects.length === 0) {
    const emptyState = document.createElement("div");
    emptyState.className = "empty-state glass-card";
    const dot = document.createElement("span");
    dot.className = "empty-state__dot";
    dot.setAttribute("aria-hidden", "true");
    emptyState.append(dot, makeTextElement("p", "", "Cette section grandit avec moi. Mes premières réalisations arrivent."));
    container.replaceChildren(emptyState);
    return;
  }

  const grid = document.createElement("div");
  grid.className = "projects-grid";

  projects.forEach((project) => {
    const card = document.createElement("article");
    card.className = "project-card glass-card";

    if (isSafeImageSource(project.image)) {
      const image = document.createElement("img");
      image.src = project.image;
      image.alt = `Aperçu du projet : ${project.title || ""}`;
      image.loading = "lazy";
      card.append(image);
    }

    const content = document.createElement("div");
    content.className = "project-card__content";
    content.append(makeTextElement("h3", "", project.title));
    content.append(makeTextElement("p", "", project.description));

    if (Array.isArray(project.technologies) && project.technologies.length) {
      const list = document.createElement("ul");
      list.className = "project-card__technologies";
      project.technologies.forEach((technology) => list.append(makeTextElement("li", "", technology)));
      content.append(list);
    }

    if (isSafeLink(project.link)) {
      const link = document.createElement("a");
      link.className = "project-card__link";
      link.href = project.link;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = "Voir le projet";
      content.append(link);
    }

    card.append(content);
    grid.append(card);
  });

  container.replaceChildren(grid);
}

renderProjects();

/* QR codes générés sur l'appareil à partir des liens déjà présents dans js/links.js. */
const qrDialog = document.getElementById("qr-dialog");
const qrCodeContainer = document.getElementById("qr-code");
const qrDialogTitle = document.getElementById("qr-dialog-title");
const qrOpenLink = document.getElementById("qr-open-link");
const qrCopyButton = document.getElementById("qr-copy-link");
const qrFeedback = document.getElementById("qr-feedback");
let currentQrLink = "";

function showQr(link) {
  qrCodeContainer.replaceChildren();
  qrDialogTitle.textContent = link.label;
  qrOpenLink.href = link.href;
  qrOpenLink.hidden = link.href.startsWith("mailto:");
  qrCopyButton.hidden = link.href.startsWith("mailto:");
  qrFeedback.textContent = "";
  currentQrLink = link.href;

  if (typeof window.qrcode !== "function") {
    qrCodeContainer.textContent = "Le générateur de QR code n'a pas pu être chargé.";
  } else {
    const code = window.qrcode(0, "M");
    code.addData(link.href);
    code.make();
    qrCodeContainer.innerHTML = code.createSvgTag(6, 4);
    const svg = qrCodeContainer.querySelector("svg");
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", `QR code pour ${link.label}`);
    svg.setAttribute("focusable", "false");
  }

  qrDialog.showModal();
}

document.querySelector("[data-qr-close]").addEventListener("click", () => qrDialog.close());
qrDialog.addEventListener("click", (event) => {
  if (event.target === qrDialog) qrDialog.close();
});

qrCopyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(currentQrLink);
    qrFeedback.textContent = "Lien copié.";
  } catch {
    const temporaryField = document.createElement("textarea");
    temporaryField.value = currentQrLink;
    temporaryField.setAttribute("readonly", "");
    temporaryField.className = "visually-hidden";
    document.body.append(temporaryField);
    temporaryField.select();
    const copied = document.execCommand("copy");
    temporaryField.remove();
    qrFeedback.textContent = copied
      ? "Lien copié."
      : "La copie n'est pas disponible dans ce navigateur.";
  }
});

/* Les liens sans adresse réelle ou sans visibilité ne sont jamais rendus. */
function renderLinks() {
  const container = document.getElementById("contact-content");
  const links = Array.isArray(window.profileLinks) ? window.profileLinks : [];
  const visibleLinks = links.filter((link) => link.visible && isSafeLink(link.href));
  const structuredDataScript = document.querySelector('script[type="application/ld+json"]');
  const structuredData = JSON.parse(structuredDataScript.textContent);
  structuredData.sameAs = visibleLinks
    .filter((link) => link.sameAs && link.external)
    .map((link) => link.href);
  structuredDataScript.textContent = JSON.stringify(structuredData);
  const primary = visibleLinks.filter((link) => link.group === "primary");
  const secondary = visibleLinks.filter((link) => link.group === "secondary");

  function createLinkCard(link, size) {
    const wrapper = document.createElement("div");
    wrapper.className = `contact-link-card contact-link-card--${size}`;

    const anchor = document.createElement("a");
    anchor.className = `contact-link contact-link--${size}`;
    anchor.href = link.href;
    anchor.setAttribute("aria-label", link.label);
    if (link.external) {
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
    }

    const icon = document.createElement("img");
    icon.src = link.icon;
    icon.alt = "";
    icon.setAttribute("aria-hidden", "true");
    icon.width = 22;
    icon.height = 22;
    anchor.append(icon, makeTextElement("span", "", link.label));

    const qrButton = document.createElement("button");
    qrButton.className = "contact-qr-button";
    qrButton.type = "button";
    qrButton.textContent = "QR";
    qrButton.setAttribute("aria-label", `Afficher le QR code de ${link.label}`);
    qrButton.addEventListener("click", () => showQr(link));

    wrapper.append(anchor, qrButton);
    return wrapper;
  }

  const primaryRow = document.createElement("div");
  primaryRow.className = "contact-links contact-links--primary";
  primary.forEach((link) => primaryRow.append(createLinkCard(link, "primary")));
  container.replaceChildren(primaryRow);

  if (secondary.length) {
    const secondaryGroup = document.createElement("div");
    secondaryGroup.className = "contact-secondary";
    secondaryGroup.append(makeTextElement("p", "", "Je suis aussi sur"));

    const secondaryRow = document.createElement("div");
    secondaryRow.className = "contact-links contact-links--secondary";
    secondary.forEach((link) => secondaryRow.append(createLinkCard(link, "secondary")));
    secondaryGroup.append(secondaryRow);
    container.append(secondaryGroup);
  }
}

renderLinks();
