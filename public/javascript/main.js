document.addEventListener('DOMContentLoaded', async function() {
    // Check if on the homepage
    if (window.location.pathname === '/index.html') {
        await fetchAllRecipes();
    }
    
    // Check if on the recipe page
    if (window.location.pathname === '/recipe.html') {
        await fetchOneRecipe();
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
                <div class="card-flip">
                    <div class="card-inner">
                        <div class="card-front">
                            <img src="${recipe.photo_url}" class="card-img-top" alt="${recipe.name}">
                            <div class="card-body">
                                <h5 class="card-title">${recipe.name}</h5>
                            </div>
                        </div>
                        <div class="card-back">
                            <a href="/recipe.html?id=${recipe._id}" class="btn btn-primary">See Recipe</a>
                        </div>
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