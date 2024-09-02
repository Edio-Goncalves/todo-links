const firebaseConfig = {
  apiKey: "AIzaSyBMaH9kpG7YeadV53rSX_iHYVdzyVOXJK8",
  authDomain: "login-2b477.firebaseapp.com",
  projectId: "login-2b477",
  storageBucket: "login-2b477.appspot.com",
  messagingSenderId: "809242408627",
  appId: "1:809242408627:web:5219ad64cb35cd0584e2c6",
};
firebase.initializeApp(firebaseConfig);

// /* manter usuario logado caso ja tenha logado */
// firebase.auth().onAuthStateChanged((user) => {
//   if (user) {
//     window.location.href = "/pages/home.html";
//   }
// });
