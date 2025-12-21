import React from 'react';

function SimpleTest() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Simple Test</h1>
      <p>If you see this message, React is working.</p>
      
      <div style={{ background: '#f0f0f0', padding: '10px', margin: '10px 0' }}>
        <h3>Test without library:</h3>
        <span>
          This is a simple <span style={{ backgroundColor: '#FFC70A', padding: '2px' }}>example</span>
        </span>
      </div>
      
      <div style={{ background: '#e8f4fd', padding: '10px', margin: '10px 0' }}>
        <h3>Import status:</h3>
        <p>Trying to import the library...</p>
        <TestLibraryImport />
      </div>
    </div>
  );
}

function TestLibraryImport() {
  try {
    const HighlightText = require('@dspackages/highlight-text').default;
    
    return (
      <div>
        <p>Library imported successfully!</p>
        <HighlightText 
          text="Basic functionality test"
          search="basic"
        />
      </div>
    );
  } catch (error) {
    const err = error as Error;
    return (
      <div style={{ color: 'red' }}>
        <p>Library import error:</p>
        <p>{err.message}</p>
      </div>
    );
  }
}

export default SimpleTest;