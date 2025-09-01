const API_KEY = "e3d6e2964d394cf6b39a1e648f35f4a4"; // Replace with your Spoonacular API key

// DOM Elements
const searchBtn = document.getElementById("searchBtn");
const searchForm = document.getElementById("searchForm");
const recipesContainer = document.getElementById("recipes");
const modal = document.getElementById("modal");
const closeModal = document.getElementById("closeModal");
const themeToggle = document.getElementById("themeToggle");
const navLinks = document.querySelectorAll(".nav-list a");
const cutBtn = document.getElementById("cutBtn");

// Handle search form
searchForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const ingredients = document.getElementById("ingredients")?.value.trim();
  const diet = document.getElementById("diet")?.value.trim();

  if (!ingredients) {
    alert("Please enter some ingredients");
    return;
  }

  cutBtn.style.display = "none";
  fetchRecipes(ingredients, diet);
});

// Fetch Recipes
async function fetchRecipes(ingredients, diet) {
  recipesContainer.innerHTML = "<p class='loading'>Loading recipes...</p>";

  let url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&includeIngredients=${encodeURIComponent(
    ingredients
  )}&number=10&addRecipeInformation=true`;

  if (diet) url += `&diet=${encodeURIComponent(diet)}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Error: ${res.status}`);
    const data = await res.json();

    if (data.results.length === 0) {
      recipesContainer.innerHTML =
        "<p>No recipes found. Try different ingredients.</p>";
      cutBtn.style.display = "inline-block";
      return;
    }

    displayRecipes(data.results);
  } catch (error) {
    recipesContainer.innerHTML = `<p>Failed to load recipes: ${error.message}</p>`;
    cutBtn.style.display = "inline-block";
  }
}

// Display Recipe Cards
function displayRecipes(recipes) {
  recipesContainer.innerHTML = "";
  cutBtn.style.display = "inline-block";
  recipes.forEach((recipe) => {
    const card = createRecipeCard(recipe);
    recipesContainer.appendChild(card);
  });
}

// Create Recipe Card
function createRecipeCard(recipe) {
  const card = document.createElement("div");
  card.classList.add("recipe-card");

  const img = document.createElement("img");
  img.src = recipe.image || "default-food.jpg";
  img.alt = recipe.title;

  const title = document.createElement("h3");
  title.textContent = recipe.title;

  const button = document.createElement("button");
  button.textContent = "View Recipe";
  button.addEventListener("click", () => viewRecipe(recipe.id));

  card.append(img, title, button);
  return card;
}

// View Recipe Details
async function viewRecipe(id) {
  const url = `https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}&includeNutrition=false`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Error: ${res.status}`);
    const recipe = await res.json();

    document.getElementById("recipeTitle").textContent = recipe.title;
    document.getElementById("recipeImage").src =
      recipe.image || "default-food.jpg";
    document.getElementById("recipeSummary").innerHTML = recipe.summary;

    const stepsList = document.getElementById("recipeSteps");
    stepsList.innerHTML = "";

    if (recipe.analyzedInstructions.length > 0) {
      recipe.analyzedInstructions[0].steps.forEach((step) => {
        const li = document.createElement("li");
        li.textContent = step.step;
        stepsList.appendChild(li);
      });
    } else {
      stepsList.innerHTML = "<li>No instructions available.</li>";
    }

    // Show modal
    modal.classList.add("show");
  } catch (error) {
    alert(`Failed to load recipe details: ${error.message}`);
  }
}

// Close Modal
closeModal?.addEventListener("click", () => {
  modal.classList.remove("show");
});

// Close modal when clicking outside
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("show");
  }
});

// Close modal with ESC key
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    modal.classList.remove("show");
  }
});

// Theme Toggle
themeToggle?.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  themeToggle.textContent = document.body.classList.contains("dark-mode")
    ? "☀ Light Mode"
    : "🌙 Dark Mode";
});

// Highlight Active Nav Section
window.addEventListener("scroll", () => {
  const fromTop = window.scrollY + 80;

  navLinks.forEach((link) => {
    const section = document.querySelector(link.getAttribute("href"));
    if (!section) return;

    if (
      section.offsetTop <= fromTop &&
      section.offsetTop + section.offsetHeight > fromTop
    ) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
});

// Cut button scrolls to hero section and clears recipes
cutBtn?.addEventListener("click", () => {
  document.querySelector(".hero").scrollIntoView({ behavior: "smooth" });
  cutBtn.style.display = "none";
  recipesContainer.innerHTML = "";
});
