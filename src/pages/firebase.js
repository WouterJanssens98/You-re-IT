/**
 * The Firebase Page
 */

import App from '../lib/App';

const firebaseTemplate = require('../templates/firebase.hbs');

export default () => {
  // set the title of this page
  const title = 'Firebase';

  // only when we have firebase initialized
  if (App.hasFireBase) {
    // check if firebase is working
    console.log(App.firebase.getAuth());
    console.log(App.firebase.getFirestore());
  }

  // render the template
  App.render(firebaseTemplate({ title }));
};
