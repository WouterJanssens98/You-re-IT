/* eslint-disable prefer-const */
/* eslint-disable max-len */
/* eslint-disable no-loop-func */
/* eslint-disable no-return-assign */
/* eslint-disable no-inner-declarations */
/* eslint-disable no-unused-vars */
/**
 * The Mapbox Page
 */





import { MAPBOX_API_KEY } from '../consts';
import MapBox from '../lib/core/MapBox';
import App from '../lib/App';
import Dataseeder from '../lib/core/dataseeder';

import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';
import Router from '../lib/core/Router';
import * as consts from '../consts';




const mapboxTemplate = require('../templates/mapbox.hbs');

export default () => {
  // set the title of this page
  const title = 'Mapbox';

  // render the template
  App.render(mapboxTemplate({ title }));

  App.firebase.isLoggedIn();

  App.firebase.getAuth().onAuthStateChanged(async (user) => {
    if (user) {
          
      const user = App.firebase.getAuth().currentUser;
      const currentLocation = await App.firebase.getUserLocation(user.uid)


      const bounds = [
        [currentLocation.lat + 0.2, currentLocation.lat + 0.2], // Southwest coordinates
        [currentLocation.long + 0.2, currentLocation.long + 0.2], // East coordinatesNortheast coordinates
      ];

      // create the MapBox options
      const mapBoxOptions = {
        container: 'mapbox',
        center: [currentLocation.long, currentLocation.lat],
        style: 'mapbox://styles/mapbox/streets-v11',
        zoom: 12.5,
      };

      // Get user info
      const info = await App.firebase.getUserInfo(user.uid);
      const gamecode = info.lobbycode;
      const useruid = info.uid;
      const team = info.team

      if(team == "admin"){
        document.getElementById('mapbox-exit').innerHTML = "End Game"
      }


      function success(position) {
        const lat  = position.coords.latitude;
        const long = position.coords.longitude;
        App.firebase.updatePosition(gamecode, useruid,long,lat);
      }
  
      function error() {
        console.log('Unable to retrieve your location');
      }
  
      function update(){
        if (!navigator.geolocation) {
          console.log("Geolocation is not supported by this browser.")
          
        } else {
          navigator.geolocation.getCurrentPosition(success, error,{timeout:10000});
        }
      }
      
      // push latest location every 5 seconds to Firestore

      function start(){
        App.firebase.isTikked(gamecode,useruid)
      }

      // update location every 10 seconds
      window.myInterval1 = setInterval(update,2500)
      // check if user is located within tag distance every 15 seconds
      window.myInterval2 = setInterval(start, 3000)
   

      const gameInfo = await App.firebase.getGameInfo(gamecode);
      const gameDuration = gameInfo.duration
      const gamePlayers = gameInfo.players
      const gameHost = gameInfo.host
      const gameStatus = gameInfo.result

      document.getElementById('invitecode').innerHTML += gamecode;
  

     

      if (MAPBOX_API_KEY !== '') {
        // eslint-disable-next-line no-unused-vars
        const mapBox = new MapBox(MAPBOX_API_KEY, mapBoxOptions);
        var userlist = [];


        async function getCurrentPlayers(){
        App.firebase.getFirestore().collection("users").where("lobbycode", "==", gamecode)
        .onSnapshot(function(querySnapshot) {
        userlist = [];
        querySnapshot.forEach(function(doc) {
          userlist.push(doc.get('uid'));
          let name = doc.get('name');
          let long = doc.get('long');
          let lat = doc.get('lat');
          let team = doc.get('team')
          let type = doc.get('type')
          let uid = doc.get('uid')
          if(type == 'speler'){
            mapBox.addPicture(long, lat, uid, 'good');
          }else if(type == 'tikker'){
            mapBox.addPicture(long, lat, uid, 'bad');
          }else{
            // do nothing, player has no type specified
          }
        });
        });
  
      };

      //render the players for the first time
      getCurrentPlayers()
      
      window.myInterval4 = setInterval(async () => {
        const users = []
        await App.firebase.getFirestore().collection('users').where('lobbycode', '==', gamecode)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              users.push(doc.get('uid'))
            });
          });
        getCurrentPlayers()
        let x = 0;
        let y = 0;
        for (let j = 0; j < users.length  ; j++) {
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
          // eslint-disable-next-line prefer-const
          let userinfo = await App.firebase.getUserInfo(users[j])
          data.features[0].geometry.coordinates = [userinfo.long, userinfo.lat];
          if(mapBox.map.getSource(userinfo.uid)){
          mapBox.map.getSource(userinfo.uid).setData(data);
          } else {
          mapBox.addPicture(userinfo.long, userinfo.lat, userinfo.uid, 'good');
          }
          ;
        }
      }, 5000);

      function startTimer(duration, display) {
        var timer = duration, minutes, seconds;
        window.myInterval3 = setInterval(myTimer,1000)
      function myTimer () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        display.textContent = minutes + ":" + seconds;
        if (--timer < 0) {
          /*
            clearInterval(window.myInterval1);
            clearInterval(window.myInterval2);
            clearInterval(window.myInterval3);
            clearInterval(window.myInterval4);
        */
            const gameRef = App.firebase.getFirestore().collection('game').doc(gamecode);
            const setGameWithMerge = gameRef.set({
              result: 'finished',
            }, { merge: true });
        }
      }
      };
      function beginTimer () {
          const amountOfMinutesSeconds = gameDuration * 60;
          const display = document.getElementById('time');
          startTimer(amountOfMinutesSeconds, display);
      };
      beginTimer()

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
    App.firebase.getAuth().onAuthStateChanged(async (user) => {
      if (user) {
        /*
        clearInterval(window.myInterval1);
        clearInterval(window.myInterval2);
        clearInterval(window.myInterval3);
        clearInterval(window.myInterval4);
        */
        const info = await App.firebase.getUserInfo(user.uid);
        const timestamp = String(Date.now())
        const gamecode = info.lobbycode;
        const useruid = info.uid;
        const result = info.type == "tikker" ? "lost" : "won";
        const gameRef = App.firebase.getFirestore().collection('game').doc(gamecode);
        const userRef = App.firebase.getFirestore().collection('users').doc(useruid);
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yyyy = today.getFullYear();

        const vandaag = mm + '/' + dd + '/' + yyyy;
      
        if(info.team == "admin"){
        const setGameWithMerge = gameRef.set({
          result: 'stopped',
        }, { merge: true });

        } else if(info.team == "speler"){
          App.firebase.leaveGame(useruid)
        }
      }
    });
    App.router.navigate('homepage');
  });

  // make a timer for the game
};
