class ValidatioND {
  constructor(form, { ...args }) {
    this.form = form;
    this.formBtn = this.form.querySelector('button[type="submit"]');
    this.args = args;
    this.validObj = {};
    this.isValid = false;

    this.init();
  }

  init() {
    for (const [key, value] of Object.entries(this.args)) {
      this.validObj[value.name] = false;
      this.registerInput(value);
    }

    this.formBtn.setAttribute("disabled", "true");
    this.checkFormValidity();
  }

  registerInput(obj) {
    let input = this.form[obj.name];

    if (!input) return;

    let inputParent = input.parentNode;
    let errorContainer = document.createElement("div");
    errorContainer.classList.add("error-container");

    inputParent.insertAdjacentElement("beforeend", errorContainer);

    if (input.value) {
      const preliminaryCheck = this.validator(obj.validators, input);
      if (Object.entries(preliminaryCheck).length) {
        this.validObj[obj.name] = false;
        this.renderErrors(preliminaryCheck, errorContainer);
      } else {
        this.validObj[obj.name] = true;
      }
    }

    input.addEventListener("input", () => {
      let errors = this.validator(obj.validators, input);
      if (Object.entries(errors).length) {
        this.validObj[obj.name] = false;
      } else {
        this.validObj[obj.name] = true;
      }
      this.renderErrors(errors, errorContainer);

      this.checkFormValidity();
    });
  }

  checkFormValidity() {
    let array = [];
    const resume = () => {
      for (const value of Object.values(this.validObj)) {
        array.push(value);
      }
    };

    resume();

    let newArr = array.filter((status) => status === false);

    if (!newArr.length) {
      this.formBtn.removeAttribute("disabled");
    } else this.formBtn.setAttribute("disabled", true);
  }

  renderErrors(obj, container) {
    let errorsHTML = "";

    for (const [key, text] of Object.entries(obj)) {
      errorsHTML += `<span class="error">${text}</span>`;
    }

    container.innerHTML = errorsHTML;
  }

  validator(obj, input) {
    let errorsObj = {};

    for (const [key, args] of Object.entries(obj)) {
      switch (key) {
        case "notEmpty":
          notEmpty(args);
          break;
        case "stringLength":
          stringLength(args);
          break;
        case "pattern":
          pattern(args);
          break;
        case "email":
          emailValidation(args);
          break;
        case "passCheck":
          passCheck.bind(this)(args);
          break;

        default:
          break;
      }
    }

    function notEmpty(args) {
      if (!input.value) {
        errorsObj["req"] = args.message;
      }
    }

    function stringLength(args) {
      if (input.value.length < args.min) {
        errorsObj["minL"] = args.message;
      }
    }

    function pattern(args) {
      if (input.value.match(args.match) && input.value.length) {
        errorsObj["pattern"] = args.message;
      }
    }

    function emailValidation(args) {
      const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
      if (!re.test(input.value)) {
        errorsObj["reTest"] = args.message;
      }
    }
    function passCheck(args) {
      const baseInput = this.form[args.basePassInput];

      if (input.value !== baseInput.value) {
        errorsObj["passConfirmation"] = args.message;
      }
    }

    return errorsObj;
  }
}

export default ValidatioND;
