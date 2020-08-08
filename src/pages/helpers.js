import * as firebase from 'firebase/app';
import App from '../lib/App';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';




function help(userUID){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          return true
          console.log("user is signed in!")
          var displayName = user.displayName;
          var email = user.email;
          var emailVerified = user.emailVerified;
          var photoURL = user.photoURL;
          var isAnonymous = user.isAnonymous;
          var uid = user.uid;
          var providerData = user.providerData;
          // ...
        } else {
          // User is signed out.
        }
      });
}




function addUser(name, location, lobbycode, uid, team) {
    const usersRef = App.firebase.getFirestore().collection('users').doc(userUID);
    usersRef.set({
        name,
        long,
        lat,
        lobbycode,
        uid,
        team,
    })
}

