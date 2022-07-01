function createNotification(type, msg) {
  const container = document.querySelector("#notify-container");

  if(!container) return;

  const notification = document.createElement("div");
  const icon_container = document.createElement("div");
  const icon = document.createElement("img");
  const message = document.createElement("p");
  const posBottom = 74 * container.children.length || 0;

  notification.classList.add("notifications-item");
  notification.style = "top: ".concat(posBottom, "px");
  icon_container.classList.add("icon");
  icon.src = type === "success" && "/images/success.svg" || type === "error" && "/images/error.svg" || type === "warning" && "/images/warning.svg";
  message.textContent = msg;

  icon_container.appendChild(icon);
  notification.appendChild(icon_container);
  notification.appendChild(message);
  container.appendChild(notification)
  
  setTimeout(() => {
    notification.classList.add("disabled");
    setTimeout(() => {
      notification.remove();
    }, 290)
  }, 3300)
}

export default createNotification;
