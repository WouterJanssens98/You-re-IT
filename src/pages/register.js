/* eslint-disable no-unused-vars */
/**
 * The Register Page
 */


import * as firebase from 'firebase/app';
import App from '../lib/App';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';



const homeTemplate = require('../templates/register.hbs');

export default () => {
  // set the title of this page
  const title = 'Register';

  // render the template
  App.render(homeTemplate({ title }));
 
  // eslint-disable-next-line no-unused-vars
  function createUser() {
    // eslint-disable-next-line no-unused-vars
    const name = document.getElementById('input_name').value;
    const email = document.getElementById('input_email').value;
    const password1 = document.getElementById('input_password1').value;
    const password2 = document.getElementById('input_password2').value;

    if (password1.length >= 6 && password1 == password2) {
      App.firebase.getAuth().createUserWithEmailAndPassword(email, password1).catch((error) => {
      // eslint-disable-next-line no-unused-vars
        const errorCode = error.code;
        const errorMessage = error.message;
        // eslint-disable-next-line no-alert
        App.router.navigate('/register');
        // eslint-disable-next-line no-alert
        window.alert(`There has been an error! : ${errorCode} - ${errorMessage}`);
      });
    } else {
      // eslint-disable-next-line no-alert
      if(password1.length < 6){
        window.alert('Password has to be at least 6 digits long!');
        App.router.navigate('/register');
        document.getElementById('input_password1').value = '';
        document.getElementById('input_password2').value = '';
      } else if(password1 !== password2){
        window.alert("Passwords don't match!");
        App.router.navigate('/register');
        document.getElementById('input_password1').value = '';
        document.getElementById('input_password2').value = '';
      }
    }
  }

  

  document.getElementsByClassName('a-button_createbutton')[0].addEventListener('click', () => {
    createUser();
  });
};
