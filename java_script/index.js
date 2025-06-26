document.addEventListener("DOMContentLoaded", () => {
  const cartBtn = document.getElementById("cartButton");
  const cartSidebar = document.getElementById("shoppingCartSidebar");
  const cartOverlay = document.getElementById("cartOverlay");
  const closeCart = document.getElementById("closeCart");
  const continueShopping = document.querySelector(".continue-shopping");

  
  const openCart = (e) => {
    e.preventDefault();
    const isMobile = window.innerWidth <= 991;

    cartSidebar.classList.add("active");
    cartOverlay.classList.add("active");

    gsap.fromTo(
      cartSidebar,
      { x: isMobile ? "100%" : 400 },
      { x: 0, duration: 0.5, ease: "power2.out" }
    );
    gsap.to(cartOverlay, { opacity: 1, duration: 0.3 });
  };

  const closeCartPanel = () => {
    const isMobile = window.innerWidth <= 991;

    gsap.to(cartSidebar, {
      x: isMobile ? "100%" : 400,
      duration: 0.4,
      ease: "power2.in",
      onComplete: () => {
        cartSidebar.classList.remove("active");
        cartOverlay.classList.remove("active");
      }
    });
    gsap.to(cartOverlay, { opacity: 0, duration: 0.3 });
  };

  cartBtn.addEventListener("click", openCart);
  closeCart.addEventListener("click", closeCartPanel);
  cartOverlay.addEventListener("click", closeCartPanel);
  continueShopping.addEventListener("click", closeCartPanel);

  
  const dropdownTriggers = document.querySelectorAll("[data-anim-trigger]");
  dropdownTriggers.forEach(trigger => {
    const menu = trigger.querySelector(".dropdown-menu") || trigger.nextElementSibling;
    if (!menu) return;

    trigger.addEventListener("mouseenter", () => {
      menu.style.display = "block";
      gsap.fromTo(menu, { y: -15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" });
    });

    trigger.addEventListener("mouseleave", () => {
      gsap.to(menu, {
        y: -15,
        opacity: 0,
        duration: 0.25,
        ease: "power2.in",
        onComplete: () => {
          menu.style.display = "none";
        }
      });
    });
  });

  
  let lastScroll = 0;
  const navbar = document.querySelector(".luxury-navbar");

  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > lastScroll && currentScroll > 80) {
      gsap.to(navbar, { y: "-100%", opacity: 0.95, duration: 0.4 });
    } else {
      gsap.to(navbar, { y: "0%", opacity: 1, duration: 0.4 });
    }
    lastScroll = currentScroll;
  });
});




const searchInput = document.querySelector('input[type="search"]');
const resultsList = document.getElementById('searchResults');

let allProducts = [];


fetch('./json/full_products.json')
  .then(res => res.json())
  .then(data => {
    
    allProducts = data.categories.flatMap(category =>
      category.products.map(p => ({
        ...p,
        category: category.name
      }))
    );
  })
  .catch(err => {
    console.error('Failed to load products JSON:', err);
  });


searchInput.addEventListener('input', () => {
  const query = searchInput.value.trim().toLowerCase();

  if (query.length < 2) {
    resultsList.innerHTML = '';
    return;
  }

  
  const matched = allProducts.filter(p => p.name.toLowerCase().includes(query));

  if (matched.length === 0) {
    resultsList.innerHTML = '<li>No products found</li>';
    return;
  }

  
  resultsList.innerHTML = matched
    .map(p => `
      <li>
        <img src="${p.image}" alt="${p.name}" />
        <div class="product-info">
          <div class="product-name">${p.name}</div>
          <div class="product-price">$${p.price.toFixed(2)}</div>
        </div>
      </li>
    `).join('');
});


resultsList.addEventListener('click', e => {
  const li = e.target.closest('li');
  if (!li) return;

  const productName = li.querySelector('.product-name').textContent;
  searchInput.value = productName;
  resultsList.innerHTML = '';
});



fetch('./json/categories.json')
  .then(res => res.json())
  .then(categories => {
    const container = document.querySelector('.category-buttons');
    categories.forEach(category => {
      const link = document.createElement('a');
      link.className = 'category-btn';
      link.href = category.url;
      link.innerHTML = `
        <div class="circle">
          <img src="${category.img}" alt="${category.name}">
        </div>
        <span>${category.name}</span>
      `;
      container.appendChild(link);
    });
  });

