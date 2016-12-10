# Contributing to the Project

Pull Requests are always welcome. In order to eliminate duplication or loss of efforts it is advisable to first open an issue and communicate your intentions to the project maintainers.

When you do submit a Pull Request please make sure to update the files `CHANGELOG.md` and the `README.md` (section #Release History).

## Style Guide

The project adheres to a specific set of styling rules and guidelines.

* [The Javascript Style Guide](https://github.com/thanpolas/Practice/blob/master/Javascript-Style-Guide.md) Based on [AirBnB's style guide](https://github.com/airbnb/javascript). Applies to both front and back end codebases.
* [The Node.js Style Guide](https://github.com/thanpolas/Practice/blob/master/Node.js.md) which apply to both the back and front end since we use [Browserify](http://browserify.org/) as our dependency manager for the frontend application. Take special notice of the [Document Blocks section](https://github.com/thanpolas/Practice/blob/master/Node.js.md#docblocks).
* It is advisable that you [install a Live Linter and Editor Config](https://github.com/thanpolas/Practice#tldr-install-live-linter-and-editor-config) on your editor to help you with catching styling and linting issues early on.

## Frontend Third Party Dependencies

### Browserify

For the browserify frontend applications the sequence of preference for requiring Third-Party libraries is:

1. **NPM**: Just use the `package.json` file to declare any dependencies available through NPM.
1. **napa**: The [napa package](https://github.com/shama/napa) is a helper for installing repos without a package.json with NPM.
1. **Bower** Bower, the known package manager.
1. **Asset** Keep Third Party lib as a tracked file inside the repository.


### Styles

For Third Party style requirements (e.g. Bootstrap) use **Bower**.

