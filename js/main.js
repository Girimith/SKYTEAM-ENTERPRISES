/**
 * SKYTEAM ENTERPRISES - ACT Fibernet Portal JavaScript
 * Handles plan selection, lead submission, WhatsApp dispatch, modals, and FAQs
 */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Nav Toggle
  const mobileToggle = document.getElementById('mobileNavToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });

    // Close menu when a link is clicked
    const navLinks = navMenu.querySelectorAll('.nav-link, .nav-cta-btn');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }

  // Plan Selection from Cards
  const planButtons = document.querySelectorAll('.select-plan-btn');
  const planSelect = document.getElementById('selectedPlan');
  const bookingSection = document.getElementById('bookingSection');
  const bookingCard = document.querySelector('.booking-card');

  planButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const planValue = button.getAttribute('data-plan-val');
      
      if (planSelect && planValue) {
        // Set the selected value in dropdown
        planSelect.value = planValue;
      }

      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Subtle focus animation
        if (bookingCard) {
          bookingCard.style.transition = 'box-shadow 0.4s ease, border-color 0.4s ease';
          bookingCard.style.boxShadow = '0 0 30px rgba(229, 26, 36, 0.45)';
          bookingCard.style.borderColor = '#e51a24';
          setTimeout(() => {
            bookingCard.style.boxShadow = '';
          }, 1800);
        }
      }
    });
  });

  // Plans Filter Tabs
  const filterTabs = document.querySelectorAll('.filter-tab-btn');
  const planCards = document.querySelectorAll('.plan-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterCategory = tab.getAttribute('data-filter');

      planCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterCategory === 'all' || cardCategory.includes(filterCategory)) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });

  // FAQ Accordion
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const item = question.parentElement;
      const isOpen = item.classList.contains('active');

      // Close all others
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

      if (!isOpen) {
        item.classList.add('active');
      }
    });
  });

  // Booking Form Submission & WhatsApp Order Generator
  const bookingForm = document.getElementById('bookingForm');
  const successModal = document.getElementById('successModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const modalWhatsappLink = document.getElementById('modalWhatsappLink');

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('custName').value.trim();
      const address = document.getElementById('custAddress').value.trim();
      const pincode = document.getElementById('custPincode').value.trim();
      const plan = document.getElementById('selectedPlan').value;
      const mobile = document.getElementById('custMobile').value.trim();

      // Mobile validation (10 digits)
      const cleanPhone = mobile.replace(/[^0-9]/g, '');
      if (cleanPhone.length < 10) {
        alert('Please enter a valid 10-digit mobile number.');
        return;
      }

      // Generate Booking Reference ID
      const bookingId = 'ST-' + Math.floor(100000 + Math.random() * 900000);
      const bookingDate = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

      // Save lead locally to localStorage
      const newLead = {
        id: bookingId,
        name,
        address,
        pincode,
        plan,
        mobile,
        date: bookingDate
      };

      try {
        const storedLeads = JSON.parse(localStorage.getItem('skyteam_leads') || '[]');
        storedLeads.unshift(newLead);
        localStorage.setItem('skyteam_leads', JSON.stringify(storedLeads));
      } catch (err) {
        console.warn('LocalStorage error:', err);
      }

      // Format WhatsApp Message
      const waText = 
        `*NEW ACT FIBERNET BOOKING REQUEST*\n` +
        `-----------------------------------------\n` +
        `*Booking ID:* ${bookingId}\n` +
        `*Name:* ${name}\n` +
        `*Mobile:* ${mobile}\n` +
        `*Address:* ${address}\n` +
        `*Pincode:* ${pincode}\n` +
        `*Selected Plan:* ${plan}\n` +
        `*City:* Chennai, Tamil Nadu\n` +
        `-----------------------------------------\n` +
        `Sent via SKYTEAM ENTERPRISES Portal`;

      const waUrl = `https://wa.me/919360042014?text=${encodeURIComponent(waText)}`;

      // Update Modal Content
      document.getElementById('modalCustName').textContent = name;
      document.getElementById('modalCustMobile').textContent = mobile;
      document.getElementById('modalCustPlan').textContent = plan;
      document.getElementById('modalBookingId').textContent = bookingId;

      if (modalWhatsappLink) {
        modalWhatsappLink.href = waUrl;
      }

      // Show Success Modal
      if (successModal) {
        successModal.classList.add('active');
      }

      // Reset Form
      bookingForm.reset();
      document.getElementById('custPincode').value = '600004';
    });
  }

  // Close Modal
  if (closeModalBtn && successModal) {
    closeModalBtn.addEventListener('click', () => {
      successModal.classList.remove('active');
    });

    // Close on clicking outside
    successModal.addEventListener('click', (e) => {
      if (e.target === successModal) {
        successModal.classList.remove('active');
      }
    });
  }

  // ==========================================================================
  // ANIMATED RED GLOWING CURSOR FOLLOWER
  // ==========================================================================
  const cursorPointer = document.getElementById('cursorPointer');

  if (cursorPointer && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let mouseX = -100;
    let mouseY = -100;
    let posX = -100;
    let posY = -100;
    let isMoving = false;

    // Track mouse coordinates
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isMoving) {
        posX = mouseX;
        posY = mouseY;
        isMoving = true;
      }

      cursorPointer.classList.add('visible');
    });

    // Fade out when cursor exits the browser window
    document.addEventListener('mouseleave', () => {
      cursorPointer.classList.remove('visible');
    });

    document.addEventListener('mouseenter', () => {
      cursorPointer.classList.add('visible');
    });

    // Snappy, fluid cursor follower without lagging delay
    function animateCursor() {
      if (isMoving) {
        // High responsiveness factor (0.85) for snappy, instant tracking
        posX += (mouseX - posX) * 0.85;
        posY += (mouseY - posY) * 0.85;

        // Snap when within 0.2px to completely eliminate micro-lag
        if (Math.abs(mouseX - posX) < 0.2) posX = mouseX;
        if (Math.abs(mouseY - posY) < 0.2) posY = mouseY;

        cursorPointer.style.transform = `translate3d(${posX}px, ${posY}px, 0)`;
      }

      requestAnimationFrame(animateCursor);
    }
    requestAnimationFrame(animateCursor);

    // Subtle scale / glow pulse when hovering interactive elements
    const interactiveElements = document.querySelectorAll('a, button, input, select, .plan-card, .feature-pill-card');
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursorPointer.classList.add('hovering');
      });
      el.addEventListener('mouseleave', () => {
        cursorPointer.classList.remove('hovering');
      });
    });
  }
});
