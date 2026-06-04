const { defineConfig } = require("cypress");
const commonConfigs = require('./cypress.config')

module.exports = defineConfig({
    ...commonConfigs,

    e2e: {
        ...commonConfigs.e2e,

        baseUrl: "http://localhost:5173",  //No prod YET!!!
        ApiBaseUrl: "http://localhost:3001/api",  //No prod YET!!!
        environment: "prod",
    }
});

