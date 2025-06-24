const container = document.getElementById('card-container');
const openButton = document.getElementById('open-drawer-btn');
const drawer = document.querySelector('.drawer-overview');
const checkBtn = document.getElementById('nutrition-check-btn');
const input = document.getElementById('nutrition-input');
const resultDiv = document.getElementById('nutrition-result');

const isGithubPages = location.hostname.includes('github.io');
const basePath = isGithubPages ? '/p4/' : './';

let mylist = []; // add as my saved recipe
const savedList = localStorage.getItem('myRecipeList');
if (savedList) {
  mylist = JSON.parse(savedList);
  renderMyList();
}

// recipe definition
const recipes = [
    {
      name: 'Baked Risotto',
      time: 50,
      tags: ['GF', 'HF', 'V'], // Gluten-Free, High-Fiber, Vegetarian
      img: 'https://www.skinnytaste.com/wp-content/uploads/2025/04/Baked-Risotto-with-Asparagus-and-Peas-10-260x390.jpg',
      link: `${basePath}baked-risotto`
    },
    {
      name: 'Baked Cod',
      time: 35,
      tags: ['HP', 'LC', 'DF'], // High-Protein, Low-Carb, Dairy-Free
      img: 'https://www.skinnytaste.com/wp-content/uploads/2025/03/Baked-Cod-6-260x390.jpg',
      link: `${basePath}baked-cod`
    },
    {
      name: 'Chicken Fajitas',
      time: 40,
      tags: ['GF', 'KF'], // Gluten-Free, Kid-Friendly
      img: 'https://www.skinnytaste.com/wp-content/uploads/2013/05/Chicken-Fajitas-10-260x390.jpg',
      link: `${basePath}chicken-fajitas`
    },
    {
      name: 'Mediterranean Octopus Salad',
      time: 50,
      tags: ['DF', 'GF', 'HP', 'LC', 'W'], // Dairy-Free, Gluten-Free, High-Protein, Low-Carb, Whole30
      img: 'https://www.skinnytaste.com/wp-content/uploads/2025/03/Mediterranean-Octopus-Salad-10-260x390.jpg',
      link: `${basePath}octopus-salad`
    }
  ];

function addToMylist(recipe) {
    if (!mylist.find(item => item.name === recipe.name)) {
      mylist.push(recipe);
      localStorage.setItem('myRecipeList', JSON.stringify(mylist));
      renderMyList();
    } else {
      document.getElementById("card-warning-alert").show();
    }
}

// add card
for (const recipe of recipes) {
    const card = document.createElement('sl-card');
    card.className = 'card-overview';
  
    card.innerHTML = `
      <img slot="image" src="${recipe.img}" alt="${recipe.name}" style="cursor:pointer;" onclick="window.open('${recipe.link}.html', '_blank', 'noopener');"/>
      <div class="card-content">
        <a href="${recipe.link}.html" style="text-decoration: none; color: black;">
          <strong style="color: #ccc; font-size: 13px;">${recipe.name}</strong>
        </a>
        <div class="tag-group" style="margin-top: 6px;">
            ${recipe.tags.map(tag => `<span class="tag tag-${tag.toLowerCase()}">${tag}</span>`).join('')}
        </div>
        <div style="margin-top: 6px;">⏱ ${recipe.time} mins</div>
      </div>
      <div slot="footer">
        <sl-button variant="primary" pill>Add</sl-button>
        <sl-rating value="4"></sl-rating>
      </div>
    `;

    card.querySelector('sl-button[variant="primary"]').addEventListener('click', (event) => {
      event.stopPropagation();
      addToMylist(recipe);
      console.log(mylist);
    });

    container.appendChild(card);
}

  function renderMyList() {
    drawer.innerHTML = `
      <h2 style="margin: 1rem;">Saved Recipe</h2>
      <div class="drawer-list" style="padding: 1rem;">
        ${
          mylist.length === 0
            ? 'Your list is empty'
            : mylist.map((item, index) => `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                  <div>
                    <strong>${item.name}</strong>
                  </div>
                  <sl-button size="small" variant="primary" class="see-details" data-link="${item.link}.html">See Details</sl-button>
                  <sl-button size="small" variant="danger" class="remove-btn" data-index="${index}">Delete</sl-button>
                </div>
              `).join('')
        }
      </div>
      <sl-button slot="footer" variant="primary">Close</sl-button>
    `;
  
    const closeButton = drawer.querySelector('sl-button[variant="primary"]');
    closeButton.addEventListener('click', () => drawer.hide());  
  
    drawer.querySelectorAll('.remove-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.dataset.index);
        mylist.splice(index, 1);
        localStorage.setItem('myRecipeList', JSON.stringify(mylist));
        renderMyList();
      });
    });  
  }

  document.addEventListener('click', (event) => {
    if (event.target.classList.contains('see-details')) {
      const link = event.target.dataset.link;
      if (link) {
        window.open(link, '_blank', 'noopener');
      }
    }
  });  

  checkBtn.addEventListener('click', async () => {
    const query = input.value.trim();
    if (!query) {
      resultDiv.innerHTML = '<p>Please enter a food description.</p>';
      return;
    }
  
    const appId = 'aa14076b';
    const appKey = 'ea05620b4a6bd28b42aa1def4cd9afd0';
  
    try {
      const res = await fetch('https://trackapi.nutritionix.com/v2/natural/nutrients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-app-id': appId,
          'x-app-key': appKey,
          'x-remote-user-id': '0'
        },
        body: JSON.stringify({ query })
      });
  
      const data = await res.json();
      if (data.foods && data.foods.length > 0) {
        const foodInfo = data.foods.map(food => `
          <div style="margin-bottom: 1rem; border-bottom: 1px solid #444; padding-bottom: 0.5rem;">
            <strong style="text-transform: capitalize;">${food.food_name}</strong><br/>
            Calories: ${food.nf_calories} kcal<br/>
            Protein: ${food.nf_protein} g<br/>
            Carbs: ${food.nf_total_carbohydrate} g<br/>
            Fat: ${food.nf_total_fat} g
          </div>
        `).join('');
        resultDiv.innerHTML = foodInfo;
      } else {
        resultDiv.innerHTML = '<p>No result found.</p>';
      }
    } catch (err) {
      console.error(err);
      resultDiv.innerHTML = '<p>Error fetching nutrition info. Please try again later.</p>';
    }
  });

openButton.addEventListener('click', () => drawer.show());


