const form = {
  email: () => document.getElementById("email"),
  emailInvalidError: () => document.getElementById("email-invalid-error"),
  emailRequiredError: () => document.getElementById("email-required-error"),
  password: () => document.getElementById("password"),
  passwordRequiredError: () =>
    document.getElementById("password-required-error"),
  passwordMinLengthError: () =>
    document.getElementById("password-min-length-error"),
  confirmPassword: () => document.getElementById("confirmPassword"),
  confirmPasswordDoesntMatchError: () =>
    document.getElementById("password-doenst-match-error"),
  registerButton: () => document.getElementById("register-button"),
  loginButton: () => document.getElementById("login-button"),
};

form.email().addEventListener("input", (e) => {
  const email = form.email().value;
  form.emailRequiredError().style.display = email ? "none" : "block";

  form.emailInvalidError().style.display = validateEmail(email)
    ? "none"
    : "block";
  toggleRegisterButtonDisable();
});

form.password().addEventListener("input", () => {
  const password = form.password().value;
  form.passwordRequiredError().style.display = password ? "none" : "block";

  form.passwordMinLengthError().style.display =
    password.length >= 6 ? "none" : "block";

  validatePasswordMatch();
  toggleRegisterButtonDisable();
});

form.confirmPassword().addEventListener("input", () => {
  validatePasswordMatch();
});

function validatePasswordMatch() {
  const password = form.password().value;
  const confirmPassword = form.confirmPassword().value;

  form.confirmPasswordDoesntMatchError().style.display =
    password == confirmPassword ? "none" : "block";
  toggleRegisterButtonDisable();
}

/*  */
toggleRegisterButtonDisable();

function toggleRegisterButtonDisable() {
  form.registerButton().disabled = !isFormValid();
}

function isFormValid() {
  const email = form.email().value;
  if (!email || !validateEmail(email)) {
    return false;
  }

  const password = form.password().value;
  if (!password || password.length < 6) {
    return false;
  }

  const confirmPassword = form.confirmPassword().value;
  if (password !== confirmPassword) {
    return false;
  }

  return true; // Indica que o formulário é válido
}

form.loginButton().addEventListener("click", () => {
  window.location.href = "../../index.html";
});

/* Registro */

form.registerButton().addEventListener("click", () => {
  showLoading();

  const email = form.email().value;
  const password = form.password().value;

  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(() => {
      hideLoading();
      window.location.href = "../../pages/home.html";
    })
    .catch((error) => {
      hideLoading();
      alert(getErrorMessage(error));
    });
});

function getErrorMessage(error) {
  if (error.code == "auth/email-already-in-use") {
    return "Email já está em uso.";
  }
}
