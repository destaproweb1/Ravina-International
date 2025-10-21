// ========== JAVASCRIPT FUNCTIONALITY ==========

// Initialize global variables
let header, mobileMenuBtn, mobileMenu, sections, backgrounds;
let currentBgIndex = 0;
const bgTransitionInterval = 5000; // 5 seconds

// Cart data - unified system
let cart = JSON.parse(localStorage.getItem('proWorkCart')) || [];
let sportswearCart = JSON.parse(localStorage.getItem('sportswearCart')) || [];
let appliedPromo = null;

// Sportswear shop variables
let sportswearFilterBtns, sportswearProductCards, sportswearCategoryCards;

// ========== PAGE INITIALIZATION ==========
function initializePage() {
    // Get common elements
    header = document.querySelector('header');
    mobileMenuBtn = document.getElementById('mobileMenuBtn');
    mobileMenu = document.getElementById('mobileMenu');
    sections = document.querySelectorAll('section, footer');
    backgrounds = document.querySelectorAll('.hero-bg');

    // Initialize common functionality
    initializeCommonFeatures();
    
    // Initialize page-specific functionality
    initializePageSpecificFeatures();
    
    // Update combined cart count
    updateCombinedCartCount();
}

// ========== COMMON FEATURES ==========
function initializeCommonFeatures() {
    // Header scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50 && header) {
            header.classList.add('scrolled');
        } else if (header) {
            header.classList.remove('scrolled');
        }
    });

    // Scroll animations for sections
    function checkScroll() {
        sections.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight * 0.85) {
                element.classList.add('visible');
            }
        });
    }
    
    window.addEventListener('load', checkScroll);
    window.addEventListener('scroll', checkScroll);

    // Mobile menu functionality
    function toggleMobileMenu() {
        if (mobileMenu) {
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        }
    }

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }

    // Mobile menu links
    function handleMobileMenuClick(e) {
        const link = e.target.closest('.mobile-menu a');
        if (link && mobileMenu && mobileMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
    }

    if (mobileMenu) {
        mobileMenu.addEventListener('click', handleMobileMenuClick);
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (mobileMenu && mobileMenu.classList.contains('active') && 
            !mobileMenu.contains(e.target) && 
            e.target !== mobileMenuBtn && 
            !mobileMenuBtn.contains(e.target)) {
            toggleMobileMenu();
        }
    });

    // Close mobile menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
    });

    // Initialize mobile dropdowns
    initializeMobileDropdowns();

    // Preload images
    preloadImages();
}

// ========== MOBILE DROPDOWN FUNCTIONALITY ==========
function initializeMobileDropdowns() {
    const mobileDropdownToggles = document.querySelectorAll('.mobile-dropdown-toggle');
    
    if (mobileDropdownToggles.length === 0) {
        console.log('No mobile dropdowns found');
        return;
    }
    
    mobileDropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const dropdown = this.parentElement;
            const isActive = dropdown.classList.contains('active');
            
            // Close all other dropdowns
            document.querySelectorAll('.mobile-dropdown').forEach(item => {
                if (item !== dropdown) {
                    item.classList.remove('active');
                }
            });
            
            // Toggle current dropdown
            dropdown.classList.toggle('active', !isActive);
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.mobile-dropdown')) {
            document.querySelectorAll('.mobile-dropdown').forEach(item => {
                item.classList.remove('active');
            });
        }
    });

    // Close dropdowns on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.mobile-dropdown').forEach(item => {
                item.classList.remove('active');
            });
        }
    });
}

// ========== PAGE-SPECIFIC FEATURES ==========
function initializePageSpecificFeatures() {
    const path = window.location.pathname;
    const page = path.split('/').pop() || 'index.html';

    console.log('Initializing page:', page);

    switch(page) {
        case 'index.html':
        case '':
        case 'index':
            initializeIndexPage();
            break;
        case 'about.html':
            initializeAboutPage();
            break;
        case 'contact.html':
            initializeContactPage();
            break;
        case 'shop.html':
            initializeShopPage();
            break;
        case 'sports.html':
            initializeSportswearPage();
            break;
        case 'cart.html':
            initializeCartPage();
            break;
        default:
            // Check for sportswear page by content
            const heroTitle = document.querySelector('.shop-hero h1');
            if (heroTitle && heroTitle.textContent.includes('Sportswear')) {
                initializeSportswearPage();
            } else if (backgrounds.length > 0) {
                initializeIndexPage();
            } else {
                console.log('No specific page handler for:', page);
            }
    }
}

