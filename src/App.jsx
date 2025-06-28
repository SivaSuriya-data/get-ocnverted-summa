import { useState } from "react";
import "./App.css";
import DragAndDropFile from "./components/DragAndDropFile";
import ExamSelector from "./components/ExamSelector";
import ConversionProgress from "./components/ConversionProgress";
import DownloadSection from "./components/DownloadSection";

function App() {
  const [selectedExam, setSelectedExam] = useState("upsc");
  const [files, setFiles] = useState([]);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionProgress, setConversionProgress] = useState(0);
  const [convertedFiles, setConvertedFiles] = useState([]);
  const [currentStep, setCurrentStep] = useState("upload"); // upload, converting, completed

  const handleFilesSelected = (newFiles) => {
    setFiles(newFiles);
    setCurrentStep("upload");
  };

  const handleConvert = async () => {
    if (files.length === 0) return;
    
    setIsConverting(true);
    setCurrentStep("converting");
    setConversionProgress(0);

    try {
      // Step 1: Analyze and rename files using Python WASM
      setConversionProgress(20);
      const analyzedFiles = await analyzeDocuments(files);
      
      // Step 2: Convert files using Rust WASM
      setConversionProgress(60);
      const convertedFiles = await convertDocuments(analyzedFiles, selectedExam);
      
      // Step 3: Prepare download
      setConversionProgress(100);
      setConvertedFiles(convertedFiles);
      setCurrentStep("completed");
      
    } catch (error) {
      console.error("Conversion failed:", error);
      alert("Conversion failed. Please try again.");
    } finally {
      setIsConverting(false);
    }
  };

  const analyzeDocuments = async (files) => {
    // Load Python WASM module
    const pyodide = await loadPyodide();
    
    // Load our document analyzer
    await pyodide.loadPackage(["opencv-python", "pillow"]);
    
    const analyzedFiles = [];
    for (const file of files) {
      // Convert file to format Python can process
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      // Run Python analysis
      pyodide.globals.set("file_data", uint8Array);
      pyodide.globals.set("file_name", file.name);
      
      const result = pyodide.runPython(`
        import sys
        sys.path.append('/python-modules')
        from document_analyzer import analyze_and_classify
        
        result = analyze_and_classify(file_data, file_name)
        result
      `);
      
      analyzedFiles.push({
        originalFile: file,
        classifiedName: result.classified_name,
        documentType: result.document_type,
        confidence: result.confidence
      });
    }
    
    return analyzedFiles;
  };

  const convertDocuments = async (analyzedFiles, examType) => {
    // Load Rust WASM module
    const wasmModule = await import('/wasm/rust_backend.js');
    await wasmModule.default();
    
    const convertedFiles = [];
    
    for (const fileData of analyzedFiles) {
      const arrayBuffer = await fileData.originalFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      // Convert using Rust WASM
      const converted = wasmModule.convert_document(
        uint8Array,
        fileData.documentType,
        examType,
        fileData.classifiedName
      );
      
      convertedFiles.push({
        name: converted.name,
        data: converted.data,
        type: converted.type,
        originalType: fileData.documentType
      });
    }
    
    return convertedFiles;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
            <h1 className="text-4xl font-bold mb-2">
              getConvertedExams.io
            </h1>
            <p className="text-xl opacity-90">
              Your all-in-one Competitive Exams Document Converter
            </p>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Exam Selector */}
              <div className="lg:col-span-1">
                <ExamSelector 
                  selectedExam={selectedExam}
                  onExamSelect={setSelectedExam}
                  disabled={isConverting}
                />
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3">
                {currentStep === "upload" && (
                  <div>
                    <DragAndDropFile 
                      onFilesSelected={handleFilesSelected}
                      files={files}
                    />
                    
                    {files.length > 0 && (
                      <div className="mt-6 text-center">
                        <button
                          onClick={handleConvert}
                          disabled={isConverting}
                          className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
                        >
                          Convert Documents for {selectedExam.toUpperCase()}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {currentStep === "converting" && (
                  <ConversionProgress 
                    progress={conversionProgress}
                    currentStep={conversionProgress < 30 ? "Analyzing documents..." : 
                               conversionProgress < 80 ? "Converting to exam format..." : 
                               "Preparing downloads..."}
                  />
                )}

                {currentStep === "completed" && (
                  <DownloadSection 
                    convertedFiles={convertedFiles}
                    examType={selectedExam}
                    onStartOver={() => {
                      setCurrentStep("upload");
                      setFiles([]);
                      setConvertedFiles([]);
                      setConversionProgress(0);
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Load Pyodide for Python WASM
const loadPyodide = async () => {
  if (window.pyodide) return window.pyodide;
  
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
  document.head.appendChild(script);
  
  return new Promise((resolve) => {
    script.onload = async () => {
      window.pyodide = await loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/'
      });
      resolve(window.pyodide);
    };
  });
};

export default App;