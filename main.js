// ==========================================================================
// SAHJANAND GROUP — shared site behaviour
// ==========================================================================

document.addEventListener('DOMContentLoaded', function () {
  // Mobile nav toggle
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Highlight current page in nav
  var here = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === here) link.classList.add('active');
  });

  // Footer year
  document.querySelectorAll('.js-year').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // Contact form — client-side validation + friendly confirmation
  var form = document.querySelector('#contact-form');
  if (form) {
    var status = form.querySelector('.form-status');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var required = form.querySelectorAll('[required]');
      var allFilled = true;
      required.forEach(function (field) {
        if (!field.value.trim()) allFilled = false;
      });
      if (!allFilled) {
        status.textContent = 'Please fill in all required fields before sending.';
        status.className = 'form-status';
        return;
      }
      status.textContent = 'Thank you — your message has been received. Our team will get back to you shortly.';
      status.className = 'form-status success';
      form.reset();
    });
  }
});
