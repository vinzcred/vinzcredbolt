/**
 * VINZCRED - Landing Page Interactions
 * Diego Vinicius - Correspondente Bancario
 */

document.addEventListener('DOMContentLoaded', () => {
  // ========================================
  // HEADER SCROLL EFFECT
  // ========================================
  const header = document.getElementById('header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  });

  // ========================================
  // MOBILE MENU TOGGLE
  // ========================================
  const menuToggle = document.getElementById('menuToggle');
  const navMobile = document.getElementById('navMobile');

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navMobile.classList.toggle('active');
    document.body.style.overflow = navMobile.classList.contains('active') ? 'hidden' : '';
  });

  // Close mobile menu on link click
  navMobile.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navMobile.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // ========================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerHeight = header.offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ========================================
  // ACTIVE NAV LINK ON SCROLL
  // ========================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-desktop .nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - header.offsetHeight - 100;
      if (window.pageYOffset >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // ========================================
  // SCROLL REVEAL ANIMATION
  // ========================================
  const revealElements = () => {
    const reveals = document.querySelectorAll('.stat-card, .produto-card, .diferencial-card, .depoimento-card, .faq-item');
    
    reveals.forEach((element, index) => {
      element.classList.add('reveal');
      element.style.transitionDelay = `${index * 0.05}s`;
    });
  };

  revealElements();

  const revealOnScroll = () => {
    const reveals = document.querySelectorAll('.reveal');
    const windowHeight = window.innerHeight;
    const elementVisible = 100;

    reveals.forEach(reveal => {
      const elementTop = reveal.getBoundingClientRect().top;
      if (elementTop < windowHeight - elementVisible) {
        reveal.classList.add('visible');
      }
    });
  };

  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll(); // Initial check

  // ========================================
  // DEPOIMENTOS CAROUSEL
  // ========================================
  const carousel = document.getElementById('depoimentosCarousel');
  const track = document.getElementById('depoimentosTrack');
  const dots = document.querySelectorAll('.depoimentos-dots .dot');
  let currentSlide = 0;
  let autoPlayInterval;

  const getSlidesPerView = () => {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  };

  const updateCarousel = () => {
    const slidesPerView = getSlidesPerView();
    const totalSlides = track.children.length;
    const maxSlide = Math.max(0, totalSlides - slidesPerView);
    
    // Clamp current slide
    if (currentSlide > maxSlide) currentSlide = maxSlide;
    
    const slideWidth = 100 / slidesPerView;
    const gapOffset = 24; // gap in pixels
    const gapPercent = (gapOffset / carousel.offsetWidth) * 100;
    
    track.style.transform = `translateX(-${currentSlide * (slideWidth + gapPercent / slidesPerView)}%)`;
    
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentSlide);
    });
  };

  const nextSlide = () => {
    const slidesPerView = getSlidesPerView();
    const totalSlides = track.children.length;
    const maxSlide = Math.max(0, totalSlides - slidesPerView);
    
    currentSlide = currentSlide >= maxSlide ? 0 : currentSlide + 1;
    updateCarousel();
  };

  const startAutoPlay = () => {
    autoPlayInterval = setInterval(nextSlide, 5000);
  };

  const stopAutoPlay = () => {
    clearInterval(autoPlayInterval);
  };

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      currentSlide = index;
      updateCarousel();
      stopAutoPlay();
      startAutoPlay();
    });
  });

  carousel.addEventListener('mouseenter', stopAutoPlay);
  carousel.addEventListener('mouseleave', startAutoPlay);

  window.addEventListener('resize', updateCarousel);
  
  startAutoPlay();
  updateCarousel();

  // Touch support for carousel
  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  const handleSwipe = () => {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe left - next
        nextSlide();
      } else {
        // Swipe right - previous
        const slidesPerView = getSlidesPerView();
        currentSlide = currentSlide > 0 ? currentSlide - 1 : 0;
        updateCarousel();
      }
    }
  };

  // ========================================
  // FAQ ACCORDION
  // ========================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all items
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
      });
      
      // Open clicked item if it wasn't active
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // ========================================
  // WHATSAPP FLOAT BUTTON
  // ========================================
  const whatsappFloat = document.querySelector('.whatsapp-float');
  
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      whatsappFloat.style.opacity = '1';
      whatsappFloat.style.visibility = 'visible';
    } else {
      whatsappFloat.style.opacity = '0';
      whatsappFloat.style.visibility = 'hidden';
    }
  });

  // Initial state
  whatsappFloat.style.opacity = '0';
  whatsappFloat.style.visibility = 'hidden';
  whatsappFloat.style.transition = 'opacity 0.3s ease, visibility 0.3s ease, transform 0.3s ease';

  // ========================================
  // PARALLAX EFFECT ON HERO
  // ========================================
  const heroImage = document.querySelector('.hero-image img');
  
  if (heroImage && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * 0.15;
      
      if (scrolled < window.innerHeight) {
        heroImage.style.transform = `translateY(${rate}px)`;
      }
    });
  }

  // ========================================
  // COUNTER ANIMATION FOR STATS
  // ========================================
  const animateCounter = (element, target, suffix = '') => {
    const duration = 2000;
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current) + suffix;
    }, 16);
  };

  // Observe stats for counter animation
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const statNumber = entry.target.querySelector('.stat-number');
        if (statNumber) {
          const text = statNumber.textContent;
          if (text.includes('+')) {
            animateCounter(statNumber, 30, '+');
          } else if (text.includes('100')) {
            statNumber.textContent = '100%';
          }
        }
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-card').forEach(stat => {
    statsObserver.observe(stat);
  });

  // ========================================
  // LAZY LOAD IMAGES
  // ========================================
  const lazyImages = document.querySelectorAll('img[data-src]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
  }

  // ========================================
  // FORM VALIDATION (if forms are added later)
  // ========================================
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone) => {
    const re = /^\(?[1-9]{2}\)? ?(?:[2-8]|9[1-9])[0-9]{3}-?[0-9]{4}$/;
    return re.test(phone);
  };

  // ========================================
  // CONSOLE BRANDING
  // ========================================
  console.log('%cVinzCred', 'font-size: 24px; font-weight: bold; color: #C9A96E;');
  console.log('%cSolucoes Financeiras - Diego Vinicius', 'font-size: 14px; color: #0F1B2E;');
  console.log('%cCorrespondente Bancario', 'font-size: 12px; color: #64748B;');
});
