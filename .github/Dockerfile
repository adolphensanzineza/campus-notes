# Used ONLY to publish the convenience image `sunkic/campus-notes`.
# It is deliberately NOT at the repository root: writing the Dockerfile is the
# Day 3 afternoon exercise, and `docker build .` from the root must pick up the
# one the participant writes, not this one.
#
# This file is kept in sync by hand with the reference Dockerfile in
# lesson-plans/day2-pm.md section 11.1 of the course materials.

FROM node:24-slim AS deps

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Prepare writable data directory for the non-root user
RUN mkdir -p /data \
    && chown 65532:0 /data \
    && chmod 0755 /data


FROM gcr.io/distroless/nodejs24-debian13

WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000 \
    DB_PATH=/data/campus-notes.db

COPY --from=deps --chown=65532:0 /app/node_modules ./node_modules

COPY --chown=65532:0 src ./src
COPY --chown=65532:0 public ./public
COPY --chown=65532:0 seed ./seed

# Copy the pre-created writable directory into the distroless image
COPY --from=deps --chown=65532:0 /data /data

USER 65532

EXPOSE 3000

CMD ["src/server.js"]
