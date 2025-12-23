import React from 'react';
import '@dspackages/form-table/dist/index.css';
import './App.css';
import { BookOrders, ProductForm } from './components';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>FormTable Examples</h1>
        <p>
          Tab navigates within each form. Press Enter on the last field to submit.
        </p>
      </header>

      <div className="app-content">
        <BookOrders />
        <ProductForm />
      </div>
    </div>
  );
}

export default App;