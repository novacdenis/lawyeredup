import animateCSS from "./animation";
import bytesToSize from "./bytesToSize";
import createNotification from "./createNotification";

const categoriesName = {
  drept_civil_contracte: "Drept Civil – Contracte",
  drept_civil_succesiuni: "Drept Civil – Succesiuni",
  drept_civil_familie: "Drept Civil – Familie",
  drept_civil_proprietate: "Drept Civil – Proprietate",
  fond_funciar: "Fond Funciar",
  contraventional: "Contravențional",
  drept_penal: "Drept Penal",
  drept_muncii: "Dreptul Muncii",
  dreptul_mediului: "Dreptul Mediului",
  drept_societar_orc: "Drept Societar – ORC",
  insolventa_si_faliment: "Insolvență și Faliment",
  drept_fiscal: "Drept Fiscal",
  drept_international: "Drept Internațional",
  dreptul_ue: "Dreptul UE",
  litigii_civile: "Litigii Civile",
  litigii_penale: "Litigii Penale",
  drept_administrativ: "Drept Administrativ",
  alte_aspecte_de_drept_civil: "Alte aspecte de Drept Civil",
};

function initializeAskTabs() {
  const tabsSection = document.querySelector("#ask-tabs");
  const tabs = tabsSection?.querySelectorAll(".ask-tab");

  if (!tabsSection || !tabs) return;

  const handleEventForTabs = () => {
    tabs.forEach((tab) => {
      const tabType = tab.getAttribute("data-type");
      tab.addEventListener("click", () => {
        window.history.pushState(null, null, `?type=${tabType}`);
        setActiveTab(tabType);
      });
    });
  };
  handleEventForTabs();

  const setActiveTab = (type = null) => {
    tabs.forEach((tab) => {
      let tabType = tab.getAttribute("data-type") || null;
      if (tabType && tabType === type) {
        let tabContent = document.querySelector(`[data-type="tab-content#${tabType}"]`);
        tabContent.style.display = "block";
        animateCSS(tabContent, "fadeInUp").then(() => {
          tab.classList.add("active");
          tabContent.classList.add("active");
        });
        initializeSendForm(tabType);
      } else {
        let tabContent = document.querySelector(`[data-type="tab-content#${tabType}"]`);
        tab.classList.remove("active");
        tabContent.classList.remove("active");
        tabContent.style.display = "none";
      }
    });
  };

  // Get Active Tab
  const uriSearch = new URLSearchParams(window.location.search);
  if (uriSearch.has("type")) {
    // Set Active Tab By URL
    setActiveTab(uriSearch.get("type"));
  } else if (uriSearch.has("res_type")) {
    initializeSendForm("response", true);
  } else {
    setActiveTab("simple");
  }
}

initializeAskTabs();

function setOveserverToElement(el, func) {
  const target = el;

  const config = {
    childList: true,
  };

  const callback = function () {
    func();
  };

  const observer = new MutationObserver(callback);
  observer.observe(target, config);
}

function initializeSendForm(type, onlyInit = false) {
  const form = document.querySelector(`form[data-type="tab-form#${type}"]`);

  const formPrice = form.getAttribute("data-form-price") || 50;

  const isUserHasDiscount = fetch("https://lawyeredup.ro/api/discount").then((res) => res.json());

  if (!form || form.getAttribute("data-inited")) return;

  const formContent = form?.querySelector(`#form-type-${type} .content`);
  const ticketPrice = form?.querySelector(`.ticket-price[data-type="ticket-price#${type}"]`);
  const fromMaxCategoiews = form?.getAttribute("data-max-categories") || null;

  form?.classList.add("disabled-submit");
  ticketPrice.classList.add("hide");

  isUserHasDiscount.then((res) => {
    if (res === true) {
      form.querySelector(".ticket-user-discount").classList.remove("hide");
      ticketPrice.classList.add("discount");
    } else form.querySelector(".ticket-user-discount").classList.add("hide");
  });

  const checkFormContent = () => {
    const activeBoxes = form.querySelectorAll(".category-box.active");
    const setPrice = ticketPrice.querySelector(".price span");
    const setDiscount = ticketPrice.querySelector(".discount span");

    if (activeBoxes.length) {
      const genereatedPrice = activeBoxes.length * formPrice;

      // FORM MAIN
      formContent.classList.add("filled");
      form.classList.remove("disabled-submit");

      // TICKET PRICE
      setPrice.textContent = (type === "juridic" && `Avans ${genereatedPrice}`) || genereatedPrice;
      ticketPrice.classList.remove("hide");

      // TICKET DISCOUNT
      setDiscount.textContent =
        (type === "juridic" && `Avans ${genereatedPrice - genereatedPrice * 0.2}`) ||
        genereatedPrice - genereatedPrice * 0.2;

      if (fromMaxCategoiews && activeBoxes.length >= fromMaxCategoiews) {
        form.classList.add("disabled-cateogries");
      }
    } else {
      // FORM MAIN
      form.classList.remove("disabled-cateogries");
      form.classList.add("disabled-submit");
      formContent.classList.remove("filled");

      // TICKET PRICE
      setPrice.textContent = 0;
      ticketPrice.classList.add("hide");
    }
  };

  setOveserverToElement(formContent, checkFormContent);

  const creatCategoryTextarea = (name) => {
    const div = document.createElement("div");
    const label = document.createElement("label");
    const textareaContainer = document.createElement("div");
    const textareaCounter = document.createElement("span");
    const textarea = document.createElement("textarea");

    div.classList.add("form-control");
    div.setAttribute("data-target", name);
    label.setAttribute("for", name);
    label.textContent = `${categoriesName[name]}*`;
    textareaContainer.className = "form-container";

    textarea.rows = 1;
    textarea.name = name;
    textarea.maxLength = type === "juridic" ? "2000" : "500";
    textarea.classList.add("txt-autoresize");
    textarea.required = true;
    textarea.placeholder = "Scrie aici întrebarea";
    textarea.addEventListener("input", function () {
      if (
        textarea.value.length > textarea.maxLength ||
        textarea.value.length === textarea.maxLength
      ) {
        textareaCounter.classList.add("error");
      } else {
        textareaCounter.classList.remove("error");
      }

      textareaCounter.textContent = textarea.value.length + " / " + textarea.maxLength;
      this.style.height = "auto";
      this.style.height = this.scrollHeight + "px";
    });

    textareaContainer.appendChild(textarea);
    textareaContainer.appendChild(textareaCounter);
    div.appendChild(label);
    div.appendChild(textareaContainer);

    return div;
  };

  const categories = form.querySelectorAll(".cat-input-box");

  if (onlyInit) {
    categories.forEach((cat) => {
      if (cat.parentNode.classList.contains("active")) {
        formContent.insertAdjacentElement("beforeend", creatCategoryTextarea(cat?.value));
      }
    });
    form.setAttribute("data-inited", true);

    return true;
  }

  categories.forEach((cat) => {
    cat.addEventListener("click", () => {
      if (cat.parentNode.classList.contains("active")) {
        cat.parentNode.classList.remove("active");
        formContent.querySelector(`.form-control[data-target="${cat?.value}"]`)?.remove();
      } else {
        cat.parentNode.classList.add("active");
        formContent.insertAdjacentElement("beforeend", creatCategoryTextarea(cat?.value));
      }
    });
  });

  if (type === "juridic") {
    const boxes = form.querySelectorAll(".attached-box");
    const previewContainer = form.querySelector(".attached-preview");
    setFileToForm(boxes, previewContainer);
  }

  form.setAttribute("data-inited", true);
}

