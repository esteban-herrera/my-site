+++
title = "Hello, world"
date = 2026-10-13
description = "First post on the new site."
[taxonomies]
tags = ["meta"]
+++

This site is built with [Zola](https://www.getzola.org). Posts are plain
Markdown files in `content/blog/`.

<!-- more -->

Code blocks work as you'd expect:

```rust
fn main() {
    println!("Hello, world!");
}
```

Images can live next to a post (make the post a folder with an `index.md`)
and be inserted with the `figure` component from `templates/components.html`:

```
{% raw %}{{<figure src="blog/my-post/photo.jpg" alt="Description" caption="Optional caption" />}}{% endraw %}
```
