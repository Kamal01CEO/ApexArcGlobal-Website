const root = document.documentElement;

root.classList.add("js");

const header = document.querySelector(".site-header");
const navToggle = document.querySelector("[data-nav-toggle]");
const mobilePanel = document.querySelector("[data-mobile-panel]");

const syncHeaderState = () => {
  if (!header) {
    return;
  }

  header.classList.toggle("is-scrolled", window.scrollY > 10);
};

syncHeaderState();
window.addEventListener("scroll", syncHeaderState, { passive: true });

if (navToggle instanceof HTMLButtonElement && mobilePanel instanceof HTMLElement) {
  const closePanel = () => {
    navToggle.setAttribute("aria-expanded", "false");
    mobilePanel.hidden = true;
  };

  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    mobilePanel.hidden = expanded;
  });

  mobilePanel.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closePanel);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1100) {
      closePanel();
    }
  });
}

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const revealItems = [...document.querySelectorAll("[data-reveal]")];

  if (revealItems.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );

    revealItems.forEach((item) => observer.observe(item));
  }

  document.querySelectorAll("[data-parallax-root]").forEach((scene) => {
    const layers = [...scene.querySelectorAll("[data-depth]")];

    if (layers.length === 0) {
      return;
    }

    const handleMove = (event) => {
      const rect = scene.getBoundingClientRect();
      const ratioX = (event.clientX - rect.left) / rect.width - 0.5;
      const ratioY = (event.clientY - rect.top) / rect.height - 0.5;

      layers.forEach((layer) => {
        const depth = Number(layer.getAttribute("data-depth") || 0);
        const offsetX = ratioX * depth;
        const offsetY = ratioY * depth;
        layer.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
      });
    };

    const resetLayers = () => {
      layers.forEach((layer) => {
        layer.style.transform = "";
      });
    };

    scene.addEventListener("pointermove", handleMove);
    scene.addEventListener("pointerleave", resetLayers);
  });
} else {
  document.querySelectorAll("[data-reveal]").forEach((item) => {
    item.classList.add("is-visible");
  });
}

document.querySelectorAll("[data-copy-email]").forEach((button) => {
  button.addEventListener("click", async () => {
    const email = button.getAttribute("data-copy-email");

    if (!email) {
      return;
    }

    try {
      await navigator.clipboard.writeText(email);
      const originalText = button.textContent;
      button.textContent = "Email Copied";

      window.setTimeout(() => {
        button.textContent = originalText;
      }, 1600);
    } catch (error) {
      console.error("Could not copy email", error);
    }
  });
});
