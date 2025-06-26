// src/lib.rs
pub mod s3;
pub mod messaging;
pub mod types;

pub fn hello_shared() -> &'static str {
    "Hello from shared-rust"
}
