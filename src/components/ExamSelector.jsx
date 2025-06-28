import { useState } from 'react';
import { ChevronDown, CheckCircle } from 'lucide-react';

const EXAM_CONFIGS = {
  neet: {
    name: 'NEET',
    fullName: 'National Eligibility cum Entrance Test',
    color: 'from-green-500 to-green-600',
    requirements: [
      'Passport size photo (3.5cm x 4.5cm)',
      'Signature (3.5cm x 1.5cm)', 
      'Left thumb impression',
      '10th marksheet',
      '12th marksheet',
      'Aadhar card',
      'Category certificate (if applicable)'
    ]
  },
  jee: {
    name: 'JEE',
    fullName: 'Joint Entrance Examination',
    color: 'from-blue-500 to-blue-600',
    requirements: [
      'Passport size photo (3.5cm x 4.5cm)',
      'Signature (3.5cm x 1.5cm)',
      'Left thumb impression', 
      '10th marksheet',
      '12th marksheet',
      'Aadhar card',
      'Category certificate (if applicable)',
      'PwD certificate (if applicable)'
    ]
  },
  upsc: {
    name: 'UPSC',
    fullName: 'Union Public Service Commission',
    color: 'from-purple-500 to-purple-600',
    requirements: [
      'Passport size photo (4cm x 5cm)',
      'Signature (4cm x 2cm)',
      'Left thumb impression',
      '10th marksheet',
      '12th marksheet', 
      'Graduation certificate',
      'Aadhar card',
      'Category certificate (if applicable)',
      'PwD certificate (if applicable)'
    ]
  },
  cat: {
    name: 'CAT',
    fullName: 'Common Admission Test',
    color: 'from-orange-500 to-orange-600',
    requirements: [
      'Passport size photo (3.5cm x 4.5cm)',
      'Signature (3.5cm x 1.5cm)',
      '10th marksheet',
      '12th marksheet',
      'Graduation certificate',
      'Aadhar card',
      'Category certificate (if applicable)',
      'PwD certificate (if applicable)'
    ]
  },
  gate: {
    name: 'GATE',
    fullName: 'Graduate Aptitude Test in Engineering',
    color: 'from-red-500 to-red-600',
    requirements: [
      'Passport size photo (3.5cm x 4.5cm)',
      'Signature (3.5cm x 1.5cm)',
      '10th marksheet',
      '12th marksheet',
      'Graduation certificate',
      'Aadhar card',
      'Category certificate (if applicable)',
      'PwD certificate (if applicable)'
    ]
  }
};

export default function ExamSelector({ selectedExam, onExamSelect, disabled }) {
  const [showRequirements, setShowRequirements] = useState(false);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Select Exam</h2>
      
      {/* Exam Selection Buttons */}
      <div className="space-y-3">
        {Object.entries(EXAM_CONFIGS).map(([examKey, config]) => (
          <button
            key={examKey}
            onClick={() => onExamSelect(examKey)}
            disabled={disabled}
            className={`w-full p-4 rounded-lg font-semibold text-left transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
              selectedExam === examKey
                ? `bg-gradient-to-r ${config.color} text-white shadow-lg`
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold">{config.name}</div>
                <div className={`text-sm ${selectedExam === examKey ? 'text-white/80' : 'text-gray-600'}`}>
                  {config.fullName}
                </div>
              </div>
              {selectedExam === examKey && (
                <CheckCircle size={20} className="text-white" />
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Requirements Section */}
      {selectedExam && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <button
            onClick={() => setShowRequirements(!showRequirements)}
            className="flex items-center justify-between w-full text-left"
          >
            <h3 className="font-semibold text-gray-800">
              {EXAM_CONFIGS[selectedExam].name} Requirements
            </h3>
            <ChevronDown 
              size={20} 
              className={`transform transition-transform ${showRequirements ? 'rotate-180' : ''}`}
            />
          </button>
          
          {showRequirements && (
            <div className="mt-3 space-y-2">
              {EXAM_CONFIGS[selectedExam].requirements.map((req, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>{req}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}