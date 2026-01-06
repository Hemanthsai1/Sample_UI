import React, { useState, useEffect } from 'react';
import { FaSave, FaPlus, FaTrash } from 'react-icons/fa';
import { useDemo } from '../context/DemoContext';
import { fillTemplate } from '../data/mockTemplates';
import { toast } from 'react-toastify';

const EditReviewPanel: React.FC = () => {
  const { state, updateDataSourceField, setFilledDocument, addChange } = useDemo();
  
  const [editableFields, setEditableFields] = useState([
    { name: 'PRODUCT_NAME', label: 'Product Name', value: '' },
    { name: 'STRENGTH', label: 'Strength', value: '' },
    { name: 'UNITS', label: 'Units', value: 'mg' },
  ]);

  const [responsibilityTable, setResponsibilityTable] = useState([
    { role: 'Study Director', name: 'John Doe' },
    { role: 'Quality Assurance', name: 'Jane Smith' },
    { role: 'Laboratory Manager', name: 'Mike Johnson' },
  ]);

  useEffect(() => {
    // Initialize fields from data source
    const fields = editableFields.map(field => {
      const dataField = state.dataSource.find(d => d.fieldName === field.name);
      return { ...field, value: dataField?.value || field.value };
    });
    setEditableFields(fields);
  }, [state.dataSource]);

  const handleFieldChange = (name: string, value: string) => {
    const oldValue = state.dataSource.find(d => d.fieldName === name)?.value || '';
    setEditableFields(prev => prev.map(f => f.name === name ? { ...f, value } : f));
    updateDataSourceField(name, value);
    
    // Track change
    if (oldValue !== value) {
      addChange({
        section: 'Document Fields',
        type: oldValue ? 'modified' : 'added',
        oldValue,
        newValue: value,
        author: 'User',
      });
    }
    
    // Update document in real-time
    if (state.selectedTemplate) {
      const updatedDataSource = state.dataSource.map(d =>
        d.fieldName === name ? { ...d, value } : d
      );
      const filled = fillTemplate(state.selectedTemplate, updatedDataSource);
      setFilledDocument(filled);
    }
  };

  const handleAddResponsibility = () => {
    setResponsibilityTable([...responsibilityTable, { role: '', name: '' }]);
  };

  const handleRemoveResponsibility = (index: number) => {
    setResponsibilityTable(responsibilityTable.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    // Update responsibility table in data source
    const tableValue = responsibilityTable.map(r => `${r.role} - ${r.name}`).join('\n');
    updateDataSourceField('RESPONSIBILITY_TABLE', tableValue);
    
    // Update document
    if (state.selectedTemplate) {
      const updatedDataSource = state.dataSource.map(d =>
        d.fieldName === 'RESPONSIBILITY_TABLE' ? { ...d, value: tableValue } : d
      );
      const filled = fillTemplate(state.selectedTemplate, updatedDataSource);
      setFilledDocument(filled);
    }
    
    toast.success('Document updated successfully');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 space-y-6">
      <h3 className="font-bold text-gray-800 text-lg">Edit & Review</h3>

      {/* Editable Fields */}
      <div className="space-y-4">
        {editableFields.map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              {field.label}
            </label>
            <input
              type="text"
              value={field.value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pharma-blue"
            />
          </div>
        ))}
      </div>

      {/* Responsibility Table */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-semibold text-gray-700">Responsibility Table</label>
          <button
            onClick={handleAddResponsibility}
            className="text-pharma-blue hover:text-pharma-teal"
          >
            <FaPlus />
          </button>
        </div>
        <div className="space-y-2">
          {responsibilityTable.map((row, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={row.role}
                onChange={(e) => {
                  const updated = [...responsibilityTable];
                  updated[index].role = e.target.value;
                  setResponsibilityTable(updated);
                }}
                placeholder="Role"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pharma-blue"
              />
              <input
                type="text"
                value={row.name}
                onChange={(e) => {
                  const updated = [...responsibilityTable];
                  updated[index].name = e.target.value;
                  setResponsibilityTable(updated);
                }}
                placeholder="Name"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pharma-blue"
              />
              <button
                onClick={() => handleRemoveResponsibility(index)}
                className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleSave}
        className="w-full px-4 py-2 bg-gradient-to-r from-pharma-blue to-pharma-teal text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
      >
        <FaSave />
        Save and Fill
      </button>
    </div>
  );
};

export default EditReviewPanel;

