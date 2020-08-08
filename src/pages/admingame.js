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
import Dataseeder from '../lib/core/dataseeder';

const homeTemplate = require('../templates/admingame.hbs');

export default () => {
  // set the title of this page
  const title = 'Admingame';

  // render the template
  App.render(homeTemplate({ title }));

  App.firebase.isLoggedIn();

  const a = document.getElementById('m-dropdown-2');
  const b = document.getElementById('m-dropdown');


  const ds = new Dataseeder();

  const invitecode = ds.randomInviteCode();

 

  document.getElementById('invitecode').innerHTML = invitecode;

  document.getElementById('startgame').addEventListener('click', () => {
        App.firebase.getAuth().onAuthStateChanged(async (user) => {
      if (user) {
        
        // create game ID in database with given settings
        const gameRef = App.firebase.getFirestore().collection('game').doc(invitecode);
        gameRef.get()
          .then((docSnapshot) => {
            if (docSnapshot.exists) {
            // do nothing, games shouldnt be overwritten              
            } else {
            // create game
            // eslint-disable-next-line no-inner-declarations
              function addGame(host, players, duration, result) {
                gameRef.set({
                  host,
                  players,
                  duration,
                  result,
                });
              }
              const players = a.options[a.selectedIndex].value;
              const duration = b.options[b.selectedIndex].value;
              addGame(user.uid, players, duration, 'created');
              console.log(`Game added by user ${user.email}`);
              setTimeout(() => { App.router.navigate('/lobby'); }, 500)
            }
          });
      } else {
      // niet ingelogd, verwerpen
      }

      // add lobby code as latest game to User Database
      const userRef = App.firebase.getFirestore().collection('users').doc(user.uid);

      const setWithMerge = userRef.set({
        lobbycode: invitecode,
        team: 'admin',
        type: 'tikker'
      }, { merge: true });

      /*
        .then(
          // voorkomen dat game wordt opgestart vooraleer db in orde is
          setTimeout(() => { App.router.navigate('/mapbox'); }, 1000),
        );
      */


    });
  });
};
