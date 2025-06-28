import { Loader2, FileText, Settings, Download } from 'lucide-react';

export default function ConversionProgress({ progress, currentStep }) {
  const steps = [
    { icon: FileText, label: 'Analyzing Documents', threshold: 0 },
    { icon: Settings, label: 'Converting Format', threshold: 40 },
    { icon: Download, label: 'Preparing Downloads', threshold: 80 }
  ];

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="text-center mb-8">
        <Loader2 className="mx-auto mb-4 animate-spin text-blue-600" size={48} />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Converting Documents</h2>
        <p className="text-gray-600">{currentStep}</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step Indicators */}
      <div className="space-y-4">
        {steps.map((step, index) => {
          const isActive = progress >= step.threshold;
          const isCompleted = progress > step.threshold + 30;
          
          return (
            <div key={index} className="flex items-center space-x-4">
              <div className={`p-3 rounded-full ${
                isCompleted ? 'bg-green-100 text-green-600' :
                isActive ? 'bg-blue-100 text-blue-600' :
                'bg-gray-100 text-gray-400'
              }`}>
                <step.icon size={20} />
              </div>
              <div className="flex-1">
                <p className={`font-medium ${
                  isActive ? 'text-gray-800' : 'text-gray-500'
                }`}>
                  {step.label}
                </p>
              </div>
              {isCompleted && (
                <div className="text-green-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}