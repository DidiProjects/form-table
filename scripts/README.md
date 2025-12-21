# Publication Scripts

This directory contains automated scripts for publishing the `@dspackages/highlight-text` package.

## Available Scripts

### PowerShell (Windows) - `publish.ps1`
Main script optimized for Windows PowerShell.

```bash
# Publish with patch increment (2.2.1 → 2.2.2)
npm run publish:patch

# Publish with minor increment (2.2.1 → 2.3.0)
npm run publish:minor

# Publish with major increment (2.2.1 → 3.0.0)
npm run publish:major
```

### Node.js (Cross-platform) - `publish.js`
Alternative script compatible with any operating system.

```bash
# Direct usage
node scripts/publish.js [patch|minor|major]
```

## Publication Process

The script automates the entire publication process:

1. **Run tests** - Runs all 76 unit tests
2. **Build project** - Compiles TypeScript and copies CSS
3. **Increment version** - Updates package.json and creates git tag
4. **Publish to npm** - Sends to npm registry
5. **Push to git** - Sends changes and tags to repository

## Validations

Before publishing, the script verifies:

- All tests passing (76 tests)
- Build without errors
- Version incremented correctly
- Git in clean state

## Security Failures

If any step fails, the process is interrupted:

- **Failing tests** → Publication cancelled
- **Build error** → Publication cancelled
- **Versioning error** → Publication cancelled
- **Publish error** → Git is not altered

## Semantic Versioning

- **patch**: Bug fixes (2.2.1 → 2.2.2)
- **minor**: New features (2.2.1 → 2.3.0)
- **major**: Breaking changes (2.2.1 → 3.0.0)

## Git Configuration

To work correctly, configure:

```bash
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

## npm Authentication

Log in to npm:

```bash
npm login
```

## Usage Example

```bash
# New feature development
npm run test:watch  # During development
npm run test        # Final validation
npm run publish:minor  # Publish new version
```