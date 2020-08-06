/* eslint-disable no-alert */
/* eslint-disable no-unused-vars */
/**
 * The Playergame selection page
 */


import * as firebase from 'firebase/app';
import App from '../lib/App';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';
import Dataseeder from '../lib/core/dataseeder';


const homeTemplate = require('../templates/playergame.hbs');

export default () => {
  // set the title of this page
  const title = ' ';

  // render the template
  App.render(homeTemplate({ title }));

  App.firebase.isLoggedIn();

  document.getElementById('startgame').addEventListener('click', () => {
    console.log('joining game...');
    const invitedcode = document.getElementById('input_code').value;
    const codeRef = App.firebase.getFirestore().collection('game').doc(invitedcode);
    codeRef.get()
      .then((docSnapshot) => {
        if (docSnapshot.exists) {
          codeRef.onSnapshot((doc) => {
            App.firebase.getAuth().onAuthStateChanged(async (user) => {
              if (user) {
                // add lobby code as latest game to User Database
                const userRef = App.firebase.getFirestore().collection('users').doc(user.uid);

                const setWithMerge = userRef.set({
                  lobbycode: invitedcode,
                  team: 'player',
                  location: '3.675972 , 51.088436',
                }, { merge: true });
                localStorage.setItem('gamecode', JSON.stringify(invitedcode))
                App.router.navigate('/lobby');
                //App.router.navigate('/mapbox');
              } else {
                // niet ingelogd, verwerpen
              }
            });
          });
        } else {
          window.alert("This game doesn't seem to exist, please check your invite code!");
          document.getElementById('input_code').value = '';
        }
      });
  });
};
