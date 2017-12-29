# JSON Redar

JSON Redar is a Chrome extension designed to make your JSON requests a lot simpler and easier to handle.  
If you ever got stuck looking at giant JSON arrays of objects trying to figure out relations between them, boy do we have the solution for you!

JSON Redar lets you view your results as data tables which are sortable and filterable (without making further server requests), letting you speedily read through the data to get what you want.

### How do I install?

1. Install via Chrome Web Store (TBD)

### Dependencies
These steps must be run before developing/building the extension. (installing from Chrome Web Store does not require those):

1. Install the latest Node & NPM via [https://nodejs.org](https://nodejs.org)
1. Then, run in your shell:
    ```sh
    npm install -g yarn # install yarn
    yarn install        # install dependencies
    ```

### Development
Start developing with `yarn dev` or `yarn start` (alias).  
This will build a webpack dev server for you to work on, with hot reload.

#### We are using:
- React / Flux
- TypeScript (with TSLint)
- PostCSS (with PostCSS `$variables`, and `& child` nesting)

### Building Extension
- Build the production version with `yarn build`.  
- You can load the extension into your [chrome://extensions](chrome://extensions) page to test the extension in "production" mode.  

Only small changes needed to be made to run in extension mode, mainly to move the request handling to the background page, but you should test the output to make sure everything runs smoothly.
