import React, { useState } from 'react';
import { FormTable, FormTableConfig } from '@dspackages/form-table';
import '@dspackages/form-table/dist/index.css';
import * as yup from 'yup';
import './App.css';

function App() {
  const [tableData, setTableData] = useState<Record<string, Record<string, any>>>({});

  // Configuração da tabela
  const tableConfig: FormTableConfig = {
    columns: [
      {
        key: 'nome',
        type: 'text',
        label: 'Nome Completo',
        required: true,
        validation: yup.string().required('Nome é obrigatório').min(2, 'Nome deve ter pelo menos 2 caracteres')
      },
      {
        key: 'email',
        type: 'email',
        label: 'E-mail',
        required: true,
        validation: yup.string().required('E-mail é obrigatório').email('E-mail inválido')
      },
      {
        key: 'idade',
        type: 'number',
        label: 'Idade',
        required: true,
        validation: yup.number()
          .typeError('Deve ser um número')
          .required('Idade é obrigatória')
          .min(0, 'Idade deve ser positiva')
          .max(120, 'Idade deve ser realista')
      },
      {
        key: 'cargo',
        type: 'select',
        label: 'Cargo',
        required: true,
        options: [
          { value: 'dev', label: 'Desenvolvedor' },
          { value: 'designer', label: 'Designer' },
          { value: 'manager', label: 'Gerente' },
          { value: 'analyst', label: 'Analista' }
        ],
        validation: yup.string().required('Cargo é obrigatório')
      },
      {
        key: 'salario',
        type: 'number',
        label: 'Salário (R$)',
        validation: yup.number()
          .typeError('Deve ser um número')
          .min(0, 'Salário deve ser positivo')
      },
      {
        key: 'observacoes',
        type: 'text',
        label: 'Observações',
        validation: yup.string().max(200, 'Máximo 200 caracteres')
      }
    ],
    initialRows: 3,
    allowAddRows: true,
    allowDeleteRows: true,
    validateOnBlur: true,
    validateOnChange: false,
    submitOnEnter: true
  };

  // Dados iniciais (opcional)
  const initialData = {
    'exemplo-1': {
      nome: 'João Silva',
      email: 'joao@exemplo.com',
      idade: 30,
      cargo: 'dev',
      salario: 5000,
      observacoes: 'Desenvolvedor experiente'
    }
  };

  const handleRowSubmit = (rowId: string, data: Record<string, any>) => {
    console.log('Linha submetida:', rowId, data);
    alert(`Linha ${rowId} submetida com sucesso!\n${JSON.stringify(data, null, 2)}`);
  };

  const handleDataChange = (data: Record<string, Record<string, any>>) => {
    setTableData(data);
    console.log('Dados alterados:', data);
  };

  const exportData = () => {
    const dataStr = JSON.stringify(tableData, null, 2);
    console.log('Dados exportados:', dataStr);
    
    // Cria um arquivo JSON para download
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'form-table-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>FormTable - Gerenciador de Formulário para Tabelas</h1>
        <p>
          Este é um exemplo de uso do componente FormTable com células editáveis,
          navegação por Tab, validação com Yup e contexto React.
        </p>
      </header>

      <div className="app-content">
        <div className="demo-section">
          <h2>Exemplo: Cadastro de Funcionários</h2>
          <div className="demo-description">
            <p><strong>Funcionalidades disponíveis:</strong></p>
            <ul>
              <li>🔤 Células editáveis com diferentes tipos (texto, email, número, select)</li>
              <li>⌨️ Navegação com Tab/Shift+Tab entre células</li>
              <li>⏎ Submissão de linha com Enter</li>
              <li>✅ Validação com Yup (onBlur e onChange opcionais)</li>
              <li>🎯 Foco visual e estados da célula</li>
              <li>➕ Adicionar/remover linhas dinamicamente</li>
              <li>🔄 Reset de linha individual</li>
              <li>💾 Contexto compartilhado entre células</li>
            </ul>
          </div>

          <FormTable
            config={tableConfig}
            initialData={initialData}
            onRowSubmit={handleRowSubmit}
            onDataChange={handleDataChange}
            className="demo-table"
          />

          <div className="export-section">
            <button 
              className="export-btn" 
              onClick={exportData}
              disabled={Object.keys(tableData).length === 0}
            >
              📄 Exportar Dados JSON
            </button>
            
            <div className="data-preview">
              <h3>Dados Atuais:</h3>
              <pre>{JSON.stringify(tableData, null, 2)}</pre>
            </div>
          </div>
        </div>

        <div className="instructions">
          <h2>Como usar:</h2>
          <div className="instruction-cards">
            <div className="card">
              <h3>🖱️ Edição</h3>
              <p>Clique em uma célula para editá-la. Clique fora ou pressione Escape para sair.</p>
            </div>
            
            <div className="card">
              <h3>⌨️ Navegação</h3>
              <p>Use Tab/Shift+Tab para navegar. Setas também funcionam dentro do modo edição.</p>
            </div>
            
            <div className="card">
              <h3>⏎ Submissão</h3>
              <p>Pressione Enter em qualquer célula para submeter a linha inteira.</p>
            </div>
            
            <div className="card">
              <h3>✅ Validação</h3>
              <p>Validações automáticas aparecem quando você sai da célula (onBlur).</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;