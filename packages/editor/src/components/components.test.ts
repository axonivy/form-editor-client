import { CheckboxComponent } from './blocks/checkbox/Checkbox';
import { DatePickerComponent } from './blocks/datepicker/DatePicker';
import { InputComponent } from './blocks/input/Input';
import { allComponentsByCategory, componentByName, componentForType, componentsByCategory } from './components';

test('componentByName', () => {
  expect(componentByName('unknown')).toEqual(undefined);
  expect(componentByName('Input')).toEqual(InputComponent);
});

test('componentByCategory', () => {
  const result = componentsByCategory('Elements');
  expect(result.General).toEqual(undefined);
  expect(result.Input).toHaveLength(5);
  expect(result.Selection).toHaveLength(3);
  expect(result.Text).toHaveLength(1);
  const resultHidden = componentsByCategory('Hidden');
  expect(resultHidden.Input).toHaveLength(1);
});

test('allComponentsByCategory', () => {
  const result = allComponentsByCategory();
  expect(result.Action).toHaveLength(2);
  expect(result.Elements).toHaveLength(9);
  expect(result.Structure).toHaveLength(3);
});

test('componentForType', () => {
  expect(componentForType('String')).toEqual({ component: InputComponent });
  expect(componentForType('Number')).toEqual({ component: InputComponent, defaultProps: { type: 'NUMBER' } });
  expect(componentForType('Boolean')).toEqual({ component: CheckboxComponent });
  expect(componentForType('Date')).toEqual({ component: DatePickerComponent });
  expect(componentForType('DateTime')).toEqual({ component: DatePickerComponent });
  expect(componentForType('java.util.Date')).toEqual({ component: DatePickerComponent });
  expect(componentForType('Time')).toEqual(undefined);
  expect(componentForType('File')).toEqual(undefined);
});
