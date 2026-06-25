// MADE Design System — global styles & design tokens
import "./index.css";
// Page-specific layout styles (uses MADE tokens only)
import "./styles.css";

// Configure the base path so <made-icon> resolves SVGs from /assets/icons/system-icons
import { setBasePath } from "@mc-made/web-components/utilities/base-path.js";
setBasePath("");

// MADE Web Component registrations (flat imports — no subfolders)
import "@mc-made/web-components/made-theme-provider.js";
import "@mc-made/web-components/made-button.js";
import "@mc-made/web-components/made-icon.js";
import "@mc-made/web-components/made-icon-button.js";
import "@mc-made/web-components/made-link.js";
import "@mc-made/web-components/made-divider.js";
import "@mc-made/web-components/made-accordion.js";
import "@mc-made/web-components/made-accordion-item.js";

// Theme switcher — toggles the theme provider between light and dark colour modes
const themeToggle = document.getElementById("theme-toggle");
const themeProvider = document.querySelector("made-theme-provider");
const stickyThemeToggle = document.getElementById("sticky-theme-toggle");
const stickyThemeIcon = stickyThemeToggle?.querySelector(".sticky-nav__toggle-icon");

// Single source of truth for applying a colour mode everywhere it matters.
function applyTheme(mode) {
  const isDark = mode === "dark";
  if (themeProvider) themeProvider.setAttribute("color-mode", mode);
  document.body.setAttribute("data-color-mode", mode);
  if (themeToggle) themeToggle.selected = isDark;
  if (stickyThemeIcon) {
    stickyThemeIcon.setAttribute(
      "name",
      isDark ? "controls/outline/moon-outline" : "toggle/outline/sun-outline"
    );
  }
  if (stickyThemeToggle) {
    stickyThemeToggle.setAttribute("aria-pressed", String(isDark));
    stickyThemeToggle.setAttribute(
      "aria-label",
      isDark ? "Switch to light mode" : "Switch to dark mode"
    );
  }
}

if (themeToggle && themeProvider) {
  applyTheme("light");
  themeToggle.addEventListener("change", () => {
    applyTheme(themeToggle.selected ? "dark" : "light");
  });
}
if (stickyThemeToggle) {
  stickyThemeToggle.addEventListener("click", () => {
    const next =
      document.body.getAttribute("data-color-mode") === "dark" ? "light" : "dark";
    applyTheme(next);
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
  // Small delay lets the pointer travel across the gap to the panel
  const scheduleClose = () => {
    clearTimeout(closeTimer);
    closeTimer = setTimeout(() => setDropdown(false), 140);
  };

  // Open on hover of the expandable item; stay open while over item or panel
  [triggerItem, toolsDropdown].forEach((el) => {
    if (!el) return;
    el.addEventListener("mouseenter", openMenu);
    el.addEventListener("mouseleave", scheduleClose);
  });

  // Keyboard: open when the trigger receives focus
  toolsTrigger.addEventListener("focus", openMenu);

  // Close when clicking the dimmed/blurred backdrop
  navBackdrop.addEventListener("click", () => setDropdown(false));

  // Close after choosing a destination
  toolsDropdown.addEventListener("click", (event) => {
    if (event.target.closest(".nav-dropdown__link")) setDropdown(false);
  });

  // Close on Escape and return focus to the trigger
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen()) {
      clearTimeout(closeTimer);
      setDropdown(false);
      toolsTrigger.focus();
    }
  });
}

// Blur-reveal (technique: cruip.com / Linear) — staggered blur/translate
// reveal of text content when a section scrolls into view.
const BLUR_REVEAL_STAGGER = 0.04; // seconds between items

