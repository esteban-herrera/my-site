+++
title = "Why my file manager had no colors (and no error)"
date = 2026-10-12
description = "yazi silently skipped its theme over mosh. The fix, and the general lesson about programs that ask the terminal questions."
[taxonomies]
tags = ["tools", "terminal", "debugging"]
+++

I installed [yazi](https://yazi-rs.github.io), a terminal file manager, and
set it up with the Catppuccin Mocha theme to match the rest of my tools. It
launched with no theme at all: default colors, no warnings, no error.

<!-- more -->

## The setup

yazi themes are called *flavors*. You install one with yazi's package manager
and point `theme.toml` at it, with separate choices for dark and light
terminals:

```toml
[flavor]
dark = "catppuccin-mocha"
```

The flavor was installed and the config was correct. It just never applied.

## The cause

To choose between `dark` and `light`, yazi asks the terminal whether its
background is light or dark, using an escape-code query, and waits for the
reply.

I connect over **mosh**, from Blink on an iPad, into a multiplexer. mosh
keeps its own copy of the screen and only sends screen updates to the
terminal. That query never gets through, so no answer ever comes back.

When yazi doesn't get an answer, it doesn't fall back to `dark` or print a
warning. It just doesn't load the flavor.

## The fix

I removed the `[flavor]` section and copied the Catppuccin Mocha colors
straight into my own `theme.toml`, with a comment so future me knows why:

```toml
# Catppuccin Mocha for yazi, inlined from the yazi-rs/flavors catppuccin-mocha flavor.
# Not using [flavor]: yazi only applies a flavor after detecting dark/light mode from the
# terminal, and that query doesn't make it through mosh/tmux, so the flavor never loaded.

[mgr]
cwd = { fg = "#94e2d5" }
border_style = { fg = "#7f849c" }
```

With no detection step, there's nothing to fail. While I was in there, I also
swapped the Nerd Font icon glyphs for plain characters, since Blink's default
font doesn't include them.

## The general lesson

**Features that depend on the terminal answering a question fail quietly over
mosh and tmux.** Light/dark detection is the one that bit me, but anything that
queries the terminal and waits for a reply is in the same category.

When a tool works on a local terminal but quietly behaves differently over a
remote session, the first question I ask now is: *is it waiting for the
terminal to tell it something?* If it is, the fix is usually to configure that
value explicitly instead of letting the tool detect it.
