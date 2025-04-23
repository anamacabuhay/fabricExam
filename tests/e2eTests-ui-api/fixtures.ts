import { test as base } from '@playwright/test';

type AccountData = {
  accountIdInitial: string;
  accountIdSavings: string;
  accountBalInitial: string;
  accountBalSavings: string;
  username: string;
  password: string;
  transferAmount: string;
  billPayAmount: string;
};

export const test = base.extend<AccountData>({
  accountIdInitial: ['', { option: true }],
  accountIdSavings: ['', { option: true }],
  accountBalInitial: ['', { option: true }],
  accountBalSavings: ['', { option: true }],
  username: ['', { option: true }],
  password: ['', { option: true }],
  transferAmount: ['', { option: true }],
  billPayAmount: ['', { option: true }],
});

export { expect } from '@playwright/test';