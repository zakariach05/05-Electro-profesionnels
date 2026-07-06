# ─── Build arguments (must be declared at top AND re-declared after each FROM) ─
ARG REACT_APP_API_URL=http://localhost/api
ARG REACT_APP_GOOGLE_CLIENT_ID=
ARG REACT_APP_RECAPTCHA_SITE_KEY=
ARG REACT_APP_SITE_URL=http://localhost
ARG REACT_APP_DEFAULT_LANG=fr

# ─── Dependencies stage ──────────────────────────────────────
FROM node:20-alpine AS deps

WORKDIR /app

COPY Frond-end/test/package.json Frond-end/test/package-lock.json ./
RUN npm ci --no-audit --no-fund --ignore-scripts --legacy-peer-deps

# ─── Development stage (CRA dev server with HMR) ────────────
FROM node:20-alpine AS development

# Re-declare ARGs so they are accessible in this stage
ARG REACT_APP_API_URL
ARG REACT_APP_GOOGLE_CLIENT_ID
ARG REACT_APP_RECAPTCHA_SITE_KEY
ARG REACT_APP_SITE_URL
ARG REACT_APP_DEFAULT_LANG

WORKDIR /app

# HOST=0.0.0.0 is REQUIRED: makes CRA dev server bind to all interfaces
# so Nginx can proxy to it from another container (react:3000).
# Without this, the server only listens on 127.0.0.1 inside the container.
ENV NODE_ENV=development \
    PORT=3000 \
    HOST=0.0.0.0 \
    REACT_APP_API_URL=$REACT_APP_API_URL \
    REACT_APP_GOOGLE_CLIENT_ID=$REACT_APP_GOOGLE_CLIENT_ID \
    REACT_APP_RECAPTCHA_SITE_KEY=$REACT_APP_RECAPTCHA_SITE_KEY \
    REACT_APP_SITE_URL=$REACT_APP_SITE_URL \
    REACT_APP_DEFAULT_LANG=$REACT_APP_DEFAULT_LANG \
    CHOKIDAR_USEPOLLING=true \
    WATCHPACK_POLLING=true \
    FAST_REFRESH=true \
    ESLINT_NO_DEV_ERRORS=true \
    CI=true \
    WDS_SOCKET_PORT=0

COPY --from=deps /app/node_modules /app/node_modules
COPY Frond-end/test/public /app/public/
COPY Frond-end/test/src /app/src/
COPY Frond-end/test/package.json Frond-end/test/package-lock.json ./
COPY Frond-end/test/tailwind.config.js Frond-end/test/postcss.config.js* ./

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=15s --retries=5 --start-period=120s \
    CMD wget -qO- http://127.0.0.1:3000 > /dev/null 2>&1 || exit 1

CMD ["npm", "start"]

# ─── Build stage ─────────────────────────────────────────────
FROM node:20-alpine AS build

# Re-declare ARGs so they are accessible in this stage
ARG REACT_APP_API_URL
ARG REACT_APP_GOOGLE_CLIENT_ID
ARG REACT_APP_RECAPTCHA_SITE_KEY
ARG REACT_APP_SITE_URL
ARG REACT_APP_DEFAULT_LANG

WORKDIR /app

ENV REACT_APP_API_URL=$REACT_APP_API_URL \
    REACT_APP_GOOGLE_CLIENT_ID=$REACT_APP_GOOGLE_CLIENT_ID \
    REACT_APP_RECAPTCHA_SITE_KEY=$REACT_APP_RECAPTCHA_SITE_KEY \
    REACT_APP_SITE_URL=$REACT_APP_SITE_URL \
    REACT_APP_DEFAULT_LANG=$REACT_APP_DEFAULT_LANG

COPY Frond-end/test/package.json Frond-end/test/package-lock.json ./
RUN npm ci --no-audit --no-fund --ignore-scripts --legacy-peer-deps

COPY Frond-end/test/ .
RUN DISABLE_ESLINT_PLUGIN=true npm run build

# ─── Production stage ────────────────────────────────────────
# This stage is a static file carrier only.
# It copies the compiled React build into /build so Docker can
# initialize the named volume "react-build" with those files.
# Nginx then serves them directly — NO HTTP server runs here.
FROM alpine:3.19 AS production

# Copy built assets from build stage
COPY --from=build /app/build /build

# Verify the build was not empty (safety check at image creation time)
RUN test -f /build/index.html || (echo "ERROR: React build failed — index.html missing" && exit 1)

# HEALTHCHECK NONE: this container has no running server — it is just a
# volume initializer. Docker will mark it "healthy" immediately (no check).
HEALTHCHECK NONE

# Keep container alive so Docker tracks it; Nginx reads from the shared volume
CMD ["tail", "-f", "/dev/null"]