// Wrap each word in a root's text nodes in a span, preserving inline
// markup (e.g. <em>, <br>). Returns the created word spans in order.
function splitWordsPreserveMarkup(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  let node;
  while ((node = walker.nextNode())) {
    if (node.textContent.trim()) textNodes.push(node);
  }
  const words = [];
  textNodes.forEach((textNode) => {
    const frag = document.createDocumentFragment();
    textNode.textContent.split(/(\s+)/).forEach((part) => {
      if (part.trim() === "") {
        if (part) frag.appendChild(document.createTextNode(part));
        return;
      }
      const span = document.createElement("span");
      span.className = "blur-reveal-item blur-reveal-word";
      span.textContent = part;
      frag.appendChild(span);
      words.push(span);
    });
    textNode.parentNode.replaceChild(frag, textNode);
  });
  return words;
}

// Assign the staggered delay to each item, then reveal on scroll-in.
// The reveal repeats: scrolling a section out of view re-blurs it, so it
// animates again on re-entry whether scrolling down or back up.
function activateBlurReveal(items, observeTarget, options = {}) {
  items.forEach((el, i) => {
    el.style.setProperty("--reveal-delay", `${i * BLUR_REVEAL_STAGGER}s`);
  });
  const reveal = () => items.forEach((el) => el.classList.add("is-revealed"));
  const hide = () => items.forEach((el) => el.classList.remove("is-revealed"));
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) reveal();
          else hide();
        });
      },
      {
        // Hold off until the content is comfortably inside the viewport
        // (the bottom slice of the viewport doesn't count as "in view").
        threshold: options.threshold ?? 0.2,
        rootMargin: options.rootMargin ?? "0px 0px -18% 0px",
      }
    );
    observer.observe(observeTarget);
  } else {
    reveal();
  }
}

// Hero — headline words, then subtitle and button as single blocks.
const heroIntro = document.querySelector(".hero__intro");
if (heroIntro) {
  const items = [];
  const title = heroIntro.querySelector(".hero__title");
  if (title) items.push(...splitWordsPreserveMarkup(title));

  const subtitle = heroIntro.querySelector(".hero__subtitle");
  if (subtitle) {
    subtitle.classList.add("blur-reveal-item");
    items.push(subtitle);
  }
  const heroButton = heroIntro.querySelector("made-button");
  if (heroButton) {
    heroButton.classList.add("blur-reveal-item");
    items.push(heroButton);
  }
  activateBlurReveal(items, heroIntro);
}

// "Nothing great is built alone" — heading words (accent markup kept),
// then the lede and each feature card as single blocks.
const aloneSection = document.querySelector(".alone");
if (aloneSection) {
  const items = [];
  const heading = aloneSection.querySelector(".alone__display");
  if (heading) items.push(...splitWordsPreserveMarkup(heading));

  const lede = aloneSection.querySelector(".alone__lede");
  if (lede) {
    lede.classList.add("blur-reveal-item");
    items.push(lede);
  }
  aloneSection.querySelectorAll(".feature").forEach((feature) => {
    feature.classList.add("blur-reveal-item");
    items.push(feature);
  });
  activateBlurReveal(items, aloneSection);
}

// Every other heading — blur-reveal the words as the heading scrolls into
// view. Headings that already run another text effect (scramble) are skipped,
// and the reveal is held back a little so the heading is in view first.
document
  .querySelectorAll(".show-card__title, .split__title, .faq__title")
  .forEach((heading) => {
    if (heading.querySelector("[data-scramble]")) return;
    const words = splitWordsPreserveMarkup(heading);
    if (words.length) {
      activateBlurReveal(words, heading, { rootMargin: "0px 0px -25% 0px" });
    }
  });

// Generic opt-in blur reveals for secondary pages (e.g. About).
// [data-blur-words]  → split a heading into words and reveal with stagger.
// [data-blur-group]  → reveal each [data-blur-item] child in order on scroll-in.
document.querySelectorAll("[data-blur-words]").forEach((heading) => {
  const words = splitWordsPreserveMarkup(heading);
  if (words.length) {
    activateBlurReveal(words, heading, { rootMargin: "0px 0px -18% 0px" });
  }
});
document.querySelectorAll("[data-blur-group]").forEach((group) => {
  const items = [...group.querySelectorAll("[data-blur-item]")];
  items.forEach((el) => el.classList.add("blur-reveal-item"));
  if (items.length) {
    activateBlurReveal(items, group, { rootMargin: "0px 0px -12% 0px" });
  }
});

