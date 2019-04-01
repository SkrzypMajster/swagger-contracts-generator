const generateContracts = require('./index');

const swaggerFilePath = 'https://localhost:44374/swagger/v1/swagger.json';
const contractsDirectoryPath = "./src/app/contracts";

generateContracts(swaggerFilePath, contractsDirectoryPath);
