import { API_URL, KEY, RES_PER_PAGE } from './config';
// import { getJSON, sendJSON } from './helpers';
import { AJAX } from './helpers';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data; // ode smo destruktuirali
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }), // ako je prva vrijednost falsy, onda sve stopira, a ako je truthy onda je druga vrijednost izvedena
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);
    // prvi korak
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      // svaki put kad loadamo recipe, provjeravamo da li objekt koji smo loadali ima pod bookmark.id isti id kao sto je naveden u searchu!
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
    // ovime ce svaki recept koji se loada imat bookmarked ili true ili false
  } catch (err) {
    console.error(`${err} 💣💣💣💣💣`);
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`); // IT WILL LOAD ALL RECIPES,INCLUDING THE ONE CONTAINING OUR OWN KEY
    state.search.results = data.data.recipes.map(rec => {
      // ovime punimo oni array koji nan je bilo cudno tamo vidit
      // map kreira novi array koji smo pohranili u results
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;
  } catch (err) {
    console.error(`${err} 💣💣💣💣💣`);
    throw err;
  }
};
export const getSearchResultsPage = function (
  page = state.search.page // postavljena default value na broj u tablici
) {
  state.search.page = page; // znaci ako asmo pozvali funkciju sa brojem 6, page postaje 6 i na temelju toga idu dalje
  const start = (page - 1) * state.search.resultsPerPage; //0 // ako smo stavili 6 onda je (6-1) puta 10=50
  const end = page * state.search.resultsPerPage; //9; 6*10 = 60
  return state.search.results.slice(start, end); // on mi vamo returna kad je page 1 prvih 10 recepata!
  // The slice method is used to extract a portion of an array. In this case, it is extracting elements from index 0 (inclusive) to index 9 (exclusive)
};
// uglavnom ovime smo namistili da 10 elemenata očita!

export const updateServings = function (newServings) {
  // pozvano sa 6
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings; // na temelju ovoga cime je pozvano radi novo
    // nova količina=stara količina x novi broj ljudi / prijasnji broj ljudi
  });
  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // ovu funkciju pokrecemo kada nam program javi prilikom klika na botun da je bookmarked set as false trenutno!
  // add bookmark
  state.bookmarks.push(recipe); // znaci mi u bookmarks stavljamo cijeli
  // mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true; // dodajemo novi option kao bookmarked
  persistBookmarks();
};

export const deleteBookmark = function (recipe) {
  // delete bookmark
  const index = state.bookmarks.findIndex(el => el.id === recipe.id); // on mi trazi indeks pod kojim je pozicioniran element koji ima isti id kao i id koji smo prilozili u funkciju
  state.bookmarks.splice(index, 1);
  // ode je problem jer on meni briše to iz arraya, ali ne mice tocno taj vec jednostavno brise
  // marked as not bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

export const uploadRecipe = async function (newRecipe) {
  try {
    console.log(Object.entries(newRecipe)); //it will log all the key-value pairs of the newRecipe object as an array of arrays.
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format, please use the correct format :)'
          );
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: newRecipe.cookingTime,
      servings: newRecipe.servings,
      ingredients,
    };
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
