# secretsfoundry

- Package to manage your environment variables and secrets

## Required

- Node.js 14+

## How to using

- Lunch commands

  - `npm start`
    - run cli
  - `npm run dev`
    - run force debug cli
  - `npm run lint`
    - run lint
  - `npm run build`
    - run tsc
      - this only development, not production
  - `npm run test`
    - Launches the test runner by watch mode
  - `npm run test`
    - get coverage report

## To test locally

`node -r ts-node/register -r tsconfig-paths/register src/index.ts run --script "node example.js"`
