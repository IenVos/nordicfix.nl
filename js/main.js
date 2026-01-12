// ====================================
// Mobile Menu Toggle - OPTIMIZED
// ====================================
(function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;

    if (!menuToggle || !navLinks) {
        console.warn('Mobile menu elements not found');
        return;
    }

    // Toggle menu
    menuToggle.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();

        const isActive = navLinks.classList.toggle('active');
        this.classList.toggle('active');
        body.style.overflow = isActive ? 'hidden' : '';
    });

    // Close on link click
    navLinks.addEventListener('click', function (e) {
        if (e.target.tagName === 'A') {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
            body.style.overflow = '';
        }
    });

    // Close on outside click (EVENT DELEGATION)
    document.addEventListener('click', function (e) {
        if (navLinks.classList.contains('active') &&
            !navLinks.contains(e.target) &&
            !menuToggle.contains(e.target)) {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
            body.style.overflow = '';
        }
    });

    // Close on ESC key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
            body.style.overflow = '';
        }
    });
})();

// ====================================
// Video Controls - OPTIMIZED
// ====================================
(function initVideoBackground() {
    const video = document.querySelector('.video-background video');

    if (!video) return;

    // Configure video attributes
    Object.assign(video, {
        controls: false,
        playsInline: true,
        muted: true
    });

    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.style.pointerEvents = 'none';

    // Prevent context menu
    video.addEventListener('contextmenu', e => e.preventDefault());

    // Autoplay with fallback
    const playVideo = () => {
        video.play().catch(() => {
            document.addEventListener('touchstart', () => video.play(), { once: true });
            document.addEventListener('click', () => video.play(), { once: true });
        });
    };

    playVideo();
})();

// ====================================
// Smooth Scroll - OPTIMIZED
// ====================================
(function initSmoothScroll() {
    document.addEventListener('click', function (e) {
        const anchor = e.target.closest('a[href^="#"]');
        if (!anchor) return;

        const href = anchor.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();

        const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 90;

        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    });
})();

// ====================================
// Intersection Observer Animations - OPTIMIZED
// ====================================
(function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Performance: stop observing
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe elements
    document.querySelectorAll('.service-card, .usp-item, .extra-service-card').forEach((el, index) => {
        el.style.cssText = `
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s;
        `;
        observer.observe(el);
    });
})();

// ====================================
// Active Navigation Link - OPTIMIZED
// ====================================
(function setActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-links a:not(.cta-button)');

    navLinks.forEach(link => {
        const linkPath = new URL(link.href, window.location.origin).pathname;
        const isActive = currentPath === linkPath ||
            (linkPath !== '/' && currentPath.includes(linkPath));

        link.classList.toggle('active', isActive);
    });
})();

// ====================================
// Cookie Banner - OPTIMIZED
// ====================================
(function initCookieBanner() {
    const banner = document.getElementById('cookie-banner');
    if (!banner) return;

    const COOKIE_NAME = 'cookieConsent';
    const COOKIE_DAYS = 365;

    // Helper functions
    const setCookie = (value) => {
        const expires = new Date(Date.now() + COOKIE_DAYS * 864e5).toUTCString();
        document.cookie = `${COOKIE_NAME}=${value};expires=${expires};path=/;SameSite=Lax`;
    };

    const getCookie = () => {
        return document.cookie.split('; ').find(row => row.startsWith(COOKIE_NAME + '='))?.split('=')[1];
    };

    const showBanner = () => {
        banner.style.display = 'block';
        requestAnimationFrame(() => {
            banner.style.opacity = '1';
            banner.style.transform = 'translateY(0)';
        });
    };

    const hideBanner = () => {
        banner.style.opacity = '0';
        banner.style.transform = 'translateY(20px)';
        setTimeout(() => banner.style.display = 'none', 300);
    };

    const loadAnalytics = () => {
        console.log('Analytics loaded - user accepted cookies');
        // Add your analytics code here
    };

    // Event handlers
    const handleAccept = () => {
        setCookie('accepted');
        hideBanner();
        loadAnalytics();
    };

    const handleReject = () => {
        setCookie('rejected');
        hideBanner();
    };

    // Initialize
    const consent = getCookie();

    if (!consent) {
        showBanner();
    } else if (consent === 'accepted') {
        loadAnalytics();
    }

    // Event listeners
    document.getElementById('accept-cookies')?.addEventListener('click', handleAccept);
    document.getElementById('reject-cookies')?.addEventListener('click', handleReject);
})();

// ====================================
// Technologies "Show More" - OPTIMIZED
// ====================================
(function initTechShowMore() {
    const techSection = document.querySelector('.extra-services');
    if (!techSection) return;

    const cards = Array.from(techSection.querySelectorAll('.extra-service-card'));
    const VISIBLE_COUNT = 6;

    if (cards.length <= VISIBLE_COUNT) return;

    // Hide cards after 6th
    cards.forEach((card, index) => {
        if (index >= VISIBLE_COUNT) {
            card.style.display = 'none';
            card.classList.add('hidden-tech');
        }
    });

    // Create button
    const grid = techSection.querySelector('.extra-services-grid');
    const btn = document.createElement('button');
    btn.className = 'btn btn-secondary show-more-tech';
    btn.style.cssText = 'margin: 40px auto 0; display: block;';
    btn.innerHTML = 'Bekijk alle tools <span class="toggle-icon">▼</span>';

    grid.parentElement.appendChild(btn);

    let isExpanded = false;

    btn.addEventListener('click', function () {
        isExpanded = !isExpanded;

        cards.forEach((card, index) => {
            if (index >= VISIBLE_COUNT) {
                if (isExpanded) {
                    card.style.display = 'block';
                    setTimeout(() => card.classList.add('visible'), 50 * (index - VISIBLE_COUNT));
                } else {
                    card.style.display = 'none';
                    card.classList.remove('visible');
                }
            }
        });

        btn.innerHTML = isExpanded
            ? 'Toon minder <span class="toggle-icon">▲</span>'
            : 'Bekijk alle tools <span class="toggle-icon">▼</span>';

        // Scroll to section if collapsing
        if (!isExpanded) {
            techSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    });
})();

// ====================================
// Initialize on DOM Ready
// ====================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

function init() {
    // All IIFE functions auto-execute
    console.log('✅ All scripts initialized');
}
