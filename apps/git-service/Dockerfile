# Stage 1: Build the Rust application
FROM rust:1.73 as builder

# Set working directory for the build
WORKDIR /usr/src/git-service

# Copy the Cargo.toml and Cargo.lock files to cache dependencies
COPY Cargo.toml Cargo.lock ./

# Create a dummy main.rs to build dependencies (for caching)
RUN mkdir src && echo "fn main() {}" > src/main.rs
RUN cargo build --release

# Copy the actual source code and build the application
COPY src ./src
# Remove the dummy main.rs build artifact to ensure a full rebuild with actual code
RUN rm -f target/release/deps/git_service*
RUN cargo build --release

# Stage 2: Create a minimal runtime image
FROM debian:bullseye-slim

# Set working directory for the runtime
WORKDIR /app

# Install any necessary runtime dependencies (e.g., for SSL or networking)
RUN apt-get update && apt-get install -y \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /usr/src/git-service/target/release/git-service .

# Set environment variables for AWS and LocalStack
# These ensure the service connects to LocalStack instead of real AWS
ENV AWS_ACCESS_KEY_ID=test
ENV AWS_SECRET_ACCESS_KEY=test
ENV AWS_DEFAULT_REGION=us-east-1
ENV AWS_ENDPOINT_URL=http://localstack:4566

EXPOSE 8092

CMD ["./git-service"]
