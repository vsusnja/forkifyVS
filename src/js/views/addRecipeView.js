import View from './view';
import icons from 'url:../../img/icons.svg'; // ikone koje se koriste
class addRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Uspjesno je recept uploadan';
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');
  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }
  // Inheritance: It calls the super() method. This calls the constructor of the parent class (View in this case), ensuring that any setup code in the parent class's constructor is executed. This is necessary because addRecipeView extends View, so it inherits properties and methods from View.

  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }
  // prvotno nije bilo ove metode, ali smo rekonfiguirali this word, i sad je okej, jer this word uvik pripada funkciji koja ga zove i zato mi je bila greska vamo, treba paziti na to

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this)); // preko binda pridruxujemo this
  }
  _addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault(); // this uvik pripada funkciji pa je on ovdje parent element, jedino priko binda ga mozemo minjat
      const dataArr = [...new FormData(this)]; //So, dataArr will be an array containing key-value pairs extracted from the form, where each pair is represented as an array element in the format [key, value].
      const data = Object.fromEntries(dataArr); // pretvaramo array u object
      handler(data);
    });
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
  }
  _generateMarkup() {}
}

export default new addRecipeView();
