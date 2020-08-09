/**
 * The History Page
 */

import { SITE_TITLE } from '../consts';
import App from '../lib/App';



const homeTemplate = require('../templates/history.hbs');

export default () => {
  // set the title of this page
  const title = `${SITE_TITLE} is ready to go!`;

  // render the template
  App.render(homeTemplate({ title }));

  App.firebase.isLoggedIn();

  App.firebase.getAuth().onAuthStateChanged(async (user) => {
    if (user) {
    
    const historyDiv = document.getElementsByClassName('o-historyform-4')[0]
    
    function getGameHistory(uid){
        App.firebase.getFirestore().collection("history").where("user", "==", uid)
        .onSnapshot(function(querySnapshot) {
        historyDiv.innerHTML ="";
        const games = []
        const wins = []
        const losses = []
        querySnapshot.forEach(function(doc) {
            if(doc.data().result == "lost"){
            losses.push(doc.data())
            } else if(doc.data().result == "won"){
            wins.push(doc.data())
            }
            games.push(doc.data());
            const line = document.createElement('div');
            const p1 = document.createElement('p');
            const p2 = document.createElement('p');
            line.className = "m-history-game";
            p1.className = "a-history-game_header";
            p2.className = "a-history-result_header"
            p1.innerHTML = doc.data().date
            p2.innerHTML = doc.data().result
            line.appendChild(p1)
            line.appendChild(p2)
            historyDiv.appendChild(line)
        });
        const winratio = Math.floor((wins.length / (wins.length + losses.length)) * 100);
        document.getElementById('count').innerHTML = `Games played : ${games.length}`
        document.getElementById('ratio').innerHTML = `${winratio}% win ratio`
        
        });

    };

    
    getGameHistory(user.uid)

    

}}
  
)};