function setFileToForm(boxes, previewContainer) {
  const accepted = [".doc", ".docx", ".png", ".pdf", ".jpg", ".jpeg"];

  const setPreview = (id, name, size) => {
    const file = name.split(".");
    const file_ext = file.pop();
    const file_name = file.join("");
    const file_size = bytesToSize(size);

    return `
      <div class="attach-box" data-input-target="${id}">
        <div class="icon">
        <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fal" data-icon="file" role="img" viewBox="0 0 384 512" class="svg-icon"><path fill="currentColor" d="M369.9 97.9L286 14C277 5 264.8-.1 252.1-.1H48C21.5 0 0 21.5 0 48v416c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48V131.9c0-12.7-5.1-25-14.1-34zm-22.6 22.7c2.1 2.1 3.5 4.6 4.2 7.4H256V32.5c2.8.7 5.3 2.1 7.4 4.2l83.9 83.9zM336 480H48c-8.8 0-16-7.2-16-16V48c0-8.8 7.2-16 16-16h176v104c0 13.3 10.7 24 24 24h104v304c0 8.8-7.2 16-16 16z" class=""></path></svg>
        </div>
        <div class="info">
          <p class="info-name truncate-text-container">
            <span class="truncate-text-item">${file_name}</span>
          </p>
          <div class="info-meta">
            <span class="info-meta_ext">${file_ext}</span>
            <span class="info-meta_size">${file_size}</span>
          </div>
        </div>
      </div>
    `;
  };

  const createInputFile = (id, box) => {
    const input = document.createElement("input");
    input.setAttribute("data-input-target", id);
    input.classList.add("hidden");
    input.type = "file";
    input.accept = accepted.join(",");
    input.name = "files[]";

    input.addEventListener("change", () => {
      if (input.files && input.files[0]) {
        const ext = input.files[0].name.split(".").pop();
        if (input.files[0].size / 1024 / 1024 > 3) {
          createNotification("error", `File max size - 3MB`);
          return;
        }
        if (accepted.includes(`.${ext}`)) {
          const filePreview = setPreview(id, input.files[0].name, input.files[0].size);
          previewContainer.insertAdjacentHTML("beforeend", filePreview);
          box.classList.add("filled");
          box.setAttribute("data-file-id", id);
        } else {
          createNotification("error", `Extensie interzisă '${ext}'`);
        }
      }
    });

    input.click();

    return input;
  };

  boxes.forEach((box) => {
    box.addEventListener("click", () => {
      if (box.classList.contains("filled") && box.getAttribute("data-file-id")) {
        const file_id = box.getAttribute("data-file-id");
        const file_elements = document.querySelectorAll(`[data-input-target="${file_id}"]`);

        file_elements.forEach((el) => el.remove());
        box.classList.remove("filled");
        box.removeAttribute("data-file-id");

        createNotification("success", "Fișierul a fost șters cu succes!");
      } else {
        const uid = Math.random().toString(36).substring(2, 9);
        previewContainer.appendChild(createInputFile(uid, box));
      }
    });
  });
}
