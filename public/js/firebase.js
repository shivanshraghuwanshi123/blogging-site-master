
let firebaseConfig = {
  apiKey: "AIzaSyB7vOkScbXjV5nFZLF0Ekc_bTczGw4eKZY",
  authDomain: "blooging-website-48933.firebaseapp.com",
  projectId: "blooging-website-48933",
  storageBucket: "blooging-website-48933.firebasestorage.app",
  messagingSenderId: "326035765666",
  appId: "1:326035765666:web:03b12839c8e7aec7585afb"
};
// Initialize Firebase
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

let db= firebase.firestore();

let auth = firebase.auth();
const logoutUser=()=>{
auth.signOut();
location.reload();
}