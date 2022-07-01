import el from "./utlis/elFactory";

const restrictedKeys = ["tooltip", "tooltipLocation"];

function adjustNavigation() {
  const navigation = document.querySelector("#account #nav");

  if (!navigation) return;

  const $topNav = navigation.querySelector(".main-nav_top");
  const $topNavItems = [...$topNav.querySelectorAll(".nav-item")];
  const $navItems = navigation.querySelectorAll(".nav-item");

  const getNavItemHeight = () => $navItems[0].offsetHeight;
  const generateOtherMenuItem = ({ href, classList, dataset, innerHTML }) => {
    const otherMenuItem = el("a", {
      href,
      class: classList.value.replace("nav-link", "main-nav_other_item"),
    });

    if (dataset && Object.keys(dataset).length) {
      Object.keys(dataset).forEach((key) => {
        if (key === "textContent") {
          otherMenuItem.innerHTML = `${innerHTML}<span class="text">${dataset[key]}</span>`;
        } else if (!restrictedKeys.includes(key)) {
          otherMenuItem.dataset[key] = dataset[key];
        }
      });
    }

    return otherMenuItem;
  };

  const adjust = () => {
    const { itemsCount, singleItemHeight, windowHeight } = {
      itemsCount: $navItems.length,
      singleItemHeight: getNavItemHeight(),
      windowHeight: window.innerHeight,
    };
    const totalItemsHeight =
      window.innerWidth < 600 ? itemsCount * singleItemHeight + 60 : itemsCount * singleItemHeight;

    if (totalItemsHeight > windowHeight) {
      const itemsToRemove = Math.ceil((totalItemsHeight - windowHeight) / singleItemHeight) + 1;
      const otherMenuItems = [];

      for (let i = 0; i < itemsToRemove; i++) {
        const removedItem = $topNavItems.pop();
        const itemUrlData = removedItem.querySelector(".nav-link");

        // Remove from DOM
        removedItem.remove();
        otherMenuItems.push(generateOtherMenuItem(itemUrlData));
      }

      const dottedItem = el(
        "div",
        { class: "nav-item others" },
        el(
          "a",
          {
            href: "#",
            class: "nav-link",
            "data-tooltip": "Altele",
            "data-tooltip-location": "right",
          },
          el("span", { class: "icon" }, el("i", { class: "far fa-ellipsis-v" }))
        )
      );
      const otherMenuContainer = el("div", { class: "main-nav_other" });

      // Check active status
      otherMenuItems.some((item) => item.classList.contains("active")) === true &&
        dottedItem.querySelector("a").classList.add("active");

      const toggleOtherMenu = (e) => {
        dottedItem.classList.add("disable-tooltip");
        otherMenuContainer.classList.add("active");

        if (e) {
          dottedItem.classList.remove("disable-tooltip");
          otherMenuContainer.classList.remove("active");
          document.removeEventListener("click", toggleOtherMenu);
        }
      };

      dottedItem.addEventListener("click", () => {
        toggleOtherMenu();
        setTimeout(() => document.addEventListener("click", toggleOtherMenu));
      });

      otherMenuItems.forEach((item) => otherMenuContainer.insertAdjacentElement("beforeend", item));
      dottedItem.insertAdjacentElement("beforeend", otherMenuContainer);
      $topNav.insertAdjacentElement("beforeend", dottedItem);
    }
  };

  adjust();
}

adjustNavigation();
