import React from 'react';
import { FaUser, FaPlus, FaMinus } from 'react-icons/fa';
import { useDemo } from '../context/DemoContext';

const TrackChangesPanel: React.FC = () => {
  const { state } = useDemo();

  // Group changes by section
  const changesBySection = state.changes.reduce((acc, change) => {
    if (!acc[change.section]) {
      acc[change.section] = [];
    }
    acc[change.section].push(change);
    return acc;
  }, {} as Record<string, typeof state.changes>);

  const getChangeIcon = (type: string) => {
    switch (type) {
      case 'added':
        return <FaPlus className="text-green-500" />;
      case 'removed':
        return <FaMinus className="text-red-500" />;
      default:
        return <FaPlus className="text-blue-500" />;
    }
  };

  const getChangeColor = (type: string) => {
    switch (type) {
      case 'added':
        return 'bg-green-50 border-green-200';
      case 'removed':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="font-bold text-gray-800 mb-4">Track Changes</h3>
      
      {state.changes.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No changes tracked yet.</p>
          <p className="text-sm mt-2">Edit the document to see changes here.</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {Object.entries(changesBySection).map(([section, changes]) => (
            <div key={section} className="border-b border-gray-200 pb-4 last:border-b-0">
              <h4 className="font-semibold text-gray-700 mb-2">{section}</h4>
              {changes.map((change) => (
                <div
                  key={change.id}
                  className={`p-3 rounded-lg border-2 mb-2 ${getChangeColor(change.type)}`}
                >
                  <div className="flex items-start gap-2 mb-2">
                    {getChangeIcon(change.type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <FaUser className="text-xs text-gray-500" />
                        <span className="text-xs font-semibold text-gray-700">{change.author}</span>
                        <span className="text-xs text-gray-500">
                          {change.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      {change.type === 'removed' && (
                        <div className="text-sm">
                          <span className="line-through text-red-600 bg-red-100 px-1 rounded">
                            {change.oldValue}
                          </span>
                        </div>
                      )}
                      {change.type === 'added' && (
                        <div className="text-sm">
                          <span className="text-green-700 bg-green-100 px-1 rounded">
                            {change.newValue}
                          </span>
                        </div>
                      )}
                      {change.type === 'modified' && (
                        <div className="text-sm space-y-1">
                          <div>
                            <span className="line-through text-red-600 bg-red-100 px-1 rounded">
                              {change.oldValue}
                            </span>
                          </div>
                          <div>
                            <span className="text-green-700 bg-green-100 px-1 rounded">
                              {change.newValue}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrackChangesPanel;




