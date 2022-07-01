import "regenerator-runtime";
import createNotification from "./createNotification";
import { getHumanTime } from "./utlis/timeToHumanValue";
import el from "./utlis/elFactory";

document.addEventListener("DOMContentLoaded", () => {
  (function () {
    const popupBtns = document.querySelectorAll(".openPopup");

    if (!popupBtns) return;

    for (const btn of popupBtns) {
      let popupName = btn.getAttribute("data-popup");
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        openPopup(btn, popupName);
      });
    }
    textareaAutoResize();
  })();
  initializeNotification();
  ticketCoundown();
});

function initializeNotification() {
  const notifications = document.createElement("div");
  notifications.id = "notify-container";
  notifications.className = "notifications";

  document.body.appendChild(notifications);
}

function textareaAutoResize() {
  const txt = document.querySelectorAll(".txt-autoresize");

  if (!txt) return;

  for (const textarea of txt) {
    textarea.addEventListener("input", function () {
      this.style.height = "auto";
      this.style.height = this.scrollHeight + "px";
    });
  }
}

function openPopup(btn, popup) {
  const el = document.querySelector(popup);

  if (!el) return;

  let overlay = document.querySelector("#overlay");

  // Create popup blocker
  const popupOverlayBlocker = document.createElement("div");
  popupOverlayBlocker.classList.add("popup-overlay-blocker");

  const prevPopup = document.querySelector(el.getAttribute("data-prev-popup"));

  if (el.hasAttribute("data-prev-popup")) {
    prevPopup.classList.add("overlay");

    overlay = document.createElement("div");
    overlay.classList.add("popup-overlay");

    // Set overlay pos
    const overlay_pos = prevPopup.getBoundingClientRect();
    overlay.style.width = `${overlay_pos.width}px`;
    overlay.style.height = `${overlay_pos.height}px`;

    // Inser Overlay
    document.body.appendChild(overlay);

    popupOverlayBlocker.addEventListener("click", closeByClick);
    document.body.appendChild(popupOverlayBlocker);
  }

  let elCloseBtn = el.querySelector(".popupBtn");

  elCloseBtn.addEventListener("click", closeByClick);
  overlay.addEventListener("click", closeByClick);

  overlay.classList.add("active");
  (function openThis() {
    el.style.display = "block";

    setTimeout(() => {
      el.classList.add("active");
    }, 14);
  })();

  function closeThis() {
    el.classList.remove("active");
    prevPopup && prevPopup.classList.remove("overlay");
    setTimeout(() => {
      el.style.display = "none";
    }, 250);
  }

  function closeByClick(e) {
    if (e.target !== el) {
      prevPopup && prevPopup.classList.remove("overlay");
      overlay.classList.remove("active");
      if (el.hasAttribute("data-prev-popup")) {
        overlay.classList.add("disabled");
        setTimeout(() => {
          popupOverlayBlocker.remove();
          overlay.remove();
        }, 150);
      }

      closeThis();
      this.removeEventListener("click", closeByClick);
    }
  }
}

function ticketCoundown() {
  const tickets = [...document.querySelectorAll("[data-timestamp]")].map((ticket) => ({
    deadline: ticket.getAttribute("data-timestamp"),
    node: ticket.querySelector(".ticket-timer"),
  }));

  const addZero = (num) => (num < 10 ? `0${num}` : num);

  const countdown = ({ deadline, node }) => {
    if (getHumanTime(deadline).hours() < 24) {
      const timer = setInterval(() => {
        const time = getHumanTime(deadline);

        if (time.hours() <= 0 && time.minutes() < 1) {
          clearInterval(timer);
          node.classList.add("timeout");
          node.textContent = "00:00";

          return;
        }

        if (time.hours() < 12 && time.hours() > 4) node.classList.add("waiting");
        else if (time.hours() < 4) node.classList.add("error");

        if (time.hours() < 0) {
          node.textContent = time.hours() + "h";
          return;
        }

        node.textContent = `${addZero(time.hours())}:${addZero(time.minutes())}`;
      }, 1000);
    }
  };

  tickets.forEach((ticket) => countdown(ticket));
}

function removeAccount() {
  const container = document.querySelector("#remove-account_confirmation");

  if (!container) return;

  const remove_input = container.querySelector("#remove-input");
  const remove_button = container.querySelector("#remove-button");

  remove_input.addEventListener("input", (e) => {
    if (e.target.value && e.target.value.length > 4) remove_button.classList.remove("disabled");
    else remove_button.classList.add("disabled");
  });

  remove_button.addEventListener("click", async (e) => {
    e.preventDefault();

    if (remove_input.value && remove_input.value.length) {
      const formData = new FormData();
      formData.append("password", remove_input.value);

      try {
        const response = await fetch("https://lawyeredup.ro/api/deleteAccount.php", {
          method: "POST",
          body: formData,
        });

        if (response.status === 200) window.location = "/";
        else if (response.status === 422) createNotification("error", "Parolă incorectă!");
      } catch (err) {
        createNotification("error", "Eroare necunoscută!");
      }
    }
  });
}

removeAccount();

function registerAccount() {
  const container = document.querySelector("#registerForm");

  if (!container) return;

  const trigger = container.querySelector("#user_role");

  if (!trigger) return;

  const extraInputs = (container) => {
    const company_name = el(
      "div",
      { class: "form-control" },
      el("label", { for: "company_name" }, "Denumirea companiei"),
      el("input", { name: "company_name", required: "true", placeholder: "Smart Data S.R.L" })
    );

    const tax_code = el(
      "div",
      { class: "form-control" },
      el("label", { for: "tax_code" }, "CIF"),
      el("input", { name: "tax_code", required: "true", placeholder: "Codul Fiscal" })
    );

    const wrapper = el("div", { class: "input-group" });

    wrapper.insertAdjacentElement("beforeend", company_name);
    wrapper.insertAdjacentElement("beforeend", tax_code);

    const insertInputs = () => {
      container.insertAdjacentElement("afterend", wrapper);
    };

    const removeInputs = () => {
      wrapper.remove();
    };

    return {
      insert: insertInputs,
      remove: removeInputs,
    };
  };

  const extraInputsActions = extraInputs(trigger.parentElement.parentElement);

  trigger.addEventListener("change", (event) => {
    if (event.target.checked) extraInputsActions.insert();
    else extraInputsActions.remove();
  });
}

registerAccount();
