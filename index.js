const { generateTSFiles } = require("swagger-ts-generator");
const getSwaggerObject = require("./functions/get-swagger-object");
// const representEnumsAsNumbers = require("./functions/represent-enums-as-numbers");
// const collapseContracts = require("./functions/collapse-contract-files");

// Ingore SSL certificate errors
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

async function generateContracts(swaggerFilePath, contractsDirectory) {
    const enumsFileName = "enums";
    const enumsFilePath = `${contractsDirectory}/${enumsFileName}.ts`;

    const generatorOptions = {
        modelFolder: contractsDirectory,
        enumTSFile: enumsFilePath,
        enumRef: `./${enumsFileName}`,
        generateClasses: false,
        generateValidatorFile: false,
        sortModelProperties: true
    };

    try {
        const swaggerObject = await getSwaggerObject(swaggerFilePath);

        generateTSFiles(swaggerObject, generatorOptions);
    } catch (error) {
        console.error(`[SwaggerGeneratorError]: ${error.message}!`);
    }
}

module.exports = generateContracts;
