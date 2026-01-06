import React, { useState } from 'react';
import { FaMagic, FaSpinner } from 'react-icons/fa';

interface SummarizationPanelProps {
  document: string;
}

const SummarizationPanel: React.FC<SummarizationPanelProps> = ({ document }) => {
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [keyPoints, setKeyPoints] = useState<string[]>([]);

  // Extract sections from document
  const sections = document.split('\n').filter(line => 
    line.trim().match(/^\d+\.\s+[A-Z]/) || line.trim().match(/^[A-Z][A-Z\s]+$/)
  );

  const handleSummarize = async () => {
    if (!selectedSection) {
      // Summarize entire document
      const textToSummarize = document;
    } else {
      // Summarize selected section
      const sectionIndex = document.indexOf(selectedSection);
      const nextSectionIndex = document.indexOf('\n\n', sectionIndex);
      const textToSummarize = document.substring(
        sectionIndex,
        nextSectionIndex > -1 ? nextSectionIndex : document.length
      );
    }

    setIsLoading(true);
    
    // Simulate AI summarization
    setTimeout(() => {
      const mockSummary = `This section provides a comprehensive overview of the key regulatory requirements and compliance standards. It outlines the necessary documentation, testing protocols, and quality assurance measures required for pharmaceutical product approval. The content emphasizes adherence to international guidelines and best practices in the industry.`;

      const mockKeyPoints = [
        'Regulatory compliance requirements',
        'Documentation standards',
        'Quality assurance protocols',
        'International guidelines adherence',
      ];

      setSummary(mockSummary);
      setKeyPoints(mockKeyPoints);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center gap-2 mb-4">
        <FaMagic className="text-pharma-blue" />
        <h3 className="font-bold text-gray-800">AI Summarization</h3>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Select Section (optional)
        </label>
        <select
          value={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pharma-blue"
        >
          <option value="">Entire Document</option>
          {sections.slice(0, 10).map((section, idx) => (
            <option key={idx} value={section}>
              {section.substring(0, 50)}...
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleSummarize}
        disabled={isLoading}
        className="w-full px-4 py-2 bg-gradient-to-r from-pharma-blue to-pharma-teal text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isLoading ? (
          <>
            <FaSpinner className="animate-spin" />
            Summarizing...
          </>
        ) : (
          <>
            <FaMagic />
            Summarize
          </>
        )}
      </button>

      {summary && (
        <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border-2 border-pharma-blue/20 animate-slide-up">
          <h4 className="font-bold text-gray-800 mb-3">Summary</h4>
          <p className="text-gray-700 mb-4 leading-relaxed">{summary}</p>
          
          {keyPoints.length > 0 && (
            <div>
              <h5 className="font-semibold text-gray-800 mb-2">Key Points:</h5>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {keyPoints.map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SummarizationPanel;




