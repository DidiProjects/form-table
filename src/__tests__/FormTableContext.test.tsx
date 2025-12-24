import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import * as yup from 'yup';
import {
  FormTableProvider,
  useFormTable,
  useSelectorContext,
  useNavigation,
  useField
} from '../context/FormTableContext';
import { Column, FormSchemas, FormSubmitHandlers } from '../types';

const testColumns: Column[] = [
  { formId: 'test', field: 'name', label: 'Name', type: 'text' },
  { formId: 'test', field: 'email', label: 'Email', type: 'email' },
];

const testInitialData = {
  test: {
    name: 'John',
    email: 'john@test.com',
  },
};

const testSchemas: FormSchemas = {
  test: yup.object().shape({
    name: yup.string().required('Name is required').min(2, 'Min 2 chars'),
    email: yup.string().email('Invalid email').required('Email is required'),
  }),
};

const TestFieldComponent: React.FC<{ formId: string; field: string }> = ({ formId, field }) => {
  const {
    value,
    error,
    setValue,
    isActive,
    setActive,
    nextField,
    previousField,
    submit,
    resetForm,
    willComplete,
    markVisited,
    instanceId
  } = useField(formId, field);

  return (
    <div data-testid={`field-${formId}-${field}`}>
      <input
        data-testid={`input-${formId}-${field}`}
        data-instanceid={instanceId}
        data-formid={formId}
        value={value ?? ''}
        onChange={(e) => setValue(e.target.value)}
        onFocus={setActive}
      />
      <span data-testid={`error-${formId}-${field}`}>{error}</span>
      <span data-testid={`active-${formId}-${field}`}>{isActive ? 'active' : 'inactive'}</span>
      <span data-testid={`willComplete-${formId}-${field}`}>{willComplete ? 'yes' : 'no'}</span>
      <button data-testid={`next-${formId}-${field}`} onClick={nextField}>Next</button>
      <button data-testid={`prev-${formId}-${field}`} onClick={previousField}>Prev</button>
      <button data-testid={`submit-${formId}-${field}`} onClick={submit}>Submit</button>
      <button data-testid={`reset-${formId}-${field}`} onClick={resetForm}>Reset</button>
      <button data-testid={`markVisited-${formId}-${field}`} onClick={markVisited}>Mark Visited</button>
    </div>
  );
};

const TestNavigationComponent: React.FC = () => {
  const { activeField, fields, reset } = useNavigation();

  return (
    <div data-testid="navigation">
      <span data-testid="activeField">{activeField ?? 'none'}</span>
      <span data-testid="fields">{fields.join(',')}</span>
      <button data-testid="reset-all" onClick={() => reset()}>Reset All</button>
    </div>
  );
};

const TestFormTableComponent: React.FC = () => {
  const { state, setValue } = useFormTable();

  return (
    <div data-testid="formtable-state">
      <span data-testid="state-json">{JSON.stringify(state)}</span>
      <button data-testid="set-name" onClick={() => setValue('test', 'name', 'New Name')}>Set Name</button>
    </div>
  );
};

const TestSelectorComponent: React.FC = () => {
  const nameValue = useSelectorContext((state) => state.test?.name?.value);

  return (
    <div data-testid="selector">
      <span data-testid="selected-name">{nameValue}</span>
    </div>
  );
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
    {children}
  </FormTableProvider>
);

