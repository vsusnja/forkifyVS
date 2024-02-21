import View from './view.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg'; // ikone koje se koriste
class bookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet, find a nice recipe and bookmark it!';
  _message = '';
  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
  _generateMarkup() {
    return this._data // tu je znaci i dalje stavljeno model.state.bookmarks
      .map(bookmark => previewView.render(bookmark, false))
      .join(''); // znaci na svaki dio objekta prilozenoga ide ova metoda
  }
}
export default new bookmarksView();

// idemo ode napisat kako bi se uopce ovi bookmarksi tribali prikazivat, tako cu jedino nac u cemu je problem
// 1) trebali bi biti isti podaci kao i u search results, odnosno resultsview, samo umanjeni
// 2) treba uradit da kad kliknemo na bookmarks se nama rendera taj recept koji smo klikni i prikaze se u stupcu bookmarks
// 3) prvi korak koji smo uradili je u modelu da smo prilikom loadanja recepta pregledali da li recept koji smo trenutno loadali ima pod state.bookmarks, i ako ima onda je bookmarked stavljeno kao true, a ako nema onda je false
// 4) ako je false onda ga dodajemo i ide funkcija addBookmark putem koje u bookmarks array punimo trenutno recept te postavljamo bookmarked as true!
// 5) ako je bookmarked true onda ide funkcija deleteBookmark putem koje trazimo njen indeks u arrayu bookmark i sa metodom splice ga uklanjamo iz tog arraya i naravno stavljamo bookmarked = false
// znaci do sada smo napravili jednostavan mehanizam koji botum bookmark rjesava na nacin da ili dodjeluje option bookmarked u recept neki ili ga uklanja! Sada trebamo uradit da kada kliknemo na botun bookmarks nam to sta smo klikli prikaze u onome gore stupcu di su bookmarksi
// bitna stvar je da su povezani medusobno resultsview i preview view. sada moran saznat na koji nacin to funkcionira
// resultsview i previewviev oboma stoji da importaju view!
//the module that imports View gains access to all the properties and methods exported by the view.js , znaci da i resultsView
// NE NE NE , krivo si pokopca, bookmarksView i resultsView su povezani na previewView, koji djeluje pod pashom viewa, i ovisno di prikazuje rezultate minja svoje izbore
// 6)
// 7)
// 8)
