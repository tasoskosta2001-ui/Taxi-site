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
      const priceSection = priceGrid.closest('section');
      if (priceSection && !priceSection.id) priceSection.id = 'prices';
      chooseButton.href = '#' + (priceSection ? priceSection.id : 'prices');
      chooseButton.textContent = "Check price & book";
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

});
