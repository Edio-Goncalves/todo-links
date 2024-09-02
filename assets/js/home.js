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

/* fake links */
const fakeLinks = [
  {
    link: "https://www.youtube.com/watch?v=doR4tpkCJ-E&list=PLMbclvogjXZVxxN06cefN7q5nyt7u5dUq&index=20",
    linkName: "nomeDoLink",
    tag: "tagFake",
    user: {
      uid: "g21ACrqLoKh5C8xB6KlGAFue2iz1",
    },
  },
  {
    link: "https://www.youtube.com/watch?v=doR4tpkCJ-E&list=PLMbclvogjXZVxxN06cefN7q5nyt7u5dUq&index=20",
    linkName: "nomeDoLink0022",
    tag: "tagFake0022",
    user: {
      uid: "g21ACrqLoKh5C8xB6KlGAFue2222",
    },
  },
];

findTodolinks();

function findTodolinks() {
  setTimeout(() => {
    addTodolinksToScreen(fakeLinks);
  }, 1000);
}
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
