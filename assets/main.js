(function () {
  'use strict';

  var currentLang = 'id';
  var userPausedVideo = false;

  var roomMedia = {
    pendopo: {
      src: 'assets/tmii-central-java-pavilon-2.jpg',
      width: 1701,
      height: 1276,
      altId: 'Arsitektur paviliun kayu jati Jawa Tengah dengan atap joglo bertingkat dan serambi terbuka.',
      altEn: 'Central Javanese teakwood pavilion architecture with tiered joglo roof and open veranda.',
      captionId: 'Pendopo Agung: Ruang perjamuan utama di bawah konstruksi tumpang sari kayu jati.',
      captionEn: 'Grand Pendopo: Main dining hall beneath tiered teakwood tumpang sari beams.',
      credit: '"TMII Central Java Pavilon 2" by Gunawan Kartapranata, CC BY-SA 3.0'
    },
    rempah: {
      src: 'assets/joglo-pencu-rumah-tradisional-kudus.jpg',
      width: 1920,
      height: 1280,
      altId: 'Arsitektur rumah kayu jati ukir Joglo Pencu khas Kudus untuk ruang jamuan privat tertutup.',
      altEn: 'Carved teakwood Joglo Pencu traditional architecture from Kudus for enclosed private banquets.',
      captionId: 'Kamar Rempah: Ruang jamuan tertutup berpanel kayu jati ukir untuk perundingan keluarga dan jamuan resmi.',
      captionEn: 'Spice Chamber: Carved teakwood enclosed dining room for family deliberations and formal banquets.',
      credit: '"Joglo Pencu, Rumah Tradisional Kudus" by Herusutimbul, CC BY-SA 4.0'
    },
    serambi: {
      src: 'assets/joglo-rumah-tradisional-jawa-tengah.jpg',
      width: 1920,
      height: 1083,
      altId: 'Rumah Joglo kayu tradisional Jawa Tengah yang dikelilingi halaman rumput hijau dan pepohonan.',
      altEn: 'Central Javanese traditional timber Joglo pavilion surrounded by green lawn and trees.',
      captionId: 'Serambi Taman: Teras teduh menghadap halaman hijau untuk perjamuan sore dan makan malam.',
      captionEn: 'Garden Veranda: Shaded terrace facing the green lawn for late afternoon and evening seating.',
      credit: '"Joglo, Rumah Tradisional Jawa Tengah" by Herusutimbul, CC BY-SA 4.0'
    }
  };

  function initReveal() {
    var items = document.querySelectorAll('[data-reveal]');
    if (!items.length) return;

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach(function (el) {
        el.classList.add('is-in');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px 35% 0px' }
    );

    items.forEach(function (el) {
      observer.observe(el);
    });

    window.addEventListener(
      'scroll',
      function () {
        if (window.scrollY > window.innerHeight * 4) {
          items.forEach(function (el) {
            el.classList.add('is-in');
          });
        }
      },
      { passive: true }
    );
  }

  function initMobileNav() {
    var toggle = document.getElementById('menu-toggle');
    var nav = document.getElementById('site-nav');
    if (!toggle || !nav) return;

    function closeMenu() {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }

    toggle.addEventListener('click', function () {
      var expanded = toggle.getAttribute('aria-expanded') === 'true';
      if (expanded) {
        closeMenu();
      } else {
        nav.classList.add('is-open');
        toggle.setAttribute('aria-expanded', 'true');
      }
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        closeMenu();
        toggle.focus();
      }
    });
  }

  function buildWhatsAppMessage() {
    var nameInput = document.getElementById('wa-name');
    var dateInput = document.getElementById('wa-date');
    var sessionSelect = document.getElementById('wa-session');
    var guestsInput = document.getElementById('wa-guests');
    var roomSelect = document.getElementById('wa-room');
    var notesInput = document.getElementById('wa-notes');

    var guestName = nameInput && nameInput.value.trim() ? nameInput.value.trim() : '[Nama Tamu / Guest Name]';
    var dateVal = dateInput && dateInput.value ? dateInput.value : '[Tanggal / Preferred Date]';
    var guestsVal = guestsInput && guestsInput.value ? guestsInput.value : '4';

    var sessionText = '';
    if (sessionSelect && sessionSelect.selectedOptions.length) {
      var opt = sessionSelect.selectedOptions[0];
      sessionText = currentLang === 'en' ? (opt.getAttribute('data-i18n-en') || opt.textContent) : (opt.getAttribute('data-i18n-id') || opt.textContent);
    }

    var roomText = '';
    if (roomSelect && roomSelect.selectedOptions.length) {
      var rOpt = roomSelect.selectedOptions[0];
      roomText = currentLang === 'en' ? (rOpt.getAttribute('data-i18n-en') || rOpt.textContent) : (rOpt.getAttribute('data-i18n-id') || rOpt.textContent);
    }

    var notesVal = notesInput && notesInput.value.trim()
      ? notesInput.value.trim()
      : (currentLang === 'en' ? 'None specified' : 'Tidak ada catatan khusus');

    if (currentLang === 'en') {
      return [
        'Good day Reservation Desk of PENDOPO KENCANA [PLACEHOLDER: Brand Name],',
        '',
        'I would like to submit a formal table / private dining inquiry:',
        '- Guest Name: ' + guestName,
        '- Preferred Date: ' + dateVal,
        '- Seating Session: ' + sessionText,
        '- Party Size: ' + guestsVal + ' guests',
        '- Dining Room: ' + roomText,
        '- Dietary & Event Notes: ' + notesVal,
        '',
        'Please confirm seat availability and the tasting menu deposit procedure. Thank you.'
      ].join('\n');
    }

    return [
      'Selamat siang Meja Reservasi PENDOPO KENCANA [PLACEHOLDER: Nama Merek],',
      '',
      'Saya ingin mengajukan permohonan reservasi meja / ruang privat resmi:',
      '- Nama Tamu: ' + guestName,
      '- Tanggal Jamuan: ' + dateVal,
      '- Sesi Jamuan: ' + sessionText,
      '- Jumlah Tamu: ' + guestsVal + ' orang',
      '- Pilihan Ruang: ' + roomText,
      '- Catatan Pantangan & Acara: ' + notesVal,
      '',
      'Mohon informasi ketersediaan ruang serta prosedur konfirmasi deposit jamuan. Terima kasih.'
    ].join('\n');
  }

  function updateWhatsAppPreview() {
    var msg = buildWhatsAppMessage();
    var previewEl = document.getElementById('wa-live-preview');
    var modalPreviewEl = document.getElementById('modal-wa-preview');
    var modalLinkEl = document.getElementById('modal-wa-link');

    if (previewEl) {
      previewEl.textContent = msg;
    }
    if (modalPreviewEl) {
      modalPreviewEl.textContent = msg;
    }
    if (modalLinkEl) {
      var encoded = encodeURIComponent(msg);
      modalLinkEl.setAttribute('href', 'https://wa.me/?text=' + encoded);
    }
  }

  function updateShowcaseMedia(roomKey) {
    var media = roomMedia[roomKey];
    if (!media) return;

    var img = document.getElementById('showcase-plate-img');
    var caption = document.getElementById('showcase-plate-caption');
    var trigger = document.getElementById('showcase-enlarge-btn');

    if (img) {
      img.setAttribute('src', media.src);
      img.setAttribute('width', String(media.width));
      img.setAttribute('height', String(media.height));
      img.setAttribute('alt', currentLang === 'en' ? media.altEn : media.altId);
      img.setAttribute('data-aria-id', media.altId);
      img.setAttribute('data-aria-en', media.altEn);
    }

    if (caption) {
      caption.textContent = currentLang === 'en' ? media.captionEn : media.captionId;
      caption.setAttribute('data-i18n-id', media.captionId);
      caption.setAttribute('data-i18n-en', media.captionEn);
    }

    if (trigger) {
      trigger.setAttribute('data-full-src', media.src);
      trigger.setAttribute('data-caption-id', media.captionId + ' (' + media.credit + ')');
      trigger.setAttribute('data-caption-en', media.captionEn + ' (' + media.credit + ')');
    }
  }

  function initRoomTabs() {
    var tabs = Array.prototype.slice.call(document.querySelectorAll('.room-tab[role="tab"]'));
    var panels = Array.prototype.slice.call(document.querySelectorAll('.room-panel[role="tabpanel"]'));
    var roomSelect = document.getElementById('wa-room');
    if (!tabs.length) return;

    function activateTab(targetTab, focusTab) {
      var roomKey = targetTab.getAttribute('data-room');
      tabs.forEach(function (tab) {
        var isSelected = tab === targetTab;
        tab.setAttribute('aria-selected', isSelected ? 'true' : 'false');
        tab.setAttribute('tabindex', isSelected ? '0' : '-1');
      });

      panels.forEach(function (panel) {
        var isMatch = panel.id === targetTab.getAttribute('aria-controls');
        if (isMatch) {
          panel.removeAttribute('hidden');
        } else {
          panel.setAttribute('hidden', '');
        }
      });

      if (roomKey) {
        updateShowcaseMedia(roomKey);
        if (roomSelect && roomSelect.value !== roomKey) {
          roomSelect.value = roomKey;
          updateWhatsAppPreview();
        }
      }

      if (focusTab) {
        targetTab.focus();
      }
    }

    tabs.forEach(function (tab, index) {
      tab.addEventListener('click', function () {
        activateTab(tab, false);
      });

      tab.addEventListener('keydown', function (e) {
        var nextIndex = null;
        if (e.key === 'ArrowRight') {
          nextIndex = (index + 1) % tabs.length;
        } else if (e.key === 'ArrowLeft') {
          nextIndex = (index - 1 + tabs.length) % tabs.length;
        } else if (e.key === 'Home') {
          nextIndex = 0;
        } else if (e.key === 'End') {
          nextIndex = tabs.length - 1;
        }
        if (nextIndex !== null) {
          e.preventDefault();
          activateTab(tabs[nextIndex], true);
        }
      });
    });

    if (roomSelect) {
      roomSelect.addEventListener('change', function () {
        var matchingTab = document.querySelector('.room-tab[data-room="' + roomSelect.value + '"]');
        if (matchingTab) {
          activateTab(matchingTab, false);
        }
      });
    }
  }

  function copyTextToClipboard(text, onDone) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(onDone).catch(function () {
        fallbackCopy(text, onDone);
      });
    } else {
      fallbackCopy(text, onDone);
    }
  }

  function fallbackCopy(text, onDone) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      /* ignore fallback error */
    }
    document.body.removeChild(ta);
    if (onDone) onDone();
  }

  function openDialog(dialog) {
    if (!dialog) return;
    if (typeof dialog.showModal === 'function') {
      if (!dialog.open) dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }
  }

  function closeDialog(dialog) {
    if (!dialog) return;
    if (typeof dialog.close === 'function' && dialog.open) {
      dialog.close();
    } else {
      dialog.removeAttribute('open');
    }
  }

  function initComposerAndModal() {
    var form = document.getElementById('wa-composer-form');
    var copyBtn = document.getElementById('wa-copy-btn');
    var statusEl = document.getElementById('wa-status');
    var waModal = document.getElementById('wa-modal');
    var waModalClose = document.getElementById('wa-modal-close');
    var modalCopyBtn = document.getElementById('modal-copy-btn');
    var dateInput = document.getElementById('wa-date');

    if (dateInput && !dateInput.value) {
      var tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 2);
      dateInput.value = tomorrow.toISOString().slice(0, 10);
    }

    updateWhatsAppPreview();

    if (form) {
      form.querySelectorAll('input, select, textarea').forEach(function (field) {
        field.addEventListener('input', updateWhatsAppPreview);
        field.addEventListener('change', updateWhatsAppPreview);
      });

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        updateWhatsAppPreview();
        openDialog(waModal);
      });
    }

    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        var msg = buildWhatsAppMessage();
        copyTextToClipboard(msg, function () {
          if (statusEl) {
            statusEl.textContent = currentLang === 'en'
              ? 'Reservation text copied to clipboard. Ready to paste into WhatsApp once [PLACEHOLDER: WhatsApp Number] is supplied.'
              : 'Teks reservasi berhasil disalin ke papan klip. Siap ditempel ke WhatsApp setelah [PLACEHOLDER: Nomor WhatsApp] diisi.';
          }
        });
      });
    }

    if (modalCopyBtn) {
      modalCopyBtn.addEventListener('click', function () {
        var msg = buildWhatsAppMessage();
        copyTextToClipboard(msg, function () {
          modalCopyBtn.textContent = currentLang === 'en'
            ? 'Copied to Clipboard'
            : 'Berhasil Disalin';
          setTimeout(function () {
            modalCopyBtn.textContent = currentLang === 'en'
              ? (modalCopyBtn.getAttribute('data-i18n-en') || 'Copy Message Text')
              : (modalCopyBtn.getAttribute('data-i18n-id') || 'Salin Teks Pesan');
          }, 2200);
        });
      });
    }

    document.querySelectorAll('[data-wa-direct]').forEach(function (trigger) {
      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        updateWhatsAppPreview();
        openDialog(waModal);
      });
    });

    if (waModalClose && waModal) {
      waModalClose.addEventListener('click', function () {
        closeDialog(waModal);
      });
      waModal.addEventListener('click', function (e) {
        if (e.target === waModal) {
          closeDialog(waModal);
        }
      });
    }
  }

  function initLightbox() {
    var lightbox = document.getElementById('lightbox-modal');
    var lightboxImg = document.getElementById('lightbox-img');
    var lightboxCaption = document.getElementById('lightbox-caption');
    var lightboxClose = document.getElementById('lightbox-close');
    if (!lightbox || !lightboxImg) return;

    document.querySelectorAll('.enlarge-trigger').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var src = btn.getAttribute('data-full-src');
        var capId = btn.getAttribute('data-caption-id') || '';
        var capEn = btn.getAttribute('data-caption-en') || '';
        var captionText = currentLang === 'en' ? capEn : capId;

        if (src) {
          lightboxImg.setAttribute('src', src);
          lightboxImg.setAttribute('alt', captionText);
        }
        if (lightboxCaption) {
          lightboxCaption.textContent = captionText;
          lightboxCaption.setAttribute('data-i18n-id', capId);
          lightboxCaption.setAttribute('data-i18n-en', capEn);
        }
        openDialog(lightbox);
      });
    });

    if (lightboxClose) {
      lightboxClose.addEventListener('click', function () {
        closeDialog(lightbox);
      });
    }

    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) {
        closeDialog(lightbox);
      }
    });
  }

  function updateVideoButtonLabel(video, btn) {
    if (!video || !btn) return;
    var isPaused = userPausedVideo || video.paused;
    btn.setAttribute('aria-pressed', isPaused ? 'true' : 'false');
    if (currentLang === 'en') {
      btn.textContent = isPaused ? 'Play Hearth Footage' : 'Pause Hearth Footage';
    } else {
      btn.textContent = isPaused ? 'Putar Rekaman Tungku' : 'Jeda Rekaman Tungku';
    }
  }

  function initVideoControl() {
    var video = document.getElementById('ember-video');
    var btn = document.getElementById('video-toggle-btn');
    if (!video || !btn) return;

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      video.pause();
      userPausedVideo = true;
      updateVideoButtonLabel(video, btn);
    } else if ('IntersectionObserver' in window) {
      var vObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting && !userPausedVideo) {
              var playPromise = video.play();
              if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(function () {});
              }
            } else if (!entry.isIntersecting) {
              video.pause();
            }
            updateVideoButtonLabel(video, btn);
          });
        },
        { threshold: 0.25 }
      );
      vObserver.observe(video);
    }

    btn.addEventListener('click', function () {
      if (userPausedVideo || video.paused) {
        userPausedVideo = false;
        var p = video.play();
        if (p && typeof p.catch === 'function') {
          p.catch(function () {});
        }
        btn.setAttribute('aria-pressed', 'false');
        btn.textContent = currentLang === 'en' ? 'Pause Hearth Footage' : 'Jeda Rekaman Tungku';
      } else {
        userPausedVideo = true;
        video.pause();
        btn.setAttribute('aria-pressed', 'true');
        btn.textContent = currentLang === 'en' ? 'Play Hearth Footage' : 'Putar Rekaman Tungku';
      }
    });

    video.addEventListener('play', function () {
      updateVideoButtonLabel(video, btn);
    });
    video.addEventListener('pause', function () {
      updateVideoButtonLabel(video, btn);
    });
  }

  function setLanguage(lang) {
    currentLang = lang === 'en' ? 'en' : 'id';
    document.documentElement.setAttribute('lang', currentLang);

    document.querySelectorAll('.lang-btn[data-lang]').forEach(function (btn) {
      var active = btn.getAttribute('data-lang') === currentLang;
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    document.querySelectorAll('[data-i18n-id][data-i18n-en]').forEach(function (el) {
      var nextText = currentLang === 'en'
        ? el.getAttribute('data-i18n-en')
        : el.getAttribute('data-i18n-id');
      if (nextText !== null) {
        el.textContent = nextText;
      }
    });

    document.querySelectorAll('[data-placeholder-id][data-placeholder-en]').forEach(function (el) {
      var nextPh = currentLang === 'en'
        ? el.getAttribute('data-placeholder-en')
        : el.getAttribute('data-placeholder-id');
      if (nextPh !== null) {
        el.setAttribute('placeholder', nextPh);
      }
    });

    document.querySelectorAll('[data-aria-id][data-aria-en]').forEach(function (el) {
      var nextAria = currentLang === 'en'
        ? el.getAttribute('data-aria-en')
        : el.getAttribute('data-aria-id');
      if (nextAria !== null) {
        if (el.tagName === 'IMG') {
          el.setAttribute('alt', nextAria);
        } else {
          el.setAttribute('aria-label', nextAria);
        }
      }
    });

    var video = document.getElementById('ember-video');
    var videoBtn = document.getElementById('video-toggle-btn');
    updateVideoButtonLabel(video, videoBtn);
    updateWhatsAppPreview();
  }

  function initLanguageSwitch() {
    document.querySelectorAll('.lang-btn[data-lang]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var targetLang = btn.getAttribute('data-lang');
        setLanguage(targetLang);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initReveal();
    initMobileNav();
    initRoomTabs();
    initComposerAndModal();
    initLightbox();
    initVideoControl();
    initLanguageSwitch();
  });
})();
