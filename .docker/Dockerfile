FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    xz-utils \
    && rm -rf /var/lib/apt/lists/*

# Install Wippy CLI (direct download, bypassing install.sh verification)
RUN mkdir -p /root/.wippy/bin \
    && curl --proto '=https' --tlsv1.2 -fsSL --retry 3 \
       -o /root/.wippy/bin/wippy \
       "https://hub.wippy.ai/api/v1/releases/latest/download/linux/amd64?channel=stable" \
    && chmod +x /root/.wippy/bin/wippy
ENV PATH="/root/.wippy/bin:${PATH}"

WORKDIR /app

ARG CACHE_DATE=2

# Copy runtime config
COPY wippy.lock ./
COPY .docker/.wippy.yaml ./

# Copy application source
COPY src/ ./src/

# Initialize and install dependencies
RUN wippy install

EXPOSE 8080

CMD ["wippy", "run", "-c"]