// [data-scroll-read] → progressive, scroll-linked reading reveal with a pin.
// The narrative pins to the viewport and its text translates slowly through a
// fixed frame as the reader scrolls — "holding" them on the passage. Each word
// is split out and brightens from unread (dim) to read (full) as it rises
// through a central reading band. Scrolling back up dims it again.
function initScrollReadReveal(pin) {
  const section = pin.parentElement; // .about-intro acts as the scroll track
  const copy = pin.querySelector(".about-intro__copy") || pin;
  const READ_MIN = 0.2; // opacity of unread text (20% of read)
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Split every paragraph's text into word spans (markup preserved).
  const words = [];
  copy.querySelectorAll("p").forEach((p) => {
    const walker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    let n;
    while ((n = walker.nextNode())) {
      if (n.textContent.trim()) textNodes.push(n);
    }
    textNodes.forEach((textNode) => {
      const frag = document.createDocumentFragment();
      textNode.textContent.split(/(\s+)/).forEach((part) => {
        if (part.trim() === "") {
          if (part) frag.appendChild(document.createTextNode(part));
          return;
        }
        const span = document.createElement("span");
        span.className = "read-word";
        span.textContent = part;
        frag.appendChild(span);
        words.push(span);
      });
      textNode.parentNode.replaceChild(frag, textNode);
    });
  });

  if (!words.length) return;

  if (reduce) {
    words.forEach((w) => (w.style.opacity = "1"));
    return;
  }

  section.classList.add("is-pinned");

  // Lay out the scroll track. The copy travels from "first line sitting low in
  // the frame" to "last line risen up to the reading line", so every line
  // passes through the central read band. The track is tall enough to hold the
  // reader over that journey plus a little dwell.
  let disp0 = 0;
  let disp1 = 0;
  const layout = () => {
    copy.style.transform = "translateY(0px)";
    const vh = window.innerHeight;
    const pinTop = pin.getBoundingClientRect().top;
    const copyTop = copy.getBoundingClientRect().top;
    const copyOffset = copyTop - pinTop; // copy's resting offset below the heading
    const last = words[words.length - 1].getBoundingClientRect();
    const lastCentre = last.top + last.height / 2 - copyTop;
    disp0 = 0; // start: copy sits at its natural spot, just under the heading
    disp1 = vh * 0.4 - copyOffset - lastCentre; // end: last line at the read line
    const hold = Math.abs(disp1 - disp0) + vh * 0.5; // journey + dwell
    section.style.height = `${vh + hold}px`;
  };

  let active = false;
  let ticking = false;
  const update = () => {
    ticking = false;
    const vh = window.innerHeight;
    const maxScroll = section.offsetHeight - vh;
    const p =
      maxScroll > 0
        ? Math.min(1, Math.max(0, -section.getBoundingClientRect().top / maxScroll))
        : 0;
    // Slide the copy through the frame as the reader advances.
    const disp = disp0 + (disp1 - disp0) * p;
    copy.style.transform = `translateY(${disp.toFixed(1)}px)`;
    // Brighten each word as it rises through the reading band.
    const start = vh * 0.82; // below this line: unread
    const end = vh * 0.42; // above this line: fully read
    const band = start - end;
    for (let i = 0; i < words.length; i++) {
      const r = words[i].getBoundingClientRect();
      const centre = r.top + r.height / 2;
      let t;
      if (centre >= start) t = 0;
      else if (centre <= end) t = 1;
      else t = (start - centre) / band;
      words[i].style.opacity = (READ_MIN + (1 - READ_MIN) * t).toFixed(3);
    }
  };
  const onScroll = () => {
    if (active && !ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };

  // Only run the per-frame work while the passage is near the viewport.
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        active = entries[0].isIntersecting;
        if (active) update();
      },
      { rootMargin: "300px 0px 300px 0px" }
    );
    io.observe(section);
  } else {
    active = true;
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", () => {
    layout();
    update();
  });
  // Re-measure once web fonts settle (they shift line wrapping/positions).
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      layout();
      update();
    });
  }
  layout();
  update();
}
document.querySelectorAll("[data-scroll-read]").forEach(initScrollReadReveal);

