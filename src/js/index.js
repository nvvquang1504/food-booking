import Search from "./models/Search";
import Recipe from "./models/Recipe";
import List from './models/List'
import * as searchView from './views/searchView'
import * as recipeView from './views/recipeView'
import * as listView from './views/listView'
import * as likesView from './views/likesView'
import {elements, renderLoader, clearLoader} from "./views/base";
import Likes from "./models/Likes";
//GLOBAL STATE OF THE APP
const state = {
    // likes: new Likes(),
};
/**
 * CONTROL SEARCH
 */
const controlSearch = async () => {
    // 1) Get query from views
    const query = searchView.getInput()//TODO
    if (query) {
        // 2) New search object and add to state
        state.search = new Search(query)
        // 3) Prepare UI for results
        searchView.clearInput()
        searchView.clearResults()
        renderLoader(elements.searchRes)
        // 4) Search for recipes
        try {
            await state.search.getResults()
            // 5) Render results on UI
            clearLoader()
            searchView.renderResults(state.search.result, 1, 10)
        } catch (error) {
            alert('Something wrong with search value :(')
            clearLoader()
        }

    }
    if (query === '') {
        searchView.clearResults()
    }
};

elements.searchForm.addEventListener('submit', (e) => {
    e.preventDefault()
    controlSearch()
});
elements.searchResPages.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        let goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults()
        searchView.renderResults(state.search.result, goToPage, 10)
    }
})

/**
 * CONTROL RECIPE
 */
state.likes = new Likes()
const controlRecipe = async () => {
    const id = window.location.hash.replace('#', '');
    if (id) {
        recipeView.clearRecipe()
        renderLoader(elements.recipe)
        state.recipe = new Recipe(id)
        // console.log(state.search)
        if (state.search) {
            searchView.highlightSelected(id)
        }
        try {
            await state.recipe.getRecipe()
            state.recipe.calcTime();
            state.recipe.calcServings();
            state.recipe.parseIngredients()
            // console.log(state.recipe)
            // recipeView.clearRecipe()
            clearLoader();
            // recipeView.clearRecipe()
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id))
            likesView.toggleLikeMenu(state.likes.getNumLikes())
        } catch (error) {
            alert('Error processing recipe')
        }
    }
}
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe))

/**
 * LIST CONTROLLER
 */
const controlList = () => {
    if (!state.list) {
        state.list = new List()
    }
    state.recipe.ingredients.forEach((el) => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient)
        listView.renderItem(item)
    })
}
elements.shopping.addEventListener('click', (e) => {
    const id = e.target.closest('.shopping__item').dataset.itemid;
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        state.list.deleteItem(id);
        listView.deleteItem(id)
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10)
        state.list.updateCount(id, val)
        console.log(state.list)
    }
})
elements.recipe.addEventListener('click', async (e) => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        if (state.recipe.servings > 1) {
            await state.recipe.updateServings('dec')
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        if (state.recipe) {
            state.recipe.updateServings('inc')
        }
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        await controlList()
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        controlLike();
    }
    recipeView.clearRecipe()
    recipeView.renderRecipe(state.recipe, state.likes.isLiked(state.recipe.id))
    // console.log(state.recipe)
})
const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currID = state.recipe.id;
    if (!state.likes.isLiked(currID)) {
        // Add like to the state
        const {title, author, img} = state.recipe
        const newLike = state.likes.addLikeItem(currID, title, author, img)
        likesView.renderLike(newLike)
        // Toggle the like button
        // likesView.toggleLikeBtn(true)
        recipeView.renderRecipe(state.recipe, true)
        // Add like to UI list
        console.log(state.likes)
    } else {
        //Remove like from the state
        state.likes.deleteLike(currID)
        likesView.deleteLike(currID)
        // Toggle the like button
        // likesView.toggleLikeBtn(false)
        recipeView.renderRecipe(state.recipe, false)
        // Remove like to UI list
        console.log(state.likes)
    }

    // likesView.toggleLikeMenu(state.likes.getNumLikes())
}
// Restore liked recipes on page load
window.addEventListener('load', () => {
    state.likes = new Likes();
    state.likes.readStorageData()
    likesView.toggleLikeMenu(state.likes.getNumLikes())
    state.likes.likes.forEach((like) => {
        likesView.renderLike(like)
    })
})
