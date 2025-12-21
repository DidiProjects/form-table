# Guide to Using this Template

This is a complete template for creating reusable and publishable React components. Follow the steps below to customize and create your own component.

## Quick Start

### 1. Clone the Template
```bash
git clone <your-template-url>
cd react-component-template
npm install
```

### 2. Rename and Configure
1. **Update package.json** with your information:
   - `name`: `@your-scope/your-component-name`
   - `description`: Your component description
   - `repository`: Your repository URL
   - `author`: Your name

### 3. Implemente seu Componente

#### Edite `src/index.tsx`:
```tsx
import React from 'react';
import { ComponentProps } from './utils';
import './index.css';

const MeuComponente = ({ title, className = 'meu-componente', ...props }: ComponentProps) => {
  return (
    <div className={className}>
      {title && <h3>{title}</h3>}
      {/* Sua lógica aqui */}
    </div>
  );
};

export default MeuComponente;
```

### 4. Atualize os Estilos
Edite `src/index.css` com os estilos do seu componente.

### 5. Escreva Testes
Atualize `src/__tests__/YourComponent.test.tsx` com testes específicos.

### 6. Teste o Componente
```bash
npm test                 # Executa testes
npm run build           # Gera build
cd example-app && npm start  # Test in example
```

## Customization Checklist

- [ ] Atualizar `package.json` com suas informações
- [ ] Implementar componente em `src/index.tsx`
- [ ] Personalizar estilos em `src/index.css`
- [ ] Atualizar testes em `src/__tests__/`
- [ ] Modify example in `example-app/src/App.tsx`
- [ ] Atualizar `README.md` com documentação
- [ ] Configurar repositório Git

## Template Usage Examples

### Componente de Card
```tsx
interface CardProps {
  title: string;
  image?: string;
  action?: () => void;
  children: React.ReactNode;
}
```

### Componente de Modal
```tsx  
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}
```

### Componente de Input
```tsx
interface InputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}
```

## Publication

### Primeiro Build
```bash
npm run build
npm run validate  # Executa testes e validações
```

### Publicar no NPM
```bash
npm login
npm run publish:patch  # ou minor/major
```

## 💡 Dicas e Boas Práticas

### Estrutura de Props
- Use interfaces TypeScript bem definidas
- Inclua props opcionais com valores padrão
- Documente props complexas

### Testes
- Teste comportamentos, não implementação
- Use snapshots para mudanças de UI
- Teste casos extremos e edge cases

### Performance  
- Use React.memo quando necessário
- Evite criação de objetos/funções em render
- Use useCallback/useMemo apropriadamente

### Documentação
- Clear README with examples
- Props bem documentadas  
- Varied usage examples

## Available Scripts

```bash
npm test              # Testes
npm run test:watch    # Testes em modo watch
npm run test:coverage # Cobertura de testes
npm run build         # Build de produção
npm run validate      # Complete validation
npm run publish:patch # Publica versão patch
npm run publish:minor # Publica versão minor
npm run publish:major # Publica versão major
```

---

**🎉 Pronto! Agora você tem um template completo para criar componentes React profissionais e reutilizáveis!**