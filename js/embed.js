/* Datenschutzfreundliche Zwei-Klick-Einbettung:
   Externe Inhalte (Spotify, Vimeo) werden erst nach Klick geladen,
   vorher fließen keine Daten an Drittanbieter. */
document.addEventListener('DOMContentLoaded', function() {
   document.querySelectorAll('.embed-consent').forEach(function(box) {
      var button = box.querySelector('.embed-consent-btn');
      if (!button) return;
      button.addEventListener('click', function() {
         var iframe = document.createElement('iframe');
         iframe.src = box.dataset.src;
         iframe.title = box.dataset.title || 'Embedded content';
         iframe.setAttribute('allow', box.dataset.allow || '');
         iframe.setAttribute('allowfullscreen', '');
         iframe.loading = 'lazy';
         if (box.dataset.height) {
            iframe.style.height = box.dataset.height + 'px';
         }
         box.replaceChildren(iframe);
         box.classList.add('embed-loaded');
      });
   });
});
