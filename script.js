
const cart = {};

const cartOverlay = document.getElementById('cartOverlay');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const toast = document.getElementById('toast');

function money(value) {
  return `${value.toLocaleString('uk-UA')} ₴`;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');

  clearTimeout(showToast.timer);

  showToast.timer = setTimeout(() => {
    toast.classList.remove('show');
  }, 1900);
}

// Добавление товара в корзину
function addProduct(card) {
  const id = card.dataset.id;

  if (!cart[id]) {
    cart[id] = {
      name: card.dataset.name,
      price: Number(card.dataset.price),
      qty: 0
    };
  }

  cart[id].qty += 1;

  updateCart();
  showToast('Добавлено в корзину');
}

document.querySelectorAll('.add-button').forEach(button => {
  button.addEventListener('click', () => {
    addProduct(button.closest('.product-card'));
  });
});

// Обновление корзины
function updateCart() {
  const entries = Object.entries(cart)
    .filter(([, item]) => item.qty > 0);

  const count = entries.reduce(
    (sum, [, item]) => sum + item.qty, 0
  );

  const total = entries.reduce(
    (sum, [, item]) => sum + item.qty * item.price, 0
  );

  cartCount.textContent = count;
  cartTotal.textContent = money(total);

  if (!entries.length) {
    cartItems.innerHTML = `
      <p class="empty-cart">
        Пока здесь ничего нет.<br>
        Самое время выбрать десерт.
      </p>
    `;
    return;
  }

  cartItems.innerHTML = entries.map(([id, item]) => `
    <div class="cart-item">
      <div>
        <strong>${item.name}</strong>
        <small>${money(item.price)} за шт.</small>
      </div>

      <div class="qty">
        <button data-action="minus" data-id="${id}">−</button>
        <span>${item.qty}</span>
        <button data-action="plus" data-id="${id}">+</button>
      </div>
    </div>
  `).join('');
}

// Изменение количества товаров
cartItems.addEventListener('click', event => {
  const button = event.target.closest('button[data-action]');

  if (!button) return;

  const item = cart[button.dataset.id];

  if (!item) return;

  item.qty += button.dataset.action === 'plus' ? 1 : -1;

  if (item.qty <= 0) {
    delete cart[button.dataset.id];
  }

  updateCart();
});

// Открытие и закрытие корзины
function openCart() {
  cartOverlay.classList.add('open');
  cartOverlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  cartOverlay.classList.remove('open');
  cartOverlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.getElementById('openCart')
  .addEventListener('click', openCart);

document.getElementById('closeCart')
  .addEventListener('click', closeCart);

cartOverlay.addEventListener('click', event => {
  if (event.target === cartOverlay) {
    closeCart();
  }
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeCart();
});

// Фильтрация меню
document.querySelectorAll('.filter').forEach(filter => {
  filter.addEventListener('click', () => {
    document.querySelector('.filter.active')
      ?.classList.remove('active');

    filter.classList.add('active');

    const category = filter.dataset.filter;

    document.querySelectorAll('.product-card')
      .forEach(card => {
        card.hidden =
          category !== 'all' &&
          card.dataset.category !== category;
      });
  });
});

// Оформление демонстрационного заказа
document.getElementById('checkout')
  .addEventListener('click', () => {
    const count = Object.values(cart)
      .reduce((sum, item) => sum + item.qty, 0);

    if (!count) {
      showToast('Сначала добавьте что-нибудь в корзину');
      return;
    }

    showToast('Это демонстрационный сайт — заявка не отправлена');
  });

// Мобильное меню
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');

menuToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');

  menuToggle.setAttribute(
    'aria-expanded',
    String(isOpen)
  );
});

nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');

    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

// Анимация появления блоков
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12
});

document.querySelectorAll('.reveal').forEach(element => {
  observer.observe(element);
});
