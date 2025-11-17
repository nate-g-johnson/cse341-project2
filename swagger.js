const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Products API',
        description: 'Products API for CSE341 Project 2'
    },
    host: 'cse341-project2-yjun.onrender.com',
    schemes: ['https']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);