// ========== INDEX PAGE FEATURES ==========
function initializeIndexPage() {
    console.log('Initializing index page');
    
    // Hero background transition
    function changeBackground() {
        if (backgrounds.length > 0) {
            backgrounds.forEach((bg, index) => {
                if (bg.style) {
                    bg.style.transform = `translateX(${(index - currentBgIndex) * 100}%)`;
                    
                    if (index === currentBgIndex) {
                        bg.style.filter = 'brightness(0.8)';
                    } else if (index === (currentBgIndex + 1) % backgrounds.length) {
                        bg.style.filter = 'brightness(0.8) hue-rotate(90deg)';
                    } else {
                        bg.style.filter = 'brightness(0.8) hue-rotate(180deg)';
                    }
                }
            });
            
            currentBgIndex = (currentBgIndex + 1) % backgrounds.length;
        }
    }
    
    if (backgrounds.length > 0) {
        setInterval(changeBackground, bgTransitionInterval);
        setTimeout(changeBackground, 100);
    }
    
    // Distortion effect on mouse move
    document.addEventListener('mousemove', (e) => {
        const distortion = document.querySelector('.distortion');
        if (distortion) {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            
            distortion.style.transform = `translate(${x * 10 - 5}px, ${y * 10 - 5}px) scale(1.02)`;
        }
    });
}

// ========== ABOUT PAGE FEATURES ==========
function initializeAboutPage() {
    console.log('About page initialized');
}

// ========== CONTACT PAGE FEATURES ==========
function initializeContactPage() {
    const faqItems = document.querySelectorAll('.faq-item');
    const contactForm = document.getElementById('contactForm');

    // FAQ toggle functionality
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (question) {
                question.addEventListener('click', () => {
                    faqItems.forEach(otherItem => {
                        if (otherItem !== item) {
                            otherItem.classList.remove('active');
                        }
                    });
                    item.classList.toggle('active');
                });
            }
        });
    }

    // Contact form submission
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            
            createStyledAlert(`Thank you, ${name}! Your message about "${subject}" has been sent. We'll respond to ${email} within 24 hours.`, 'success');
            contactForm.reset();
        });
    }
}

