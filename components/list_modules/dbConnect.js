import firebase from 'react-native-firebase';
//import firebase from 'firebase';
/*const config = {
  apiKey: "AIzaSyAclTSyGHh87Eb1OU8qUVqFiv2MEWb0vEY",
  authDomain: "test2-4c808.firebaseapp.com",
  databaseURL: "https://test2-4c808.firebaseio.com",
  projectId: "test2-4c808",
  storageBucket: "test2-4c808.appspot.com",
  messagingSenderId: "46641922343",
  appId: "1:46641922343:web:3c8867b7205669922fa902",
  measurementId: "G-F5F0T9K4ZQ"
};*/
//let app = firebase.initializeApp(config);
/*const app = !firebase.apps.length ? firebase.initializeApp(config) : firebase.app();
export const db = app.database();*/
export const db = firebase.database();