// ====================================
// Mobile Menu Toggle - VERBETERD
// ====================================
document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;

    // Debug check - kun je verwijderen na testen
    console.log('Menu elements found:', { menuToggle: !!menuToggle, navLinks: !!navLinks });

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            const isActive = navLinks.classList.contains('active');

            navLinks.classList.toggle('active');
            this.classList.toggle('active');

            // Prevent body scroll when menu is open (FIX!)
            if (!isActive) {
                body.style.overflow = 'hidden';
            } else {
                body.style.overflow = '';
            }

            console.log('Menu toggled, active:', !isActive); // Debug - kun je verwijderen
        });

        // Close mobile menu when clicking on a link
        const navLinkItems = navLinks.querySelectorAll('a');
        navLinkItems.forEach(link => {
            link.addEventListener('click', function () {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
                body.style.overflow = ''; // Reset scroll
            });
        });

        // Close menu when clicking outside (NIEUW!)
        document.addEventListener('click', function (e) {
            if (navLinks.classList.contains('active')) {
                if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
                    navLinks.classList.remove('active');
                    menuToggle.classList.remove('active');
                    body.style.overflow = '';
                }
            }
        });
    } else {
        console.error('Mobile menu elements not found!'); // Debug
    }
});

// ====================================
// Video Controls Fix - NIEUW!
// ====================================
document.addEventListener('DOMContentLoaded', function () {
    const video = document.querySelector('.video-background video');

    if (video) {
        console.log('Video element found'); // Debug

        // Remove all controls completely
        video.removeAttribute('controls');
        video.setAttribute('playsinline', 'true');
        video.setAttribute('webkit-playsinline', 'true');
        video.setAttribute('muted', 'true');

        // Prevent right-click context menu
        video.addEventListener('contextmenu', function (e) {
            e.preventDefault();
            return false;
        });

        // Prevent any interaction with video
        video.style.pointerEvents = 'none';

        // Force autoplay (especially on mobile)
        const playPromise = video.play();

        if (playPromise !== undefined) {
            playPromise.then(function () {
                console.log('Video autoplay started');
            }).catch(function (error) {
                console.log('Video autoplay prevented:', error);
                // Retry after user interaction
                document.addEventListener('touchstart', function () {
                    video.play();
                }, { once: true });
            });
        }
    } else {
        console.log('No video element found');
    }
});

// ====================================
// Smooth Scroll for Anchor Links
// ====================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const target = document.querySelector(href);
            const offsetTop = target.offsetTop - 90;

            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ====================================
// Intersection Observer for Animations
// ====================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe service cards and USP items
document.addEventListener('DOMContentLoaded', function () {
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
function setActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-links a:not(.cta-button)');

    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkPath = new URL(link.href).pathname;

        if (currentPath === linkPath ||
            (currentPath.includes(linkPath) && linkPath !== '/')) {
            link.classList.add('active');
        }
    });
}

document.addEventListener('DOMContentLoaded', setActiveNavLink);