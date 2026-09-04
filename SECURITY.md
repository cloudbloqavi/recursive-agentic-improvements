# Security Policy

This repository ships **Markdown files** — Claude Code skills and reference
docs. There is no server, no database, and no code that runs with your
credentials. The main risks worth reporting are:

- A skill file (`.claude/commands/*.md`) instructing an AI agent to do
  something unsafe (e.g. run a destructive command, leak a secret, skip
  the confirmation gate described in `CLAUDE.md`).
- The `installer/` package (the `npx` install script) doing something it
  shouldn't to a user's project or machine.
- A dependency or generated snippet in `docs/` that recommends an insecure
  pattern (e.g. hardcoding an API key in example code).

## Reporting a problem

Please **do not open a public issue** for a security concern. Instead,
use GitHub's private "Report a vulnerability" form under this repository's
**Security** tab. Include:

- Which file(s) are affected.
- What an attacker (or a careless copy/paste) could do with it.
- A minimal way to reproduce the problem, if you have one.

We aim to acknowledge reports within a few days. Since this project has
no runtime and no CI secrets (see `CLAUDE.md`), most fixes are a small,
surgical edit to the affected Markdown file rather than a release.

## Supported versions

This repository does not use version branches. Security fixes land on
`main` only — please make sure you are looking at the latest version of
a skill or doc file before reporting an issue with it.
