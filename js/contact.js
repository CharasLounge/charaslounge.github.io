/* Kinoreifes Anfrageformular: verwandelt das normale Formular in eine
   Szenen-Sequenz (Progressive Enhancement — ohne JS bleibt das Standardformular).
   Versand via mailto: kein Backend, keine Datenübertragung an Dritte. */
document.addEventListener('DOMContentLoaded', function() {
   'use strict';

   var form = document.getElementById('contactForm');
   if (!form) return;

   var MAIL = 'contact_form_anfrage@charas-lounge.com';

   function sendMail() {
      var email = document.getElementById('email').value.trim();
      var subject = document.getElementById('subject').value.trim();
      var message = document.getElementById('message').value.trim();
      var body = message + '\n\n—\nReply to: ' + email;
      window.location.href = 'mailto:' + MAIL +
         '?subject=' + encodeURIComponent(subject) +
         '&body=' + encodeURIComponent(body);
   }

   /* ---------- Fallback: einfaches Formular, falls das Film-UI nicht baut ---------- */
   form.addEventListener('submit', function(e) {
      e.preventDefault();
      if (!form.classList.contains('film-form')) sendMail();
   });

   /* ---------- Film-UI aufbauen ---------- */
   var groups = Array.prototype.slice.call(form.querySelectorAll('.form-group'));
   var submitBtn = form.querySelector('button[type="submit"]');
   if (groups.length !== 3 || !submitBtn) return;

   form.classList.add('film-form');

   var sceneTitles = [
      'SCENE 1 · WHO ARE YOU?',
      'SCENE 2 · WHAT’S IT ABOUT?',
      'SCENE 3 · YOUR MESSAGE'
   ];

   /* Kopf: Szenenzähler + Fortschrittsbalken */
   var header = document.createElement('div');
   header.className = 'film-header';
   var counter = document.createElement('p');
   counter.className = 'scene-counter';
   var barTrack = document.createElement('div');
   barTrack.className = 'scene-bar';
   var barFill = document.createElement('span');
   barTrack.appendChild(barFill);
   header.appendChild(counter);
   header.appendChild(barTrack);

   var stage = document.createElement('div');
   stage.className = 'film-stage';

   var scenes = [];

   function makeScene(className) {
      var s = document.createElement('div');
      s.className = 'scene ' + (className || '');
      stage.appendChild(s);
      scenes.push(s);
      return s;
   }

   function makeTitle(text) {
      var t = document.createElement('p');
      t.className = 'scene-title';
      t.textContent = text;
      return t;
   }

   function makeNav(scene, opts) {
      var nav = document.createElement('div');
      nav.className = 'scene-nav';
      if (opts.back) {
         var back = document.createElement('button');
         back.type = 'button';
         back.className = 'scene-back';
         back.textContent = '‹ Back';
         back.addEventListener('click', function() { goTo(scenes.indexOf(scene) - 1); });
         nav.appendChild(back);
      }
      if (opts.next) {
         var next = document.createElement('button');
         next.type = 'button';
         next.className = 'btn btn-primary scene-next';
         next.textContent = opts.next;
         next.addEventListener('click', opts.onNext);
         nav.appendChild(next);
      }
      scene.appendChild(nav);
      return nav;
   }

   /* Intro */
   var intro = makeScene('scene-intro');
   intro.appendChild(makeTitle('A SHORT FILM'));
   var introH = document.createElement('p');
   introH.className = 'scene-question';
   introH.textContent = 'Your Request';
   intro.appendChild(introH);
   var introText = document.createElement('p');
   introText.className = 'scene-hint';
   introText.textContent = 'Three scenes, one message. At the end your e-mail app opens with everything prefilled – nothing is sent or stored anywhere else.';
   intro.appendChild(introText);
   makeNav(intro, { next: '▶ Action!', onNext: function() { goTo(1); } });

   /* Feld-Szenen */
   groups.forEach(function(group, i) {
      var scene = makeScene('scene-field');
      scene.appendChild(makeTitle(sceneTitles[i]));
      var label = group.querySelector('label');
      if (label) label.classList.add('scene-question');
      scene.appendChild(group);
      var field = group.querySelector('input, textarea');
      var advance = function() {
         if (field.checkValidity()) {
            goTo(scenes.indexOf(scene) + 1);
         } else {
            field.reportValidity();
            scene.classList.remove('scene-shake');
            void scene.offsetWidth;
            scene.classList.add('scene-shake');
         }
      };
      field.addEventListener('keydown', function(e) {
         if (e.key === 'Enter' && (field.tagName !== 'TEXTAREA' || e.ctrlKey)) {
            e.preventDefault();
            advance();
         }
      });
      makeNav(scene, { back: true, next: 'Next ›', onNext: advance });
   });

   /* Final Cut: Review + Senden */
   var finalScene = makeScene('scene-final');
   finalScene.appendChild(makeTitle('FINAL CUT · REVIEW & SEND'));
   var review = document.createElement('dl');
   review.className = 'scene-review';
   finalScene.appendChild(review);
   submitBtn.textContent = 'Roll it – Send Message';
   var finalNav = makeNav(finalScene, { back: true });
   finalNav.appendChild(submitBtn);
   submitBtn.addEventListener('click', function(e) {
      e.preventDefault();
      sendMail();
      goTo(scenes.indexOf(credits));
   });

   /* Abspann */
   var credits = makeScene('scene-credits');
   credits.appendChild(makeTitle('THAT’S A WRAP!'));
   var creditsText = document.createElement('p');
   creditsText.className = 'scene-hint';
   creditsText.textContent = 'Your e-mail app has opened with the message prefilled – hit send there to finish. Written & directed by you. Produced by Charas Lounge.';
   credits.appendChild(creditsText);
   makeNav(credits, { next: '↺ Play it again', onNext: function() { goTo(0); } });

   form.appendChild(header);
   form.appendChild(stage);

   /* Szenenwechsel */
   var current = 0;
   var fieldScenes = groups.length;
   function goTo(index) {
      if (index < 0 || index >= scenes.length) return;
      if (index === scenes.indexOf(finalScene)) {
         /* Review mit textContent befüllen (kein innerHTML) */
         review.replaceChildren();
         [['From', 'email'], ['Subject', 'subject'], ['Message', 'message']].forEach(function(pair) {
            var dt = document.createElement('dt');
            dt.textContent = pair[0];
            var dd = document.createElement('dd');
            dd.textContent = document.getElementById(pair[1]).value.trim();
            review.appendChild(dt);
            review.appendChild(dd);
         });
      }
      scenes[current].classList.remove('scene-active');
      scenes[index].classList.add('scene-active');
      current = index;
      if (index === 0) {
         counter.textContent = 'OPENING TITLES';
         barFill.style.width = '0%';
      } else if (index <= fieldScenes) {
         counter.textContent = 'SCENE ' + index + ' / ' + fieldScenes;
         barFill.style.width = (index / (fieldScenes + 1) * 100) + '%';
      } else if (scenes[index] === finalScene) {
         counter.textContent = 'FINAL CUT';
         barFill.style.width = '100%';
      } else {
         counter.textContent = 'CREDITS';
         barFill.style.width = '100%';
      }
      var focusField = scenes[index].querySelector('input, textarea');
      if (focusField) focusField.focus();
   }

   scenes[0].classList.add('scene-active');
   counter.textContent = 'OPENING TITLES';
   barFill.style.width = '0%';
});
