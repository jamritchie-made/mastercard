// MADE Design System — global styles & design tokens
import "./index.css";
// Page-specific layout styles (uses MADE tokens only)
import "./styles.css";

// Configure the base path so <made-icon> resolves SVGs from /assets/icons/system-icons
import { setBasePath } from "@mc-made/web-components/utilities/base-path.js";
setBasePath("");

// MADE Web Component registrations (flat imports — no subfolders)
import "@mc-made/web-components/made-theme-provider.js";
import "@mc-made/web-components/made-icon.js";
import "@mc-made/web-components/made-icon-button.js";
import "@mc-made/web-components/made-link.js";

// Theme switcher — this page defaults to dark mode (toggle starts selected).
const themeToggle = document.getElementById("theme-toggle");
const themeProvider = document.querySelector("made-theme-provider");
if (themeToggle && themeProvider) {
  document.body.setAttribute("data-color-mode", "dark");
  themeToggle.addEventListener("change", () => {
    const mode = themeToggle.selected ? "dark" : "light";
    themeProvider.setAttribute("color-mode", mode);
    document.body.setAttribute("data-color-mode", mode);
  });
}

// Tools & Resources dropdown — opens the mega-menu and blurs the page behind it
const toolsTrigger = document.getElementById("tools-menu-trigger");
const toolsDropdown = document.getElementById("tools-dropdown");
const navBackdrop = document.getElementById("nav-backdrop");
if (toolsTrigger && toolsDropdown && navBackdrop) {
  const siteHeader = toolsTrigger.closest(".site-header");
  const triggerItem = toolsTrigger.closest("li");
  let closeTimer;

  const setDropdown = (open) => {
    toolsTrigger.setAttribute("aria-expanded", String(open));
    toolsDropdown.classList.toggle("is-open", open);
    navBackdrop.classList.toggle("is-open", open);
    if (siteHeader) siteHeader.classList.toggle("is-menu-open", open);
  };
  const isOpen = () => toolsTrigger.getAttribute("aria-expanded") === "true";

  const openMenu = () => {
    clearTimeout(closeTimer);
    setDropdown(true);
  };
  const scheduleClose = () => {
    clearTimeout(closeTimer);
    closeTimer = setTimeout(() => setDropdown(false), 140);
  };

  [triggerItem, toolsDropdown].forEach((el) => {
    if (!el) return;
    el.addEventListener("mouseenter", openMenu);
    el.addEventListener("mouseleave", scheduleClose);
  });
  toolsTrigger.addEventListener("focus", openMenu);
  navBackdrop.addEventListener("click", () => setDropdown(false));
  toolsDropdown.addEventListener("click", (event) => {
    if (event.target.closest(".nav-dropdown__link")) setDropdown(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen()) {
      clearTimeout(closeTimer);
      setDropdown(false);
      toolsTrigger.focus();
    }
  });
}

// Footer wordmark — replay the hero's staggered letter rise when it scrolls in.
const footerWordmark = document.querySelector(".footer-wordmark__svg");
if (footerWordmark) {
  const reveal = () => footerWordmark.classList.add("is-revealed");
  if ("IntersectionObserver" in window) {
    const obs = new IntersectionObserver(
      (entries, o) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            reveal();
            o.disconnect();
          }
        });
      },
      { threshold: 0.25, rootMargin: "0px 0px -22% 0px" }
    );
    obs.observe(footerWordmark);
  } else {
    reveal();
  }
}

// ============ CURSOR IMAGE TRAIL ============
// Technique: an "image trail" cursor effect (à la the referenced CodePen) — as
// the pointer travels, reusable copies of the GlobalProtect card are dropped
// along the path and fade out, leaving a trailing wake behind the cursor.
function initCursorTrail() {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  // Skip on touch / coarse pointers and when reduced motion is requested.
  const fine = window.matchMedia("(pointer: fine)").matches;
  if (reduceMotion || !fine) return;

  const IMAGE_SRC = "/assets/images/globalprotect-card.svg";
  const POOL_SIZE = 9; // reusable image elements cycled along the trail
  const THRESHOLD = 90; // px the cursor must travel before dropping the next one
  const VISIBLE_MS = 540; // how long each image lingers before fading out

  const layer = document.createElement("div");
  layer.className = "cursor-trail";
  layer.setAttribute("aria-hidden", "true");

  const pool = [];
  for (let i = 0; i < POOL_SIZE; i += 1) {
    const img = document.createElement("img");
    img.src = IMAGE_SRC;
    img.alt = "";
    img.className = "cursor-trail__img";
    img.draggable = false;
    layer.appendChild(img);
    pool.push({ el: img, hideTimer: null });
  }
  document.body.appendChild(layer);

  // Measure the navigation and footer bands so the trail is never dropped over
  // them and the layer is clipped to the area in between (set as CSS custom
  // properties). The header is a web component that lays out asynchronously, so
  // re-measure on load; the footer position changes on scroll.
  const header = document.querySelector(".site-header");
  const footer = document.querySelector(".site-footer");
  let navBottom = 0;
  let footerTop = Infinity;
  const measure = () => {
    navBottom = header ? header.getBoundingClientRect().bottom : 0;
    footerTop = footer ? footer.getBoundingClientRect().top : Infinity;
    const footerClip = Number.isFinite(footerTop)
      ? Math.max(0, window.innerHeight - footerTop)
      : 0;
    layer.style.setProperty("--nav-clip", `${Math.round(navBottom)}px`);
    layer.style.setProperty("--footer-clip", `${Math.round(footerClip)}px`);
  };
  measure();
  window.addEventListener("load", measure);
  window.addEventListener("resize", measure);
  window.addEventListener("scroll", measure, { passive: true });

  // Skip dropping a trail image when the pointer is over a clickable element.
  const overClickable = (target) =>
    !!(target && target.closest(
      'a, button, made-link, made-button, made-icon-button, [role="button"], [href]'
    ));

  let lastX = 0;
  let lastY = 0;
  let primed = false;
  let index = 0;

  const drop = (x, y) => {
    const item = pool[index];
    index = (index + 1) % pool.length;
    const { el } = item;
    clearTimeout(item.hideTimer);

    const rotation = (Math.random() * 16 - 8).toFixed(2);
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.setProperty("--rot", `${rotation}deg`);

    // Restart the in/out transition even if this element is mid-flight.
    el.classList.remove("is-visible");
    void el.offsetWidth; // force reflow
    el.classList.add("is-visible");

    item.hideTimer = setTimeout(() => {
      el.classList.remove("is-visible");
    }, VISIBLE_MS);
  };

  window.addEventListener(
    "pointermove",
    (event) => {
      if (event.pointerType === "touch") return;
      // Header height may not have been available at init — keep it fresh.
      if (!navBottom) measure();
      const x = event.clientX;
      const y = event.clientY;
      // Don't generate the trail over the nav band, the footer, or any
      // clickable element.
      if (y <= navBottom || y >= footerTop || overClickable(event.target)) {
        primed = false;
        return;
      }
      if (!primed) {
        lastX = x;
        lastY = y;
        primed = true;
        return;
      }
      if (Math.hypot(x - lastX, y - lastY) >= THRESHOLD) {
        drop(x, y);
        lastX = x;
        lastY = y;
      }
    },
    { passive: true }
  );
}

initCursorTrail();
