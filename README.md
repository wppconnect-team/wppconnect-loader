# WPPConnectLoader 📞

> WPPConnectLoader is an open source project developed by the JavaScript community with the aim of exporting functions from Webpack modules

## Our online channels

[![Discord](https://img.shields.io/discord/844351092758413353?color=blueviolet&label=Discord&logo=discord&style=flat)](https://discord.gg/JU5JGGKGNG)
[![Telegram Group](https://img.shields.io/badge/Telegram-Group-32AFED?logo=telegram)](https://t.me/wppconnect)
[![WhatsApp Group](https://img.shields.io/badge/WhatsApp-Group-25D366?logo=whatsapp)](https://chat.whatsapp.com/C1ChjyShl5cA7KvmtecF3L)
[![YouTube](https://img.shields.io/youtube/channel/subscribers/UCD7J9LG08PmGQrF5IS7Yv9A?label=YouTube)](https://www.youtube.com/c/wppconnect)

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
