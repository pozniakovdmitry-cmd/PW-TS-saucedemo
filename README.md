# PW-TS-saucedemo

Test automation project built with Playwright + TypeScript against [saucedemo.com](https://www.saucedemo.com).

## Stack
- Playwright + TypeScript
- Page Object Model
- GitHub Actions CI

## What's covered
- UI tests: login, inventory, cart, checkout, navigation
- API tests: jsonplaceholder
- Custom fixtures
- E2E full purchase flow

## Run locally
```bash
npm install
npx playwright install
npx playwright test
npx playwright show-report
```

## CI
Tests run automatically on every push via GitHub Actions.