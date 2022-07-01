function registerAccordion(selector, { ...args }) {
  const accordion = document.querySelector(selector);
  const { title, content, contentPaddingBottom } = args;

  if (accordion) {
    const items = [];
    const accordionItems = accordion.querySelectorAll(".accordion-item");

    // Get items
    accordionItems.forEach((item) => {
      const head = item.querySelector(title);
      const body = item.querySelector(content);

      items.push({
        item,
        head,
        body,
        status: false,
      });
    });

    // Close all items
    const closeAllItems = () => {
      items.forEach((_i) => {
        _i.status = false;
      });
    };

    // Update items in accordion
    const updateItems = () => {
      items.forEach((_i) => {
        if (_i.status) {
          _i.item.classList.add("active");
          _i.body.style.maxHeight = _i.body.scrollHeight + contentPaddingBottom + "px";
          _i.body.style.paddingBottom = contentPaddingBottom + "px";
          _i.status = true;
        } else {
          _i.item.classList.remove("active");
          _i.body.style.maxHeight = null;
          _i.body.style.paddingBottom = 0;
          _i.status = false;
        }
      });
    };

    // Register listener
    items.forEach((_i) => {
      _i.head.addEventListener("click", () => {
        closeAllItems();
        _i.status = !_i.status;
        updateItems();
      });
    });
  }
}
