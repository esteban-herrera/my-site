+++
title = "Choosing Zola over Astro for a personal site"
date = 2026-10-12
description = "What drew me to zine-ssg.io, why I ended up with Zola instead of Astro, and how I'll add interactive pieces to a static site."
[taxonomies]
tags = ["meta", "zola", "web"]
+++

I wanted a simple place for writing, a few projects, and some photography.
The site that set the bar was [zine-ssg.io](https://zine-ssg.io): plain, fast,
mostly text, and nice to look at. This is how I got from there to the site
you're reading.

<!-- more -->

## What I liked about Zine

Zine is a static site generator written in Zig, and its own site shows off
the style: a narrow column, lots of white space, almost no JavaScript. Zine is
a single binary with nothing to install around it.

The catch is that Zine is still pre-1.0, and it doesn't resize images. For a
site that's partly photography, I wanted thumbnails and web-sized versions
generated for me.

I also realized the look I liked comes mostly from CSS, not from the
generator. Any tool could produce it. So the real question became which
generator I wanted to live with.

## Zola vs. Astro

I narrowed it down to two.

**[Zola](https://www.getzola.org)** is a single Rust binary, like Zine. Content
is Markdown, templates use a Jinja-like language called Tera, and it has image
resizing, feeds, tags, and syntax highlighting built in. There are no plugins:
what's built in is what you get.

**[Astro](https://astro.build)** is a JavaScript framework for content sites.
It ships no JavaScript to visitors by default, has the best image handling of
anything I looked at, and lets you drop in interactive components ("islands")
from React, Svelte, or plain JS. The cost is Node, npm, a `node_modules` folder,
and dependency updates to keep up with.

## What tipped it

The thing that gave me pause about Zola was interactivity. Some of my projects
would be better shown than described. Would I be stuck?

It turns out a static site doesn't need a framework for that. JavaScript runs in
the browser no matter what generated the HTML. Zola copies everything in
`static/` straight to the site, and the rest is plumbing. That settled it:
Zola's simplicity for the 95% case, and plain web tools for the rest.

## The plan for interactive pieces

From simplest to most involved:

1. **Scripts loaded only on pages that need them.** A page lists scripts in its
   front matter (`scripts = ["demo.js"]`), and the base template includes them.
   Every other page stays JavaScript-free.
2. **Web components.** Custom HTML elements are built into the browser and need
   no build step. The photo lightbox on this site is one:
   `<photo-lightbox>` wraps the thumbnails, and without JavaScript the links
   still just open the full image.
3. **Small libraries from a CDN** like Alpine.js or Preact, still with no build
   step.
4. **A separate build for big demos.** A full app can live in its own folder,
   built with Vite into `static/demos/<name>/`, and embedded or linked from a
   project page.

If I end up doing step 4 all the time, that's the sign Astro would have been
the better choice. For a blog with the occasional demo, I don't expect to get
there.

## One surprise

Zola 0.23, released in August 2026, was a big breaking release. Shortcodes are
gone, replaced by *components* from Tera v2, and macros went with them. Most
Zola themes and tutorials online still use the old syntax, so I wrote my
templates from scratch against the new version. The new components are nicer,
but it's worth knowing before you copy an example from the internet.

## The result

The whole site is a few templates, one stylesheet, and the
[Paper Mono](https://github.com/paper-design/paper-mono) font. It builds in
under a second, deploys to GitHub Pages on every push, and the photo gallery is
covered in its own post: [Building a photo gallery in Zola](@/blog/zola-photo-gallery.md).
