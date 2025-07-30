// Hugo Profile Navbar JavaScript Enhancement
// Add this to static/js/custom.js

(function () {
  "use strict";

  let lastScrollTop = 0;
  let header = null;
  let isScrolling = false;
  let scrollTimeout = null;

  // Initialize when DOM is ready
  function init() {
    header = document.querySelector("header");

    if (!header) {
      console.warn("Header element not found");
      return;
    }

    // Remove any existing scroll listeners that might conflict
    window.removeEventListener("scroll", window.handleHeaderScroll);

    // Add our enhanced scroll listener
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Ensure header starts with proper styling
    header.style.transform = "translateY(0)";
    header.style.opacity = "1";

    console.log("Hugo Profile navbar enhancement initialized");
  }

  function handleScroll() {
    if (!header || isScrolling) return;

    isScrolling = true;

    // Clear any existing timeout
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }

    // Use requestAnimationFrame for smooth performance
    requestAnimationFrame(updateHeader);

    // Debounce scroll events
    scrollTimeout = setTimeout(() => {
      isScrolling = false;
    }, 16); // ~60fps
  }

  function updateHeader() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollThreshold = 100;
    const scrollDelta = Math.abs(scrollTop - lastScrollTop);

    // Only update if scroll delta is significant (reduces jitter)
    if (scrollDelta < 10) {
      isScrolling = false;
      return;
    }

    if (scrollTop > lastScrollTop && scrollTop > scrollThreshold) {
      // Scrolling down - hide header
      hideHeader();
    } else if (scrollTop < lastScrollTop || scrollTop <= scrollThreshold) {
      // Scrolling up or at top - show header
      showHeader();
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    isScrolling = false;
  }

  function hideHeader() {
    if (!header) return;

    header.classList.add("nav-up");
    header.classList.remove("nav-down", "show");

    // Force the transition with inline styles as backup
    header.style.transform = "translateY(-100%)";
    header.style.opacity = "0";
  }

  function showHeader() {
    if (!header) return;

    header.classList.remove("nav-up");
    header.classList.add("nav-down", "show");

    // Force the transition with inline styles as backup
    header.style.transform = "translateY(0)";
    header.style.opacity = "1";
  }

  // Initialize when DOM is loaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Also initialize on window load as backup
  window.addEventListener("load", init);

  // Handle page visibility changes (when user switches tabs)
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden && header) {
      // Reset header state when page becomes visible
      showHeader();
    }
  });
})();