// Scramble text (technique: motion.dev scrambleText, stagger from center).
// Cycles a phrase between its original text and an alternate, locking each
// character in from the centre outward while the rest show random glyphs.
function initScrambleText(el) {
  const original = el.textContent;
  const alt = el.dataset.scrambleAlt || "placeholder placeholder placeholder";
  const phrases = [original, alt];
  const glyphs =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!<>-_\\/[]{}=+*^?#";
  const STAGGER = 40; // ms of extra scramble per character away from centre
  const SETTLE = 650; // ms each character scrambles before locking
  const HOLD = 2200; // ms a phrase stays readable before the next cycle

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    el.textContent = original;
    return;
  }

  const randGlyph = () => glyphs[(Math.random() * glyphs.length) | 0];
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  let frameId = 0;
  const GLYPH_INTERVAL = 70; // ms between glyph changes (slower flicker)
  const scrambleTo = (text) =>
    new Promise((resolve) => {
      const len = text.length;
      const centre = (len - 1) / 2;
      const lockAt = Array.from(
        { length: len },
        (_, i) => Math.abs(i - centre) * STAGGER + SETTLE
      );
      const maxLock = Math.max(0, ...lockAt);
      const start = performance.now();
      const cells = new Array(len).fill("");
      let lastGlyph = 0;

      const frame = (now) => {
        const elapsed = now - start;
        const tick = now - lastGlyph >= GLYPH_INTERVAL;
        if (tick) lastGlyph = now;
        let out = "";
        for (let i = 0; i < len; i++) {
          const ch = text[i];
          if (ch === " ") {
            out += " ";
          } else if (elapsed >= lockAt[i]) {
            out += ch;
          } else {
            if (tick || !cells[i]) cells[i] = randGlyph();
            out += cells[i];
          }
        }
        el.textContent = out;
        if (elapsed < maxLock) {
          frameId = requestAnimationFrame(frame);
        } else {
          el.textContent = text;
          resolve();
        }
      };
      frameId = requestAnimationFrame(frame);
    });

  let running = false;
  let phraseIndex = 0;
  const loop = async () => {
    while (running) {
      await wait(HOLD);
      if (!running) break;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      await scrambleTo(phrases[phraseIndex]);
    }
  };

  // Run only while the card is on screen
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !running) {
          running = true;
          loop();
        } else if (!entry.isIntersecting && running) {
          running = false;
          cancelAnimationFrame(frameId);
          el.textContent = phrases[phraseIndex];
        }
      });
    },
    { threshold: 0.5 }
  );
  observer.observe(el);
}

document.querySelectorAll("[data-scramble]").forEach(initScrambleText);

