+++
title = "Designing for a container that forgets"
date = 2026-10-12
description = "A practical guide to a reproducible personal environment when only your home directory survives a rebuild."
[taxonomies]
tags = ["tools", "containers", "dotfiles"]
+++

My development environment lives in a container that gets rebuilt from a base
image. When that happens, only `/root`, my home directory, survives. Anything
installed with `apt`, anything in `/usr/local/bin`, any symlink outside home:
gone.

That one constraint shaped the whole setup. The rule is simple: **everything I
care about lives in my home directory, and everything outside it gets recreated
automatically.**

<!-- more -->

## Dotfiles in a bare git repo

My config files are tracked in a *bare* git repository at `~/.cfg`, with my
home directory as the work tree. There's no symlink farm and no install
script for dotfiles: the files are just in their normal places, under version
control.

The whole trick is one alias:

```sh
alias config='/usr/bin/git --git-dir=$HOME/.cfg/ --work-tree=$HOME'
```

Then `config status`, `config add ~/.tmux.conf`, `config commit`, and
`config push` work like regular git. On a fresh machine, cloning the repo
with `--bare` and running `config checkout` puts everything back.

## A setup script that restores everything else

Tools that aren't in the base image go in `~/.local/bin`, which survives
because it's under home. A script called `setup-tools` installs them, and
it's safe to re-run: it only installs what's missing.

```sh
have() { [ -x "$BIN/$1" ]; }

have zoxide || install_tar ajeetdsouza/zoxide 'x86_64-unknown-linux-musl\.tar\.gz$' zoxide
have eza    || install_tar eza-community/eza 'eza_x86_64-unknown-linux-musl\.tar\.gz$' eza
have bat    || install_tar sharkdp/bat 'x86_64-unknown-linux-musl\.tar\.gz$' bat
have delta  || install_tar dandavison/delta 'x86_64-unknown-linux-musl\.tar\.gz$' delta
```

`install_tar` asks the GitHub API for the latest release, picks the asset
that matches the pattern, and copies the binary into `~/.local/bin`. A few
choices make this robust:

- **Static (musl) builds** where possible, so the binaries don't depend on
  whatever libraries the base image happens to have.
- **Newer versions than the image provides.** The image ships Neovim 0.9; my
  plugins need 0.10 or later, so the script installs the current release into
  `~/.local/nvim` and symlinks it into `~/.local/bin`.
- **Plugin state comes from a lockfile.** yazi records its themes in
  `package.toml` with a pinned revision and hash, and the script runs
  `ya pkg install` to restore them.

## Skipping apt

I don't use `apt` for anything I'd miss. Packages installed that way go into
system directories, which the rebuild wipes, so they'd need reinstalling every
time. Downloading a release binary into home avoids the problem entirely, and
`setup-tools` makes that as easy as `apt install`.

## Recreating what has to live outside home

Some things genuinely need to exist outside home. Blink connects by running
`tmux`, and I wanted that to go through a small wrapper script. The wrapper
lives in `~/.local/bin`, and `.bashrc` re-creates the symlink on every shell
start if it's missing:

```sh
[ -L /usr/local/bin/tmux ] || ln -sf ~/.local/bin/tmux-shim /usr/local/bin/tmux 2>/dev/null
```

The pattern generalizes: anything outside home is a cache that can be rebuilt
from something inside home.

## Lessons for any setup

- Decide what survives, and put everything important there.
- Make restore scripts idempotent, so "run it again" is always the answer.
- Prefer self-contained binaries over system packages.
- Pin versions where it matters (lockfiles), float them where it doesn't.

None of this is specific to containers. Treating my environment as something
that can vanish at any time made it something I can rebuild anywhere.
