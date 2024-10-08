/* Search */
const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", filterList);

function filterList() {
  const searchTerm = searchInput.value.toLowerCase();
  const rows = document.querySelectorAll("#tbody tr");
  rows.forEach((row) => {
    const linkName = row.querySelector("a").textContent.toLowerCase();
    const tag = row.querySelector(".tag").textContent.toLowerCase();
    const matchesSearch =
      linkName.includes(searchTerm) || tag.includes(searchTerm);
    row.style.display = matchesSearch ? "" : "none";
  });
}

/* SERACH POR TAG */
const tagOption = [];

function updateTagOptions() {
  const select = document.getElementById("tagSearch");
  select.innerHTML = `<option value=>All TAG's</option>`;

  tagOption.forEach((tag) => {
    const option = document.createElement("option");
    option.value = tag;
    option.textContent = tag;
    select.appendChild(option);
  });
}

/* Filtro por tag */
document.getElementById("tagSearch").addEventListener("change", filterByTag);

function filterByTag() {
  const selectedTag = document.getElementById("tagSearch").value.toLowerCase();
  const rows = document.querySelectorAll("#tbody tr");
  rows.forEach((row) => {
    const rowTag = row.querySelector(".tag").textContent.toLowerCase();
    const matchesTag = selectedTag === "" || rowTag === selectedTag;
    row.style.display = matchesTag ? "" : "none";
  });
}
