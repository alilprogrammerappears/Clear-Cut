document.addEventListener('DOMContentLoaded', async function() {
    if (window.location.pathname === '/index.html' || window.location.pathname === '/home.html') {
        await fetchAllRecipes();
    } else if (window.location.pathname.includes('/recipe.html')) {
        await fetchOneRecipe();
    }
    else if (window.location.pathname.includes('/searchResults.html')) {
        await fetchSearchResults();
    } else {
        console.log('No async function to load');
    }

    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        const searchInput = document.getElementById('search-input');
        searchForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const query = searchInput.value.trim();
            if (!query) {
                alert('Please enter a search term!');
                return;
            }

            window.location.href = `/searchResults.html?name=${encodeURIComponent(query)}&category=${encodeURIComponent(query)}`;
        });
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

    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get('id');

    if (!recipeId) {
        console.error('No recipe ID found in the URL.');
        return;
    }

    console.log('Fetching recipe with ID:', recipeId);

    try {
        const response = await fetch(`/api/recipes?id=${recipeId}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch recipe. Status: ${response.status}`);
        }
        const recipe = await response.json();

        const container = document.querySelector('#full-recipe-container');
        if (!container) {
            console.error('Recipe container not found.');
            return;
        }

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

async function fetchSearchResults() {

    const urlParams = new URLSearchParams(window.location.search);
    const resultsContainer = document.querySelector('#search-results-container');

    // clear previous results
    resultsContainer.innerHTML = '';

    try {

        let queryParam = '';
        let queryVal = '';

        if (urlParams.has('name')){
            queryParam = 'name';
            queryVal = urlParams.get('name');
            console.log('recipe name found in URL! ', queryVal);
        }
        else if (urlParams.has('category')){
            queryParam = 'category';
            queryVal = urlParams.get('category');
            console.log('category found in URL! ', queryVal);
        }
        else {
            console.log('No search params found!');
            resultsContainer.innerHTML = '<p>No search values entered, please try again!</p>';
            return;
        }

        const apiUrl = `/api/recipes?${queryParam}=${encodeURIComponent(queryVal)}`;
        console.log('Fetching from API URL:', apiUrl);

        const response = await fetch(`/api/recipes?${queryParam}=${encodeURIComponent(queryVal)}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch recipes. Status: ${response.status}`);
        }

        const results = await response.json();
        console.log('API response:', results);

        if (results.length === 0){
            resultsContainer.innerHTML = '<p>Sorry! There are no results for your search. :( Please try again!</p>';
            return;
        }

        results.forEach(recipe => {
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
            resultsContainer.appendChild(recipeCard);
        });     
    }
    catch (error) {
        console.error('Error fetching and displaying search results! The error:', error.message);
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