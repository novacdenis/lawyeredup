import createNotification from "./createNotification";

function setUserImage() {
  const container = document.querySelector("#user-set-image");
  if (container) {
    const input = container.querySelector("#changedImageInput");
    const btn = container.querySelector("#changedImageBtn");
    const preview = container.querySelector("#changedImagePreview");

    btn.addEventListener("click", () => {
      input.click();
    });

    input.addEventListener("change", () => {
      readURL(input, preview);
    });
  }
}
setUserImage();

function readURL(input, preview) {
  const accepted = [".doc", ".docx", ".png", ".pdf", ".jpg", ".jpeg"];

  if (input.files && input.files[0]) {
    const ext = input.files[0].name.split(".").pop();
    if (!accepted.includes(`.${ext}`)) {
      createNotification("error", `Extensie interzisă '${ext}'`);
      return;
    }
    var reader = new FileReader();

    reader.onload = function (e) {
      preview.src = e.target.result;
    };

    reader.readAsDataURL(input.files[0]);
  }
}
