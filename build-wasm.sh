#!/bin/bash

# Build script for WASM modules

echo "Building Rust WASM module..."
cd rust-backend
wasm-pack build --target web --out-dir ../public/wasm
cd ..

echo "Preparing Python modules..."
mkdir -p public/python-modules
cp python-wasm/*.py public/python-modules/

echo "WASM modules built successfully!"
echo "Rust WASM: public/wasm/"
echo "Python modules: public/python-modules/"