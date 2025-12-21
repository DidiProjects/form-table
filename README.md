# React Component Package Template

Um template completo para criação de componentes React publicáveis com TypeScript, testes, build automatizado e estrutura profissional.

## 🚀 Features

- **TypeScript** - Tipagem completa incluída
- **React 18+** - Compatível com as versões mais recentes
- **Build automático** - Rollup para ESM e CJS
- **Testes** - Vitest + React Testing Library
- **CSS incluído** - Estilos prontos para uso
- **Exemplo funcional** - App de demonstração
- **Scripts de publicação** - Automação completa
- **Performance otimizada** - React.memo integrado

## 📦 Como usar este template

1. **Clone ou faça download do template**
2. **Personalize o package.json** com seus dados
3. **Implemente seu componente** em `src/index.tsx`
4. **Ajuste os estilos** em `src/index.css`
5. **Atualize os testes** em `src/__tests__/`
6. **Modifique o exemplo** em `example-app/`
7. **Atualize este README** com sua documentação

## 🛠️ Installation

```bash
npm install @your-scope/your-component-name
```

## 📖 Basic Usage

```tsx
import YourComponent from '@your-scope/your-component-name';

function App() {
  return (
    <YourComponent 
      title="Hello World"
      onClick={() => console.log('Clicked!')}
    >
      <p>Conteúdo do seu componente</p>
    </YourComponent>
  );
}
```

## 📋 Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `undefined` | Título opcional do componente |
| `className` | `string` | `'your-component-container'` | Classe CSS do container |
| `disabled` | `boolean` | `false` | Se o componente está desabilitado |
| `onClick` | `function` | `undefined` | Callback para cliques |
| `children` | `ReactNode` | `undefined` | Conteúdo filho do componente |

## 💡 Usage Examples

### Componente Simples
```tsx
<YourComponent title="Meu Componente">
  <p>Este é o conteúdo do componente</p>
</YourComponent>
```

### Com Interatividade
```tsx
<YourComponent 
  title="Clicável"
  onClick={() => alert('Clicou!')}
>
  <div>Clique em mim!</div>
</YourComponent>
```

### Desabilitado
```tsx
<YourComponent 
  title="Desabilitado"
  disabled={true}
>
  <p>Este componente está desabilitado</p>
</YourComponent>
```

### Customizado
```tsx
<YourComponent 
  title="Customizado"
  className="meu-estilo-customizado"
  onClick={() => console.log('Ação personalizada')}
>
  <div>Conteúdo com estilo personalizado</div>
</YourComponent>
```

## 🎨 Development

### Scripts Disponíveis

```bash
# Testes
npm test                    # Executa testes
npm run test:watch          # Testes em modo watch
npm run test:coverage       # Cobertura de testes

# Build
npm run build              # Gera build de produção
npm run validate           # Validação completa

# Publicação
npm run publish:patch      # Publica versão patch
npm run publish:minor      # Publica versão minor
npm run publish:major      # Publica versão major
```

### Estrutura do Projeto

```
/
├── src/                   # Código fonte do componente
│   ├── index.tsx         # Componente principal
│   ├── index.css         # Estilos
│   ├── utils/            # Utilitários
│   └── __tests__/        # Testes
├── example-app/           # App de demonstração
├── scripts/              # Scripts de build/publicação
└── dist/                 # Build gerado
```

## 🧪 Testing

O template inclui testes configurados com Vitest e React Testing Library:

```bash
npm test                   # Executa todos os testes
npm run test:ui           # Interface gráfica dos testes
npm run test:coverage     # Relatório de cobertura
```

## 📋 Customization

### Substituir o componente
1. Edite [src/index.tsx](src/index.tsx) com sua lógica
2. Atualize [src/index.css](src/index.css) com seus estilos
4. Atualize os testes em [src/__tests__/](src/__tests__/)

### Configurar o package
1. Modifique [package.json](package.json) com suas informações
2. Atualize este README.md
3. Configure seu repositório Git

## 🚀 Publishing

