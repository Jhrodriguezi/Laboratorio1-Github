const formulario = document.getElementById("login");
const inputs = document.querySelectorAll("#login input");

const validarFormulario = (e) => {
  switch (e.target.name) {
    case "emailOrNickname":
      validarCampo(e.target.value, e.target.name, 0);
      break;
    case "password":
      validarCampo(e.target.value, e.target.name, 1);
      break;
  }
}

const campos = {
  emailOrNickname: false,
  password: false
}

const validarCampo = (input, campo, index) => {
  if (input == "") {
    document.getElementsByClassName("text_input_form")[index].classList.add("form__input-error-message");
    document.getElementsByClassName("text_input_form")[index].textContent = "Este campo no puede estar vacio";
    campos[campo] = false;
  } else {
    document.getElementsByClassName("text_input_form")[index].classList.remove("form__input-error-message");
    document.getElementsByClassName("text_input_form")[index].textContent = "";
    campos[campo] = true;
  }
}

inputs.forEach((input) => {
  input.addEventListener("keyup", validarFormulario);
  input.addEventListener("blur", validarFormulario);
})

formulario.addEventListener('submit', (e) => {
  if (!(campos.emailOrNickname && campos.password)) {
    e.preventDefault();
  }
})