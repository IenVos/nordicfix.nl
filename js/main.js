// ====================================
// Mobile Menu Toggle
// ====================================
document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;

    if (!menuToggle || !navLinks) return;

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

    // Close on outside click
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
});

// ====================================
// Video Controls
// ====================================
document.addEventListener('DOMContentLoaded', function () {
    const video = document.querySelector('.video-background video');

    if (!video) return;

    video.removeAttribute('controls');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.setAttribute('muted', '');
    video.muted = true;
    video.style.pointerEvents = 'none';

    video.addEventListener('contextmenu', e => e.preventDefault());

    const playVideo = () => {
        video.play().catch(() => {
            document.addEventListener('touchstart', () => video.play(), { once: true });
        });
    };

    playVideo();
});

// ====================================
// Smooth Scroll
// ====================================
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();

            const offsetTop = target.offsetTop - 90;

            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        });
    });
});

// ====================================
// Intersection Observer for Animations
// ====================================
document.addEventListener('DOMContentLoaded', function () {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe service cards and USP items
    const animatedElements = document.querySelectorAll('.service-card, .usp-item');

    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
});

// ====================================
// Active Navigation Link
// ====================================
document.addEventListener('DOMContentLoaded', function () {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-links a:not(.cta-button)');

    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkPath = new URL(link.href).pathname;

        if (currentPath === linkPath || (currentPath.includes(linkPath) && linkPath !== '/')) {
            link.classList.add('active');
        }
    });
});

// ====================================
// Cookie Banner
// ====================================
document.addEventListener('DOMContentLoaded', function () {
    function setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = name + '=' + value + ';expires=' + expires.toUTCString() + ';path=/';
    }

    function getCookie(name) {
        const nameEQ = name + '=';
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    function showCookieBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.style.display = 'block';
            setTimeout(() => {
                banner.style.opacity = '1';
                banner.style.transform = 'translateY(0)';
            }, 100);
        }
    }

    function hideCookieBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.style.opacity = '0';
            banner.style.transform = 'translateY(20px)';
            setTimeout(() => {
                banner.style.display = 'none';
            }, 300);
        }
    }

    function loadAnalytics() {
        console.log('Analytics loaded - user accepted cookies');
    }

    // Check if user has already made a choice
    if (!getCookie('cookieConsent')) {
        showCookieBanner();
    }

    // Cookie banner event listeners
    const acceptBtn = document.getElementById('accept-cookies');
    const rejectBtn = document.getElementById('reject-cookies');

    if (acceptBtn) {
        acceptBtn.addEventListener('click', function () {
            setCookie('cookieConsent', 'accepted', 365);
            hideCookieBanner();
            loadAnalytics();
        });
    }

    if (rejectBtn) {
        rejectBtn.addEventListener('click', function () {
            setCookie('cookieConsent', 'rejected', 365);
            hideCookieBanner();
        });
    }

    // If user accepted cookies, load analytics
    if (getCookie('cookieConsent') === 'accepted') {
        loadAnalytics();
    }
});

// ====================================
// Technologies "Show More" - FIXED!
// ====================================
document.addEventListener('DOMContentLoaded', function () {
    const techSection = document.querySelector('.extra-services');
    if (!techSection) return;

    const grid = techSection.querySelector('.extra-services-grid');
    if (!grid) return;

    const cards = Array.from(grid.querySelectorAll('.extra-service-card'));
    const VISIBLE_COUNT = 6;

    if (cards.length <= VISIBLE_COUNT) return;

    // Check if button already exists (prevent duplicates)
    if (techSection.querySelector('.show-more-tech')) return;

    // Hide cards after 6th
    cards.forEach((card, index) => {
        if (index >= VISIBLE_COUNT) {
            card.style.display = 'none';
            card.classList.add('hidden-tech');
        }
    });

    // Create button
    const btn = document.createElement('button');
    btn.className = 'btn btn-secondary show-more-tech';
    btn.style.cssText = 'margin: 40px auto 0; display: block;';
    btn.innerHTML = 'Bekijk alle tools <span class="toggle-icon">▼</span>';

    grid.insertAdjacentElement('afterend', btn);

    let isExpanded = false;

    btn.addEventListener('click', function () {
        isExpanded = !isExpanded;

        cards.forEach((card, index) => {
            if (index >= VISIBLE_COUNT) {
                if (isExpanded) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50 * (index - VISIBLE_COUNT));
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(30px)';
                    setTimeout(() => card.style.display = 'none', 300);
                }
            }
        });

        btn.innerHTML = isExpanded
            ? 'Toon minder <span class="toggle-icon">▲</span>'
            : 'Bekijk alle tools <span class="toggle-icon">▼</span>';

        if (!isExpanded) {
            setTimeout(() => {
                techSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 300);
        }
    });

    // Separate observer for extra-service-cards
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                cardObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Only observe visible cards initially
    cards.forEach((card, index) => {
        if (index < VISIBLE_COUNT) {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            cardObserver.observe(card);
        }
    });
});