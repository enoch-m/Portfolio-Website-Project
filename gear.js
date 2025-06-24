const container = document.getElementById("card-container");
const openButton = document.getElementById("open-drawer-btn");
const drawer = document.querySelector(".drawer-overview");
const gearList = [];

const workoutGearList = [
  {
    id: "gear1",
    name: "Adjustable Dumbbells",
    brand: "Bowflex",
    price: "$299",
    rating: 4.8,
    description: "Space-saving adjustable dumbbells with weights from 5 to 52.5 lbs.",
    image: "images/dumbbells.jpg",
    alt: "Black adjustable dumbbells with multiple weight plates on a stand"
  },
  {
    id: "gear2",
    name: "Yoga Mat",
    brand: "Lululemon",
    price: "$88",
    rating: 4.5,
    description: "High-grip, sweat-resistant yoga mat perfect for hot yoga.",
    image: "images/yoga-mat.jpg",
    alt: "Dark gray yoga mat partially unrolled on a light background"
  },
  {
    id: "gear3",
    name: "Resistance Bands Set",
    brand: "Fit Simplify",
    price: "$25",
    rating: 4.2,
    description: "Set of 5 resistance bands with varying levels for strength training.",
    image: "images/resistance-bands.jpg",
    alt: "Color-coded resistance bands with handles, door anchor, and carrying pouch"
  },
  {
    id: "gear4",
    name: "Kettlebell",
    brand: "Rogue Fitness",
    price: "$70",
    rating: 4.7,
    description: "Powder-coated cast iron kettlebell, ideal for swings and squats.",
    image: "images/kettlebell.jpg",
    alt: "Black 24kg cast iron kettlebell with green stripes on the handles"
  }
];

// Add gear to drawer list
function addToGearList(item) {
  const existingItem = gearList.find(g => g.product.id === item.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    gearList.push({product: item, quantity:1});
  }
  
    renderGearDrawer();
}

// Remove gear from list and update
function renderGearDrawer() {
  drawer.innerHTML = `
    <h1 style="margin: 1rem;">My Cart</h1>
    <div class="drawer-list" style="padding: 1rem;">
      ${
        gearList.length === 0
          ? 'Your Cart is empty'
          : gearList.map((item, index) => `
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid #444; padding-bottom: 8px;">
                <div>
                  <strong>${item.product.name}</strong>
                  <div style="display: flex; gap: 12px; margin-top: 4px; font-size: 0.9rem; color: #ccc;">
                    <span>${item.product.price}</span>
                    <span>x ${item.quantity}</span>
                  </div>
                </div>
                <div style="display: flex; gap: 6px; align-items: center;">
                  <sl-button size="small" class="decrease-btn" data-index="${index}">-</sl-button>
                  <sl-button size="small" class="increase-btn" data-index="${index}">+</sl-button>
                  <sl-button size="small" variant="danger" class="remove-btn" data-index="${index}">Delete</sl-button>
                </div>
              </div>
            `).join('')
      }
    </div>
    <p style="padding: 1rem; text-align: right;">Total: <strong>${calculateTotalPrice()}</strong></p>
    <sl-button slot="footer" variant="primary">Close</sl-button>
  `;

  // Increase quantity button
  drawer.querySelectorAll('.increase-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const index = parseInt(btn.dataset.index);
      gearList[index].quantity += 1;
      renderGearDrawer();
    });
  });

  // Decrease quantity button
  drawer.querySelectorAll('.decrease-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const index = parseInt(btn.dataset.index);
      gearList[index].quantity -= 1;
      if (gearList[index].quantity <= 0) {
        gearList.splice(index, 1);  // Remove item if quantity is 0
      }
      renderGearDrawer();
    });
  });

  // Close button
  drawer.querySelector('sl-button[variant="primary"]').addEventListener('click', () => drawer.hide());

  // Remove item button
  drawer.querySelectorAll('.remove-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const index = parseInt(btn.dataset.index);
      gearList.splice(index, 1);
      renderGearDrawer();
    });
  });
}


// Render cards to DOM
workoutGearList.forEach((gear) => {
  const card = document.createElement("sl-card");
  card.className = "card-overview";

  card.innerHTML = `
  <a href="product-details.html" class="product-link" data-id="${gear.id}">
    <img slot="image" src="${gear.image}" alt="${gear.alt}" />
  </a>
    <div class="card-content">
      <strong>${gear.name}</strong>
      <small>${gear.brand} | ${gear.price}</small>
      <p>${gear.description}</p>
    </div>
    <div slot="footer">
      <sl-button variant="primary" pill>Add</sl-button>
      <sl-rating value="${gear.rating}" readonly></sl-rating>
    </div>
  `;

  card.querySelector("sl-button").addEventListener("click", (event) => {
    event.stopPropagation();
    addToGearList(gear);
  });

  card.querySelector(".product-link").addEventListener("click", (event) => {
    sessionStorage.setItem("selectedProductId", gear.id);
  });

  container.appendChild(card);

});

openButton.addEventListener("click", () => drawer.show());

function calculateTotalPrice() {
  let total = 0;
  gearList.forEach(item => {
    const priceNumber = parseFloat(item.product.price.replace('$', ''));
    total += priceNumber * item.quantity;
  });
  return `$${total.toFixed(2)}`;
}
