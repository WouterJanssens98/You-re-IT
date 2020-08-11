/* eslint-disable no-alert */
/* eslint-disable no-unused-vars */
/**
 * The Homepage
 */


import * as firebase from 'firebase/app';
import App from '../lib/App';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';
import isLoggedIn from './helpers';

const homeTemplate = require('../templates/homepage.hbs');

export default () => {
  // set the title of this page
  const title = 'Homepage';

  // render the template
  App.render(homeTemplate({ title }));

  Notification.requestPermission();

  // eslint-disable-next-line no-shadow

  // acties uitvoeren op huidige ingelogde user
  

  App.firebase.getAuth().onAuthStateChanged(async (user) => {
    if (user) {
      document.getElementById('signedinUser').innerHTML = user.email;

      const username = user.email.substring(0, user.email.indexOf('@'));

      // check if firestore entry exists
      const usersRef = App.firebase.getFirestore().collection('users').doc(user.uid);
      usersRef.get()
        .then((docSnapshot) => {
          if (docSnapshot.exists) {
            usersRef.onSnapshot((doc) => {
              // do nothing, user exists
            });
          } else {
            // create the document
            // eslint-disable-next-line no-inner-declarations
            function addUser(name, long, lat, lobbycode, uid, team) {
              usersRef.set({
                name,
                long,
                lat,
                lobbycode,
                uid,
                team,
              });
            }
            addUser(username, '', '', '', user.uid, '');
            console.log(`${user.email} was added to Firestore`);
          }
        });
    } else {
      // App.router.navigate('/game');
    }
  });


  function signOut() {
    App.firebase.getAuth().signOut().then(() => {
      window.alert('Logging you out!');
    });
  }


  document.getElementsByClassName('a-button-logoutbutton')[0].addEventListener('click', () => {
    signOut();
  });
};