// ========== SHOP PAGE FEATURES (WORKWEAR) ==========
function initializeShopPage() {
    console.log('Initializing workwear shop page');
    
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    const categoryCards = document.querySelectorAll('.category-card');
    const wishlistBtns = document.querySelectorAll('.wishlist-btn');
    const shareBtns = document.querySelectorAll('.share-btn');
    const addToCartBtns = document.querySelectorAll('.add-to-cart');

    console.log('Found elements:', {
        filterBtns: filterBtns.length,
        productCards: productCards.length,
        categoryCards: categoryCards.length,
        wishlistBtns: wishlistBtns.length,
        shareBtns: shareBtns.length,
        addToCartBtns: addToCartBtns.length
    });

    // Product filtering
    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filter = btn.getAttribute('data-filter');
                
                productCards.forEach(card => {
                    if (filter === 'all' || card.getAttribute('data-category') === filter) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.animation = 'fadeIn 0.5s ease forwards';
                        }, 10);
                    } else {
                        card.style.display = 'none';
                    }
                });
                
                const categoryName = filter === 'all' ? 'All Products' : btn.textContent;
                createStyledAlert(`Showing ${categoryName}`, 'info');
            });
        });
    }

    // Category card click
    if (categoryCards.length > 0) {
        categoryCards.forEach(card => {
            card.addEventListener('click', () => {
                const category = card.getAttribute('data-category');
                
                filterBtns.forEach(btn => {
                    if (btn.getAttribute('data-filter') === category) {
                        btn.click();
                    }
                });
                
                const productsSection = document.querySelector('.products-section');
                if (productsSection) {
                    productsSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    // Product interactions
    if (productCards.length > 0) {
        productCards.forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.product-actions') && !e.target.closest('.add-to-cart')) {
                    const productName = card.querySelector('h3')?.textContent;
                    const productDescription = card.querySelector('.product-description')?.textContent;
                    const productPrice = card.querySelector('.product-price')?.textContent;
                    
                    if (productName && productPrice && productDescription) {
                        createStyledAlert(
                            `<strong>${productName}</strong><br>${productPrice}<br><br>${productDescription}`,
                            'info'
                        );
                    }
                }
            });
        });
    }

    // Wishlist button click
    if (wishlistBtns.length > 0) {
        wishlistBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productCard = btn.closest('.product-card');
                const productName = productCard?.querySelector('h3')?.textContent;
                
                const icon = btn.querySelector('i');
                if (icon && productName) {
                    if (icon.classList.contains('far')) {
                        icon.classList.remove('far');
                        icon.classList.add('fas');
                        btn.style.color = 'var(--accent)';
                        createStyledAlert(`Added "<strong>${productName}</strong>" to your wishlist!`, 'success');
                    } else {
                        icon.classList.remove('fas');
                        icon.classList.add('far');
                        btn.style.color = '';
                        createStyledAlert(`Removed "<strong>${productName}</strong>" from your wishlist!`, 'info');
                    }
                }
            });
        });
    }

    // Share functionality
    if (shareBtns.length > 0) {
        initializeShareFunctionality(shareBtns);
    }

    // Add to cart functionality
    if (addToCartBtns.length > 0) {
        initializeAddToCartFunctionality(addToCartBtns);
    }
}

// ========== SPORTSWEAR PAGE FEATURES ==========
function initializeSportswearPage() {
    console.log('Initializing sportswear page');
    
    // Get sportswear-specific elements
    sportswearFilterBtns = document.querySelectorAll('.products-filter .filter-btn');
    sportswearProductCards = document.querySelectorAll('.products-section .product-card');
    sportswearCategoryCards = document.querySelectorAll('.categories-section .category-card');

    console.log('Sportswear elements:', {
        filterBtns: sportswearFilterBtns.length,
        productCards: sportswearProductCards.length,
        categoryCards: sportswearCategoryCards.length
    });

    // Initialize sportswear functionality
    initializeSportswearFiltering();
    initializeSportswearCategoryClicks();
    initializeSportswearProductInteractions();
    initializeSportswearWishlist();
    initializeSportswearShareFunctionality();
    initializeSportswearAddToCart();
    initializeSportswearSizeGuide();
    initializeSportswearTeamCustomization();
}

function initializeSportswearFiltering() {
    if (sportswearFilterBtns && sportswearFilterBtns.length > 0) {
        sportswearFilterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                sportswearFilterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filter = btn.getAttribute('data-filter');
                
                sportswearProductCards.forEach(card => {
                    if (filter === 'all' || card.getAttribute('data-category') === filter) {
                        card.style.display = 'block';
                        card.style.animation = 'fadeIn 0.5s ease forwards';
                    } else {
                        card.style.display = 'none';
                    }
                });
                
                const categoryName = filter === 'all' ? 'All Sportswear' : btn.textContent;
                createStyledAlert(`Showing ${categoryName}`, 'info');
            });
        });
    }
}

function initializeSportswearCategoryClicks() {
    if (sportswearCategoryCards && sportswearCategoryCards.length > 0) {
        sportswearCategoryCards.forEach(card => {
            card.addEventListener('click', () => {
                const category = card.getAttribute('data-category');
                
                sportswearFilterBtns.forEach(btn => {
                    if (btn.getAttribute('data-filter') === category) {
                        btn.click();
                    }
                });
                
                const productsSection = document.querySelector('.products-section');
                if (productsSection) {
                    productsSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }
}

function initializeSportswearProductInteractions() {
    if (sportswearProductCards && sportswearProductCards.length > 0) {
        sportswearProductCards.forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.product-actions') && !e.target.closest('.add-to-cart')) {
                    const productName = card.querySelector('h3')?.textContent;
                    const productDescription = card.querySelector('.product-description')?.textContent;
                    const productPrice = card.querySelector('.product-price')?.textContent;
                    
                    if (productName && productPrice && productDescription) {
                        createStyledAlert(
                            `<strong>${productName}</strong><br>${productPrice}<br><br>${productDescription}`,
                            'info'
                        );
                    }
                }
            });
        });
    }
}

