import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSpinner, FaCheckCircle } from 'react-icons/fa';
import { useDemo } from '../context/DemoContext';
import { fillTemplate } from '../data/mockTemplates';

const AIDrafting: React.FC = () => {
  const navigate = useNavigate();
  const { state, setFilledDocument, setOriginalDocument } = useDemo();
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!state.selectedTemplate || state.dataSource.length === 0) {
      navigate('/templates');
      return;
    }

    // Simulate AI drafting process
    const steps = [
      { message: 'Analyzing template structure...', progress: 20 },
      { message: 'Mapping data fields...', progress: 40 },
      { message: 'Validating data integrity...', progress: 60 },
      { message: 'Filling document fields...', progress: 80 },
      { message: 'Finalizing document...', progress: 100 },
    ];

    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < steps.length) {
        setCurrentStep(steps[stepIndex].message);
        setProgress(steps[stepIndex].progress);
        stepIndex++;
      } else {
        clearInterval(interval);
        // Fill the document
        const filled = fillTemplate(state.selectedTemplate!, state.dataSource);
        setFilledDocument(filled);
        setOriginalDocument(filled);
        setIsComplete(true);
        
        // Navigate after a short delay
        setTimeout(() => {
          navigate('/preview');
        }, 1500);
      }
    }, 800);

    return () => clearInterval(interval);
  }, [state.selectedTemplate, state.dataSource, navigate, setFilledDocument, setOriginalDocument]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="max-w-2xl w-full mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
          <div className="mb-8">
            {isComplete ? (
              <div className="w-24 h-24 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                <FaCheckCircle className="text-6xl text-green-500" />
              </div>
            ) : (
              <div className="w-24 h-24 mx-auto mb-6 bg-pharma-blue/10 rounded-full flex items-center justify-center">
                <FaSpinner className="text-6xl text-pharma-blue animate-spin" />
              </div>
            )}
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            {isComplete ? 'Document Ready!' : 'AI Drafting in Progress...'}
          </h2>

          <p className="text-xl text-gray-600 mb-8">{currentStep || 'Initializing...'}</p>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-pharma-blue to-pharma-teal h-4 rounded-full transition-all duration-500 ease-out flex items-center justify-end pr-2"
              style={{ width: `${progress}%` }}
            >
              {progress > 10 && (
                <span className="text-xs font-semibold text-white">{progress}%</span>
              )}
            </div>
          </div>

          {isComplete && (
            <p className="text-green-600 font-semibold animate-fade-in">
              All fields have been successfully replaced!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIDrafting;




