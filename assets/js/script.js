// let editingRow = null; // Variável global para acompanhar qual linha está sendo editada

// document.getElementById("send").addEventListener("click", function (event) {
//   event.preventDefault(); // Evita o envio do formulário

//   const linkValue = document.getElementById("link").value.trim();
//   const nameValue = document.getElementById("name").value.trim();
//   const tagValue = document.getElementById("tag").value.trim();

//   if (linkValue === "" || nameValue === "" || tagValue === "") {
//     alert("Por favor, preencha todos os campos.");
//     return;
//   }

//   if (editingRow) {
//     updateRow(editingRow, linkValue, nameValue, tagValue);
//     editingRow = null;
//   } else {
//     addNewRow(linkValue, nameValue, tagValue);
//   }

//   document.getElementById("formRegister").reset();
// });

// function addNewRow(link, name, tag) {
//   const table = document.querySelector("table tbody");
//   const newRow = document.createElement("tr");

//   const nameCell = document.createElement("th");
//   const linkElement = document.createElement("a");
//   linkElement.href = link;
//   linkElement.textContent = name;
//   linkElement.target = "_blank";
//   nameCell.appendChild(linkElement);
//   newRow.appendChild(nameCell);

//   const tagCell = document.createElement("th");
//   tagCell.classList.add("tag");
//   tagCell.textContent = tag;
//   newRow.appendChild(tagCell);

//   const editCell = document.createElement("th");
//   editCell.classList.add("edit");
//   editCell.innerHTML = "✏️"; // ícone de lápis
//   editCell.addEventListener("click", function () {
//     openModal(newRow, link, name, tag);
//   });
//   newRow.appendChild(editCell);

//   const deleteCell = document.createElement("th");
//   deleteCell.classList.add("delete");
//   deleteCell.innerHTML = "🗑️"; // ícone de lixeira
//   deleteCell.addEventListener("click", function () {
//     table.removeChild(newRow);
//   });
//   newRow.appendChild(deleteCell);

//   table.appendChild(newRow);
// }

// function openModal(row, link, name, tag) {
//   editingRow = row;

//   document.getElementById("editLink").value = link;
//   document.getElementById("editName").value = name;
//   document.getElementById("editTag").value = tag;

//   const modal = document.getElementById("editModal");
//   modal.style.display = "block";
// }

// function updateRow(row, link, name, tag) {
//   row.children[0].querySelector("a").href = link;
//   row.children[0].querySelector("a").textContent = name;
//   row.children[1].textContent = tag;
// }

// document.getElementById("saveEdit").addEventListener("click", function (event) {
//   event.preventDefault();

//   const linkValue = document.getElementById("editLink").value.trim();
//   const nameValue = document.getElementById("editName").value.trim();
//   const tagValue = document.getElementById("editTag").value.trim();

//   if (linkValue === "" || nameValue === "" || tagValue === "") {
//     alert("Por favor, preencha todos os campos.");
//     return;
//   }

//   if (editingRow) {
//     updateRow(editingRow, linkValue, nameValue, tagValue);
//     editingRow = null;
//   }

//   closeModal();
// });

// function closeModal() {
//   const modal = document.getElementById("editModal");
//   modal.style.display = "none";
// }

// document.querySelector(".close").addEventListener("click", closeModal);

// window.addEventListener("click", function (event) {
//   const modal = document.getElementById("editModal");
//   if (event.target === modal) {
//     closeModal();
//   }
// });
let editingRow = null; // Variável global para acompanhar qual linha está sendo editada

document.getElementById("send").addEventListener("click", function (event) {
  event.preventDefault(); // Evita o envio do formulário

  const linkValue = document.getElementById("link").value.trim();
  const nameValue = document.getElementById("name").value.trim();
  const tagValue = document.getElementById("tag").value.trim();

  if (linkValue === "" || nameValue === "" || tagValue === "") {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  if (editingRow) {
    updateRow(editingRow, linkValue, nameValue, tagValue);
    editingRow = null;
  } else {
    addNewRow(linkValue, nameValue, tagValue);
  }

  document.getElementById("formRegister").reset();
});

function addNewRow(link, name, tag) {
  const table = document.querySelector("table tbody");
  const newRow = document.createElement("tr");

  newRow.innerHTML = `
    <th>
      <a href="${link}" target="_blank">${name}</a>
    </th>
    <th class="tag">${tag}</th>
    <th class="edit">✏️</th>
    <th class="delete">🗑️</th>
  `;

  // Adiciona os eventos de clique nos ícones de editar e deletar
  newRow.querySelector(".edit").addEventListener("click", function () {
    openModal(newRow, link, name, tag);
  });

  newRow.querySelector(".delete").addEventListener("click", function () {
    table.removeChild(newRow);
  });

  table.appendChild(newRow);
}

function openModal(row, link, name, tag) {
  editingRow = row;

  document.getElementById("editLink").value = link;
  document.getElementById("editName").value = name;
  document.getElementById("editTag").value = tag;

  const modal = document.getElementById("editModal");
  modal.style.display = "block";
}

function updateRow(row, link, name, tag) {
  row.children[0].querySelector("a").href = link;
  row.children[0].querySelector("a").textContent = name;
  row.children[1].textContent = tag;
}

document.getElementById("saveEdit").addEventListener("click", function (event) {
  event.preventDefault();

  const linkValue = document.getElementById("editLink").value.trim();
  const nameValue = document.getElementById("editName").value.trim();
  const tagValue = document.getElementById("editTag").value.trim();

  if (linkValue === "" || nameValue === "" || tagValue === "") {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  if (editingRow) {
    updateRow(editingRow, linkValue, nameValue, tagValue);
    editingRow = null;
  }

  closeModal();
});

function closeModal() {
  const modal = document.getElementById("editModal");
  modal.style.display = "none";
}

document.querySelector(".close").addEventListener("click", closeModal);

window.addEventListener("click", function (event) {
  const modal = document.getElementById("editModal");
  if (event.target === modal) {
    closeModal();
  }
});
