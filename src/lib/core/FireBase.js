/**
 * A FireBase Wrapper
 * docs: https://firebase.google.com/docs
 *
 * @author Tim De Paepe <tim.depaepe@arteveldehs.be>
 */

import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';
import Router from './Router';
import * as consts from '../../consts';

class FireBase {
  constructor(apiKey, projectId, messagingSenderId) {
    this.apiKey = apiKey;
    this.projectId = projectId;
    this.messagingSenderId = messagingSenderId;
    this.initializeApp();
  }

  initializeApp() {
    firebase.initializeApp(this.getFireBaseConfig());
  }

  getFireBaseConfig() {
    return {
      apiKey: `${this.apiKey}`,
      authDomain: `${this.projectId}.firebaseapp.com`,
      databaseURL: `https://${this.projectId}.firebaseio.com`,
      projectId: `${this.projectId}`,
      storageBucket: `${this.projectId}.appspot.com`,
      messagingSenderId: `${this.messagingSenderId}`,
      appId: process.env.FIREBASE_CONFIG_WEB_APP_ID,
    };
  }

  getFirestore() {
    return firebase.firestore();
  }

  getAuth() {
    return firebase.auth();
  }

  isLoggedIn() {
    if (this.getAuth().currentUser == null) {
      const router = new Router(window.location.origin, consts.ROUTER_HASH);
      router.navigate('/game');
    }
  }

  getUserInfo(uid) {
    const locationRef = this.getFirestore().collection('users').doc(uid);
    return new Promise(((resolve, reject) => {
      locationRef.get()
        .then((docSnapshot) => {
          if (docSnapshot.exists) {
            locationRef.onSnapshot((doc) => {
              const value = doc.data();
              // const value = doc.get('lobbycode');
              resolve(value);
            });
          }
        });
    }));
  }

  isAdmin(gamecode,useruid){
    const docRef = this.getFirestore().collection("game").doc(gamecode)
    return new Promise(((resolve, reject) => {
      docRef.get().then(function(doc) {
        if (doc.exists) {
            if(useruid === doc.data().host){
              resolve(true);
            } else {
              resolve(false);
            }
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
      }).catch(function(error) {
        console.log("Error getting document:", error);
      });
    }));
   
}

  leaveGame(uid) {
    const gameRef = this.getFirestore().collection("users").doc(uid);
    const router = new Router(window.location.origin, consts.ROUTER_HASH);
    const setWithMerge = gameRef.set({
      lobbycode: ""
    }, { merge: true });
    setTimeout(router.navigate('/homepage'),1000);
  
  }

  getGameStatus(gamecode,uid){
    const gameRef = this.getFirestore().collection('game').doc(gamecode)
    gameRef.get()
    .then((docSnapshot) => {
      if (docSnapshot.exists) {
        gameRef.onSnapshot((doc) => {
          const status = doc.data().result;
          if(status === "stopped"){
            this.leaveGame(uid);
            window.alert("This game has been stopped by the host")
          }
        });
      }
    });
  };


}

export default FireBase;
