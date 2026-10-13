+++
title = "Why my file manager had no colors (and no error)"
date = 2026-10-13
description = "yazi silently skipped its theme over mosh. The fix, and the general lesson about terminal queries."
draft = true
[taxonomies]
tags = ["tools", "terminal", "debugging"]
+++

## The symptom: no colors, no error

## The cause: yazi asks the terminal whether it's in dark mode, and mosh blocks the question

## The fix: copying the Catppuccin colors straight into theme.toml

## The general lesson

Features that depend on the terminal answering a query fail quietly over mosh and tmux.
