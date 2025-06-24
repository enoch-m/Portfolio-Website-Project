const container = document.getElementById('card-container');
const openButton = document.getElementById('open-drawer-btn');
const drawer = document.querySelector('.drawer-overview');
let weight = document.getElementById("weight")
let height = document.getElementById("height")
const bmiOutput = document.getElementById('bmi-output');
// Load saved workout list or start with empty array
let mylist = [];
const savedList = localStorage.getItem('myWorkoutList');
if (savedList) {
  mylist = JSON.parse(savedList);
}
renderMyList();

let myRatings = {};
const savedRatings = localStorage.getItem('myWorkoutRatings');
if (savedRatings) {
  myRatings = JSON.parse(savedRatings);
}

// obtain workouts from a hardcoded json file
fetch('workouts.json')
  .then(res => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  })
  .then(workouts => {
    // Now render each workout card
    workouts.forEach(work => {
      const card = document.createElement('sl-card');
      card.className = 'card-overview';
      const ratingValue = myRatings[work.name] || 4;

      card.innerHTML = `
        <img slot="image" src="${work.img}" alt="${work.name}" />
        <div class="card-content">
          <strong>${work.name}</strong>
          <small>${work.time}min</small>
          <small>Calories: ${work.cal}</small>
        </div>
        <div slot="footer">
          <sl-button variant="primary" pill>Add</sl-button>
          <sl-rating value="${ratingValue}" max="5"></sl-rating>
        </div>
      `;

      // Image click → details page
      card.querySelector('img')
          .addEventListener('click', () => {
            window.location.href = `${work.name.toLowerCase()}.html`;
          });

      // Rating changes persist
      card.querySelector('sl-rating')
          .addEventListener('sl-change', e => {
            myRatings[work.name] = e.target.value;
            localStorage.setItem('myWorkoutRatings', JSON.stringify(myRatings));
          });

      // Add button
      card.querySelector('sl-button')
          .addEventListener('click', e => {
            e.stopPropagation();
            addToMylist(work);
          });

      container.appendChild(card);
    });
  })
  .catch(err => {
    console.error('Failed to fetch workouts:', err);
    container.textContent = 'Unable to load workouts.';
  });
/**
 * addToMylist(work)
 * 
 * Adds a workout object to "mylist" if not already present.
 * Then saves the updated list to localStorage and re-renders the drawer.
 * If the workout is already in the list, show a warning alert.
 */
function addToMylist(work) {
  if (!mylist.find(item => item.name === work.name)) {
    mylist.push(work);
    localStorage.setItem('myWorkoutList', JSON.stringify(mylist));
    renderMyList();
  } else {
    document.getElementById("card-warning-alert").show();
  }
}


/**
 * renderMyList()
 * 
 * Builds the HTML for the drawer that shows the current workout list.
 * Calculates total calories and displays each workout with a delete button.
 * Attaches event listeners for "Delete" and "Close" actions.
 */
function renderMyList() {
  const totalCal = mylist.reduce((sum, w) => sum + w.cal, 0);
  drawer.innerHTML = `
    <h2 style="margin: 1rem;">My list</h2>
    <div class="drawer-list" style="padding: 1rem;">
      <strong>Total Calories Burned: </strong> ${totalCal} cal </br>
      ${
        mylist.length === 0
          ? 'Your list is empty'
          : mylist.map((item, index) => `
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <div><strong>${item.name}</strong> - <small>${item.time}</small></div>
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
      localStorage.setItem('myWorkoutList', JSON.stringify(mylist));
      renderMyList();
    });
  });  
}
/**
 * updateBMI()
 *
 * Reads height (cm) and weight (kg) input fields,
 * calculates BMI, and updates the display text and color.
 * Clears output if inputs are invalid.
 */
function updateBMI() {

  const h = parseFloat(height.value);
  const w = parseFloat(weight.value);
  const inputAlert = document.getElementById('input-warning-alert');
  if (!isNaN(h) && !isNaN(w) && h > 0) {
    const bmi = (w / ((h / 100) ** 2)).toFixed(1);
    const status = getBMIStatus(bmi);
    bmiOutput.textContent = `Your BMI: ${bmi} (${status})`;
    bmiOutput.style.color = getBMIColor(bmi);
  } else {
    bmiOutput.textContent = '';
    
  }
}

function getBMIStatus(bmi) {
  bmi = parseFloat(bmi);
  if (bmi < 18.5) {
    return "Underweight";
  }
  if (bmi < 24.9) {
    return "Normal";
  }
  if (bmi < 29.9){
    return "Overweight";
  } else{
    return "Obese";
  }
  
}

function getBMIColor(bmi) {
  bmi = parseFloat(bmi);
  if (bmi < 18.5) return "#ffd166";
  if (bmi < 24.9) return "#06d6a0";
  if (bmi < 29.9) return "#f9c74f";
  return "#ef476f";
}

height.addEventListener('input', updateBMI);
weight.addEventListener('input', updateBMI);
updateBMI();

// Open drawer when user clicks "My list" button
openButton.addEventListener('click', () => drawer.show());

