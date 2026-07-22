/* 808-Pad auf der 404-Seite: spielt einen synthesizierten 808-Kick (WebAudio). */
document.addEventListener('DOMContentLoaded', function() {
   'use strict';
   var pad = document.getElementById('pad808');
   if (!pad) return;

   var ctx = null;

   function kick() {
      if (!ctx) {
         var AC = window.AudioContext || window.webkitAudioContext;
         if (!AC) return;
         ctx = new AC();
      }
      if (ctx.state === 'suspended') ctx.resume();
      var t = ctx.currentTime;
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, t);
      osc.frequency.exponentialRampToValueAtTime(40, t + 0.35);
      gain.gain.setValueAtTime(1, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.55);
   }

   pad.addEventListener('click', function() {
      kick();
      pad.classList.remove('thump');
      void pad.offsetWidth;
      pad.classList.add('thump');
   });
});
