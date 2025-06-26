import '/src/input.css'
import { createIcons, icons } from 'lucide';
import Swiper from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, Pagination } from 'swiper/modules';

// Lucide Icons
createIcons({ icons });

// Mobile menu
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenuCloseBtn = document.getElementById('mobile-menu-close-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileOverlay = document.getElementById('mobile-overlay');

if (mobileMenu) {
  const mobileNavLinks = mobileMenu.querySelectorAll('a');
  function openMenu() {
    mobileMenu.classList.add('active');
    mobileOverlay.classList.remove('opacity-0', 'pointer-events-none');
  }

  function closeMenu() {
    mobileMenu.classList.remove('active');
    mobileOverlay.classList.add('opacity-0', 'pointer-events-none');
  }

  mobileMenuBtn.addEventListener('click', openMenu);
  mobileMenuCloseBtn.addEventListener('click', closeMenu);
  mobileOverlay.addEventListener('click', closeMenu);
  mobileNavLinks.forEach(link => link.addEventListener('click', closeMenu));
}


// Testimonial Swiper
const testimonialSwiperEl = document.querySelector('.testimonial-swiper');
if (testimonialSwiperEl) {
  const swiper = new Swiper(testimonialSwiperEl, {
      modules: [Autoplay, Pagination],
      loop: true,
      slidesPerView: 1,
      spaceBetween: 32,
      autoplay: {
          delay: 5000,
          disableOnInteraction: false,
      },
      pagination: {
          el: '.swiper-pagination',
          clickable: true,
      },
      breakpoints: {
          768: {
              slidesPerView: 2,
          },
          1024: {
              slidesPerView: 3,
          }
      }
  });
}

// FAQ Accordion (from contact.html)
const faqToggles = document.querySelectorAll('.faq-toggle');
if (faqToggles.length > 0) {
  faqToggles.forEach(button => {
      button.addEventListener('click', () => {
          const content = button.nextElementSibling;
          const icon = button.querySelector('i');
          
          if (content.style.maxHeight) {
              content.style.maxHeight = null;
              icon.style.transform = 'rotate(0deg)';
          } else {
              document.querySelectorAll('.faq-content').forEach(c => c.style.maxHeight = null);
              document.querySelectorAll('.faq-toggle i').forEach(i => i.style.transform = 'rotate(0deg)');
              content.style.maxHeight = content.scrollHeight + "px";
              icon.style.transform = 'rotate(180deg)';
          }
      });
  });
} 