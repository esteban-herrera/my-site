+++
title = "My dev environment fits on an iPad"
date = 2026-10-12
description = "Blink, mosh, and tmux: a real development setup on an iPad, and the small things that don't work."
[taxonomies]
tags = ["tools", "ipad", "terminal"]
+++

Most of my development happens on an iPad. The iPad doesn't run any of it.
It's a window into a Linux container, and the whole setup is three pieces:
**Blink Shell** on the iPad, **mosh** for the connection, and a terminal
multiplexer on the other end.

<!-- more -->

## The pieces

**Blink** is the terminal app. It speaks SSH and mosh, supports true color,
and handles the clipboard escape codes I describe below. It also has a
`build` command that connects to a container by running `tmux new -Asbuild`
on the remote side.

**mosh** replaces SSH for the interactive session. An SSH connection dies when
the iPad sleeps or switches networks. A mosh session just picks up where it
left off, which matters a lot on a device that's constantly being closed and
reopened.

**A multiplexer** keeps everything running on the server side between visits.
I started with tmux and now use herdr for the main session. Because Blink
always runs `tmux new -Asbuild`, I put a small shim in front of tmux that
catches exactly that call and starts herdr instead:

```sh
# Blink's `build` command connects by running `tmux new -Asbuild`.
# That call launches herdr instead; everything else goes to the real tmux.
if [ "$*" = "new -Asbuild" ] && [ ! -e "$HOME/.use-tmux" ]; then
    exec "$HOME/.local/bin/herdr"
fi
exec /usr/bin/tmux "$@"
```

`touch ~/.use-tmux` switches back, so trying a new tool is cheap.

## What works well

- **Touch and the trackpad.** With `set -g mouse on` in tmux and `mouse = "a"`
  in Neovim, tapping to place the cursor and scrolling with two fingers both
  behave the way you'd expect.
- **Copying to the iPad clipboard.** Terminals support an escape code (OSC 52)
  that lets a program put text on the *local* clipboard, even from the far end
  of a remote session. Blink supports it, so a yank in tmux copy mode or in
  Neovim lands on the iPad clipboard and I can paste it into any app.
- **Everything else is just Linux.** Editors, language servers, git, and builds
  all run on the server, so the iPad's limits mostly don't matter.

## What doesn't

- **Pasting from the iPad clipboard via OSC 52.** Copying out works; reading
  the clipboard back in over the same escape code isn't supported in Blink.
  I paste with Cmd-V instead, and in Neovim `"+p` falls back to the yank
  register.
- **Nerd Font icons.** Blink's default font doesn't include the icon glyphs
  that many terminal tools assume, so they show up as boxes. I configure tools
  to use plain characters instead.
- **Anything that asks the terminal a question.** Some programs query the
  terminal (for example, "is your background light or dark?") and wait for an
  answer. mosh doesn't pass those answers through, and the programs usually
  fail silently. I wrote about one case in
  [Why my file manager had no colors](@/blog/file-manager-no-colors.md).
- **Time zones.** The container's clock is in UTC, so the clock in the
  multiplexer's tab bar was wrong until I set `TZ` myself.

## Would I recommend it?

If most of your work is in a terminal, it's a surprisingly complete setup. The
rough edges are small and fixable. The tradeoff is that the server side has to
be easy to rebuild, which is its own story:
[Designing for a container that forgets](@/blog/container-that-forgets.md).
