import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDuc69bJqHKX9IJgEkrcD-w3G-XhqfW6Ms",
  authDomain: "test121-9d197.firebaseapp.com",
  projectId: "test121-9d197",
  storageBucket: "test121-9d197.appspot.com",
  messagingSenderId: "443185831054",
  appId: "1:443185831054:web:6cd10fb292c5838003fddf",
  measurementId: "G-SCR6DLE4PL",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export default storage;

// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyDuc69bJqHKX9IJgEkrcD-w3G-XhqfW6Ms",
//   authDomain: "test121-9d197.firebaseapp.com",
//   projectId: "test121-9d197",
//   storageBucket: "test121-9d197.appspot.com",
//   messagingSenderId: "443185831054",
//   appId: "1:443185831054:web:6cd10fb292c5838003fddf",
//   measurementId: "G-SCR6DLE4PL"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