// Looping text-replacement swap for a single CTA (technique: GSAP TextPlugin
// "diff" — https://demos.gsap.com/demo/animate-text-replacement/). The label
// alternates between its original text and [data-swap-text] every 3 seconds
// while in view, scrambling/decoding left-to-right on each change.
function initTextSwap(el) {
  const target = el.dataset.swapText;
  if (!target) return;
  const original = el.textContent.trim();
  const labels = [original, target];
  const glyphs =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!<>-_\\/[]{}=+*^?#";
  const randGlyph = () => glyphs[(Math.random() * glyphs.length) | 0];
  const STAGGER = 32; // ms of extra scramble per character along the word
  const SETTLE = 460; // ms each character scrambles before locking
  const GLYPH_INTERVAL = 60; // ms between glyph changes
  const SWAP_EVERY = 3000; // ms between swaps
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let index = 0;
  let timer = null;
  let rafId = null;
  let running = false;

  const scrambleTo = (text) => {
    const len = text.length;
    const lockAt = Array.from({ length: len }, (_, i) => i * STAGGER + SETTLE);
    const maxLock = Math.max(0, ...lockAt);
    const start = performance.now();
    const cells = new Array(len).fill("");
    let lastGlyph = 0;
    const frame = (now) => {
      const elapsed = now - start;
      const tick = now - lastGlyph >= GLYPH_INTERVAL;
      if (tick) lastGlyph = now;
      let out = "";
      for (let i = 0; i < len; i++) {
        const ch = text[i];
        if (ch === " ") {
          out += " ";
        } else if (elapsed >= lockAt[i]) {
          out += ch;
        } else {
          if (tick || !cells[i]) cells[i] = randGlyph();
          out += cells[i];
        }
      }
      el.textContent = out;
      if (elapsed < maxLock) rafId = requestAnimationFrame(frame);
      else {
        el.textContent = text;
        rafId = null;
      }
    };
    rafId = requestAnimationFrame(frame);
  };

  const swap = () => {
    index = (index + 1) % labels.length;
    scrambleTo(labels[index]);
  };

  const start = () => {
    if (running || reduce) return;
    running = true;
    timer = setInterval(swap, SWAP_EVERY);
  };

  const stop = () => {
    running = false;
    if (timer) clearInterval(timer);
    timer = null;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
    index = 0;
    el.textContent = original;
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) start();
        else stop();
      });
    },
    { threshold: 0.6 }
  );
  observer.observe(el);
}

document.querySelectorAll("[data-swap-text]").forEach(initTextSwap);

// Cash App-style section reveal — fade content up (and scale media/cards in)
// as each section scrolls into view (once).
const revealSections = document.querySelectorAll(".split, .cards-row, .alone");
if (revealSections.length) {
  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );
    revealSections.forEach((section) => sectionObserver.observe(section));
  } else {
    revealSections.forEach((section) => section.classList.add("is-revealed"));
  }
}

// Cash App-style full-screen stacking — each split panel pins to the viewport
// and recedes (scales down + dims) as the next panel slides up to cover it.
const splitStack = document.querySelector(".split-stack");
if (splitStack) {
  const panels = [...splitStack.querySelectorAll(".split")];
  const stackQuery = window.matchMedia(
    "(min-width: 1025px) and (prefers-reduced-motion: no-preference)"
  );
  let ticking = false;

  const update = () => {
    ticking = false;
    if (!stackQuery.matches) return;
    const h = window.innerHeight;
    panels.forEach((panel, i) => {
      // The last panel is never covered, so it stays at rest.
      if (i === panels.length - 1) {
        panel.style.transform = "";
        panel.style.setProperty("--cover", "0");
        return;
      }
      // Progress of the NEXT panel sliding up over this one (0 → 1).
      const nextTop = panels[i + 1].getBoundingClientRect().top;
      const p = Math.min(1, Math.max(0, 1 - nextTop / h));
      const scale = 1 - 0.08 * p;
      const ty = -1.5 * p;
      panel.style.transform = `translateY(${ty}vh) scale(${scale})`;
      panel.style.setProperty("--cover", p.toFixed(3));
    });
  };

  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };

  const reset = () => {
    panels.forEach((panel) => {
      panel.style.transform = "";
      panel.style.setProperty("--cover", "0");
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  // Clear inline transforms when leaving the stacking breakpoint.
  stackQuery.addEventListener("change", () => (stackQuery.matches ? update() : reset()));
  update();
}

// Footer wordmark — replay the hero's staggered letter rise when it scrolls in.
const footerWordmark = document.querySelector(".footer-wordmark__svg");
if (footerWordmark) {
  const revealFooterWordmark = () => footerWordmark.classList.add("is-revealed");
  if ("IntersectionObserver" in window) {
    const wmObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            revealFooterWordmark();
            obs.disconnect();
          }
        });
      },
      { threshold: 0.25, rootMargin: "0px 0px -22% 0px" }
    );
    wmObserver.observe(footerWordmark);

    // Fallback: if the observer hasn't fired by the time the footer is within
    // a viewport's reach, reveal on the next scroll/resize as a safety net.
    const scrollFallback = () => {
      if (footerWordmark.classList.contains("is-revealed")) {
        window.removeEventListener("scroll", scrollFallback);
        window.removeEventListener("resize", scrollFallback);
        return;
      }
      const rect = footerWordmark.getBoundingClientRect();
      // Wait until the wordmark has risen meaningfully into the viewport (its
      // top is within the lower ~78%) so the stagger plays where it's visible.
      if (rect.top < window.innerHeight * 0.78 && rect.bottom > 0) {
        revealFooterWordmark();
        wmObserver.disconnect();
        window.removeEventListener("scroll", scrollFallback);
        window.removeEventListener("resize", scrollFallback);
      }
    };
    window.addEventListener("scroll", scrollFallback, { passive: true });
    window.addEventListener("resize", scrollFallback);
  } else {
    revealFooterWordmark();
  }
}