fetch('./json/deals.json')
  .then(res => res.json())
  .then(deals => {
    const dealsContainer = document.getElementById('supper-deals');
    deals.forEach((deal, index) => {
      const col = document.createElement('div');
      col.innerHTML = `
  <div class="card supper-card position-relative h-100 border-0">
    <span class="position-absolute top-0 start-0 bg-danger text-white px-3 py-1 small rounded-end fw-semibold shadow-sm" style="z-index: 2; font-size: 0.8rem;">
      ${deal.discount}% OFF
    </span>

    <div class="position-relative overflow-hidden rounded-top">
      <img src="${deal.img1}" class="card-img-top" alt="${deal.title}">
      <img src="${deal.img2}" class="card-img-top card-img-hover" alt="${deal.title}">
    </div>

    <div class="card-body d-flex flex-column justify-content-between">
      <div>
        <small class="text-muted text-uppercase mb-1 d-inline-block" style="letter-spacing: 0.05em;">
          ${deal.category}
        </small>
        <h6 class="card-title mb-2 lh-sm" style="font-size: 1.05rem;">
          ${deal.title}
        </h6>
        <div class="text-warning mb-2" style="font-size: 0.9rem;">★★★★☆</div>

        <div class="d-flex align-items-center gap-2 mb-3">
          <span class="text-danger fw-bold fs-6" style="letter-spacing: -0.3px;">$${deal.price.toFixed(2)}</span>
          <span class="text-muted text-decoration-line-through fs-6 opacity-75">$${deal.oldPrice.toFixed(2)}</span>
        </div>
      </div>

      <div class="d-flex gap-2 flex-wrap mt-auto" id="countdown-${index}"></div>
    </div>
  </div>
`;

      dealsContainer.appendChild(col);

      const countdownEl = document.getElementById(`countdown-${index}`);
      let secondsLeft = deal.timeLeft;

      function updateCountdown() {
        const days = Math.floor(secondsLeft / 86400);
        const hours = Math.floor((secondsLeft % 86400) / 3600);
        const minutes = Math.floor((secondsLeft % 3600) / 60);
        const seconds = secondsLeft % 60;

        countdownEl.innerHTML = `
          <div class="countdown-box">${days}<br><small>Days</small></div>
          <div class="countdown-box">${hours}<br><small>Hrs</small></div>
          <div class="countdown-box">${minutes}<br><small>Mins</small></div>
          <div class="countdown-box">${seconds}<br><small>Secs</small></div>
        `;

        secondsLeft--;
        if (secondsLeft < 0) clearInterval(interval);
      }

      updateCountdown();
      const interval = setInterval(updateCountdown, 1000);
    });
  });
document.addEventListener("DOMContentLoaded", () => {
  
  fetch('./json/topBanners.json')
    .then(res => res.json())
    .then(topBanners => {
      const topWrapper = document.getElementById("topBannerRow");

      topBanners.forEach(banner => {
        const col = document.createElement("div");
        col.className = "col-lg-4 col-md-6 mb-4";

        col.innerHTML = `
          <div class="custom-banner-card">
            <div>
              <small class="d-block mb-2">${banner.subtitle}</small>
              <h4>${banner.title}</h4>
              <p><a href="#">${banner.btnText}</a></p>
            </div>
            <img src="${banner.img}" alt="${banner.title}" class="custom-banner-image">
          </div>
        `;

        topWrapper.appendChild(col);
      });
    });

  
  fetch('./json/bottomBanners.json')
    .then(res => res.json())
    .then(bottomBanners => {
      const bottomWrapper = document.getElementById("bottomBannerRow");

      bottomBanners.forEach(banner => {
        const col = document.createElement("div");
        col.className = "col-lg-3 col-sm-6 mb-4";

        col.innerHTML = `
          <div class="custom-banner-card">
            <div>
              <button>${banner.subtitle}</button>
              <h4>${banner.title}</h4>
            </div>
            <img src="${banner.img}" alt="${banner.title}" class="custom-banner-image mt-3">
          </div>
        `;

        bottomWrapper.appendChild(col);
      });
    });
});






let unitPrice = 0;

function updateTotalPrice() {
  const qty = parseInt(document.getElementById("qty-input").value);
  const total = (unitPrice * qty).toFixed(2);
  document.getElementById("quickview-price-total").textContent = `$${total}`;
}

