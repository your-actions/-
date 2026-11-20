"use strict";

// ==========================================
// 1. МЕНЮ (БУРГЕР)
// ==========================================
function initMenu() {
  const header = document.querySelector('[data-js="menu"]');
  if (!header) return;

  const menuBtn = header.querySelector('.menu-button');
  const nav = header.querySelector('.nav');

  if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      menuBtn.setAttribute('aria-expanded', isOpen);
    });
  }
}

// ==========================================
// 2. ТАБЫ (ГАЛЕРЕЯ)
// ==========================================
function initTabs() {
  const tabsSection = document.querySelector('[data-js="tabs"]');
  if (!tabsSection) return;

  const tabButtons = tabsSection.querySelectorAll('.tab-button');
  const cards = tabsSection.querySelectorAll('.project-card');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // 1. Переключить активный класс и aria-selected у кнопок
      tabButtons.forEach(b => {
        b.classList.remove('is-active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');

      // 2. Показать/скрыть карточки
      const category = btn.getAttribute('data-tab');
      
      cards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        if (category === 'all') {
          // Для "Все" показываем только первые 9 карточек (те, у которых нет атрибута hidden изначально)
          // Но чтобы логика была надежной, проверим индекс карточки в NodeList
          const index = Array.from(cards).indexOf(card);
          if (index < 9) {
            card.hidden = false;
          } else {
            card.hidden = true;
          }
        } else {
          // Для "Планеты" и "Люди" показываем все подходящие по категории
          if (cardCategory === category) {
            card.hidden = false;
          } else {
            card.hidden = true;
          }
        }
      });
    });
  });
}

// ==========================================
// 3. АККОРДЕОН
// ==========================================
function initAccordion() {
  const accordionSection = document.querySelector('[data-js="accordion"]');
  if (!accordionSection) return;

  const items = accordionSection.querySelectorAll('.accordion-item');

  items.forEach(item => {
    const btn = item.querySelector('.accordion-title');
    const panel = item.querySelector('.accordion-panel');

    if (btn && panel) {
      btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');

        // Закрываем все остальные (одновременно открыт только один)
        items.forEach(otherItem => {
          otherItem.classList.remove('is-open');
          otherItem.querySelector('.accordion-title').setAttribute('aria-expanded', 'false');
          otherItem.querySelector('.accordion-panel').hidden = true;
        });

        // Если текущий был закрыт — открываем его
        if (!isOpen) {
          item.classList.add('is-open');
          btn.setAttribute('aria-expanded', 'true');
          panel.hidden = false;
        }
      });
    }
  });
}

// ==========================================
// 4. СЛАЙДЕР
// ==========================================
function initSlider() {
  const sliderSection = document.querySelector('[data-js="slider"]');
  if (!sliderSection) return;

  const track = sliderSection.querySelector('.slider__track');
  const slides = sliderSection.querySelectorAll('.slider__slide');
  const prevBtn = sliderSection.querySelector('.prev');
  const nextBtn = sliderSection.querySelector('.next');
  const counter = sliderSection.querySelector('.slider__counter');

  if (!track || slides.length === 0) return;

  let currentIndex = 0;

  function updateSlider() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    if (counter) {
      counter.textContent = `${currentIndex + 1} / ${slides.length}`;
    }
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % slides.length;
      updateSlider();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateSlider();
    });
  }

  updateSlider(); // Инициализация счетчика
}

// ==========================================
// 5. МОДАЛЬНОЕ ОКНО И ФОРМА
// ==========================================
function initModalAndForm() {
  const openBtn = document.querySelector('.open-modal-btn');
  const modal = document.getElementById('application-modal');
  
  if (!openBtn || !modal) return;

  const closeBtn = modal.querySelector('.modal__close');
  const form = modal.querySelector('.form');
  
  // Открытие
  openBtn.addEventListener('click', () => {
    modal.showModal();
  });

  // Закрытие по крестику
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.close();
    });
  }

  // Закрытие по клику на backdrop (затемнение)
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.close();
    }
  });

  // Обработка формы
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault(); // Отменяем перезагрузку страницы
      
      let isValid = true;
      
      const nameInput = form.querySelector('#name');
      const emailInput = form.querySelector('#email');
      const agreeInput = form.querySelector('#agree');
      
      const nameError = form.querySelector('#name-error');
      const emailError = form.querySelector('#email-error');
      const agreeError = form.querySelector('#agree-error');
      const successMsg = form.querySelector('.form__success');

      // Сброс ошибок
      nameError.textContent = '';
      emailError.textContent = '';
      agreeError.textContent = '';
      successMsg.hidden = true;

      // Валидация имени
      if (nameInput.value.trim() === '') {
        nameError.textContent = 'Введите ваше имя';
        isValid = false;
      }

      // Валидация email
      const emailValue = emailInput.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailValue === '') {
        emailError.textContent = 'Введите email';
        isValid = false;
      } else if (!emailRegex.test(emailValue)) {
        emailError.textContent = 'Введите корректный email';
        isValid = false;
      }

      // Валидация чекбокса
      if (!agreeInput.checked) {
        agreeError.textContent = 'Необходимо согласие';
        isValid = false;
      }

      // Если всё ок
      if (isValid) {
        form.reset();
        successMsg.hidden = false;
        // Закрываем модалку через 2 секунды после успеха
        setTimeout(() => {
          modal.close();
          successMsg.hidden = true; // Сброс для следующего открытия
        }, 2000);
      }
    });
  }
}

// ==========================================
// 6. КУКИ-УВЕДОМЛЕНИЕ
// ==========================================
function initCookies() {
  const cookieNotice = document.querySelector('[data-js="cookies"]');
  if (!cookieNotice) return;

  const acceptBtn = cookieNotice.querySelector('.cookie-btn');

  // Проверяем, принял ли пользователь куки ранее
  if (!localStorage.getItem('cookiesAccepted')) {
    cookieNotice.hidden = false;
  }

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      cookieNotice.hidden = true;
      localStorage.setItem('cookiesAccepted', 'true');
    });
  }
}

// ==========================================
// 7. ДИАГНОСТИКА (ИЗ ПР №3)
// ==========================================
function initDiagnostics() {
  const preparedComponents = document.querySelectorAll("[data-js]");
  const status = document.querySelector("[data-js-status]");

  console.log(`Подготовлено компонентов: ${preparedComponents.length}`);

  if (status) {
    status.textContent = `JavaScript подключен, найдено компонентов: ${preparedComponents.length}`;
    status.classList.add("status--ready");
  }
}

// ==========================================
// ЗАПУСК ВСЕХ КОМПОНЕНТОВ
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  initMenu();
  initTabs();
  initAccordion();
  initSlider();
  initModalAndForm();
  initCookies();
  initDiagnostics();
});