// FAQ — animate each item open/closed with a height transition and a subtle
// fade of the answer. Falls back to the native toggle under reduced motion.
const faqReduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;
document.querySelectorAll(".faq-item").forEach((item) => {
  if (faqReduceMotion) return;
  const summary = item.querySelector(".faq-item__summary");
  const content = item.querySelector(".faq-item__a");
  if (!summary || !content) return;

  const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
  const DURATION = 320;
  let animation = null;
  let isClosing = false;
  let isExpanding = false;

  const closedHeight = () => {
    const cs = getComputedStyle(item);
    return (
      summary.offsetHeight +
      parseFloat(cs.paddingTop) +
      parseFloat(cs.paddingBottom)
    );
  };

  const onFinish = (open) => {
    item.open = open;
    animation = null;
    isClosing = false;
    isExpanding = false;
    item.style.height = "";
    item.style.overflow = "";
  };

  const animateHeight = (from, to, open) => {
    if (animation) animation.cancel();
    animation = item.animate(
      { height: [`${from}px`, `${to}px`] },
      { duration: DURATION, easing: EASE }
    );
    animation.onfinish = () => onFinish(open);
    animation.oncancel = () => {
      isClosing = false;
      isExpanding = false;
    };
  };

  const expand = () => {
    isExpanding = true;
    animateHeight(item.offsetHeight, item.scrollHeight, true);
    content.animate(
      { opacity: [0, 1], transform: ["translateY(-6px)", "translateY(0)"] },
      { duration: DURATION, easing: EASE }
    );
  };

  const open = () => {
    item.style.overflow = "hidden";
    item.style.height = `${item.offsetHeight}px`;
    item.open = true;
    requestAnimationFrame(expand);
  };

  const shrink = () => {
    isClosing = true;
    item.style.overflow = "hidden";
    animateHeight(item.offsetHeight, closedHeight(), false);
    content.animate(
      { opacity: [1, 0], transform: ["translateY(0)", "translateY(-6px)"] },
      { duration: DURATION, easing: EASE }
    );
  };

  summary.addEventListener("click", (e) => {
    e.preventDefault();
    if (isClosing || !item.open) {
      open();
    } else if (isExpanding || item.open) {
      shrink();
    }
  });
});

