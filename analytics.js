/* GA4 measurement. Contact clicks indicate intent, not confirmed bookings. */
(function () {
  'use strict';
  if (window.taxiAnalyticsLoaded) return;
  window.taxiAnalyticsLoaded = true;
  var measurementId = 'G-X0RPRN8V7B';
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== 'function') {
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
  }
  if (!document.querySelector('script[src*="googletagmanager.com/gtag/js"]')) {
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
    document.head.appendChild(script);
  }
  window.gtag('config', measurementId);
  function track(name) {
    window.gtag('event', name, {
      send_to: measurementId,
      transport_type: 'beacon'
    });
  }
  document.addEventListener('click', function (event) {
    var target = event.target;
    if (!target || !target.closest) return;
    var link = target.closest('a[href]');
    if (link) {
      var href = link.getAttribute('href') || '';
      if (/^tel:/i.test(href)) track('phone_click');
      else if (/^https:\/\/(wa\.me|api\.whatsapp\.com)\//i.test(href)) track('whatsapp_click');
      else if (/^mailto:/i.test(href)) track('email_click');
    }
    var button = target.closest('#send');
    if (button && typeof bookingIsComplete === 'function' && bookingIsComplete()) {
      track('whatsapp_click');
    }
    if (target.closest('#reviewBtn') && typeof bookingIsComplete === 'function' && bookingIsComplete()) {
      track('booking_review');
    }
  }, true);
  document.addEventListener('submit', function (event) {
    var form = event.target;
    if (!form || !form.checkValidity || !form.checkValidity()) return;
    if (form.id === 'bookingForm') track('email_request_submit');
    // This runs after the local form handler has validated the trip.
    if (form.id === 'localQuoteForm' && form.checkValidity()) track('whatsapp_click');
  });
})();
