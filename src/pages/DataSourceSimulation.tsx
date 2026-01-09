import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight, FaPlus, FaTrash, FaFileExcel, FaFileWord } from 'react-icons/fa';
import { useDemo } from '../context/DemoContext';
import { defaultDataSource, DataSource, fillTemplate } from '../data/mockTemplates';

const DataSourceSimulation: React.FC = () => {
  const navigate = useNavigate();
  const { state, setDataSource, updateDataSourceField } = useDemo();
  const [dataSource, setLocalDataSource] = useState<DataSource[]>(
    state.dataSource.length > 0 ? state.dataSource : defaultDataSource
  );
  const [dataType, setDataType] = useState<'Excel' | 'Word'>('Excel');

  useEffect(() => {
    setDataSource(dataSource);
  }, [dataSource, setDataSource]);

  const handleAddRow = () => {
    setLocalDataSource([...dataSource, { fieldName: '', value: '' }]);
  };

  const handleRemoveRow = (index: number) => {
    setLocalDataSource(dataSource.filter((_, i) => i !== index));
  };

  const handleFieldChange = (index: number, field: 'fieldName' | 'value', newValue: string) => {
    const updated = [...dataSource];
    updated[index] = { ...updated[index], [field]: newValue };
    setLocalDataSource(updated);
    if (field === 'value' && updated[index].fieldName) {
      updateDataSourceField(updated[index].fieldName, newValue);
    }
  };

  const handleContinue = () => {
    setDataSource(dataSource);
    navigate('/review');
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
            <FaFileExcel className="text-2xl text-pharma-blue" />
            <span className="text-xl font-bold bg-gradient-to-r from-pharma-blue to-pharma-teal bg-clip-text text-transparent">
              VeritaScribe
            </span>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Data Source Simulation</h1>
        <p className="text-gray-600 mb-8">Edit the data that will be used to fill your document</p>

        {/* Data Type Selector */}
        <div className="mb-6 flex gap-4">
          <button
            onClick={() => setDataType('Excel')}
            className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all ${
              dataType === 'Excel'
                ? 'bg-green-500 text-white shadow-lg'
                : 'bg-white text-gray-700 border-2 border-gray-200'
            }`}
          >
            <FaFileExcel />
            Excel Data
          </button>
          <button
            onClick={() => setDataType('Word')}
            className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all ${
              dataType === 'Word'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-white text-gray-700 border-2 border-gray-200'
            }`}
          >
            <FaFileWord />
            Word Data
          </button>
        </div>

        {/* Editable Table */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Data Fields</h2>
            <button
              onClick={handleAddRow}
              className="px-4 py-2 bg-pharma-blue text-white rounded-lg hover:bg-pharma-teal transition-colors flex items-center gap-2"
            >
              <FaPlus />
              Add Row
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b-2 border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Field Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Value</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {dataSource.map((row, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={row.fieldName}
                        onChange={(e) => handleFieldChange(index, 'fieldName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pharma-blue"
                        placeholder="Enter field name"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={row.value}
                        onChange={(e) => handleFieldChange(index, 'value', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pharma-blue"
                        placeholder="Enter value"
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleRemoveRow(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Continue Button */}
        <div className="flex justify-end">
          <button
            onClick={handleContinue}
            className="px-8 py-4 bg-gradient-to-r from-pharma-blue to-pharma-teal text-white rounded-xl font-semibold text-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all flex items-center gap-2"
          >
            Continue
            <FaArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataSourceSimulation;