function initializeSportswearWishlist() {
    const wishlistBtns = document.querySelectorAll('.wishlist-btn');
    
    if (wishlistBtns.length > 0) {
        wishlistBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productCard = btn.closest('.product-card');
                const productName = productCard?.querySelector('h3')?.textContent;
                
                const icon = btn.querySelector('i');
                if (icon && productName) {
                    if (icon.classList.contains('far')) {
                        icon.classList.remove('far');
                        icon.classList.add('fas');
                        btn.style.color = 'var(--accent)';
                        createStyledAlert(`Added "<strong>${productName}</strong>" to your wishlist!`, 'success');
                    } else {
                        icon.classList.remove('fas');
                        icon.classList.add('far');
                        btn.style.color = '';
                        createStyledAlert(`Removed "<strong>${productName}</strong>" from your wishlist!`, 'info');
                    }
                }
            });
        });
    }
}

function initializeSportswearShareFunctionality() {
    const shareBtns = document.querySelectorAll('.share-btn');
    
    if (shareBtns.length > 0) {
        shareBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productCard = btn.closest('.product-card');
                if (productCard) {
                    const currentProduct = {
                        name: productCard.querySelector('h3')?.textContent || 'Sportswear Product',
                        description: productCard.querySelector('.product-description')?.textContent || '',
                        price: productCard.querySelector('.product-price')?.textContent || '',
                        image: productCard.querySelector('img')?.src || '',
                        url: window.location.href + '?product=' + encodeURIComponent(productCard.querySelector('h3')?.textContent || '')
                    };
                    
                    openShareModal(currentProduct);
                }
            });
        });
    }
}

function initializeSportswearAddToCart() {
    const addToCartBtns = document.querySelectorAll('.add-to-cart');
    
    if (addToCartBtns.length > 0) {
        addToCartBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = btn.getAttribute('data-product-id');
                const productName = btn.getAttribute('data-product-name');
                const productPrice = btn.getAttribute('data-product-price');
                const productImage = btn.getAttribute('data-product-image');
                
                if (productId && productName && productPrice && productImage) {
                    const quantity = addToSportswearCart(productId, productName, productPrice, productImage);
                    
                    const originalText = btn.textContent;
                    btn.textContent = `Added (${quantity})`;
                    btn.classList.add('added');
                    
                    setTimeout(() => {
                        btn.textContent = originalText;
                        btn.classList.remove('added');
                    }, 2000);
                    
                    createStyledAlert(`Added "<strong>${productName}</strong>" to your cart!<br>${productPrice}`, 'success');
                }
            });
        });
    }
}

function initializeSportswearSizeGuide() {
    const sizeGuideBtn = document.querySelector('.size-guide-btn');
    if (sizeGuideBtn) {
        sizeGuideBtn.addEventListener('click', () => {
            createStyledAlert(`
                <strong>Sportswear Size Guide</strong><br><br>
                <strong>Jerseys:</strong> S(34-36), M(38-40), L(42-44), XL(46-48)<br>
                <strong>Shorts:</strong> S(30-32), M(32-34), L(36-38), XL(40-42)<br>
                <strong>Shoes:</strong> US 7-13 available<br>
                <em>Need help? Contact our sizing experts!</em>
            `, 'info');
        });
    }
}

function initializeSportswearTeamCustomization() {
    const customizeBtns = document.querySelectorAll('.customize-btn');
    if (customizeBtns.length > 0) {
        customizeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                createStyledAlert(`
                    <strong>Team Customization Available!</strong><br><br>
                    We offer:<br>
                    • Custom team logos<br>
                    • Player names and numbers<br>
                    • Team colors<br>
                    • Bulk order discounts<br><br>
                    <a href="contact.html" style="color: var(--secondary); text-decoration: underline;">Contact us for a quote</a>
                `, 'info');
            });
        });
    }
}

