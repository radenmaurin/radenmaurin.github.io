/* ==========================================================================
   Portfolio Script — Vanilla ES6+ | No Dependencies
   Matched to HTML structure with Lucide icons
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ---------- utility helpers ---------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

  /* ======================================================================
     INITIALIZE LUCIDE ICONS
     ====================================================================== */
  if (window.lucide) {
    lucide.createIcons();
  }

  /* ======================================================================
     1. PRELOADER
     ====================================================================== */
  const preloader = $('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
        setTimeout(() => {
          preloader.style.display = 'none';
        }, 600);
      }, 500);
    });

    // Fallback: hide preloader after 3 seconds max
    setTimeout(() => {
      if (preloader.style.display !== 'none') {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
        setTimeout(() => { preloader.style.display = 'none'; }, 600);
      }
    }, 3000);
  }

  /* ======================================================================
     2. DARK MODE TOGGLE
     ====================================================================== */
  const themeToggle = $('#theme-toggle');
  const root = document.documentElement;

  // Resolve initial theme: saved → system → light
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    root.setAttribute('data-theme', 'dark');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = root.getAttribute('data-theme') === 'dark';
      root.setAttribute('data-theme', isDark ? 'light' : 'dark');
      localStorage.setItem('theme', isDark ? 'light' : 'dark');
    });
  }

  /* ======================================================================
     3. MOBILE MENU
     ====================================================================== */
  const menuToggle = $('#menu-toggle');
  const navLinks = $('#nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navLinks.classList.toggle('active');
      menuToggle.classList.toggle('active');
    });

    // Close when a link is clicked
    $$('.nav-link', navLinks).forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
      }
    });
  }

  /* ======================================================================
     4. SMOOTH SCROLL (nav links)
     ====================================================================== */
  $$('.nav-link').forEach((link) => {
    link.addEventListener('click', (e) => {
      const sectionId = link.getAttribute('data-section');
      const target = sectionId && $(`#${sectionId}`);
      if (target) {
        e.preventDefault();
        const navHeight = $('.navbar')?.offsetHeight || 0;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // Hero CTA buttons
  const scrollToSection = (btnId, sectionId) => {
    const btn = $(btnId);
    if (btn) {
      btn.addEventListener('click', (e) => {
        const target = $(sectionId);
        if (target) {
          e.preventDefault();
          const navHeight = $('.navbar')?.offsetHeight || 0;
          window.scrollTo({
            top: target.getBoundingClientRect().top + window.scrollY - navHeight,
            behavior: 'smooth',
          });
        }
      });
    }
  };

  scrollToSection('#view-projects-btn', '#projects');
  scrollToSection('#contact-btn', '#contact');

  /* ======================================================================
     5. NAVBAR SCROLL CLASS
     ====================================================================== */
  const navbar = $('.navbar');

  function handleNavbarScroll() {
    if (!navbar) return;
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  /* ======================================================================
     6. TYPING ANIMATION
     ====================================================================== */
  const typedEl = $('#typed-text');
  const typingStrings = [
    'PMO & Project Control Specialist',
    'Tender & Procurement Specialist',
    'Oil & Gas Compliance Professional',
    'Project Management Professional',
  ];

  if (typedEl) {
    let stringIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    const TYPE_SPEED = 80;
    const DELETE_SPEED = 40;
    const PAUSE_AFTER_TYPE = 1800;
    const PAUSE_AFTER_DELETE = 400;

    function typeStep() {
      const current = typingStrings[stringIdx];

      if (!isDeleting) {
        typedEl.textContent = current.substring(0, charIdx + 1);
        charIdx++;
        if (charIdx === current.length) {
          isDeleting = true;
          setTimeout(typeStep, PAUSE_AFTER_TYPE);
          return;
        }
        setTimeout(typeStep, TYPE_SPEED);
      } else {
        typedEl.textContent = current.substring(0, charIdx - 1);
        charIdx--;
        if (charIdx === 0) {
          isDeleting = false;
          stringIdx = (stringIdx + 1) % typingStrings.length;
          setTimeout(typeStep, PAUSE_AFTER_DELETE);
          return;
        }
        setTimeout(typeStep, DELETE_SPEED);
      }
    }

    typeStep();
  }

  /* ======================================================================
     7. SCROLL ANIMATIONS (IntersectionObserver)
     ====================================================================== */
  const scrollAnimateObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          scrollAnimateObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  $$('.scroll-animate').forEach((el) => scrollAnimateObserver.observe(el));

  /* ======================================================================
     8. SKILL BAR ANIMATION
     ====================================================================== */
  const skillBars = $$('.skill-bar');

  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const fill = $('.skill-fill', entry.target);
          const pct = entry.target.getAttribute('data-percentage') || '0';
          if (fill) {
            fill.style.width = `${pct}%`;
          }
          skillObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  skillBars.forEach((bar) => {
    const fill = $('.skill-fill', bar);
    if (fill) fill.style.width = '0%';
    skillObserver.observe(bar);
  });

  /* ======================================================================
     9. COUNTER ANIMATION
     ====================================================================== */
  const statNumbers = $$('.stat-number');

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10) || 0;
    const duration = 2000;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = clamp(elapsed / duration, 0, 1);
      const eased = 1 - (1 - progress) * (1 - progress);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target;
      }
    }

    requestAnimationFrame(tick);
  }

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach((el) => counterObserver.observe(el));

  /* ======================================================================
     10. PROJECT FILTER
     ====================================================================== */
  const filterBtns = $$('.filter-btn');
  const projectCards = $$('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        const shouldShow = filter === 'all' || category === filter;

        if (shouldShow) {
          card.style.display = '';
          requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = '';
          });
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.8)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  /* ======================================================================
     11. PROJECT MODAL
     ====================================================================== */
  const modal = $('#project-modal');
  const modalClose = $('#modal-close');
  const modalTitle = $('#modal-title');
  const modalDescription = $('#modal-description');
  const modalTech = $('#modal-tech');
  const modalChallenge = $('#modal-challenge');
  const modalSolution = $('#modal-solution');
  const modalResult = $('#modal-result');

  function openModal(card) {
    if (!modal) return;

    // Read data attributes from the card
    if (modalTitle) modalTitle.textContent = card.getAttribute('data-title') || '';
    if (modalDescription) modalDescription.textContent = card.getAttribute('data-description') || '';
    if (modalTech) modalTech.textContent = card.getAttribute('data-tech') || '';
    if (modalChallenge) modalChallenge.textContent = card.getAttribute('data-challenge') || '';
    if (modalSolution) modalSolution.textContent = card.getAttribute('data-solution') || '';
    if (modalResult) modalResult.textContent = card.getAttribute('data-result') || '';

    // Optional: completion certificate button
    const certSection = $('#modal-cert-section');
    const certBtn = $('#modal-cert-btn');
    const certPath = card.getAttribute('data-certificate');
    if (certSection && certBtn) {
      if (certPath) {
        certBtn.setAttribute('data-certificate', certPath);
        certBtn.setAttribute('data-certificate-title', card.getAttribute('data-title') || 'Certificate');
        certSection.style.display = '';
      } else {
        certSection.style.display = 'none';
      }
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Delegate click on detail buttons
  document.addEventListener('click', (e) => {
    const detailBtn = e.target.closest('.project-details-btn');
    if (detailBtn) {
      const card = detailBtn.closest('.project-card');
      if (card) openModal(card);
    }
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);

  // Close on overlay click
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // Close on Escape key (skip if the certificate lightbox is on top — it has its own handler)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !$('#cert-lightbox')?.classList.contains('active')) {
      closeModal();
    }
  });

  /* ======================================================================
     11b. CERTIFICATE LIGHTBOX
     ====================================================================== */
  const certLightbox = $('#cert-lightbox');
  const certLightboxImg = $('#cert-lightbox-img');
  const certLightboxCaption = $('#cert-lightbox-caption');
  const certLightboxClose = $('#cert-lightbox-close');

  function openCertLightbox(src, caption) {
    if (!certLightbox || !certLightboxImg) return;

    // Preload first so a missing file shows a friendly toast, not a broken image
    const probe = new Image();
    probe.onload = () => {
      certLightboxImg.src = src;
      if (certLightboxCaption) certLightboxCaption.textContent = caption || '';
      certLightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    };
    probe.onerror = () => {
      showToast('Certificate file not found yet — add it to the assets/certificates folder.', 'error');
    };
    probe.src = src;
  }

  function closeCertLightbox() {
    if (!certLightbox) return;
    certLightbox.classList.remove('active');
    // Only restore scroll if the project modal isn't open underneath
    if (!modal || !modal.classList.contains('active')) {
      document.body.style.overflow = '';
    }
    if (certLightboxImg) certLightboxImg.src = '';
  }

  // Delegate clicks from any .cert-view-btn (cert cards + project modal button)
  document.addEventListener('click', (e) => {
    const viewBtn = e.target.closest('.cert-view-btn');
    if (!viewBtn) return;
    const src = viewBtn.getAttribute('data-certificate');
    if (!src) return;

    // Caption: explicit attribute, or the title of the surrounding cert card
    let caption = viewBtn.getAttribute('data-certificate-title');
    if (!caption) {
      const card = viewBtn.closest('.cert-card');
      caption = card ? ($('.cert-title', card)?.textContent || '') : '';
    }
    openCertLightbox(src, caption);
  });

  if (certLightboxClose) certLightboxClose.addEventListener('click', closeCertLightbox);

  if (certLightbox) {
    certLightbox.addEventListener('click', (e) => {
      if (e.target === certLightbox) closeCertLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && certLightbox?.classList.contains('active')) {
      closeCertLightbox();
    }
  });

  /* ======================================================================
     12. SCROLL PROGRESS BAR
     ====================================================================== */
  const scrollProgress = $('.scroll-progress');

  function updateScrollProgress() {
    if (!scrollProgress) return;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    scrollProgress.style.width = `${pct}%`;
  }

  /* ======================================================================
     13. SCROLL TO TOP BUTTON
     ====================================================================== */
  const scrollTopBtn = $('#scroll-top');

  function handleScrollTop() {
    if (!scrollTopBtn) return;
    if (window.scrollY > 300) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  }

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ======================================================================
     14. ACTIVE SECTION HIGHLIGHT
     ====================================================================== */
  const sections = $$('section[id]');
  const navLinkEls = $$('.nav-link');

  function highlightActiveSection() {
    const scrollPos = window.scrollY;
    const navHeight = navbar?.offsetHeight || 0;

    let currentId = '';

    sections.forEach((section) => {
      const top = section.offsetTop - navHeight - 100;
      const bottom = top + section.offsetHeight;
      if (scrollPos >= top && scrollPos < bottom) {
        currentId = section.id;
      }
    });

    navLinkEls.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('data-section') === currentId);
    });
  }

  /* ======================================================================
     15. CONTACT FORM
     ====================================================================== */
  const contactForm = $('#contact-form');
  const toast = $('#toast');
  const toastMessage = $('#toast-message');

  function showToast(message, type = 'success') {
    if (toast && toastMessage) {
      toastMessage.textContent = message;
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 3500);
    }
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = ($('#name')?.value || '').trim();
      const email = ($('#email')?.value || '').trim();
      const subject = ($('#subject')?.value || '').trim();
      const message = ($('#message')?.value || '').trim();

      if (!name || !email || !subject || !message) {
        showToast('Please fill in all fields.', 'error');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showToast('Please enter a valid email address.', 'error');
        return;
      }

      // Static site (no backend) — hand off to the visitor's own email client
      // with everything pre-filled, rather than pretending to submit a form.
      const mailBody = `Name: ${name}\nEmail: ${email}\n\n${message}`;
      const mailtoUrl = `mailto:radenmaurin@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(mailBody)}`;

      showToast('Opening your email app to send this message...');
      window.location.href = mailtoUrl;
    });
  }

  /* ======================================================================
     16. PARALLAX EFFECT (Hero)
     ====================================================================== */
  const hero = $('#hero');

  function handleParallax() {
    if (!hero) return;
    const speed = 0.35;
    const offset = window.scrollY * speed;
    hero.style.backgroundPositionY = `${offset}px`;
  }

  /* ======================================================================
     17. VISITOR COUNTER
     ====================================================================== */
  const visitorCountEl = $('#visitor-count');

  if (visitorCountEl) {
    let count = parseInt(localStorage.getItem('visitorCount'), 10) || 0;
    const hasVisited = sessionStorage.getItem('hasVisited');

    if (!hasVisited) {
      count++;
      localStorage.setItem('visitorCount', count);
      sessionStorage.setItem('hasVisited', 'true');
    }

    visitorCountEl.textContent = count;
  }

  /* ======================================================================
     18. SCROLL REVEAL STAGGER (grid items)
     ====================================================================== */
  const staggerObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const parent = entry.target;
          const children = $$(
            '.project-card, .skill-category, .cert-card, .blog-card, .stat-card, .education-card',
            parent
          );
          children.forEach((child, i) => {
            child.style.transitionDelay = `${i * 0.1}s`;
            child.classList.add('animate');
          });
          staggerObserver.unobserve(parent);
        }
      });
    },
    { threshold: 0.05 }
  );

  $$('.project-grid, .skills-dashboard, .cert-grid, .blog-grid, .about-stats, .education-grid').forEach(
    (section) => staggerObserver.observe(section)
  );

  /* ======================================================================
     19. TIMELINE ANIMATION
     ====================================================================== */
  const timelineItems = $$('.timeline-item');

  const timelineObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          timelineObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  timelineItems.forEach((item, index) => {
    item.style.transitionDelay = `${index * 0.15}s`;
    timelineObserver.observe(item);
  });

  /* ======================================================================
     20. PARTICLE EFFECT (Hero — uses existing canvas)
     ====================================================================== */
  function initParticles() {
    const canvas = $('#particles-canvas');
    if (!canvas || !hero) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    const PARTICLE_COUNT = 60;
    const isDarkMode = () => root.getAttribute('data-theme') === 'dark';

    function resize() {
      canvas.width = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.4 + 0.1;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
      }

      draw() {
        const dark = isDarkMode();
        const color = dark ? '255, 255, 255' : '30, 58, 95';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${this.opacity})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }

    function drawLines() {
      const maxDist = 120;
      const dark = isDarkMode();
      const color = dark ? '255, 255, 255' : '30, 58, 95';
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.12;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${color}, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    let animFrameId;

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      drawLines();
      animFrameId = requestAnimationFrame(animate);
    }

    // Only run animation when hero is visible
    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animate();
        } else {
          cancelAnimationFrame(animFrameId);
        }
      },
      { threshold: 0 }
    );
    heroObserver.observe(hero);
  }

  initParticles();

  /* ======================================================================
     21. JOURNEY ITEMS ANIMATION
     ====================================================================== */
  const journeyItems = $$('.journey-item');
  const journeyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          journeyObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  journeyItems.forEach((item, index) => {
    item.style.transitionDelay = `${index * 0.15}s`;
    journeyObserver.observe(item);
  });

  /* ======================================================================
     UNIFIED SCROLL HANDLER (throttled via rAF)
     ====================================================================== */
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        handleNavbarScroll();
        updateScrollProgress();
        handleScrollTop();
        highlightActiveSection();
        handleParallax();
        ticking = false;
      });
      ticking = true;
    }
  });

  // Initial calls
  handleNavbarScroll();
  updateScrollProgress();
  handleScrollTop();
  highlightActiveSection();

  /* ======================================================================
     DOWNLOAD CV BUTTON
     ====================================================================== */
  const downloadCvBtn = $('#download-cv-btn');
  if (downloadCvBtn) {
    downloadCvBtn.addEventListener('click', (e) => {
      if (!downloadCvBtn.getAttribute('href') || downloadCvBtn.getAttribute('href') === '#') {
        e.preventDefault();
        showToast('CV download will be available soon!');
      }
    });
  }

  /* ======================================================================
     SMOOTH SCROLL for anchor links in footer and elsewhere
     ====================================================================== */
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#' || link.classList.contains('nav-link')) return;
      const target = $(href);
      if (target) {
        e.preventDefault();
        const navHeight = navbar?.offsetHeight || 0;
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - navHeight,
          behavior: 'smooth'
        });
      }
    });
  });
});
