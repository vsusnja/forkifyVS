class SearchView {
  _parentElement = document.querySelector('.search');
  getQuery() {
    const query = this._parentElement.querySelector('.search__field').value; // ode pridruzujemo vrijednost koju smo ubacili u trazilicu
    this._clearInput(); // cistimo tu trazilicu

    return query; // i kao rezultat ove metode returnamo query, odnosno taj value unesen!
  }
  _clearInput() {
    this._parentElement.querySelector('.search__field').value = '';
  }
  addHandlerSearch(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      // when we submit a form we need to prevent a default action, otherwise page would reload
      e.preventDefault();
      handler(); // ovo je jednostavno funkcija koja reagira na submit, odnosno na enter valua i kad se to desi odradi se funkcija privezana uz handler
    });
  }
}
export default new SearchView();
// export default is used to export this newly created instance as the default export of the module.This approach is useful when you want to have a single instance of a class that is shared across different parts of your application.
