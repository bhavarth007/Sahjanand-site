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

    // Placeholders to hoist drawer and backdrop directly to <body> on mobile screens
    // This completely removes them from the sticky header's stacking context and layout bounds,
    // ensuring the drawer is statically 100% pinned from viewport top (0) to bottom (0).
    var navPlaceholder = document.createComment('nav-placeholder');
    var isMobileDrawerDetached = false;

    function handleNavResponsive() {
      if (window.innerWidth <= 992) {
        if (!isMobileDrawerDetached && navDrawer.parentElement) {
          navDrawer.parentElement.insertBefore(navPlaceholder, navDrawer);
          document.body.appendChild(navDrawer);
          if (backdrop) {
            document.body.appendChild(backdrop);
          }
          isMobileDrawerDetached = true;
        }
      } else {
        if (isMobileDrawerDetached && navPlaceholder.parentElement) {
          navPlaceholder.parentElement.insertBefore(navDrawer, navPlaceholder);
          isMobileDrawerDetached = false;
          closeDrawer();
        }
      }
    }

    handleNavResponsive();
    window.addEventListener('resize', handleNavResponsive);

    var savedScrollY = 0;

    function openDrawer() {
      savedScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
      navDrawer.classList.add('active');
      if (backdrop) backdrop.classList.add('active');
      toggleBtn.classList.add('active');
      toggleBtn.setAttribute('aria-expanded', 'true');
      document.body.classList.add('mobile-nav-open');
      document.documentElement.classList.add('mobile-nav-open');
      document.body.style.position = 'fixed';
      document.body.style.top = '-' + savedScrollY + 'px';
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';
    }

    function closeDrawer() {
      if (!navDrawer.classList.contains('active')) return;
      navDrawer.classList.remove('active');
      if (backdrop) backdrop.classList.remove('active');
      toggleBtn.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('mobile-nav-open');
      document.documentElement.classList.remove('mobile-nav-open');
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      window.scrollTo(0, savedScrollY);
    }

    // Prevent background touch scrolling while drawer is active
    function preventTouchScroll(e) {
      if (navDrawer.classList.contains('active')) {
        if (!e.target.closest('nav.main-nav ul')) {
          e.preventDefault();
        }
      }
    }
    window.addEventListener('touchmove', preventTouchScroll, { passive: false });

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
      backdrop.addEventListener('click', function (e) {
        e.stopPropagation();
        closeDrawer();
      });
      backdrop.addEventListener('touchstart', function (e) {
        e.stopPropagation();
        closeDrawer();
      }, { passive: true });
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
              (inqLower.indexOf('chemical') !== -1 && optVal.indexOf('chemical') !== -1) ||
              (inqLower.indexOf('trade') !== -1 && optVal.indexOf('trade') !== -1) ||
              (inqLower.indexOf('purchase') !== -1 && optVal.indexOf('trade') !== -1) ||
              (inqLower === 'textile' && optVal.indexOf('weaving') !== -1)) {
            subjectSelect.selectedIndex = i;
            matched = true;
            break;
          }
        }
        if (!matched) {
          for (var j = 0; j < subjectSelect.options.length; j++) {
            if (subjectSelect.options[j].value.toLowerCase().indexOf('weaving') !== -1) {
              subjectSelect.selectedIndex = j;
              break;
            }
          }
        }
      }

      if (msgField && !msgField.value) {
        if (inqLower.indexOf('weaving') !== -1 || inqLower.indexOf('viving') !== -1) {
          msgField.value = 'Inquiry regarding Weaving Segment (High-Speed Weaving Division). Please provide quotation for grey cloth production, monthly meterage, and quality standards.';
        } else if (inqLower.indexOf('yarn') !== -1) {
          msgField.value = 'Inquiry regarding Yarn Segment & Warp Preparation. Please provide details on filament types, warping capacity, and supply timelines.';
        } else if (inqLower.indexOf('chemical') !== -1 || inqLower.indexOf('camical') !== -1) {
          msgField.value = 'Inquiry regarding Chemical Segment. Please provide details on textile sizing chemicals, polymer binders, and processing auxiliaries.';
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

    // Custom Select Component Logic & Two-Way Sync
    var selectWrap = document.getElementById('custom-subject-wrap');
    var customBtn = document.getElementById('custom-subject-btn');
    var customLabel = customBtn ? customBtn.querySelector('.custom-select-label') : null;
    var customDropdown = document.getElementById('custom-subject-dropdown');
    var customItems = customDropdown ? customDropdown.querySelectorAll('.custom-select-item, .custom-select-subitem') : [];
    var submenuContainers = customDropdown ? customDropdown.querySelectorAll('.custom-select-has-submenu') : [];
    var subjectSelect = form.querySelector('#subject');

    function syncCustomSelectDisplay(val) {
      if (!customLabel || !subjectSelect) return;
      var selectedText = '';
      if (!val) {
        customLabel.textContent = 'Select an enquiry type';
        customLabel.classList.add('is-placeholder');
      } else {
        for (var idx = 0; idx < subjectSelect.options.length; idx++) {
          if (subjectSelect.options[idx].value === val) {
            selectedText = subjectSelect.options[idx].text;
            break;
          }
        }
        customLabel.textContent = selectedText || val;
        customLabel.classList.remove('is-placeholder');
      }
      for (var m = 0; m < customItems.length; m++) {
        if (customItems[m].getAttribute('data-value') === val) {
          customItems[m].classList.add('is-selected');
        } else {
          customItems[m].classList.remove('is-selected');
        }
      }
    }

    function closeAllSubmenus() {
      for (var s = 0; s < submenuContainers.length; s++) {
        submenuContainers[s].classList.remove('is-submenu-open');
      }
    }

    if (selectWrap && customBtn && customDropdown) {
      customBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        var isOpen = selectWrap.classList.contains('is-open');
        if (isOpen) {
          selectWrap.classList.remove('is-open');
          customBtn.setAttribute('aria-expanded', 'false');
          closeAllSubmenus();
        } else {
          selectWrap.classList.add('is-open');
          customBtn.setAttribute('aria-expanded', 'true');
        }
      });

      for (var ci = 0; ci < customItems.length; ci++) {
        (function (item) {
          item.addEventListener('click', function (e) {
            e.stopPropagation();
            var parentSubmenuWrap = item.closest('.custom-select-has-submenu');
            // On touch or smaller screens, clicking parent item toggles submenu
            if (item.classList.contains('custom-select-parent-item') && parentSubmenuWrap) {
              if (window.innerWidth <= 768) {
                var wasOpen = parentSubmenuWrap.classList.contains('is-submenu-open');
                closeAllSubmenus();
                if (!wasOpen) {
                  parentSubmenuWrap.classList.add('is-submenu-open');
                }
                return;
              }
            }

            var chosenVal = item.getAttribute('data-value');
            if (subjectSelect) {
              subjectSelect.value = chosenVal;
              var evt = document.createEvent('HTMLEvents');
              evt.initEvent('change', true, false);
              subjectSelect.dispatchEvent(evt);
            }
            syncCustomSelectDisplay(chosenVal);
            selectWrap.classList.remove('is-open');
            customBtn.setAttribute('aria-expanded', 'false');
            closeAllSubmenus();
            customBtn.focus();
          });
        })(customItems[ci]);
      }

      document.addEventListener('click', function (e) {
        if (!selectWrap.contains(e.target)) {
          selectWrap.classList.remove('is-open');
          customBtn.setAttribute('aria-expanded', 'false');
          closeAllSubmenus();
        }
      });

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' || e.keyCode === 27) {
          selectWrap.classList.remove('is-open');
          customBtn.setAttribute('aria-expanded', 'false');
          closeAllSubmenus();
        }
      });

      if (subjectSelect) {
        subjectSelect.addEventListener('change', function () {
          syncCustomSelectDisplay(subjectSelect.value);
        });
        // Initial sync on page load (handles prefilled URL params)
        syncCustomSelectDisplay(subjectSelect.value);
      }

      form.addEventListener('reset', function () {
        setTimeout(function () {
          syncCustomSelectDisplay('');
          closeAllSubmenus();
        }, 10);
      });
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

  // Celebration Confetti Cannon (Triggered ONLY when form is successfully submitted)
  function launchCelebration() {
    var canvas = document.createElement('canvas');
    canvas.id = 'celebration-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '99999';
    document.body.appendChild(canvas);

    var ctx = canvas.getContext('2d');
    var dpr = window.devicePixelRatio || 1;
    var width = canvas.width = window.innerWidth * dpr;
    var height = canvas.height = window.innerHeight * dpr;

    var colors = ['#F59E0B', '#0284C7', '#10B981', '#C21E1E', '#38BDF8', '#E8620C', '#FCD34D'];
    var particles = [];
    var particleCount = window.innerWidth < 768 ? 85 : 150;

    for (var i = 0; i < particleCount; i++) {
      var angle = (Math.PI * 0.25) + Math.random() * (Math.PI * 0.5);
      var speed = (Math.random() * 15 + 9) * dpr;
      var fromLeft = i % 2 === 0;
      particles.push({
        x: fromLeft ? (width * 0.2 + (Math.random() * 0.15 * width)) : (width * 0.8 - (Math.random() * 0.15 * width)),
        y: height * 0.82,
        vx: (fromLeft ? 1 : -1) * Math.cos(angle) * speed + (Math.random() - 0.5) * 6 * dpr,
        vy: -Math.sin(angle) * speed,
        size: (Math.random() * 8 + 5) * dpr,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        wobble: Math.random() * 10,
        wobbleSpeed: Math.random() * 0.1 + 0.05,
        shape: Math.random() > 0.35 ? 'rect' : 'circle'
      });
    }

    var startTime = Date.now();
    var duration = 3000;

    function render() {
      var elapsed = Date.now() - startTime;
      if (elapsed > duration) {
        if (canvas.parentNode) {
          canvas.parentNode.removeChild(canvas);
        }
        return;
      }

      ctx.clearRect(0, 0, width, height);

      var globalAlpha = 1;
      if (elapsed > duration - 700) {
        globalAlpha = Math.max(0, (duration - elapsed) / 700);
      }

      for (var p = 0; p < particles.length; p++) {
        var pt = particles[p];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.vy += 0.35 * dpr;
        pt.vx *= 0.985;
        pt.rotation += pt.rotationSpeed;
        pt.wobble += pt.wobbleSpeed;

        ctx.save();
        ctx.translate(pt.x, pt.y);
        ctx.rotate((pt.rotation * Math.PI) / 180);
        ctx.scale(Math.cos(pt.wobble), 1);
        ctx.globalAlpha = globalAlpha;
        ctx.fillStyle = pt.color;

        if (pt.shape === 'rect') {
          ctx.fillRect(-pt.size / 2, -pt.size / 3, pt.size, pt.size * 0.6);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, pt.size / 2.5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
  }

      var submitBtn = form.querySelector('button[type="submit"]');
      var originalBtnText = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending Message...';
      }

      status.className = 'form-status sending';
      status.innerHTML = '<span class="form-status-spinner"></span><span>Transmitting your enquiry securely to our corporate team...</span>';

      fetch('https://formsubmit.co/ajax/sahjanandpolyweavespvtltd18@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: 'Website Enquiry: ' + subject + ' - ' + name,
          _template: 'table',
          _captcha: 'false',
          _replyto: email,
          'Full Name': name,
          'Email Address': email,
          'Phone / Mobile': phone || 'Not provided',
          'Enquiry Subject': subject,
          'Detailed Message': message
        })
      })
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        if (data.success === 'true' || data.success === true) {
          // Launch celebratory confetti only on successful delivery
          launchCelebration();

          var waText = encodeURIComponent('Hello Sahjanand team, I submitted an enquiry regarding: ' + subject + ' (' + name + ', ' + (phone || email) + ')');
          var waUrl = 'https://wa.me/919727564411?text=' + waText;

          status.innerHTML = '<div class="status-success-box">' +
            '<div class="status-header">' +
              '<div class="status-icon-wrap">' +
                '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16A34A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>' +
              '</div>' +
              '<div>' +
                '<h4 class="status-title">Enquiry Sent Successfully!</h4>' +
                '<p class="status-desc">Thank you, <strong>' + name + '</strong>! Your requirements have been submitted to our corporate team. We will review your inquiry and respond within one business day.</p>' +
              '</div>' +
            '</div>' +
            '<div class="status-actions">' +
              '<a href="' + waUrl + '" target="_blank" rel="noopener noreferrer" class="status-whatsapp-link">' +
                '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.311.045-.698.055-1.114-.081-.663-.217-1.523-.624-2.593-1.696-1.378-1.378-2.03-2.613-2.222-2.946-.192-.333-.021-.513.15-.684.154-.153.342-.396.513-.594.171-.198.228-.333.342-.558.114-.225.057-.423-.028-.594-.085-.171-.77-1.854-1.055-2.541-.277-.667-.559-.576-.77-.587-.198-.011-.423-.013-.655-.013-.232 0-.609.087-.928.435-.319.348-1.226 1.198-1.226 2.921 0 1.724 1.255 3.39 1.426 3.618.171.228 2.47 3.772 5.984 5.289 2.08.898 2.899.98 3.933.826.63-.094 1.913-.782 2.184-1.538.271-.756.271-1.404.19-1.538-.08-.134-.3-.214-.64-.384z"/></svg>' +
                '<span>Need immediate assistance? Connect directly on WhatsApp (+91 97275 64411) &rarr;</span>' +
              '</a>' +
            '</div>' +
          '</div>';
          status.className = 'form-status';
          form.reset();
        } else if (data.message && data.message.indexOf('Activation') !== -1) {
          status.innerHTML = '<div class="status-success-box">' +
            '<div class="status-header">' +
              '<div class="status-icon-wrap">' +
                '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16A34A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>' +
              '</div>' +
              '<div>' +
                '<h4 class="status-title">Message Submitted!</h4>' +
                '<p class="status-desc">Thank you, <strong>' + name + '</strong>! Your message has been received by our corporate team. We will review your inquiry shortly.</p>' +
              '</div>' +
            '</div>' +
          '</div>';
          status.className = 'form-status';
        } else {
          status.innerHTML = '<div class="status-success-box">' +
            '<div class="status-header">' +
              '<div>' +
                '<h4 class="status-title">Enquiry Received!</h4>' +
                '<p class="status-desc">Thank you, <strong>' + name + '</strong>! Your enquiry has been received. Our team will contact you soon.</p>' +
              '</div>' +
            '</div>' +
          '</div>';
          status.className = 'form-status';
        }
      })
      .catch(function (err) {
        console.error('Form submission error:', err);
        var mailtoSubject = encodeURIComponent('Product Enquiry: ' + subject + ' - ' + name);
        var mailtoBody = encodeURIComponent(
          'Dear Sahjanand Team,\n\n' +
          'Full Name: ' + name + '\n' +
          'Email: ' + email + '\n' +
          'Phone: ' + (phone || 'N/A') + '\n' +
          'Subject: ' + subject + '\n\n' +
          'Message:\n' + message
        );
        var mailtoUrl = 'mailto:sahjanandpolyweavespvtltd18@gmail.com?subject=' + mailtoSubject + '&body=' + mailtoBody;
        status.innerHTML = 'Unable to send automatically via background server. <a href="' + mailtoUrl + '" style="color:#0284C7; font-weight:700; text-decoration:underline;">Click here to send via email app</a> or <a href="https://wa.me/919727564411" target="_blank" style="color:#0284C7; font-weight:700; text-decoration:underline;">message on WhatsApp</a>.';
        status.className = 'form-status error';
      })
      .finally(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
      });
    });
  }

  // 4b. Contact Office & Plant Invitation Rotating Message Banner (changes every 2.5s)
  var visitRotator = document.querySelector('.contact-visit-banner');
  if (visitRotator) {
    var messageItems = visitRotator.querySelectorAll('.visit-message-item');
    var dotItems = visitRotator.querySelectorAll('.visit-dot');
    var currentIndex = 0;
    var totalMessages = messageItems.length;
    var rotatorInterval = null;

    function showMessage(index) {
      for (var i = 0; i < totalMessages; i++) {
        messageItems[i].classList.remove('active');
        if (dotItems[i]) dotItems[i].classList.remove('active');
      }
      messageItems[index].classList.add('active');
      if (dotItems[index]) dotItems[index].classList.add('active');
      currentIndex = index;
    }

    function startRotator() {
      if (rotatorInterval) clearInterval(rotatorInterval);
      rotatorInterval = setInterval(function () {
        var nextIndex = (currentIndex + 1) % totalMessages;
        showMessage(nextIndex);
      }, 2500);
    }

    function stopRotator() {
      if (rotatorInterval) clearInterval(rotatorInterval);
    }

    visitRotator.addEventListener('mouseenter', stopRotator);
    visitRotator.addEventListener('mouseleave', startRotator);

    for (var d = 0; d < dotItems.length; d++) {
      (function (idx) {
        dotItems[idx].addEventListener('click', function () {
          showMessage(idx);
          startRotator();
        });
      })(d);
    }

    startRotator();
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


  // Mobile Certificate Carousel Scroll & Dots Sync
  var certGrid = document.querySelector('.cert-grid');
  var certDots = document.querySelectorAll('.cert-dot');
  if (certGrid && certDots.length > 0) {
    var certCards = certGrid.querySelectorAll('.cert-card');
    
    certGrid.addEventListener('scroll', function () {
      if (window.innerWidth <= 992 && certCards.length > 0) {
        var scrollLeft = certGrid.scrollLeft;
        var cardWidth = certCards[0].offsetWidth + 16;
        var activeIndex = Math.round(scrollLeft / cardWidth);
        activeIndex = Math.max(0, Math.min(activeIndex, certDots.length - 1));
        
        for (var d = 0; d < certDots.length; d++) {
          if (d === activeIndex) {
            certDots[d].classList.add('is-active');
          } else {
            certDots[d].classList.remove('is-active');
          }
        }
      }
    }, { passive: true });

    for (var di = 0; di < certDots.length; di++) {
      (function (index) {
        certDots[index].addEventListener('click', function () {
          if (certCards[index]) {
            certCards[index].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
          }
        });
      })(di);
    }
  }

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
