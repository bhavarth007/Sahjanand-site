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

  // 2. Mobile Right-Side Navigation Drawer
  function initMobileNavigation() {
    var toggleBtn = document.querySelector('.mobile-nav-toggle');
    var navDrawer = document.querySelector('.main-nav');
    var closeBtn = document.querySelector('.mobile-drawer-close');
    var backdrop = document.querySelector('.mobile-nav-backdrop');

    if (!toggleBtn || !navDrawer) return;

    function openDrawer() {
      navDrawer.classList.add('active');
      if (backdrop) backdrop.classList.add('active');
      toggleBtn.classList.add('active');
      toggleBtn.setAttribute('aria-expanded', 'true');
      document.body.classList.add('mobile-nav-open');
    }

    function closeDrawer() {
      navDrawer.classList.remove('active');
      if (backdrop) backdrop.classList.remove('active');
      toggleBtn.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('mobile-nav-open');
    }

    toggleBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (navDrawer.classList.contains('active')) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        closeDrawer();
      });
    }

    if (backdrop) {
      backdrop.addEventListener('click', function () {
        closeDrawer();
      });
    }

    // Close drawer when clicking any link
    navDrawer.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        closeDrawer();
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navDrawer.classList.contains('active')) {
        closeDrawer();
      }
    });
  }

  initMobileNavigation();

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
        if (inqLower.indexOf('weaving') !== -1 || inqLower.indexOf('viving') !== -1) {
          msgField.value = 'Inquiry regarding Weaving Sector (High-Speed Weaving Division). Please provide quotation for grey cloth production, monthly meterage, and quality standards.';
        } else if (inqLower.indexOf('yarn') !== -1) {
          msgField.value = 'Inquiry regarding Yarn Sector & Warp Preparation. Please provide details on filament types, warping capacity, and supply timelines.';
        } else if (inqLower.indexOf('chemical') !== -1 || inqLower.indexOf('camical') !== -1) {
          msgField.value = 'Inquiry regarding Chemical Sector. Please provide details on textile sizing chemicals, polymer binders, and processing auxiliaries.';
        } else if (inqLower.indexOf('trade') !== -1 || inqLower.indexOf('trad') !== -1 || inqLower.indexOf('import') !== -1 || inqLower.indexOf('export') !== -1 || inqLower.indexOf('purchase') !== -1) {
          msgField.value = 'Inquiry regarding Trade (Import & Export Division). Please provide details on raw polymer procurement, export grey cloth contracts, and commercial supply.';
        } else if (inqLower.indexOf('rapier') !== -1) {
          msgField.value = 'Inquiry regarding Rapier Weaving. Please provide information on fabric specifications, reed widths, and minimum lot sizes.';
        } else {
          msgField.value = 'Inquiry regarding Textile Manufacturing & Fabric Supply. Please provide technical fabric specifications, minimum order quantity, and production scheduling.';
        }
      }
    } else if (productParam) {
      var subjectSelect = form.querySelector('#subject');
      if (subjectSelect) {
        for (var k = 0; k < subjectSelect.options.length; k++) {
          if (subjectSelect.options[k].text.toLowerCase().indexOf(productParam.toLowerCase()) !== -1) {
            subjectSelect.selectedIndex = k;
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

      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        status.textContent = 'Please enter a valid email address.';
        status.className = 'form-status error';
        return;
      }

      if (phone && !/^[0-9+\s\-().]{7,20}$/.test(phone)) {
        status.textContent = 'Please enter a valid phone number or leave blank.';
        status.className = 'form-status error';
        return;
      }

      var submitBtn = form.querySelector('button[type="submit"]');
      var originalBtnText = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
      }

      status.textContent = 'Thank you. Your inquiry has been received. Our sales team will get back to you within 24 hours.';
      status.className = 'form-status success';
      form.reset();

      setTimeout(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
      }, 2500);
    });
  }

  // 5. Interactive Textile Department Switcher
  function initTextilePageSwitcher() {
    var tabBtns = document.querySelectorAll('.textile-tab-btn');
    var panels = document.querySelectorAll('.textile-page-panel');
    var switcherBtns = document.querySelectorAll('.btn-dept-link');

    if (!tabBtns.length || !panels.length) return;

    function switchTextilePage(targetPage, shouldScroll) {
      var targetStr = String(targetPage);

      // Update tabs
      tabBtns.forEach(function (btn) {
        var isMatch = btn.getAttribute('data-target-page') === targetStr;
        btn.classList.toggle('active', isMatch);
        btn.setAttribute('aria-selected', isMatch ? 'true' : 'false');
      });

      // Update department panels
      panels.forEach(function (panel) {
        var isMatch = panel.getAttribute('data-page') === targetStr;
        panel.classList.toggle('active', isMatch);
        panel.style.display = isMatch ? 'block' : 'none';
      });

      // Update facilities panels (Four Specialized Facilities)
      var facilitiesPanels = document.querySelectorAll('.facilities-page-panel');
      facilitiesPanels.forEach(function (fPanel) {
        var isMatch = fPanel.getAttribute('data-facilities-page') === targetStr;
        fPanel.classList.toggle('active', isMatch);
        fPanel.style.display = isMatch ? 'block' : 'none';
      });

      if (shouldScroll) {
        var container = document.querySelector('#textile-division');
        if (container) {
          container.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }

    tabBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var page = this.getAttribute('data-target-page');
        switchTextilePage(page, false);
      });
    });

    switcherBtns.forEach(function (linkBtn) {
      linkBtn.addEventListener('click', function (e) {
        var targetPage = this.getAttribute('data-switch');
        if (targetPage) {
          e.preventDefault();
          switchTextilePage(targetPage, true);
          var hashMap = { '1': '#weaving', '2': '#yarn', '3': '#chemical', '4': '#trade' };
          if (history.pushState && hashMap[targetPage]) {
            history.pushState(null, null, hashMap[targetPage]);
          }
        }
      });
    });

    // Support URL hash routing (#weaving, #yarn, #chemical, #trade)
    function checkHash() {
      var hash = (window.location.hash || '').toLowerCase();
      if (hash === '#weaving' || hash === '#viving' || hash === '#rapier' || hash === '#vapiar') switchTextilePage(1, false);
      else if (hash === '#yarn') switchTextilePage(2, false);
      else if (hash === '#chemical' || hash === '#camical') switchTextilePage(3, false);
      else if (hash === '#trade' || hash === '#trad' || hash === '#import' || hash === '#export' || hash === '#purchase') switchTextilePage(4, false);
    }

    checkHash();
    window.addEventListener('hashchange', checkHash);
  }

  initTextilePageSwitcher();

  // 6. Interactive Product Division Filter (products.html)
  function initProductDivisionFilter() {
    var filterBtns = document.querySelectorAll('.product-filter-btn');
    var productCards = document.querySelectorAll('.product-card[data-division]');
    var divisionHeaders = document.querySelectorAll('.division-group-header[data-division]');
    var catalogSection = document.querySelector('#catalog');

    if (!filterBtns.length || !productCards.length) return;

    function applyDivisionFilter(filterKey, shouldScroll) {
      var activeKey = (filterKey || 'all').toLowerCase().trim();

      // Update button active state
      filterBtns.forEach(function (btn) {
        var btnFilter = (btn.getAttribute('data-filter') || '').toLowerCase().trim();
        var isMatch = btnFilter === activeKey;
        btn.classList.toggle('active', isMatch);
        btn.setAttribute('aria-selected', isMatch ? 'true' : 'false');
      });

      // Show/hide product cards
      productCards.forEach(function (card) {
        var cardDiv = (card.getAttribute('data-division') || '').toLowerCase().trim();
        var isVisible = (activeKey === 'all' || cardDiv === activeKey);
        card.classList.toggle('hidden', !isVisible);
      });

      // Show/hide division group headers
      divisionHeaders.forEach(function (header) {
        var headerDiv = (header.getAttribute('data-division') || '').toLowerCase().trim();
        var isVisible = (activeKey === 'all' || headerDiv === activeKey);
        header.classList.toggle('hidden', !isVisible);
      });

      if (shouldScroll && catalogSection) {
        var navHeader = document.querySelector('.site-header');
        var navHeight = navHeader ? navHeader.offsetHeight : 70;
        var elementPosition = catalogSection.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: Math.max(0, elementPosition - navHeight - 10),
          behavior: 'smooth'
        });
      }
    }

    // Attach click listeners to filter buttons
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filter = this.getAttribute('data-filter') || 'all';
        applyDivisionFilter(filter, false);
      });
    });

    // Check URL parameters and hash routing on page load
    function checkUrlForDivision() {
      var urlParams = new URLSearchParams(window.location.search);
      var divisionParam = urlParams.get('division');
      var productParam = urlParams.get('product');
      var hash = (window.location.hash || '').replace('#', '').toLowerCase();

      var targetFilter = null;

      if (divisionParam) {
        targetFilter = divisionParam.toLowerCase();
      } else if (hash) {
        if (hash.indexOf('weaving') !== -1 || hash.indexOf('viving') !== -1 || hash.indexOf('rapier') !== -1 || hash.indexOf('vapiar') !== -1) targetFilter = 'weaving';
        else if (hash.indexOf('yarn') !== -1) targetFilter = 'yarn';
        else if (hash.indexOf('chem') !== -1 || hash.indexOf('cam') !== -1) targetFilter = 'chemical';
        else if (hash.indexOf('trade') !== -1 || hash.indexOf('trad') !== -1 || hash.indexOf('import') !== -1 || hash.indexOf('export') !== -1 || hash.indexOf('purchase') !== -1) targetFilter = 'trade';
        else if (hash.indexOf('concrete') !== -1 || hash.indexOf('paver') !== -1) targetFilter = 'concrete';
        else if (hash.indexOf('steel') !== -1) targetFilter = 'steel';
        else if (hash.indexOf('drainage') !== -1 || hash.indexOf('culvert') !== -1) targetFilter = 'drainage';
        else if (hash.indexOf('fitting') !== -1 || hash.indexOf('pipe') !== -1) targetFilter = 'fittings';
      } else if (productParam) {
        var pLower = productParam.toLowerCase();
        if (pLower.indexOf('weaving') !== -1 || pLower.indexOf('grey') !== -1 || pLower.indexOf('chiffon') !== -1 || pLower.indexOf('suiting') !== -1 || pLower.indexOf('dobby') !== -1 || pLower.indexOf('rapier') !== -1) targetFilter = 'weaving';
        else if (pLower.indexOf('yarn') !== -1 || pLower.indexOf('beam') !== -1 || pLower.indexOf('fdy') !== -1 || pLower.indexOf('dty') !== -1) targetFilter = 'yarn';
        else if (pLower.indexOf('chem') !== -1 || pLower.indexOf('cam') !== -1 || pLower.indexOf('sizing') !== -1 || pLower.indexOf('auxiliary') !== -1) targetFilter = 'chemical';
        else if (pLower.indexOf('trade') !== -1 || pLower.indexOf('trad') !== -1 || pLower.indexOf('polymer') !== -1 || pLower.indexOf('import') !== -1 || pLower.indexOf('export') !== -1 || pLower.indexOf('purchase') !== -1) targetFilter = 'trade';
      }

      if (targetFilter) {
        applyDivisionFilter(targetFilter, true);
      }
    }

    checkUrlForDivision();
    window.addEventListener('hashchange', checkUrlForDivision);
  }

  initProductDivisionFilter();


  // 7. Interactive MSME ZED Gold Certificate Fullscreen Lightbox Modal
  function initCertLightbox() {
    var lightbox = document.querySelector('#cert-lightbox');
    if (!lightbox) return;

    var certData = [
      {
        src: 'images/cert-sahjanand-polyweaves.png',
        title: 'Sahjanand Polyweaves Private Limited',
        num: 'MSME ZED Gold Certified · Udyam: UDYAM-GJ-22-0080797'
      },
      {
        src: 'images/cert-ghanshyam-synthetics.png',
        title: 'Ghanshyam Synthetics',
        num: 'MSME ZED Gold Certified · Udyam: UDYAM-GJ-22-0353781'
      },
      {
        src: 'images/cert-silken-sonnets.png',
        title: 'Silken Sonnets',
        num: 'MSME ZED Gold Certified · Udyam: UDYAM-GJ-22-0035891'
      }
    ];

    var currentIndex = 0;
    var imgEl = lightbox.querySelector('#cert-lightbox-img');
    var titleEl = lightbox.querySelector('#cert-lightbox-title');
    var numEl = lightbox.querySelector('#cert-lightbox-num');
    var closeBtn = lightbox.querySelector('.cert-lightbox-close');
    var prevBtn = lightbox.querySelector('.cert-lightbox-prev');
    var nextBtn = lightbox.querySelector('.cert-lightbox-next');
    var backdrop = lightbox.querySelector('.cert-lightbox-backdrop');

    function renderCert(index) {
      if (index < 0) index = certData.length - 1;
      if (index >= certData.length) index = 0;
      currentIndex = index;

      var data = certData[currentIndex];
      if (imgEl) {
        imgEl.src = data.src;
        imgEl.alt = data.title + ' - MSME ZED Gold Certificate';
      }
      if (titleEl) titleEl.textContent = data.title;
      if (numEl) numEl.textContent = data.num;
    }

    function openLightbox(index) {
      renderCert(index);
      lightbox.style.display = 'flex';
      void lightbox.offsetWidth; // Trigger layout for smooth opacity transition
      lightbox.classList.add('active');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      setTimeout(function () {
        if (!lightbox.classList.contains('active')) {
          lightbox.style.display = 'none';
        }
      }, 250);
    }

    // Attach click to cert cards
    document.querySelectorAll('.cert-card').forEach(function (card) {
      card.addEventListener('click', function () {
        var idx = parseInt(this.getAttribute('data-cert-index'), 10) || 0;
        openLightbox(idx);
      });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          var idx = parseInt(this.getAttribute('data-cert-index'), 10) || 0;
          openLightbox(idx);
        }
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (backdrop) backdrop.addEventListener('click', closeLightbox);
    if (prevBtn) {
      prevBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        renderCert(currentIndex - 1);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        renderCert(currentIndex + 1);
      });
    }

    // Keyboard navigation: Escape to close, Left/Right arrows to flip
    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        renderCert(currentIndex - 1);
      } else if (e.key === 'ArrowRight') {
        renderCert(currentIndex + 1);
      }
    });
  }

  initCertLightbox();


  // 8. Document Preview Modal (if modal elements exist on page)
  var modal = document.querySelector('#doc-modal');
  if (modal) {
    var modalDocTitle = modal.querySelector('#modal-doc-title');
    var modalDocMeta = modal.querySelector('#modal-doc-meta');
    var modalClose = modal.querySelector('#modal-close');

    document.querySelectorAll('.view-doc-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var title = this.getAttribute('data-title') || 'Document';
        var meta = this.getAttribute('data-meta') || '';
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
