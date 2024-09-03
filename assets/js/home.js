const form = {
  logout: () => document.querySelector("#logout"),
  send: () => document.querySelector("#send"),
  tbody: () => document.querySelector("#tbody"),
  link: () => document.querySelector("#form-link"),
  linkName: () => document.querySelector("#form-name"),
  tagName: () => document.querySelector("#form-tag"),
  tagList: () => [...document.querySelectorAll(".tag")],
  editList: () => [...document.querySelectorAll(".edit")],
  deleteList: () => [...document.querySelectorAll(".delete")],
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
      const todoLinksData = snapshot.docs.map((doc) => ({
        ...doc.data(),
        uid: doc.id,
      }));
      addTodolinksToScreen(todoLinksData);
    })
    .catch((error) => {
      hideLoading();
      console.log(error);
      alert("Erro ao recuperar links do banco de dados");
    });
}

/* Adiciona o evento de clique para abrir um modal ao clicar em "edit" */
function addEditEventListeners() {
  const modal = document.getElementById("editModal");
  const closeModal = document.querySelector(".close");

  form.editList().forEach((editButton) => {
    editButton.addEventListener("click", () => {
      const row = editButton.closest("tr");

      // Armazena o ID do documento Firestore para posterior atualização
      const uid = row.dataset.uid;

      const linkName = row.querySelector("a").textContent;
      const tag = row.querySelector(".tag").textContent;

      document.getElementById("editLinkName").value = linkName;
      document.getElementById("editTag").value = tag;

      modal.dataset.uid = uid; // Armazena o ID do documento no modal
      modal.style.display = "block";
    });
  });

  // Fecha o modal ao clicar no "x"
  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Fecha o modal se clicar fora do conteúdo
  window.addEventListener("click", (event) => {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });

  // Adiciona o evento de clique para exclusão
  form.deleteList().forEach((deleteButton) => {
    deleteButton.addEventListener("click", () => {
      const row = deleteButton.closest("tr");
      const uid = row.dataset.uid;

      const confirmDelete = confirm(
        "Tem certeza de que deseja deletar este link?"
      );
      if (confirmDelete) {
        deleteTodolink(uid, row);
      }
    });
  });
}

/* Função para deletar o link do Firestore e da tela */
function deleteTodolink(uid, row) {
  showLoading();
  firebase
    .firestore()
    .collection("todolinks")
    .doc(uid)
    .delete()
    .then(() => {
      hideLoading();
      alert("Link deletado com sucesso!");
      row.remove();
    })
    .catch((error) => {
      hideLoading();
      console.error("Erro ao deletar link: ", error);
      alert("Erro ao deletar o link");
    });
}

/* Atualiza os dados no Firestore */
document.getElementById("editForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const modal = document.getElementById("editModal");
  const uid = modal.dataset.uid;

  const updatedLinkName = document.getElementById("editLinkName").value;
  const updatedTag = document.getElementById("editTag").value;

  showLoading();
  firebase
    .firestore()
    .collection("todolinks")
    .doc(uid)
    .update({
      linkName: updatedLinkName,
      tag: updatedTag,
    })
    .then(() => {
      hideLoading();
      alert("Link atualizado com sucesso!");

      // Atualiza a exibição da tabela
      const row = document.querySelector(`tr[data-uid="${uid}"]`);
      row.querySelector("a").textContent = updatedLinkName;
      row.querySelector(".tag").textContent = updatedTag;

      modal.style.display = "none";
    })
    .catch((error) => {
      hideLoading();
      console.error("Erro ao atualizar link: ", error);
      alert("Erro ao atualizar o link");
    });
});

/* imprime os dados */
function addTodolinksToScreen(linksTodo) {
  const table = form.tbody();

  linksTodo.forEach((e) => {
    const newRow = document.createElement("tr");
    newRow.dataset.uid = e.uid; // Armazena o ID do documento Firestore na linha
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
  addEditEventListeners();
}

/* Adiciona um único link na tela */
function addTodolinkToScreen(e) {
  const table = form.tbody();

  const newRow = document.createElement("tr");
  newRow.dataset.uid = e.uid; // Armazena o ID do documento Firestore na linha
  newRow.innerHTML = `
    <th>
      <a href="${e.link}" target="_blank">${e.linkName}</a>
    </th>
    <th class="tag">${e.tag}</th>
    <th class="edit">✏️</th>
    <th class="delete">🗑️</th>
  `;
  table.appendChild(newRow);
  addEditEventListeners();
}
