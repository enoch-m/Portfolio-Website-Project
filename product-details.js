const productId = sessionStorage.getItem("selectedProductId");

const workoutGearList = [
  {
    id: "gear1",
    name: "Adjustable Dumbbells",
    brand: "Bowflex",
    price: "$299",
    rating: 4.8,
    description: "Space-saving adjustable dumbbells with weights from 5 to 52.5 lbs.",
    image: "images/dumbbells.jpg",
    alt: "Black adjustable dumbbells with multiple weight plates on a stand",
    details: "Perfect for small spaces. Easily switch between weight levels with a dial. Ideal for full-body training, HIIT, and strength routines at home."
  },
  {
    id: "gear2",
    name: "Yoga Mat",
    brand: "Lululemon",
    price: "$88",
    rating: 4.5,
    description: "High-grip, sweat-resistant yoga mat perfect for hot yoga.",
    image: "images/yoga-mat.jpg",
    alt: "Dark gray yoga mat partially unrolled on a light background",
    details: "Made for balance and stability. Great cushioning and anti-slip texture — ideal for yoga, stretching, or floor workouts on any surface."
  },
  {
    id: "gear3",
    name: "Resistance Bands Set",
    brand: "Fit Simplify",
    price: "$25",
    rating: 4.2,
    description: "Set of 5 resistance bands with varying levels for strength training.",
    image: "images/resistance-bands.jpg",
    alt: "Color-coded resistance bands with handles, door anchor, and carrying pouch",
    details: "Lightweight and portable. Includes multiple resistance levels. Great for rehab, home fitness, and adding challenge to any workout."
  },
  {
    id: "gear4",
    name: "Kettlebell",
    brand: "Rogue Fitness",
    price: "$70",
    rating: 4.7,
    description: "Powder-coated cast iron kettlebell, ideal for swings and squats.",
    image: "images/kettlebell.jpg",
    alt: "Black 24kg cast iron kettlebell with green stripes on the handles",
    details: "Heavy-duty and built to last. Ergonomic handle ensures secure grip. A great tool for functional training, strength, and conditioning."
  }
];

const product = workoutGearList.find(item => item.id === productId);
const container = document.getElementById('product-details');

if (product) {
  container.innerHTML = `
    <div style="display: flex; justify-content: center; margin-top: 2rem;">
      <sl-card class="product-card" style="max-width: 600px; text-align: center; padding: 1rem;">
        <img src="${product.image}" alt="${product.alt}" style="max-width: 100%; border-radius: 10px;" />
        <h1 style="margin: 1rem 0 0.5rem 0;">${product.name}</h1>
        <p><strong>Brand:</strong> ${product.brand}</p>
        <p><strong>Price:</strong> ${product.price}</p>
        <sl-rating value="${product.rating}" readonly style="margin: 0.5rem auto;"></sl-rating>
        <p style="margin-top: 1rem;">${product.description}</p>
        <h2 style="margin-top: 1.5rem;">Why You'll Love It</h2>
        <p>${product.details}</p>
        <a href="gear.html" style="display: inline-block; margin-top: 1.5rem; color: #7faaff;">← Back to Gears</a>
      </sl-card>
    </div>
  `;
} else {
  container.innerHTML = "<p>No product selected. Please go back to the gear list.</p>";
}
