import View from './view';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg'; // ikone koje se koriste
class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query. Please try again!';
  _message = '';

  _generateMarkup() {
    return this._data.map(this._generateMarkupPreview).join(''); // znaci na svaki dio objekta prilozenoga ide ova metoda
  }
  _generateMarkup() {
    return this._data // tu je znaci i dalje stavljeno model.state.bookmarks
      .map(bookmark => previewView.render(bookmark, false))
      .join(''); // znaci na svaki dio objekta prilozenoga ide ova metoda
  }
  // ovo gori ubacili umisto ovoga ispod
  // _generateMarkupPreview(result) {
  //   const id = window.location.hash.slice(1);
  //   return `
  //   <li class="preview">
  //           <a class="preview__link ${
  //             result.id === id ? 'preview__link--active' : ''
  //           }" href="#${result.id}">
  //             <figure class="preview__fig">
  //               <img src="${result.image}" alt="Test" />
  //             </figure>
  //             <div class="preview__data">
  //               <h4 class="preview__title">${result.title}</h4>
  //               <p class="preview__publisher">${result.publisher}</p>
  //             </div>
  //           </a>
  //         </li>
  //   `;
  // }
}
export default new ResultsView();
