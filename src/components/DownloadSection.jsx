import { Download, FileText, RefreshCw, CheckCircle } from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export default function DownloadSection({ convertedFiles, examType, onStartOver }) {
  const downloadAll = async () => {
    const zip = new JSZip();
    
    // Create exam-specific folder
    const examFolder = zip.folder(`${examType.toUpperCase()}_Documents`);
    
    // Add all converted files to zip
    convertedFiles.forEach((file, index) => {
      examFolder.file(file.name, file.data);
    });
    
    // Generate and download zip
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `${examType.toUpperCase()}_Converted_Documents.zip`);
  };

  const downloadSingle = (file) => {
    const blob = new Blob([file.data], { type: file.type });
    saveAs(blob, file.name);
  };

  const getFileIcon = (type) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('image')) return '🖼️';
    if (type.includes('word')) return '📝';
    return '📎';
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="text-green-600" size={32} />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Conversion Completed!
        </h2>
        <p className="text-gray-600">
          Your documents have been successfully converted for {examType.toUpperCase()} format
        </p>
      </div>

      {/* Download All Button */}
      <div className="text-center mb-8">
        <button
          onClick={downloadAll}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 hover:scale-105 shadow-lg"
        >
          <Download className="inline mr-2" size={20} />
          Download All Files ({convertedFiles.length})
        </button>
      </div>

      {/* Individual Files */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Converted Files
        </h3>
        
        <div className="space-y-3">
          {convertedFiles.map((file, index) => (
            <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getFileIcon(file.type)}</span>
                  <div>
                    <p className="font-medium text-gray-800">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      Converted from: {file.originalType}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => downloadSingle(file)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download size={16} className="inline mr-1" />
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Start Over Button */}
      <div className="text-center">
        <button
          onClick={onStartOver}
          className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <RefreshCw className="inline mr-2" size={18} />
          Convert More Documents
        </button>
      </div>
    </div>
  );
}