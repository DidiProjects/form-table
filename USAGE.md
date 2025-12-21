# Como usar o Template de Componente React

## 1. Configuração Inicial

### Clone ou faça download deste template
```bash
git clone <url-do-seu-template>
cd react-package-template
```

### Instale as dependências
```bash
npm install
```

## 2. Personalização do Template

### Atualize o package.json
```json
{
  "name": "@your-scope/your-component-name",
  "version": "1.0.0",
  "description": "Sua descrição aqui",
  "repository": {
    "url": "git+https://github.com/your-username/your-repo.git"
  },
  "author": "Seu Nome"
}
```

### Implemente seu componente em src/index.tsx
```tsx
import React from 'react';
import { ComponentProps } from './utils';
import './index.css';

const SeuComponente = ({ ...props }: ComponentProps) => {
  // Sua lógica aqui
  return (
    <div className="seu-componente">
      {/* Seu JSX aqui */}
    </div>
  );
};

export default SeuComponente;
```

### Customize os estilos em src/index.css
```css
.seu-componente {
  /* Seus estilos aqui */
}
```

## 3. Desenvolvimento

### Execute os testes
```bash
npm test                # Executa uma vez
npm run test:watch      # Modo watch
npm run test:coverage   # Com cobertura
```

### Build o componente
```bash
npm run build
```

## 4. Publicação

### Configure seu npm
```bash
npm login
```

### Publique o componente
```bash
npm run publish:patch     # Para correções
npm run publish:minor     # Para novas features  
npm run publish:major     # Para mudanças breaking
```

## 5. Uso do Componente Publicado

### Instalação
```bash
npm install @your-scope/your-component-name
```

### Uso básico
```tsx
import React from 'react';
import YourComponent from '@your-scope/your-component-name';

function App() {
  return (
    <div>
      <h1>Minha App</h1>
      <YourComponent 
        title="Exemplo"
        onClick={() => console.log('Clicado!')}
      >
        <p>Conteúdo do componente</p>
      </YourComponent>
    </div>
  );
}

export default App;
```

## 6. Estrutura de Arquivos

```
src/
├── index.tsx              # Componente principal
├── index.css              # Estilos
├── utils/                 # Utilitários
│   ├── index.ts          # Exports
│   ├── helpers.ts         # Funções auxiliares
│   └── __tests__/         # Testes dos utilitários
└── __tests__/             # Testes do componente
    └── YourComponent.test.tsx
```