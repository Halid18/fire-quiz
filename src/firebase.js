import firebase from '@firebase/app';
import '@firebase/auth';
import '@firebase/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyDcFTV2SdcrJ9BEE9IzN9G4BjU97jiz6vY",
  authDomain: "fire-quiz-16ce0.firebaseapp.com",
  databaseURL: "https://fire-quiz-16ce0.firebaseio.com",
  projectId: "fire-quiz-16ce0",
  storageBucket: "fire-quiz-16ce0.appspot.com",
  messagingSenderId: "1066154044609"
});

export default firebase;