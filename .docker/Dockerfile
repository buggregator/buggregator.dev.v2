FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    xz-utils \
    && rm -rf /var/lib/apt/lists/*

# Install Wippy CLI, pinned. «latest» let every site release pick up a new
# runtime unannounced, and one of them broke the app (/api 502, 2026-11-16).
# To upgrade: change both values (sha256 of wippy-linux-amd64 from
# https://hub.wippy.ai/api/v1/releases?channel=stable), build and run the
# image, check /api/public/github/stats, then release.
ARG WIPPY_VERSION=0.3.63a
ARG WIPPY_SHA256=5be941d02f1d48d2d44018c9651cd7e8d0082e86a3713c3ab7f0d010dd55d4a0
RUN mkdir -p /root/.wippy/bin \
    && curl --proto '=https' --tlsv1.2 -fsSL --retry 3 \
       -o /root/.wippy/bin/wippy \
       "https://hub.wippy.ai/api/v1/releases/${WIPPY_VERSION}/download/linux/amd64" \
    && echo "${WIPPY_SHA256}  /root/.wippy/bin/wippy" | sha256sum -c - \
    && chmod +x /root/.wippy/bin/wippy
ENV PATH="/root/.wippy/bin:${PATH}"

WORKDIR /app

ARG CACHE_DATE=2

# Copy runtime config
COPY wippy.lock ./
COPY .docker/.wippy.yaml ./

# Copy application source
COPY src/ ./src/

# Initialize and install dependencies.
# Drop the empty npm artifact dir that install leaves behind: on start the
# runtime renames it to a backup, and a rename of a directory from an image
# layer fails on overlayfs (EXDEV, "invalid cross-device link"). Without it
# the runtime creates the dir in the container layer.
RUN wippy install \
    && rm -rf /app/.wippy/npm

EXPOSE 8080

CMD ["wippy", "run", "-c"]
