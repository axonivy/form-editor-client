/* eslint-disable testing-library/no-node-access */
import { describe } from 'vitest';
import { badgeProps } from './badge-properties';
import { InputBadge } from '@axonivy/ui-components';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

describe('createBadges', () => {
  const inputValues = "#{data.testData} #{logic.testLogic} #{ivy.cms.co('/Categories/agile/cssIcon')} #{el.expression}";

  test('test all badgeProperties', async () => {
    render(<InputBadge badgeProps={badgeProps} value={inputValues} className='badge-output' />);
    const testDataBadge = screen.getByText('testData');
    const logicBadge = screen.getByText('testLogic');
    const cmsBadge = screen.getByText('cssIcon');
    const expBadge = screen.getByText('el.expression');

    expect(testDataBadge).toBeVisible();
    expect(logicBadge).toBeVisible();
    expect(cmsBadge).toBeVisible();
    expect(expBadge).toBeVisible();

    expect(testDataBadge).toHaveTextContent('testData');
    expect(logicBadge).toHaveTextContent('testLogic');
    expect(cmsBadge).toHaveTextContent('cssIcon');
    expect(expBadge).toHaveTextContent('el.expression');

    expect(testDataBadge.querySelector('i.ivy-attribute')).toBeVisible();
    expect(logicBadge.querySelector('i.ivy-process')).toBeVisible();
    expect(cmsBadge.querySelector('i.ivy-cms')).toBeVisible();
    expect(expBadge.querySelector('i.ivy-start-program')).toBeVisible();

    await userEvent.hover(testDataBadge);
    const tooltip = await screen.findByRole('tooltip', {}, { timeout: 700 });
    expect(tooltip).toBeVisible();
    expect(tooltip).toHaveTextContent('#{data.testData}');
  });
});
