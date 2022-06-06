const formulario = document.getElementById("createAccount");
const inputs = document.querySelectorAll("#createAccount input");
const expresiones = {
  nickname: /^[a-zA-Z0-9\_\-]{4,16}$/,
  email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9]+\.[a-zA-Z0-9-.]+$/,
  password: /^.{8,20}$/
}

const validarFormulario = (e) => {
  switch (e.target.name) {
    case "nickname":
      validarCampo(expresiones.nickname, e.target.value, e.target.name, 0);
      break;
    case "email":
      validarCampo(expresiones.email, e.target.value, e.target.name, 1);
      break;
    case "password":
      validarCampo(expresiones.password, e.target.value, e.target.name, 2);
      validarSegundaPassword(3);
      break;
    case "password2":
      validarSegundaPassword(3);
      break;
  }
}

const campos = {
  nickname: false,
  email: false,
  password: false
}

const validarCampo = (expresion, input, campo, index) => {
  if (input == "") {
    document.getElementsByClassName("text_input_form")[index].classList.add("form__input-error-message");
    document.getElementsByClassName("text_input_form")[index].classList.remove("form__input-success-message");
    document.getElementsByClassName("text_input_form")[index].textContent = (campo.charAt(0).toUpperCase() + campo.slice(1)) + " no puede estar vacio";
    campos[campo] = false;
  } else {
    if (expresion.test(input)) {
      document.getElementsByClassName("text_input_form")[index].classList.remove("form__input-error-message");
      document.getElementsByClassName("text_input_form")[index].classList.add("form__input-success-message");
      document.getElementsByClassName("text_input_form")[index].textContent = campo !== "password" ? input + " es correcto" : "Correcto";
      campos[campo] = true;
    } else {
      document.getElementsByClassName("text_input_form")[index].classList.add("form__input-error-message");
      document.getElementsByClassName("text_input_form")[index].classList.remove("form__input-success-message");
      document.getElementsByClassName("text_input_form")[index].textContent = campo !== "password" ? input + " no cumple con los criterios de validación" : "La contraseña no es valida";
      campos[campo] = false;
    }
  }
}

const validarSegundaPassword = (index) => {
  const inputp1 = document.getElementById("signupPassword");
  const inputp2 = document.getElementById("signupPassword2");
  if (inputp2.value == "") {
    document.getElementsByClassName("text_input_form")[index].classList.add("form__input-error-message");
    document.getElementsByClassName("text_input_form")[index].classList.remove("form__input-success-message");
    document.getElementsByClassName("text_input_form")[index].textContent = "No puede dejar este campo vacio";
    campos["password"] = false;
  } else {
    if (inputp1.value != inputp2.value) {
      document.getElementsByClassName("text_input_form")[index].classList.add("form__input-error-message");
      document.getElementsByClassName("text_input_form")[index].classList.remove("form__input-success-message");
      document.getElementsByClassName("text_input_form")[index].textContent = "Las contraseñas no coinciden";
      campos["password"] = false;
    } else {
      document.getElementsByClassName("text_input_form")[index].classList.remove("form__input-error-message");
      document.getElementsByClassName("text_input_form")[index].classList.add("form__input-success-message");
      document.getElementsByClassName("text_input_form")[index].textContent = "Las contraseñas coinciden";
      campos["password"] = true;
    }
  }
}

inputs.forEach((input) => {
  input.addEventListener("keyup", validarFormulario);
  input.addEventListener("blur", validarFormulario);
})

formulario.addEventListener('submit', (e) => {
  if (!(campos.nickname && campos.email && campos.password)) {
    e.preventDefault();
  }
})