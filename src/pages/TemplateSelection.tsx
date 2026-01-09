import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight, FaFileAlt } from 'react-icons/fa';
import { useDemo } from '../context/DemoContext';
import { templates, Template } from '../data/mockTemplates';
import favicon from '../assets/favicon.png';
// import logo from "../assets/favicon.png";

const TemplateSelection: React.FC = () => {
  const navigate = useNavigate();
  const { setSelectedTemplate, state } = useDemo();
  const [selected, setSelected] = useState<Template | null>(state.selectedTemplate);

  const handleSelect = (template: Template) => {
    setSelected(template);
    setSelectedTemplate(template);
  };

  const handleContinue = () => {
    if (selected) {
      navigate('/review');
    }
  };


  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      IND: 'from-blue-500 to-blue-600',
      NDA: 'from-green-500 to-green-600',
      ANDA: 'from-blue-500 to-blue-600',
      DMF: 'from-orange-500 to-orange-600',
      Photostability: 'from-teal-500 to-teal-600',
    };
    return colors[type] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaArrowLeft className="text-gray-600" />
          </button>
          <div className="flex items-center gap-3">
            <img
              src={favicon}
              alt="VeritaScribe"
              className="w-8 h-8 object-contain"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-pharma-blue to-pharma-teal bg-clip-text text-transparent">
            VeritaScribe
            </span>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Select Template</h1>
        <p className="text-gray-600 mb-8">Choose a standardized regulatory document template</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {templates.map((template) => (
            <div
              key={template.id}
              onClick={() => handleSelect(template)}
              className={`bg-white rounded-xl p-6 border-2 cursor-pointer transition-all transform hover:-translate-y-2 ${
                selected?.id === template.id
                  ? 'border-pharma-blue shadow-xl ring-4 ring-pharma-blue/20'
                  : 'border-gray-200 hover:border-pharma-blue/50 hover:shadow-lg'
              }`}
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${getTypeColor(template.type)} flex items-center justify-center mb-4`}>
                <FaFileAlt className="text-white text-xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{template.name}</h3>
              <div className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold">
                {template.type}
              </div>
            </div>
          ))}
        </div>

        {/* Preview Section */}
        {selected && (
          <div className="bg-white rounded-xl shadow-xl p-8 border-2 border-pharma-blue/20 animate-slide-up">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Template Preview</h2>
            <div className="bg-gray-50 rounded-lg p-6 max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                {selected.content.split('\n').map((line, idx) => {
                  const hasPlaceholder = selected.placeholders.some(p => line.includes(`[${p}]`));
                  return (
                    <div
                      key={idx}
                      className={hasPlaceholder ? 'bg-yellow-200 px-2 py-1 rounded my-1' : ''}
                    >
                      {line}
                    </div>
                  );
                })}
              </pre>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
              <span className="w-4 h-4 bg-yellow-200 rounded inline-block"></span>
              <span>Yellow highlights indicate placeholders to be filled</span>
            </div>
          </div>
        )}

        {/* Continue Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleContinue}
            disabled={!selected}
            className={`px-8 py-4 rounded-xl font-semibold text-lg flex items-center gap-2 transition-all ${
              selected
                ? 'bg-gradient-to-r from-pharma-blue to-pharma-teal text-white hover:shadow-2xl transform hover:-translate-y-1'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue
            <FaArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelection;




