# How to use the React Component Template

## 1. Initial Setup

### Clone or download this template
```bash
git clone <your-template-url>
cd react-package-template
```

### Install dependencies
```bash
npm install
```

## 2. Template Customization

### Update package.json
```json
{
  "name": "@your-scope/your-component-name",
  "version": "1.0.0",
  "description": "Your description here",
  "repository": {
    "url": "git+https://github.com/your-username/your-repo.git"
  },
  "author": "Your Name"
}
```

### Implement your component in src/index.tsx
```tsx
import React from 'react';
import { ComponentProps } from './utils';
import './index.css';

const YourComponent = ({ ...props }: ComponentProps) => {
  // Your logic here
  return (
    <div className="your-component">
      {/* Your JSX here */}
    </div>
  );
};

export default YourComponent;
```

### Customize styles in src/index.css
```css
.your-component {
  /* Your styles here */
}
```

## 3. Development

### Run tests
```bash
npm test                # Run once
npm run test:watch      # Watch mode
npm run test:coverage   # With coverage
```

### Build the component
```bash
npm run build
```

## 4. Publishing

### Configure your npm
```bash
npm login
```

### Publish the component
```bash
npm run publish:patch     # For fixes
npm run publish:minor     # For new features  
npm run publish:major     # For breaking changes
```

## 5. Using the Published Component

### Installation
```bash
npm install @your-scope/your-component-name
```

### Basic usage
```tsx
import React from 'react';
import YourComponent from '@your-scope/your-component-name';

function App() {
  return (
    <div>
      <h1>My App</h1>
      <YourComponent 
        title="Example"
        onClick={() => console.log('Clicked!')}
      >
        <p>Component content</p>
      </YourComponent>
    </div>
  );
}

export default App;
```

## 6. File Structure

```
src/
├── index.tsx              # Main component
├── index.css              # Styles
├── utils/                 # Utilities
│   ├── index.ts          # Exports
│   ├── helpers.ts         # Helper functions
│   └── __tests__/         # Utility tests
└── __tests__/             # Component tests
    └── YourComponent.test.tsx
```