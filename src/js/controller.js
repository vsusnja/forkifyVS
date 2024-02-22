import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import View from './views/view.js';
import bookmarksView from './views/bookmarksView.js';

// if (module.hot) {
//   module.hot.accept();
// }
// This is commonly used during development to speed up the development process by applying changes instantly without manually refreshing the entire page.
// const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner(); // ovo mi sluzi da se oni kurac vrti prije nego loada oni container
    // update results view to view the selected search result
    resultsView.update(model.getSearchResultsPage());
    await model.loadRecipe(id); // preko ovoga dotrajemo recept putem promisa
    recipeView.render(model.state.recipe); // znaci pozivamo render funkciju od recipeViewa, i na nju pod data stavljamo podatke iz modal/state/recipe, i kad san stavija ono this.data=data znaci da se kompletna data sa ovoga s cime san pozva funkciju prebacila u this.data!!!
    // updating bookmarksView
    bookmarksView.update(model.state.bookmarks);
  } catch (err) {
    recipeView.renderError();
  }
};
const controlSearchResults = async function () {
  try {
    // 1) get search query
    const query = searchView.getQuery(); // ode je stavljen value od querija
    if (!query) return;
    // 2) Load search results
    await model.loadSearchResults(query); // ide await jer je ovo promise, pa jedino tako mozemo rezultate zaprimat!
    //3) render results

    // resultsView.render(model.state.search.results); OVAKO JE TO PRIJE IŠLO
    resultsView.render(model.getSearchResultsPage()); // funckija je pozvana sa objektom koji sadrzi 10 recepata
    // render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};
controlSearchResults();

const controlPagination = function (goToPage) {
  //3) render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));
  // render  new pagination buttons
  paginationView.render(model.state.search);
};
const controlServings = function (newServings) {
  // zaprima parametar new servings// amo rec da je ode 6
  // update the recipe servings (in state)
  model.updateServings(newServings); // sa tim parametrom ona poziva model.update...
  // update the view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};
// ovo ispod se dešava kad kliknemo na botun bookmark
const controlAddBookmark = function () {
  // 1) add or remove bookmark , oce reci kako ce se nas program ponasat kada kliknemo na taj botun
  if (!model.state.recipe.bookmarked) {
    // ako je bookmarked set as a false!
    model.addBookmark(model.state.recipe);
  } else model.deleteBookmark(model.state.recipe); // ako je bookmarked true!
  // 2) update recipe view
  recipeView.update(model.state.recipe);
  // 3) render bookmarks
  console.log(model.state.bookmarks); // do ode sve radi
  bookmarksView.render(model.state.bookmarks); // sad trebamo ovo rjesit
};
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};
const controlAddRecipe = async function (newRecipe) {
  try {
    // show loading is happening

    addRecipeView.renderSpinner();
    await model.uploadRecipe(newRecipe); // tu je prilozena data iz parent elementa
    // render recipe
    recipeView.render(model.state.recipe);

    // display succes message
    addRecipeView.renderMessage();

    // render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // change id in the url

    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // close form window da mozemo vidit recept
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err); // ode nan vraca error iz funkcije upload recipe jer je ona async
    addRecipeView.renderError(err.message);
  }

  const newFeature = function () {
    console.log('wELCOME TO HTE APP');
  };
};
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.atHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateSServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults); // znaci cin stranica registrira nekakvi submit, pokrenit ce se ovo sve
  paginationView.addHandlerClick(controlPagination); // ode je pozvana funkcija kod koje smo dobivali data broj
  addRecipeView._addHandlerUpload(controlAddRecipe);
  newFeature();
};
init();

//The atHandlerRender method seems to be designed to register event listeners for the 'hashchange' and 'load' events on the window object. These events are typically associated with changes in the URL hash and the complete loading of the document, respectively.

// #našproblem
// Učita mi se sve normalno, i kad iden ucitat novi recept, zapne mi na postojecoj stranici
// znaci moran nac di se taj novi recept ucitaje i postavit da se broj stranice vrati na pocetak
