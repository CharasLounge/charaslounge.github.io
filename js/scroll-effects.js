/* Scroll-Effekte: gestaffelte Reveals + scrollgetriebene Vinyl-Animation (Music-Seite).
   Respektiert prefers-reduced-motion, rAF-gedrosselt, keine Dauerschleifen. */
(function() {
   'use strict';

   if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

   /* ---------- Gestaffelte Scroll-Reveals ---------- */
   var selectors = [
      '.RightContent > .row p',
      '.RightContent blockquote',
      '.RightContent h2',
      '.RightContent .list-unstyled li',
      '.RightContent img.img-fluid',
      '.RightContent .signature',
      '.album-release > *',
      '.collapsible-container',
      '.embed-consent',
      '.studio p',
      '.studio h1',
      '.container .row img.img-fluid',
      '.contact h1',
      '.contact p',
      '.contact-form h2',
      '.contact-form p',
      '.contact-form .form-group',
      '.contact-form .btn-primary'
   ];

   var elements = [];
   selectors.forEach(function(sel) {
      document.querySelectorAll(sel).forEach(function(el) {
         if (elements.indexOf(el) === -1 && !el.closest('nav')) {
            elements.push(el);
         }
      });
   });

   if ('IntersectionObserver' in window && elements.length) {
      var stagger = 0;
      elements.forEach(function(el) {
         el.classList.add('reveal');
         el.style.setProperty('--reveal-delay', (stagger % 5) * 70 + 'ms');
         stagger++;
      });

      var observer = new IntersectionObserver(function(entries) {
         entries.forEach(function(entry) {
            if (entry.isIntersecting) {
               entry.target.classList.add('is-visible');
               observer.unobserve(entry.target);
            }
         });
      }, { threshold: 0.12, rootMargin: '0px 0px -36px 0px' });

      elements.forEach(function(el) { observer.observe(el); });
   }

   /* ---------- Vinyl-Animation: Platte gleitet beim Scrollen aus dem Cover ---------- */
   var wrap = document.querySelector('.vinyl-wrap');
   if (!wrap) return;

   var ticking = false;
   var lastProgress = -1;

   function updateVinyl() {
      ticking = false;
      var rect = wrap.getBoundingClientRect();
      var vh = window.innerHeight || document.documentElement.clientHeight;
      /* Fortschritt 0→1, während die Sektion von 90% Viewport-Höhe nach oben wandert */
      var progress = (vh * 0.9 - rect.top) / (vh * 0.75);
      progress = Math.max(0, Math.min(1, progress));
      /* sanfte Ease-Out-Kurve */
      progress = 1 - Math.pow(1 - progress, 3);
      if (Math.abs(progress - lastProgress) > 0.002) {
         lastProgress = progress;
         wrap.style.setProperty('--vinyl-p', progress.toFixed(4));
      }
   }

   function onScroll() {
      if (!ticking) {
         ticking = true;
         window.requestAnimationFrame(updateVinyl);
      }
   }

   /* capture:true fängt auch Scroll-Events innerer Scroll-Container */
   document.addEventListener('scroll', onScroll, { capture: true, passive: true });
   window.addEventListener('resize', onScroll, { passive: true });
   updateVinyl();
})();
