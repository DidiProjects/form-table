import React, { useState } from 'react';
import '@dspackages/form-table/dist/index.css';
import './App.css';
import {
  BasicExample,
  ComputedValuesExample,
  MultipleFormsExample,
  SelectFieldsExample,
  ValidationExample,
  KeyboardNav,
  VirtualizedExample,
} from './components';

type TabId = 'intro' | 'basic' | 'computed' | 'multiple' | 'select' | 'validation' | 'virtualized';

const tabs: { id: TabId; label: string }[] = [
  { id: 'intro', label: 'Getting Started' },
  { id: 'basic', label: 'Basic Usage' },
  { id: 'computed', label: 'Computed Values' },
  { id: 'multiple', label: 'Multiple Forms' },
  { id: 'select', label: 'Select Fields' },
  { id: 'validation', label: 'Validation' },
  { id: 'virtualized', label: 'Virtualized (1K)' },
];

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('intro');

  return (
    <div className="App">
      <header className="App-header">
        <h1>@dspackages/form-table</h1>
        <p>
          A React library for building editable tables with keyboard navigation,
          per-form focus management, and built-in validation.
        </p>
      </header>

      <nav className="tabs-nav">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="app-content">
        {activeTab === 'intro' && <KeyboardNav />}
        {activeTab === 'basic' && <BasicExample />}
        {activeTab === 'computed' && <ComputedValuesExample />}
        {activeTab === 'multiple' && <MultipleFormsExample />}
        {activeTab === 'select' && <SelectFieldsExample />}
        {activeTab === 'validation' && <ValidationExample />}
        {activeTab === 'virtualized' && <VirtualizedExample />}
      </main>

      <footer className="app-footer">
        <p>Built with React + TypeScript</p>
      </footer>
    </div>
  );
}

export default App;