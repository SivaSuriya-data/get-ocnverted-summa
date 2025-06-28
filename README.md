# Competitive Exam Document Converter

A comprehensive web application that converts documents to exam-specific formats for competitive exams like NEET, JEE, UPSC, CAT, and GATE.

## Features

- **Multi-Exam Support**: Supports NEET, JEE, UPSC, CAT, and GATE formats
- **Intelligent Document Analysis**: Uses Python WASM for OCR and document classification
- **Format Conversion**: Rust WASM backend for high-performance document processing
- **Batch Processing**: Convert multiple documents simultaneously
- **Download Management**: Individual and bulk download options

## Architecture

### Frontend (React + TypeScript)
- Modern React application with TypeScript
- Tailwind CSS for styling
- Drag-and-drop file upload
- Real-time conversion progress
- Responsive design

### Document Analysis (Python WASM)
- OCR text extraction
- Document type classification
- Intelligent file naming
- Runs entirely in the browser via WebAssembly

### Document Conversion (Rust WASM)
- High-performance image processing
- Exam-specific format conversion
- Optimized file compression
- WebAssembly for near-native performance

## Exam Format Specifications

### NEET
- Photo: 3.5cm × 4.5cm (JPEG, 100 DPI)
- Signature: 3.5cm × 1.5cm
- Required documents: Photo, Signature, Thumb impression, 10th/12th marksheets, Aadhar, Category certificate

### JEE
- Photo: 3.5cm × 4.5cm (JPEG, 100 DPI)
- Signature: 3.5cm × 1.5cm
- Required documents: Photo, Signature, Thumb impression, 10th/12th marksheets, Aadhar, Category/PwD certificates

### UPSC
- Photo: 4cm × 5cm (JPEG, 100 DPI)
- Signature: 4cm × 2cm
- Required documents: Photo, Signature, Thumb impression, 10th/12th/Graduation certificates, Aadhar, Category/PwD certificates

### CAT
- Photo: 3.5cm × 4.5cm (JPEG, 100 DPI)
- Signature: 3.5cm × 1.5cm
- Required documents: Photo, Signature, 10th/12th/Graduation certificates, Aadhar, Category/PwD certificates

### GATE
- Photo: 3.5cm × 4.5cm (JPEG, 100 DPI)
- Signature: 3.5cm × 1.5cm
- Required documents: Photo, Signature, 10th/12th/Graduation certificates, Aadhar, Category/PwD certificates

## Development Setup

### Prerequisites
- Node.js 18+
- Rust 1.70+
- Python 3.11+
- Docker (optional)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd get-converted-exams
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build WASM modules**
   ```bash
   chmod +x build-wasm.sh
   ./build-wasm.sh
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

### Docker Development

1. **Build and run with Docker Compose**
   ```bash
   # Production build
   docker-compose up --build

   # Development mode
   docker-compose --profile dev up --build
   ```

2. **Access the application**
   - Production: http://localhost:3000
   - Development: http://localhost:5173

## Building for Production

### Manual Build
```bash
# Build WASM modules
./build-wasm.sh

# Build React application
npm run build

# Serve with any static file server
npx serve dist
```

### Docker Build
```bash
# Build production image
docker build -t exam-converter .

# Run production container
docker run -p 3000:80 exam-converter
```

## Project Structure

```
├── src/                          # React frontend source
│   ├── components/              # React components
│   │   ├── ExamSelector.jsx    # Exam selection component
│   │   ├── DragAndDropFile.jsx # File upload component
│   │   ├── ConversionProgress.jsx # Progress indicator
│   │   └── DownloadSection.jsx # Download management
│   ├── App.jsx                 # Main application component
│   └── main.jsx               # Application entry point
├── rust-backend/              # Rust WASM backend
│   ├── src/
│   │   └── lib.rs            # Main Rust conversion logic
│   └── Cargo.toml           # Rust dependencies
├── python-wasm/              # Python WASM modules
│   └── document_analyzer.py  # Document analysis logic
├── public/                   # Static assets
│   ├── wasm/                # Built Rust WASM modules
│   └── python-modules/      # Python modules for WASM
├── Dockerfile               # Production Docker image
├── docker-compose.yml       # Docker Compose configuration
├── nginx.conf              # Nginx configuration for production
└── build-wasm.sh          # WASM build script
```

## API Reference

### Rust WASM Functions

- `convert_document(file_data, document_type, exam_type, filename)`: Convert a document to exam format
- `get_supported_exams()`: Get list of supported exam types
- `get_exam_requirements(exam_type)`: Get required documents for an exam

### Python WASM Functions

- `analyze_and_classify(file_data, filename)`: Analyze and classify a document
- `process_document_batch(files_data)`: Process multiple documents

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please open an issue in the GitHub repository.