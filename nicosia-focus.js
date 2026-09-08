(() => {
  const form = document.getElementById('localQuoteForm');
  if (!form) return;
  const cyprusNow = () => {
    const parts = new Intl.DateTimeFormat('en-GB', {timeZone:'Asia/Nicosia',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date());
    const get = key => parts.find(part => part.type === key).value;
    return `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}`;
  };
  form.elements.pickup_date.min = cyprusNow().slice(0,10);
  form.addEventListener('input', () => {
    form.elements.dropoff_address.setCustomValidity('');
    form.elements.pickup_time.setCustomValidity('');
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const pickup = form.elements.pickup_address.value.trim();
    const destination = form.elements.dropoff_address.value.trim();
    if (!pickup || !destination || pickup.toLowerCase() === destination.toLowerCase()) {
      form.elements.dropoff_address.setCustomValidity('Please enter different pickup and drop-off addresses.');
      form.elements.dropoff_address.reportValidity();
      return;
    }
    const date = form.elements.pickup_date.value;
    const time = form.elements.pickup_time.value;
    if (`${date}T${time}` < cyprusNow()) {
      form.elements.pickup_time.setCustomValidity('Please choose a future pickup date and time in Cyprus.');
      form.elements.pickup_time.reportValidity();
      return;
    }
    const student = form.elements.student.checked;
    const message = [
      'Hello, I would like a quote for a taxi ride within Nicosia.',
      '', 'Pickup: ' + pickup, 'Drop-off: ' + destination,
      'Date: ' + date.split('-').reverse().join('/'),
      'Time (Cyprus): ' + time,
      'Passengers: ' + form.elements.passengers.value,
      ...(student ? ['Student offer requested — please confirm any offer before booking.'] : []),
      'Please confirm the price and availability.'
    ].join('\n');
    openContactWithConversion('https://wa.me/35797797750?text=' + encodeURIComponent(message));
  });
  const anchors = ['#localRides','#students','#nicosiaRoutes'];
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    if (!anchors.includes(link.getAttribute('href'))) return;
    link.addEventListener('click', event => {
      event.preventDefault();
      document.getElementById('discoveryPanels').hidden=false;
      scrollToStep(document.querySelector(link.getAttribute('href')));
    });
  });
  if (anchors.includes(location.hash)) scrollToStep(document.querySelector(location.hash));
})();
