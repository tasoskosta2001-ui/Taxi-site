function trackRouteWhatsapp(url) {
  let opened = false;
  const openWhatsapp = function () {
    if (opened || !url) return;
    opened = true;
    window.location.href = url;
  };

  if (typeof gtag === "function") {
    gtag("event", "conversion", {
      send_to: "AW-18408339673/vdf_CNHsgegcENnx481E",
      event_callback: openWhatsapp,
      event_timeout: 1200
    });
  }

  setTimeout(openWhatsapp, 1300);
  return false;
}