describe('FormTableContext', () => {
  describe('FormTableProvider', () => {
    it('should render children', () => {
      render(
        <TestWrapper>
          <div data-testid="child">Child Content</div>
        </TestWrapper>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('should initialize state with initialData', () => {
      render(
        <TestWrapper>
          <TestFormTableComponent />
        </TestWrapper>
      );

      const stateJson = screen.getByTestId('state-json').textContent;
      const state = JSON.parse(stateJson!);

      expect(state.test.name.value).toBe('John');
      expect(state.test.email.value).toBe('john@test.com');
    });
  });

  describe('useFormTable', () => {
    it('should return state and setValue', () => {
      render(
        <TestWrapper>
          <TestFormTableComponent />
        </TestWrapper>
      );

      expect(screen.getByTestId('state-json')).toBeInTheDocument();
      expect(screen.getByTestId('set-name')).toBeInTheDocument();
    });

    it('should update state when setValue is called', async () => {
      render(
        <TestWrapper>
          <TestFormTableComponent />
        </TestWrapper>
      );

      fireEvent.click(screen.getByTestId('set-name'));

      const stateJson = screen.getByTestId('state-json').textContent;
      const state = JSON.parse(stateJson!);

      expect(state.test.name.value).toBe('New Name');
    });
  });

  describe('useSelectorContext', () => {
    it('should select specific value from state', () => {
      render(
        <TestWrapper>
          <TestSelectorComponent />
        </TestWrapper>
      );

      expect(screen.getByTestId('selected-name').textContent).toBe('John');
    });

    it('should update when selected value changes', () => {
      render(
        <TestWrapper>
          <TestSelectorComponent />
          <TestFormTableComponent />
        </TestWrapper>
      );

      expect(screen.getByTestId('selected-name').textContent).toBe('John');

      fireEvent.click(screen.getByTestId('set-name'));

      expect(screen.getByTestId('selected-name').textContent).toBe('New Name');
    });
  });

  describe('useNavigation', () => {
    it('should return navigation state', () => {
      render(
        <TestWrapper>
          <TestNavigationComponent />
        </TestWrapper>
      );

      expect(screen.getByTestId('activeField').textContent).toBe('none');
      expect(screen.getByTestId('fields').textContent).toBe('test.name,test.email');
    });

    it('should reset all forms when reset is called without formId', () => {
      render(
        <TestWrapper>
          <TestNavigationComponent />
          <TestFieldComponent formId="test" field="name" />
        </TestWrapper>
      );

      fireEvent.change(screen.getByTestId('input-test-name'), { target: { value: 'Changed' } });
      
      const stateBeforeReset = screen.getByTestId('input-test-name') as HTMLInputElement;
      expect(stateBeforeReset.value).toBe('Changed');

      fireEvent.click(screen.getByTestId('reset-all'));

      const stateAfterReset = screen.getByTestId('input-test-name') as HTMLInputElement;
      expect(stateAfterReset.value).toBe('John');
    });
  });

  describe('useField', () => {
    it('should return field value and error', () => {
      render(
        <TestWrapper>
          <TestFieldComponent formId="test" field="name" />
        </TestWrapper>
      );

      const input = screen.getByTestId('input-test-name') as HTMLInputElement;
      expect(input.value).toBe('John');
    });

    it('should update value when input changes', () => {
      render(
        <TestWrapper>
          <TestFieldComponent formId="test" field="name" />
        </TestWrapper>
      );

      const input = screen.getByTestId('input-test-name');
      fireEvent.change(input, { target: { value: 'Jane' } });

      expect((input as HTMLInputElement).value).toBe('Jane');
    });

    it('should set active state when setActive is called', () => {
      render(
        <TestWrapper>
          <TestFieldComponent formId="test" field="name" />
        </TestWrapper>
      );

      expect(screen.getByTestId('active-test-name').textContent).toBe('inactive');

      fireEvent.focus(screen.getByTestId('input-test-name'));

      expect(screen.getByTestId('active-test-name').textContent).toBe('active');
    });

    it('should navigate to next field when nextField is called', async () => {
      render(
        <TestWrapper debounceMs={0}>
          <TestFieldComponent formId="test" field="name" />
          <TestFieldComponent formId="test" field="email" />
          <TestNavigationComponent />
        </TestWrapper>
      );

      fireEvent.focus(screen.getByTestId('input-test-name'));
      expect(screen.getByTestId('activeField').textContent).toBe('test.name');

      await act(async () => {
        fireEvent.click(screen.getByTestId('next-test-name'));
        await new Promise(resolve => setTimeout(resolve, 50));
      });

      expect(screen.getByTestId('activeField').textContent).toBe('test.email');
    });

    it('should navigate to previous field when previousField is called', async () => {
      render(
        <TestWrapper debounceMs={0}>
          <TestFieldComponent formId="test" field="name" />
          <TestFieldComponent formId="test" field="email" />
          <TestNavigationComponent />
        </TestWrapper>
      );

      fireEvent.focus(screen.getByTestId('input-test-email'));
      expect(screen.getByTestId('activeField').textContent).toBe('test.email');

      await act(async () => {
        fireEvent.click(screen.getByTestId('prev-test-email'));
        await new Promise(resolve => setTimeout(resolve, 50));
      });

      expect(screen.getByTestId('activeField').textContent).toBe('test.name');
    });

    it('should reset form when resetForm is called', () => {
      render(
        <TestWrapper>
          <TestFieldComponent formId="test" field="name" />
        </TestWrapper>
      );

      const input = screen.getByTestId('input-test-name');
      fireEvent.change(input, { target: { value: 'Changed Name' } });
      expect((input as HTMLInputElement).value).toBe('Changed Name');

      fireEvent.click(screen.getByTestId('reset-test-name'));

      expect((input as HTMLInputElement).value).toBe('John');
    });

    it('should track visited fields correctly', () => {
      render(
        <TestWrapper>
          <TestFieldComponent formId="test" field="name" />
          <TestFieldComponent formId="test" field="email" />
        </TestWrapper>
      );

      expect(screen.getByTestId('willComplete-test-name').textContent).toBe('no');
      expect(screen.getByTestId('willComplete-test-email').textContent).toBe('no');

      fireEvent.click(screen.getByTestId('markVisited-test-name'));

      expect(screen.getByTestId('willComplete-test-email').textContent).toBe('yes');
    });

    it('should return instanceId', () => {
      render(
        <TestWrapper>
          <TestFieldComponent formId="test" field="name" />
        </TestWrapper>
      );

      const input = screen.getByTestId('input-test-name');
      expect(input.dataset.instanceid).toBeDefined();
      expect(input.dataset.instanceid!.length).toBeGreaterThan(0);
    });
  });

  describe('Validation', () => {
    it('should validate field after debounce', async () => {
      vi.useFakeTimers();
      render(
        <TestWrapper debounceMs={100}>
          <TestFieldComponent formId="test" field="name" />
        </TestWrapper>
      );

      const input = screen.getByTestId('input-test-name');
      fireEvent.change(input, { target: { value: 'A' } });

      expect(screen.getByTestId('error-test-name').textContent).toBe('');

      await act(async () => {
        vi.advanceTimersByTime(150);
      });

      expect(screen.getByTestId('error-test-name').textContent).toBe('Min 2 chars');
      vi.useRealTimers();
    });

    it('should clear error when value becomes valid', async () => {
      vi.useFakeTimers();
      render(
        <TestWrapper debounceMs={100}>
          <TestFieldComponent formId="test" field="name" />
        </TestWrapper>
      );

      const input = screen.getByTestId('input-test-name');
      
      fireEvent.change(input, { target: { value: 'A' } });
      await act(async () => {
        vi.advanceTimersByTime(150);
      });

      expect(screen.getByTestId('error-test-name').textContent).toBe('Min 2 chars');

      fireEvent.change(input, { target: { value: 'Valid Name' } });
      await act(async () => {
        vi.advanceTimersByTime(150);
      });

      expect(screen.getByTestId('error-test-name').textContent).toBe('');
      vi.useRealTimers();
    });

    it('should not navigate to next field if validation fails', async () => {
      render(
        <TestWrapper debounceMs={0}>
          <TestFieldComponent formId="test" field="name" />
          <TestFieldComponent formId="test" field="email" />
          <TestNavigationComponent />
        </TestWrapper>
      );

      fireEvent.focus(screen.getByTestId('input-test-name'));
      fireEvent.change(screen.getByTestId('input-test-name'), { target: { value: '' } });

      await act(async () => {
        fireEvent.click(screen.getByTestId('next-test-name'));
        await new Promise(resolve => setTimeout(resolve, 50));
      });

      expect(screen.getByTestId('activeField').textContent).toBe('test.name');
    });
  });

  describe('Submit', () => {
    it('should call onSubmit handler when submit is triggered', async () => {
      const onSubmit = vi.fn();

      render(
        <TestWrapper onSubmit={{ test: onSubmit }} debounceMs={0}>
          <TestFieldComponent formId="test" field="name" />
          <TestFieldComponent formId="test" field="email" />
        </TestWrapper>
      );

      fireEvent.focus(screen.getByTestId('input-test-name'));

      await act(async () => {
        fireEvent.click(screen.getByTestId('submit-test-name'));
        await new Promise(resolve => setTimeout(resolve, 50));
      });

      expect(onSubmit).toHaveBeenCalledWith({
        name: 'John',
        email: 'john@test.com'
      });
    });

    it('should not submit if validation fails', async () => {
      const onSubmit = vi.fn();

      render(
        <TestWrapper onSubmit={{ test: onSubmit }}>
          <TestFieldComponent formId="test" field="name" />
          <TestFieldComponent formId="test" field="email" />
        </TestWrapper>
      );

      fireEvent.focus(screen.getByTestId('input-test-name'));
      fireEvent.change(screen.getByTestId('input-test-name'), { target: { value: '' } });

      await act(async () => {
        fireEvent.click(screen.getByTestId('submit-test-name'));
      });

      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  describe('Multiple Forms', () => {
    const multiFormColumns: Column[] = [
      { formId: 'buy', field: 'quantity', label: 'Buy Qty', type: 'number' },
      { formId: 'buy', field: 'price', label: 'Buy Price', type: 'number' },
      { formId: 'sell', field: 'quantity', label: 'Sell Qty', type: 'number' },
      { formId: 'sell', field: 'price', label: 'Sell Price', type: 'number' },
    ];

    const multiFormInitialData = {
      buy: { quantity: 100, price: 10.5 },
      sell: { quantity: 50, price: 11.0 },
    };

    const multiFormSchemas: FormSchemas = {
      buy: yup.object().shape({
        quantity: yup.number().min(1).required(),
        price: yup.number().min(0.01).required(),
      }),
      sell: yup.object().shape({
        quantity: yup.number().min(1).required(),
        price: yup.number().min(0.01).required(),
      }),
    };

    it('should handle multiple forms independently', () => {
      render(
        <TestWrapper
          columns={multiFormColumns}
          initialData={multiFormInitialData}
          schemas={multiFormSchemas}
        >
          <TestFieldComponent formId="buy" field="quantity" />
          <TestFieldComponent formId="sell" field="quantity" />
        </TestWrapper>
      );

      const buyInput = screen.getByTestId('input-buy-quantity') as HTMLInputElement;
      const sellInput = screen.getByTestId('input-sell-quantity') as HTMLInputElement;

      expect(buyInput.value).toBe('100');
      expect(sellInput.value).toBe('50');

      fireEvent.change(buyInput, { target: { value: '200' } });

      expect(buyInput.value).toBe('200');
      expect(sellInput.value).toBe('50');
    });

    it('should reset only specific form', () => {
      render(
        <TestWrapper
          columns={multiFormColumns}
          initialData={multiFormInitialData}
          schemas={multiFormSchemas}
        >
          <TestFieldComponent formId="buy" field="quantity" />
          <TestFieldComponent formId="sell" field="quantity" />
        </TestWrapper>
      );

      const buyInput = screen.getByTestId('input-buy-quantity') as HTMLInputElement;
      const sellInput = screen.getByTestId('input-sell-quantity') as HTMLInputElement;

      fireEvent.change(buyInput, { target: { value: '200' } });
      fireEvent.change(sellInput, { target: { value: '75' } });

      fireEvent.click(screen.getByTestId('reset-buy-quantity'));

      expect(buyInput.value).toBe('100');
      expect(sellInput.value).toBe('75');
    });

    it('should navigate only within same formId', async () => {
      render(
        <TestWrapper
          columns={multiFormColumns}
          initialData={multiFormInitialData}
          schemas={multiFormSchemas}
          debounceMs={0}
        >
          <TestFieldComponent formId="buy" field="quantity" />
          <TestFieldComponent formId="buy" field="price" />
          <TestFieldComponent formId="sell" field="quantity" />
          <TestNavigationComponent />
        </TestWrapper>
      );

      fireEvent.focus(screen.getByTestId('input-buy-quantity'));
      
      await act(async () => {
        fireEvent.click(screen.getByTestId('next-buy-quantity'));
        await new Promise(resolve => setTimeout(resolve, 50));
      });

      expect(screen.getByTestId('activeField').textContent).toBe('buy.price');

      await act(async () => {
        fireEvent.click(screen.getByTestId('next-buy-price'));
        await new Promise(resolve => setTimeout(resolve, 50));
      });

      expect(screen.getByTestId('activeField').textContent).toBe('buy.quantity');
    });
  });
});
