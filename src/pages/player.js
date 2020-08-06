/**
 * The Player selection page
 */


import App from '../lib/App';


const homeTemplate = require('../templates/player.hbs');

export default () => {
  // set the title of this page
  const title = ' ';

  // render the template
  App.render(homeTemplate({ title }));
};
