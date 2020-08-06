/**
 * A LocalStorage Wrapper
 *
 * @author Tim De Paepe <tim.depaepe@arteveldehs.be>
 */

export default class Storage {
  constructor(localStorage) {
    this.localStorage = localStorage;
  }

  exists(key) {
    return this.getItem(key) !== null;
  }

  getArray(key) {
    return JSON.parse(this.getItem(key));
  }

  getItem(key) {
    return this.localStorage.getItem(key);
  }

  initEmptyArray(key) {
    if (!this.exists(key)) this.setArray(key, []);
  }

  setArray(key, value) {
    this.setItem(key, JSON.stringify(value));
  }

  setItem(key, value) {
    this.localStorage.setItem(key, value);
  }
  
  darkmodeEnabled(){
    if(this.localStorage.getItem('darkmode') == true){
      const container = document.getElementsByClassName('o-landingpage')[0];
      container.classList.remove('o-landingpage');
      container.classList.add('active');
    } else {
      // do nothing
    }
  }
}
