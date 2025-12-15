// menu.js - Shared Menu Component for Myr-Studio
// This file creates a consistent menu across all pages

(function () {
    // Menu HTML template
    const menuHTML = `
        <header class="site-header">
            <a href="index.html" class="logo load-item">Myr-Studio</a>

            <div class="header-right load-item">
                <div class="menu-container">
                    <div class="menu-trigger" id="menu-trigger">
                        <span class="line line-1"></span>
                        <span class="line line-2"></span>
                    </div>

                    <!-- Menu Popover -->
                    <nav class="menu-dropdown" id="menu-dropdown">
                        <div class="menu-close-btn" id="menu-close-btn">
                            <span class="close-line"></span>
                            <span class="close-line"></span>
                        </div>
                        <ul class="nav-links">
                            <li><a href="index.html" class="menu-link">Home</a></li>
                            <li><a href="index.html#work" class="menu-link">Work</a></li>
                            <li><a href="index.html#savoir" class="menu-link">Savoir-Faire</a></li>
                            <li><a href="index.html#heritage" class="menu-link">Heritage</a></li>
                            <li><a href="sustainability.html" class="menu-link">Sustainability</a></li>
                            <li><a href="contact.html" class="menu-link">Contact</a></li>
                            <li><a href="cart.html" class="menu-link">Cart (<span id="cart-count">0</span>)</a></li>
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    `;

    // Function to inject menu
    function injectMenu() {
        // Find placeholder or existing header
        const existingHeader = document.querySelector('.site-header');
        const placeholder = document.getElementById('menu-placeholder');

        if (placeholder) {
            // Insert menu HTML at placeholder location
            placeholder.outerHTML = menuHTML;
        } else if (existingHeader) {
            // Replace existing header with standardized menu
            existingHeader.outerHTML = menuHTML;
        } else {
            // Insert at beginning of body
            document.body.insertAdjacentHTML('afterbegin', menuHTML);
        }

        // Ensure body has is-loading class for animations
        if (!document.body.classList.contains('is-loading') && !document.body.classList.contains('loaded')) {
            document.body.classList.add('is-loading');
        }
    }

    // Initialize on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectMenu);
    } else {
        injectMenu();
    }
})();
