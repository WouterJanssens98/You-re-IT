/* eslint-disable no-alert */
/* eslint-disable no-unused-vars */
/**
 * The Lobby page
 */


import * as firebase from 'firebase/app';
import App from '../lib/App';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';
import Router from '../lib/core/Router';
import * as consts from '../consts';
import Dataseeder from '../lib/core/dataseeder';
import game from './game';
import player from './player';



const homeTemplate = require('../templates/lobby.hbs');

export default () => {
  // set the title of this page
  const title = 'Pre Game Lobby';

  // render the template
  App.render(homeTemplate({ title }));

  App.firebase.isLoggedIn();
  


  App.firebase.getAuth().onAuthStateChanged(async (user) => {
    if (user) {
    
    const info = await App.firebase.getUserInfo(user.uid);
    
    const gamecode = info.lobbycode;
    const useruid = info.uid;
    const playerdiv = document.getElementsByClassName('o-lobbyform')[0];
    const title = document.getElementsByClassName('m-landing__subtitle2')[0];
    const gamestatus = document.getElementsByClassName('m-landing__subtitle3')[0];
    const quitGame = document.getElementById('leavetext');
    title.innerHTML += ` (${gamecode})`;

    App.firebase.getGameStatus(gamecode,useruid);


    function getCurrentPlayers(gamecode){
        App.firebase.getFirestore().collection("users").where("lobbycode", "==", gamecode)
        .onSnapshot(function(querySnapshot) {
        playerdiv.innerHTML ="";
        var users = [];
        querySnapshot.forEach(function(doc) {
            users.push(doc.data());
            const line = document.createElement('div');
            const p1 = document.createElement('p');
            const p2 = document.createElement('p');
            line.className = "m-history-game";
            p1.className = "a-history-game_header";
            p2.className = "a-history-result_header"
            p1.innerHTML = doc.data().team
            p2.innerHTML = doc.data().name
            line.appendChild(p1)
            line.appendChild(p2)
            playerdiv.appendChild(line)
        });
        
        });

    };

    
    
    const host = await App.firebase.isAdmin(gamecode,useruid)
    if(host){
      gamestatus.innerHTML = "Waiting for you to start the game";
      quitGame.innerHTML = "      End game";
      document.getElementsByClassName('o-lobbyform2')[0].style.visibility = 'visible';
    }


    getCurrentPlayers(gamecode);
    
    
    
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

   window.myInterval5 = setInterval(update,2500)
    

    document.getElementById('leave').addEventListener('click', () => {
      if(host){
        const gameRef = App.firebase.getFirestore().collection('game').doc(gamecode);
        const setWithMerge = gameRef.set({
          result: 'stopped',
        }, { merge: true });
        
      }
      App.firebase.leaveGame(info.uid);
    });
    

    document.getElementsByClassName('o-lobbyform2')[0].addEventListener('click', () => {
      const router = new Router(window.location.origin, consts.ROUTER_HASH);
      const gameRef = App.firebase.getFirestore().collection('game').doc(gamecode);
        const setWithMerge = gameRef.set({
          result: 'running',
          tikker: useruid,
          cooldown : 'inactive'
        }, { merge: true });
      setTimeout(() => { router.navigate('/mapbox'); }, 500)
    })

    const copyBtn = document.getElementById('copy')

    copyBtn.onclick = function() {
      document.execCommand("copy")
    }
    copyBtn.addEventListener("copy", function(event) {
      event.preventDefault();
      if (event.clipboardData) {
        event.clipboardData.setData("text/plain", gamecode);
       alert(`Copied invite code : ${event.clipboardData.getData("text")}`)

      }
    });


}})};