// ========== CART PAGE FEATURES (UNIFIED) ==========
function initializeCartPage() {
    console.log('Initializing cart page');
    
    const checkoutBtn = document.getElementById('checkoutBtn');
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const applyPromoBtn = document.getElementById('applyPromo');
    const promoCodeInput = document.getElementById('promoCode');

    console.log('Cart elements:', {
        checkoutBtn: !!checkoutBtn,
        cartItemsContainer: !!cartItemsContainer,
        applyPromoBtn: !!applyPromoBtn,
        promoCodeInput: !!promoCodeInput
    });

    // Render combined cart items
    if (cartItemsContainer) {
        renderCombinedCartItems();
    }

    // Promo code functionality
    if (applyPromoBtn && promoCodeInput) {
        applyPromoBtn.addEventListener('click', function() {
            const promoCode = promoCodeInput.value.trim().toUpperCase();
            
            if (promoCode === 'SAVE10') {
                appliedPromo = { code: 'SAVE10', discount: 0.1 };
                createStyledAlert('Promo code applied! 10% discount added.', 'success');
                updateCombinedCartSummary();
            } else if (promoCode === 'FREESHIP') {
                appliedPromo = { code: 'FREESHIP', freeShipping: true };
                createStyledAlert('Promo code applied! Free shipping added.', 'success');
                updateCombinedCartSummary();
            } else if (promoCode) {
                createStyledAlert('Invalid promo code', 'error');
                appliedPromo = null;
                updateCombinedCartSummary();
            }
        });
    }

    // Checkout functionality
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            const totalItems = cart.length + sportswearCart.length;
            if (totalItems === 0) {
                createStyledAlert('Your cart is empty!', 'warning');
                return;
            }
            
            createStyledAlert('Proceeding to checkout...', 'info');
            
            setTimeout(() => {
                createStyledAlert('Checkout functionality would be implemented here', 'info');
            }, 1000);
        });
    }
}

// ========== SHARED FUNCTIONALITY ==========

