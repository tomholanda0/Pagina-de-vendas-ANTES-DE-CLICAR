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

    // 3. Auto-Scroll Logic for Testimonials (Mobile Optimized)
    const slider = document.querySelector('.testimonials-slider');
    if (slider) {
        // Clone children for infinite loop effect
        const items = Array.from(slider.children);
        items.forEach(item => {
            const clone = item.cloneNode(true);
            // Ensure clones are also interactive
            slider.appendChild(clone);
        });

        let isPaused = false;
        let speed = 0.5;
        let animationId;
        let pauseTimeout;

        // Use Pointer Events for unified Mouse/Touch handling
        // Pause on interaction
        const pauseSlider = () => {
            isPaused = true;
            if (pauseTimeout) clearTimeout(pauseTimeout);
        };

        // Resume with delay
        const resumeSlider = () => {
            pauseTimeout = setTimeout(() => {
                isPaused = false;
            }, 3000);
        };

        // Pointer events cover both mouse and touch (if supported)
        slider.addEventListener('pointerenter', pauseSlider);
        slider.addEventListener('pointerleave', resumeSlider);

        // Mobile specific fallbacks/reinforcement
        slider.addEventListener('touchstart', pauseSlider, { passive: true });
        slider.addEventListener('touchend', resumeSlider);

        function autoScroll() {
            if (!isPaused && slider) {
                slider.scrollLeft += speed;

                // Reset if reached halfway
                if (slider.scrollLeft >= (slider.scrollWidth / 2)) {
                    slider.scrollLeft = 0;
                }
            }
            animationId = requestAnimationFrame(autoScroll);
        }

        // Start the loop
        animationId = requestAnimationFrame(autoScroll);
    }

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
        '.testimonial-card',
        '.testimonial-card-slider'
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
