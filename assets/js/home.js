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

/* validação */
function validateForm() {
  let link = form.link().value.trim();
  const linkName = form.linkName().value.trim();
  const tagName = form.tagName().value.trim();

  // Verifica se todos os campos estão preenchidos
  if (!link || !linkName || !tagName) {
    showNotification("Todos os campos são obrigatórios.", "error");
    return false;
  }

  // Adiciona o esquema http:// se faltar
  if (!/^https?:\/\//i.test(link)) {
    link = `http://${link}`;
  }

  // Valida o URL
  try {
    new URL(link); // Tenta criar um URL para validar se é válido
  } catch (_) {
    showNotification("O link deve ser uma URL válida.", "error");
    return false;
  }

  // Verifica o comprimento do nome do link
  if (linkName.length > 100) {
    showNotification(
      "O nome do link deve ter no máximo 100 caracteres.",
      "error"
    );
    return false;
  }

  // Verifica o comprimento da tag
  if (tagName.length > 10) {
    showNotification("A tag deve ter no máximo 10 caracteres.", "error");
    return false;
  }

  // Atualiza o campo de link com o esquema correto
  form.link().value = link;

  return true;
}

/* Envia o formulário e redireciona */
form.send().addEventListener("click", (e) => {
  e.preventDefault();
  if (validateForm()) {
    saveRegister();
  }
});

/* envia cadastro */
function saveRegister() {
  if (!validateForm()) {
    return;
  }

  showLoading();
  const register = createCadastro();

  firebase
    .firestore()
    .collection("todolinks")
    .add(register)
    .then((docRef) => {
      register.uid = docRef.id;
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
    const linkName = row.querySelector("a").textContent;
    const tag = row.querySelector(".tag").textContent;

    document.getElementById("editLinkName").value = linkName;
    document.getElementById("editTag").value = tag;

    const modal = document.getElementById("editModal");
    modal.dataset.uid = uid;
    modal.style.display = "block";
  }

  if (target.classList.contains("delete")) {
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
    newRow.dataset.uid = e.uid;
    newRow.innerHTML = `
      <th>
        <a href="${e.link}" target="_blank">${e.linkName}</a>
      </th>
      <th class="tag">${e.tag}</th>
      <th class="edit">✏️</th>
      <th class="delete">🗑️</th>
    `;
    table.appendChild(newRow);

    if (!tagOption.includes(e.tag)) {
      tagOption.push(e.tag);
      updateTagOptions();
    }
  });
}

/* Adiciona um único link à tela */
function addTodolinkToScreen(e) {
  const table = form.tbody();

  const newRow = document.createElement("tr");
  newRow.dataset.uid = e.uid;
  newRow.innerHTML = `
    <th>
      <a href="${e.link}" target="_blank">${e.linkName}</a>
    </th>
    <th class="tag">${e.tag}</th>
    <th class="edit">✏️</th>
    <th class="delete">🗑️</th>
  `;
  table.appendChild(newRow);

  if (!tagOption.includes(e.tag)) {
    tagOption.push(e.tag);
    updateTagOptions();
  }
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

  setTimeout(() => {
    notification.remove();
  }, 3000);
}
