# Steps to test the library

## 1. First, build the library

```bash
# In the library root directory
cd C:\Users\diego\Documents\projects\highlight-text
npm run build
```

## 2. Install example dependencies

```bash
# In the example directory
cd C:\Users\diego\Documents\projects\highlight-text\example-app
npm install
```

## 3. Install the local library

```bash
# Still in the example-app directory
npm run install-local
```

## 4. Run the project

```bash
npm start
```

The project will open at http://localhost:3000

## Testable features:

- Basic search with highlighting
- Case-sensitive search
- Regex search (multiple words)
- Custom styles
- Interactive test with input
- Different usage examples