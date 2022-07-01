const elFactory = (type, attributes, ...children) => {
  const el = document.createElement(type);

  for (const key in attributes) {
    el.setAttribute(key, attributes[key]);
  }

  children.forEach((child) => {
    if (child?.type === "svg") {
      el.innerHTML = child.icon;
    } else if (typeof child === "string" || typeof child === "number") {
      el.appendChild(document.createTextNode(child));
    } else {
      el.appendChild(child);
    }
  });

  return el;
};

export default elFactory;
