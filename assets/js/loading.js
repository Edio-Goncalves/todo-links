function showLoading() {
  let div = document.createElement("div");
  div.classList.add("loading");
  document.querySelector("body").append(div);
  let label = document.createElement("label");
  label.innerText = "Carregando...";
  div.appendChild(label);
}
function hideLoading() {
  const loadingElement = document.querySelector(".loading");
  if (loadingElement) {
    loadingElement.remove();
  }
}
