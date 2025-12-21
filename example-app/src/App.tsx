import React, { useState } from 'react';
import YourComponent from '@your-scope/your-component-name';
import './App.css';

function App() {
  const [title, setTitle] = useState('Template Demo');
  const [disabled, setDisabled] = useState(false);

  return (
    <div className="App">
      <header className="App-header">
        <h1>React Component Template Demo</h1>
        
        <div className="controls">
          <div className="input-group">
            <label htmlFor="title">Título:</label>
            <input 
              id="title"
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite um título..."
            />
          </div>
          
          <div className="checkbox-group">
            <label>
              <input 
                type="checkbox" 
                checked={disabled}
                onChange={(e) => setDisabled(e.target.checked)}
              />
              Desabilitado
            </label>
          </div>
        </div>

        <div className="example">
          <h2>Exemplo 1: Componente Básico</h2>
          <YourComponent 
            title={title}
            disabled={disabled}
            onClick={() => alert('Componente clicado!')}
          >
            <p>Este é um exemplo de conteúdo dentro do componente.</p>
            <p>O título pode ser alterado dinamicamente.</p>
          </YourComponent>
        </div>

        <div className="example">
          <h2>Exemplo 2: Conteúdo Complexo</h2>
          <YourComponent 
            title="Componente com HTML Aninhado"
            disabled={disabled}
            onClick={() => console.log('Log no console')}
          >
            <div>
              <h3>Subtítulo</h3>
              <p>Este parágrafo contém <strong>texto em negrito</strong> e <em>texto em itálico</em>.</p>
              <ul>
                <li>Item 1: Exemplo de lista</li>
                <li>Item 2: Componente flexível</li>
                <li>Item 3: Template reutilizável</li>
              </ul>
            </div>
          </YourComponent>
        </div>

        <div className="example">
          <h2>Exemplo 3: Sem Título</h2>
          <YourComponent disabled={disabled}>
            <div>
              <p>Componente sem título definido.</p>
              <span>Ainda funciona perfeitamente!</span>
            </div>
          </YourComponent>
        </div>

        <div className="example">
          <h2>Exemplo 4: Customização CSS</h2>
          <YourComponent 
            title="Componente Personalizado"
            className="componente-customizado"
            disabled={disabled}
            onClick={() => alert('Estilo customizado!')}
          >
            <div>
              <h4>Componente com estilo personalizado</h4>
              <p>Este exemplo mostra como customizar o visual.</p>
            </div>
          </YourComponent>
        </div>

        <div className="info-section">
          <h2>Como personalizar:</h2>
          <ol>
            <li>Edite <code>src/index.tsx</code> para sua lógica</li>
            <li>Modifique <code>src/index.css</code> para estilos</li>
            <li>Atualize <code>src/utils/</code> conforme necessário</li>
            <li>Ajuste os testes em <code>src/__tests__/</code></li>
            <li>Configure <code>package.json</code> com seus dados</li>
          </ol>
        </div>
      </header>
    </div>
  );
}

export default App;