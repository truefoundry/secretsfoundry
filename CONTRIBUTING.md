# Contributing Guidelines

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

### Bugs

If you've found a bug, create a new issue first, then submit a pull request.

If at any point you are having trouble navigating/understanding the code base, please don't hesitate to ask for help :)

### Feature Requests

If you'd like to see a certain feature in SecretsFoundry, file an issue first with request for consideration.

### Setup

Once you've cloned the repository, all that is needed is to run npm install at its root of the repository.

### Running the code

- `cd secretsfoundry`
  - cd into the repository
- `npm install`
  - install dependencies
- `npm run build`
  - Build the code
- `npm run dev`
  - Create a .env file with some params
  - Run the cli locally with a command of node example.js.
    It just reads the environment variables from .env.development
    in this repository, resolves them through SecretsFoundry and
    prints them out.
- `npm run install-local`
  - Install secretsfoundry locally.
- `npm run test`
  - Launches the test runner by watch mode
- `npm run coverage`
  - get coverage report

### How to send a Pull Request

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement". Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (git checkout -b feature/AmazingFeature)
3. Make desired changes, write tests and update the docs if needed. (Ensure correct code-style with npm run type-check)
4. Commit your Changes (git commit -m 'Add some AmazingFeature')
5. Push to the Branch (git push origin feature/AmazingFeature)
6. Open a Pull Request

### Commit message guidelines

A good commit message should describe what changed and why.

1. The first line should:

   - contain a short description of the change (preferably 50 characters or less)
   - be entirely in lowercase with the exception of proper nouns, acronyms, and
     the words that refer to code, like function/variable names
   - be prefixed with the type of the change: (chore, fix, feat, perf, refactor, test, doc, build)

   Examples:

   - `feat: add support for large trees`
   - `fix: fix error in newest chrome version`

2. Keep the second line blank.
3. A longer description of the change (if needed)

4. If your patch fixes an open issue, you can add a reference to it at the end
   of the log. Use the `Fixes:` prefix and the number of the issue. For other
   references use `Refs:`.

   Examples:

   - `Fixes: #1337`
   - `Refs: #3615`

Sample complete commit message:

```txt
type: explain the commit in one line

The body of the commit message should be one or more paragraphs, explaining
things in more detail if this is needed.

Fixes: #1337
```

If you are new to contributing to SecretsFoundry, please try to do your best at
conforming to these guidelines, but do not worry if you get something wrong.
One of the contributors will help get things situated and the
contributor landing the Pull Request will ensure that everything follows
the project guidelines. ;)

## License

By submitting a contribution to this project, you agree to allow the project
owners to license your work as part of this project under this project's MIT
[license](LICENSE).
