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

  App.firebase.getAuth().onAuthStateChanged(async (user) => {
    if (user) {
      const ls = new Dataseeder();
      const adminLoc = await ls.playerLocation(user.uid);
      console.log('trying to log location');
      console.log(adminLoc);
      const position = adminLoc.split(',', '2');
      console.log(`The latitude is ${position[0]}`);
      console.log(`The longitude is ${position[1]}`);
    }
  });

  document.getElementById('invitecode').innerHTML = invitecode;

  document.getElementById('startgame').addEventListener('click', () => {
    console.log('starting game...');

    App.firebase.getAuth().onAuthStateChanged(async (user) => {
      if (user) {
        const ls = new Dataseeder();
        const adminLoc = await ls.playerLocation(user.uid);
        console.log('trying to log location');
        console.log(adminLoc);
        // try logging the current admin's location to console

        // create game ID in database with given settings
        const gameRef = App.firebase.getFirestore().collection('game').doc(invitecode);
        gameRef.get()
          .then((docSnapshot) => {
            if (docSnapshot.exists) {
              gameRef.onSnapshot((doc) => {
                console.log(`Game has already been played by ${user.email} , adding a new game!`);

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
                addGame(user.uid, players, duration, '');
                console.log(`Game added for user ${user.email}`);
              });
            } else {
            // game bestaat nog niet, aanmaken
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
              addGame(user.uid, players, duration, '');
              console.log(`Game added for user ${user.email}`);
            // create the document
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
        location: '3.670823, 51.087544',
      }, { merge: true })
        .then(
          // voorkomen dat game wordt opgestart vooraleer db in orde is
          setTimeout(() => { App.router.navigate('/mapbox'); }, 1000),
        );
    });
  });
};
