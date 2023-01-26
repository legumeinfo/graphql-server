// dependencies
const { RESTDataSource } = require('apollo-datasource-rest');
const { UserInputError } = require('apollo-server');

class IntermineAPI extends RESTDataSource {

    constructor(baseURL) {
        super();
        this.baseURL = baseURL;
    }

    async pathQuery(query, options={}) {
        const params = {
            query,
            ...options,
            format: 'json',
        };
        return this.get('query/results', params);
    }

    async keywordSearch(q, options={}) {
        const params = {
            q,
            ...options,
            format: 'json',
        };
        return this.get('search', params);
    }

    async webProperties() {
        const params = {
            format: 'json',
        };
        return this.get('web-properties', params);
    }

    inputError(msg) {
        throw new UserInputError(msg);
    }

}

// add the pathquery functions to the API class
const pathquery = require('./intermine.pathquery.js');
IntermineAPI.prototype.pathquery = pathquery;

// add the models to the API class
const models = require('./models');
models.pathquery = pathquery;
IntermineAPI.prototype.models = models;

// add the API methods to the class
const apiMethods = require('./api');
for (const [key, value] of Object.entries(apiMethods)) {
    IntermineAPI.prototype[key] = value;
}


module.exports = { IntermineAPI };
