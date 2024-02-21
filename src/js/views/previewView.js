import View from './view';
import icons from 'url:../../img/icons.svg'; // ikone koje se koriste
class previewView extends View {
  // to znaci da smo mi pridobili sve komponente iz viewa, ali ovo extends znaci da ih mozemo koristiti ali na nekakvi naš nacin , odnosno u ovom slucaju putem generateMarkuPpREVIEWA
  _parentElement = '';
  _generateMarkup() {
    // data je undefined, i tu je nastao cijeli problem oko svega
    const id = window.location.hash.slice(1); // id smo provjerili i on je dobar
    const result = this._data;
    return `
    <li class="preview">
            <a class="preview__link ${
              result.id === id ? 'preview__link--active' : ''
            }" href="#${result.id}">
              <figure class="preview__fig">
                <img src="${result.image}" alt="Test" />
              </figure>
              <div class="preview__data">
                <h4 class="preview__title">${result.title}</h4>
                <p class="preview__publisher">${result.publisher}</p>
                <div class="preview__user-generated ${
                  result.key ? '' : 'hidden'
                }">
                <svg>
                          <use href="${icons}#icon-user"></use>
                        </svg>
                </div>
              </div>
            </a>
          </li>
    `;
  }
}
export default new previewView();
