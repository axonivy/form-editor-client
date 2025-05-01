/* eslint-disable testing-library/no-node-access */
import { describe } from 'vitest';
import { badgeProps } from './badge-properties';
import { InputBadge } from '@axonivy/ui-components';
import { render, screen } from '@testing-library/react';

describe('createBadges', () => {
  const inputValues =
    "#{data.testData} #{logic.testLogic} #{ivy.cms.co('/Categories/agile/cssIcon')} #{el.expression} #{ivyFormDataTableHandler.currentRow.age} #{ivyFormDataTableHandler.currentRow} #{ivyFormDataTableHandler.something}";

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

    expect(testDataBadge?.querySelector('i.ivy-attribute')).toBeVisible();
    expect(logicBadge?.querySelector('i.ivy-process')).toBeVisible();
    expect(cmsBadge?.querySelector('i.ivy-cms')).toBeVisible();
    expect(expBadge?.querySelector('i.ivy-start-program')).toBeVisible();
  });

  test('test ivyFormDataTable badgeProperties', async () => {
    render(<InputBadge badgeProps={badgeProps} value={inputValues} className='badge-output' />);
    const ivyFormBadgeAge = screen.getByText('age');
    const ivyFormBadgeCurrentRow = screen.getByText('currentRow');
    const ivyFormBadgeSomething = screen.getByText('something');

    expect(ivyFormBadgeAge).toBeVisible();
    expect(ivyFormBadgeCurrentRow).toBeVisible();
    expect(ivyFormBadgeSomething).toBeVisible();

    expect(ivyFormBadgeAge).toHaveTextContent('age');
    expect(ivyFormBadgeCurrentRow).toHaveTextContent('currentRow');
    expect(ivyFormBadgeSomething).toHaveTextContent('something');

    expect(ivyFormBadgeAge.querySelector('i.ivy-attribute')).toBeVisible();
    expect(ivyFormBadgeCurrentRow.querySelector('i.ivy-attribute')).toBeVisible();
    expect(ivyFormBadgeSomething.querySelector('i.ivy-attribute')).toBeVisible();
  });
});
