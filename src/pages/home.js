/**
 * The Home Page
 */

import { SITE_TITLE } from '../consts';
import App from '../lib/App';

<<<<<<< HEAD:src/pages/home.js
const homeTemplate = require('../templates/home.hbs');
=======


const homeTemplate = require('../templates/history.hbs');
>>>>>>> Added Password check, better Redirect if not logged in, Pre Game Lobby for player:src/pages/history.js

export default () => {
  // set the title of this page
  const title = `${SITE_TITLE} is ready to go!`;

  // render the template
  App.render(homeTemplate({ title }));
<<<<<<< HEAD:src/pages/home.js
=======

  App.firebase.isLoggedIn();
  




  //   TO DO

  // Render the match result of each logged in user on this page
>>>>>>> Added Password check, better Redirect if not logged in, Pre Game Lobby for player:src/pages/history.js
};
