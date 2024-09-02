const form = {
  logout: () => document.querySelector("#logout"),
  send: () => document.querySelector("#send"),
  tbody: () => document.querySelector("#tbody"),
};
const logout = document.querySelector("#logout");

/* desloga usuario */
logout.addEventListener("click", () => {
  firebase
    .auth()
    .signOut()
    .then(() => {
      window.location.href = "../../index.html";
    })
    .catch(() => {
      alert("erro aou fazer logout");
    });
});

/* Confere usuarios */
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    findTodolinks(user);
  }
});

/* firestone.data */

function findTodolinks(user) {
  firebase
    .firestore()
    .collection("todolinks")
    .where("user.uid", "==", user.uid)
    .get()
    .then((snapshot) => {
      const todoLinksData = snapshot.docs.map((doc) => doc.data());
      addTodolinksToScreen(todoLinksData);
    });
}

/*  imprime os dados */
function addTodolinksToScreen(linksTodo) {
  const table = form.tbody();

  linksTodo.forEach((e) => {
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
      <th>
        <a href="${e.link}" target="_blank">${e.linkName}</a>
      </th>
      <th class="tag">${e.tag}</th>
      <th class="edit">✏️</th>
      <th class="delete">🗑️</th>
    `;
    table.appendChild(newRow);
  });
}
