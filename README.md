# SMILES CHECKOUT PORTLET

## How to run?
### npm:
- install all dependencies (`npm install`)
- be sure _gulp_ is also installed (`npm install -g gulp`)
- running as production:
  - run `npm run build` to build all assets (with minified codes)
  - run `http-server` to mock the server
- running for development:
  - run `npm run dev` - it will build all assets non-minified, create sourcemaps, watch files for automatic update and run `http-server` on its own
- access portlet at: `http://localhost:8080/`
- unit tests available at `npm run test`

### gulp:
There are a bunch of useful gulp commands as well:
- `gulp styles`: compile _.scss_ styles
- `gulp scripts`: compile javascripts (non-minified)
- `gulp build`: build system for deployment (minifying js and compiling css)
- `gulp dev-run`: compile css and, styles, watch it all for changes and runs http server
(check `gulp --tasks` for complete list)

## structure
#### layouts
For layouts and HTML handling we use handlebars.
We do manipulate handlebar and templates using a custom class: `HandlebarLoader`
To load a template, just call `new HandlebarLoader().loadTemplate(templateName, { data: 'something' }).into('#divID')`; template should be inside `src/templates` folder

#### scripts
Scripts follow ES6 patterns.
Inside `src/js`:
- **controllers** to manipulate layouts
- **services** for useful classes such as Handlebar handlers and API data gathering

Tests are ALWAYS welcome. As I know it is almost impossible to create tests for everything (although we really should do it), try to create as many as possible and, if you are working in a core functionality of the project, please, write some unit tests to cover them. =)
Mocha and Chai are the libraries used in tests. Create `*.spec.js` files to include your tests.


## changelog
#### important changes:
- replacing library `libs/adyen_gateway/addOns/adyen.cardtype.min.js` by `credit-card-type`
  - why?: Maintenance of `credit-card-type` is constant (version 8.0 updated november/2018). `adyen` node library doesn't even provide us a function for detecting credit card brand - we used a hardcoded addOn that could be already deprecated. We are still using `adyen` for credit card encryption.
