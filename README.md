# FormTable

A form manager for tables with editable cells, Tab navigation, Yup validation, and optimized React context.

## Features

- **Editable cells** with different types (text, email, number, select)
- **Intuitive navigation** with Tab/Shift+Tab and arrows
- **Quick submission** with Enter
- **Robust validation** with Yup (configurable onBlur and onChange)
- **Clear visual states** for cells (active, editing, error, modified)
- **Dynamic row management** (add/remove)
- **Individual row reset**
- **Performance-optimized context**
- **Responsive design**

## Installation

```bash
npm install @dspackages/form-table yup
```

## Basic Usage

```tsx
import React from 'react';
import FormTable, { FormTableConfig } from '@dspackages/form-table';
import * as yup from 'yup';

const config: FormTableConfig = {
  columns: [
    {
      key: 'name',
      type: 'text',
      label: 'Full Name',
      required: true,
      validation: yup.string().required('Name is required').min(2, 'Minimum 2 characters')
    },
    {
      key: 'email',
      type: 'email',
      label: 'Email',
      required: true,
      validation: yup.string().required().email('Invalid email')
    },
    {
      key: 'age',
      type: 'number',
      label: 'Age',
      validation: yup.number().min(0).max(120)
    },
    {
      key: 'position',
      type: 'select',
      label: 'Position',
      options: [
        { value: 'dev', label: 'Developer' },
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
    console.log('Row submitted:', rowId, data);
  };

  const handleDataChange = (data: Record<string, Record<string, any>>) => {
    console.log('Data changed:', data);
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

## Navigation

| Key | Action |
|-----|--------|
| `Tab` | Next cell (right, then next row) |
| `Shift + Tab` | Previous cell (left, then previous row) |
| `Enter` | Submit entire row |
| `Escape` | Exit edit mode |
| `←/→` | Navigate within text or between cells |
| `↑/↓` | Row above/below |

## Configuration

### FormTableConfig

```tsx
interface FormTableConfig {
  columns: CellConfig[];           // Column configuration
  initialRows?: number;            // Initial number of rows
  allowAddRows?: boolean;          // Allow adding rows
  allowDeleteRows?: boolean;       // Allow deleting rows
  validateOnBlur?: boolean;        // Validate on blur
  validateOnChange?: boolean;      // Validate on typing
  submitOnEnter?: boolean;         // Submit with Enter
}
```

### CellConfig

```tsx
interface CellConfig {
  key: string;                     // Unique column key
  type: 'text' | 'number' | 'email' | 'select';
  label?: string;                  // Header label
  required?: boolean;              // Required field
  options?: { value: any; label: string }[];  // For select type
  validation?: any;                // Yup schema
}
```

## Style Customization

The component comes with default styles that can be customized:

```css
/* Override default styles */
.form-table {
  /* Your customizations */
}

.form-table-cell.active {
  background-color: #your-blue;
}

.form-table-cell.error {
  background-color: #your-red;
}
```

### Available CSS Classes

- `.form-table` - Main container
- `.form-table-cell` - Individual cell
- `.form-table-cell.active` - Active cell
- `.form-table-cell.editing` - Cell being edited
- `.form-table-cell.error` - Cell with error
- `.form-table-cell.dirty` - Modified cell
- `.cell-error` - Error message

## Advanced API

### Hooks

```tsx
import { useFormTable, useFormTableCell } from '@dspackages/form-table';

// Main hook (use inside FormTableProvider)
const {
  data,
  updateCellValue,
  validateAll,
  addRow,
  deleteRow,
  getAllData
} = useFormTable();

// Optimized hook for individual cells
const {
  cellData,
  isActive,
  updateValue,
  startEdit,
  endEdit
} = useFormTableCell('rowId', 'cellKey');
```

### Events

```tsx
<FormTable
  config={config}
  initialData={{
    'row-1': { name: 'John', email: 'john@email.com' }
  }}
  onRowSubmit={(rowId, data) => {
    // Called when Enter is pressed
  }}
  onDataChange={(allData) => {
    // Called whenever data changes
  }}
/>
```

## Complete Example

Run the included example in the project:

```bash
git clone https://github.com/your-user/form-table
cd form-table/example-app
npm install
npm start
```

The example shows:
- Different field types
- Custom validations
- Event handling
- Data export
- Complete interface

## Development

```bash
# Clone the repository
git clone https://github.com/your-user/form-table

# Install dependencies
npm install

# Run tests
npm test

# Build for production
npm run build

# Development with watch
npm run test:watch
```

## Build and Publishing

```bash
# Build
npm run build

# Tests
npm run validate

# Automatic publishing
npm run publish:patch  # 1.0.0 -> 1.0.1
npm run publish:minor  # 1.0.0 -> 1.1.0
npm run publish:major  # 1.0.0 -> 2.0.0
```

## Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Known Issues

- React StrictMode may cause double rendering (expected)
- ESLint warnings about hook dependencies (do not affect functionality)

## Roadmap

- [ ] Support for more field types (date, checkbox, radio)
- [ ] Virtual mode for large datasets
- [ ] Drag & drop for reordering
- [ ] Excel/CSV export
- [ ] Pre-defined themes
- [ ] RTL support

## Compatibility

- React >= 16.8.0
- TypeScript >= 4.0
- Modern browsers (ES2017+)

---

Made with care by [Diego](mailto:your-email@example.com)