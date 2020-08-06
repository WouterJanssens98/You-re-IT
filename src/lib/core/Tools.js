/**
 * Useful tools
 *
 * @author Tim De Paepe <tim.depaepe@arteveldehs.be>
 */

class Tools {
  static isUndefined(obj) {
    return typeof (obj) === 'undefined';
  }

  static darkmodeEnabled(){
    if(localStorage.getItem("darkmode") === "true" ){
      const container = document.getElementsByClassName('o-landingpage')[0];
      container.classList.remove('o-landingpage');
      container.classList.add('active');
    } else {
      console.log("not true!!!!!!")
    }
  }


}

export default Tools;
