// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function () {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function () {
            navLinks.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });

        // Sluit menu bij klik op link
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', function () {
                navLinks.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            });
        });
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
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

/// Observe all animated elements
document.addEventListener('DOMContentLoaded', function () {
    // Alleen extra service cards animeren
    const extraServiceCards = document.querySelectorAll('.extra-service-card');
    extraServiceCards.forEach(item => observer.observe(item));
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