import ValidatioND from "./valid";

function formValidationRegister() {
  const form = document.querySelector("#registerForm");

  if (!form) return;

  let fields = {
    email: {
      name: "email",
      validators: {
        email: {
          message: "Email-ul nu este valid",
        },
      },
    },
    surname: {
      name: "surname",
      validators: {
        notEmpty: {
          message: "Numele este obligatoriu",
        },
      },
    },
    name: {
      name: "name",
      validators: {
        notEmpty: {
          message: "Prenumele este obligatoriu",
        },
      },
    },
    location: {
      name: "location",
      validators: {
        notEmpty: {
          message: "Domiciliu este obligatoriu",
        },
      },
    },
    pass: {
      name: "password",
      validators: {
        notEmpty: {
          message: "Parola este obligatorie",
        },
        stringLength: {
          min: 8,
          message: "Minimum 8 caractere",
        },
      },
    },
    pass2: {
      name: "password2",
      validators: {
        passCheck: {
          basePassInput: "password",
          message: "Parolele nu sunt identice",
        },
      },
    },
  };

  new ValidatioND(form, fields);
}

formValidationRegister();

function formValidationReset() {
  const form = document.querySelector("#reset-password-form");

  if (!form) return;

  let fields = {
    email: {
      name: "email",
      validators: {
        email: {
          message: "Email-ul nu este valid",
        },
      },
    },
  };

  new ValidatioND(form, fields);
}

formValidationReset();
