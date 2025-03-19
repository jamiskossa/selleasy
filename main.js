/**
 * StockEasy - Main JavaScript File
 * This file contains common functionality used across the website
 */

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Dark Mode Toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    
    // Check for saved theme preference or use device preference
    const savedTheme = localStorage.getItem('theme') || 
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    // Apply the theme
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    
    // Toggle theme when button is clicked
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
            if (document.documentElement.classList.contains('dark')) {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
            } else {
                document.documentElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            }
        });
    }
    
    // Add to Cart Functionality
    const addToCartButtons = document.querySelectorAll('.btn-secondary');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get product info
            const productCard = this.closest('.card') || this.closest('.product-info');
            let productName, productPrice, productImage;
            
            if (productCard) {
                productName = productCard.querySelector('h3').textContent;
                productPrice = productCard.querySelector('.text-primary').textContent;
                productImage = productCard.querySelector('img').src;
            } else {
                // For product detail page
                productName = document.querySelector('h1').textContent;
                productPrice = document.querySelector('.text-2xl.font-bold').textContent;
                productImage = document.getElementById('mainImage').src;
            }
            
            // Get quantity (default to 1 if not on product detail page)
            const quantityInput = document.getElementById('quantity');
            const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
            
            // Add to cart (in a real app, this would update a cart object and possibly send to server)
            addToCart({
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: quantity
            });
            
            // Show notification
            showNotification(`${productName} ajouté au panier !`, 'success');
        });
    });
    
    // Cart functionality (simplified for demo)
    function addToCart(product) {
        // Get existing cart from localStorage or initialize empty array
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Check if product already exists in cart
        const existingProductIndex = cart.findIndex(item => item.name === product.name);
        
        if (existingProductIndex > -1) {
            // Update quantity if product already in cart
            cart[existingProductIndex].quantity += product.quantity;
        } else {
            // Add new product to cart
            cart.push(product);
        }
        
        // Save updated cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update cart count in UI
        updateCartCount();
    }
    
    // Update cart count in UI
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
        
        // Update cart count display if it exists
        const cartCountElement = document.getElementById('cartCount');
        if (cartCountElement) {
            cartCountElement.textContent = cartCount;
            
            if (cartCount > 0) {
                cartCountElement.classList.remove('hidden');
            } else {
                cartCountElement.classList.add('hidden');
            }
        }
    }
    
    // Call updateCartCount on page load
    updateCartCount();
    
    // Notification function
    window.showNotification = function(message, type) {
        const notification = document.createElement('div');
        notification.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg ${
            type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white z-50`;
        
        notification.innerHTML = `
            <div class="flex items-center">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} mr-2"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Remove notification after 5 seconds
        setTimeout(() => {
            notification.classList.add('opacity-0', 'transition-opacity', 'duration-500');
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 4500);
    }
});