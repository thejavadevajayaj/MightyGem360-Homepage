const navbarToggle = document.querySelector(".navbar-toggle");
const navbarMenu = document.querySelector(".navbar-menu");

navbarToggle.addEventListener("click", () => {
  navbarToggle.classList.toggle("active");
  navbarMenu.classList.toggle("active");
});

document.querySelectorAll(".navbar-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    if (window.innerWidth <= 768) {
      navbarMenu.classList.remove("active");
      navbarToggle.classList.remove("active");
    }
  });
});

/* ============================= */
/* NAVBAR SHOW / HIDE ON SCROLL */
/* ============================= */

let lastScrollY = window.scrollY;
const navbar = document.querySelector(".navbar");

// Make sure navbar is visible on reload
window.addEventListener("load", () => {
  navbar.classList.add("nav-show");
});

window.addEventListener("scroll", () => {
  const currentScrollY = window.scrollY;

  if (currentScrollY > lastScrollY && currentScrollY > 80) {
    // Scrolling DOWN → Hide Navbar
    navbar.classList.remove("nav-show");
    navbar.classList.add("nav-hide");
  } else {
    // Scrolling UP → Show Navbar
    navbar.classList.remove("nav-hide");
    navbar.classList.add("nav-show");
  }

  lastScrollY = currentScrollY;
});

// --- Hero Slider Logic ---
const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");
const prevBtn = document.querySelector(".prev-btn");
const nextBtn = document.querySelector(".next-btn");
const sliderContainer = document.querySelector(".hero-slider");

let currentSlide = 0;
const slideCount = slides.length;
let autoSlideInterval;

const resetAnimations = (slide) => {
  const animatedElements = slide.querySelectorAll('[class*="fade-up-"]');
  animatedElements.forEach((el) => {
    el.style.animation = "none";
    el.offsetHeight; // trigger reflow
    el.style.animation = null;
  });
};

const goToSlide = (n) => {
  if (!slides.length) return;

  // Remove active class from current dot and slide
  slides[currentSlide].classList.remove("active");
  if (dots[currentSlide]) dots[currentSlide].classList.remove("active");

  currentSlide = (n + slideCount) % slideCount;

  // Add active class to new dot and slide
  slides[currentSlide].classList.add("active");
  if (dots[currentSlide]) dots[currentSlide].classList.add("active");

  // Reset animations so they re-play
  resetAnimations(slides[currentSlide]);
};

const nextSlide = () => goToSlide(currentSlide + 1);
const prevSlide = () => goToSlide(currentSlide - 1);

// Event Listeners for controls
if (nextBtn) nextBtn.addEventListener("click", nextSlide);
if (prevBtn) prevBtn.addEventListener("click", prevSlide);

dots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    goToSlide(index);
  });
});

// Auto-slide functionality
const startAutoSlide = () => {
  if (!slides.length) return;
  autoSlideInterval = setInterval(nextSlide, 5000); // 5 seconds per slide
};

const stopAutoSlide = () => {
  clearInterval(autoSlideInterval);
};

// Pause on hover
if (sliderContainer) {
  sliderContainer.addEventListener("mouseenter", stopAutoSlide);
  sliderContainer.addEventListener("mouseleave", startAutoSlide);
}

// Init auto-slide
startAutoSlide();

// --- About Section Animations ---
window.addEventListener("load", () => {
  const logo = document.querySelector(".animate-logo");
  const heading = document.querySelector(".animate-heading");
  const paragraph = document.getElementById("animated-paragraph");

  if (logo) logo.classList.add("run-animation");
  if (heading) heading.classList.add("run-animation");

  if (paragraph) {
    // recursively wrap text nodes
    function wrapLetters(node) {
      if (node.nodeType === 3) {
        // Text node
        const text = node.nodeValue;
        if (!text.trim() && text.length > 0) return;

        const fragment = document.createDocumentFragment();
        for (let i = 0; i < text.length; i++) {
          const char = text[i];
          if (char === " ") {
            fragment.appendChild(document.createTextNode(" "));
          } else {
            const span = document.createElement("span");
            span.className = "char";
            span.textContent = char;
            fragment.appendChild(span);
          }
        }
        node.replaceWith(fragment);
      } else if (node.nodeType === 1 && node.nodeName !== "BR") {
        Array.from(node.childNodes).forEach(wrapLetters);
      }
    }

    // Wrap everything
    Array.from(paragraph.childNodes).forEach(wrapLetters);

    // Apply animation staggered delay
    const chars = paragraph.querySelectorAll(".char");

    // Goal: entire animation completes in ~2.5 seconds.
    // We calculate the optimal delay to fit within the max timeframe without looking laggy
    const totalDurationMs = 2500;
    const delayMs = totalDurationMs / chars.length;

    chars.forEach((char, index) => {
      // delay starts after the 0.8s heading fade-in finishes
      char.style.animationDelay = `${0.8 + (index * delayMs) / 1000}s`;
    });
  }
});

// --- USP Mobile Slider Logic ---
window.addEventListener("load", () => {
  const uspGrid = document.getElementById("usp-grid");
  const prevUspBtn = document.querySelector(".prev-usp");
  const nextUspBtn = document.querySelector(".next-usp");

  if (uspGrid && prevUspBtn && nextUspBtn) {
    prevUspBtn.addEventListener("click", () => {
      uspGrid.scrollBy({
        left: -uspGrid.offsetWidth,
        behavior: "smooth",
      });
    });

    nextUspBtn.addEventListener("click", () => {
      uspGrid.scrollBy({
        left: uspGrid.offsetWidth,
        behavior: "smooth",
      });
    });
  }
});

