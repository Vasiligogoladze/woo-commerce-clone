

document.addEventListener("DOMContentLoaded", () => {
    const cartBtn = document.getElementById("cartButton");
    const cartSidebar = document.getElementById("shoppingCartSidebar");
    const cartOverlay = document.getElementById("cartOverlay");
    const closeCart = document.getElementById("closeCart");
  
    cartBtn.addEventListener("click", () => {
      cartSidebar.classList.add("active");
      cartOverlay.classList.add("active");
    });
  
    closeCart.addEventListener("click", () => {
      cartSidebar.classList.remove("active");
      cartOverlay.classList.remove("active");
    });
  
    cartOverlay.addEventListener("click", () => {
      cartSidebar.classList.remove("active");
      cartOverlay.classList.remove("active");
    });
  });

      for (let i = 0; i < 30; i++) {
      const icon = document.createElement('i');
      const icons = ['bi-phone', 'bi-laptop', 'bi-headphones'];
      icon.className = `bi ${icons[Math.floor(Math.random() * icons.length)]} falling-icon`;
      icon.style.left = Math.random() * 100 + 'vw';
      icon.style.animationDuration = (5 + Math.random() * 5) + 's';
      document.body.appendChild(icon);
    }

        document.querySelectorAll('.accordion-button').forEach((btn) => {
      btn.addEventListener('click', () => {
        gsap.from(btn, { opacity: 0, y: -10, duration: 0.3, ease: 'power1.out' });
      });
    });