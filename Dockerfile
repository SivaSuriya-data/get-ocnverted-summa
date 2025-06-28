# Multi-stage Dockerfile for the complete exam converter system

# Stage 1: Build Rust WASM
FROM rust:1.70 as rust-builder

# Install wasm-pack
RUN curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh

WORKDIR /app/rust-backend

# Copy Rust source
COPY rust-backend/Cargo.toml rust-backend/Cargo.lock ./
COPY rust-backend/src ./src

# Build WASM module
RUN wasm-pack build --target web --out-dir ../public/wasm

# Stage 2: Build Python WASM modules
FROM python:3.11-slim as python-builder

# Install required packages for building Python WASM
RUN apt-get update && apt-get install -y \
    build-essential \
    wget \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy Python source
COPY python-wasm ./python-wasm

# Create Python modules for WASM
RUN mkdir -p public/python-modules
RUN cp python-wasm/*.py public/python-modules/

# Stage 3: Build React frontend
FROM node:18-alpine as frontend-builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY src ./src
COPY public ./public
COPY index.html ./
COPY vite.config.js ./
COPY tailwind.config.js ./

# Copy WASM modules from previous stages
COPY --from=rust-builder /app/public/wasm ./public/wasm
COPY --from=python-builder /app/public/python-modules ./public/python-modules

# Build the application
RUN npm run build

# Stage 4: Production server
FROM nginx:alpine

# Copy built application
COPY --from=frontend-builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Add WASM MIME type support
RUN echo 'application/wasm wasm;' >> /etc/nginx/mime.types

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]