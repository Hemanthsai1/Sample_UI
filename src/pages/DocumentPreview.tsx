import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSearch, FaEdit, FaHistory, FaFileAlt, FaMagic } from 'react-icons/fa';
import { useDemo } from '../context/DemoContext';

const DocumentPreview: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useDemo();
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [searchMatches, setSearchMatches] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const documentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!state.filledDocument) {
      navigate('/templates');
    }
  }, [state.filledDocument, navigate]);

  const highlightText = (text: string, matches: number[], searchTerm: string): string => {
    if (!searchTerm || matches.length === 0) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-300">$1</mark>');
  };

  const handleSearchHighlight = (matches: number[], term?: string) => {
    setSearchMatches(matches);
    if (term) setSearchTerm(term);
  };

  const renderDocument = () => {
    if (!state.filledDocument) return null;

    let content = state.filledDocument;
    
    // Highlight search matches
    if (searchTerm) {
      const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      content = content.replace(regex, '<mark class="bg-yellow-300 px-1 rounded">$1</mark>');
    }

    // Highlight filled fields (green background)
    const filledFields = state.dataSource.map(d => d.value);
    filledFields.forEach(field => {
      if (field) {
        const regex = new RegExp(`(${field.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'g');
        content = content.replace(regex, '<span class="bg-green-100 px-1 rounded">$1</span>');
      }
    });

    return content.split('\n').map((line, idx) => (
      <div key={idx} className="mb-2">
        <span dangerouslySetInnerHTML={{ __html: line || '&nbsp;' }} />
      </div>
    ));
  };


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaArrowLeft className="text-gray-600" />
            </button>
            <div className="flex items-center gap-3">
              <FaFileAlt className="text-2xl text-pharma-blue" />
              <span className="text-xl font-bold bg-gradient-to-r from-pharma-blue to-pharma-teal bg-clip-text text-transparent">
                VeritaScribe
              </span>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            {state.selectedTemplate?.name || 'Document Preview'}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Left Panel - Document */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-lg p-8 min-h-[800px]">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Drafted Document</h2>
              <div
                ref={documentRef}
                className="prose max-w-none font-mono text-sm leading-relaxed whitespace-pre-wrap"
              >
                {renderDocument()}
              </div>
            </div>
          </div>

          {/* Right Panel - AI Tools */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-lg shadow-md p-4 mb-4">
              <h3 className="font-bold text-gray-800 mb-4">AI Tools</h3>
              <div className="space-y-2">
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentPreview;

