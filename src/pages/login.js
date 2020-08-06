/* eslint-disable no-alert */
/* eslint-disable no-unused-vars */
/**
 * The Login Page
 */


import * as firebase from 'firebase/app';
import App from '../lib/App';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';

const homeTemplate = require('../templates/login.hbs');

export default () => {
  // set the title of this page
  const title = 'Login';

  // render the template
  App.render(homeTemplate({ title }));


  // login met google account
  const provider = new firebase.auth.GoogleAuthProvider();

  function loginUserGoogle() {
    App.firebase.getAuth().signInWithPopup(provider).then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const token = result.credential.accessToken;
      // The signed-in user info.
      const user = result;
      App.router.navigate('/homepage');
      // ...
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const { email } = error;
      // The firebase.auth.AuthCredential type that was used.
      const { credential } = error;
      // ...
    });
  }

  // login met email en wachtwoord

  // eslint-disable-next-line no-unused-vars
  function loginUser() {
    // eslint-disable-next-line no-unused-vars
    const email = document.getElementById('login_email').value;
    const password = document.getElementById('login_password').value;

    App.firebase.getAuth().signInWithEmailAndPassword(email, password).catch((error) => {
      // eslint-disable-next-line no-unused-vars
      const errorCode = error.code;
      const errorMessage = error.message;
      // eslint-disable-next-line no-alert
      if (errorCode === 'auth/wrong-password') {
        window.alert(`There has been an error! ${errorMessage}`);
        App.router.navigate('/login');
        document.getElementById('login_password').value = '';
      } else {
        // Succes
      }
      App.router.navigate('/homepage');
    });
  }

  // firestore updaten met user indien nog niet in systeem


  document.getElementsByClassName('a-button_loginbutton')[0].addEventListener('click', () => {
    loginUser();
  });

  document.getElementsByClassName('a-button_loginbuttongoogle')[0].addEventListener('click', () => {
    loginUserGoogle();
  });
};
