const { generateTSFiles } = require("swagger-ts-generator");
const getSwaggerObject = require("./functions/get-swagger-object");

// Ingore SSL certificate errors
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

async function generateContracts(swaggerFilePath, contractsDirectory, options = null) {
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

        if (options && options.representEnumsAsNumbers) {
            const representEnumsAsNumbers = require("./functions/represent-enums-as-numbers");
            representEnumsAsNumbers(enumsFilePath).then(() => {
                console.log("Change enums representation from string to number operation was successful!");

                if (options && options.collapseContractFiles) {
                    const collapseContractFiles = require("./functions/collapse-contract-files");
                    collapseContractFiles(contractsDirectory).then( () => {
                        console.log("Contract files are collapsed to contracts.ts file!");
                    });
                }
            });
        }
    } catch (error) {
        console.error(`[SwaggerGeneratorError]: ${error.message}!`);
    }
}

module.exports = generateContracts;
