FROM rust:1.87-slim AS builder

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    pkg-config \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy shared rust package first
COPY packages/shared-rust ./packages/shared-rust

# Copy the file-indexer
COPY workers/file-indexer ./workers/file-indexer

# Build the application
WORKDIR /app/workers/file-indexer
RUN cargo build --release

# Runtime stage
FROM debian:bookworm-slim

WORKDIR /app

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    ca-certificates \
    libssl3 \
    && rm -rf /var/lib/apt/lists/*

# Copy the binary
COPY --from=builder /app/workers/file-indexer/target/release/file-indexer /app/file-indexer

# Create log directory
RUN mkdir -p /var/log/file-indexer

# Run the application
CMD ["./file-indexer"]