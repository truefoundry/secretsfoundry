# Contributing Guidelines

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

## Getting started with development

### Setup

Once you've cloned forked repository, all is needed is to run npm install at its root folder

### Running the code

- `cd secretsfoundry`
  - cd into the repository
- `npm install`
  - install dependencies
- `npm run build`
  - Build the code
- `npm run dev`
  - Run the cli locally with a command of node example.js.
    It just reads the environment variables from .env.development
    in this repository, resolves them through SecretsFoundry and
    prints them out.
- `npm run install-local`
  - Install secretsfoundry locally.
- `npm run test`
  - Launches the test runner by watch mode
- `npm run test`
  - get coverage report

## How to send a Pull Request

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement". Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (git checkout -b feature/AmazingFeature)
3. Commit your Changes (git commit -m 'Add some AmazingFeature')
4. Push to the Branch (git push origin feature/AmazingFeature)
5. Open a Pull Request
