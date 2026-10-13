+++
title = "Building a photo gallery in Zola"
date = 2026-10-12
description = "Turning a folder of photos into an album with build-time thumbnails, a lightbox, and no image service."
[taxonomies]
tags = ["zola", "photography", "web"]
+++

The photo section of this site has no image service, no upload step, and no
JavaScript framework. An album is a folder of photos, and Zola does the rest
at build time.

<!-- more -->

## One folder per album

Each album is a folder in `content/photos/` with an `index.md` and the image
files next to it:

```
content/photos/
├── _index.md          ← the gallery page
└── sample-roll/
    ├── index.md       ← title, date, a few words
    ├── 01.jpg
    ├── 02.jpg
    └── ...
```

The gallery's `_index.md` sets two templates: one for the list of albums and
one for each album page.

```toml
+++
title = "Photos"
sort_by = "date"
template = "gallery.html"
page_template = "album.html"
+++
```

Adding an album means making a folder, dropping photos in, and writing three
lines of front matter.

## Thumbnails at build time

Zola lists the files next to a page in `page.assets`, and its
`resize_image` function makes resized copies during the build. The album
template loops over the images and makes two versions of each: a square
thumbnail for the grid, and a large version for viewing.

{% raw %}
```jinja
{% for asset in page.assets | sort %}
  {% if asset | lower | split(pat=".") | last in ["jpg", "jpeg", "png", "webp"] %}
    {% set thumb = resize_image(path=asset, width=500, height=500, op="fill", format="auto", quality=85) %}
    {% set full = resize_image(path=asset, width=2000, height=2000, op="fit", format="auto", quality=85) %}
    <a href="{{ full.url }}">
      <img src="{{ thumb.url }}" width="{{ thumb.width }}" height="{{ thumb.height }}" alt="" loading="lazy">
    </a>
  {% endif %}
{% endfor %}
```
{% endraw %}

`op="fill"` crops to fill the square; `op="fit"` scales down to fit inside
2000×2000 without cropping. Zola caches the results, so later builds only
process new photos.

The gallery page uses the same trick to make a cover image for each album from
its first photo.

## Why `format="auto"` and not WebP

My first version converted everything to WebP. The build failed on a
black-and-white image: Zola's WebP encoder rejects grayscale JPEGs. With
`format="auto"`, JPEGs stay JPEGs and PNGs stay PNGs, and black-and-white
photos are fine.

## A small lightbox

Clicking a thumbnail opens the photo in a full-screen overlay, with arrow keys
for next and previous. It's a small web component, a custom HTML element with
a bit of JavaScript, wrapped around the grid:

```js
class PhotoLightbox extends HTMLElement {
  connectedCallback() {
    this.links = [...this.querySelectorAll("a")];
    this.dialog = document.createElement("dialog");
    this.img = document.createElement("img");
    this.dialog.append(this.img);
    this.append(this.dialog);
    this.links.forEach((a, i) =>
      a.addEventListener("click", (e) => { e.preventDefault(); this.show(i); })
    );
    // ...close on click, arrow keys to move
  }
  show(i) {
    this.index = (i + this.links.length) % this.links.length;
    this.img.src = this.links[this.index].href;
    if (!this.dialog.open) this.dialog.showModal();
  }
}
customElements.define("photo-lightbox", PhotoLightbox);
```

The browser's built-in `<dialog>` element handles the overlay, focus, and the
Esc key. Without JavaScript, each thumbnail is still a link to the full image.

## Tip: export at a sensible size first

Zola publishes the original files alongside the resized ones. A folder of
40-megapixel originals makes the site huge and gives anyone the full-resolution
files. Export at about 2500px on the long edge before adding photos, and let
Zola make the smaller sizes from there.
