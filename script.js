document.addEventListener('DOMContentLoaded', () => {

    // 0. Split Title for Animation
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.innerHTML = '';
        text.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.className = 'title-letter';
            span.style.transitionDelay = `${0.3 + (index * 0.05)}s`;
            heroTitle.appendChild(span);
        });
    }

    // 1. CRITICAL: Show page immediately
    setTimeout(() => {
        document.body.classList.remove('is-loading');
        document.body.classList.add('loaded');
    }, 100);

    // 2. Initialize Lenis
    let lenis = null;
    try {
        if (typeof Lenis !== 'undefined') {
            lenis = new Lenis({
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                direction: 'vertical',
                smooth: true,
                smoothTouch: false,
                touchMultiplier: 2,
            });

            function raf(time) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }
            requestAnimationFrame(raf);
        } else {
            console.warn('Lenis not loaded, using native scroll.');
        }
    } catch (e) {
        console.error('Lenis init error:', e);
    }

    // 3. Menu Logic - TOGGLE via Trigger (morphing lines)
    const menuContainer = document.querySelector('.menu-container');
    const menuTrigger = document.getElementById('menu-trigger');
    const menuLinks = document.querySelectorAll('.menu-link');

    function toggleMenu() {
        if (menuContainer) {
            menuContainer.classList.toggle('active');
        }
    }

    function closeMenu() {
        if (menuContainer) menuContainer.classList.remove('active');
    }

    if (menuTrigger) {
        menuTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });
    }

    document.addEventListener('click', (e) => {
        if (menuContainer && !menuContainer.contains(e.target) && menuContainer.classList.contains('active')) {
            closeMenu();
        }
    });

    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });

    // 4. Cart Logic - Now stores actual items
    const cartCountEl = document.getElementById('cart-count');

    function updateCartCount() {
        if (cartCountEl) {
            const cartItems = JSON.parse(localStorage.getItem('myr_cart_items') || '[]');
            cartCountEl.innerText = cartItems.length;
        }
    }

    // Global function to add item with details
    window.addToCartItem = function (id, title, price, image) {
        let cartItems = JSON.parse(localStorage.getItem('myr_cart_items') || '[]');
        cartItems.push({ id, title, price, image });
        localStorage.setItem('myr_cart_items', JSON.stringify(cartItems));
        localStorage.setItem('myr_cart_count', cartItems.length);
        updateCartCount();
    }

    // Blob Button click animation handler
    document.querySelectorAll('.blob-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Note: inline onclick handles stopPropagation, but this listener will still fire
            btn.classList.add('active');
            setTimeout(() => {
                btn.classList.remove('active');
            }, 3000);
        });
    });

    // Legacy function (backwards compat)
    window.addToCart = function (productId) {
        // This is now deprecated, use addToCartItem
        let count = parseInt(localStorage.getItem('myr_cart_count') || 0);
        count++;
        localStorage.setItem('myr_cart_count', count);
        updateCartCount();
    }

    updateCartCount();


    // 5. Scroll Loop (Animations)
    function updateAnimations() {
        const viewportHeight = window.innerHeight;

        document.querySelectorAll('.scroll-text-block').forEach(block => {
            const rect = block.getBoundingClientRect();
            const blockCenter = rect.top + rect.height / 2;
            const viewportCenter = viewportHeight / 2;
            const distance = Math.abs(blockCenter - viewportCenter);

            let opacity, blur;
            if (distance < 150) {
                opacity = 1;
                blur = 0;
            } else {
                const fadeDistance = distance - 150;
                const maxFade = 300;
                opacity = 1 - (fadeDistance / maxFade);
                opacity = Math.max(0, Math.min(1, opacity));
                blur = (fadeDistance / maxFade) * 10;
                blur = Math.max(0, Math.min(10, blur));
            }
            block.style.opacity = opacity;
            block.style.filter = `blur(${blur}px)`;
        });

        const heritageBg = document.querySelector('.heritage-bg');
        const heritageSection = document.querySelector('.heritage-section');
        if (heritageBg && heritageSection) {
            const rect = heritageSection.getBoundingClientRect();
            if (rect.top < viewportHeight && rect.bottom > 0) {
                const progress = (viewportHeight - rect.top) / (viewportHeight + rect.height);
                const yPos = -10 + (progress * 20);
                heritageBg.style.transform = `translateY(${yPos}%)`;
            }
        }
    }

    // 6. Header Color Logic
    const header = document.querySelector('.site-header');
    const sections = document.querySelectorAll('section');
    const headerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const theme = entry.target.getAttribute('data-theme');
                if (theme === 'light') {
                    header.classList.add('light-theme-active');
                } else {
                    header.classList.remove('light-theme-active');
                }
            }
        });
    }, { rootMargin: "-10% 0px -80% 0px" });

    if (sections.length > 0) {
        sections.forEach(sec => headerObserver.observe(sec));
    }

    // 7. General Reveal
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active-scroll');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal-on-scroll, .scrub-slide-up').forEach(el => observer.observe(el));


    // Loop hook
    if (lenis) {
        lenis.on('scroll', updateAnimations);
    } else {
        window.addEventListener('scroll', updateAnimations);
        window.addEventListener('resize', updateAnimations);
    }
    updateAnimations();

    // Anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                if (lenis) {
                    lenis.scrollTo(target);
                } else {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // Parallax Hero
    const heroImg = document.getElementById('hero-img');
    if (lenis && heroImg) {
        lenis.on('scroll', (e) => {
            heroImg.style.transform = `translateY(${e.scroll * 0.5}px)`;
        });
    }

});
