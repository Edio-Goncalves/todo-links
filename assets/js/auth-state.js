firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    window.location.href = "/pages/home.html";
  }
});
