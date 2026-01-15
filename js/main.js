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
        const isActive = navLinks.classList.toggle('active');
        this.classList.toggle('active');
        body.style.overflow = isActive ? 'hidden' : '';
    });

    navLinks.addEventListener('click', function (e) {
        if (e.target.tagName === 'A') {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
            body.style.overflow = '';
        }
    });
});

// ====================================
// Video Controls (Bulletproof)
// ====================================
(function () {
    const playVideo = () => {
        const video = document.querySelector('.video-background video');
        if (!video) return;

        video.muted = true;
        video.setAttribute('muted', '');
        video.setAttribute('playsinline', '');

        const promise = video.play();
        if (promise !== undefined) {
            promise.catch(() => {
                // Autoplay geblokkeerd, probeer opnieuw bij interactie
                const retry = () => {
                    video.play();
                    window.removeEventListener('click', retry);
                    window.removeEventListener('touchstart', retry);
                };
                window.addEventListener('click', retry);
                window.addEventListener('touchstart', retry);
            });
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', playVideo);
    } else {
        playVideo();
    }
})();

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
            window.scrollTo({
                top: target.offsetTop - 90,
                behavior: 'smooth'
            });
        });
    });
});

// ====================================
// Intersection Observer (Animations)
// ====================================
document.addEventListener('DOMContentLoaded', function () {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.service-card, .usp-item, .extra-service-card').forEach((el, i) => {
        if (window.getComputedStyle(el).display !== 'none') {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`;
            observer.observe(el);
        }
    });
});

// ====================================
// SHOW MORE / TOGGLE LOGIC (Platforms & Tools)
// ====================================
document.addEventListener('DOMContentLoaded', function () {

    // 1. HANDMATIGE TOGGLES (Voor de knoppen die je zelf in de HTML zet)
    function setupManualToggle(buttonId, hiddenClass, closedText) {
        const btn = document.getElementById(buttonId);
        if (!btn) return;

        const hiddenItems = document.querySelectorAll('.' + hiddenClass);
        const textSpan = btn.querySelector('.toggle-text') || btn;
        const iconSpan = btn.querySelector('.toggle-icon');
        let isExpanded = false;

        btn.addEventListener('click', function () {
            isExpanded = !isExpanded;
            hiddenItems.forEach((item, index) => {
                if (isExpanded) {
                    item.style.display = 'block';
                    setTimeout(() => item.style.opacity = '1', index * 50);
                } else {
                    item.style.display = 'none';
                }
            });

            textSpan.textContent = isExpanded ? 'Toon minder' : closedText;
            if (iconSpan) iconSpan.textContent = isExpanded ? '↑' : '↓';

            if (!isExpanded) {
                btn.closest('section').scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Activeer handmatige knoppen
    setupManualToggle('togglePlatforms', 'hidden-platform', 'Bekijk alle platforms');
    setupManualToggle('toggleServices', 'hidden-service', 'Toon alle diensten');
    setupManualToggle('toggleTech', 'hidden-tech', 'Bekijk alle tools');
    setupManualToggle('togglePlatforms2', 'hidden-platform-2', 'Bekijk alle platforms');
    setupManualToggle('toggleTools', 'hidden-tools', 'Bekijk alle tools');


    // 2. AUTOMATISCHE TOOL TOGGLE (Voor andere pagina's zonder handmatige knop)
    const techGrid = document.querySelector('.tech-grid');
    // Alleen uitvoeren als de grid bestaat EN er nog geen handmatige knop is
    if (techGrid && !document.getElementById('toggleTech')) {
        const cards = techGrid.querySelectorAll('.tech-card');
        const VISIBLE_COUNT = 6;

        if (cards.length > VISIBLE_COUNT) {
            const btn = document.createElement('button');
            btn.className = 'btn btn-secondary show-more-tech';
            btn.style.cssText = 'margin: 40px auto 0; display: block;';
            btn.innerHTML = 'Bekijk alle tools <span class="toggle-icon">▼</span>';
            techGrid.insertAdjacentElement('afterend', btn);

            let isExpanded = false;
            cards.forEach((card, index) => {
                if (index >= VISIBLE_COUNT) card.style.display = 'none';
            });

            btn.addEventListener('click', function () {
                isExpanded = !isExpanded;
                cards.forEach((card, index) => {
                    if (index >= VISIBLE_COUNT) {
                        card.style.display = isExpanded ? 'block' : 'none';
                    }
                });
                btn.innerHTML = isExpanded ? 'Toon minder ▲' : 'Bekijk alle tools ▼';
            });
        }
    }
});

// ====================================
// Cookie Banner & Active Nav
// ====================================
document.addEventListener('DOMContentLoaded', function () {
    // Active Nav
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-links a:not(.cta-button)').forEach(link => {
        if (currentPath.includes(link.getAttribute('href'))) link.classList.add('active');
    });

    // Cookie Banner Logic
    const banner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies');
    const rejectBtn = document.getElementById('reject-cookies');

    if (banner && !localStorage.getItem('cookieConsent')) {
        banner.style.display = 'block';
        // Trigger animation na korte delay
        setTimeout(() => {
            banner.style.opacity = '1';
            banner.style.transform = 'translateY(0)';
        }, 100);

        // Accept button
        if (acceptBtn) {
            acceptBtn.addEventListener('click', () => {
                localStorage.setItem('cookieConsent', 'accepted');
                banner.style.opacity = '0';
                banner.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    banner.style.display = 'none';
                }, 300);
            });
        }

        // Reject button
        if (rejectBtn) {
            rejectBtn.addEventListener('click', () => {
                localStorage.setItem('cookieConsent', 'rejected');
                banner.style.opacity = '0';
                banner.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    banner.style.display = 'none';
                }, 300);
            });
        }
    }
});