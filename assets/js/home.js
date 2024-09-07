const form = {
  notificationField: () => document.querySelector("#notificationField"),
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
      showNotification("Erro ao fazer logout", "error");
    });
});

/* Validação do formulário */
function validateForm() {
  if (
    !form.link().value.trim() ||
    !form.linkName().value.trim() ||
    !form.tagName().value.trim()
  ) {
    showNotification("Todos os campos são obrigatórios.", "error");
    return false;
  }
  return true;
}

/* envia cadastro */
form.send().addEventListener("click", (e) => {
  e.preventDefault();
  saveRegister();
});

/* coleta cadastro */
function saveRegister() {
  if (!validateForm()) {
    return; // Sai da função se a validação falhar
  }

  showLoading();
  const register = createCadastro();

  firebase
    .firestore()
    .collection("todolinks")
    .add(register)
    .then((docRef) => {
      register.uid = docRef.id; // Define o UID gerado pelo Firestore
      hideLoading();
      addTodolinkToScreen(register);
      clearForm();
      showNotification("Link cadastrado com sucesso!", "success");
    })
    .catch(() => {
      hideLoading();
      showNotification("Erro ao salvar link cadastrado", "error");
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
      showNotification("Erro ao recuperar links do banco de dados", "error");
    });
}

/* Delegação de eventos para editar e deletar */
form.tbody().addEventListener("click", (event) => {
  const target = event.target;
  const row = target.closest("tr");
  const uid = row?.dataset?.uid;

  if (target.classList.contains("edit")) {
    // Ação de editar
    const linkName = row.querySelector("a").textContent;
    const tag = row.querySelector(".tag").textContent;

    document.getElementById("editLinkName").value = linkName;
    document.getElementById("editTag").value = tag;

    const modal = document.getElementById("editModal");
    modal.dataset.uid = uid;
    modal.style.display = "block";
  }

  if (target.classList.contains("delete")) {
    // Ação de deletar
    const confirmDelete = confirm(
      "Tem certeza de que deseja deletar este link?"
    );
    if (confirmDelete) {
      deleteTodolink(uid, row);
    }
  }
});

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
      showNotification("Link deletado com sucesso!", "success");
      row.remove();
    })
    .catch((error) => {
      hideLoading();
      console.error("Erro ao deletar link: ", error);
      showNotification("Erro ao deletar o link", "error");
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
      showNotification("Link atualizado com sucesso!", "success");

      // Atualiza a exibição da tabela
      const row = document.querySelector(`tr[data-uid="${uid}"]`);
      row.querySelector("a").textContent = updatedLinkName;
      row.querySelector(".tag").textContent = updatedTag;

      modal.style.display = "none";
    })
    .catch((error) => {
      hideLoading();
      console.error("Erro ao atualizar link: ", error);
      showNotification("Erro ao atualizar o link", "error");
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
}

/* Limpa o formulário após enviar */
function clearForm() {
  form.link().value = "";
  form.linkName().value = "";
  form.tagName().value = "";
}

/* Função de notificação personalizada */
function showNotification(message, type = "success") {
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.textContent = message;

  form.notificationField().appendChild(notification);
  // document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}