// Custom Alert System
function createStyledAlert(message, type = 'info') {
    const existingAlert = document.querySelector('.custom-alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    const alert = document.createElement('div');
    alert.className = `custom-alert custom-alert-${type}`;
    
    alert.innerHTML = `
        <div class="custom-alert-content">
            <div class="custom-alert-icon">
                ${type === 'success' ? '<i class="fas fa-check-circle"></i>' : 
                  type === 'error' ? '<i class="fas fa-exclamation-circle"></i>' : 
                  type === 'warning' ? '<i class="fas fa-exclamation-triangle"></i>' : 
                  '<i class="fas fa-info-circle"></i>'}
            </div>
            <div class="custom-alert-message">${message}</div>
            <button class="custom-alert-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.classList.add('show');
    }, 10);
    
    const autoRemove = setTimeout(() => {
        removeAlert(alert);
    }, 4000);
    
    const closeBtn = alert.querySelector('.custom-alert-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            clearTimeout(autoRemove);
            removeAlert(alert);
        });
    }
    
    alert.addEventListener('click', (e) => {
        if (e.target === alert) {
            clearTimeout(autoRemove);
            removeAlert(alert);
        }
    });
}

function removeAlert(alert) {
    alert.classList.remove('show');
    setTimeout(() => {
        if (alert.parentNode) {
            alert.parentNode.removeChild(alert);
        }
    }, 300);
}

// Share functionality
function initializeShareFunctionality(shareBtns) {
    const shareModal = document.getElementById('shareModal');
    const shareModalClose = document.getElementById('shareModalClose');
    const shareLinkInput = document.getElementById('shareLinkInput');
    const copyLinkBtn = document.getElementById('copyLinkBtn');
    const shareOptions = document.querySelectorAll('.share-option');

    let currentProduct = null;

    // Function to open share modal
    function openShareModal(product) {
        if (!product || !shareModal || !shareLinkInput) return;
        
        shareLinkInput.value = product.url;
        shareModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Function to close share modal
    function closeShareModal() {
        if (shareModal) {
            shareModal.classList.remove('active');
            document.body.style.overflow = '';
            currentProduct = null;
            
            if (copyLinkBtn) {
                copyLinkBtn.classList.remove('copied');
                copyLinkBtn.innerHTML = '<i class="fas fa-copy"></i>';
            }
        }
    }

    // Share to platform function
    function shareToPlatform(platform) {
        if (!currentProduct) return;
        
        const shareText = `Check out ${currentProduct.name} - ${currentProduct.price} at Ravina International`;
        const encodedText = encodeURIComponent(shareText);
        const encodedUrl = encodeURIComponent(currentProduct.url);
        
        let shareUrl = '';
        
        switch (platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
                break;
            case 'whatsapp':
                shareUrl = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
                break;
            case 'email':
                shareUrl = `mailto:?subject=${encodeURIComponent(currentProduct.name)}&body=${encodedText}%0A%0A${encodedUrl}`;
                break;
            case 'copy':
                return;
        }
        
        if (platform === 'email') {
            window.location.href = shareUrl;
        } else {
            window.open(shareUrl, '_blank', 'width=600,height=400');
        }
        
        createStyledAlert(`Sharing via ${platform.charAt(0).toUpperCase() + platform.slice(1)}...`, 'info');
        
        setTimeout(() => {
            closeShareModal();
        }, 1000);
    }

    // Set up share button event listeners
    shareBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productCard = btn.closest('.product-card');
            if (productCard) {
                currentProduct = {
                    name: productCard.querySelector('h3')?.textContent || 'Product',
                    description: productCard.querySelector('.product-description')?.textContent || '',
                    price: productCard.querySelector('.product-price')?.textContent || '',
                    image: productCard.querySelector('img')?.src || '',
                    url: window.location.href + '?product=' + encodeURIComponent(productCard.querySelector('h3')?.textContent || '')
                };
                
                openShareModal(currentProduct);
            }
        });
    });

    // Set up modal event listeners
    if (shareModalClose) {
        shareModalClose.addEventListener('click', closeShareModal);
    }

    if (shareModal) {
        shareModal.addEventListener('click', (e) => {
            if (e.target === shareModal) {
                closeShareModal();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && shareModal && shareModal.classList.contains('active')) {
            closeShareModal();
        }
    });

    if (copyLinkBtn) {
        copyLinkBtn.addEventListener('click', async () => {
            if (!shareLinkInput) return;
            
            try {
                await navigator.clipboard.writeText(shareLinkInput.value);
                copyLinkBtn.classList.add('copied');
                copyLinkBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                
                setTimeout(() => {
                    copyLinkBtn.classList.remove('copied');
                    copyLinkBtn.innerHTML = '<i class="fas fa-copy"></i>';
                }, 2000);
                
                createStyledAlert('Product link copied to clipboard!', 'success');
            } catch (err) {
                // Fallback for older browsers
                shareLinkInput.select();
                document.execCommand('copy');
                copyLinkBtn.classList.add('copied');
                copyLinkBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                
                setTimeout(() => {
                    copyLinkBtn.classList.remove('copied');
                    copyLinkBtn.innerHTML = '<i class="fas fa-copy"></i>';
                }, 2000);
                
                createStyledAlert('Product link copied to clipboard!', 'success');
            }
        });
    }

    if (shareOptions.length > 0) {
        shareOptions.forEach(option => {
            option.addEventListener('click', () => {
                const platform = option.getAttribute('data-platform');
                shareToPlatform(platform);
            });
        });
    }
}

// Add to cart functionality for workwear
function initializeAddToCartFunctionality(addToCartBtns) {
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productId = btn.getAttribute('data-product-id');
            const productName = btn.getAttribute('data-product-name');
            const productPrice = btn.getAttribute('data-product-price');
            const productImage = btn.getAttribute('data-product-image');
            
            if (productId && productName && productPrice && productImage) {
                const quantity = addToCart(productId, productName, productPrice, productImage);
                
                const originalText = btn.textContent;
                btn.textContent = `Added (${quantity})`;
                btn.classList.add('added');
                
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.classList.remove('added');
                }, 2000);
                
                createStyledAlert(`Added "<strong>${productName}</strong>" to your cart!<br>$${productPrice}`, 'success');
            }
        });
    });
}

// ========== CART FUNCTIONALITY ==========

// Workwear cart functions
function addToCart(productId, productName, productPrice, productImage) {
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: parseFloat(productPrice),
            image: productImage,
            quantity: 1
        });
    }
    
    localStorage.setItem('proWorkCart', JSON.stringify(cart));
    updateCombinedCartCount();
    
    // Update cart page if we're on it
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    if (cartItemsContainer) {
        renderCombinedCartItems();
    }
    
    return existingItem ? existingItem.quantity : 1;
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('proWorkCart', JSON.stringify(cart));
    updateCombinedCartCount();
    
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    if (cartItemsContainer) {
        renderCombinedCartItems();
    }
}

function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) return;
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        localStorage.setItem('proWorkCart', JSON.stringify(cart));
        updateCombinedCartCount();
        
        const cartItemsContainer = document.getElementById('cartItemsContainer');
        if (cartItemsContainer) {
            renderCombinedCartItems();
        }
    }
}

// Sportswear cart functions
function addToSportswearCart(productId, productName, productPrice, productImage) {
    const existingItem = sportswearCart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        sportswearCart.push({
            id: productId,
            name: productName,
            price: parseFloat(productPrice.replace('$', '')),
            image: productImage,
            quantity: 1
        });
    }
    
    localStorage.setItem('sportswearCart', JSON.stringify(sportswearCart));
    updateCombinedCartCount();
    
    // Update cart page if we're on it
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    if (cartItemsContainer) {
        renderCombinedCartItems();
    }
    
    return existingItem ? existingItem.quantity : 1;
}

function removeFromSportswearCart(productId) {
    sportswearCart = sportswearCart.filter(item => item.id !== productId);
    localStorage.setItem('sportswearCart', JSON.stringify(sportswearCart));
    updateCombinedCartCount();
    
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    if (cartItemsContainer) {
        renderCombinedCartItems();
    }
}

function updateSportswearQuantity(productId, newQuantity) {
    if (newQuantity < 1) return;
    
    const item = sportswearCart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        localStorage.setItem('sportswearCart', JSON.stringify(sportswearCart));
        updateCombinedCartCount();
        
        const cartItemsContainer = document.getElementById('cartItemsContainer');
        if (cartItemsContainer) {
            renderCombinedCartItems();
        }
    }
}

// Combined cart functions
function updateCombinedCartCount() {
    const workwearItems = cart.reduce((total, item) => total + item.quantity, 0);
    const sportswearItems = sportswearCart.reduce((total, item) => total + item.quantity, 0);
    const totalItems = workwearItems + sportswearItems;
    
    const cartCount = document.querySelector('.cart-count');
    const mobileCartCount = document.querySelector('.mobile-cart-count');
    
    if (cartCount) cartCount.textContent = totalItems;
    if (mobileCartCount) mobileCartCount.textContent = totalItems;
}

function renderCombinedCartItems() {
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    if (!cartItemsContainer) return;
    
    const workwearItems = cart.map(item => ({...item, type: 'workwear'}));
    const sportswearItems = sportswearCart.map(item => ({...item, type: 'sportswear'}));
    const combinedItems = [...workwearItems, ...sportswearItems];
    
    if (combinedItems.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h3>Your cart is empty</h3>
                <p>Add some items to your cart to get started</p>
                <div class="cart-empty-actions">
                    <a href="shop.html" class="continue-shopping">Browse Workwear</a>
                    <a href="sports.html" class="continue-shopping">Browse Sportswear</a>
                </div>
            </div>
        `;
        updateCombinedCartSummary();
        return;
    }

    const cartHeader = `
        <div class="cart-header">
            <h2>Your Items (${combinedItems.reduce((total, item) => total + item.quantity, 0)})</h2>
            <span>Price</span>
        </div>
    `;

    const cartItemsHTML = combinedItems.map(item => `
        <div class="cart-item" data-product-id="${item.id}" data-product-type="${item.type}">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
                <div class="item-badge ${item.type}">${item.type === 'sportswear' ? 'Sportswear' : 'Workwear'}</div>
            </div>
            <div class="cart-item-details">
                <div class="cart-item-info">
                    <h3>${item.name}</h3>
                    <p>${item.type === 'sportswear' ? 'Size: Standard | Color: As shown' : 'Size: One Size | Color: Standard'}</p>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-controls">
                        <button class="quantity-btn minus-btn" data-product-id="${item.id}" data-product-type="${item.type}">-</button>
                        <input type="text" class="quantity-input" value="${item.quantity}" readonly data-product-id="${item.id}" data-product-type="${item.type}">
                        <button class="quantity-btn plus-btn" data-product-id="${item.id}" data-product-type="${item.type}">+</button>
                    </div>
                    <button class="remove-item" data-product-id="${item.id}" data-product-type="${item.type}">Remove</button>
                </div>
            </div>
        </div>
    `).join('');

    cartItemsContainer.innerHTML = cartHeader + cartItemsHTML;
    attachCombinedCartEventListeners();
    updateCombinedCartSummary();
}

