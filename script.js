// ========== JAVASCRIPT FUNCTIONALITY ==========

// Initialize global variables
let header, mobileMenuBtn, mobileMenu, overlay, sections, backgrounds;
let currentBgIndex = 0;
const bgTransitionInterval = 5000; // 5 seconds

// Cart data
let cart = JSON.parse(localStorage.getItem('proWorkCart')) || [];
let appliedPromo = null;

// ========== PAGE INITIALIZATION ==========
function initializePage() {
    // Get common elements
    header = document.querySelector('header');
    mobileMenuBtn = document.getElementById('mobileMenuBtn');
    mobileMenu = document.getElementById('mobileMenu');
    overlay = document.getElementById('overlay');
    sections = document.querySelectorAll('section, footer');
    backgrounds = document.querySelectorAll('.hero-bg');

    // Initialize common functionality
    initializeCommonFeatures();
    
    // Initialize page-specific functionality
    initializePageSpecificFeatures();
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
        if (mobileMenu && overlay) {
            mobileMenu.classList.toggle('active');
            overlay.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        }
    }

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }

    if (overlay) {
        overlay.addEventListener('click', toggleMobileMenu);
    }

    // Close mobile menu when clicking on links
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu a');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', toggleMobileMenu);
    });

    // Initialize cart count
    updateCartCount();
    
    // Preload images
    preloadImages();
}

// ========== PAGE-SPECIFIC FEATURES ==========
function initializePageSpecificFeatures() {
    const path = window.location.pathname;
    const page = path.split('/').pop() || 'index.html';

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
        case 'cart.html':
            initializeCartPage();
            break;
        default:
            // Default to index features if page not recognized
            if (backgrounds.length > 0) {
                initializeIndexPage();
            }
    }
}

// ========== INDEX PAGE FEATURES ==========
function initializeIndexPage() {
    // Hero background transition
    function changeBackground() {
        if (backgrounds.length > 0) {
            backgrounds.forEach((bg, index) => {
                bg.style.transform = `translateX(${(index - currentBgIndex) * 100}%)`;
                
                if (index === currentBgIndex) {
                    bg.style.filter = 'brightness(0.8)';
                } else if (index === (currentBgIndex + 1) % 3) {
                    bg.style.filter = 'brightness(0.8) hue-rotate(90deg)';
                } else {
                    bg.style.filter = 'brightness(0.8) hue-rotate(180deg)';
                }
            });
            
            currentBgIndex = (currentBgIndex + 1) % 3;
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
    // About page doesn't need additional JS beyond common features
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

// ========== SHOP PAGE FEATURES ==========
function initializeShopPage() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    const categoryCards = document.querySelectorAll('.category-card');
    const wishlistBtns = document.querySelectorAll('.wishlist-btn');
    const shareBtns = document.querySelectorAll('.share-btn');
    const addToCartBtns = document.querySelectorAll('.add-to-cart');

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
                        card.style.animation = 'fadeIn 0.5s ease forwards';
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

// ========== CART PAGE FEATURES ==========
function initializeCartPage() {
    const checkoutBtn = document.getElementById('checkoutBtn');
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const applyPromoBtn = document.getElementById('applyPromo');
    const promoCodeInput = document.getElementById('promoCode');
    const addToCartBtns = document.querySelectorAll('.add-to-cart');

    // Render cart items
    if (cartItemsContainer) {
        renderCartItems();
    }

    // Promo code functionality
    if (applyPromoBtn && promoCodeInput) {
        applyPromoBtn.addEventListener('click', function() {
            const promoCode = promoCodeInput.value.trim().toUpperCase();
            
            if (promoCode === 'SAVE10') {
                appliedPromo = { code: 'SAVE10', discount: 0.1 };
                createStyledAlert('Promo code applied! 10% discount added.', 'success');
                updateCartSummary();
            } else if (promoCode === 'FREESHIP') {
                appliedPromo = { code: 'FREESHIP', freeShipping: true };
                createStyledAlert('Promo code applied! Free shipping added.', 'success');
                updateCartSummary();
            } else if (promoCode) {
                createStyledAlert('Invalid promo code', 'error');
                appliedPromo = null;
                updateCartSummary();
            }
        });
    }

    // Checkout functionality
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                createStyledAlert('Your cart is empty!', 'warning');
                return;
            }
            
            createStyledAlert('Proceeding to checkout...', 'info');
            
            setTimeout(() => {
                createStyledAlert('Checkout functionality would be implemented here', 'info');
            }, 1000);
        });
    }

    // Add to cart from recommended products
    if (addToCartBtns.length > 0) {
        initializeAddToCartFunctionality(addToCartBtns);
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
    closeBtn.addEventListener('click', () => {
        clearTimeout(autoRemove);
        removeAlert(alert);
    });
    
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

// Cart functionality
function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCount = document.querySelector('.cart-count');
    const mobileCartCount = document.querySelector('.mobile-cart-count');
    
    if (cartCount) cartCount.textContent = totalItems;
    if (mobileCartCount) mobileCartCount.textContent = totalItems;
}

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
    updateCartCount();
    
    // Update cart page if we're on it
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    if (cartItemsContainer) {
        renderCartItems();
    }
    
    return existingItem ? existingItem.quantity : 1;
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('proWorkCart', JSON.stringify(cart));
    updateCartCount();
    renderCartItems();
}

