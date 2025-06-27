FROM rust:1.75-slim as builder

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    pkg-config \
    libssl-dev \
    libgit2-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy workspace files
COPY Cargo.toml Cargo.lock ./
COPY packages ./packages
COPY apps/git-service ./apps/git-service

# Build the application
WORKDIR /app/apps/git-service
RUN cargo build --release

# Runtime stage
FROM debian:bookworm-slim

WORKDIR /app

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    ca-certificates \
    libssl3 \
    libgit2-1.5 \
    && rm -rf /var/lib/apt/lists/*

# Copy the binary
COPY --from=builder /app/apps/git-service/target/release/git-service /app/git-service

# Create directories
RUN mkdir -p /var/git-repositories /var/log/git-service

# Expose port
EXPOSE 3000

# Run the application
CMD ["./git-service"]