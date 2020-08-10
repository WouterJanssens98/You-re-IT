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

  async setGameHistory(uid,status){
    const info = await this.getUserInfo(uid);
    const gamecode = info.lobbycode;
    const useruid = info.uid;
    const historyName = `${gamecode}-${useruid}`

    const historyRef = this.getFirestore().collection('history').doc(historyName);
    const userRef = this.getFirestore().collection('users').doc(useruid);
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();

    const vandaag = mm + '/' + dd + '/' + yyyy;

    if(status == "finished"){
      const result = info.type == "tikker" ? "lost" : "won";
      const setHistoryWithMerge = await historyRef.set({
        result : result,
        user : useruid,
        date : vandaag
      });
  
    } else if (status == "stopped"){
      const result = info.team == "admin" ? "lost" : "won";
      const setHistoryWithMerge = await historyRef.set({
        result : result,
        user : useruid,
        date : vandaag
      });
  
    }
    const setUserWithMerge = userRef.set({
      lobbycode: '',
      team : '',
      type : ''
    }, { merge: true });
    
  }

  async getGameHistory(uid){
    const userRef = this.getFirestore().collection('history').where("user", "==", uid)
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

  async setPlayerType(uid, type){
    const userRef = this.getFirestore().collection('users').doc(uid)
    const setGameWithMerge = userRef.set({
      type : type
    }, { merge: true });
  }

  

  getGameStatus(gamecode,uid){
    const gameRef = this.getFirestore().collection('game').doc(gamecode)
    const router = new Router(window.location.origin, consts.ROUTER_HASH);
    gameRef.get()
    .then((docSnapshot) => {
      if (docSnapshot.exists) {
        gameRef.onSnapshot(async (doc) => {
          const status = doc.data().result;
          if(status === "stopped"){
            window.alert("This game has been stopped by the host")
            await this.setGameHistory(uid,status)
            this.leaveGame(uid)
           
          }
          else if(status === "running"){
            setTimeout(() => { router.navigate('/mapbox'); }, 500)
          }
          else if(status === "finished"){
            window.alert("The game has finished. Thanks for playing!")
            this.setGameHistory(uid,status)
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

  async CheckDistanceToTikker(lat1, lon1, lat2, lon2, unit){
    console.log(lat1, lon1, lat2, lon2, unit)
    if ((lat1 == lat2) && (lon1 == lon2)) {
      return 9999;
    }
    else {
      var radlat1 = Math.PI * lat1/180;
      var radlat2 = Math.PI * lat2/180;
      var theta = lon1-lon2;
      var radtheta = Math.PI * theta/180;
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180/Math.PI;
      dist = dist * 60 * 1.1515;
      console.log(`Distance between :${dist}`);
      if (unit=="K") { dist = dist * 1.609344 }
      if (unit=="N") { dist = dist * 0.8684 }
      return dist;
    }
  }
  async makePlayerTikker(gamecode,uid){
    const gameData = await this.getGameInfo(gamecode);
    const userInfo = await this.getUserInfo(uid)
    const oldTikker = gameData.tikker;
    const oldInfo = await this.getUserInfo(oldTikker)
    const gameRef = this.getFirestore().collection('game').doc(gamecode)
    const oldTikkerRef = this.getFirestore().collection('users').doc(oldTikker)
    const newTikkerRef = this.getFirestore().collection('users').doc(uid)


    const setOldTikkerWithMerge = oldTikkerRef.set({
      type : 'speler'
    }, { merge: true });
    

    const setGameWithMerge = gameRef.set({
      tikker : uid,

    }, { merge: true });

    await this.setPlayerType(uid, 'tikker')
    alert(`${oldInfo.name} heeft jou getikt! Jij bent aan de beurt.`)
    console.log(`Nieuwe tikker! : ${userInfo.name}`)
    setTimeout(() => { this.deactivateCooldown(gamecode) }, 10000)

  }

  async updateUserLocation(gamecode,lat,long,uid) {
    const userRef = this.getFirestore().collection('users').doc(uid)
    const gameRef = this.getFirestore().collection('game').doc(gamecode)
    const info = await this.getGameInfo(gamecode);
    const info2 = await this.getUserInfo(uid)
    const setGameMerge = userRef.set({
      long : long,
      lat : lat
    }, { merge: true });
  }

  async deactivateCooldown(gamecode) {
    console.log("Deactivating cooldown...")
    const gameRef = this.getFirestore().collection('game').doc(gamecode)
    const setNewestMerge = gameRef.set({
      cooldown : 'inactive'
    }, { merge: true });
  }
  async isTikked(gamecode,uid){
    const gameRef = this.getFirestore().collection('game').doc(gamecode)
    const userRef = this.getFirestore().collection('game').doc(uid)
    const user = await this.getUserInfo(uid);
    const tikker = await this.getGameInfo(gamecode);
    const tikkerLong = tikker.tikkerLong;
    const tikkerLat = tikker.tikkerLat;
    const type = user.type;
    const userLong = user.long;
    const userLat = user.lat;
    const distance = await this.CheckDistanceToTikker(userLat,userLong, tikkerLat, tikkerLong, "K")
    if(type == "tikker"){
      const setGameMerge = gameRef.set({
        tikkerLat : userLat,
        tikkerLong : userLong
      }, { merge: true });
      
      if(distance < 10){
        if(tikker.cooldown == "inactive"){
          window.alert(`Proficiat! Je hebt een medespeler kunnen tikken`)
        } else {
          console.log("Cooldown is active for tikker...")
        }
      }      
    }else if(type == "speler"){
      if(distance < 10){
        if(tikker.cooldown == "active"){
          console.log("Cooldown is active for speler...")
        }else if (tikker.cooldown == "inactive"){
          console.log("getikt...")
          const setNewMerge = gameRef.set({
            tikkerLat : userLat,
            tikkerLong : userLong,
            cooldown : 'active'
          }, { merge: true });

          const setNewestMerge = userRef.set({
            type : 'tikker'
          }, { merge: true });

          this.makePlayerTikker(gamecode,uid)
        }
      }
    }
  }

  


  clearUserLocation(uid) {
    const userRef = this.getFirestore().collection('users').doc(uid)
    const setWithMerge = userRef.set({
      lat: '',
      long: ''
    }, { merge: true });
  }



  updatePosition(gamecode,uid, long, lat){
    console.log(`Long and lat is : ${long} , ${lat}`);
    const gameRef = this.getFirestore().collection('game').doc(gamecode)
    gameRef.get()
    .then((docSnapshot) => {
      if (docSnapshot.exists) {
        gameRef.onSnapshot((doc) => {
          const status = doc.data().result;
          if(status === "created"){
            this.updateUserLocation(gamecode,lat,long,uid)
          } else if(status === "running"){
            this.updateUserLocation(gamecode,lat,long,uid)
          } else if (status === "finished"){
            this.clearUserLocation(uid)
          } else {
            // do nothing, not in game nor in lobby
          }
        });
      }
    });
  };

  async getGameInfo(a){
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
