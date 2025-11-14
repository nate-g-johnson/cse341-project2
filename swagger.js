const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Products API',
        description: 'Products API for CSE341 Project 2'
    },
    host: 'localhost:3000',
    schemes: ['https']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);