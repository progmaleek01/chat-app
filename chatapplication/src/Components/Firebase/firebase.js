import firebase from "@firebase/app";
require("@firebase/auth");
require("@firebase/firestore");
require("@firebase/storage");

const firebaseConfig = {
  apiKey: "AIzaSyBNnXTtuGV3BMFTaI09eyLyZhknD3rm7yk",
  authDomain: "chat-app-72544.firebaseapp.com",
  projectId: "chat-app-72544",
  storageBucket: "chat-app-72544.appspot.com",
  messagingSenderId: "589641534736",
  appId: "1:589641534736:web:b3e9b7260a72d65d436995",
  measurementId: "G-P3FBX8K6Y0",
};

firebase.initializeApp(firebaseConfig);

export default firebase;