function attachCombinedCartEventListeners() {
    // Quantity buttons
    document.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            const productType = this.getAttribute('data-product-type');
            const input = document.querySelector(`.quantity-input[data-product-id="${productId}"][data-product-type="${productType}"]`);
            
            if (!input) return;
            
            let value = parseInt(input.value);
            
            if (this.classList.contains('plus-btn')) {
                value++;
            } else if (this.classList.contains('minus-btn') && value > 1) {
                value--;
            }
            
            if (productType === 'sportswear') {
                updateSportswearQuantity(productId, value);
            } else {
                updateQuantity(productId, value);
            }
            createStyledAlert('Cart updated', 'info');
        });
    });

    // Remove buttons
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            const productType = this.getAttribute('data-product-type');
            
            let productName = '';
            if (productType === 'sportswear') {
                const item = sportswearCart.find(item => item.id === productId);
                productName = item ? item.name : 'Product';
                removeFromSportswearCart(productId);
            } else {
                const item = cart.find(item => item.id === productId);
                productName = item ? item.name : 'Product';
                removeFromCart(productId);
            }
            
            createStyledAlert(`Removed <strong>${productName}</strong> from cart`, 'info');
        });
    });
}

function updateCombinedCartSummary() {
    const workwearSubtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const sportswearSubtotal = sportswearCart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const subtotal = workwearSubtotal + sportswearSubtotal;
    
    let shipping = subtotal > 200 ? 0 : 9.99;
    const tax = subtotal * 0.08;
    
    let discount = 0;
    if (appliedPromo && appliedPromo.discount) {
        discount = subtotal * appliedPromo.discount;
    }
    if (appliedPromo && appliedPromo.freeShipping) {
        shipping = 0;
    }
    
    const total = subtotal + shipping + tax - discount;

    const itemCountEl = document.getElementById('itemCount');
    const subtotalEl = document.getElementById('subtotal');
    const shippingEl = document.getElementById('shipping');
    const taxEl = document.getElementById('tax');
    const totalEl = document.getElementById('total');

    if (itemCountEl) itemCountEl.textContent = cart.reduce((total, item) => total + item.quantity, 0) + sportswearCart.reduce((total, item) => total + item.quantity, 0);
    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (shippingEl) shippingEl.textContent = `$${shipping.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
}

// Image preloading
function preloadImages() {
    const imageUrls = [
        'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1548&q=80',
        'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80',
        'https://images.unsplash.com/photo-1582719471384-894fbb16e074?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
    ];

    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing page...');
    initializePage();
});

// ========== ERROR HANDLING ==========
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
});

// Export for global use
window.sportswearShop = {
    addToSportswearCart,
    removeFromSportswearCart,
    updateSportswearQuantity,
    updateCombinedCartCount
};