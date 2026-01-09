import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaFileAlt, FaCheckCircle } from 'react-icons/fa';
import { useDemo } from '../context/DemoContext';
import { DataSource } from '../data/mockTemplates';
import favicon from '../assets/favicon.png';

const ReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, setDataSource, updateDataSourceField } = useDemo();
  const [localDataSource, setLocalDataSource] = useState<DataSource[]>([]);

  const selectedTemplate = state.selectedTemplate;
  
  // Initialize data source from context or create defaults based on template placeholders
  useEffect(() => {
    if (state.dataSource.length > 0) {
      setLocalDataSource(state.dataSource);
    } else if (selectedTemplate && selectedTemplate.placeholders.length > 0) {
      const defaultData = selectedTemplate.placeholders.map(placeholder => ({
        fieldName: placeholder,
        value: ''
      }));
      setLocalDataSource(defaultData);
      setDataSource(defaultData);
    } else {
      const fallbackData = [
        { fieldName: 'PRODUCT_NAME', value: '' },
        { fieldName: 'STRENGTH', value: '' },
        { fieldName: 'STORAGE_CONDITION', value: '' },
      ];
      setLocalDataSource(fallbackData);
      setDataSource(fallbackData);
    }
  }, [selectedTemplate, state.dataSource, setDataSource]);

  const handleValueChange = (index: number, value: string) => {
    const updated = [...localDataSource];
    updated[index] = { ...updated[index], value };
    setLocalDataSource(updated);
    if (updated[index].fieldName) {
      updateDataSourceField(updated[index].fieldName, value);
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

  const handleFillDocument = () => {
    navigate('/demo');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        {/* Navigation */}
        <nav className="bg-white/80 backdrop-blur-md shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
            <button
              onClick={() => navigate('/templates')}
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
          <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Review Your Selection</h1>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Selected Template Section */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-pharma-blue/20">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaCheckCircle className="text-green-500" />
                Selected Template
              </h2>
              {selectedTemplate ? (
                <div>
                  <div className={`w-16 h-16 rounded-lg bg-gradient-to-r ${getTypeColor(selectedTemplate.type)} flex items-center justify-center mb-4`}>
                    <FaFileAlt className="text-white text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{selectedTemplate.name}</h3>
                  <div className="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold mb-4">
                    {selectedTemplate.type}
                  </div>
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {selectedTemplate.content.substring(0, 150)}...
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No template selected</p>
              )}
            </div>

            {/* Data Source Section */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-pharma-teal/20">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaCheckCircle className="text-green-500" />
                Data Source
              </h2>
              <div className="space-y-4">
                {localDataSource.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      {item.fieldName.replace(/_/g, ' ')}
                    </label>
                    <input
                      type="text"
                      value={item.value}
                      onChange={(e) => handleValueChange(index, e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pharma-blue focus:border-transparent transition-all"
                      placeholder={`Enter ${item.fieldName.replace(/_/g, ' ').toLowerCase()}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Fill Document Button */}
          <div className="flex justify-center mt-12">
            <button
              onClick={handleFillDocument}
              className="px-12 py-4 bg-gradient-to-r from-pharma-blue to-pharma-teal text-white rounded-xl font-bold text-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all flex items-center gap-3"
            >
              Fill Document
              <FaFileAlt />
            </button>
          </div>
        </div>
      </div>
  );
};

export default ReviewPage;

