/* Menu Toggle */

$(document).ready(function(){
   $("#toggler").click(function(){
     $("#toggle-nav").fadeToggle(500);
   });
 });

 $('.menu-toggle').on('click', function() {
   $('.wrapper').toggleClass('menu--is-revealed');
 });

 /* Scroll-Animationen */
 if (typeof WOW === 'function') {
   new WOW().init();
 }

 /* Mute/Unmute Button (Startseite) */
 document.addEventListener('DOMContentLoaded', function() {
   var video = document.querySelector('.video-background');
   var muteButton = document.getElementById('muteButton');
   if (video && muteButton) {
     muteButton.addEventListener('click', function() {
       if (video.muted) {
         video.muted = false;
         muteButton.textContent = '🔊 Sound';
       } else {
         video.muted = true;
         muteButton.textContent = '🔇 Sound';
       }
     });
   }
 });
