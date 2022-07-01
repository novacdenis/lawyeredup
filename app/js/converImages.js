const convertImages = (query, callback) => {
  const images = document.querySelectorAll(query);

  images.forEach((image) => {
    fetch(image.src)
      .then((res) => res.text())
      .then((data) => {
        const parser = new DOMParser();
        const svg = parser.parseFromString(data, "image/svg+xml").querySelector("svg");

        if (image.id) svg.id = image.id;
        if (image.className) svg.classList = image.classList;

        image.parentNode.replaceChild(svg, image);
      })
      .then(callback)
      .catch((error) => console.error(error));
  });
};
convertImages(".svg-icon");