1. **Configure seu escopo no package.json**
2. **Faça login no npm**: `npm login`
3. **Publique**: `npm run publish:patch`

Ou use os scripts automáticos:
- `npm run publish:patch` - Para correções
- `npm run publish:minor` - Para novas funcionalidades
- `npm run publish:major` - Para mudanças breaking

## 📄 License

MIT
  <div>
    <p>React, JavaScript and TypeScript are modern technologies.</p>
    <span>All three words will be highlighted automatically.</span>
  </div>
</HighlightText>
```

### Complex Patterns
```tsx
<HighlightText search="\\b\\w+Script\\b">
  <p>JavaScript, TypeScript and ActionScript will be highlighted.</p>
</HighlightText>
```

## How It Works

The component works recursively:

1. **Analyzes content** - Traverses all child elements
2. **Identifies text** - Finds text nodes within the structure
3. **Applies highlighting** - Replaces matches with `<mark>` elements with CSS class
4. **Preserves structure** - Maintains all original HTML elements
5. **Rebuilds tree** - Returns complete structure with applied highlights

```tsx
// Input:
<HighlightText search="React">
  <div>
    <h1>Title about React</h1>
    <p>React is great</p>
  </div>
</HighlightText>

// Output (rendered):
<div className="highlight-text-container">
  <div>
    <h1>Title about <mark className="highlight">React</mark></h1>
    <p><mark className="highlight">React</mark> is great</p>
  </div>
</div>
```

## Use Cases

### Ideal for:
- **Search results** - Highlight found terms
- **Documentation** - Highlight keywords
- **Tutorials** - Emphasize important concepts
- **Blogs** - Highlight technical terms
- **Dashboards** - Highlight important metrics
- **E-learning** - Highlight concepts in lessons

### Considerations:
- For very large texts (>10MB), consider pagination
- Complex regex patterns may impact performance
- Elements with event listeners are preserved

## Development

```bash
# Install dependencies
npm install

# Build library
npm run build

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run example
cd example-app
npm install
npm start
```

## Testing

The library includes a comprehensive test suite using **Vites** and **@testing-library/react**.

### Test Structure

Tests are organized in `src/__tests__/` and `src/utils/__tests__/` directories:

- **`src/__tests__/HighlightText.test.tsx`** - Core component functionality
- **`src/__tests__/utils.test.tsx`** - Main utility integration tests 
- **`src/utils/__tests__/textProcessor.test.tsx`** - Text processing utilities
- **`src/utils/__tests__/reactProcessor.test.tsx`** - React element processing

### Test Coverage

**76 tests passing** covering:

- **Basic functionality** - Rendering, highlighting, multiple occurrences
- **Case sensitivity** - Default insensitive, explicit sensitive mode
- **Custom styling** - CSS classes, inline styles, CSS custom properties
- **Regex patterns** - Special characters, complex patterns
- **Edge cases** - Empty inputs, null/undefined, numbers, nested elements
- **Text processing** - Escape regex, text parsing, highlight detection
- **React processing** - Element traversal, DOM manipulation, children processing
- **Props comparison** - Performance optimization, deep comparison
- **Performance** - Large content, deep nesting, React.memo optimization
- **Error handling** - Malformed regex, Unicode, special characters

### Running Tests

```bash
# Run all tests
npm test

# Watch mode for development
npm run test:watch

# Visual test interface
npm run test:ui

# Generate coverage report
npm run test:coverage
```

## Migration from v1.x

### Main changes:
- **Props**: `text` → `children`
- **Functionality**: Now works with any HTML content
- **Flexibility**: Complete support for nested structures

### Before (v1.x):
```tsx
<HighlightText 
  text="Text to highlight words"
  search="words"
/>
```

### After (v2.x):
```tsx
<HighlightText search="words">
  Text to highlight words
</HighlightText>
```

## License

MIT © Diego Silva

---

### Links
- [GitHub](https://github.com/Didilv93/highlight-text)
- [npm](https://www.npmjs.com/package/@dspackages/highlight-text)
- [Issues](https://github.com/Didilv93/highlight-text/issues)