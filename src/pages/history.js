/**
 * The History Page
 */

import { SITE_TITLE } from '../consts';
import App from '../lib/App';



const homeTemplate = require('../templates/history.hbs');

export default () => {
  // set the title of this page
  const title = `${SITE_TITLE} is ready to go!`;

  // render the template
  App.render(homeTemplate({ title }));

  App.firebase.isLoggedIn();
  




  //   TO DO

  // Render the match result of each logged in user on this page
};
