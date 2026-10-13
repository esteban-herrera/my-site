+++
title = "Do you need a non-root user in a throwaway container?"
date = 2026-10-12
description = "When the only user that persists is root, another user doesn't make anything easier."
[taxonomies]
tags = ["containers", "opinion"]
+++

"Don't run as root" is one of the first rules you learn about Linux, and it
gets repeated for containers too. In my development container, I run as root
anyway. Here's why.

<!-- more -->

## The usual advice

Running as an ordinary user limits the damage from mistakes and from
compromised software. A stray `rm -rf` or a malicious install script can only
touch what that user owns. For servers, shared machines, and production
container images, that's good advice and I follow it.

## Why it doesn't pay off here

My dev container gets rebuilt from a base image, and
[only `/root` survives the rebuild](@/blog/container-that-forgets.md). My
dotfiles, my tools in `~/.local/bin`, and my projects all live there because
it's the only place that lasts.

A second user would have a home directory somewhere else, and that directory
would be wiped on every rebuild. So I'd have to recreate the user each time,
and either keep my files in `/root` anyway or lose them. I'd still need root
to install anything outside my home directory, so I'd end up running `sudo`
constantly.

All the cost of the usual advice, and none of the benefit. The thing it
protects, the system outside my home directory, is the part that gets thrown
away and rebuilt from scratch regardless.

**If the only user that persists is root, another user doesn't make anything
easier.**

## When it still does

This is about a personal, disposable environment. A non-root user is still
worth it when:

- **Other people share the machine.** Separate users are how you keep them
  apart.
- **The image runs in production.** A service shouldn't have more privileges
  than it needs.
- **The container mounts files from the host.** Files written by root inside
  the container can end up owned by root on the host.
- **The persistent storage is designed around a normal user.** If the
  platform keeps `/home/dev` instead of `/root`, the argument flips.

Best practices are answers to specific problems. It's worth asking whether you
actually have the problem before paying for the answer.
