# WPPConnectLoader 📞

> WPPConnectLoader is an open source project developed by the JavaScript community with the aim of exporting functions from Webpack modules

## Usage
```js
var WPPConnectLoader = require('@wppconnect-team/loader');

var loader = new WPPConnectLoader();

// Get module by id
loader.get(moduleId);

// Get module by search function
loader.searchModule(m => m.default.MyFunctionTest);

// Get module ID by search function
loader.searchModuleId(m => m.default.MyFunctionTest);

// Return a promise with resolved módule
loader.waitForModule(m => m.default.MyFunctionTest);
```
