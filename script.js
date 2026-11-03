document.addEventListener('DOMContentLoaded', function () {
    // 1. Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 2. Simple Reveal on Scroll Animation
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // 3. Meta Pixel: registra o clique no botao de compra (InitiateCheckout)
    document.querySelectorAll('a[href*="pay.cakto.com.br"]').forEach(link => {
        link.addEventListener('click', function () {
            if (typeof fbq === 'function') {
                fbq('track', 'InitiateCheckout', {
                    content_name: 'Guia Antes de Clicar',
                    value: 27.90,
                    currency: 'BRL'
                });
            }
        });
    });

    // 4. Mobile Touch Feedback (Active State Helper)
    // Adds a '.touch-active' class on touch interactions to simulate :hover on mobile
    const interactiveSelectors = [
        '.cta-button',
        '.checklist-item',
        '.feature-item',
        '.benefit-card',
        '.bonus-card',
        '.bonus-card-clean',
        '.bonus-card-design',
    ];

    interactiveSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            el.addEventListener('touchstart', function () {
                this.classList.add('touch-active');
            }, { passive: true });

            el.addEventListener('touchend', function () {
                // Small delay to let the animation show
                setTimeout(() => {
                    this.classList.remove('touch-active');
                }, 200);
            });

            // Cancel on touch move/cancel
            el.addEventListener('touchcancel', () => el.classList.remove('touch-active'));
        });
    });

    console.log("Antes de Clicar mobile-optimized scripts loaded.");
});
