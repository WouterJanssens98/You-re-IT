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

    /*
    function getGameStatus(gamecode){
      const gameRef = App.firebase.getFirestore().collection('game').doc(gamecode)
      gameRef.get()
      .then((docSnapshot) => {
        if (docSnapshot.exists) {
          gameRef.onSnapshot((doc) => {
            const status = doc.data().result;
            if(status === "stopped"){
              App.firebase.leaveGame(info.uid);
              window.alert("This game has been stopped by the host")
            }
          });
        }
      });
    };
    */
    
    const host = await App.firebase.isAdmin(gamecode,useruid)
    if(host){
      gamestatus.innerHTML = "Waiting for you to start the game";
      quitGame.innerHTML = "      End game"
    }


    getCurrentPlayers(gamecode)
    // getGameStatus(gamecode)



    document.getElementById('leave').addEventListener('click', () => {
      if(host){
        const gameRef = App.firebase.getFirestore().collection('game').doc(gamecode);
        const setWithMerge = gameRef.set({
          result: 'stopped',
        }, { merge: true });
        
      }
      App.firebase.leaveGame(info.uid);
        
      

      // check if firestore entry exists
      
    });
}})};