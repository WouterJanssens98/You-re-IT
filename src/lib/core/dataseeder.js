import App from '../App';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';

class Dataseeder {
  randomInviteCode() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let invitecode = '';
    for (let i = 0; i < 5; i++) {
      invitecode += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    return invitecode;
  }

  playerLocation(uid) {
    const locationRef = App.firebase.getFirestore().collection('users').doc(uid);
    // eslint-disable-next-line no-unused-vars
    return new Promise(((resolve, reject) => {
      locationRef.get()
        .then((docSnapshot) => {
          if (docSnapshot.exists) {
            locationRef.onSnapshot((doc) => {
              const value = doc.get('location');
              resolve(value);
            });
          }
        });
    }));
  }

  changeLocation(value) {
    let p = +value;
    let rnd1 = Math.floor(Math.random() * 11) - 5;
    rnd1 *= 0.00008;
    p += rnd1;
    return p;
  }
}

export default Dataseeder;