fetch('./json/products.json')
  .then(res => res.json())
  .then(products => {
    const grid = document.getElementById("product-grid");

    
    products.slice(0, 10).forEach(p => {
      grid.insertAdjacentHTML('beforeend', `
        <div class="col">
          <a href="product.html?title=${encodeURIComponent(p.title)}" target="_blank" class="product-link">
            <div class="product-card">
              <div class="product-image">
                <img src="images/${p.image}" class="main-img" alt="${p.title}">
                <img src="images/${p.hoverImage || p.image}" class="hover-img" alt="${p.title}">
                <button class="quick-view-btn"
                  data-title="${p.title}"
                  data-desc="${p.description}"
                  data-price="${p.price}"
                  data-oldprice="${p.oldPrice || ''}"
                  data-image="images/${p.image}">
                  Quick View
                </button>
              </div>
              <div class="product-details">
                <p class="category">${p.category}</p>
                <h5 class="title">${p.title}</h5>
                <div class="price">
                  <span class="new">${p.price}</span>
                  ${p.oldPrice ? `<span class="old">${p.oldPrice}</span>` : ''}
                </div>
              </div>
            </div>
          </a>
        </div>
      `);
    });

    
    const modal = document.getElementById("quickviewModal");
    const overlay = modal.querySelector(".quickview-modal__overlay");
    const closeBtn = modal.querySelector(".quickview-modal__close");

    function updateTotalPrice() {
      const qty = parseInt(document.getElementById("qty-input").value) || 1;
      const priceText = document.getElementById("quickview-price-single").textContent.replace('$', '');
      const unitPrice = parseFloat(priceText);
      const totalPrice = qty * unitPrice;
      document.getElementById("quickview-price-total").textContent = `$${totalPrice.toFixed(2)}`;
    }

    document.querySelectorAll(".quick-view-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault(); 
        unitPrice = parseFloat(btn.dataset.price.replace('$', ''));
        document.getElementById("quickview-image").src = btn.dataset.image;
        document.getElementById("quickview-title").textContent = btn.dataset.title;
        document.getElementById("quickview-desc").textContent = btn.dataset.desc;
        document.getElementById("quickview-price-single").textContent = `$${unitPrice.toFixed(2)}`;
        document.getElementById("qty-input").value = 1;
        updateTotalPrice();
        modal.style.display = "flex";
        modal.setAttribute('aria-hidden', 'false');
      });
    });

    [overlay, closeBtn].forEach(el =>
      el.addEventListener("click", () => {
        modal.style.display = "none";
        modal.setAttribute('aria-hidden', 'true');
      })
    );

    
    document.getElementById("qty-minus").addEventListener("click", () => {
      const input = document.getElementById("qty-input");
      if (parseInt(input.value) > 1) input.value = parseInt(input.value) - 1;
      updateTotalPrice();
    });

    document.getElementById("qty-plus").addEventListener("click", () => {
      const input = document.getElementById("qty-input");
      input.value = parseInt(input.value) + 1;
      updateTotalPrice();
    });

    document.getElementById("qty-input").addEventListener("input", () => {
      const input = document.getElementById("qty-input");
      if (input.value < 1 || isNaN(input.value)) input.value = 1;
      updateTotalPrice();
    });
  });



