import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as yup from 'yup';
import { EditableCell } from '../EditableCell';
import { FormTableProvider } from '@dspackages/form-table';
import { Column, FormSchemas, FormSubmitHandlers } from '@dspackages/form-table';

const testColumns: Column[] = [
  { formId: 'test', field: 'name', label: 'Name', type: 'text', placeholder: 'Enter name' },
  { formId: 'test', field: 'age', label: 'Age', type: 'number', placeholder: '0' },
  { formId: 'test', field: 'email', label: 'Email', type: 'email', placeholder: 'email@example.com' },
  { formId: 'test', field: 'country', label: 'Country', type: 'select', options: [
    { value: 'br', label: 'Brazil' },
    { value: 'us', label: 'United States' },
  ]},
];

const testInitialData = {
  test: {
    name: 'John',
    age: 30,
    email: 'john@test.com',
    country: 'br',
  },
};

const testSchemas: FormSchemas = {
  test: yup.object().shape({
    name: yup.string().required('Name is required').min(2, 'Min 2 chars'),
    age: yup.number().min(1, 'Min 1').required('Age is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    country: yup.string().required('Country is required'),
  }),
};

interface TestWrapperProps {
  children: React.ReactNode;
  columns?: Column[];
  initialData?: Record<string, Record<string, any>>;
  schemas?: FormSchemas;
  onSubmit?: FormSubmitHandlers;
  debounceMs?: number;
}

const TestWrapper: React.FC<TestWrapperProps> = ({
  children,
  columns = testColumns,
  initialData = testInitialData,
  schemas = testSchemas,
  onSubmit = {},
  debounceMs = 100
}) => (
  <FormTableProvider
    columns={columns}
    initialData={initialData}
    schemas={schemas}
    onSubmit={onSubmit}
    debounceMs={debounceMs}
  >
    <div className="test-table-row">{children}</div>
  </FormTableProvider>
);

describe('EditableCell', () => {
  describe('Rendering', () => {
    it('should render text input', () => {
      render(
        <TestWrapper>
          <EditableCell formId="test" field="name" type="text" placeholder="Enter name" />
        </TestWrapper>
      );

      const input = screen.getByPlaceholderText('Enter name');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'text');
    });

    it('should render number input', () => {
      render(
        <TestWrapper>
          <EditableCell formId="test" field="age" type="number" placeholder="0" />
        </TestWrapper>
      );

      const input = screen.getByPlaceholderText('0');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'number');
    });

    it('should render email input', () => {
      render(
        <TestWrapper>
          <EditableCell formId="test" field="email" type="email" placeholder="email@example.com" />
        </TestWrapper>
      );

      const input = screen.getByPlaceholderText('email@example.com');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'email');
    });

    it('should render select with options', () => {
      render(
        <TestWrapper>
          <EditableCell
            formId="test"
            field="country"
            type="select"
            placeholder="Select country"
            options={[
              { value: 'br', label: 'Brazil' },
              { value: 'us', label: 'United States' },
            ]}
          />
        </TestWrapper>
      );

      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
      expect(screen.getByText('Brazil')).toBeInTheDocument();
      expect(screen.getByText('United States')).toBeInTheDocument();
    });

    it('should render initial value', () => {
      render(
        <TestWrapper>
          <EditableCell formId="test" field="name" type="text" />
        </TestWrapper>
      );

      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('John');
    });

    it('should render with is-active class when focused', () => {
      render(
        <TestWrapper>
          <EditableCell formId="test" field="name" type="text" />
        </TestWrapper>
      );

      const cell = document.querySelector('.editable-cell');
      expect(cell).not.toHaveClass('is-active');

      fireEvent.focus(screen.getByRole('textbox'));

      expect(cell).toHaveClass('is-active');
    });

    it('should have data-formid and data-instanceid attributes', () => {
      render(
        <TestWrapper>
          <EditableCell formId="test" field="name" type="text" />
        </TestWrapper>
      );

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('data-formid', 'test');
      expect(input.dataset.instanceid).toBeDefined();
    });
  });

  describe('Value Changes', () => {
    it('should update text value on change', () => {
      render(
        <TestWrapper>
          <EditableCell formId="test" field="name" type="text" />
        </TestWrapper>
      );

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'Jane' } });

      expect(input).toHaveValue('Jane');
    });

    it('should update number value on change', () => {
      render(
        <TestWrapper>
          <EditableCell formId="test" field="age" type="number" />
        </TestWrapper>
      );

      const input = screen.getByRole('spinbutton');
      fireEvent.change(input, { target: { value: '25' } });

      expect(input).toHaveValue(25);
    });

    it('should handle empty number value', () => {
      render(
        <TestWrapper>
          <EditableCell formId="test" field="age" type="number" />
        </TestWrapper>
      );

      const input = screen.getByRole('spinbutton');
      fireEvent.change(input, { target: { value: '' } });

      expect(input).toHaveValue(null);
    });

    it('should update select value on change', () => {
      render(
        <TestWrapper>
          <EditableCell
            formId="test"
            field="country"
            type="select"
            options={[
              { value: 'br', label: 'Brazil' },
              { value: 'us', label: 'United States' },
            ]}
          />
        </TestWrapper>
      );

      const select = screen.getByRole('combobox');
      fireEvent.change(select, { target: { value: 'us' } });

      expect(select).toHaveValue('us');
    });
  });

  describe('Keyboard Navigation', () => {
    it('should navigate to next field on Tab', async () => {
      render(
        <TestWrapper debounceMs={0}>
          <EditableCell formId="test" field="name" type="text" />
          <EditableCell formId="test" field="age" type="number" />
        </TestWrapper>
      );

      const nameInput = screen.getAllByRole('textbox')[0] || screen.getByDisplayValue('John');
      fireEvent.focus(nameInput);

      await act(async () => {
        fireEvent.keyDown(nameInput, { key: 'Tab' });
        await new Promise(resolve => setTimeout(resolve, 50));
      });

      const ageInput = screen.getByRole('spinbutton');
      expect(document.activeElement).toBe(ageInput);
    });

    it('should navigate to previous field on Shift+Tab', async () => {
      render(
        <TestWrapper debounceMs={0}>
          <EditableCell formId="test" field="name" type="text" />
          <EditableCell formId="test" field="age" type="number" />
        </TestWrapper>
      );

      const ageInput = screen.getByRole('spinbutton');
      fireEvent.focus(ageInput);

      await act(async () => {
        fireEvent.keyDown(ageInput, { key: 'Tab', shiftKey: true });
        await new Promise(resolve => setTimeout(resolve, 50));
      });

      const nameInput = screen.getByDisplayValue('John');
      expect(document.activeElement).toBe(nameInput);
    });

    it('should navigate to next field on Enter when not complete', async () => {
      render(
        <TestWrapper debounceMs={0}>
          <EditableCell formId="test" field="name" type="text" />
          <EditableCell formId="test" field="age" type="number" />
        </TestWrapper>
      );

      const nameInput = screen.getByDisplayValue('John');
      fireEvent.focus(nameInput);

      await act(async () => {
        fireEvent.keyDown(nameInput, { key: 'Enter' });
        await new Promise(resolve => setTimeout(resolve, 50));
      });

      const ageInput = screen.getByRole('spinbutton');
      expect(document.activeElement).toBe(ageInput);
    });

    it('should submit on Enter when all fields visited', async () => {
      const onSubmit = vi.fn();
      const twoFieldColumns: Column[] = [
        { formId: 'test', field: 'name', label: 'Name', type: 'text' },
        { formId: 'test', field: 'age', label: 'Age', type: 'number' },
      ];

      render(
        <TestWrapper columns={twoFieldColumns} onSubmit={{ test: onSubmit }} debounceMs={0}>
          <EditableCell formId="test" field="name" type="text" />
          <EditableCell formId="test" field="age" type="number" />
        </TestWrapper>
      );

      const nameInput = screen.getByDisplayValue('John');
      fireEvent.focus(nameInput);

      await act(async () => {
        fireEvent.keyDown(nameInput, { key: 'Enter' });
        await new Promise(resolve => setTimeout(resolve, 50));
      });

      const ageInput = screen.getByRole('spinbutton');
      fireEvent.focus(ageInput);

      await act(async () => {
        fireEvent.keyDown(ageInput, { key: 'Enter' });
        await new Promise(resolve => setTimeout(resolve, 50));
      });

      expect(onSubmit).toHaveBeenCalled();
    });

    it('should reset form on Escape', () => {
      render(
        <TestWrapper>
          <EditableCell formId="test" field="name" type="text" />
        </TestWrapper>
      );

      const input = screen.getByDisplayValue('John');
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: 'Changed' } });

      expect(input).toHaveValue('Changed');

      fireEvent.keyDown(input, { key: 'Escape' });

      expect(input).toHaveValue('John');
    });

    it('should blur input on Escape', () => {
      render(
        <TestWrapper>
          <EditableCell formId="test" field="name" type="text" />
        </TestWrapper>
      );

      const input = screen.getByDisplayValue('John');
      fireEvent.focus(input);

      expect(document.activeElement).toBe(input);

      fireEvent.keyDown(input, { key: 'Escape' });

      expect(document.activeElement).not.toBe(input);
    });
  });

  describe('Blur Behavior', () => {
    it('should reset form when blur to element outside form', () => {
      render(
        <div>
          <TestWrapper>
            <EditableCell formId="test" field="name" type="text" />
          </TestWrapper>
          <button data-testid="outside-button">Outside</button>
        </div>
      );

      const input = screen.getByDisplayValue('John');
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: 'Changed' } });

      expect(input).toHaveValue('Changed');

      fireEvent.blur(input, { relatedTarget: screen.getByTestId('outside-button') });

      expect(input).toHaveValue('John');
    });

    it('should not reset when blur to same form field', () => {
      render(
        <TestWrapper>
          <EditableCell formId="test" field="name" type="text" />
          <EditableCell formId="test" field="age" type="number" />
        </TestWrapper>
      );

      const nameInput = screen.getByDisplayValue('John');
      const ageInput = screen.getByRole('spinbutton');

      fireEvent.focus(nameInput);
      fireEvent.change(nameInput, { target: { value: 'Changed' } });

      fireEvent.blur(nameInput, { relatedTarget: ageInput });

      expect(nameInput).toHaveValue('Changed');
    });

    it('should reset when blur to different formId', () => {
      const multiColumns: Column[] = [
        { formId: 'form1', field: 'name', label: 'Name', type: 'text' },
        { formId: 'form2', field: 'name', label: 'Name', type: 'text' },
      ];

      const multiInitialData = {
        form1: { name: 'John' },
        form2: { name: 'Jane' },
      };

      const multiSchemas: FormSchemas = {
        form1: yup.object().shape({ name: yup.string().required() }),
        form2: yup.object().shape({ name: yup.string().required() }),
      };

      render(
        <FormTableProvider
          columns={multiColumns}
          initialData={multiInitialData}
          schemas={multiSchemas}
          onSubmit={{}}
          debounceMs={100}
        >
          <table>
            <tbody>
              <tr>
                <EditableCell formId="form1" field="name" type="text" />
                <EditableCell formId="form2" field="name" type="text" />
              </tr>
            </tbody>
          </table>
        </FormTableProvider>
      );

      const inputs = screen.getAllByRole('textbox');
      const form1Input = inputs[0];
      const form2Input = inputs[1];

      fireEvent.focus(form1Input);
      fireEvent.change(form1Input, { target: { value: 'Changed' } });

      expect(form1Input).toHaveValue('Changed');

      fireEvent.blur(form1Input, { relatedTarget: form2Input });

      expect(form1Input).toHaveValue('John');
    });
  });

  describe('Validation Display', () => {
    it('should show error message after validation fails', async () => {
      vi.useFakeTimers();
      render(
        <TestWrapper debounceMs={100}>
          <EditableCell formId="test" field="name" type="text" />
        </TestWrapper>
      );

      const input = screen.getByDisplayValue('John');
      fireEvent.change(input, { target: { value: 'A' } });

      expect(screen.queryByText('Min 2 chars')).not.toBeInTheDocument();

      await act(async () => {
        vi.advanceTimersByTime(150);
      });

      expect(screen.getByText('Min 2 chars')).toBeInTheDocument();
      vi.useRealTimers();
    });

    it('should add has-error class when error exists', async () => {
      vi.useFakeTimers();
      render(
        <TestWrapper debounceMs={100}>
          <EditableCell formId="test" field="name" type="text" />
        </TestWrapper>
      );

      const cell = document.querySelector('.editable-cell');
      const input = screen.getByDisplayValue('John');

      expect(cell).not.toHaveClass('has-error');

      fireEvent.change(input, { target: { value: 'A' } });

      await act(async () => {
        vi.advanceTimersByTime(150);
      });

      expect(cell).toHaveClass('has-error');
      vi.useRealTimers();
    });
  });

  describe('Select Component', () => {
    it('should render placeholder option', () => {
      render(
        <TestWrapper initialData={{ test: { ...testInitialData.test, country: '' } }}>
          <EditableCell
            formId="test"
            field="country"
            type="select"
            placeholder="Choose a country"
            options={[
              { value: 'br', label: 'Brazil' },
              { value: 'us', label: 'United States' },
            ]}
          />
        </TestWrapper>
      );

      expect(screen.getByText('Choose a country')).toBeInTheDocument();
    });

    it('should use default placeholder when not provided', () => {
      render(
        <TestWrapper initialData={{ test: { ...testInitialData.test, country: '' } }}>
          <EditableCell
            formId="test"
            field="country"
            type="select"
            options={[
              { value: 'br', label: 'Brazil' },
            ]}
          />
        </TestWrapper>
      );

      expect(screen.getByText('Select...')).toBeInTheDocument();
    });

    it('should handle keyboard navigation in select', async () => {
      render(
        <TestWrapper debounceMs={0}>
          <EditableCell formId="test" field="name" type="text" />
          <EditableCell
            formId="test"
            field="country"
            type="select"
            options={[
              { value: 'br', label: 'Brazil' },
              { value: 'us', label: 'United States' },
            ]}
          />
        </TestWrapper>
      );

      const select = screen.getByRole('combobox');
      fireEvent.focus(select);

      await act(async () => {
        fireEvent.keyDown(select, { key: 'Tab' });
        await new Promise(resolve => setTimeout(resolve, 50));
      });

      expect(document.activeElement).toBe(screen.getByDisplayValue('John'));
    });

    it('should reset select on Escape', () => {
      render(
        <TestWrapper>
          <EditableCell
            formId="test"
            field="country"
            type="select"
            options={[
              { value: 'br', label: 'Brazil' },
              { value: 'us', label: 'United States' },
            ]}
          />
        </TestWrapper>
      );

      const select = screen.getByRole('combobox');
      fireEvent.focus(select);
      fireEvent.change(select, { target: { value: 'us' } });

      expect(select).toHaveValue('us');

      fireEvent.keyDown(select, { key: 'Escape' });

      expect(select).toHaveValue('br');
    });
  });
});
