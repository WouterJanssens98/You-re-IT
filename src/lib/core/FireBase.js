/**
 * A FireBase Wrapper
 * docs: https://firebase.google.com/docs
 *
 * @author Tim De Paepe <tim.depaepe@arteveldehs.be>
 */

import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
<<<<<<< HEAD
=======
import 'firebase/analytics';
import Router from './Router';
import * as consts from '../../consts';
>>>>>>> Added Password check, better Redirect if not logged in, Pre Game Lobby for player

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

  leaveGame(uid) {
    const gameRef = this.getFirestore().collection("users").doc(uid);

    const setWithMerge = gameRef.set({
      lobbycode: ""
    }, { merge: true });
  
  }
}

export default FireBase;
