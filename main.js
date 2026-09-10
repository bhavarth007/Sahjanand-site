// ==========================================================================
// SAHJANAND — Corporate Site Interactive Scripts
// ==========================================================================

document.addEventListener('DOMContentLoaded', function () {
 // 1. Highlight active navigation page
 var rawPath = window.location.pathname.split('/').pop() || '';
 var currentPath = rawPath.replace(/\.html$/, '') || './';
 if (currentPath === 'index') currentPath = './';

 var activeLink = null;
 document.querySelectorAll('.main-nav a').forEach(function (link) {
  var href = (link.getAttribute('href') || '').split('?')[0].split('#')[0];
  var cleanHref = href.replace(/\.html$/, '');
  if (cleanHref === currentPath || (currentPath === './' && (cleanHref === './' || cleanHref === '.' || cleanHref === ''))) {
   link.classList.add('active');
   activeLink = link;
  }
 });

 // 2. Center active mobile tab in horizontal scroll view
 var navContainer = document.querySelector('.main-nav');
 if (activeLink && navContainer && navContainer.scrollWidth > navContainer.clientWidth) {
  setTimeout(function () {
   var scrollOffset = activeLink.offsetLeft - (navContainer.clientWidth / 2) + (activeLink.clientWidth / 2);
   navContainer.scrollTo({ left: Math.max(0, scrollOffset), behavior: 'smooth' });
  }, 100);
 }

 // 3. Dynamic current year in footer
 document.querySelectorAll('.js-year').forEach(function (el) {
  el.textContent = new Date().getFullYear();
 });

 // 4. Contact form with email, phone validation & friendly states
 var form = document.querySelector('#contact-form');
 if (form) {
  // Check if query params have a pre-selected product or inquiry
  var urlParams = new URLSearchParams(window.location.search);
  var inquiryParam = urlParams.get('inquiry');
  var productParam = urlParams.get('product');

  if (inquiryParam) {
   var inqLower = inquiryParam.toLowerCase();
   var subjectSelect = form.querySelector('#subject');
   var msgField = form.querySelector('#message');

   if (subjectSelect) {
    var matched = false;
    for (var i = 0; i < subjectSelect.options.length; i++) {
     var optVal = subjectSelect.options[i].value.toLowerCase();
     if ((inqLower.indexOf('yarn') !== -1 && optVal.indexOf('yarn') !== -1) ||
         ((inqLower.indexOf('rapier') !== -1 || inqLower.indexOf('vapiar') !== -1) && (optVal.indexOf('rapier') !== -1 || optVal.indexOf('vapiar') !== -1)) ||
         ((inqLower.indexOf('weaving') !== -1 || inqLower.indexOf('viving') !== -1) && (optVal.indexOf('weaving') !== -1 || optVal.indexOf('viving') !== -1)) ||
         (inqLower.indexOf('purchase') !== -1 && optVal.indexOf('purchase') !== -1) ||
         (inqLower === 'textile' && optVal.indexOf('textile') !== -1)) {
      subjectSelect.selectedIndex = i;
      matched = true;
      break;
     }
    }
    if (!matched) {
     for (var j = 0; j < subjectSelect.options.length; j++) {
      if (subjectSelect.options[j].value.toLowerCase().indexOf('textile') !== -1) {
       subjectSelect.selectedIndex = j;
       break;
      }
     }
    }
   }

   if (msgField && !msgField.value) {
    if (inqLower.indexOf('yarn') !== -1) {
     msgField.value = 'Inquiry regarding Yarn Section & Warp Preparation. Please provide details on filament types, warping capacity, and supply timelines.';
    } else if (inqLower.indexOf('rapier') !== -1 || inqLower.indexOf('vapiar') !== -1) {
     msgField.value = 'Inquiry regarding Vapiar Section (Rapier Loom Weaving). Please provide information on fabric specifications, reed widths, and minimum lot sizes.';
    } else if (inqLower.indexOf('weaving') !== -1 || inqLower.indexOf('viving') !== -1) {
     msgField.value = 'Inquiry regarding Viving Sector (High-Speed Weaving). Please provide quotation for grey cloth production, monthly meterage, and quality standards.';
    } else if (inqLower.indexOf('purchase') !== -1) {
     msgField.value = 'Inquiry regarding Purchase Section & Bulk Grey Trading. Please provide details on raw material procurement, lot inspection, and trade contracts.';
    } else {
     msgField.value = 'Inquiry regarding Textile Manufacturing & Fabric Supply. Please provide technical fabric specifications, minimum order quantity, and production scheduling.';
    }
   }
  } else if (productParam) {
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

 // 5. Interactive 4-Page Textile Section Switcher (Home Page)
 var textileContainer = document.querySelector('#textile-division');
 if (textileContainer) {
  var tabButtons = textileContainer.querySelectorAll('.textile-tab-btn');
  var panels = textileContainer.querySelectorAll('.textile-page-panel');
  var pageNumbers = textileContainer.querySelectorAll('.page-num-btn');
  var prevBtn = textileContainer.querySelector('.js-prev-page');
  var nextBtn = textileContainer.querySelector('.js-next-page');
  var statusText = textileContainer.querySelector('.js-page-status');

  var pageLabels = {
   1: 'Page 1 of 4: Yarn Section',
   2: 'Page 2 of 4: Vapiar Section (Rapier)',
   3: 'Page 3 of 4: Viving Sector (Weaving)',
   4: 'Page 4 of 4: Purchase Section'
  };

  var currentPage = 1;

  function goToPage(targetPage, shouldScroll) {
   if (targetPage < 1) targetPage = 4;
   if (targetPage > 4) targetPage = 1;
   currentPage = targetPage;

   // Update tab buttons
   tabButtons.forEach(function (btn) {
    var page = parseInt(btn.getAttribute('data-target-page'), 10);
    if (page === currentPage) {
     btn.classList.add('active');
     btn.setAttribute('aria-selected', 'true');
    } else {
     btn.classList.remove('active');
     btn.setAttribute('aria-selected', 'false');
    }
   });

   // Update panels
   panels.forEach(function (panel) {
    var page = parseInt(panel.getAttribute('data-page'), 10);
    if (page === currentPage) {
     panel.classList.add('active');
    } else {
     panel.classList.remove('active');
    }
   });

   // Update numbered pagination buttons
   pageNumbers.forEach(function (btn) {
    var page = parseInt(btn.getAttribute('data-target-page'), 10);
    if (page === currentPage) {
     btn.classList.add('active');
    } else {
     btn.classList.remove('active');
    }
   });

   // Update status text
   if (statusText) {
    statusText.textContent = pageLabels[currentPage] || ('Page ' + currentPage + ' of 4');
   }

   // Smooth subtle scroll if requested
   if (shouldScroll) {
    var headerOffset = textileContainer.offsetTop - 80;
    window.scrollTo({ top: Math.max(0, headerOffset), behavior: 'smooth' });
   }
  }

  // Click on tab buttons
  tabButtons.forEach(function (btn) {
   btn.addEventListener('click', function (e) {
    e.preventDefault();
    var target = parseInt(this.getAttribute('data-target-page'), 10);
    goToPage(target, false);
   });
  });

  // Click on pagination numbers
  pageNumbers.forEach(function (btn) {
   btn.addEventListener('click', function (e) {
    e.preventDefault();
    var target = parseInt(this.getAttribute('data-target-page'), 10);
    goToPage(target, false);
   });
  });

  // Prev / Next button clicks
  if (prevBtn) {
   prevBtn.addEventListener('click', function (e) {
    e.preventDefault();
    goToPage(currentPage - 1, false);
   });
  }
  if (nextBtn) {
   nextBtn.addEventListener('click', function (e) {
    e.preventDefault();
    goToPage(currentPage + 1, false);
   });
  }

  // Check hash on load (#yarn, #vapiar, #rapier, #viving, #weaving, #purchase)
  var hash = (window.location.hash || '').toLowerCase();
  if (hash === '#page-yarn' || hash === '#yarn') {
   goToPage(1, false);
  } else if (hash === '#page-vapiar' || hash === '#vapiar' || hash === '#rapier') {
   goToPage(2, false);
  } else if (hash === '#page-viving' || hash === '#viving' || hash === '#weaving') {
   goToPage(3, false);
  } else if (hash === '#page-purchase' || hash === '#purchase') {
   goToPage(4, false);
  }
 }

 // 6. Document preview / download modal handler for investors.html
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
