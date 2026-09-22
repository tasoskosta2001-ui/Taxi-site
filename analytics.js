/* Contact intent is not a confirmed ride or payment. No customer details go to analytics. */
(function () {
  'use strict';
  if (window.taxiAnalyticsLoaded) return;
  window.taxiAnalyticsLoaded = true;
  var measurementId = 'G-X0RPRN8V7B';
  var adsId = 'AW-18408339673';
  var contactLabel = adsId + '/2u5LCNiVjuccENnx48lE';
  var whatsappLabel = adsId + '/vdf_CNHsgegcENnx48lE';
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
  window.gtag('config', adsId);
  var query = new URLSearchParams(location.search);
  var channel = 'direct_or_unknown';
  try {
    channel = sessionStorage.getItem('taxi_channel') || channel;
    var source = (query.get('utm_source') || '').toLowerCase();
    var medium = (query.get('utm_medium') || '').toLowerCase();
    var referrer = document.referrer ? new URL(document.referrer).hostname : '';
    if (query.has('gclid') || query.has('gbraid') || query.has('wbraid') ||
        (source === 'google' && medium === 'cpc')) channel = 'google_ads';
    else if (/^(facebook|instagram|meta)$/.test(source) ||
        /(^|\.)(facebook\.com|instagram\.com)$/.test(referrer)) channel = 'social';
    else if (/^google\./.test(referrer) || /\.google\./.test(referrer)) channel = 'google_organic';
    else if (referrer && referrer !== location.hostname) channel = 'referral';
    sessionStorage.setItem('taxi_channel', channel);
  } catch (_) {}
  var reference;
  try { reference = sessionStorage.getItem('taxi_request_ref'); } catch (_) {}
  if (!reference) {
    reference = 'CT-' + (window.crypto && crypto.randomUUID ? crypto.randomUUID().slice(0, 8) : Math.random().toString(36).slice(2, 10)).toUpperCase();
    try { sessionStorage.setItem('taxi_request_ref', reference); } catch (_) {}
  }
  var places = ['Nicosia','Larnaca','Paphos','Limassol','Ayia Napa','Paralimni / Protaras','Larnaca Airport','Paphos Airport'];
  function context() {
    var params = {send_to: measurementId, transport_type: 'beacon', lead_source: channel};
    ['from','to'].forEach(function (id) {
      var field = document.getElementById(id);
      if (field && places.indexOf(field.value) !== -1) params['route_' + id] = field.value;
    });
    return params;
  }
  function track(name) { window.gtag('event', name, context()); }
  function referenceText() { return '\n\nRequest reference: ' + reference + '\nSource: ' + channel; }
  var navigating = false;
  window.taxiOpenContact = function (rawUrl) {
    if (navigating) return;
    var url = new URL(rawUrl, location.href);
    var whatsapp = url.protocol === 'https:' && /^(wa\.me|api\.whatsapp\.com)$/.test(url.hostname);
    var phone = url.protocol === 'tel:';
    var email = url.protocol === 'mailto:';
    if (!whatsapp && !phone && !email) return;
    if (whatsapp) {
      url.searchParams.set('text', (url.searchParams.get('text') || 'Hello, I would like a taxi transfer quote.') + referenceText());
    }
    navigating = true;
    track(whatsapp ? 'whatsapp_click' : phone ? 'phone_click' : 'email_click');
    var done = false;
    function go() { if (!done) { done = true; location.href = url.href; } }
    setTimeout(go, 800);
    window.gtag('event', 'conversion', {
      send_to: whatsapp ? whatsappLabel : contactLabel,
      transport_type: 'beacon', event_callback: go, event_timeout: 800
    });
  };
  window.addEventListener('pageshow', function () { navigating = false; });
  window.addEventListener('focus', function () { navigating = false; });
  document.addEventListener('click', function (event) {
    var target = event.target;
    if (!target || !target.closest) return;
    var link = target.closest('a[href]');
    if (link) {
      var href = link.getAttribute('href') || '';
      if (/^(tel:|mailto:|https:\/\/(wa\.me|api\.whatsapp\.com)\/)/i.test(href) &&
          !event.ctrlKey && !event.metaKey && !event.shiftKey && event.button === 0) {
        event.preventDefault();
        window.taxiOpenContact(link.href);
      }
    }
    if (target.closest('#continueRoute') && typeof routePrices === 'function' && routePrices()) track('booking_route_selected');
    if (target.closest('.fare') && typeof routePrices === 'function' && routePrices()) track('booking_vehicle_selected');
    if (target.closest('#reviewBtn') && typeof bookingIsComplete === 'function' && bookingIsComplete()) track('booking_review');
  });
  document.addEventListener('submit', function (event) {
    var form = event.target;
    if (!form || form.id !== 'bookingForm' || !form.checkValidity()) return;
    if (typeof bookingIsComplete === 'function' && !bookingIsComplete()) { event.preventDefault(); return; }
    ['request_reference','lead_source'].forEach(function (name) {
      var field = form.elements[name];
      if (!field) { field = document.createElement('input'); field.type = 'hidden'; field.name = name; form.appendChild(field); }
      field.value = name === 'request_reference' ? reference : channel;
    });
    track('email_request_submit');
    try { sessionStorage.setItem('taxi_email_pending', String(Date.now())); } catch (_) {}
  });
  if (location.pathname === '/thank-you.html') {
    try {
      var pending = Number(sessionStorage.getItem('taxi_email_pending'));
      sessionStorage.removeItem('taxi_email_pending');
      if (pending && Date.now() - pending >= 0 && Date.now() - pending < 1800000) {
        track('email_request_return');
        window.gtag('event','conversion',{send_to:contactLabel,transport_type:'beacon'});
      }
    } catch (_) {}
  }
})();