fetch('./json/products1.json')
  .then(res => res.json())
  .then(products1 => {
    function render(category) {
      const container = document.getElementById(`${category}-products`);
      container.innerHTML = '';
      const template = document.getElementById("product-template");

      
      products1[category].slice(0, 9).forEach(p => {
        const clone = template.content.cloneNode(true);

        const mainImg = clone.querySelector(".main-image");
        const hoverImg = clone.querySelector(".hover-image");
        const quickBtn = clone.querySelector(".quick-view-btn");

        const categoryEl = clone.querySelector(".card-featured__details-category");
        const titleEl = clone.querySelector(".card-featured__details-title");
        const priceEl = clone.querySelector(".product-card__price");
        const oldPriceEl = clone.querySelector(".product-oldprice");

        mainImg.src = p.img;
        hoverImg.src = p.hoverImg;
        mainImg.alt = hoverImg.alt = p.title;

        titleEl.textContent = p.title;
        categoryEl.textContent = p.category || category.charAt(0).toUpperCase() + category.slice(1);
        priceEl.textContent = p.price;

        if (p.oldPrice) {
          oldPriceEl.textContent = p.oldPrice;
          oldPriceEl.classList.remove("d-none");
        }

        
        quickBtn.dataset.title = p.title;
        quickBtn.dataset.image = p.img;
        quickBtn.dataset.hover = p.hoverImg;
        quickBtn.dataset.price = p.price;
        quickBtn.dataset.desc = p.desc; 

        container.appendChild(clone);
      });

      
      document.querySelectorAll(".quick-view-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const modal = document.getElementById("quickviewModal");
          const overlay = modal.querySelector(".quickview-modal__overlay");
          const closeBtn = modal.querySelector(".quickview-modal__close");

          const unitPrice = parseFloat(btn.dataset.price.replace('$', ''));

          document.getElementById("quickview-image").src = btn.dataset.image;
          document.getElementById("quickview-title").textContent = btn.dataset.title;
          document.getElementById("quickview-desc").textContent = btn.dataset.desc; 
          document.getElementById("quickview-price-single").textContent = `$${unitPrice.toFixed(2)}`;
          document.getElementById("qty-input").value = 1;
          updateTotalPrice();

          modal.style.display = "flex";
          modal.setAttribute('aria-hidden', 'false');

          [overlay, closeBtn].forEach(el =>
            el.addEventListener("click", () => {
              modal.style.display = "none";
              modal.setAttribute('aria-hidden', 'true');
            })
          );
        });
      });
    }

    
    ['smartphone', 'laptop', 'accessories'].forEach(render);
  });



function updateTotalPrice() {
  const qty = parseInt(document.getElementById("qty-input").value) || 1;
  const unitPrice = parseFloat(document.getElementById("quickview-price-single").textContent.replace('$', ''));
  const totalPrice = qty * unitPrice;
  document.getElementById("quickview-price-total").textContent = `$${totalPrice.toFixed(2)}`;
}



document.getElementById("qty-minus").addEventListener("click", () => {
  const input = document.getElementById("qty-input");
  if (parseInt(input.value) > 1) input.value = parseInt(input.value) - 1;
  updateTotalPrice();
});

document.getElementById("qty-plus").addEventListener("click", () => {
  const input = document.getElementById("qty-input");
  input.value = parseInt(input.value) + 1;
  updateTotalPrice();
});

document.getElementById("qty-input").addEventListener("input", () => {
  const input = document.getElementById("qty-input");
  if (input.value < 1 || isNaN(input.value)) input.value = 1;
  updateTotalPrice();
});




fetch('./json/cardsData.json')
  .then(res => res.json())
  .then(data => {
    const cardsContainerElement = document.getElementById("cardsContainer");
    data.forEach(item => {
      cardsContainerElement.innerHTML += `
        <div class="col-12 col-sm-6 col-lg-3">
          <div class="card-box">
            <img src="${item.img}" alt="${item.title}">
            <div class="card-content">
              <p class="category">${item.category}</p>
              <h5 class="title">${item.title}</h5>
              <div class="meta">${item.meta}</div>
              <p class="desc">${item.desc}</p>
              <a href="${item.href}" class="link">Read More</a>
            </div>
          </div>
        </div>
      `;
    });
  });

fetch('./json/recommended.json')
  .then(res => res.json())
  .then(recommendedData => {
    const recommendedCarousel = document.getElementById("recommendedCarousel");
    recommendedData.forEach(item => {
      recommendedCarousel.innerHTML += `
        <div class="item">
          <div class="card-slider-item">
            <div class="img-container">
              <img src="${item.img}" alt="${item.title}">
            </div>
            <p class="category">${item.category}</p>
            <h6 class="title">${item.title}</h6>
            <div class="price">${item.price}${item.oldPrice ? `<span class="old-price">${item.oldPrice}</span>` : ''}</div>
            <div class="rating">${item.rating}</div>
            <button class="btn btn-primary rounded-circle cart-btn"><i class="bi bi-cart"></i></button>
          </div>
        </div>
      `;
    });

    $('#recommendedCarousel').owlCarousel({
      loop: true,
      margin: 20,
      responsiveClass: true,
      autoplay: true,
      autoplayTimeout: 4000,
      autoplayHoverPause: true,
      responsive:{
        0:{ items:1 },
        576:{ items:2 },
        768:{ items:3 },
        992:{ items:4 },
        1200:{ items:5 }
      }
    });
  });
