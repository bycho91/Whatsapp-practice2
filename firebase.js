import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyCi6wF7W0ddspR5WnjXWsBo12MVXsQoEM0",
  authDomain: "whatsapp-1acdf.firebaseapp.com",
  projectId: "whatsapp-1acdf",
  storageBucket: "whatsapp-1acdf.appspot.com",
  messagingSenderId: "333507718120",
  appId: "1:333507718120:web:b4c7c2d26f6f03f5d9925d",
};

const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };
