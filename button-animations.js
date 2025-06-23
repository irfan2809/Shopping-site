document.addEventListener('DOMContentLoaded', function() {
  // Enhanced button animations for the new design
  const buttons = document.querySelectorAll('.big-btn, .btn-back, .auth-btn, .logout-btn-small');
  
  buttons.forEach(btn => {
    // Add loading state for auth buttons
    if (btn.classList.contains('auth-btn')) {
      btn.addEventListener('click', function() {
        if (!btn.disabled) {
          btn.disabled = true;
          const originalText = btn.innerHTML;
          btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Processing...</span>';
          
          // Re-enable after a delay (will be handled by auth.js)
          setTimeout(() => {
            btn.disabled = false;
            btn.innerHTML = originalText;
          }, 3000);
        }
      });
    }

    // Enhanced hover effects
    btn.addEventListener('mouseenter', function() {
      if (!btn.classList.contains('auth-btn') || !btn.disabled) {
        btn.style.transform = 'scale(1.02)';
        btn.style.boxShadow = '0 12px 32px rgba(59, 130, 246, 0.25)';
        btn.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
      }
    });
    
    btn.addEventListener('mouseleave', function() {
      btn.style.transform = '';
      btn.style.boxShadow = '';
    });

    // Add click ripple effect
    btn.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.classList.add('ripple');
      
      btn.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });

  // Add ripple effect styles
  const style = document.createElement('style');
  style.textContent = `
    .ripple {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.6);
      transform: scale(0);
      animation: ripple-animation 0.6s linear;
      pointer-events: none;
    }
    
    @keyframes ripple-animation {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
    
    .big-btn, .auth-btn, .btn-back {
      position: relative;
      overflow: hidden;
    }
  `;
  document.head.appendChild(style);

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Add loading animation for page transitions
  const links = document.querySelectorAll('a[href]');
  links.forEach(link => {
    if (link.hostname === window.location.hostname && !link.href.includes('#')) {
      link.addEventListener('click', function(e) {
        // Add loading overlay
        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        overlay.innerHTML = `
          <div class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Loading...</p>
          </div>
        `;
        document.body.appendChild(overlay);
        
        // Remove overlay after navigation
        setTimeout(() => {
          if (overlay.parentNode) {
            overlay.remove();
          }
        }, 1000);
      });
    }
  });

  // Add loading overlay styles
  const loadingStyle = document.createElement('style');
  loadingStyle.textContent = `
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      backdrop-filter: blur(5px);
    }
    
    .loading-spinner {
      text-align: center;
      color: white;
    }
    
    .loading-spinner i {
      font-size: 2rem;
      margin-bottom: 1rem;
    }
    
    .loading-spinner p {
      font-size: 1.1rem;
      font-weight: 500;
    }
  `;
  document.head.appendChild(loadingStyle);

  // --- CART FUNCTIONALITY ---
  (function() {
    // Cart state
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // DOM elements
    const cartBtn = document.getElementById('cartBtn');
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    const closeCartBtn = document.getElementById('closeCartBtn');
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');

    function openCart() {
      cartSidebar.classList.add('open');
      cartOverlay.classList.add('open');
      renderCart();
    }
    function closeCart() {
      cartSidebar.classList.remove('open');
      cartOverlay.classList.remove('open');
    }
    function updateCartCount() {
      if (cartCount) {
        cartCount.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
      }
    }
    function saveCart() {
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartCount();
    }
    function renderCart() {
      cartItems.innerHTML = '';
      if (cart.length === 0) {
        cartItems.innerHTML = '<p style="color:#888;text-align:center;">Your cart is empty.</p>';
        cartTotal.textContent = 'Total: ₹0';
        return;
      }
      let total = 0;
      cart.forEach((item, idx) => {
        total += item.price * item.qty;
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.style.display = 'flex';
        div.style.justifyContent = 'space-between';
        div.style.alignItems = 'center';
        div.style.marginBottom = '1rem';
        div.innerHTML = `
          <div>
            <strong>${item.name}</strong><br>
            <span style="color:#888;font-size:0.95em;">₹${item.price} × ${item.qty}</span>
          </div>
          <button class="remove-cart-item" data-idx="${idx}" style="background:none;border:none;color:#ef4444;font-size:1.2em;cursor:pointer;">&times;</button>
        `;
        cartItems.appendChild(div);
      });
      cartTotal.textContent = `Total: ₹${total}`;
      // Remove item event
      cartItems.querySelectorAll('.remove-cart-item').forEach(btn => {
        btn.addEventListener('click', function() {
          const idx = parseInt(this.getAttribute('data-idx'));
          cart.splice(idx, 1);
          saveCart();
          renderCart();
        });
      });
    }
    // Add to cart function (to be used by other scripts)
    window.addToCart = function(item) {
      // item: {name, price, qty}
      const existing = cart.find(i => i.name === item.name && i.price === item.price);
      if (existing) {
        existing.qty += item.qty;
      } else {
        cart.push({...item});
      }
      saveCart();
      updateCartCount();
      showCartNotification(item.name);
    };

    function showCartNotification(name) {
      console.log('showCartNotification called with', name);
      const notif = document.getElementById('cartNotification');
      if (!notif) return;
      notif.textContent = `Added "${name}" to cart!`;
      notif.classList.add('show');
      setTimeout(() => {
        notif.classList.remove('show');
      }, 1500);
    }

    // Event listeners
    if (cartBtn) cartBtn.addEventListener('click', openCart);
    if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

    // Initial render
    updateCartCount();
  })();
}); 