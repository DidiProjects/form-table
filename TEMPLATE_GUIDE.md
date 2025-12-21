# 🎯 Guia para Usar este Template

Este é um template completo para criação de componentes React reutilizáveis e publicáveis. Siga os passos abaixo para personalizar e criar seu próprio componente.

## 🚀 Início Rápido

### 1. Clone o Template
```bash
git clone <sua-url-do-template>
cd react-component-template
npm install
```

### 2. Renomeie e Configure
1. **Atualize package.json** com suas informações:
   - `name`: `@your-scope/your-component-name`
   - `description`: Descrição do seu componente
   - `repository`: URL do seu repositório
   - `author`: Seu nome

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
cd example-app && npm start  # Testa no exemplo
```

## 📋 Checklist de Personalização

- [ ] Atualizar `package.json` com suas informações
- [ ] Implementar componente em `src/index.tsx`
- [ ] Personalizar estilos em `src/index.css`
- [ ] Atualizar testes em `src/__tests__/`
- [ ] Modificar exemplo em `example-app/src/App.tsx`
- [ ] Atualizar `README.md` com documentação
- [ ] Configurar repositório Git

## 🎯 Exemplos de Uso do Template

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

## 🚀 Publicação

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
- README claro com exemplos
- Props bem documentadas  
- Exemplos de uso variados

## 🔧 Scripts Disponíveis

```bash
npm test              # Testes
npm run test:watch    # Testes em modo watch
npm run test:coverage # Cobertura de testes
npm run build         # Build de produção
npm run validate      # Validação completa
npm run publish:patch # Publica versão patch
npm run publish:minor # Publica versão minor
npm run publish:major # Publica versão major
```

---

**🎉 Pronto! Agora você tem um template completo para criar componentes React profissionais e reutilizáveis!**