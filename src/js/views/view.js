import icons from 'url:../../img/icons.svg'; // ikone koje se koriste
import recipeView from './recipeView';
import { mark } from 'regenerator-runtime';

export default class View {
  _data;
  /**
   * Render the recieved object to the DOM
   * @param {object | Object[]} data the data to be rendered ( e.g. recipe )
   * @param {boolean} [render=true] if false create markup string instead of rendering to the DOM
   * @returns {undefined | string} a markup string is returned if render=false
   * @this {object} view
   */
  render(data, render = true) {
    // prvo provjerit da li data uopce postoji!
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data; // s ovim potezom ode ubacujemo datu iz modela !!! i kasnije ju koristimo kod generatemarkup

    const markup = this._generateMarkup(); // ovime this znaci da je ovo funkcija od svakoga ko je izabere zasebna
    if (!render) return markup;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  _clear() {
    this._parentElement.innerHTML = '';
  }
  update(data) {
    this._data = data; // ovo smo stavili radi generatemarkupa, jer je on popunjen sa this._data
    const newMarkup = this._generateMarkup(); // kompletni DOM je pohranija tu
    // convert markup string to DOM object
    const newDOM = document.createRange().createContextualFragment(newMarkup); // ode smo pohranili sve div classove ko sta izgleda u index.html
    // const newElements = newDOM.querySelectorAll('*'); doli cemo konvertat u real array
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*')); // ovo je valjda znak za sve select
    // console.log(curElements); // trenutno stanje bez ikakvh promjena
    //console.log(newElements); // novo stanje, nakon našeg klika
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== '' // THIS CODE IS ONLY EXECUTED ON ELEMENTS THAT CONTAIN TEXT DIRECTLY
        //!== '': This is a strict inequality comparison operator, which checks if the trimmed text content is not an empty string.
      ) {
        curEl.textContent = newEl.textContent;
      }
      //UPDATES CHANGED ATTRIBUTES
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr => {
          curEl.setAttribute(attr.name, attr.value);
        });
        // replace all the attributes in the current element by the attributes coming from a new element
      }
    });
  }

  renderSpinner = function () {
    const markup = `<div class="spinner">
    <svg>
      <use href="${icons}#icon-loader"></use>
    </svg>
  </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  };
  renderError(message = this._errorMessage) {
    const markup = `<div class="error">
    <div>
      <svg>
        <use href="${icons}#icon-alert-triangle"></use>
      </svg>
    </div>
    <p>${message}</p>
  </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  renderMessage(message = this._message) {
    const markup = `<div class="error">
    <div>
      <svg>
        <use href="${icons}#icon-smile"></use>
      </svg>
    </div>
    <p>${message}</p>
  </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
