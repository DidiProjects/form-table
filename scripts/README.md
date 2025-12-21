# Publication Scripts

Este diretório contém scripts automatizados para publicação do pacote `@dspackages/highlight-text`.

## Scripts Disponíveis

### PowerShell (Windows) - `publish.ps1`
Script principal otimizado para Windows PowerShell.

```bash
# Publicar com incremento patch (2.2.1 → 2.2.2)
npm run publish:patch

# Publicar com incremento minor (2.2.1 → 2.3.0)
npm run publish:minor

# Publicar com incremento major (2.2.1 → 3.0.0)
npm run publish:major
```

### Node.js (Cross-platform) - `publish.js`
Script alternativo compatível com qualquer sistema operacional.

```bash
# Uso direto
node scripts/publish.js [patch|minor|major]
```

## Processo de Publicação

O script automatiza todo o processo de publicação:

1. **Executa testes** - Roda todos os 76 testes unitários
2. **Build do projeto** - Compila TypeScript e copia CSS
3. **Incrementa versão** - Atualiza package.json e cria git tag
4. **Publica no npm** - Envia para o registry do npm
5. **Push para git** - Envia mudanças e tags para o repositório

## Validações

Antes da publicação, o script verifica:

- Todos os testes passando (76 testes)
- Build sem erros
- Versão incrementada corretamente
- Git em estado limpo

## Falhas de Segurança

Se qualquer etapa falhar, o processo é interrompido:

- **Testes falhando** → Publicação cancelada
- **Erro de build** → Publicação cancelada
- **Erro de versioning** → Publicação cancelada
- **Erro de publish** → Git não é alterado

## Versionamento Semântico

- **patch**: Correções de bugs (2.2.1 → 2.2.2)
- **minor**: Novas funcionalidades (2.2.1 → 2.3.0)
- **major**: Mudanças breaking (2.2.1 → 3.0.0)

## Configuração Git

Para funcionar corretamente, configure:

```bash
git config user.name "Seu Nome"
git config user.email "seu.email@exemplo.com"
```

## Autenticação npm

Faça login no npm:

```bash
npm login
```

## Exemplo de Uso

```bash
# Desenvolvimento de nova feature
npm run test:watch  # Durante desenvolvimento
npm run test        # Validação final
npm run publish:minor  # Publicar nova versão
```