const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Products API',
        description: 'Products and Categories API with OAuth authentication'
    },
    host: 'cse341-project2-yjun.onrender.com',
    schemes: ['https'],
    securityDefinitions: {
        oauth2: {
            type: 'oauth2',
            authorizationUrl: 'https://cse341-project2-yjun.onrender.com/auth/github',
            flow: 'implicit',
            scopes: {}
        }
    }
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);