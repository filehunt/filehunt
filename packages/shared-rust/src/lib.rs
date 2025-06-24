// src/lib.rs
pub mod s3;

pub fn hello_shared() -> &'static str {
    "Hello from shared-rust"
}
