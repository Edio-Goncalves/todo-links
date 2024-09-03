const form = {
  logout: () => document.querySelector("#logout"),
  send: () => document.querySelector("#send"),
  tbody: () => document.querySelector("#tbody"),
  link: () => document.querySelector("#link"),
  linkName: () => document.querySelector("#name"),
  tagName: () => document.querySelector("#tag"),
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
      alert("erro ao fazer logout");
    });
});

/* envia cadastro */
form.send().addEventListener("click", (e) => {
  e.preventDefault();
  saveRegister();
});

/* coleta cadastro */
function saveRegister() {
  showLoading();
  const register = createCadastro();

  firebase
    .firestore()
    .collection("todolinks")
    .add(register)
    .then(() => {
      hideLoading();
      addTodolinkToScreen(register);
      clearForm();
    })
    .catch(() => {
      hideLoading();
      alert("erro ao salvar link cadastrado");
    });
}

function createCadastro() {
  return {
    link: form.link().value,
    linkName: form.linkName().value,
    tag: form.tagName().value,
    user: {
      uid: firebase.auth().currentUser.uid,
    },
  };
}

/* Confere usuarios */
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    findTodolinks(user);
  }
});

/* firestone.data */
function findTodolinks(user) {
  showLoading();
  firebase
    .firestore()
    .collection("todolinks")
    .where("user.uid", "==", user.uid)
    .orderBy("linkName", "asc")
    .get()
    .then((snapshot) => {
      hideLoading();
      const todoLinksData = snapshot.docs.map((doc) => doc.data());
      addTodolinksToScreen(todoLinksData);
    })
    .catch((error) => {
      hideLoading();
      console.log(error);
      alert("Erro ao recuperar links do banco de dados");
    });
}

/* imprime os dados */
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

/* Adiciona um único link na tela */
function addTodolinkToScreen(e) {
  const table = form.tbody();

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
}

/* Limpa o formulário */
function clearForm() {
  form.link().value = "";
  form.linkName().value = "";
  form.tagName().value = "";
}
