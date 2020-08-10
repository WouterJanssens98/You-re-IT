/**
 * The Settings Page
 */


import App from '../lib/App';


window.addEventListener('beforeunload', () => {
  document.body.classList.add('animate-out');
});


const homeTemplate = require('../templates/offlinepage.hbs');

export default () => {
  // set the title of this page
 

  const title = 'Offline';

  // render the template
  App.render(homeTemplate({ title }));
  
 
  // eslint-disable-next-line func-names

};