function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) return;
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        localStorage.setItem('proWorkCart', JSON.stringify(cart));
        updateCartCount();
        renderCartItems();
    }
}

function renderCartItems() {
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h3>Your cart is empty</h3>
                <p>Add some items to your cart to get started</p>
                <a href="shop.html" class="continue-shopping">Continue Shopping</a>
            </div>
        `;
        updateCartSummary();
        return;
    }

    const cartHeader = `
        <div class="cart-header">
            <h2>Your Items (${cart.reduce((total, item) => total + item.quantity, 0)})</h2>
            <span>Price</span>
        </div>
    `;

    const cartItemsHTML = cart.map(item => `
        <div class="cart-item" data-product-id="${item.id}">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <div class="cart-item-info">
                    <h3>${item.name}</h3>
                    <p>Size: One Size | Color: Standard</p>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-controls">
                        <button class="quantity-btn minus-btn" data-product-id="${item.id}">-</button>
                        <input type="text" class="quantity-input" value="${item.quantity}" readonly data-product-id="${item.id}">
                        <button class="quantity-btn plus-btn" data-product-id="${item.id}">+</button>
                    </div>
                    <button class="remove-item" data-product-id="${item.id}">Remove</button>
                </div>
            </div>
        </div>
    `).join('');

    cartItemsContainer.innerHTML = cartHeader + cartItemsHTML;
    attachCartEventListeners();
    updateCartSummary();
}

function attachCartEventListeners() {
    document.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            const input = document.querySelector(`.quantity-input[data-product-id="${productId}"]`);
            let value = parseInt(input.value);
            
            if (this.classList.contains('plus-btn')) {
                value++;
            } else if (this.classList.contains('minus-btn') && value > 1) {
                value--;
            }
            
            updateQuantity(productId, value);
            createStyledAlert('Cart updated', 'info');
        });
    });

    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            const productName = cart.find(item => item.id === productId)?.name;
            
            removeFromCart(productId);
            createStyledAlert(`Removed <strong>${productName}</strong> from cart`, 'info');
        });
    });
}

function updateCartSummary() {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 200 ? 0 : 9.99;
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

    if (itemCountEl) itemCountEl.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (shippingEl) shippingEl.textContent = `$${shipping.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
}

// Share functionality
function initializeShareFunctionality(shareBtns) {
    const shareModal = document.getElementById('shareModal');
    const shareModalClose = document.getElementById('shareModalClose');
    const shareLinkInput = document.getElementById('shareLinkInput');
    const copyLinkBtn = document.getElementById('copyLinkBtn');
    const shareOptions = document.querySelectorAll('.share-option');

    let currentProduct = null;

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
                
                openShareModal();
            }
        });
    });

    function openShareModal() {
        if (!currentProduct || !shareModal || !shareLinkInput) return;
        
        shareLinkInput.value = currentProduct.url;
        shareModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

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

    function shareToPlatform(platform) {
        if (!currentProduct) return;
        
        const shareText = `Check out ${currentProduct.name} - ${currentProduct.price} at ProWork`;
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
}

// Add to cart functionality
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

// Image preloading
function preloadImages() {
    const imageUrls = [
        'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1548&q=80',
        'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80',
        'https://images.unsplash.com/photo-1582719471384-894fbb16e074?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        'https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
        'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
        'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=698&q=80',
        'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        'https://images.unsplash.com/photo-1581093458791-8a6b22bb9a0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80'
    ];

    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// ========== INITIALIZE WHEN DOM IS LOADED ==========
document.addEventListener('DOMContentLoaded', initializePage);