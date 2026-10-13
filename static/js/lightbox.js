// <photo-lightbox>: click a thumbnail link to view the full image in a dialog.
// Arrow keys move between photos; Esc or click closes. Without JS, links just open the image.
class PhotoLightbox extends HTMLElement {
  connectedCallback() {
    this.links = [...this.querySelectorAll("a")];
    this.dialog = document.createElement("dialog");
    this.dialog.className = "lightbox";
    this.img = document.createElement("img");
    this.dialog.append(this.img);
    this.append(this.dialog);

    this.links.forEach((a, i) =>
      a.addEventListener("click", (e) => {
        e.preventDefault();
        this.show(i);
      })
    );
    this.dialog.addEventListener("click", () => this.dialog.close());
    this.dialog.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") this.show(this.index + 1);
      if (e.key === "ArrowLeft") this.show(this.index - 1);
    });
  }

  show(i) {
    this.index = (i + this.links.length) % this.links.length;
    this.img.src = this.links[this.index].href;
    if (!this.dialog.open) this.dialog.showModal();
  }
}

customElements.define("photo-lightbox", PhotoLightbox);
