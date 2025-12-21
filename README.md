# 📋 FormTable

Um gerenciador de formulário para tabelas com células editáveis, navegação por Tab, validação Yup e contexto React otimizado.

## ✨ Funcionalidades

- 🔤 **Células editáveis** com diferentes tipos (texto, email, número, select)
- ⌨️ **Navegação intuitiva** com Tab/Shift+Tab e setas
- ⏎ **Submissão rápida** com Enter
- ✅ **Validação robusta** com Yup (onBlur e onChange configuráveis)
- 🎯 **Estados visuais** claros para células (ativa, editando, erro, modificada)
- ➕ **Gerenciamento dinâmico** de linhas (adicionar/remover)
- 🔄 **Reset individual** de linhas
- 💾 **Contexto otimizado** para performance
- 📱 **Design responsivo**

## 🚀 Instalação

```bash
npm install @DidiProjects/form-table yup
```

## 📖 Uso Básico

```tsx
import React from 'react';
import FormTable, { FormTableConfig } from '@DidiProjects/form-table';
import * as yup from 'yup';

const config: FormTableConfig = {
  columns: [
    {
      key: 'nome',
      type: 'text',
      label: 'Nome Completo',
      required: true,
      validation: yup.string().required('Nome é obrigatório').min(2, 'Mínimo 2 caracteres')
    },
    {
      key: 'email',
      type: 'email',
      label: 'E-mail',
      required: true,
      validation: yup.string().required().email('E-mail inválido')
    },
    {
      key: 'idade',
      type: 'number',
      label: 'Idade',
      validation: yup.number().min(0).max(120)
    },
    {
      key: 'cargo',
      type: 'select',
      label: 'Cargo',
      options: [
        { value: 'dev', label: 'Desenvolvedor' },
        { value: 'designer', label: 'Designer' }
      ]
    }
  ],
  initialRows: 3,
  allowAddRows: true,
  allowDeleteRows: true,
  validateOnBlur: true,
  submitOnEnter: true
};

function App() {
  const handleRowSubmit = (rowId: string, data: Record<string, any>) => {
    console.log('Linha submetida:', rowId, data);
  };

  const handleDataChange = (data: Record<string, Record<string, any>>) => {
    console.log('Dados alterados:', data);
  };

  return (
    <FormTable
      config={config}
      onRowSubmit={handleRowSubmit}
      onDataChange={handleDataChange}
    />
  );
}
```

## ⌨️ Navegação

| Tecla | Ação |
|-------|------|
| `Tab` | Próxima célula (direita, depois próxima linha) |
| `Shift + Tab` | Célula anterior (esquerda, depois linha anterior) |
| `Enter` | Submete a linha inteira |
| `Escape` | Sai do modo de edição |
| `←/→` | Navegação dentro do texto ou entre células |
| `↑/↓` | Linha acima/abaixo |

## ⚙️ Configuração

### FormTableConfig

```tsx
interface FormTableConfig {
  columns: CellConfig[];           // Configuração das colunas
  initialRows?: number;            // Número inicial de linhas
  allowAddRows?: boolean;          // Permitir adicionar linhas
  allowDeleteRows?: boolean;       // Permitir deletar linhas
  validateOnBlur?: boolean;        // Validar ao perder foco
  validateOnChange?: boolean;      // Validar ao digitar
  submitOnEnter?: boolean;         // Submeter com Enter
}
```

### CellConfig

```tsx
interface CellConfig {
  key: string;                     // Chave única da coluna
  type: 'text' | 'number' | 'email' | 'select';
  label?: string;                  // Label do cabeçalho
  required?: boolean;              // Campo obrigatório
  options?: { value: any; label: string }[];  // Para tipo select
  validation?: any;                // Schema Yup
}
```

## 🎨 Personalização de Estilos

O componente vem com estilos padrão que podem ser customizados:

```css
/* Sobrescrever estilos padrão */
.form-table {
  /* Suas customizações */
}

.form-table-cell.active {
  background-color: #seu-azul;
}

.form-table-cell.error {
  background-color: #seu-vermelho;
}
```

### Classes CSS Disponíveis

- `.form-table` - Container principal
- `.form-table-cell` - Célula individual
- `.form-table-cell.active` - Célula ativa
- `.form-table-cell.editing` - Célula em edição
- `.form-table-cell.error` - Célula com erro
- `.form-table-cell.dirty` - Célula modificada
- `.cell-error` - Mensagem de erro

## 🔧 API Avançada

### Hooks

```tsx
import { useFormTable, useFormTableCell } from '@DidiProjects/form-table';

// Hook principal (usar dentro do FormTableProvider)
const {
  data,
  updateCellValue,
  validateAll,
  addRow,
  deleteRow,
  getAllData
} = useFormTable();

// Hook otimizado para células individuais
const {
  cellData,
  isActive,
  updateValue,
  startEdit,
  endEdit
} = useFormTableCell('rowId', 'cellKey');
```

### Eventos

```tsx
<FormTable
  config={config}
  initialData={{
    'row-1': { nome: 'João', email: 'joao@email.com' }
  }}
  onRowSubmit={(rowId, data) => {
    // Chamado quando Enter é pressionado
  }}
  onDataChange={(allData) => {
    // Chamado toda vez que os dados mudam
  }}
/>
```

## 🧪 Exemplo Completo

Execute o exemplo incluído no projeto:

```bash
git clone https://github.com/seu-usuario/form-table
cd form-table/example-app
npm install
npm start
```

O exemplo mostra:
- Diferentes tipos de campo
- Validações customizadas
- Manipulação de eventos
- Exportação de dados
- Interface completa

## 🏗️ Desenvolvimento

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/form-table

# Instale dependências
npm install

# Rode os testes
npm test

# Build para produção
npm run build

# Desenvolvimento com watch
npm run test:watch
```

## 📦 Build e Publicação

```bash
# Build
npm run build

# Testes
npm run validate

# Publicação automática
npm run publish:patch  # 1.0.0 -> 1.0.1
npm run publish:minor  # 1.0.0 -> 1.1.0
npm run publish:major  # 1.0.0 -> 2.0.0
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie sua feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🐛 Problemas Conhecidos

- React StrictMode pode causar dupla renderização (esperado)
- ESLint warnings sobre dependências de hooks (não afetam funcionalidade)

## 🗺️ Roadmap

- [ ] Suporte a mais tipos de campo (date, checkbox, radio)
- [ ] Modo virtual para grandes datasets
- [ ] Drag & drop para reordenação
- [ ] Exportação para Excel/CSV
- [ ] Temas pré-definidos
- [ ] Suporte a RTL

## ✅ Compatibilidade

- React ≥ 16.8.0
- TypeScript ≥ 4.0
- Modern browsers (ES2017+)

---

Feito com ❤️ por [Diego](mailto:seu-email@exemplo.com)