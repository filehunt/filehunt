FROM rust:1.87-slim AS builder

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    pkg-config \
    libssl-dev \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy shared rust package first
COPY packages/shared-rust ./packages/shared-rust

# Copy the file-service
COPY apps/file-service ./apps/file-service

# Build the application
WORKDIR /app/apps/file-service
RUN cargo build --release

# Runtime stage
FROM debian:bookworm-slim

WORKDIR /app

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    ca-certificates \
    libpq5 \
    libssl3 \
    && rm -rf /var/lib/apt/lists/*

# Copy the binary
COPY --from=builder /app/apps/file-service/target/release/file-service /app/file-service

# Create log directory
RUN mkdir -p /var/log/file-service

# Expose port
EXPOSE 3001

# Run the application
CMD ["./file-service"]