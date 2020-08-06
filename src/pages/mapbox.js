/* eslint-disable prefer-const */
/* eslint-disable max-len */
/* eslint-disable no-loop-func */
/* eslint-disable no-return-assign */
/* eslint-disable no-inner-declarations */
/* eslint-disable no-unused-vars */
/**
 * The Mapbox Page
 */


// TODO : players have to join before the admin starts the game for the game to properly render them( fix this )
// TODO : add the tagging logic and save this to the database (to keep track which player was tagged last)
// TODO : add timer to game on top (tried multiple options, every single one failed)
// TODO : add sounds?
// TODO : ...


import { MAPBOX_API_KEY } from '../consts';
import MapBox from '../lib/core/MapBox';
import App from '../lib/App';
import Dataseeder from '../lib/core/dataseeder';


const mapboxTemplate = require('../templates/mapbox.hbs');

export default () => {
  // set the title of this page
  const title = 'Mapbox';

  // render the template
  App.render(mapboxTemplate({ title }));

  App.firebase.isLoggedIn();
  
  const bounds = [
    [3.640046, 51.062434], // Southwest coordinates
    [3.695991, 51.109025], // Northeast coordinates
  ];
  // create the MapBox options
  const mapBoxOptions = {
    container: 'mapbox',
    center: [3.670823, 51.087544],
    style: 'mapbox://styles/mapbox/streets-v11',
    zoom: 12.5,
    maxBounds: bounds,
  };

  // create a new MapBox instance
  // NOTE: make sure the HTML is rendered before making an instance of MapBox
  // (it needs an element to render)

  App.firebase.getAuth().onAuthStateChanged(async (user) => {
    if (user) {
      // set username to use in mapbox
      const username = user.email.substring(0, user.email.indexOf('@'));

      // set current lobby code to in game header
      function getCurrentInvite(uid) {
        const locationRef = App.firebase.getFirestore().collection('users').doc(uid);
        return new Promise(((resolve, reject) => {
          locationRef.get()
            .then((docSnapshot) => {
              if (docSnapshot.exists) {
                locationRef.onSnapshot((doc) => {
                  const value = doc.get('lobbycode');
                  resolve(value);
                });
              }
            });
        }));
      }
      const gamecode = await getCurrentInvite(user.uid);
      console.log(gamecode);

      // get the current max allowed players from db
      function getCurrentPlayers(a) {
        const newRef = App.firebase.getFirestore().collection('game').doc(a);
        return new Promise(((resolve, reject) => {
          newRef.get()
            .then((docSnapshot) => {
              if (docSnapshot.exists) {
                newRef.onSnapshot((doc) => {
                  const value = doc.get('players');
                  console.log(value);
                  resolve(value);
                });
              }
            });
        }));
      }

      function getCurrentPlaytime(a) {
        const newRef = App.firebase.getFirestore().collection('game').doc(a);
        return new Promise(((resolve, reject) => {
          newRef.get()
            .then((docSnapshot) => {
              if (docSnapshot.exists) {
                newRef.onSnapshot((doc) => {
                  const value = doc.get('duration');
                  console.log(value);
                  resolve(value);
                });
              }
            });
        }));
      }

      let gameDuration = await getCurrentPlaytime(gamecode);
      console.log(gameDuration);
      console.log('waiting');
      let gamePlayers = await getCurrentPlayers(gamecode);
      console.log(`The gamecode is ${gamecode}`);

      document.getElementById('invitecode').innerHTML += gamecode;
      document.getElementById('playtime').innerHTML += `${gameDuration} minutes`;
      //  document.getElementById('players').innerHTML = `Players : ${amountOfPlayers} players`;


      // get current user's location
      const ls = new Dataseeder();
      const adminLoc = await ls.playerLocation(user.uid);
      console.log('trying to log location');
      console.log(adminLoc);
      const position = adminLoc.split(',', '2');
      console.log(`The latitude is ${position[0]}`);
      console.log(`The longitude is ${position[1]}`);


      if (MAPBOX_API_KEY !== '') {
        // eslint-disable-next-line no-unused-vars
        const mapBox = new MapBox(MAPBOX_API_KEY, mapBoxOptions);

        // Render the admin first

        mapBox.addAdminPicture(position[0], position[1], username, 'bad');

        // then render the players that join (for the purpose of testing this exercise, every player that joins gets the same location


        async function renderJoined() {
          await App.firebase.getFirestore().collection('users').where('lobbycode', '==', gamecode).where('team', '==', 'player')
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                let name = doc.get('name');
                let playerlocation = doc.get('location');
                const newposition = playerlocation.split(',', '2');
                mapBox.addPicture(newposition[0], newposition[1], 'realplayer', 'real');
              // for the purpose of testing, only use 1 real player and add it close to the admin
              });
            });
        }

        renderJoined();

        // then render the bots
        let i = 0;
        for (i = 0; i < gamePlayers; i++) {
          const botRef = App.firebase.getFirestore().collection('bots').doc(`${i}`);
          botRef.get()
            .then((docSnapshot) => {
              if (docSnapshot.exists) {
                botRef.onSnapshot((doc) => {
                  const location = doc.get('location');
                  const botname = doc.get('name');
                  console.log(`${botname} location is ${location}`);
                  const botposition = location.split(',');
                  console.log(`Adding ${botname}`);
                  mapBox.addPicture(botposition[1], botposition[0], botname, 'good');
                  console.log(`Added ${botname}`);
                });
              }
            });
        }


        let x = 3.675304;
        let y = 51.082156;

        const bots = ['bot1', 'bot2', 'bot3', 'bot4', 'bot5', 'bot6', 'bot7', 'bot8', 'bot9', 'bot10'];

        // make the bots rotate

        setInterval(() => {
          for (let j = 0; j < gamePlayers - 1; j++) {
            let data = {
              type: 'FeatureCollection',
              features: [
                {
                  type: 'Feature',
                  geometry: {
                    type: 'Point',
                    coordinates:
                      [x, y],

                  },
                },
              ],
            };
            const currentValueX = mapBox.map.getSource(bots[j])._data.features[0].geometry.coordinates[0];
            const currentValueY = mapBox.map.getSource(bots[j])._data.features[0].geometry.coordinates[1];
            // eslint-disable-next-line prefer-const
            let a = ls.changeLocation(currentValueX);
            // eslint-disable-next-line prefer-const
            let b = ls.changeLocation(currentValueY);
            data.features[0].geometry.coordinates = [a, b];
            mapBox.map.getSource(bots[j]).setData(data);
            renderJoined();
          }
        }, 5000);

        // end of loop
      }
    } else {
      App.router.navigate('homepage');
    }
  });

  // header button actions

  document.getElementById('menubutton').addEventListener('click', () => {
    document.getElementById('m-menu').style.display = 'block';
    document.getElementById('timer').style.display = 'none';
    document.getElementById('');
  });

  document.getElementById('menubutton-2').addEventListener('click', () => {
    document.getElementById('m-menu').style.display = 'none';
    document.getElementById('timer').style.display = 'block';
    document.getElementById('menubutton').style.display = 'block';
  });

  document.getElementById('mapbox-exit').addEventListener('click', () => {
    console.log('Stopping game means resulting in a loss for the host!');
    clearInterval();

    App.firebase.getAuth().onAuthStateChanged(async (user) => {
      if (user) {
        const game = App.firebase.getFirestore().collection('users').doc(user.uid).lobbycode;
        const resultRef = App.firebase.getFirestore().collection('game').doc(game);

        const setWithMerge = resultRef.set({
          result: 'lost',
        }, { merge: true });
      }
    });
    App.router.navigate('homepage');
  });

  // make a timer for the game
};
