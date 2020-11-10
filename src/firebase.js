import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyAdcyM4QE7qxQC98H850C-QV4RCFkbMa_Y",
  authDomain: "instagram-clone-30ad3.firebaseapp.com",
  databaseURL: "https://instagram-clone-30ad3.firebaseio.com",
  projectId: "instagram-clone-30ad3",
  storageBucket: "instagram-clone-30ad3.appspot.com",
  messagingSenderId: "146636573079",
  appId: "1:146636573079:web:005500b237b4d7479f5cd2",
  measurementId: "G-MYT35G7PKM"
});
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

  export  {db , auth , storage};
  