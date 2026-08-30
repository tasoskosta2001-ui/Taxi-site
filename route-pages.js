function trackRouteWhatsapp(url, conversionLabel) {
  let opened = false;

  const openWhatsapp = function () {
    if (opened || !url) return;
    opened = true;
    window.location.href = url;
  };

  if (typeof gtag === "function") {
    gtag("event", "conversion", {
      send_to:
      conversionLabel
      ||
      "AW-18408339673/vdf_CNHsgegcENnx481E",
      event_callback: openWhatsapp,
      event_timeout: 1200
    });
  }

  setTimeout(openWhatsapp, 1300);
  return false;
}


document.addEventListener(
"DOMContentLoaded",
function () {

  const priceGrid =
  document.querySelector(".price-grid");

  const priceCards =
  Array.from(
    document.querySelectorAll(
      "a.price-card"
    )
  );

  if (
    !priceGrid ||
    !priceCards.length
  ) {
    return;
  }

  const brandLink = document.querySelector(".site-header .brand");
  if (brandLink) brandLink.href = "/?start=1";

  const heroActions = document.querySelector(".hero .hero-actions");
  if (heroActions) {
    const directWhatsapp = heroActions.querySelector(".button-primary");
    if (directWhatsapp) directWhatsapp.remove();

    const chooseButton = heroActions.querySelector(".button-secondary");
    if (chooseButton) {
      chooseButton.href = "#prices";
      chooseButton.textContent = "Choose vehicle & fare";
      chooseButton.classList.add("button-primary-choice");
    }
  }

  const duplicateBookingPanel = document.querySelector(".booking-panel");
  if (duplicateBookingPanel) duplicateBookingPanel.remove();

  const currentRoutePath = window.location.pathname.split("/").pop();
  document.querySelectorAll(".route-links a").forEach(link => {
    const linkPath = new URL(link.href).pathname.split("/").pop();
    if (linkPath === currentRoutePath) link.remove();
  });

  const vehicleDetails = {
    small: {
      title: "1–4 passengers",
      image: "vehicle-1-4.webp",
      alt: "Private taxi for 1 to 4 passengers"
    },
    large: {
      title: "1–6 passengers",
      image: "vehicle-1-6.webp",
      alt: "Private taxi van for 1 to 6 passengers"
    }
  };

  ["small", "large"].forEach(vehicle => {
    const matchingCards = priceCards.filter(card => {
      const url = new URL(card.href);
      return url.searchParams.get("vehicle") === vehicle;
    });

    if (!matchingCards.length) return;

    const details = vehicleDetails[vehicle];
    const vehicleCard = document.createElement("article");
    vehicleCard.className = "route-vehicle-card";
    vehicleCard.innerHTML = `
      <div class="route-vehicle-visual">
        <img src="${details.image}" alt="${details.alt}" loading="lazy" width="520" height="360">
      </div>
      <div class="route-vehicle-info">
        <h3>${details.title}</h3>
        <div class="route-fares"></div>
      </div>
    `;

    const fareContainer = vehicleCard.querySelector(".route-fares");
    matchingCards.forEach(card => fareContainer.appendChild(card));
    priceGrid.appendChild(vehicleCard);
  });


  const bookingPanel =
  document.createElement("div");

  bookingPanel.className =
  "inline-booking";

  bookingPanel.hidden =
  true;

  bookingPanel.innerHTML =
  `
    <div class="inline-selected" aria-live="polite"></div>

    <h3>Complete your booking</h3>

    <p class="inline-intro">
      Choose your pickup date and exact time.
    </p>

    <div class="inline-fields">

      <label>
        <span>Pickup date</span>
        <input id="routeBookingDate" type="date">
      </label>

      <label>
        <span>Pickup time</span>
        <input id="routeBookingTime" type="time">
      </label>

    </div>

    <label class="inline-notes-label">
      <span>Anything else?</span>
      <textarea
        id="routeBookingNotes"
        placeholder="Flight number, hotel or anything else you would like us to know..."
      ></textarea>
    </label>

    <p class="inline-rate-note" aria-live="polite"></p>

    <button
      class="inline-whatsapp"
      id="routeBookingWhatsapp"
      type="button"
      disabled
    >
      Send booking on WhatsApp →
    </button>
  `;

  priceGrid.insertAdjacentElement(
    "afterend",
    bookingPanel
  );


  const dateInput =
  bookingPanel.querySelector(
    "#routeBookingDate"
  );

  const timeInput =
  bookingPanel.querySelector(
    "#routeBookingTime"
  );

  const notesInput =
  bookingPanel.querySelector(
    "#routeBookingNotes"
  );

  const selectedDisplay =
  bookingPanel.querySelector(
    ".inline-selected"
  );

  const rateNote =
  bookingPanel.querySelector(
    ".inline-rate-note"
  );

  const whatsappButton =
  bookingPanel.querySelector(
    "#routeBookingWhatsapp"
  );


  const today =
  new Date();

  const pad =
  number =>
  String(number).padStart(2, "0");

  dateInput.min =
  today.getFullYear()
  +
  "-"
  +
  pad(today.getMonth() + 1)
  +
  "-"
  +
  pad(today.getDate());


  let selectedFare =
  null;


  function readFare(card) {

    const url =
    new URL(card.href);

    return {
      card,
      from:
      url.searchParams.get("from"),
      to:
      url.searchParams.get("to"),
      vehicle:
      url.searchParams.get("vehicle"),
      period:
      url.searchParams.get("period"),
      passengers:
      card
      .querySelector("strong")
      .textContent
      .trim(),
      rate:
      card
      .querySelector("span:not(.select-fare)")
      .textContent
      .trim(),
      price:
      card
      .querySelector("b")
      .textContent
      .trim()
    };

  }


  function updateButton() {

    whatsappButton.disabled =
    !(
      selectedFare &&
      dateInput.value &&
      timeInput.value
    );

  }


  function scrollToPanel() {

    const target =
    bookingPanel
    .getBoundingClientRect()
    .top
    +
    window.pageYOffset
    -
    16;

    window.scrollTo({
      top: Math.max(0, target),
      behavior: "smooth"
    });

  }


  function selectFare(
    card,
    shouldScroll
  ) {

    priceCards.forEach(item => {

      item.classList.remove(
        "selected"
      );

      const selectText =
      item.querySelector(
        ".select-fare"
      );

      if (selectText) {
        selectText.textContent =
        "Select this fare →";
      }

    });


    card.classList.add(
      "selected"
    );


    const selectedText =
    card.querySelector(
      ".select-fare"
    );

    if (selectedText) {
      selectedText.textContent =
      "✓ Selected";
    }


    selectedFare =
    readFare(card);


    selectedDisplay.innerHTML =
    `
      <span>Selected fare</span>
      <strong>
        ${selectedFare.passengers}
        ·
        ${selectedFare.rate}
        ·
        ${selectedFare.price}
      </strong>
    `;


    bookingPanel.hidden =
    false;


    priceGrid.insertAdjacentElement(
      "afterend",
      bookingPanel
    );


    updateButton();


    if (shouldScroll) {

      setTimeout(
        scrollToPanel,
        120
      );

    }

  }


  priceCards.forEach(card => {

    card.addEventListener(
    "click",
    function (event) {

      event.preventDefault();

      rateNote.textContent =
      "";

      selectFare(
        this,
        true
      );

    });

  });


  timeInput.addEventListener(
  "input",
  function () {

    if (
      !selectedFare ||
      !this.value
    ) {

      updateButton();
      return;

    }


    const hour =
    parseInt(
      this.value.split(":")[0],
      10
    );


    const correctPeriod =
    hour >= 6 && hour < 22
    ?
    "day"
    :
    "night";


    if (
      correctPeriod !==
      selectedFare.period
    ) {

      const matchingCard =
      priceCards.find(card => {

        const fare =
        readFare(card);

        return (
          fare.vehicle ===
          selectedFare.vehicle
          &&
          fare.period ===
          correctPeriod
        );

      });


      if (matchingCard) {

        selectFare(
          matchingCard,
          false
        );

        rateNote.textContent =
        correctPeriod === "day"
        ?
        "The daytime price was selected automatically for this pickup time."
        :
        "The night price was selected automatically for this pickup time.";

      }

    } else {

      rateNote.textContent =
      "";

    }


    updateButton();

  });


  dateInput.addEventListener(
    "input",
    updateButton
  );


  whatsappButton.addEventListener(
  "click",
  function () {

    if (
      !selectedFare ||
      !dateInput.value ||
      !timeInput.value
    ) {
      return;
    }


    const dateParts =
    dateInput.value.split("-");

    const formattedDate =
    dateParts[2]
    +
    "/"
    +
    dateParts[1]
    +
    "/"
    +
    dateParts[0];


    let message =
`Hello, I would like to book a taxi transfer.

From: ${selectedFare.from}
To: ${selectedFare.to}
Vehicle: ${selectedFare.passengers}
Rate: ${selectedFare.rate}
Price: ${selectedFare.price}
Date: ${formattedDate}
Time: ${timeInput.value}`;


    const notes =
    notesInput.value.trim();


    if (notes) {

      message +=
`

Additional information:
${notes}`;

    }


    const whatsappURL =
    "https://wa.me/35797797750?text="
    +
    encodeURIComponent(message);


    trackRouteWhatsapp(
      whatsappURL,
      "AW-18408339673/2u5LCNiVjuccENnx481E"
    );

  });

});
