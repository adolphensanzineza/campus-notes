# campus-notes

> **WARNING:** campus-notes is deliberately insecure. It exists to be attacked and repaired in a classroom. Never expose it beyond an isolated lab network, never put real data in it, and never deploy it anywhere reachable from the internet.

## What is campus-notes?

campus-notes is a small note board application for a polytechnic department. It allows authenticated users to read shared notes posted by their colleagues. The application includes:

- User login with JWT-based authentication (cookie-carried)
- Posting notes with title and body content
- Reading notes posted by other users
- Downloading a course file archive
- Administrator user list endpoint

## How to run

### From a published image, without building anything

A prebuilt image of this exact source is published on Docker Hub. This is the quickest way to see
the application working, and it is what the course uses for its first Docker exercise:

```bash
To be set after learning containerization 
```

Then open `http://localhost:3000`.

The image carries every one of the defects described below. **It is published for classroom use
only.** Do not run it on a host reachable from the internet.

`SESSION_SECRET` is set in that command because it is the interface the application is *supposed*
to have — and this image ignores it. The signing secret is hardcoded in `src/auth.js`, which is one
of the defects. Setting the variable does no harm, it simply has no effect until the defect is
fixed, at which point the application refuses to start without it. That gap between the interface a
program advertises and the one it honours is worth noticing.

### From source

```bash
npm install
npm start
```

The application runs on `http://localhost:3000`.

## Seed accounts

The application is seeded with three user accounts on first run:

| Username | Password | Role |
|---|---|---|
| admin | admin123 | admin |
| mutesi | lab-week-3 | staff |
| kamana | marking28 | staff |

## About the defects

This application contains intentional security vulnerabilities and implementation flaws. They are not bugs — they are the teaching material for this course. The seven defects and their remediation are central to the curriculum; participants discover them through practical exercises and fix them over the course of Day 3 and Day 4. For details, see the course materials.

Data written by participants persists across container restarts, by design.

## What is in `.github/`

`.github/` holds the machinery that publishes the Docker Hub image described above — a `Dockerfile`
and a workflow. **It is not part of any exercise.**

The `Dockerfile` lives there, rather than at the repository root, on purpose: writing that file is
the Day 3 afternoon exercise, and `docker build .` from the root must pick up the one you write,
not this one. Nothing else in this repository depends on `.github/`, and you can ignore it
entirely.
