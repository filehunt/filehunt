#!/bin/bash

# Build script for file-service
set -e

echo "Building file-service..."

# Navigate to file-service directory
cd "$(dirname "$0")/../apps/file-service"

# Check if we're in the right directory
if [ ! -f "Cargo.toml" ]; then
    echo "Error: Not in file-service directory"
    exit 1
fi

# Clean previous builds
echo "Cleaning previous builds..."
cargo clean

# Build in release mode
echo "Building in release mode..."
cargo build --release

# Run tests
echo "Running tests..."
cargo test

# Check formatting
echo "Checking code formatting..."
cargo fmt --check

# Run clippy for linting
echo "Running clippy..."
cargo clippy -- -D warnings

echo "Build completed successfully!"
echo "Binary available at: target/release/file-service"