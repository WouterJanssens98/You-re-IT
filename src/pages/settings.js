/**
 * The Settings Page
 */


import App from '../lib/App';


window.addEventListener('beforeunload', () => {
  document.body.classList.add('animate-out');
});


const homeTemplate = require('../templates/settings.hbs');

export default () => {
  // set the title of this page
 

  const title = 'Settings';

  // render the template
  App.render(homeTemplate({ title }));
  
  App.firebase.isLoggedIn();

  App.tools.darkmodeEnabled();


  const save = document.getElementById('savesetting');
  const checkbox = document.getElementById('checkbox');
  const container = document.getElementsByClassName('o-landingpage')[0];
  
  const ls = JSON.parse(localStorage.getItem('darkmode'))
  
  if(ls == true){
    container.classList.remove('o-landingpage');
    container.classList.add('active');
  }else{
    container.classList.remove('active');
    container.classList.add('o-landingpage');
  }
  // eslint-disable-next-line func-names
  checkbox.addEventListener('click', (e) => {
    console.log(checkbox.checked);
    if(checkbox.checked === true ) {
      console.log("trueee")
      localStorage.setItem('darkmode', JSON.stringify(checkbox.checked));
    }else if (checkbox.checked === false){
      console.log("falseeee")
      localStorage.setItem('darkmode' , JSON.stringify(checkbox.checked))
    }
  });
};
