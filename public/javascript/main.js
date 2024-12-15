document.addEventListener('DOMContentLoaded', async function() {
    // Check what page we're on
    if (window.location.pathname === '/index.html' || window.location.pathname === '/home.html') {
        await fetchAllRecipes();
    }
    else if (window.location.pathname.includes('/recipe.html')) {
        await fetchOneRecipe();
    }
    else {
        console.log('no async function to load');
        return
    }
});

async function fetchAllRecipes() {
    try{
        const response = await fetch('/api/recipes');
        const recipes = await response.json();
        const recipeContainer = document.querySelector('#recipe-cards-container');

        recipes.forEach(recipe => {
            const recipeCard = document.createElement('div');
            recipeCard.classList.add('col-sm-3', 'mb-4');
            
            recipeCard.innerHTML = `
                <div class="card">
                    <img src="${recipe.photo_url}" class="card-img-top" alt="${recipe.name}">
                    <div class="card-body d-flex flex-column justify-content-center align-items-center text-center">
                        <h5 class="card-title">${recipe.name}</h5>
                        <a href="/recipe.html?id=${recipe._id}" class="btn btn-primary">See Recipe</a>
                    </div>
                </div>
            `;
    
            recipeContainer.appendChild(recipeCard);
        });    
    }
    catch (error){
        console.error('Error fetching recipes:', error);
    }
}

async function fetchOneRecipe() {
    // Extract the recipe ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get('id');

    // Handle missing recipe ID in the URL
    if (!recipeId) {
        console.error('No recipe ID found in the URL.');
        return;
    }

    console.log('Fetching recipe with ID:', recipeId);

    try {
        // Fetch the recipe data from the API
        const response = await fetch(`/api/recipes?id=${recipeId}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch recipe. Status: ${response.status}`);
        }
        const recipe = await response.json();

        // Locate the container for displaying the recipe
        const container = document.querySelector('#full-recipe-container');
        if (!container) {
            console.error('Recipe container not found.');
            return;
        }

        // Populate the container with the recipe details
        container.innerHTML = `
            <div>
                <img src="${recipe.photo_url}" alt="${recipe.name}">
                <h2>${recipe.name}</h2>
                <h5>Category: ${recipe.category}</h5>
                <h4>Ingredients:</h4>
                <ul>
                    ${recipe.ingredients.map(ingredient => `
                        <li>${ingredient.quantity} - ${ingredient.name}</li>
                    `).join('')}
                </ul>
                <h4>Directions:</h4>
                <ul>
                    ${recipe.directions.map(direction => `
                        <li>Step ${direction.stepNumber}: ${direction.instruction}</li>
                    `).join('')}
                </ul>
            </div>
        `;
    } catch (error) {
        console.error('Error fetching and displaying recipe! The error:', error.message);
    }
}

// scroll to top button functionality
let scrollBtn = document.getElementById("scrollBtn");
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 5 || document.documentElement.scrollTop > 5) {
    scrollBtn.style.display = "block";
  } else {
    scrollBtn.style.display = "none";
  }
}

function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}