// ============================================================
// Sticky navigation — reveals once the main header scrolls out of view,
// adapts its contrast to the section behind it, and hosts its own Resources
// menu. The standard header is untouched.
// ============================================================
const stickyNav = document.getElementById("sticky-nav");
const siteHeaderEl = document.querySelector(".site-header");
if (stickyNav && siteHeaderEl) {
  // ---- Reveal on scroll: visible only while the main header is off-screen ----
  const setStickyVisible = (visible) => {
    stickyNav.classList.toggle("is-visible", visible);
    stickyNav.setAttribute("aria-hidden", String(!visible));
    if (!visible) closeStickyMenu();
  };
  if ("IntersectionObserver" in window) {
    const headerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => setStickyVisible(!entry.isIntersecting));
      },
      { threshold: 0, rootMargin: "0px 0px 0px 0px" }
    );
    headerObserver.observe(siteHeaderEl);
  } else {
    window.addEventListener(
      "scroll",
      () => setStickyVisible(window.scrollY > siteHeaderEl.offsetHeight),
      { passive: true }
    );
  }

  // ---- Contrast: match the pill to the section currently behind it ----
  // Selectors whose background is dark; the pill flips to light text over them.
  const DARK_SECTION_SELECTORS = [
    ".hero",
    ".alone",
    ".split--quality",
    ".site-footer",
  ];
  const sections = [...document.querySelectorAll(
    ".hero, .alone, .cards-row, .split, .faq, .site-footer, [data-nav-section]"
  )].map((el) => ({
    el,
    dark:
      el.hasAttribute("data-nav-dark") ||
      DARK_SECTION_SELECTORS.some((sel) => el.matches(sel)),
  }));

  const updateContrast = () => {
    // Probe a point near the vertical centre of the floating pill.
    const probeY = stickyNav.getBoundingClientRect().top + 42;
    let dark = false;
    // Take the LAST match so stacked/pinned panels resolve to the topmost one.
    for (const { el, dark: isDark } of sections) {
      const r = el.getBoundingClientRect();
      if (r.top <= probeY && r.bottom > probeY) {
        dark = isDark;
      }
    }
    stickyNav.classList.toggle("sticky-nav--on-dark", dark);
  };

  let contrastTicking = false;
  const requestContrast = () => {
    if (contrastTicking) return;
    contrastTicking = true;
    requestAnimationFrame(() => {
      updateContrast();
      contrastTicking = false;
    });
  };
  window.addEventListener("scroll", requestContrast, { passive: true });
  window.addEventListener("resize", requestContrast);
  updateContrast();

  // ---- Resources menu (self-contained floating popover) ----
  const stickyTrigger = document.getElementById("sticky-tools-trigger");
  const stickyMenu = document.getElementById("sticky-tools-dropdown");
  const stickyItem = stickyTrigger?.closest("li");
  let stickyCloseTimer;

  function closeStickyMenu() {
    if (!stickyTrigger || !stickyMenu) return;
    clearTimeout(stickyCloseTimer);
    stickyTrigger.setAttribute("aria-expanded", "false");
    stickyMenu.classList.remove("is-open");
  }

  if (stickyTrigger && stickyMenu) {
    const openStickyMenu = () => {
      clearTimeout(stickyCloseTimer);
      stickyTrigger.setAttribute("aria-expanded", "true");
      stickyMenu.classList.add("is-open");
    };
    const scheduleStickyClose = () => {
      clearTimeout(stickyCloseTimer);
      stickyCloseTimer = setTimeout(closeStickyMenu, 140);
    };
    const isStickyOpen = () =>
      stickyTrigger.getAttribute("aria-expanded") === "true";

    [stickyItem, stickyMenu].forEach((el) => {
      if (!el) return;
      el.addEventListener("mouseenter", openStickyMenu);
      el.addEventListener("mouseleave", scheduleStickyClose);
    });

    // Open on focus (keyboard) / tap; close via outside click or Escape.
    stickyTrigger.addEventListener("focus", openStickyMenu);
    stickyTrigger.addEventListener("click", openStickyMenu);

    stickyMenu.addEventListener("click", (event) => {
      if (event.target.closest(".nav-dropdown__link")) closeStickyMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && isStickyOpen()) {
        closeStickyMenu();
        stickyTrigger.focus();
      }
    });

    // Close when clicking anywhere outside the bar
    document.addEventListener("click", (event) => {
      if (!isStickyOpen()) return;
      if (!event.target.closest(".sticky-nav__bar")) closeStickyMenu();
    });
  }
}


