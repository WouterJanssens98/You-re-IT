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

  async getUserInfo(uid) {
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

  async isAdmin(gamecode,useruid){
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
    setTimeout(() => { router.navigate('/homepage'); }, 500)
  
  }

  async setGameHistory(uid){
    const info = await this.getUserInfo(uid);
    const timestamp = String(Date.now())
    const gamecode = info.lobbycode;
    const useruid = info.uid;
    const result = info.type == "tikker" ? "lost" : "won";
    const historyRef = this.getFirestore().collection('history').doc(timestamp);
    const userRef = this.getFirestore().collection('users').doc(useruid);
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();

    const vandaag = mm + '/' + dd + '/' + yyyy;


    const setHistoryWithMerge = historyRef.set({
      result : result,
      user : useruid,
      date : vandaag
    });

    const setUserWithMerge = userRef.set({
      lobbycode: '',
      team : '',
      type : ''
    }, { merge: true });
    
  }

  

  getGameStatus(gamecode,uid){
    const gameRef = this.getFirestore().collection('game').doc(gamecode)
    const router = new Router(window.location.origin, consts.ROUTER_HASH);
    gameRef.get()
    .then((docSnapshot) => {
      if (docSnapshot.exists) {
        gameRef.onSnapshot((doc) => {
          const status = doc.data().result;
          if(status === "stopped"){
            window.alert("This game has been stopped by the host")
            this.setGameHistory(uid)
            this.leaveGame(uid);
          }
          else if(status === "running"){
            setTimeout(() => { router.navigate('/mapbox'); }, 500)
          }
          else if(status === "finished"){
            window.alert("The game has finished. Thanks for playing!")
            this.setGameHistory(uid)
            setTimeout(() => { router.navigate('/homepage'); }, 500)
          }
          else if(status === "created"){
            // do nothing, game was just created
          }
        });
      }
    });
  };

 

  async getUserLocation(uid){
    const userRef = this.getFirestore().collection('users').doc(uid)
    return new Promise(((resolve, reject) => {
      userRef.get()
        .then((docSnapshot) => {
          if (docSnapshot.exists) {
            userRef.onSnapshot((doc) => {
              const value = doc.data();
              resolve(value);
            });
          }
        });
    }));
    
  }


  updateUserLocation(lat,long,uid) {
    const userRef = this.getFirestore().collection('users').doc(uid)
    const setWithMerge = userRef.set({
      lat: lat,
      long: long
    }, { merge: true });
  }


  updatePosition(gamecode,uid, long, lat){
    const gameRef = this.getFirestore().collection('game').doc(gamecode)
    gameRef.get()
    .then((docSnapshot) => {
      if (docSnapshot.exists) {
        gameRef.onSnapshot((doc) => {
          const status = doc.data().result;
          if(status === "created"){
            this.updateUserLocation(lat,long,uid)
          } else if(status === "running"){
            this.updateUserLocation(lat,long,uid)
          }
        });
      }
    });
  };

  async getGameInfo(a) {
    const newRef = this.getFirestore().collection('game').doc(a);
    return new Promise(((resolve, reject) => {
      newRef.get()
        .then((docSnapshot) => {
          if (docSnapshot.exists) {
            newRef.onSnapshot((doc) => {
              const value = doc.data();
              resolve(value);
            });
          }
        });
    }));
  }

  

 




  }

export default FireBase;
