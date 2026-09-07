// ==========================================================================
// SAHJANAND — Corporate Site Interactive Scripts
// ==========================================================================

document.addEventListener('DOMContentLoaded', function () {
 // 1. Mobile navigation drawer & body scroll lock
 var toggle = document.querySelector('.menu-toggle');
 var nav = document.querySelector('.main-nav');
 if (toggle && nav) {
  toggle.addEventListener('click', function () {
   var isOpen = nav.classList.toggle('open');
   toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
   document.body.classList.toggle('no-scroll', isOpen);
  });

  nav.querySelectorAll('a').forEach(function (link) {
   link.addEventListener('click', function () {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
   });
  });
 }

 // 2. Highlight active navigation page
 var currentPath = window.location.pathname.split('/').pop() || 'index.html';
 document.querySelectorAll('.main-nav a').forEach(function (link) {
  var href = link.getAttribute('href');
  if (href === currentPath) {
   link.classList.add('active');
  }
 });

 // 3. Dynamic current year in footer
 document.querySelectorAll('.js-year').forEach(function (el) {
  el.textContent = new Date().getFullYear();
 });

 // 4. Contact form with email, phone validation & friendly states
 var form = document.querySelector('#contact-form');
 if (form) {
  // Check if query params have a pre-selected product
  var urlParams = new URLSearchParams(window.location.search);
  var productParam = urlParams.get('product');
  if (productParam) {
   var subjectSelect = form.querySelector('#subject');
   if (subjectSelect) {
    // Try to match option text or select product quotation
    for (var i = 0; i < subjectSelect.options.length; i++) {
     if (subjectSelect.options[i].text.toLowerCase().indexOf(productParam.toLowerCase()) !== -1) {
      subjectSelect.selectedIndex = i;
      break;
     }
    }
   }
   var msgField = form.querySelector('#message');
   if (msgField && !msgField.value) {
    msgField.value = 'Inquiry regarding: ' + productParam + '. Please provide technical specifications and quotation.';
   }
  }

  var status = form.querySelector('.form-status');
  form.addEventListener('submit', function (e) {
   e.preventDefault();
   var name = form.querySelector('#name') ? form.querySelector('#name').value.trim() : '';
   var email = form.querySelector('#email') ? form.querySelector('#email').value.trim() : '';
   var phone = form.querySelector('#phone') ? form.querySelector('#phone').value.trim() : '';
   var subject = form.querySelector('#subject') ? form.querySelector('#subject').value.trim() : '';
   var message = form.querySelector('#message') ? form.querySelector('#message').value.trim() : '';

   if (!name || !email || !subject || !message) {
    status.textContent = 'Please fill in all required fields marked with an asterisk (*).';
    status.className = 'form-status error';
    return;
   }

   // Email validation regex
   var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   if (!emailRegex.test(email)) {
    status.textContent = 'Please enter a valid email address.';
    status.className = 'form-status error';
    return;
   }

   // Phone validation (optional field, but if filled must be reasonable)
   if (phone && !/^[\d\s+\-()]{7,15}$/.test(phone)) {
    status.textContent = 'Please enter a valid telephone or mobile number.';
    status.className = 'form-status error';
    return;
   }

   status.textContent = 'Thank you, ' + name + '. Your enquiry has been received. Our team will contact you within one business day.';
   status.className = 'form-status success';
   form.reset();
  });
 }

 // 5. Document preview / download modal handler for investors.html
 var docButtons = document.querySelectorAll('.js-doc-trigger');
 var modal = document.querySelector('#doc-modal');
 if (modal) {
  var modalClose = modal.querySelector('.modal-close');
  var modalDocTitle = modal.querySelector('.js-modal-title');
  var modalDocMeta = modal.querySelector('.js-modal-meta');

  docButtons.forEach(function (btn) {
   btn.addEventListener('click', function (e) {
    e.preventDefault();
    var title = btn.getAttribute('data-doc-title') || 'Official Document';
    var meta = btn.getAttribute('data-doc-meta') || 'PDF Format';
    if (modalDocTitle) modalDocTitle.textContent = title;
    if (modalDocMeta) modalDocMeta.textContent = meta;
    modal.classList.add('active');
   });
  });

  if (modalClose) {
   modalClose.addEventListener('click', function () {
    modal.classList.remove('active');
   });
  }

  modal.addEventListener('click', function (e) {
   if (e.target === modal) {
    modal.classList.remove('active');
   }
  });
 }
});
