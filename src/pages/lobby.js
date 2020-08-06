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
    const playerdiv = document.getElementsByClassName('o-historyform')[0];
    const title = document.getElementsByClassName('m-landing__subtitle')[0];
    title.innerHTML += ` (${gamecode})`;
    
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

    getCurrentPlayers(gamecode)

    document.getElementById('leave').addEventListener('click', () => {
        App.firebase.leaveGame(info.uid);
        
      

      // check if firestore entry exists
      
    });
}})};