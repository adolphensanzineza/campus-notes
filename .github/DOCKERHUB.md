# campus-notes

> ## ⚠ DELIBERATELY INSECURE — CLASSROOM USE ONLY
>
> This image is built to be attacked and repaired by students. It ships with SQL injection, stored
> XSS, a hardcoded signing secret, path traversal, MD5 password hashing, a missing authorisation
> check and a knowingly outdated dependency. **None of them are bugs. All of them are the syllabus.**
>
> Never run it on a host reachable from the internet, and never put real data in it.

A small note board for a polytechnic department, used as the worked application for the Rwanda
Polytechnic *Development Operations* module (ITLDO801).

## Run it

```bash
docker run --rm -p 3000:3000 -e SESSION_SECRET=lab-only sunkic/campus-notes:seed
```

Then open `http://localhost:3000`. Sign in as `admin` / `admin123`.

`SESSION_SECRET` is set because it is the interface the application is *supposed* to have — and
this image ignores it, because the signing secret is hardcoded. That is one of the defects. Once it
is fixed, the application refuses to start without the variable.

## Tags

| Tag | What it is |
|---|---|
| `seed` | The application as students first meet it, with every defect present |
| `latest` | The same image |

## Source

https://github.com/sun-kic/campus-notes — built from that repository by a workflow in it.
