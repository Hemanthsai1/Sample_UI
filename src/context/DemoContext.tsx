import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Template, DataSource, fillTemplate } from '../data/mockTemplates';

interface DemoState {
  selectedTemplate: Template | null;
  dataSource: DataSource[];
  filledDocument: string;
  originalDocument: string;
  guidedDemoMode: boolean;
  changes: Change[];
}

interface Change {
  id: string;
  section: string;
  type: 'added' | 'removed' | 'modified';
  oldValue: string;
  newValue: string;
  author: string;
  timestamp: Date;
}

interface DemoContextType {
  state: DemoState;
  setSelectedTemplate: (template: Template | null) => void;
  setDataSource: (data: DataSource[]) => void;
  setFilledDocument: (doc: string) => void;
  setOriginalDocument: (doc: string) => void;
  toggleGuidedDemo: () => void;
  addChange: (change: Omit<Change, 'id' | 'timestamp'>) => void;
  updateDataSourceField: (fieldName: string, value: string) => void;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>({
    selectedTemplate: null,
    dataSource: [],
    filledDocument: '',
    originalDocument: '',
    guidedDemoMode: false,
    changes: [],
  });

  const setSelectedTemplate = (template: Template | null) => {
    setState(prev => ({ ...prev, selectedTemplate: template }));
  };

  const setDataSource = (data: DataSource[]) => {
    setState(prev => ({ ...prev, dataSource: data }));
  };

  const setFilledDocument = (doc: string) => {
    setState(prev => ({ ...prev, filledDocument: doc }));
  };

  const setOriginalDocument = (doc: string) => {
    setState(prev => ({ ...prev, originalDocument: doc }));
  };

  const toggleGuidedDemo = () => {
    setState(prev => ({ ...prev, guidedDemoMode: !prev.guidedDemoMode }));
  };

  const addChange = (change: Omit<Change, 'id' | 'timestamp'>) => {
    const newChange: Change = {
      ...change,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    setState(prev => ({ ...prev, changes: [...prev.changes, newChange] }));
  };

  const updateDataSourceField = (fieldName: string, value: string) => {
    setState(prev => ({
      ...prev,
      dataSource: prev.dataSource.map(d =>
        d.fieldName === fieldName ? { ...d, value } : d
      ),
    }));
  };

  return (
    <DemoContext.Provider
      value={{
        state,
        setSelectedTemplate,
        setDataSource,
        setFilledDocument,
        setOriginalDocument,
        toggleGuidedDemo,
        addChange,
        updateDataSourceField,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (context === undefined) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
}