// --- USP Mobile Slider Logic ---
window.addEventListener("load", () => {
  const uspGrid = document.getElementById("usp-grids");
  const prevUspBtn = document.querySelector(".prev-usp");
  const nextUspBtn = document.querySelector(".next-usp");

  if (uspGrid && prevUspBtn && nextUspBtn) {
    prevUspBtn.addEventListener("click", () => {
      uspGrid.scrollBy({
        left: -uspGrid.offsetWidth,
        behavior: "smooth",
      });
    });

    nextUspBtn.addEventListener("click", () => {
      uspGrid.scrollBy({
        left: uspGrid.offsetWidth,
        behavior: "smooth",
      });
    });
  }
});

// --- Video Showcase Logic ---
window.addEventListener("DOMContentLoaded", () => {
  const videoSection = document.querySelector(".video-showcase");
  const videoWrapper = document.querySelector(".video-wrapper");
  const video = document.querySelector(".showcase-video");
  const playOverlay = document.querySelector(".video-overlay");
  const playIcon = document.querySelector(".play-icon");
  const pauseIcon = document.querySelector(".pause-icon");
  const btnText = document.querySelector(".btn-text");

  if (videoSection && videoWrapper) {
    // Scroll animation for scaling video
    window.addEventListener("scroll", () => {
      const rect = videoSection.getBoundingClientRect();
      let scrollProgress = 0;

      // Start scaling down when perfectly pinned at top (rect.top <= 0)
      if (rect.top <= 0) {
        // Determine how far down we scrolled inside this 150vh container
        const maxScroll = videoSection.offsetHeight - window.innerHeight;
        scrollProgress = Math.min(1, Math.max(0, -rect.top / maxScroll));
      }

      // Map scroll progress (0 to 1) to scale values (1 down to 0.6)
      // Smaller as we scroll down, larger (back to 1) as we scroll up
      const scaleValue = 0.35 + scrollProgress * 0.69;
      videoWrapper.style.transform = `scale(${scaleValue})`;
    });
  }

  if (video && playOverlay) {
    // Control play/pause toggles
    const togglePlay = () => {
      if (video.paused) {
        video.play();
        playIcon.style.display = "none";
        pauseIcon.style.display = "flex";
        btnText.textContent = "PAUSE SHOWREEL";
      } else {
        video.pause();
        playIcon.style.display = "flex";
        pauseIcon.style.display = "none";
        btnText.textContent = "PLAY SHOWREEL";
      }
    };

    // Clicking anywhere on the video overlay correctly toggles state
    playOverlay.addEventListener("click", togglePlay);
  }
});

// --- Solutions Accordion Logic ---
window.addEventListener("DOMContentLoaded", () => {
  const accordionItems = document.querySelectorAll(".accordion-item");
  const leftImages = document.querySelectorAll(".accordion-left-img");

  let activeIndex = 0; // 👈 default first image

  // function to show image
  function showImage(index) {
    leftImages.forEach((img) => img.classList.remove("active"));
    const targetImg = document.querySelector(
      `.accordion-left-img[data-index="${index}"]`
    );
    if (targetImg) targetImg.classList.add("active");
  }

  // initial image
  showImage(activeIndex);

  accordionItems.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      activeIndex = item.getAttribute("data-index"); // 👈 store last hovered
      showImage(activeIndex);
    });

   
  });
});

// Parallax section //
const slider = document.getElementById("slider");
const section = document.getElementById("section");

let maxScroll = 0;

function calculateMaxScroll() {
  const sliderWidth = slider.scrollWidth;
  const screenWidth = window.innerWidth;
  maxScroll = sliderWidth - screenWidth + 80; // avoid right gap
}

calculateMaxScroll();
window.addEventListener("resize", calculateMaxScroll);

window.addEventListener("scroll", () => {
  const rect = section.getBoundingClientRect();
  const scrollProgress =
    -rect.top / (section.offsetHeight - window.innerHeight);

  let move = scrollProgress * maxScroll;

  // clamp value (IMPORTANT FIX)
  move = Math.max(0, Math.min(move, maxScroll));

  slider.style.transform = `translateX(-${move}px)`;
});

function moveLeft() {
  const current = getTranslateX();
  let newVal = current - 300;
  newVal = Math.max(0, newVal);
  slider.style.transform = `translateX(-${newVal}px)`;
}

function moveRight() {
  const current = getTranslateX();
  let newVal = current + 300;
  newVal = Math.min(maxScroll, newVal);
  slider.style.transform = `translateX(-${newVal}px)`;
}

function getTranslateX() {
  const style = window.getComputedStyle(slider);
  const matrix = new WebKitCSSMatrix(style.transform);
  return Math.abs(matrix.m41);
}

const cards = document.querySelectorAll(".card");

cards.forEach(card => {
  const video = card.querySelector("video");

  card.addEventListener("mouseenter", () => {
    video.play();
  });

  card.addEventListener("mouseleave", () => {
    video.pause();
    video.currentTime = 0; // optional (reset)
  });
});

